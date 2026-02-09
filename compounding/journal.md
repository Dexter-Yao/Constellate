# Compounding Journal

## 2026-02-08: graph.py 模块级代码不可 mock

- **发生了什么**：`graph.py` 包含模块级执行代码（`_init()` + `graph = create_coach_agent()`），`@patch` 装饰器在应用 mock 前需先导入模块，导致真实代码被执行，测试失败（缺少 Azure 凭据）。
- **为什么重要**：模块级副作用与 unittest.mock 的 `@patch` 装饰器不兼容。这是 LangGraph Dev Server 入口模式的固有限制。
- **下次怎么做**：对有模块级副作用的入口文件，使用源码结构验证（检查文件内容）而非运行时导入测试。实际集成靠 `langgraph dev` 手工验证。

## 2026-02-08: langgraph.json 使用文件路径格式

- **发生了什么**：查阅 LangGraph 官方文档确认 `langgraph.json` 的 `graphs` 配置使用文件路径格式 `./src/constellate/graph.py:graph`，而非 Python 模块路径格式 `src.constellate.graph:graph`。
- **为什么重要**：格式错误会导致 `langgraph dev` 无法启动。
- **下次怎么做**：始终以 `./path/to/file.py:variable` 格式配置 langgraph.json。
