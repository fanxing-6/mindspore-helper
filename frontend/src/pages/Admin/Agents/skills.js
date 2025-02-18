import AgentWebSearchSelection from "./WebSearchSelection";
import AgentSQLConnectorSelection from "./SQLConnectorSelection";
import GenericSkillPanel from "./GenericSkillPanel";
import DefaultSkillPanel from "./DefaultSkillPanel";
import {
  Brain,
  File,
  Browser,
  ChartBar,
  FileMagnifyingGlass,
} from "@phosphor-icons/react";
import RAGImage from "@/media/agents/rag-memory.png";
import SummarizeImage from "@/media/agents/view-summarize.png";
import ScrapeWebsitesImage from "@/media/agents/scrape-websit es.png";
import GenerateChartsImage from "@/media/agents/generate-charts.png";
import GenerateSaveImages from "@/media/agents/generate-save-files.png";

export const defaultSkills = {
  "rag-memory": {
    // title: "RAG & long-term memory",
    title: "RAG和长期记忆",
    description:
      // 'Allow the agent to leverage your local documents to answer a query or ask the agent to "remember" pieces of content for long-term memory retrieval.',
      "允许代理利用您的本地文档回答查询或要求代理“记住”内容以进行长期记忆检索。",
    component: DefaultSkillPanel,
    icon: Brain,
    image: RAGImage,
    skill: "rag-memory",
  },
  "document-summarizer": {
    // title: "View & summarize documents",
    title: "查看和总结文档",
    description:
      // "Allow the agent to list and summarize the content of workspace files currently embedded.",
      "允许代理列出和总结当前嵌入的工作区文件的内容。",
    component: DefaultSkillPanel,
    icon: File,
    image: SummarizeImage,
    skill: "document-summarizer",
  },
  "web-scraping": {
    //title: "Scrape websites",
    title: "抓取网站",
    description:
      // "Allow the agent to visit and scrape the content of websites.",
      "允许代理访问和抓取网站的内容。",
    component: DefaultSkillPanel,
    icon: Browser,
    image: ScrapeWebsitesImage,
    skill: "web-scraping",
  },
};

export const configurableSkills = {
  "save-file-to-browser": {
    // title: "Generate & save files to browser",
    title: "生成和保存文件到浏览器",
    description:
      // "Enable the default agent to generate and write to files that can be saved to your computer.",
      "启用默认代理生成和写入文件到浏览器，可以保存到你的电脑。",
    component: GenericSkillPanel,
    skill: "save-file-to-browser",
    icon: FileMagnifyingGlass,
    image: GenerateSaveImages,
  },
  "create-chart": {
    // title: "Generate charts",
    title: "生成图表",
    description:
      // "Enable the default agent to generate various types of charts from data provided or given in chat.",
      "启用默认代理生成各种类型的图表，从提供或给定的数据中。",
    component: GenericSkillPanel,
    skill: "create-chart",
    icon: ChartBar,
    image: GenerateChartsImage,
  },
  "web-browsing": {
    // title: "Web Search",
    title: "网络搜索",
    description:
      // "Enable the default agent to search the web for information.",
      "启用默认代理搜索网络获取信息。",
    component: AgentWebSearchSelection,
    skill: "web-browsing",
  },
  "sql-agent": {
    // title: "SQL Connector",
    title: "SQL连接器",
    description:
      // "Enable the default agent to connect to a SQL database and query it.",
      "启用默认代理连接到SQL数据库并查询它。",
    component: AgentSQLConnectorSelection,
    skill: "sql-agent",
  },
};
