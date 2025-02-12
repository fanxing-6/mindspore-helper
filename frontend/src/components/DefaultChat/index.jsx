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
🎯 全场景AI框架使用指导
📚 动静统一编程体验
💻 自动并行与分布式训练
🚀 端-边-云统一部署方案
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
1. **动静统一编程**
    支持原生Python语法开发
    自动微分与高阶函数支持
2. **自动并行**
    多维分布式训练策略
    张量重排布技术优化
3. **全场景部署**
    端-边-云统一架构
    支持CPU/GPU/NPU多种硬件
4. **安全可信**
    差分隐私保护
    对抗性攻击防御
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
推荐的学习路径：
1. **环境配置**
    Python 3.7+环境
    选择CPU/GPU/Ascend硬件平台
2. **基础学习**
    动静统一编程体验
    自动微分与并行训练
3. **进阶实践**
    图算融合优化
    安全可信技术应用
4. **部署实践**
    端-边-云统一部署
    模型压缩与优化
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
1. **开发工具**
   MindStudio：全流程开发环境
   MindInsight：可视化调试工具
2. **模型资源**
   ModelZoo：官方模型库
   Hub：社区贡献模型
3. **部署方案**
   MindSpore Lite：轻量级推理
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
获取帮助的途径：
1. **官方支持**
   [MindSpore 官方论坛](https://www.mindspore.cn/community)
   GitHub Issues
2. **社区交流**
   开发者社区
   技术交流群
3. **学习资源**
   视频教程
   技术博客
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
