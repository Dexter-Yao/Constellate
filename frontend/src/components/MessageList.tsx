// ABOUTME: 消息列表组件
// ABOUTME: Coach 消息左对齐衬线体，用户消息右对齐无衬线体

"use client";

import { useRef, useEffect } from "react";
import type { Message } from "@/lib/types";
import styles from "./MessageList.module.css";

interface MessageListProps {
    messages: Message[];
    isStreaming?: boolean;
}

function formatTimestamp(date: Date): string {
    return date.toLocaleTimeString("zh-CN", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function shouldShowTimestamp(
    current: Message,
    previous: Message | undefined
): boolean {
    if (!previous) return true;
    const diff = current.timestamp.getTime() - previous.timestamp.getTime();
    return diff > 30 * 60 * 1000; // 30 分钟
}

export function MessageList({ messages, isStreaming }: MessageListProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <div ref={containerRef} className={styles.container}>
            {messages.map((message, index) => {
                const showTimestamp = shouldShowTimestamp(message, messages[index - 1]);
                const isLast = index === messages.length - 1;

                return (
                    <div key={message.id}>
                        {showTimestamp && (
                            <div className={styles.timestamp}>
                                {formatTimestamp(message.timestamp)}
                            </div>
                        )}
                        <div
                            className={`${styles.message} ${message.role === "user" ? styles.user : styles.assistant
                                } ${isLast && isStreaming ? styles.streaming : ""}`}
                        >
                            {message.content}
                            {isLast && isStreaming && <span className={styles.cursor}>▌</span>}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
