// ABOUTME: A2UI component renderer
// ABOUTME: Dynamically renders all 7 UI primitives and collects input values for A2UIResponse

"use client";

import { useState, useCallback } from "react";
import type { Component, A2UIResponse } from "@/lib/types";
import styles from "./A2UIRenderer.module.css";

interface A2UIRendererProps {
    components: Component[];
    onSubmit: (response: A2UIResponse) => void;
    onReject: () => void;
    onSkip: () => void;
}

export function A2UIRenderer({
    components,
    onSubmit,
    onReject,
    onSkip,
}: A2UIRendererProps) {
    const [values, setValues] = useState<Record<string, unknown>>(() => {
        const initial: Record<string, unknown> = {};
        for (const comp of components) {
            if ("name" in comp) {
                if (comp.kind === "slider") {
                    initial[comp.name] = comp.value ?? comp.min ?? 1;
                } else if (comp.kind === "multi_select") {
                    initial[comp.name] = comp.value ?? [];
                } else if (comp.kind === "number_input") {
                    initial[comp.name] = comp.value ?? null;
                } else {
                    initial[comp.name] = comp.value ?? "";
                }
            }
        }
        return initial;
    });

    const updateValue = useCallback((name: string, value: unknown) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = () => {
        onSubmit({ action: "submit", data: values });
    };

    const hasInputs = components.some((c) => "name" in c);

    return (
        <div className={styles.renderer}>
            <div className={styles.components}>
                {components.map((comp, i) => (
                    <ComponentRenderer
                        key={`${comp.kind}-${i}`}
                        component={comp}
                        value={"name" in comp ? values[comp.name] : undefined}
                        onChange={updateValue}
                    />
                ))}
            </div>
            <div className={styles.actions}>
                {hasInputs && (
                    <button
                        className={styles.submitButton}
                        onClick={handleSubmit}
                        type="button"
                    >
                        Submit
                    </button>
                )}
                <button
                    className={styles.outlineButton}
                    onClick={hasInputs ? onReject : onSkip}
                    type="button"
                >
                    {hasInputs ? "Cancel" : "Close"}
                </button>
            </div>
        </div>
    );
}

// ── Individual Component Renderers ──

interface ComponentRendererProps {
    component: Component;
    value: unknown;
    onChange: (name: string, value: unknown) => void;
}

function ComponentRenderer({ component, value, onChange }: ComponentRendererProps) {
    switch (component.kind) {
        case "text":
            return <p className={styles.text}>{component.content}</p>;

        case "image":
            return (
                <div className={styles.imageContainer}>
                    <img
                        src={component.src}
                        alt={component.alt || ""}
                        className={styles.image}
                    />
                </div>
            );

        case "slider":
            return (
                <div className={styles.sliderGroup}>
                    <div className={styles.sliderLabel}>
                        <span className={styles.label}>{component.label}</span>
                        <span className={styles.sliderValue}>
                            {value as number}
                        </span>
                    </div>
                    <input
                        type="range"
                        min={component.min ?? 1}
                        max={component.max ?? 10}
                        step={component.step ?? 1}
                        value={value as number}
                        onChange={(e) =>
                            onChange(component.name, parseInt(e.target.value))
                        }
                        className={styles.slider}
                    />
                </div>
            );

        case "text_input":
            return (
                <div className={styles.inputGroup}>
                    <label className={styles.label}>{component.label}</label>
                    <textarea
                        className={styles.textInput}
                        placeholder={component.placeholder || ""}
                        value={(value as string) || ""}
                        onChange={(e) => onChange(component.name, e.target.value)}
                        rows={2}
                    />
                </div>
            );

        case "number_input":
            return (
                <div className={styles.inputGroup}>
                    <label className={styles.label}>
                        {component.label}
                        {component.unit && (
                            <span className={styles.unit}> ({component.unit})</span>
                        )}
                    </label>
                    <input
                        type="number"
                        className={styles.numberInput}
                        value={value != null ? String(value) : ""}
                        onChange={(e) =>
                            onChange(
                                component.name,
                                e.target.value ? parseFloat(e.target.value) : null
                            )
                        }
                    />
                </div>
            );

        case "select":
            return (
                <div className={styles.inputGroup}>
                    {component.label && (
                        <label className={styles.label}>{component.label}</label>
                    )}
                    <div className={styles.optionGroup}>
                        {component.options.map((opt) => (
                            <button
                                key={opt.value}
                                className={`${styles.optionButton} ${
                                    value === opt.value ? styles.selected : ""
                                }`}
                                onClick={() => onChange(component.name, opt.value)}
                                type="button"
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            );

        case "multi_select":
            return (
                <div className={styles.inputGroup}>
                    {component.label && (
                        <label className={styles.label}>{component.label}</label>
                    )}
                    <div className={styles.optionGroup}>
                        {component.options.map((opt) => {
                            const selected = (value as string[] || []).includes(opt.value);
                            return (
                                <button
                                    key={opt.value}
                                    className={`${styles.optionButton} ${
                                        selected ? styles.selected : ""
                                    }`}
                                    onClick={() => {
                                        const current = (value as string[]) || [];
                                        const next = selected
                                            ? current.filter((v) => v !== opt.value)
                                            : [...current, opt.value];
                                        onChange(component.name, next);
                                    }}
                                    type="button"
                                >
                                    {opt.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            );

        default:
            return null;
    }
}
