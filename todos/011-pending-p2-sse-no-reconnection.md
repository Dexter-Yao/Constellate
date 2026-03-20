---
status: pending
priority: p2
issue_id: "011"
tags: [code-review, performance, ios, resilience]
dependencies: []
---

# SSE 流无重连逻辑

## Problem Statement

SSEClient 网络断开时直接 yield `.error` 并结束。在移动网络（iOS 主要使用场景），瞬断频繁，用户看到流中断、收到错误、需手动重发。无指数退避重试。

## Findings

- `SSEClient.swift:76` — error case 直接 finish
- `CoachViewModel` 无 retry 逻辑

## Proposed Solutions

### Option A: CoachViewModel 层重试（推荐）
在 `processStream` 捕获 transient 网络错误，指数退避重试（1s, 2s, 4s，最多 3 次）。
- Effort: Medium (~40 行)
- Risk: Low

## Acceptance Criteria

- [ ] 网络瞬断自动重连
- [ ] 最多重试 3 次
- [ ] 重试期间显示状态指示

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Performance Oracle Agent |
