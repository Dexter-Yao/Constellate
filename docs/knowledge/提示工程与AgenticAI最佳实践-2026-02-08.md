# 提示工程与AgenticAI最佳实践

元信息：
- 作者：综合调研（OpenAI、Anthropic、Google 官方文档及学术研究）
- 发布日期：2026-02-08
- Topic：Prompt Engineering, Agentic AI, Context Engineering, Tool Design, Eval-Driven Development
- 创建日期：2026-02-08
- 最后更新日期：2026-02-08

## 一句话简介
- 系统梳理 2023-2026 年提示工程从"寻找魔法词语"到"上下文工程"的范式转变，以及生产级 Agentic AI 在架构、工具设计、长程运行、评估方面的最佳实践共识与分歧。

---

## 核心分析

### 第一章：提示工程的原则演变

#### 1.1 从提示工程到上下文工程

演变轨迹：
- 2023 年：寻找"正确的魔法词语"——精心设计提示词以获得最佳输出
- 2024 年：结构化提示成为标准——XML 标签、分隔符、Few-shot 模板化
- 2025 年：推理模型颠覆范式——o1/o3 证明简单直接优于复杂指令
- 2026 年：上下文工程成为核心——不再是"怎么说"，而是"给什么信息"

范式转变的本质（Anthropic 定义）：

> "what **configuration of context** is most likely to generate our model's desired behavior?"

三家一致认同的核心原则：
1. **明确性优先** — 模型是"聪明但全新的员工"，需要清晰上下文而非暗示
2. **结构化分隔** — XML 标签或 Markdown 标题明确区分指令、示例、上下文
3. **迭代测试** — 建立评估体系驱动提示改进，而非凭直觉调整
4. **静态前置、动态后置** — 利用缓存机制，将稳定内容放在提示开头

Anthropic 补充的关键概念（经联网验证）：
- **Context rot**：LLM 在上下文长度增加时准确率下降
- **"Right altitude" 原则**：System Prompt 需要足够具体以引导，又足够灵活以适应
- **即时上下文加载**：动态加载模拟人类认知模式

> "Context is a finite resource with diminishing marginal returns."

#### 1.2 推理模型带来的范式断裂

OpenAI o1/o3 系列模型证明了一个反直觉的事实：对推理模型，越简单的提示反而越好。

**经验证的 OpenAI 官方指导：**
- 内置链式思考，无需"一步步思考"等指令。"Asking a reasoning model to reason more may actually hurt the performance."
- 优先尝试 Zero-shot，仅在需要时补充 Few-shot
- 推理模型如同"senior co-worker"——给目标即可；GPT 模型如同"junior coworker"——需要详细指令
- 推理计算预算（reasoning effort）可调：low / medium / high
  - Low：超越 o1-mini 的 PhD 级科学问题表现
  - Medium：匹配 o1 的竞赛编程表现（ChatGPT 默认）
  - High：o3-mini 首次尝试解决 32%+ 的 FrontierMath 问题

#### 1.3 各家差异化的提示哲学

**OpenAI — 工具化思维：** 六大策略（经验证）：
1. Write clear instructions
2. Provide reference text
3. Split complex tasks into simpler subtasks
4. Give the model time to "think"
5. Use external tools
6. Test changes systematically

强调 Structured Outputs 保证格式可靠性，GPT-5 为"most steerable model yet"。

**Anthropic — Extended Thinking 最佳实践（经验证）：**
- 从最低预算（1024 tokens）开始，逐步增加
- 优先使用高层级指导（"think deeply"），而非详细步骤

> "The model's creativity in approaching problems may exceed a human's ability to prescribe the optimal thinking process."

- 不要将 Extended Thinking 输出回传给模型（会降低性能）
- 不允许预填充 Extended Thinking

**Google — 简约化转向：** Gemini 偏好直接陈述，建议保持默认温度 1.0

---

### 第二章：Agentic 系统设计原则

#### 2.1 简单性原则的胜利

行业最重要的共识（Anthropic 原文验证）：

> "Consistently, the most successful implementations weren't using complex frameworks or specialized libraries. Instead, they were building with simple, composable patterns."

三大核心原则（三家一致）：
1. 保持设计简单 — 仅在需要时增加复杂性
2. 优先透明性 — 显式展示 Agent 的规划步骤
3. 精心打造工具接口 — 工具文档 = Agent 行为的核心驱动

**何时不使用 Agent 模式（Anthropic 补充，经验证）：**
- 多数应用仅需"优化单次 LLM 调用 + 检索 + in-context examples"
- Agentic 系统"trade latency and cost for better task performance"
- 需要"some level of trust"且存在"potential for compounding errors"
- 需要在沙箱环境中进行广泛测试和适当的 guardrails

#### 2.2 Agent 架构模式的演变

**六种递进模式（经验证修正，原调研列五种，缺少 Parallelization）：**
1. **Prompt Chaining** — 任务分解为顺序步骤，每步输出喂给下一步
2. **Routing** — 根据输入分类，路由到不同处理路径
3. **Parallelization** — 同时执行多个独立子任务（原调研遗漏）
4. **Orchestrator-Workers** — 动态分解子任务并委派
5. **Evaluator-Optimizer** — 生成 + 评估迭代循环
6. **Agents** — 自主工具使用系统

关键洞察：大多数生产系统只需要前 2-3 种模式。Anthropic SWE-bench agent "spent more time optimizing tools than the overall prompt"。

#### 2.3 自主性与控制的动态平衡

ACR 权衡（Agency-Control-Reliability Tradeoff）：

> "有充分证据表明，可靠性与 Agent 的自主性成反比。约束 Agent 的自主性并将每个任务框架为简单、结构良好的指令，可以显著提高可靠性。"

分层自主性设计：
- **自主执行**：数据记录、状态总结、信息检索
- **提示批准**：目标修改、策略调整、敏感反馈
- **强制人工**：数据删除、异常行为、高风险决策

2026 年现实：69% 的 Agentic AI 决策仍由人工验证。Human-in-the-loop 不是退让，而是当前阶段的最优策略。

---

### 第三章：工具使用的原则与策略

#### 3.1 工具设计哲学的演变

核心趋势：从"把 API 包装成函数"（2023）到"工具设计是核心竞争力"（2025-2026）。

Anthropic 经验证的表述：

> "prompt-engineering your tool descriptions and specs" is "one of the most effective methods for improving tools" because descriptions are "loaded into your agents' context"

#### 3.2 工具设计原则（经验证整合）

| 原则 | 说明 |
|------|------|
| 少而精 | 少量深思熟虑的工具胜过多而杂 |
| 语义合并 | 始终顺序调用的函数应合并为复合操作 |
| 逻辑下沉 | 将已知参数下沉到代码层面 |
| 高信号返回 | 返回 name, image_url 而非 uuid, mime_type |
| 防错设计 | 使用绝对路径、枚举而非自由文本 |
| 面向新人描述 | 像向"new hire on your team"解释一样写工具描述 |
| 评估驱动迭代 | 使用 held-out test sets 反复优化工具实现 |

**经验证的反模式：**
- Claude web search 工具：模型无谓地在查询中附加年份，降低搜索质量 → 改进工具描述解决

#### 3.3 工具数量与上下文效率

**经验证修正：** 原调研声称"Programmatic Tool Calling 减少 80% 推理成本"，实际数据为 **37% token 减少**（从 43,588 降至 27,297 tokens）。

Tool Search 模式的实际效果（经验证）：
- 传统方式消耗 ~77K tokens → Tool Search 方式仅消耗 ~8.7K tokens（85% 节省）
- Opus 4 准确率从 49% → 74%；Opus 4.5 从 79.5% → 88.1%
- Tool Use Examples 将复杂参数处理准确率从 72% 提升到 90%

---

### 第四章：长时间运行 Agent 的设计

#### 4.1 上下文管理策略

Anthropic 文档中的实际策略（经验证——原调研的"WSCI 框架"在原始文档中不存在，但四个方向基本一致）：
- **Compaction**：总结对话历史
- **Structured Note-Taking**：在上下文外持久化记忆
- **Sub-Agent Architectures**：专业 Agent 保持干净上下文

#### 4.2 跨会话记忆架构（经验证）

Anthropic 的 claude-progress.txt 模式：

> "a claude-progress.txt file that keeps a log of what agents have done"

两部分架构：

> "an initializer agent that sets up the environment on the first run, and a coding agent that is tasked with making incremental progress in every session"

增量进展策略：

> "the next iteration of the coding agent was then asked to work on only one feature at a time. This incremental approach turned out to be critical"

Git 最佳实践：

> "ask the model to commit its progress to git with descriptive commit messages and to write summaries of its progress in a progress file"

**关键补充洞察**：该架构将 Agent 会话视为工程换班交接，要求显式的状态文档和结构化任务边界，解决三个关键失败模式：过早声明完成、半实现的功能、未记录的进展。

#### 4.3 弹性与错误恢复

- 何时重试：技术超时、短暂网络问题（指数退避 + 随机抖动）
- 何时升级：低置信度分类、高风险行动、监管合规影响、超出范围
- 优雅降级：分层回退架构 → 冗余路径 → 断路器模式

---

### 第五章：评估——从诊断工具到治理机制

#### 5.1 评估思维的范式转变

从"Vibe checks"到评估驱动开发（EDDOps）。驱动转变的核心因素：基准饱和、数据污染、生产鸿沟、评估意识。

#### 5.2 评估分类学（经验证）

**能力评估 vs 回归评估（Anthropic 原文验证）：**

> 能力评估："What can this agent do well?" — "should start at a low pass rate, targeting tasks the agent struggles with."

> 回归评估："Does the agent still handle all the tasks it used to?" — "should have a nearly 100% pass rate."

能力评估通过率提高后可"毕业"为回归套件持续运行。

**评分方法三层级：**
1. 代码化评分 — 客观、可重现、成本低
2. 模型评分（LLM-as-Judge）— 快速、可扩展，但对表面特征敏感
3. 人工评分 — 黄金标准，主要用于校准

**经验证的关键引用：**

> "The capabilities that make agents useful also make them difficult to evaluate."

> "Agents use tools across many turns, modifying state in the environment and adapting as they go—which means mistakes can propagate and compound."

**补充洞察（经验证）：**
- **pass@k 和 pass^k 指标**专门应对 Agent 行为的非确定性
- **Transcript review 是必需的**——阅读实际失败案例可揭示评分器是否正确工作
- **Eval saturation**：Agent 达到近完美分数时，需要更难的任务维持信号

#### 5.3 评估驱动开发范式（EDDOps）

定义：在闭环反馈循环中统一离线（开发时）和在线（运行时）评估的方法论。

与 TDD 的根本区别：TDD 假设测试结果确定，EDDOps 必须应对 LLM 的非确定性行为。

核心循环：measure → improve → ship → monitor → measure

Anthropic 的两类评估框架：能力评估（探索边界）+ 回归评估（保护成果），两者必须并行。

#### 5.4 Bloom 框架（经验证修正）

四阶段正确术语：
1. **Understanding** — 分析研究者的行为描述和示例
2. **Ideation** — 生成详细的评估场景
3. **Rollout** — 并行执行评估场景，动态模拟用户和工具响应
4. **Judgment** — 评审和评分每个交互记录

关键输出：elicitation rate（引发率）——评分 ≥7/10 的 rollout 比例。
开源：github.com/safety-research/bloom

> "Bloom's evaluations correlate strongly with our hand-labelled judgments and reliably separate baseline models from intentionally misaligned ones."

已发布四种行为（delusional sycophancy、instructed long-horizon sabotage、self-preservation、self-preferential bias）在 16 个 frontier 模型上的基准结果。

#### 5.5 构建代表性评估数据集

核心原则：生产数据 > 合成数据 > 手工构造

- 生产日志捕获实际边界情况和理论数据集遗漏的失败模式
- 黄金数据集是经策划、版本化的提示/输入/上下文/预期结果集合
- 今天的评估集六个月后可能不再有代表性 → 持续演进

---

### 第六章：前沿洞察与战略分析

#### 6.1 三家厂商的战略分化

| 维度 | OpenAI | Anthropic | Google |
|------|--------|-----------|--------|
| 定位 | 消费者为中心（ChatGPT 生态） | 企业安全为中心（可控性优先） | 混合（设备嵌入 + 云服务） |
| 核心贡献 | 完整工具链（Agents SDK + Evals + 蒸馏） | 思想领导力（上下文工程、简单性、MCP） | 企业基础设施（ADK + Vertex AI） |
| Agent SDK | Agents SDK（Handoff/Guardrail/Tracing） | Claude Agent SDK + MCP | ADK（Sequential/Parallel/Loop） |
| 独特创新 | Structured Outputs, 模型蒸馏, GPT-5 | MCP, Constitutional AI, Bloom | ADK, A2A, Groundedness |

#### 6.2 技术路线的收敛（经验证更新）

**MCP（Anthropic 推出）：** 已成为事实标准，OpenAI 和 Google 均采用。

**A2A（Google 推出，经验证修正）：**
- 2025 年 4 月由 Google 发起，50+ 技术伙伴参与开发
- 2025 年 6 月加入 Linux Foundation，支持者超过 100 家公司
- Google 原文明确：A2A complements Anthropic's MCP — "MCP provides helpful tools and context to agents"，A2A 解决"Agent 之间如何通信"

#### 6.3 生产化的"最后一公里"挑战

**经验证修正：** LangChain State of Agent Engineering 2026 报告显示 57.3% 的受访者已有 Agent 在生产运行（较上年 51% 增长），另有 30.4% 在积极开发中。原调研"仅 11% 部署到生产"的统计可能来源于不同调查（如特定行业子集或其他研究报告），此处标注存疑。

为什么项目失败：
1. 缺乏"操作系统" — 没有管理记忆、I/O、权限的基础设施
2. 集成瓶颈 — "Dumb RAG"、脆弱连接器、缺乏事件驱动架构
3. 质量问题 — 准确性、一致性、语气合规是首要障碍
4. 上下文碎片化 — 小的上下文差距导致级联错误

#### 6.4 成本经济学

- 工具增强 Agent 需要的 LLM 调用比简单提示多 9 倍以上
- Token 价格持续下降但长对话上下文膨胀悄悄耗尽预算
- 设计良好的系统将 60-80% 请求路由到更小模型或非 LLM 路径
- 优化三板斧：模型路由 + 上下文压缩 + 成本监控仪表板

#### 6.5 安全与治理前沿

- 非人类和 Agent 身份预计 2026 年底超过 450 亿，但仅 10% 组织有管理策略
- 提示注入攻击 30% 成功率对关键应用不可接受
- 新兴解决方案：治理 Agent（监控/审计其他 Agent）、Constitutional AI
- 2026 年 2 月《国际 AI 安全报告》：100+ 专家，代表 AI 安全的最大全球协作

#### 6.6 行业趋势预测

1. 推理时计算成为第二增长曲线 — 性能进步更多来自改进的工具设计和推理时缩放
2. 标准成熟与融合 — MCP + A2A 由 Linux Foundation 托管，2026 是生产化关键年
3. 混合团队常态化 — Gartner 预测到 2028 年 38% 组织将有 AI Agent 作为团队成员
4. Agent 原生界面取代聊天 — 从 token 日志转向表格、图表、表单等原生 UI 元素

---

## 参考链接

**提示工程**
- [OpenAI Prompt Engineering Guide](https://platform.openai.com/docs/guides/prompt-engineering)
- [OpenAI Reasoning Best Practices](https://platform.openai.com/docs/guides/reasoning-best-practices)
- [Anthropic Prompt Engineering Overview](https://docs.anthropic.com/en/docs/build-with-claude/prompt-engineering/overview)
- [Anthropic: Effective Context Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- [Google Gemini Prompting Strategies](https://ai.google.dev/gemini-api/docs/prompting-strategies)

**Agent 设计**
- [Anthropic: Building Effective Agents](https://www.anthropic.com/research/building-effective-agents)
- [OpenAI Agents SDK](https://platform.openai.com/docs/guides/agents-sdk)
- [Google ADK Docs](https://google.github.io/adk-docs/)
- [OpenAI Cookbook: Orchestrating Agents](https://cookbook.openai.com/examples/orchestrating_agents)

**工具使用**
- [Anthropic: Writing Tools for Agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- [Anthropic: Advanced Tool Use](https://www.anthropic.com/engineering/advanced-tool-use)
- [OpenAI Function Calling Guide](https://platform.openai.com/docs/guides/function-calling)

**长时间运行 Agent**
- [Anthropic: Effective Harnesses for Long-Running Agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

**评估**
- [Anthropic: Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- [OpenAI Evaluation Best Practices](https://platform.openai.com/docs/guides/evaluation-best-practices)
- [Bloom Auto Evals (Anthropic Alignment)](https://alignment.anthropic.com/2025/bloom-auto-evals/)
- [Bloom GitHub](https://github.com/safety-research/bloom)

**前沿洞察**
- [LangChain State of Agent Engineering](https://www.langchain.com/state-of-agent-engineering)
- [Google A2A Protocol](https://developers.googleblog.com/en/a2a-a-new-era-of-agent-interoperability/)
- [A Year of MCP: 2025 Review](https://www.pento.ai/blog/a-year-of-mcp-2025-review)

---

## Takeaway

1. **上下文工程 > 提示工程**：核心已从"措辞优化"转向"信息选择与配置"。Context is a finite resource with diminishing marginal returns.
2. **推理模型需要独立策略**：与标准模型维护不同的提示方法——更简单、更高层级、避免 CoT 指令。
3. **简单性持续胜出**：生产环境最成功的 Agent 用简单可组合模式，不用复杂框架。大多数场景只需 Prompt Chaining + Routing + Parallelization。
4. **工具设计是核心竞争力**：工具描述直接影响 Agent 行为，Tool Search 模式可节省 85% 上下文并提升准确率。
5. **长程 Agent = 工程换班**：claude-progress.txt + git commits + 增量进展 + 两部分架构是经验证的可靠模式。
6. **评估驱动开发**：能力评估 + 回归评估并行；代码化评分优先，transcript review 不可省略。
7. **MCP + A2A 形成互补标准**：工具使用 + Agent 间通信，均已进入 Linux Foundation 治理。
