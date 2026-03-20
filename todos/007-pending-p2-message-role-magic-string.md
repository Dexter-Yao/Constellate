---
status: pending
priority: p2
issue_id: "007"
tags: [code-review, quality, ios]
dependencies: []
---

# ChatMessage.role 使用裸字符串应改为 enum

## Problem Statement

`ChatMessage.role` 是 `String` 类型，在多处使用字面量 `"user"` 和 `"assistant"` 比较，存在拼写错误风险，无编译期安全保障。

## Findings

- `CoachViewModel.swift:39,46` — 创建消息时使用字面量
- `MessageList.swift:33,80,94,104` — 条件判断中使用字面量

## Proposed Solutions

### Option A: 定义 MessageRole enum（推荐）
```swift
enum MessageRole: String, Codable { case user, assistant }
```
将 `ChatMessage.role: String` 改为 `ChatMessage.role: MessageRole`。
- Effort: Small
- Risk: Low（SwiftData 迁移自动处理 String → String rawValue）

## Acceptance Criteria

- [ ] role 使用 enum 类型
- [ ] 所有比较使用 enum case
- [ ] 无硬编码字符串

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Pattern Recognition Specialist |
