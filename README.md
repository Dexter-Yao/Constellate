1. 启动服务器

  cd "/Users/dexter/Documents/LLM Projects/Constellate"
  uv run langgraph dev --port 2024 --tunnel

  --tunnel 是关键——它创建 Cloudflare HTTPS 隧道，解决 Studio 的 "Failed to fetch" 问题。

  启动后终端会输出类似：

  🚀 API: http://127.0.0.1:2024
  🎨 Studio UI: https://smith.langchain.com/studio/?baseUrl=https://xxx-xxx.trycloudflare.com
  📚 API Docs: https://xxx-xxx.trycloudflare.com/docs

  2. 打开 Studio

  直接点终端输出的 Studio UI 那行 URL，或手动拼：

  https://smith.langchain.com/studio/?baseUrl=https://xxx-xxx.trycloudflare.com

  每次启动隧道域名不同，需要用当次输出的 URL。

  Studio Debug 用法
  ┌──────────────┬────────────────────────────────────────────────────┐
  │     操作     │                       怎么做                       │
  ├──────────────┼────────────────────────────────────────────────────┤
  │ 对话测试     │ 左上角切 Chat 模式，直接发消息                     │
  ├──────────────┼────────────────────────────────────────────────────┤
  │ 查看执行链   │ 切 Graph 模式，节点会按执行顺序高亮                │
  ├──────────────┼────────────────────────────────────────────────────┤
  │ 检查工具调用 │ 点击 tools 节点，看 Coach 写了什么文件、参数是什么 │
  ├──────────────┼────────────────────────────────────────────────────┤
  │ 查看 State   │ 每个节点右侧面板显示当前 state 快照                │
  ├──────────────┼────────────────────────────────────────────────────┤
  │ 中断调试     │ Graph 模式可以逐节点步进，观察每步的 messages 变化 │
  ├──────────────┼────────────────────────────────────────────────────┤
  │ 重置数据     │ 重启服务器即可（InMemoryStore 会清空）             │
  └──────────────┴────────────────────────────────────────────────────┘
  停止服务器

  终端按 Ctrl+C。