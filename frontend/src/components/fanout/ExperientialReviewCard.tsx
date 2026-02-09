// ABOUTME: 体验式干预审阅卡片
// ABOUTME: 全屏展示干预内容，供用户"收下"或"取消"

"use client";

import type { ExperientialReviewProps } from "@/lib/types";
import styles from "./ExperientialReviewCard.module.css";

const PURPOSE_LABELS: Record<string, string> = {
    future_self: "未来自我连接",
    scene_rehearsal: "场景预演",
    metaphor_mirror: "隐喻具象化",
    reframe_contrast: "认知重构",
};

interface ExperientialReviewCardProps extends ExperientialReviewProps {
    onAccept: () => void;
    onDismiss: () => void;
}

export function ExperientialReviewCard({
    image_base64,
    mime_type,
    purpose,
    caption,
    onAccept,
    onDismiss,
}: ExperientialReviewCardProps) {
    const purposeLabel = PURPOSE_LABELS[purpose] || purpose;

    return (
        <div className={styles.card}>
            <div className={styles.imageContainer}>
                <img
                    src={`data:${mime_type};base64,${image_base64}`}
                    alt={caption}
                    className={styles.image}
                />
            </div>
            <div className={styles.footer}>
                <span className={styles.purpose}>{purposeLabel}</span>
                {caption && <p className={styles.caption}>{caption}</p>}
                <div className={styles.actions}>
                    <button
                        className={styles.confirmButton}
                        onClick={onAccept}
                        type="button"
                    >
                        收下
                    </button>
                    <button
                        className={styles.outlineButton}
                        onClick={onDismiss}
                        type="button"
                    >
                        取消
                    </button>
                </div>
            </div>
        </div>
    );
}
