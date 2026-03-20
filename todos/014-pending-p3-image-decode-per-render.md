---
status: pending
priority: p3
issue_id: "014"
tags: [code-review, performance, ios]
dependencies: []
---

# Base64 图片每次渲染重复解码 + 逻辑重复

## Problem Statement

A2UIRenderer、MessageList、CardGallery 中 base64 图片/UIImage 解码在每次 SwiftUI 渲染时重新执行。同时 base64 data URL 解码逻辑在 A2UIRenderer 和 CoachViewModel 中重复。

## Findings

**每次渲染解码：**
- `A2UIRenderer.swift:49-59` — `decodeBase64Image` + `UIImage(data:)` per render
- `MessageList.swift:84` — `UIImage(data:)` per render
- `CardGallery.swift:33-38` — `UIImage(data:)` per render

**逻辑重复：**
- `A2UIRenderer.swift:171-175` — `decodeBase64Image` 函数
- `CoachViewModel.swift:186-189` — inline 相同逻辑

## Proposed Solutions

### Option A: onAppear 预解码 + 提取公共方法
1. 在 `onAppear` 解码图片存入 `@State`
2. 提取 `DataURLDecoder.decode(_:) -> Data?` 公共方法
- Effort: Small
- Risk: None

## Acceptance Criteria

- [ ] 图片仅解码一次
- [ ] base64 解码逻辑无重复
- [ ] 滚动性能改善

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Performance Oracle + Pattern Recognition |
