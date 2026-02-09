// ABOUTME: Journal page
// ABOUTME: Displays all behavioral events from the ledger, grouped by date

"use client";

import { useState, useEffect } from "react";
import { Client } from "@langchain/langgraph-sdk";
import { BottomTabBar } from "@/components/BottomTabBar";
import styles from "./page.module.css";

const API_URL = process.env.NEXT_PUBLIC_LANGGRAPH_API_URL || "http://localhost:2024";

interface LedgerEvent {
    ts: string;
    type: string;
    summary?: string;
    evidence?: string;
    [key: string]: unknown;
}

interface DayGroup {
    date: string;
    events: LedgerEvent[];
}

const EVENT_LABELS: Record<string, string> = {
    meal: "Meal",
    exercise: "Exercise",
    weigh_in: "Weight",
    water_intake: "Hydration",
    state_checkin: "Check-in",
    sleep: "Sleep",
    goal: "Goal",
    reflection: "Reflection",
    craving: "Craving",
    app_action: "Action",
};

function formatTime(ts: string): string {
    try {
        const d = new Date(ts);
        return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

function getEventSummary(event: LedgerEvent): string {
    if (event.summary) return event.summary;
    if (event.insight) return event.insight as string;
    if (event.action) return event.action as string;
    if (event.trigger) return event.trigger as string;
    if (event.weight_kg) return `${event.weight_kg} kg`;
    if (event.water_ml) return `${event.water_ml} ml`;
    if (event.hours) return `${event.hours}h sleep`;
    return event.type;
}

export default function JournalPage() {
    const [groups, setGroups] = useState<DayGroup[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const client = new Client({ apiUrl: API_URL });
                const result = await client.store.searchItems(
                    ["constellate", "user"],
                    { limit: 200, filter: { prefix: "ledger/" } }
                );

                const events: LedgerEvent[] = [];
                for (const item of result.items) {
                    if (item.value && typeof item.value === "object") {
                        events.push(item.value as LedgerEvent);
                    }
                }

                events.sort((a, b) => {
                    const ta = a.ts || "";
                    const tb = b.ts || "";
                    return tb.localeCompare(ta);
                });

                const grouped = new Map<string, LedgerEvent[]>();
                for (const event of events) {
                    const date = event.ts
                        ? new Date(event.ts).toISOString().slice(0, 10)
                        : "Unknown";
                    if (!grouped.has(date)) grouped.set(date, []);
                    grouped.get(date)!.push(event);
                }

                setGroups(
                    Array.from(grouped.entries()).map(([date, evts]) => ({
                        date,
                        events: evts,
                    }))
                );
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : "Failed to load events"
                );
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return (
        <>
            <main className={styles.container}>
                <h1 className={styles.title}>JOURNAL</h1>

                {loading && <p className={styles.subtitle}>Loading...</p>}

                {error && <p className={styles.subtitle}>{error}</p>}

                {!loading && !error && groups.length === 0 && (
                    <p className={styles.subtitle}>
                        No events recorded yet. Start a conversation with your Coach.
                    </p>
                )}

                <div className={styles.timeline}>
                    {groups.map((group) => (
                        <div key={group.date} className={styles.dayGroup}>
                            <h2 className={styles.dateHeader}>{group.date}</h2>
                            <div className={styles.eventList}>
                                {group.events.map((event, i) => (
                                    <div
                                        key={`${event.ts}-${i}`}
                                        className={styles.eventCard}
                                    >
                                        <div className={styles.eventHeader}>
                                            <span className={styles.eventType}>
                                                {EVENT_LABELS[event.type] || event.type}
                                            </span>
                                            <span className={styles.eventTime}>
                                                {formatTime(event.ts)}
                                            </span>
                                        </div>
                                        <p className={styles.eventSummary}>
                                            {getEventSummary(event)}
                                        </p>
                                        {event.evidence && (
                                            <p className={styles.eventEvidence}>
                                                &ldquo;{event.evidence}&rdquo;
                                            </p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            <BottomTabBar />
        </>
    );
}
