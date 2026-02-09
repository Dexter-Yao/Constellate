// ABOUTME: Map 页面 - Coach 卡片归档视图
// ABOUTME: 展示 Chapter 元数据和体验式干预卡片，支持浏览和删除

"use client";

import { useState, useEffect } from "react";
import { BottomTabBar } from "@/components/BottomTabBar";
import {  InterventionCard, ChapterMetadata } from "@/lib/types";
import styles from "./page.module.css";

// 临时 mock 数据（后续替换为真实 API）
const MOCK_CHAPTER: ChapterMetadata = {
    identityStatement: "一个在复杂环境中仍能做出清晰选择的人",
    goal: "-8kg",
    currentDay: 12,
    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
};

const MOCK_CARDS: InterventionCard[] = [
    {
        id: "card_001",
        imageUrl: "/demo-images/card_001_future_self.jpg",
        caption: "你在一张安静的书桌前，桌上放着一本打开的笔记本。笔记本上没有记录数字，而是记录了每次选择背后的理由。这是一个能够理解自己行为模式的人——不是因为完美，而是因为清晰。",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        purpose: "future_self",
    },
    {
        id: "card_002",
        imageUrl: "/demo-images/card_002_scene_rehearsal.jpg",
        caption: "晚餐聚会的场景：桌上摆满食物，但你的手边放着一杯水。你在和朋友聊天，食物只是背景。这不是克制，而是此刻你真正需要的是连接，而不是食物。",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        purpose: "scene_rehearsal",
    },
    {
        id: "card_003",
        imageUrl: "/demo-images/card_003_reframe_contrast.jpg",
        caption: "同一个场景，两种视角：左边是「我又失控了」的视角——充满自责；右边是「这里地形复杂」的视角——充满信息。同一次应酬晚餐的摄入波动，在不同框架下有完全不同的意义。",
        timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        purpose: "reframe_contrast",
    },
];

export default function MapPage() {
    const [cards, setCards] = useState<InterventionCard[]>([]);
    const [chapter, setChapter] = useState<ChapterMetadata | null>(null);
    const [selectedCard, setSelectedCard] = useState<InterventionCard | null>(null);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState<string | null>(null);

    useEffect(() => {
        // 加载 mock 数据
        setChapter(MOCK_CHAPTER);
        setCards(MOCK_CARDS);
        // TODO: 替换为真实 API 调用
        // fetchMapData().then((data) => {
        //     setChapter(data.chapter);
        //     setCards(data.cards);
        // });
    }, []);

    const handleCardClick = (card: InterventionCard) => {
        setSelectedCard(card);
        setIsFullScreen(true);
    };

    const handleCloseFullScreen = () => {
        setIsFullScreen(false);
        setSelectedCard(null);
    };

    const handleDeleteClick = (cardId: string, event?: React.MouseEvent) => {
        if (event) {
            event.stopPropagation(); // 防止触发卡片点击
        }
        setCardToDelete(cardId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!cardToDelete) return;

        // 乐观更新
        const originalCards = [...cards];
        setCards(cards.filter((c) => c.id !== cardToDelete));
        setIsDeleteDialogOpen(false);
        setIsFullScreen(false);
        setSelectedCard(null);
        setCardToDelete(null);

        try {
            // TODO: 替换为真实 API 调用
            // await deleteCard(cardToDelete);
            console.log("Deleted card:", cardToDelete);
        } catch (error) {
            // 失败回滚
            setCards(originalCards);
            alert("删除失败，请重试");
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "今天";
        if (diffDays === 1) return "昨天";
        return `${diffDays} 天前`;
    };

    const getPurposeLabel = (purpose: InterventionCard["purpose"]) => {
        const labels = {
            future_self: "未来自我对话",
            scene_rehearsal: "场景预演",
            metaphor_mirror: "隐喻镜像",
            reframe_contrast: "认知重构",
            identity_evolution: "身份演化",
        };
        return labels[purpose];
    };

    return (
        <>
            <main className={styles.container}>
                {/* Chapter 元数据 */}
                {chapter && (
                    <div className={styles.chapterMetadata}>
                        <p className={styles.identityStatement}>{chapter.identityStatement}</p>
                        <p className={styles.goalLabel}>
                            目标：{chapter.goal} · 第 {chapter.currentDay} 天
                        </p>
                    </div>
                )}

                {/* 卡片列表或空状态 */}
                <div className={styles.cardsSection}>
                    {cards.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyMessage}>
                                还没有教练洞察卡片
                                <br />
                                <br />
                                Coach 会在关键时刻
                                <br />
                                为你生成可视化干预
                            </p>
                        </div>
                    ) : (
                        cards.map((card) => (
                            <div
                                key={card.id}
                                className={styles.interventionCard}
                                onClick={() => handleCardClick(card)}
                            >
                                <button
                                    className={styles.deleteButton}
                                    onClick={(e) => handleDeleteClick(card.id, e)}
                                    aria-label="删除"
                                >
                                    ×
                                </button>
                                <img
                                    src={card.imageUrl}
                                    alt={getPurposeLabel(card.purpose)}
                                    className={styles.cardImage}
                                />
                                <p className={styles.cardCaption}>{card.caption}</p>
                                <p className={styles.cardTimestamp}>
                                    {formatTimestamp(card.timestamp)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* 全屏查看模式 */}
            {isFullScreen && selectedCard && (
                <div className={styles.fullScreenOverlay}>
                    <div className={styles.fullScreenHeader}>
                        <button className={styles.backButton} onClick={handleCloseFullScreen}>
                            ← 返回
                        </button>
                        <button
                            className={styles.deleteButtonFull}
                            onClick={() => handleDeleteClick(selectedCard.id)}
                        >
                            删除
                        </button>
                    </div>
                    <div className={styles.fullScreenContent}>
                        <img
                            src={selectedCard.imageUrl}
                            alt={getPurposeLabel(selectedCard.purpose)}
                            className={styles.fullScreenImage}
                        />
                        <p className={styles.fullScreenCaption}>{selectedCard.caption}</p>
                        <p className={styles.fullScreenFooter}>
                            {formatTimestamp(selectedCard.timestamp)} ·{" "}
                            {getPurposeLabel(selectedCard.purpose)}
                        </p>
                    </div>
                </div>
            )}

            {/* 删除确认对话框 */}
            {isDeleteDialogOpen && (
                <div className={styles.dialogOverlay} onClick={handleCancelDelete}>
                    <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.dialogTitle}>确认删除这条教练洞察？</h2>
                        <div className={styles.dialogButtons}>
                            <button className={styles.cancelButton} onClick={handleCancelDelete}>
                                取消
                            </button>
                            <button className={styles.confirmButton} onClick={handleConfirmDelete}>
                                确认删除
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomTabBar />
        </>
    );
}
