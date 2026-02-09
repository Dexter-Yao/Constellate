// ABOUTME: 饮食确认卡片
// ABOUTME: 展示 Coach 解析的饮食数据，供用户确认、编辑或拒绝

"use client";

import type { MealConfirmProps } from "@/lib/types";
import styles from "./MealConfirmCard.module.css";

interface MealConfirmCardProps extends MealConfirmProps {
    onApprove: () => void;
    onReject: () => void;
}

export function MealConfirmCard({
    time,
    items,
    kcal_estimate,
    confidence,
    tags,
    onApprove,
    onReject,
}: MealConfirmCardProps) {
    return (
        <div className={styles.card}>
            <h3 className={styles.title}>确认饮食记录</h3>
            <div className={styles.details}>
                <div className={styles.row}>
                    <span className={styles.label}>时间</span>
                    <span className={styles.value}>{time}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>内容</span>
                    <span className={styles.value}>{items}</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>热量</span>
                    <span className={styles.value}>~{kcal_estimate} kcal</span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>置信度</span>
                    <span className={styles.value}>{confidence}</span>
                </div>
                {tags.length > 0 && (
                    <div className={styles.tags}>
                        {tags.map((tag) => (
                            <span key={tag} className={styles.tag}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            <div className={styles.actions}>
                <button
                    className={styles.confirmButton}
                    onClick={onApprove}
                    type="button"
                >
                    确认
                </button>
                <button
                    className={styles.outlineButton}
                    onClick={onReject}
                    type="button"
                >
                    取消
                </button>
            </div>
        </div>
    );
}
