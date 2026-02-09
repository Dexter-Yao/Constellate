// ABOUTME: LangGraph 客户端配置
// ABOUTME: 创建连接 LangGraph Dev Server 的客户端实例

import { Client } from "@langchain/langgraph-sdk";

const apiUrl = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:2024";

export const langgraphClient = new Client({
    apiUrl,
});

export const GRAPH_NAME = "coach";
