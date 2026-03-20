---
status: pending
priority: p2
issue_id: "012"
tags: [code-review, quality, backend]
dependencies: []
---

# Gemini API 调用无错误处理

## Problem Statement

`experiential.py` 调用 Gemini API 生成图片时零错误处理。API 返回错误、无 candidates、parts 为空时，代码将崩溃并抛出 IndexError 或 AttributeError。同时 API key 直接 `os.environ["GEMINI_API_KEY"]` 访问，缺失时抛出裸 KeyError 暴露变量名。

## Findings

- `experiential.py:96-111` — 无 try/except，无空值检查
- `experiential.py:96` — `os.environ["GEMINI_API_KEY"]` 无 `.get()` 保护
- 变量 `response` 被后续 A2UI response 覆盖（shadowing）

## Proposed Solutions

### Option A: 添加防御性检查（推荐）
```python
if not response.candidates or not response.candidates[0].content.parts:
    return "Failed to generate intervention content."
```
加上 `os.environ.get("GEMINI_API_KEY")` + 描述性 ValueError。
- Effort: Small (~10 行)
- Risk: None

## Acceptance Criteria

- [ ] Gemini API 失败不导致进程崩溃
- [ ] 返回用户友好的错误信息
- [ ] 环境变量缺失有明确错误

## Work Log

| Date | Action | Learnings |
|------|--------|-----------|
| 2026-03-20 | 全库审查发现 | Kieran Python Reviewer |
