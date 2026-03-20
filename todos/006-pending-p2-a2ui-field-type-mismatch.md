---
status: pending
priority: p2
issue_id: "006"
tags: [code-review, architecture, protocol]
dependencies: []
---

# 前后端 A2UI 字段类型不一致（4 个字段）

## Problem Statement

后端 A2UI 组件的 4 个字段使用默认空值（`str = ""`, `list[str] = []`），而 iOS 端对应字段为 Optional（`String?`, `[String]?`）。虽然 JSON 传输中空字符串不会导致 Optional 解码失败，但类型语义不一致增加维护风险。

## Findings

- `ImageComponent.alt`: 后端 `str = ""` vs iOS `String?` — `a2ui.py:31` vs `A2UITypes.swift:106`
- `TextInputComponent.value`: 后端 `str = ""` vs iOS `String?` — `a2ui.py:68` vs `A2UITypes.swift:132`
- `SelectComponent.value`: 后端 `str = ""` vs iOS `String?` — `a2ui.py:88` vs `A2UITypes.swift:148`
- `MultiSelectComponent.value`: 后端 `list[str] = []` vs iOS `[String]?` — `a2ui.py:98` vs `A2UITypes.swift:156`

## Proposed Solutions

### Option A: 后端改为 Optional（推荐）
将后端 4 个字段改为 `str | None = None` / `list[str] | None = None`，与 iOS 对齐。
- Effort: Small
- Risk: Low（需验证 Pydantic 序列化行为）

### Option B: iOS 改为非 Optional
将 iOS 端改为 `let alt: String = ""`，与后端对齐。
- Effort: Small
- Risk: Low

## Acceptance Criteria

- [ ] 前后端 A2UI 所有字段类型语义一致
- [ ] A2UI 相关测试全部通过

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Pattern Recognition Specialist |
