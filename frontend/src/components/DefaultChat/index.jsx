import React, { useEffect, useState } from "react";
import {
  GithubLogo,
  GitMerge,
  EnvelopeSimple,
  Plus,
} from "@phosphor-icons/react";
import NewWorkspaceModal, {
  useNewWorkspaceModal,
} from "../Modals/NewWorkspace";
import paths from "@/utils/paths";
import { isMobile } from "react-device-detect";
import { SidebarMobileHeader } from "../Sidebar";
import ChatBubble from "../ChatBubble";
import System from "@/models/system";
import UserIcon from "../UserIcon";
import { userFromStorage } from "@/utils/request";
import useUser from "@/hooks/useUser";
import { useTranslation, Trans } from "react-i18next";
import Appearance from "@/models/appearance";
import createDOMPurify from "dompurify";
import renderMarkdown from "@/utils/chat/markdown";
const DOMPurify = createDOMPurify(window);
export default function DefaultChatContainer() {
  const { showScrollbar } = Appearance.getSettings();
  const [mockMsgs, setMockMessages] = useState([]);
  const { user } = useUser();
  const [fetchedMessages, setFetchedMessages] = useState([]);
  const {
    showing: showingNewWsModal,
    showModal: showNewWsModal,
    hideModal: hideNewWsModal,
  } = useNewWorkspaceModal();
  const popMsg = !window.localStorage.getItem("anythingllm_intro");
  const { t } = useTranslation();

  useEffect(() => {
    const fetchData = async () => {
      const fetchedMessages = await System.getWelcomeMessages();
      setFetchedMessages(fetchedMessages);
    };
    fetchData();
  }, []);

  const MESSAGES = [
    <React.Fragment key="msg1">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <div>
            <MessageText>
              {`
欢迎使用 MindSpore 助手！我是您的AI向导，可以为您提供以下帮助：
🎯 框架特性解析
📚 学习路径指导
💻 代码调试建议
🚀 部署方案咨询
您想了解哪些内容？可以通过下方按钮快速开始：
            `}
            </MessageText>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
              <button
                onClick={showNewWsModal}
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <Plus className="h-4 w-4" />
                <p>创建学习空间</p>
              </button>
              <a
                href="https://www.mindspore.cn/tutorials/zh-CN/master/index.html"
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <p>查看官方教程</p>
              </a>
            </div>
          </div>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg2">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: userFromStorage()?.username }} role={"user"} />
          <MessageText>能介绍一下 MindSpore 的主要功能吗？</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg3">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <div>
            <MessageText>
              {`
MindSpore 的核心功能包括：
1. **全场景支持**
    统一API支持端、边、云全场景部署
    自动并行技术提升分布式训练效率
2. **高效调试**
    实时可视化训练过程
    梯度/权重可视化分析工具
3. **安全推理**
    可信执行环境(TEE)支持
    模型加密与权限管理
4. **生态集成**
    与昇腾芯片深度优化
    支持ONNX格式模型转换
            `}
            </MessageText>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
              <a
                href="https://www.mindspore.cn/view"
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <p>查看功能特性</p>
              </a>
            </div>
          </div>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg4">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: userFromStorage()?.username }} role={"user"} />
          <MessageText>我应该如何规划学习路径？</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg5">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <div>
            <MessageText>
              {`
很高兴您想开始学习！这里是推荐的学习路径：
1. **环境配置**
首先需要配置好开发环境：Python 3.7+，选择合适的硬件平台（CPU/GPU/Ascend），按照官方安装指南进行安装。
2. **入门教程**
包含官方教程（系统性介绍基础知识和核心概念），示例项目（包含图像分类、目标检测等实际案例），以及 API 文档（详细的接口说明与使用示例）。
3. **实践项目**
建议从简单的示例开始，逐步尝试更复杂的应用，可以参考 ModelZoo 中的预训练模型。
下面是一些重要的学习资源链接，建议您按需查看：
            `}
            </MessageText>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
              <a
                href="https://www.mindspore.cn/install"
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <p>安装指南</p>
              </a>
              <a
                href="https://www.mindspore.cn/docs/zh-CN/master/"
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <p>API 文档</p>
              </a>
            </div>
          </div>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg6">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <div>
            <MessageText>
              {`
MindSpore 生态系统包含：
1. **开发工具链**
   MindStudio：全流程开发工具
   MindInsight：可视化调试工具
2. **模型资源**
   ModelZoo：200+官方模型
   Hub：社区贡献模型
3. **部署方案**
   MindSpore Lite：移动端推理
   Serving：云服务部署
            `}
            </MessageText>
            <div className="flex flex-col md:flex-row items-start md:items-center gap-1 md:gap-4">
              <a
                href="https://www.mindspore.cn/resources/hub"
                target="_blank"
                rel="noreferrer"
                className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
              >
                <p>探索生态系统</p>
              </a>
            </div>
          </div>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg7">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: userFromStorage()?.username }} role={"user"} />
          <MessageText>如果我遇到问题，要怎么获取帮助？</MessageText>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,

    <React.Fragment key="msg8">
      <MessageContainer>
        <MessageContent>
          <UserIcon user={{ uid: "system" }} role={"assistant"} />
          <div>
            <MessageText>
              {`
MindSpore 提供多种途径获取帮助：
1. **官方支持**
包括 [MindSpore 官方论坛](https://www.mindspore.cn/community)、GitHub Issues 和官方文档中心。
2. **社区交流**
提供开发者社区、技术交流群和线上线下活动。
3. **学习资源**
包含视频教程、技术博客和在线课程。
您可以根据问题类型选择最适合的渠道：开发问题优先查看官方文档和 GitHub Issues，使用咨询可以在官方论坛发帖，技术交流请加入开发者社区。
现在，您可以开始创建工作区，开启您的 MindSpore 学习之旅！
            `}
            </MessageText>
            <button
              onClick={showNewWsModal}
              className="mt-5 w-fit transition-all duration-300 border border-slate-200 px-4 py-2 rounded-lg text-white light:border-black/50 light:text-theme-text-primary text-sm items-center flex gap-x-2 hover:bg-slate-200 hover:text-slate-800 focus:ring-gray-800"
            >
              <Plus className="h-4 w-4" />
              <p>创建工作区</p>
            </button>
          </div>
        </MessageContent>
      </MessageContainer>
    </React.Fragment>,
  ];

  useEffect(() => {
    function processMsgs() {
      if (!!window.localStorage.getItem("anythingllm_intro")) {
        setMockMessages([...MESSAGES]);
        return false;
      } else {
        setMockMessages([MESSAGES[0]]);
      }

      var timer = 1000;
      var messages = [];

      MESSAGES.map((child) => {
        setTimeout(() => {
          setMockMessages([...messages, child]);
          messages.push(child);
        }, timer);
        timer += 3000;
      });
      window.localStorage.setItem("anythingllm_intro", 1);
    }

    processMsgs();
  }, []);

  return (
    <div
      style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
      className={`transition-all duration-500 relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[16px] bg-theme-bg-secondary light:border-[1px] light:border-theme-sidebar-border w-full h-full overflow-y-scroll ${
        showScrollbar ? "show-scrollbar" : "no-scroll"
      }`}
    >
      {isMobile && <SidebarMobileHeader />}
      {fetchedMessages.length === 0
        ? mockMsgs.map((content, i) => {
            return <React.Fragment key={i}>{content}</React.Fragment>;
          })
        : fetchedMessages.map((fetchedMessage, i) => {
            return (
              <React.Fragment key={i}>
                <ChatBubble
                  message={
                    fetchedMessage.user === ""
                      ? fetchedMessage.response
                      : fetchedMessage.user
                  }
                  type={fetchedMessage.user === "" ? "response" : "user"}
                  popMsg={popMsg}
                />
              </React.Fragment>
            );
          })}
      {showingNewWsModal && <NewWorkspaceModal hideModal={hideNewWsModal} />}
    </div>
  );
}

function MessageContainer({ children }) {
  return (
    <div className="flex justify-center items-end w-full">
      <div className="py-6 px-4 w-full flex gap-x-5 md:max-w-[80%] flex-col">
        {children}
      </div>
    </div>
  );
}

function MessageContent({ children }) {
  return <div className="flex gap-x-5">{children}</div>;
}

function MessageText({ children }) {
  return (
    <span
      className="text-white/80 light:text-theme-text-primary font-light text-[16px] leading-snug flex flex-col whitespace-pre-wrap"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(renderMarkdown(children)),
      }}
    />
  );
}
