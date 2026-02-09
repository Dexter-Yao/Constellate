<!-- ABOUTME: 项目级 Claude Code 指引，定义开发规范、工具链与产品上下文 -->
<!-- ABOUTME: 正文保持 evergreen；变更记录在末尾独立维护 -->

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 产品上下文

Constellate 是基于教练协议的长期行为对齐系统，减脂为首个落地场景。核心方法论：**S-PDCA（State → Plan → Do → Check → Act）**。

关键参考文档：
- `product_memo.md` — 产品定位、理论基础、系统逻辑与数据架构
- `product_design.md` — 设计系统规范（Starpath Protocol）

## 开发工具链

- Python ≥ 3.12，包管理使用 **uv**（不使用 pip/poetry）
- `pyproject.toml` 为唯一依赖与配置来源
- 运行入口：`uv run main.py`
- 添加依赖：`uv add <package>`

## 代码规范

- 全量类型标注与 docstring
- 所有文件以 `// ABOUTME:` 或对应注释格式开头
- 文档使用正式中文，正文 evergreen，变更日志独立
- 注释说明 WHAT 或 WHY，不提及历史或对比

## 架构约定

- 用户只面对单一 Coach Agent，后台分析对用户透明
- 数据结构采用行为文件系统（每日目录 → 事件文件），非传统数据库
- 单一事实原则贯穿数据链各层
- **简单可组合模式优先**：不引入无消费者的抽象分组，不预设分类体系。需要分组时由消费者按需筛选，而非预先定义层级

---

## 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2026-02-08 | 初始创建：产品上下文、工具链、代码规范与架构约定 |
| 2026-02-08 | 品牌重命名 Aligner → Constellate；设计系统 Wayfarer's Protocol → Starpath Protocol |
| 2026-02-09 | 架构约定新增"简单可组合模式优先"原则 |
