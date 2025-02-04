import { useEffect, useRef, useState } from "react";
import { CaretRight } from "@phosphor-icons/react";
import { useParams } from "react-router-dom";
import showToast from "@/utils/toast";
import Workspace from "@/models/workspace";
import ChatHistorySettings from "@/pages/WorkspaceSettings/ChatSettings/ChatHistorySettings";
import ChatPromptSettings from "@/pages/WorkspaceSettings/ChatSettings/ChatPromptSettings";
import ChatTemperatureSettings from "@/pages/WorkspaceSettings/ChatSettings/ChatTemperatureSettings";
import ChatModeSelection from "@/pages/WorkspaceSettings/ChatSettings/ChatModeSelection";

export default function ChatSettingsSidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const { slug } = useParams();
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const formEl = useRef(null);
  const [settings, setSettings] = useState({});
  const [hasChanges, setHasChanges] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function getWorkspaces() {
      try {
        const workspaces = await Workspace.all();
        const foundWorkspace = workspaces.find((ws) => ws.slug === slug);
        if (!foundWorkspace) {
          console.warn(`未找到slug为${slug}的工作区`);
        }
        setActiveWorkspace(foundWorkspace || null);
      } catch (error) {
        console.error("获取工作区失败:", error);
      } finally {
        setLoading(false);
      }
    }
    getWorkspaces();
  }, [slug]);

  const handleUpdate = async (e) => {
    setSaving(true);
    e.preventDefault();
    const data = {};
    const form = new FormData(formEl.current);
    for (var [key, value] of form.entries()) data[key] = value;
    try {
      const { workspace: updatedWorkspace, message } = await Workspace.update(
        activeWorkspace.slug,
        data
      );

      if (!!updatedWorkspace) {
        showToast("设置已更新!", "success", { clear: true });
      } else {
        showToast(`错误: ${message}`, "error", { clear: true });
      }
    } catch (error) {
      showToast("更新设置失败", "error", { clear: true });
    } finally {
      setSaving(false);
      setHasChanges(false);
    }
  };

  if (!loading) {
    return (
      <div className="relative h-full">
        <div
          className={`top-0 right-0 h-full flex flex-col shrink-0
          transition-all duration-500 ease-in-out my-[18px]
          rounded-[16px] bg-theme-bg-sidebar border-[2px] border-theme-sidebar-border
          ${isOpen ? "w-80 opacity-100" : "w-0 opacity-0 translate-x-full"}`}
        >
          {isOpen && (
            <>
              <button
                className="flex items-center justify-center w-10 h-10 ml-2 mt-2
                hover:bg-theme-sidebar-item-hover rounded-lg transition-all duration-500"
                onClick={() => setIsOpen(false)}
              >
                <CaretRight className="w-5 h-5 text-theme-text-secondary hover:text-theme-text-primary" />
              </button>

              <div className="relative h-[calc(100%-60px)] flex flex-col w-full justify-between pt-[10px] overflow-y-scroll no-scroll">
                <div className="flex-1 px-6">
                  <div className="space-y-6 pb-[60px]">
                    <h2 className="text-xl font-semibold text-theme-text-primary">
                      {activeWorkspace?.name || ""} 对话设置
                    </h2>

                    <form
                      ref={formEl}
                      onSubmit={handleUpdate}
                      id="chat-settings-form"
                      className="w-full flex flex-col gap-y-6"
                    >
                      <ChatModeSelection
                        workspace={activeWorkspace}
                        setHasChanges={setHasChanges}
                      />
                      <ChatHistorySettings
                        workspace={activeWorkspace}
                        setHasChanges={setHasChanges}
                      />
                      <ChatPromptSettings
                        workspace={activeWorkspace}
                        setHasChanges={setHasChanges}
                      />
                      <ChatTemperatureSettings
                        settings={settings}
                        workspace={activeWorkspace}
                        setHasChanges={setHasChanges}
                      />

                      {hasChanges && (
                        <button
                          type="submit"
                          form="chat-settings-form"
                          className="light:bg-[#C2E7FE] light:hover:bg-[#7CD4FD] flex flex-grow w-[75%] h-[44px] gap-x-2 py-[5px] px-2.5 mb-2 bg-white rounded-[8px] text-sidebar justify-center items-center hover:bg-opacity-80 transition-all duration-300"
                        >
                          {saving ? "更新中..." : "更新设置"}
                        </button>
                      )}
                    </form>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <button
          className={`absolute top-[16px] right-[16px] z-20
            flex items-center justify-center w-10 h-10
            hover:bg-theme-sidebar-item-hover rounded-lg transition-all duration-500
            ${!isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
          onClick={() => setIsOpen(true)}
        >
          <CaretRight className="w-5 h-5 rotate-180 text-theme-text-secondary hover:text-theme-text-primary" />
        </button>
      </div>
    );
  }
}
