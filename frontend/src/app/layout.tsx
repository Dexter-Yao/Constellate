// ABOUTME: 全局布局组件
// ABOUTME: 配置 Constellate 应用的元数据和字体

import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Constellate",
  description: "Your Leadership Coach for Weight-Losing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
