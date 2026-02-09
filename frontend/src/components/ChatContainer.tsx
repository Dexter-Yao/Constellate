// ABOUTME: Chat container component
// ABOUTME: Manages streaming message state via useStream, handles unified A2UI interrupt protocol

"use client";

import { useState, useCallback, useEffect } from "react";
import { useStream } from "@langchain/langgraph-sdk/react";
import { MessageList } from "./MessageList";
import { InputBar } from "./InputBar";
import { FanOutPanel } from "./FanOutPanel";
import { A2UIRenderer } from "./fanout/A2UIRenderer";
import { GRAPH_NAME } from "@/lib/langgraph";
import type { Message, A2UIResponse } from "@/lib/types";
import { isA2UIPayload } from "@/lib/types";
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

    // ── A2UI Interrupt Detection ──
    const interruptData = stream.interrupt?.value;

    // ── A2UI Resume Handlers ──
    const handleA2UISubmit = useCallback(
        async (response: A2UIResponse) => {
            await stream.submit(null, {
                command: { resume: response },
            });
        },
        [stream]
    );

    const handleA2UIReject = useCallback(async () => {
        await stream.submit(null, {
            command: { resume: { action: "reject", data: {} } },
        });
    }, [stream]);

    const handleA2UISkip = useCallback(async () => {
        await stream.submit(null, {
            command: { resume: { action: "skip", data: {} } },
        });
    }, [stream]);

    const isStreaming = stream.isLoading;

    return (
        <div className={styles.container}>
            <MessageList messages={messages} isStreaming={isStreaming} />

            {isA2UIPayload(interruptData) && (
                <FanOutPanel
                    variant={interruptData.layout}
                    visible
                    onDismiss={handleA2UIReject}
                >
                    <A2UIRenderer
                        components={interruptData.components}
                        onSubmit={handleA2UISubmit}
                        onReject={handleA2UIReject}
                        onSkip={handleA2UISkip}
                    />
                </FanOutPanel>
            )}

            <InputBar onSend={handleSend} disabled={isStreaming} />
        </div>
    );
}
