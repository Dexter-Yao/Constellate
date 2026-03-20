# AI 对话与交互设计：从对话基础到 Agentic AI 的稳定性框架（2022–2026）

元信息：
- 作者：综合来源（IBM Design, Botpress, UX Magazine, Microsoft Design, Riley Coleman）
- 发布日期：2022-2026
- 链接：
  - https://www.ibm.com/design/ai/conversation/
  - https://botpress.com/blog/conversation-design
  - https://uxmag.com/articles/secrets-of-agentic-ux-emerging-design-patterns-for-human-interaction-with-ai-agents
  - https://microsoft.design/articles/ux-design-for-agents
  - https://ai-flywheel.com/ibm-ai-design-practice-transformation/
- Topic：conversation-design, principles

## 一句话简介
- AI 交互设计在 2022-2026 年经历了从「让 Bot 说话」到「让 Agent 与人协作」的范式转变，核心挑战从「如何设计有效对话」扩展为「如何在 AI 可变性中建立多维度的稳定与信任」。

---

## 核心分析

### 一、不变的基础：对话的本质结构（IBM 2022）

IBM 将对话解构为三层原子结构：

- **Topics（话题）**：提供上下文，是对话在任何时刻的高级主题
- **Exchanges（交换）**：传递信息，由两个或更多话语组成
- **Utterances（话语）**：交换中的个体陈述，是对话的原子单位

Bot 需要同时做到两件矛盾的事：

> "The bot must act like a human, with very human attributes (such as empathy, curiosity, humor, compassion, and patience) while maintaining the transparency of being a robot."

### 二、不变的三条设计主线（IBM 2022）

**1. Preferred Responses（首选回应）**

每次对话中，用户都有一个隐含期望的回应类型。设计者需最大化首选回应，同时开发令人满意的非首选回应。

> "Many small, rewarding interactions like these can build relationships over time with the bot."

**2. Relevancy（相关性）**

Bot 必须是有状态的和上下文感知的。

> "It's most thrilling when we feel, just as in human-human conversation, that a bot 'understands' us."

**3. Repair（修复）**

> "It's okay for the bot to be wrong, but it's not okay for it to be wrong and irrelevant."

### 三、2026 年的范式转变：从 Chatbot 到 Agentic AI

2026 的根本性转变在于 **agency 进入了设计方程式**：

> "Designers are now confronted with a question that didn't previously exist: are we designing screens for users, or are we designing intelligence that acts for them?" — UX Magazine

关键变化：

| 传统 Chatbot | Agentic AI (2026) |
|-------------|-------------------|
| 同步请求-响应 | 异步迭代工作流 |
| 人类操作、Bot 执行 | 人类验证、Agent 自主探索 |
| 固定脚本流程 | 渐进式信心呈现 |
| 功能性交互 | 协作式真相发现 |

### 四、2026 对话设计八原则（Botpress）

1. **以用户为中心** — 研究实际需求，非假设行为
2. **清晰的意图识别** — 预判同一请求的多种表达方式（方言、情绪状态）
3. **结构化与引导** — 提供 2-3 个选项的快速回复和渐进式披露，而非开放式提示
4. **一致性与清晰** — 所有回应保持统一的语调、术语和格式
5. **错误处理与恢复** — 预防常见错误，不归咎用户地引导回正轨
6. **自然流与轮换** — 将消息拆分为可消化的片段，尊重对话节奏
7. **多模态与无障碍** — 支持文字转语音、语音回退和屏幕阅读器
8. **个性与品牌声音** — 一致反映组织身份，同时匹配情感上下文

### 五、Agentic UX 的核心模式（UX Magazine 2025）

**模式 1：异步迭代工作流** — UI 须容纳发起调查 → 等待分析 → 渐进式展示建议 → 用户反馈整合 → 精炼行动的循环

**模式 2：证据收集模式** — Agent 先提供「建议性观察」，用户接受/拒绝，引导后续调查

**模式 3：渐进式信心披露** — 从多个竞争观察（低确定性）→ 聚焦观察（中确定性）→ 单一假说（高确定性）

**模式 4：Human-in-the-Loop** — 人类作为验证者而非操作者，降低认知负荷

**关键安全机制**：
- Start/Stop/Pause 控制（防止「魔法师学徒」失控）
- 高风险建议的审批工作流
- 成本透明与行动预览

### 六、Microsoft Agent 设计三维框架（2025）

**Space（空间）**：
- "Connecting, Not Collapsing" — 连接事件、知识和人，不替代人际互动
- "Easily Accessible Yet Largely Invisible" — 后台进程不可见，但行动始终可见和可控

**Time（时间）**：
- 使用记忆系统连接过去事件、行动和查询
- 从静态通知转向主动发起对话或创建产物
- 交互逐步演化、增长复杂度

**Core（核心）**：
- **"Embrace Uncertainty While Establishing Trust"** — 承认一定程度的 Agent 不确定性是预期内的，使确定性水平和推理可见
- 保持 Agent 的知识、工具/技能和连接透明且可定制
- Agent 状态始终对用户清晰可见
- 使用熟悉的 UI/UX 元素降低认知负荷

### 七、在 AI 可变性中建立稳定：从 Consistency Anchors 到四维框架

IBM 传统设计哲学的核心原则是「consistent and predictable」。watsonx 引入的**生成可变性（generative variability）**——同一输入每次产生不同输出——与此直接冲突。IBM 的回应是发明 **Consistency Anchors（一致性锚点）**：

> 在 AI 生成内容围绕其变化时，保持恒定的稳定视觉元素。

这一思路在 2026 年已从视觉层扩展为四维稳定性框架：

**维度 1：视觉稳定** — 明确的颜色、字体和布局规则；Carbon for AI 的「光」隐喻标记所有 AI 内容；AI Label 组件作为跨产品的统一 AI 识别标志

**维度 2：行为稳定** — Agent 状态始终对用户可见；后台进程不可见但**行动**始终可见和可控；使用熟悉的 UI/UX 元素降低认知负荷

**维度 3：推理稳定** — Case File 模式维护持久的「案件档案」，创建用户可审计的推理链；渐进式信心披露镜像人类侦探的工作方式；Supervisor Agent 过滤防止信息过载

**维度 4：控制稳定** — Start/Stop/Pause 控制；高风险建议的审批工作流；成本透明与行动预览；Revert to AI 组件级回退机制

### 八、信任作为设计材料

> "As systems gain agency, trust becomes the most important UX currency. Users grant autonomy only to systems they understand."

信任建立的实践路径：
- 展示推理过程（用人类语言呈现推断内容、决策原因和系统信心度）
- 允许纠正（"that's not what I meant" 使系统从权威式变为协作式）
- RBAC 式的 Agent 权限控制
- Agent 数据如 NDA 般保护机密性

---

## Takeaways

1. **对话基础仍然适用**：IBM 2022 年奠定的三条主线（首选回应、相关性、修复）是 AI 对话设计的不变基石，无论技术如何演进。

2. **对话已升级为协作式决策过程**：2026 年 AI 对话不再只是「信息交换」，而是人类与 Agent 之间的异步迭代协作，人类角色从操作者变为验证者。

3. **稳定性是多维度问题**：IBM 的 Consistency Anchors 回答了「AI 输出不可预测时，视觉层怎么办」。到 2026 年，「锚点」已从纯视觉扩展为视觉、行为、推理、控制四个维度的完整信任系统。

4. **核心策略一致：拥抱而非抗拒**：不是让 AI 变得可预测，而是在可变性周围建立稳定的锚点。Microsoft 的「Embrace Uncertainty While Establishing Trust」和 IBM 的「拥抱而非抗拒」是同一思想的两种表达。

5. **信任是 UX 的新货币**：当系统获得自主性，用户只会将自主权交给他们理解的系统。渐进式信心披露、可审计的推理链、始终可见的状态是信任的具体建造材料。
