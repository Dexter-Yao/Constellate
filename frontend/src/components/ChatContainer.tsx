// ABOUTME: 对话容器组件
// ABOUTME: 整合 useStream hook 管理流式消息状态

"use client";

import { useState, useCallback, useEffect } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { GRAPH_NAME } from "@/lib/langgraph";
import type { Message } from "@/lib/types";
import styles from "./ChatContainer.module.css";

interface StreamState {
    messages: Array<{
        type: string;
        content: string;
    }>;
}

const API_URL = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:2024";

export function ChatContainer() {
    const [messages, setMessages] = useState<Message[]>([]);

    const stream = useStream<StreamState>({
        apiUrl: API_URL,
        assistantId: GRAPH_NAME,
        messagesKey: "messages",
        onError: (error) => {
            console.error("Stream error:", error);
        },
    });

    const handleSend = useCallback(
        async (content: string) => {
            const userMessage: Message = {
                id: `user-${Date.now()}`,
                role: "user",
                content,
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, userMessage]);

            try {
                await stream.submit({
                    messages: [{ type: "human", content }],
                });
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        },
        [stream]
    );

    // 监听流式消息更新
    useEffect(() => {
        if (stream.messages && stream.messages.length > 0) {
            const lastMessage = stream.messages[stream.messages.length - 1];
            if (lastMessage && lastMessage.type === "ai") {
                const content = typeof lastMessage.content === "string"
                    ? lastMessage.content
                    : "";

                setMessages((prev) => {
                    const lastLocal = prev[prev.length - 1];
                    if (lastLocal?.role === "assistant") {
                        // 更新现有助手消息
                        return [
                            ...prev.slice(0, -1),
                            { ...lastLocal, content },
                        ];
                    } else {
                        // 添加新的助手消息
                        return [
                            ...prev,
                            {
                                id: `assistant-${Date.now()}`,
                                role: "assistant",
                                content,
                                timestamp: new Date(),
                            },
                        ];
                    }
                });
            }
        }
    }, [stream.messages]);

    const isStreaming = stream.isLoading;

    return (
        <div className={styles.container}>
            <MessageList messages={messages} isStreaming={isStreaming} />
            <InputBar onSend={handleSend} disabled={isStreaming} />
        </div>
    );
}
