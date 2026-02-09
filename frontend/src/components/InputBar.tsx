// ABOUTME: Input bar component
// ABOUTME: Fixed bottom bar with attachment, text input, voice, and send buttons; supports image upload and speech input

"use client";

import { useState, useRef, useEffect, useCallback, KeyboardEvent } from "react";
import styles from "./InputBar.module.css";

interface InputBarProps {
    onSend: (message: string, imageDataUrl?: string) => void;
    disabled?: boolean;
}

async function compressImage(file: File, maxDim = 1024): Promise<string> {
    return new Promise((resolve) => {
        const img = new window.Image();
        img.onload = () => {
            const canvas = document.createElement("canvas");
            let { width, height } = img;
            if (width > maxDim || height > maxDim) {
                const ratio = Math.min(maxDim / width, maxDim / height);
                width = Math.round(width * ratio);
                height = Math.round(height * ratio);
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d")!.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(img.src);
            resolve(canvas.toDataURL("image/jpeg", 0.8));
        };
        img.src = URL.createObjectURL(file);
    });
}

export function InputBar({ onSend, disabled }: InputBarProps) {
    const [value, setValue] = useState("");
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isRecording, setIsRecording] = useState(false);
    const [hasSpeech, setHasSpeech] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Web Speech API 初始化
    useEffect(() => {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SR) return;
        setHasSpeech(true);
        const recognition = new SR();
        recognition.lang = "en-US";
        recognition.interimResults = true;
        recognition.continuous = false;
        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const transcript = Array.from(event.results)
                .map((r) => r[0].transcript)
                .join("");
            setValue(transcript);
        };
        recognition.onend = () => setIsRecording(false);
        recognition.onerror = () => setIsRecording(false);
        recognitionRef.current = recognition;
    }, []);

    const handleSend = useCallback(() => {
        const trimmed = value.trim();
        if ((!trimmed && !imagePreview) || disabled) return;
        onSend(trimmed, imagePreview ?? undefined);
        setValue("");
        setImagePreview(null);
        inputRef.current?.focus();
    }, [value, imagePreview, disabled, onSend]);

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const dataUrl = await compressImage(file);
        setImagePreview(dataUrl);
        e.target.value = "";
        inputRef.current?.focus();
    };

    const toggleRecording = () => {
        if (!recognitionRef.current) return;
        if (isRecording) {
            recognitionRef.current.stop();
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };

    const hasContent = value.trim() || imagePreview;

    return (
        <div className={styles.container}>
            {imagePreview && (
                <div className={styles.previewStrip}>
                    <div className={styles.previewThumb}>
                        <img src={imagePreview} alt="" />
                        <button
                            type="button"
                            className={styles.removePreview}
                            onClick={() => setImagePreview(null)}
                            aria-label="Remove image"
                        >
                            ×
                        </button>
                    </div>
                </div>
            )}
            <div className={styles.inputRow}>
                <button
                    type="button"
                    className={styles.addButton}
                    onClick={() => fileRef.current?.click()}
                    aria-label="Add image"
                    disabled={disabled}
                >
                    ＋
                </button>
                <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className={styles.fileInput}
                    onChange={handleFileChange}
                    tabIndex={-1}
                />
                <input
                    ref={inputRef}
                    type="text"
                    className={styles.input}
                    placeholder="Message..."
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    disabled={disabled}
                />
                {hasContent ? (
                    <button
                        type="button"
                        className={`${styles.sendButton} ${styles.active}`}
                        onClick={handleSend}
                        disabled={disabled}
                        aria-label="Send"
                    >
                        →
                    </button>
                ) : hasSpeech ? (
                    <button
                        type="button"
                        className={`${styles.micButton} ${isRecording ? styles.recording : ""}`}
                        onClick={toggleRecording}
                        disabled={disabled}
                        aria-label={isRecording ? "Stop recording" : "Voice input"}
                    >
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                            {isRecording ? (
                                <rect x="4" y="4" width="8" height="8" rx="1" fill="currentColor" />
                            ) : (
                                <>
                                    <rect x="6" y="2" width="4" height="8" rx="2" fill="currentColor" />
                                    <path d="M4 8a4 4 0 008 0" stroke="currentColor" strokeWidth="1.5" fill="none" />
                                    <line x1="8" y1="12" x2="8" y2="14" stroke="currentColor" strokeWidth="1.5" />
                                </>
                            )}
                        </svg>
                    </button>
                ) : (
                    <button
                        type="button"
                        className={styles.sendButton}
                        disabled
                        aria-label="Send"
                    >
                        →
                    </button>
                )}
            </div>
        </div>
    );
}
