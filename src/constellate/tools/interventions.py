# ABOUTME: 数据采集与微干预工具
# ABOUTME: 通过 HITL interrupt_on 实现用户确认/编辑/拒绝交互

from langchain_core.tools import tool


@tool
def meal_confirm(
    time: str,
    items: str,
    kcal_estimate: int,
    confidence: str,
    tags: list[str],
) -> str:
    """确认饮食记录。

    Coach 解析用户描述后调用此工具，展示结构化确认卡片供用户审阅。
    用户可确认、编辑或拒绝。

    Args:
        time: 用餐时间，如 "7:30" 或 "午餐"。
        items: 饮食内容描述。
        kcal_estimate: 估算热量（千卡）。
        confidence: 估算置信度，如 "high"、"medium"、"low"。
        tags: 情境标签，如 ["breakfast", "home"]。
    """
    return f"饮食已记录：{items}，约 {kcal_estimate} kcal"


@tool
def state_checkin(
    energy: int = 0,
    hunger: int = 0,
    stress: int = 0,
    mood: int = 0,
    note: str = "",
) -> str:
    """状态签到。

    展示滑块卡片采集用户当前身体与情绪状态。
    Coach 在会话开始或检测到状态信号时调用。

    Args:
        energy: 能量水平 1-10，初次调用传 0 表示待用户填写。
        hunger: 饥饿感 1-10。
        stress: 压力水平 1-10。
        mood: 情绪水平 1-10。
        note: 可选的文字备注。
    """
    return f"状态已记录：能量{energy} 饥饿{hunger} 压力{stress} 情绪{mood}"


@tool
def protocol_prompt(
    observation: str,
    question: str,
    option_a_label: str,
    option_a_value: str,
    option_b_label: str,
    option_b_value: str,
    selected: str = "",
) -> str:
    """微干预。

    Coach 检测到高压力或疲劳信号时触发反思性问题。
    每个会话最多调用一次。

    Args:
        observation: Coach 对用户当前状态的观察。
        question: 引导用户反思的问题。
        option_a_label: 选项 A 的显示文本。
        option_a_value: 选项 A 的值。
        option_b_label: 选项 B 的显示文本。
        option_b_value: 选项 B 的值。
        selected: 用户选择的值（由前端回传）。
    """
    if selected:
        return f"用户选择：{selected}"
    return "微干预卡片已展示"
