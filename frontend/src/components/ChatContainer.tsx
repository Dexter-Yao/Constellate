// ABOUTME: 对话容器组件
// ABOUTME: 整合 useStream hook 管理流式消息状态，支持双类型 interrupt（HITL + 体验式干预）

"use client";

import { useState, useCallback, useEffect } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { FanOutPanel } from "./FanOutPanel";
import { FanOutRouter } from "./fanout/FanOutRouter";
import { ExperientialReviewCard } from "./fanout/ExperientialReviewCard";
import { GRAPH_NAME } from "@/lib/langgraph";
import type { Message } from "@/lib/types";
import { isHITLRequest, isExperientialReview } from "@/lib/types";
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
                        return [
                            ...prev.slice(0, -1),
                            { ...lastLocal, content },
                        ];
                    } else {
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

    // ── Interrupt 检测 ──
    const interruptData = stream.interrupt;

    // ── HITL resume 处理 ──
    const handleHITLApprove = useCallback(async () => {
        await stream.submit(null, {
            command: { resume: { decisions: [{ type: "approve" }] } },
        });
    }, [stream]);

    const handleHITLEdit = useCallback(
        async (name: string, args: Record<string, unknown>) => {
            await stream.submit(null, {
                command: {
                    resume: {
                        decisions: [
                            { type: "edit", edited_action: { name, args } },
                        ],
                    },
                },
            });
        },
        [stream]
    );

    const handleHITLReject = useCallback(async () => {
        await stream.submit(null, {
            command: {
                resume: { decisions: [{ type: "reject", message: "用户关闭" }] },
            },
        });
    }, [stream]);

    // ── 体验式干预 resume 处理 ──
    const handleInterventionAccept = useCallback(async () => {
        await stream.submit(null, {
            command: { resume: { accepted: true } },
        });
    }, [stream]);

    const handleInterventionDismiss = useCallback(async () => {
        await stream.submit(null, {
            command: { resume: { accepted: false } },
        });
    }, [stream]);

    const isStreaming = stream.isLoading;

    return (
        <div className={styles.container}>
            <MessageList messages={messages} isStreaming={isStreaming} />

            {isHITLRequest(interruptData) && (
                <FanOutPanel
                    variant="half"
                    visible
                    onDismiss={handleHITLReject}
                >
                    <FanOutRouter
                        componentName={interruptData.action_requests[0].name}
                        props={interruptData.action_requests[0].args}
                        onApprove={handleHITLApprove}
                        onEdit={handleHITLEdit}
                        onReject={handleHITLReject}
                    />
                </FanOutPanel>
            )}

            {isExperientialReview(interruptData) && (
                <FanOutPanel
                    variant="full"
                    visible
                    onDismiss={handleInterventionDismiss}
                >
                    <ExperientialReviewCard
                        image_base64={interruptData.image_base64}
                        mime_type={interruptData.mime_type}
                        purpose={interruptData.purpose}
                        caption={interruptData.caption}
                        onAccept={handleInterventionAccept}
                        onDismiss={handleInterventionDismiss}
                    />
                </FanOutPanel>
            )}

            <InputBar onSend={handleSend} disabled={isStreaming} />
        </div>
    );
}
