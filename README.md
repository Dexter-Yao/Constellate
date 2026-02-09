<!-- ABOUTME: 项目开发环境启动与调试指南 -->
<!-- ABOUTME: 涵盖后端 API、前端页面、Studio 三种访问方式 -->

# Constellate 开发指南

## 1. 启动后端（LangGraph API）

```bash
cd "/Users/dexter/Documents/LLM Projects/Constellate"
uv run langgraph dev --port 2024 --tunnel
```

- `--tunnel` 创建 Cloudflare HTTPS 隧道，供 Studio 使用
- 每次启动隧道域名不同，需要用当次输出的 URL

启动后终端输出：

```
🚀 API: http://127.0.0.1:2024
🎨 Studio UI: https://smith.langchain.com/studio/?baseUrl=https://xxx-xxx.trycloudflare.com
📚 API Docs: https://xxx-xxx.trycloudflare.com/docs
```

如果只需本地前端测试，可省略 `--tunnel`：

```bash
uv run langgraph dev --port 2024
```

## 2. 启动前端（Next.js）

```bash
cd frontend
npm run dev
```

默认 http://localhost:3000，端口被占用时自动递增。

前端通过 `frontend/.env.local` 中的 `NEXT_PUBLIC_LANGGRAPH_API_URL` 连接后端，默认指向 `http://localhost:2024`。

## 3. Studio（远程调试）

打开终端输出的 Studio UI URL：

```
https://smith.langchain.com/studio/?baseUrl=https://xxx-xxx.trycloudflare.com
```

首次使用新域名时，需在 Studio 页面底部 **Advanced Settings** 中将该域名加入 allowed list。

### Studio 调试用法

| 操作 | 怎么做 |
|------|--------|
| 对话测试 | 左上角切 Chat 模式，直接发消息 |
| 查看执行链 | 切 Graph 模式，节点会按执行顺序高亮 |
| 检查工具调用 | 点击 tools 节点，看 Coach 写了什么文件、参数是什么 |
| 查看 State | 每个节点右侧面板显示当前 state 快照 |
| 中断调试 | Graph 模式可以逐节点步进，观察每步的 messages 变化 |
| 重置数据 | 重启服务器即可（InMemoryStore 会清空） |

## 4. 停止服务

在各终端按 `Ctrl+C`。
