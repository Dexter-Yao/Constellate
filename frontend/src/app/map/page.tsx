// ABOUTME: Map 页面占位
// ABOUTME: V1 暂未实现，显示 Coming Soon

import { BottomTabBar } from "@/components/BottomTabBar";
import styles from "./page.module.css";

export default function MapPage() {
    return (
        <>
            <main className={styles.container}>
                <h1 className={styles.title}>MAP</h1>
                <p className={styles.subtitle}>Coming Soon</p>
            </main>
            <BottomTabBar />
        </>
    );
}
