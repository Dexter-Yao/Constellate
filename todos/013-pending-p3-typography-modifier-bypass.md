---
status: pending
priority: p3
issue_id: "013"
tags: [code-review, quality, ios, design-system]
dependencies: []
---

# A2UI 组件和 EventRow 绕过 Typography Modifier

## Problem Statement

多个 A2UI 输入组件和 EventRow 直接使用 `.font(.system(size:))` 而非 `.starpathMono()`/`.starpathSans()` modifier。如果未来 modifier 增加额外样式（行高、letter-spacing），这些位置不会自动生效。

## Findings

- `SliderInput.swift:21` — `.font(.system(size:, design: .monospaced))`
- `TextInput.swift:17` — `.font(.system(size:))`
- `NumberInput.swift:18` — `.font(.system(size:))`
- `SelectInput.swift:68` — `.font(.system(size:))`
- `EventRow.swift:33-34` — `.font(.system(size:, design: .monospaced))`

## Proposed Solutions

### Option A: 统一使用 Typography Modifier
将上述位置替换为 `.starpathMono()` / `.starpathSans()` 调用。
- Effort: Small
- Risk: None

## Acceptance Criteria

- [ ] 所有字体使用 Starpath Typography Modifier
- [ ] 视觉效果不变

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Pattern Recognition Specialist |
