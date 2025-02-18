const { ApiKey } = require("../models/apiKeys");
const { Document } = require("../models/documents");
const { EventLogs } = require("../models/eventLogs");
const { Invite } = require("../models/invite");
const { SystemSettings } = require("../models/systemSettings");
const { Telemetry } = require("../models/telemetry");
const { User } = require("../models/user");
const { DocumentVectors } = require("../models/vectors");
const { Workspace } = require("../models/workspace");
const { WorkspaceChats } = require("../models/workspaceChats");
const {
  getVectorDbClass,
  getEmbeddingEngineSelection,
} = require("../utils/helpers");
const {
  validRoleSelection,
  canModifyAdmin,
  validCanModify,
} = require("../utils/helpers/admin");
const { reqBody, userFromSession, safeJsonParse } = require("../utils/http");
const {
  strictMultiUserRoleValid,
  flexUserRoleValid,
  ROLES,
} = require("../utils/middleware/multiUserProtected");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const ImportedPlugin = require("../utils/agents/imported");

function adminEndpoints(app) {
  if (!app) return;

  // 获取所有用户列表
  // 路由: GET /admin/users
  // 权限要求: 仅管理员可访问
  // 功能: 返回系统中所有用户的信息
  app.get(
    "/admin/users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const users = await User.where();
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 创建新用户
  // 路由: POST /admin/users/new
  // 权限要求: 管理员和经理可访问
  // 功能: 
  // 1. 验证当前用户是否有权限创建指定角色的新用户
  // 2. 创建新用户并记录创建事件
  // 3. 返回新创建的用户信息或错误信息
  app.post(
    "/admin/users/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const newUserParams = reqBody(request);
        const roleValidation = validRoleSelection(currUser, newUserParams);

        if (!roleValidation.valid) {
          response
            .status(200)
            .json({ user: null, error: roleValidation.error });
          return;
        }

        const { user: newUser, error } = await User.create(newUserParams);
        if (!!newUser) {
          await EventLogs.logEvent(
            "user_created",
            {
              userName: newUser.username,
              createdBy: currUser.username,
            },
            currUser.id
          );
        }

        response.status(200).json({ user: newUser, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 更新用户信息
  // 路由: POST /admin/user/:id
  // 权限要求: 管理员和经理可访问
  // 功能:
  // 1. 验证当前用户是否有权限修改目标用户
  // 2. 验证角色修改的合法性
  // 3. 特别验证管理员角色的修改权限
  // 4. 更新用户信息并返回结果
  app.post(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const { id } = request.params;
        const updates = reqBody(request);
        const user = await User.get({ id: Number(id) });

        // 如果是 manager 角色，只能修改自己的信息
        if (currUser.role === ROLES.manager && currUser.id !== Number(id)) {
          response.status(200).json({ 
            success: false, 
            error: "用户只能修改自己的信息" 
          });
          return;
        }

        const canModify = validCanModify(currUser, user);
        if (!canModify.valid) {
          response.status(200).json({ success: false, error: canModify.error });
          return;
        }

        const roleValidation = validRoleSelection(currUser, updates);
        if (!roleValidation.valid) {
          response
            .status(200)
            .json({ success: false, error: roleValidation.error });
          return;
        }

        const validAdminRoleModification = await canModifyAdmin(user, updates);
        if (!validAdminRoleModification.valid) {
          response
            .status(200)
            .json({ success: false, error: validAdminRoleModification.error });
          return;
        }

        const { success, error } = await User.update(id, updates);
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 删除用户
  // 路由: DELETE /admin/user/:id
  // 权限要求: 仅管理员可访问
  // 功能:
  // 1. 验证当前用户是否有权限删除目标用户
  // 2. 删除指定用户
  // 3. 记录删除事件
  app.delete(
    "/admin/user/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const currUser = await userFromSession(request, response);
        const { id } = request.params;
        const user = await User.get({ id: Number(id) });

        const canModify = validCanModify(currUser, user);
        if (!canModify.valid) {
          response.status(200).json({ success: false, error: canModify.error });
          return;
        }

        await User.delete({ id: Number(id) });
        await EventLogs.logEvent(
          "user_deleted",
          {
            userName: user.username,
            deletedBy: currUser.username,
          },
          currUser.id
        );
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 获取所有邀请码
  // 路由: GET /admin/invites
  // 权限要求: 仅管理员可访问
  // 功能: 返回所有邀请码及其关联用户信息
  app.get(
    "/admin/invites",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const invites = await Invite.whereWithUsers();
        response.status(200).json({ invites });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 创建新邀请码
  // 路由: POST /admin/invite/new
  // 权限要求: 仅管理员可访问
  // 功能:
  // 1. 创建新的邀请码
  // 2. 可选择关联特定工作空间
  // 3. 记录邀请码创建事件
  app.post(
    "/admin/invite/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const body = reqBody(request);
        const { invite, error } = await Invite.create({
          createdByUserId: user.id,
          workspaceIds: body?.workspaceIds || [],
        });

        await EventLogs.logEvent(
          "invite_created",
          {
            inviteCode: invite.code,
            createdBy: response.locals?.user?.username,
          },
          response.locals?.user?.id
        );
        response.status(200).json({ invite, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 停用邀请码
  // 路由: DELETE /admin/invite/:id
  // 权限要求: 仅管理员可访问
  // 功能:
  // 1. 停用指定的邀请码
  // 2. 记录邀请码停用事件
  app.delete(
    "/admin/invite/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const { success, error } = await Invite.deactivate(id);
        await EventLogs.logEvent(
          "invite_deleted",
          { deletedBy: response.locals?.user?.username },
          response.locals?.user?.id
        );
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 获取所有工作空间
  // 路由: GET /admin/workspaces
  // 权限要求: 仅管理员可访问
  // 功能: 返回所有工作空间及其关联用户信息
  app.get(
    "/admin/workspaces",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const workspaces = await Workspace.whereWithUsers();
        response.status(200).json({ workspaces });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 获取特定工作空间的用户
  // 路由: GET /admin/workspaces/:workspaceId/users
  // 权限要求: 管理员和经理可访问
  // 功能: 返回指定工作空间中的所有用户信息
  app.get(
    "/admin/workspaces/:workspaceId/users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { workspaceId } = request.params;
        const users = await Workspace.workspaceUsers(workspaceId);
        response.status(200).json({ users });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 创建新工作空间
  // 路由: POST /admin/workspaces/new
  // 权限要求: 管理员和经理可访问
  // 功能:
  // 1. 创建新的工作空间
  // 2. 设置创建者为当前用户
  app.post(
    "/admin/workspaces/new",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { name } = reqBody(request);
        const { workspace, message: error } = await Workspace.new(
          name,
          user.id
        );
        response.status(200).json({ workspace, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 更新工作空间用户
  // 路由: POST /admin/workspaces/:workspaceId/update-users
  // 权限要求: 管理员和经理可访问
  // 功能: 更新指定工作空间的用户列表
  app.post(
    "/admin/workspaces/:workspaceId/update-users",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { workspaceId } = request.params;
        const { userIds } = reqBody(request);
        const { success, error } = await Workspace.updateUsers(
          workspaceId,
          userIds
        );
        response.status(200).json({ success, error });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 删除工作空间
  // 路由: DELETE /admin/workspaces/:id
  // 权限要求: 管理员和经理可访问
  // 功能:
  // 1. 删除工作空间相关的所有聊天记录
  // 2. 删除工作空间的文档向量
  // 3. 删除工作空间的所有文档
  // 4. 删除工作空间本身
  // 5. 删除向量数据库中的相关命名空间
  app.delete(
    "/admin/workspaces/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const user = await userFromSession(request, response);
        const VectorDb = getVectorDbClass();
        const workspace = await Workspace.get({ id: Number(id) });
        if (!workspace) {
          response.sendStatus(404).end();
          return;
        }

        // 如果是 manager 角色，验证是否有权限操作该工作区
        if (user.role === ROLES.manager) {
          const userWorkspace = await Workspace.getWithUser(user, { id: Number(id) });
          if (!userWorkspace) {
            response.status(403).json({ 
              success: false, 
              error: "您没有权限删除此工作区" 
            });
            return;
          }
        }

        await WorkspaceChats.delete({ workspaceId: Number(workspace.id) });
        await DocumentVectors.deleteForWorkspace(Number(workspace.id));
        await Document.delete({ workspaceId: Number(workspace.id) });
        await Workspace.delete({ id: Number(workspace.id) });
        try {
          await VectorDb["delete-namespace"]({ namespace: workspace.slug });
        } catch (e) {
          console.error(e.message);
        }

        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 获取指定系统设置
  // 路由: GET /admin/system-preferences-for
  // 权限要求: 管理员和经理可访问
  // 功能: 根据请求的标签列表返回对应的系统设置值
  app.get(
    "/admin/system-preferences-for",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const requestedSettings = {};
        const labels = request.query.labels?.split(",") || [];
        const needEmbedder = [
          "text_splitter_chunk_size",
          "max_embed_chunk_size",
        ];
        const noRecord = [
          "max_embed_chunk_size",
          "agent_sql_connections",
          "imported_agent_skills",
          "feature_flags",
          "meta_page_title",
          "meta_page_favicon",
        ];

        for (const label of labels) {
          // Skip any settings that are not explicitly defined as public
          if (!SystemSettings.publicFields.includes(label)) continue;

          // Only get the embedder if the setting actually needs it
          let embedder = needEmbedder.includes(label)
            ? getEmbeddingEngineSelection()
            : null;
          // Only get the record from db if the setting actually needs it
          let setting = noRecord.includes(label)
            ? null
            : await SystemSettings.get({ label });

          switch (label) {
            case "footer_data":
              requestedSettings[label] = setting?.value ?? JSON.stringify([]);
              break;
            case "support_email":
              requestedSettings[label] = setting?.value || null;
              break;
            case "text_splitter_chunk_size":
              requestedSettings[label] =
                setting?.value || embedder?.embeddingMaxChunkLength || null;
              break;
            case "text_splitter_chunk_overlap":
              requestedSettings[label] = setting?.value || null;
              break;
            case "max_embed_chunk_size":
              requestedSettings[label] =
                embedder?.embeddingMaxChunkLength || 1000;
              break;
            case "agent_search_provider":
              requestedSettings[label] = setting?.value || null;
              break;
            case "agent_sql_connections":
              requestedSettings[label] =
                await SystemSettings.brief.agent_sql_connections();
              break;
            case "default_agent_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "disabled_agent_skills":
              requestedSettings[label] = safeJsonParse(setting?.value, []);
              break;
            case "imported_agent_skills":
              requestedSettings[label] = ImportedPlugin.listImportedPlugins();
              break;
            case "custom_app_name":
              requestedSettings[label] = setting?.value || null;
              break;
            case "feature_flags":
              requestedSettings[label] =
                (await SystemSettings.getFeatureFlags()) || {};
              break;
            case "meta_page_title":
              requestedSettings[label] =
                await SystemSettings.getValueOrFallback({ label }, null);
              break;
            case "meta_page_favicon":
              requestedSettings[label] =
                await SystemSettings.getValueOrFallback({ label }, null);
              break;
            default:
              break;
          }
        }

        response.status(200).json({ settings: requestedSettings });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 获取所有系统设置（已废弃）
  // 路由: GET /admin/system-preferences
  // 权限要求: 管理员和经理可访问
  // 功能: 返回所有系统设置的值
  app.get(
    "/admin/system-preferences",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (_, response) => {
      try {
        const embedder = getEmbeddingEngineSelection();
        const settings = {
          footer_data:
            (await SystemSettings.get({ label: "footer_data" }))?.value ||
            JSON.stringify([]),
          support_email:
            (await SystemSettings.get({ label: "support_email" }))?.value ||
            null,
          text_splitter_chunk_size:
            (await SystemSettings.get({ label: "text_splitter_chunk_size" }))
              ?.value ||
            embedder?.embeddingMaxChunkLength ||
            null,
          text_splitter_chunk_overlap:
            (await SystemSettings.get({ label: "text_splitter_chunk_overlap" }))
              ?.value || null,
          max_embed_chunk_size: embedder?.embeddingMaxChunkLength || 1000,
          agent_search_provider:
            (await SystemSettings.get({ label: "agent_search_provider" }))
              ?.value || null,
          agent_sql_connections:
            await SystemSettings.brief.agent_sql_connections(),
          default_agent_skills:
            safeJsonParse(
              (await SystemSettings.get({ label: "default_agent_skills" }))
                ?.value,
              []
            ) || [],
          disabled_agent_skills:
            safeJsonParse(
              (await SystemSettings.get({ label: "disabled_agent_skills" }))
                ?.value,
              []
            ) || [],
          imported_agent_skills: ImportedPlugin.listImportedPlugins(),
          custom_app_name:
            (await SystemSettings.get({ label: "custom_app_name" }))?.value ||
            null,
          feature_flags: (await SystemSettings.getFeatureFlags()) || {},
          meta_page_title: await SystemSettings.getValueOrFallback(
            { label: "meta_page_title" },
            null
          ),
          meta_page_favicon: await SystemSettings.getValueOrFallback(
            { label: "meta_page_favicon" },
            null
          ),
        };
        response.status(200).json({ settings });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 更新系统设置
  // 路由: POST /admin/system-preferences
  // 权限要求: 管理员和经理可访问
  // 功能: 批量更新系统设置
  app.post(
    "/admin/system-preferences",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const updates = reqBody(request);
        await SystemSettings.updateSettings(updates);
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 获取所有API密钥
  // 路由: GET /admin/api-keys
  // 权限要求: 仅管理员可访问
  // 功能: 返回所有API密钥及其关联用户信息
  app.get(
    "/admin/api-keys",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (_request, response) => {
      try {
        const apiKeys = await ApiKey.whereWithUser({});
        return response.status(200).json({
          apiKeys,
          error: null,
        });
      } catch (error) {
        console.error(error);
        response.status(500).json({
          apiKey: null,
          error: "Could not find an API Keys.",
        });
      }
    }
  );

  // 生成新的API密钥
  // 路由: POST /admin/generate-api-key
  // 权限要求: 仅管理员可访问
  // 功能:
  // 1. 为当前用户生成新的API密钥
  // 2. 记录遥测数据和事件日志
  app.post(
    "/admin/generate-api-key",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const user = await userFromSession(request, response);
        const { apiKey, error } = await ApiKey.create(user.id);

        await Telemetry.sendTelemetry("api_key_created");
        await EventLogs.logEvent(
          "api_key_created",
          { createdBy: user?.username },
          user?.id
        );
        return response.status(200).json({
          apiKey,
          error,
        });
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );

  // 删除API密钥
  // 路由: DELETE /admin/delete-api-key/:id
  // 权限要求: 仅管理员可访问
  // 功能:
  // 1. 删除指定的API密钥
  // 2. 记录删除事件
  app.delete(
    "/admin/delete-api-key/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        await ApiKey.delete({ id: Number(id) });

        await EventLogs.logEvent(
          "api_key_deleted",
          { deletedBy: response.locals?.user?.username },
          response?.locals?.user?.id
        );
        return response.status(200).end();
      } catch (e) {
        console.error(e);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { adminEndpoints };
