// ABOUTME: Journal 页面占位
// ABOUTME: V1 暂未实现，显示 Coming Soon

import { BottomTabBar } from "@/components/BottomTabBar";
import styles from "./page.module.css";

export default function JournalPage() {
    return (
        <>
            <main className={styles.container}>
                <h1 className={styles.title}>JOURNAL</h1>
                <p className={styles.subtitle}>Coming Soon</p>
            </main>
            <BottomTabBar />
        </>
    );
}
