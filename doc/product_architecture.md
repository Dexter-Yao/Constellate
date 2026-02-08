<!-- ABOUTME: Aligner 产品技术架构文档，定义后端 Agent 架构、配置中心、数据架构与演进路线 -->
<!-- ABOUTME: 所有技术实现决策应与本文保持一致，前端架构待后续独立规划 -->

# Aligner 产品技术架构

## 一、架构概述

### 1.1 技术栈

| 层 | 选型 |
|----|------|
| Agent 框架 | LangChain DeepAgent (`deepagents`) |
| 图运行时 | LangGraph |
| LLM | Azure OpenAI（通过 `langchain-openai`） |
| 后端服务 | LangGraph Dev Server |
| 前端 | Next.js + `@langchain/langgraph-sdk`（待定） |

### 1.2 核心设计原则

1. **Coach 是唯一界面**：用户只面对一个教练 Agent，所有后台分析对用户透明。
2. **文件系统即数据库**：DeepAgent 虚拟文件系统承载行为数据，Agent 天然理解文件操作。
3. **对话即记录**：每轮对话自动写入账本，行为事件引用用户原话作为证据。
4. **单一事实来源**：ModelRegistry 管 LLM，PromptRegistry 管提示词，账本管行为数据。
5. **渐进式复杂度**：V1 仅用内置工具，不预设 skills/subagents/自定义工具。

### 1.3 系统全景

```
┌──────────────────────────────────────────────┐
│        LangGraph Dev Server (:2024)           │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │        Coach Agent (DeepAgent)            │ │
│  │  model: ModelRegistry.get("coach")        │ │
│  │  system_prompt: PromptRegistry.get(...)   │ │
│  │  tools: []  (V1 仅用内置文件系统工具)      │ │
│  │  skills: [] (V1 暂不配置)                 │ │
│  │  subagents: [] (V1 暂不配置)              │ │
│  └────────────────┬─────────────────────────┘ │
│                   │                            │
│  ┌────────────────┴─────────────────────────┐ │
│  │        CompositeBackend                   │ │
│  │  /user/      → StoreBackend (持久)        │ │
│  │  /scratch/   → StateBackend (临时)        │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  ┌──────────────────────────────────────────┐ │
│  │  ModelRegistry    │  PromptRegistry       │ │
│  │  coach → gpt-5.2  │  coach → prompts/...  │ │
│  └──────────────────────────────────────────┘ │
│                                                │
│  SummarizationMiddleware (默认配置)            │
└──────────────────────────────────────────────┘
         │
    Demo: InMemoryStore
    Prod: Supabase (后续)
```

---

## 二、Coach Agent

### 2.1 DeepAgent 配置

Coach Agent 通过 `create_deep_agent()` 创建：

```python
agent = create_deep_agent(
    name="coach",
    model=ModelRegistry.get("coach"),
    system_prompt=PromptRegistry.get("coach_system"),
    backend=composite_backend,
    tools=[],       # V1 仅依赖内置文件系统工具
    skills=[],      # 后续按 S-PDCA 协议逐步添加
    subagents=[],   # 后续按需添加分析子 Agent
)
```

DeepAgent 内置 7 个文件系统工具（`ls`, `read_file`, `write_file`, `edit_file`, `glob`, `grep`, `execute`），Coach 通过这些工具直接操作虚拟文件系统中的用户账本。

### 2.2 Context 压缩策略

DeepAgent 通过 `SummarizationMiddleware` 管理会话内 context window：

```python
SummarizationMiddleware(
    model="gpt-4o-mini",
    backend=backend,
    trigger=("fraction", 0.85),   # 85% context window 时触发摘要
    keep=("fraction", 0.10),      # 保留最近 10% 消息
)
```

- 触发条件可定制：按比例、token 数、消息数
- 完整历史自动存储到 `/conversation_history/{thread_id}.md`
- 大工具结果超过阈值时自动驱逐到文件系统（`tool_token_limit_before_evict`）

**与账本的关系**：SummarizationMiddleware 管理当前会话的 context window。账本中的对话记录（`message` 事件）是 Coach 的长期记忆，由 Coach 主动写入，两者互不替代。

---

## 三、配置中心

### 3.1 ModelRegistry（LLM 配置）

全局 LLM 配置中心，单一事实来源。不设置 temperature 参数，由模型默认行为决定。

```python
# src/aligner_backend/config/models.py
class ModelRegistry:
    _profiles: dict[str, dict] = {}
    _instances: dict[str, BaseChatModel] = {}

    @classmethod
    def configure(cls, profiles: dict[str, dict]) -> None:
        cls._profiles = profiles
        cls._instances.clear()

    @classmethod
    def get(cls, profile: str) -> BaseChatModel:
        if profile not in cls._instances:
            config = cls._profiles[profile]
            cls._instances[profile] = init_chat_model(**config)
        return cls._instances[profile]
```

配置文件（`config/models.toml`）：

```toml
[models.coach]
model = "azure_openai:gpt-5.2"
azure_deployment = "gpt-52-eastus"
```

### 3.2 PromptRegistry（提示词管理）

全局提示词管理中心，基于 Jinja2 模板引擎。DeepAgent 没有内置的统一提示词管理，需自建。

```python
# src/aligner_backend/config/prompts.py
class PromptRegistry:
    _env: Environment | None = None

    @classmethod
    def load(cls, prompts_dir: Path) -> None:
        cls._env = Environment(
            loader=FileSystemLoader(str(prompts_dir)),
            undefined=StrictUndefined,
            keep_trailing_newline=True,
        )

    @classmethod
    def get(cls, name: str, **kwargs: str) -> str:
        template = cls._env.get_template(f"{name}.j2")
        return template.render(**kwargs)
```

目录结构：

```
prompts/
├── coach_system.j2       # Coach Agent 主系统提示词（Jinja2 模板）
└── ...                   # 后续按需添加
```

设计原则：
- 提示词以 `.j2` 模板文件存储，git diff 友好
- Jinja2 注释（`{# ... #}`）不会发送给 LLM，可安全记录运行上下文
- 支持动态变量注入（`{{ var }}`），使用 StrictUndefined 确保未定义变量立即报错
- 修改提示词需重启 agent（DeepAgent 限制）

---

## 四、数据架构

### 4.1 对话层与账本层

Aligner 的数据分两个独立层：

| 层 | 内容 | 管理者 | 生命周期 |
|----|------|--------|----------|
| 对话层 | 当前会话的完整消息流 | LangGraph checkpoint + SummarizationMiddleware | 会话内自动管理 |
| 账本层 | 结构化行为记录 + 对话存档 | Coach Agent 主动写入虚拟文件系统 | 永久持久 |

对话层解决"当前会话的 context 管理"。账本层解决"长期行为追踪与跨会话查询"。

Coach 在每轮对话中主动将对话内容和行为数据写入账本，确保所有交互可被后续查询。

### 4.2 事件离散化策略

用户交互本质上是连续的对话流。离散化由 Coach Agent 基于语义完整性执行。

**每轮对话的写入流程**：

1. 用户发消息（文本/语音/图片）
2. Coach 将用户消息记录为 `message` 事件（含原文、形式、时间）
3. Coach 理解意图并回复
4. Coach 判断是否产生行为事件（meal、state_checkin 等）
5. 行为事件的 `evidence` 字段引用用户原话

**事件产出规则**：

- 每轮对话至少产生 1 个 `message` 事件
- 在此基础上可能产生 0~N 个行为事件
- 非对话行为（浏览 Map、修改目标）由前端触发 Coach 写入

### 4.3 虚拟文件系统目录结构

单用户系统，固定路径前缀 `/user/`。每个事件独立一个 JSON 文件，`write_file` 为 O(1) 操作，无需先读取已有文件。

```
/user/
├── profile/
│   └── context.md              # 用户画像（目标、偏好、身份愿景）
├── ledger/
│   └── {YYYY-MM-DD}/           # 每日目录
│       ├── {HHMMSS}_{type}.json  # 每事件一文件
│       └── ...
├── derived/
│   ├── weekly_trend.json       # 周趋势聚合
│   └── pattern_log.md          # 模式识别记录
└── coach/
    └── session_notes.md        # Coach 持久记忆（跨 session）
```

### 4.4 事件类型体系与 Schema

**类型体系**（与 S-PDCA 阶段的对应关系）：

```
event
├── message           # 对话消息（每轮必记录，贯穿所有阶段）
├── state_checkin     # 状态签到          → S (State)
├── goal_update       # 目标变更          → P (Plan)
├── meal              # 饮食记录          → D (Do)
├── weigh_in          # 称重记录          → D (Do)
└── app_action        # 应用内行为        → D (Do)
```

Check（模式识别）和 Act（结构纠偏）阶段由 Coach 分析行为产出派生数据，不直接产生用户事件。

**message 事件**：

```json
{
  "ts": "2026-02-08T07:32:00+08:00",
  "type": "message",
  "form": "text",
  "content": "早上好，我刚吃完早饭，吃的是燕麦加蓝莓和一杯黑咖啡",
  "coach_reply": "早上好！记录下来了。燕麦蓝莓是很好的选择..."
}
```

**行为事件（以 meal 为例）**：

```json
{
  "ts": "2026-02-08T07:32:15+08:00",
  "type": "meal",
  "evidence": "我刚吃完早饭，吃的是燕麦加蓝莓和一杯黑咖啡",
  "summary": "燕麦+蓝莓+黑咖啡",
  "estimation": {
    "kcal_mid": 320,
    "confidence": 0.7
  },
  "tags": ["breakfast", "home"]
}
```

所有行为事件包含 `evidence` 字段，引用触发该事件的用户原话。

### 4.5 存储后端路由

使用 `CompositeBackend` 按路径分发：

| 路径模式 | Backend | 持久性 | 涵盖内容 |
|----------|---------|--------|----------|
| `/user/` | StoreBackend | 跨 session 持久 | profile/, ledger/, derived/, coach/ |
| `/scratch/` | StateBackend | 当前 thread 内临时 | 计算中间结果 |

V1 Demo 使用 `InMemoryStore`，生产环境切换为 Supabase 自定义 Backend（实现 `BackendProtocol`）。

---

## 五、前端集成（待定）

### 5.1 流式能力确认

LangGraph 的 `useStream` hook 支持 chatbot 式逐 token 流式输出：

- `streamMode: "messages-tuple"` 实现逐 token 流式
- `messagesKey` 指定 state 中的消息列表 key
- 用户体验与 ChatGPT 一致（逐字出现）

`deep-agents-ui`（Next.js 模板）可作为起点。

### 5.2 后续规划方向

Aligner 不是纯对话框产品。前端需同时承载：

- Coach 对话界面（对话层）
- 减脂 Map（Path Layer + Horizon Layer，参见 `product_design.md`）
- 数据仪表盘（趋势、一致性指数）

前端架构设计推迟到后端基础就绪后独立规划。

---

## 六、演进路线

### 6.1 V1 Demo 范围

| 维度 | 方案 |
|------|------|
| LLM | Azure OpenAI GPT-5.2 |
| Store | InMemoryStore |
| 后端 | LangGraph dev server 本地 |
| 前端 | 暂缓 |
| 认证 | 单用户 |
| 自定义工具 | 无（仅内置文件系统工具） |
| Skills | 无 |
| 子 Agent | 无 |

V1 目标：Coach Agent 能通过对话与用户交互，并将行为数据写入虚拟文件系统。

### 6.2 Supabase 迁移路径

自定义 `SupabaseBackend` 实现 `BackendProtocol`：

- 目录结构映射到 Supabase Database（JSONB 列存储 + 路径索引）
- 大文件（照片、语音）存储到 Supabase Storage
- RLS 实现多用户隔离
- Agent 代码无需修改，仅替换 CompositeBackend 中的路由目标

---

## 变更记录

| 日期 | 变更内容 |
|------|----------|
| 2026-02-08 | 初始创建：Agent 架构、配置中心、数据架构、事件离散化策略、演进路线 |
| 2026-02-08 | 架构重构：包路径迁移至 src/aligner_backend/；PromptRegistry 改用 Jinja2 模板引擎；目录结构改为单用户 + 每事件独立文件；添加 LangGraph Dev Server 集成 |
