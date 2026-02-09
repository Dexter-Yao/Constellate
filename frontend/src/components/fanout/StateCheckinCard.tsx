// ABOUTME: 状态签到卡片
// ABOUTME: 滑块采集用户能量、饥饿、压力、情绪状态

"use client";

import { useState } from "react";
import styles from "./StateCheckinCard.module.css";

interface StateCheckinCardProps {
    energy: number;
    hunger: number;
    stress: number;
    mood: number;
    note: string;
    onApprove: () => void;
    onEdit: (name: string, args: Record<string, unknown>) => void;
    onReject: () => void;
}

const SLIDER_LABELS: Record<string, string> = {
    energy: "能量",
    hunger: "饥饿",
    stress: "压力",
    mood: "情绪",
};

export function StateCheckinCard({
    energy: initialEnergy,
    hunger: initialHunger,
    stress: initialStress,
    mood: initialMood,
    note: initialNote,
    onEdit,
    onReject,
}: StateCheckinCardProps) {
    const [values, setValues] = useState({
        energy: initialEnergy || 5,
        hunger: initialHunger || 5,
        stress: initialStress || 5,
        mood: initialMood || 5,
    });
    const [note, setNote] = useState(initialNote || "");

    const handleSliderChange = (key: string, val: number) => {
        setValues((prev) => ({ ...prev, [key]: val }));
    };

    const handleSubmit = () => {
        onEdit("state_checkin", { ...values, note });
    };

    return (
        <div className={styles.card}>
            <h3 className={styles.title}>状态签到</h3>
            <div className={styles.sliders}>
                {Object.entries(SLIDER_LABELS).map(([key, label]) => (
                    <div key={key} className={styles.sliderGroup}>
                        <div className={styles.sliderLabel}>
                            <span className={styles.label}>{label}</span>
                            <span className={styles.sliderValue}>
                                {values[key as keyof typeof values]}
                            </span>
                        </div>
                        <input
                            type="range"
                            min={1}
                            max={10}
                            value={values[key as keyof typeof values]}
                            onChange={(e) =>
                                handleSliderChange(key, parseInt(e.target.value))
                            }
                            className={styles.slider}
                        />
                    </div>
                ))}
            </div>
            <textarea
                className={styles.noteInput}
                placeholder="备注（可选）"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
            />
            <div className={styles.actions}>
                <button
                    className={styles.confirmButton}
                    onClick={handleSubmit}
                    type="button"
                >
                    提交
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
