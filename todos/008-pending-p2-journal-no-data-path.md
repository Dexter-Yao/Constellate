---
status: pending
priority: p2
issue_id: "008"
tags: [code-review, architecture, feature]
dependencies: []
---

# Journal 页无数据写入路径 — 永远显示空状态

## Problem Statement

`BehaviorEvent` SwiftData 模型和 Journal 展示逻辑（JournalView/JournalViewModel/EventRow）完整实现，但整个 iOS 代码库中没有任何 `modelContext.insert(BehaviorEvent(...))` 调用。Coach Agent 将事件写入后端 `/user/ledger/`，但数据从不传递到 iOS。Journal 页当前不可用。

## Findings

- `JournalViewModel.swift:19-37` — 查询逻辑完整但永远返回空
- `BehaviorEvent.swift` — 模型定义完整
- 后端 Coach 写 ledger 在文件系统，无到 iOS 的同步通道
- 事件类型三方不一致：prompt 10 种 vs schemas.py 7 种 vs iOS enum 7 种

## Proposed Solutions

### Option A: SSE 流中携带事件元数据
Coach 回复消息中附带结构化事件 JSON，iOS 解析后写入 SwiftData。
- Pros: 实时同步，无额外 API
- Cons: 增加 SSE payload 复杂度
- Effort: Medium

### Option B: iOS 定期拉取 LangGraph Store
iOS 端定期调用 LangGraph Store API 获取 `/user/ledger/` 数据。
- Pros: 解耦，后端无需改动
- Cons: 非实时，需新 API 端点
- Effort: Medium

## Acceptance Criteria

- [ ] Journal 页可展示用户行为事件
- [ ] 事件类型前后端一致

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Architecture Strategist |
