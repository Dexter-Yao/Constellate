// ABOUTME: Fan-out panel container
// ABOUTME: Half-screen or full-screen slide-in panel for A2UI component rendering

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
                        &larr; Back to chat
                    </button>
                </div>
                <div className={styles.content}>{children}</div>
            </div>
        </>
    );
}
