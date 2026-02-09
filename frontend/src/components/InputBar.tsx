// ABOUTME: 输入栏组件
// ABOUTME: 底部固定，包含加号按钮、文字输入框和发送按钮

"use client";

import { useState, useRef, KeyboardEvent } from "react";
import styles from "./InputBar.module.css";

interface InputBarProps {
    onSend: (message: string) => void;
    disabled?: boolean;
}

export function InputBar({ onSend, disabled }: InputBarProps) {
    const [value, setValue] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    const handleSend = () => {
        const trimmed = value.trim();
        if (!trimmed || disabled) return;
        onSend(trimmed);
        setValue("");
        inputRef.current?.focus();
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className={styles.container}>
            <button
                type="button"
                className={styles.addButton}
                aria-label="添加附件"
                title="添加附件（即将推出）"
            >
                ＋
            </button>
            <input
                ref={inputRef}
                type="text"
                className={styles.input}
                placeholder="消息输入框..."
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={disabled}
            />
            <button
                type="button"
                className={`${styles.sendButton} ${value.trim() ? styles.active : ""}`}
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                aria-label="发送"
            >
                →
            </button>
        </div>
    );
}
