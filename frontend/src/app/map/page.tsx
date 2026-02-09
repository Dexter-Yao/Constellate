// ABOUTME: Map page — Coach card archive view
// ABOUTME: Gallery display of chapter metadata and experiential intervention cards with browse and delete

"use client";

import { useState, useEffect } from "react";
import { Client } from "@langchain/langgraph-sdk";
import { BottomTabBar } from "@/components/BottomTabBar";
import { InterventionCard, ChapterMetadata } from "@/lib/types";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:2024";
const INTERVENTIONS_NAMESPACE = ["constellate", "user", "interventions"];

const MOCK_CHAPTER: ChapterMetadata = {
    identityStatement: "Someone who makes clear choices in complex environments",
    goal: "-8kg",
    currentDay: 12,
    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
};

const MOCK_CARDS: InterventionCard[] = [
    {
        id: "card_001",
        imageUrl: "/demo-images/card_001_future_self.jpg",
        caption: "You're sitting at a quiet desk with an open notebook. The notebook doesn't track numbers — it records the reasons behind each choice. This is someone who understands their own behavioral patterns — not because of perfection, but because of clarity.",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        purpose: "future_self",
    },
    {
        id: "card_002",
        imageUrl: "/demo-images/card_002_scene_rehearsal.jpg",
        caption: "A dinner gathering: the table is full of food, but there's a glass of water by your hand. You're chatting with friends — food is just the backdrop. This isn't restraint. What you truly need right now is connection, not food.",
        timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        purpose: "scene_rehearsal",
    },
    {
        id: "card_003",
        imageUrl: "/demo-images/card_003_reframe_contrast.jpg",
        caption: "Same scene, two perspectives: on the left, the \"I lost control again\" view — full of self-blame; on the right, the \"the terrain here is complex\" view — full of information. The same dinner intake fluctuation carries entirely different meaning under different frames.",
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
        setChapter(MOCK_CHAPTER);

        async function fetchCards() {
            try {
                const client = new Client({ apiUrl: API_URL });
                const result = await client.store.searchItems(
                    INTERVENTIONS_NAMESPACE,
                    { limit: 100 }
                );

                const storeCards: InterventionCard[] = result.items.map((item) => ({
                    id: item.key,
                    imageUrl: (item.value as Record<string, unknown>).imageUrl as string,
                    caption: (item.value as Record<string, unknown>).caption as string,
                    timestamp: new Date((item.value as Record<string, unknown>).timestamp as string),
                    purpose: (item.value as Record<string, unknown>).purpose as InterventionCard["purpose"],
                }));

                const allCards = [...MOCK_CARDS, ...storeCards].sort(
                    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
                );
                setCards(allCards);
            } catch {
                setCards(MOCK_CARDS);
            }
        }

        fetchCards();
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
            event.stopPropagation();
        }
        setCardToDelete(cardId);
        setIsDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!cardToDelete) return;

        // Optimistic update
        const originalCards = [...cards];
        setCards(cards.filter((c) => c.id !== cardToDelete));
        setIsDeleteDialogOpen(false);
        setIsFullScreen(false);
        setSelectedCard(null);
        setCardToDelete(null);

        try {
            const isMockCard = MOCK_CARDS.some((c) => c.id === cardToDelete);
            if (!isMockCard) {
                const client = new Client({ apiUrl: API_URL });
                await client.store.deleteItem(
                    INTERVENTIONS_NAMESPACE,
                    cardToDelete
                );
            }
        } catch {
            setCards(originalCards);
            alert("Delete failed, please try again");
        }
    };

    const handleCancelDelete = () => {
        setIsDeleteDialogOpen(false);
        setCardToDelete(null);
    };

    const formatTimestamp = (date: Date) => {
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 0) return "today";
        if (diffDays === 1) return "yesterday";
        return `${diffDays} days ago`;
    };

    const getPurposeLabel = (purpose: InterventionCard["purpose"]) => {
        const labels = {
            future_self: "Future Self",
            scene_rehearsal: "Scene Rehearsal",
            metaphor_mirror: "Metaphor Mirror",
            reframe_contrast: "Reframe Contrast",
            identity_evolution: "Identity Evolution",
        };
        return labels[purpose];
    };

    return (
        <>
            <main className={styles.container}>
                {/* Chapter metadata */}
                {chapter && (
                    <div className={styles.chapterMetadata}>
                        <p className={styles.identityStatement}>{chapter.identityStatement}</p>
                        <p className={styles.goalLabel}>
                            Goal: {chapter.goal} · Day {chapter.currentDay}
                        </p>
                    </div>
                )}

                {/* Card gallery or empty state */}
                <div className={styles.cardsSection}>
                    {cards.length === 0 ? (
                        <div className={styles.emptyState}>
                            <p className={styles.emptyMessage}>
                                No coaching insights yet
                                <br />
                                <br />
                                Coach will create visual
                                <br />
                                interventions at key moments
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
                                    aria-label="Delete"
                                >
                                    ×
                                </button>
                                <img
                                    src={card.imageUrl}
                                    alt={getPurposeLabel(card.purpose)}
                                    className={styles.cardImage}
                                />
                                <p className={styles.cardPurpose}>
                                    {getPurposeLabel(card.purpose)}
                                </p>
                                <p className={styles.cardTimestamp}>
                                    {formatTimestamp(card.timestamp)}
                                </p>
                            </div>
                        ))
                    )}
                </div>
            </main>

            {/* Full-screen view */}
            {isFullScreen && selectedCard && (
                <div className={styles.fullScreenOverlay}>
                    <div className={styles.fullScreenHeader}>
                        <button className={styles.backButton} onClick={handleCloseFullScreen}>
                            ← Back
                        </button>
                        <button
                            className={styles.deleteButtonFull}
                            onClick={() => handleDeleteClick(selectedCard.id)}
                        >
                            Delete
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

            {/* Delete confirmation dialog */}
            {isDeleteDialogOpen && (
                <div className={styles.dialogOverlay} onClick={handleCancelDelete}>
                    <div className={styles.dialogContent} onClick={(e) => e.stopPropagation()}>
                        <h2 className={styles.dialogTitle}>Delete this coaching insight?</h2>
                        <div className={styles.dialogButtons}>
                            <button className={styles.cancelButton} onClick={handleCancelDelete}>
                                Cancel
                            </button>
                            <button className={styles.confirmButton} onClick={handleConfirmDelete}>
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <BottomTabBar />
        </>
    );
}
