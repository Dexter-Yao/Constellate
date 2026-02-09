// ABOUTME: 底部标签栏组件
// ABOUTME: Signal Tower 风格，三等分布局：COACH | MAP | JOURNAL

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./BottomTabBar.module.css";

const tabs = [
    { href: "/", label: "COACH" },
    { href: "/map", label: "MAP" },
    { href: "/journal", label: "JOURNAL" },
] as const;

export function BottomTabBar() {
    const pathname = usePathname();

    const isActive = (href: string) => {
        if (href === "/") return pathname === "/";
        return pathname.startsWith(href);
    };

    return (
        <nav className={styles.tabBar}>
            {tabs.map((tab) => (
                <Link
                    key={tab.href}
                    href={tab.href}
                    className={`${styles.tab} ${isActive(tab.href) ? styles.active : ""}`}
                >
                    {tab.label}
                </Link>
            ))}
        </nav>
    );
}
