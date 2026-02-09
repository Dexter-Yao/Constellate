<!-- ABOUTME: 项目长期学习日志 -->
<!-- ABOUTME: 记录失败、修正、决策，供后续会话参考 -->

# Compounding Journal

## 2026-02-09: Pydantic V2 Union 类型内省

- **发生了什么**: 测试 `StructuredEventType.__args__` 中各类型的 `type` 字段默认值时，使用 `__fields__["type"].default` 触发 PydanticDeprecatedSince20 警告。
- **原因**: Pydantic V2 弃用了 `__fields__`，改用 `model_fields`。
- **下次怎么做**: 使用 `Model.model_fields["field_name"].default` 获取字段默认值。

## 2026-02-09: DeepAgent MemoryMiddleware 约定

- **发生了什么**: 调查 DeepAgent 框架的 MemoryMiddleware，发现它通过 `memory=["/path/to/AGENTS.md"]` 参数启用，会话启动时自动加载指定文件到系统提示词，Agent 通过 `edit_file` 更新。
- **原因**: 这是框架原生的跨会话长期记忆机制，比自建 `session_notes.md` 更可靠。
- **下次怎么做**: 优先使用框架内置机制，自建方案仅作为 fallback。

## 2026-02-09: Coach 响应延迟根因

- **发生了什么**: Coach 每轮对话写入 message 事件导致 10+ 秒响应延迟。
- **原因**: `write_file` 工具调用发生在回复用户之前，工具调用开销叠加到用户感知的响应时间。
- **下次怎么做**: 对话实时响应优先，数据写入异步执行（用户静默 ≥ 5 分钟后触发）。

## 2026-02-09: 生成式内容的正确定位

- **发生了什么**: 初版方案以"视觉/图像"为中心命名和设计体验式干预系统，被纠正为以教练目的为中心。
- **原因**: 生成式内容（图像等）是传递手段，不是目的。核心价值在于时机、内容、情感传递。命名应反映功能意图（intervention_composer, experiential_intervention），而非技术实现（image_generator, generate_image）。
- **下次怎么做**: 命名和架构设计围绕"为什么做"而非"怎么做"。技术手段可变，教练目的稳定。

## 2026-02-09: Gemini API 验证

- **发生了什么**: 参考文档中的 Gemini API 调用方式过时（模型名、配置参数均有误），导致初版代码使用了错误的 API。
- **原因**: 内部文档未及时更新，且 Gemini API 迭代频繁。
- **下次怎么做**: 参考文档作为起点，始终通过官方文档或 SDK 源码独立验证 API 调用方式。当前正确用法：`model="gemini-3-pro-image-preview"`, `image_config=types.ImageConfig(aspect_ratio=...)`。

## 2026-02-09: 避免虚假分类

- **发生了什么**: 最初将事件分为 StructuredEventType / NonStructuredEventType，但所有事件实际上都有 Pydantic schema，"非结构化"名不副实。
- **原因**: 分类依据（可量化 vs 定性）没有准确反映在命名上，且没有代码消费这两个 union type。
- **下次怎么做**: YAGNI——不创建无消费者的抽象分组。等真正需要分组时再引入，届时分组依据会更清晰。简单 + 可组合优先。
