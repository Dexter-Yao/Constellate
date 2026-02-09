// ABOUTME: 扇出面板容器组件
// ABOUTME: 半屏或全屏滑入面板，承载干预工具的交互卡片

"use client";

import type { ReactNode } from "react";
import styles from "./FanOutPanel.module.css";

interface FanOutPanelProps {
    variant: "half" | "full";
    visible: boolean;
    onDismiss: () => void;
    children: ReactNode;
}

export function FanOutPanel({
    variant,
    visible,
    onDismiss,
    children,
}: FanOutPanelProps) {
    return (
        <>
            <div
                className={`${styles.overlay} ${visible ? styles.visible : ""}`}
                onClick={onDismiss}
            />
            <div
                className={`${styles.panel} ${styles[variant]} ${visible ? styles.visible : ""}`}
            >
                <div className={styles.header}>
                    <button
                        className={styles.backButton}
                        onClick={onDismiss}
                        type="button"
                    >
                        &larr; 返回对话
                    </button>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </>
    );
}
