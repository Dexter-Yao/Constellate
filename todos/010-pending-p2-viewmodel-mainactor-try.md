---
status: pending
priority: p2
issue_id: "010"
tags: [code-review, quality, ios]
dependencies: []
---

# ViewModel 缺 @MainActor + 多处 try? 沉默吞错误

## Problem Statement

`MapViewModel` 和 `JournalViewModel` 缺少 `@MainActor` 标注（`CoachViewModel` 有），依赖隐式主线程假设。多处 SwiftData 查询使用 `try?` 吞掉错误，无 log 输出，数据查询失败时用户看到空页面但无任何提示。

## Findings

**缺 @MainActor：**
- `MapViewModel.swift:9`
- `JournalViewModel.swift:9`

**try? 吞错误：**
- `CoachViewModel.swift:223`
- `MapViewModel.swift:32-37`
- `JournalViewModel.swift:25`
- `InputBar.swift:134` — 录音启动失败
- `SSEClient.swift:148`

## Proposed Solutions

### Option A: 添加 @MainActor + os.log（推荐）
1. 两个 ViewModel 添加 `@MainActor`
2. `try?` 改为 `do-catch` + `os.log(.error, ...)`
- Effort: Small
- Risk: Low

## Acceptance Criteria

- [ ] 三个 ViewModel 均有 @MainActor
- [ ] 关键 try? 改为 do-catch + log
- [ ] 编译无 concurrency 警告

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Pattern Recognition Specialist |
