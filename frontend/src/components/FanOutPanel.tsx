// ABOUTME: Fan-out panel container
// ABOUTME: Slide-in panel for A2UI component rendering (half, three-quarter, or full screen)

"use client";

import type { ReactNode } from "react";
import styles from "./FanOutPanel.module.css";

interface FanOutPanelProps {
    /** Panel height: half (50%), three-quarter (75%), or full screen. Defaults to three-quarter. */
    variant?: "half" | "three-quarter" | "full";
    visible: boolean;
    onDismiss: () => void;
    children: ReactNode;
}

export function FanOutPanel({
    variant = "three-quarter",
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

