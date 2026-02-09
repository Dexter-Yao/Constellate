// ABOUTME: 微干预卡片
// ABOUTME: 展示 Coach 观察 + 反思性问题 + 双选项

"use client";

import type { ProtocolPromptProps } from "@/lib/types";
import styles from "./ProtocolPromptCard.module.css";

interface ProtocolPromptCardProps extends ProtocolPromptProps {
    onEdit: (name: string, args: Record<string, unknown>) => void;
    onReject: () => void;
}

export function ProtocolPromptCard({
    observation,
    question,
    option_a_label,
    option_a_value,
    option_b_label,
    option_b_value,
    onEdit,
    onReject,
}: ProtocolPromptCardProps) {
    const handleSelect = (value: string) => {
        onEdit("protocol_prompt", {
            observation,
            question,
            option_a_label,
            option_a_value,
            option_b_label,
            option_b_value,
            selected: value,
        });
    };

    return (
        <div className={styles.card}>
            <p className={styles.observation}>{observation}</p>
            <h3 className={styles.question}>{question}</h3>
            <div className={styles.options}>
                <button
                    className={styles.optionButton}
                    onClick={() => handleSelect(option_a_value)}
                    type="button"
                >
                    {option_a_label}
                </button>
                <button
                    className={styles.optionButton}
                    onClick={() => handleSelect(option_b_value)}
                    type="button"
                >
                    {option_b_label}
                </button>
            </div>
            <button
                className={styles.dismissButton}
                onClick={onReject}
                type="button"
            >
                跳过
            </button>
        </div>
    );
}
