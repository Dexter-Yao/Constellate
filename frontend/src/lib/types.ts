// ABOUTME: 消息类型定义
// ABOUTME: 定义 Coach 对话消息的数据结构

export interface Message {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: Date;
}
