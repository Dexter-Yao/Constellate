# ABOUTME: 行为事件 Schema 定义
# ABOUTME: 定义所有事件类型的 Pydantic 模型，供 Coach Agent、数据分析与 GUI 消费

from datetime import datetime
from typing import Literal, Union

from pydantic import BaseModel


class BaseEvent(BaseModel):
    """所有行为事件的基类。"""

    ts: datetime
    """ISO 8601 时间戳。"""

    type: str
    """事件类型标识。"""

    evidence: str
    """引用用户原话，作为事件证据。"""

    tags: list[str] = []
    """情境标签，如 ['breakfast', 'home']。"""


class MealEvent(BaseEvent):
    """饮食记录。"""

    type: Literal["meal"] = "meal"
    summary: str
    """饮食内容摘要。"""

    kcal: float | None = None
    """热量（千卡）。"""

    protein_g: float | None = None
    """蛋白质（克）。"""

    carb_g: float | None = None
    """碳水化合物（克）。"""

    fat_g: float | None = None
    """脂肪（克）。"""

    fiber_g: float | None = None
    """纤维（克）。"""

    water_ml: float | None = None
    """含水量（毫升）。"""

    confidence: float
    """估算置信度，0.0-1.0。"""


class ExerciseEvent(BaseEvent):
    """锻炼记录。"""

    type: Literal["exercise"] = "exercise"
    summary: str
    """锻炼内容摘要。"""

    exercise_type: str
    """锻炼类型，如 running, weights, swimming, walking。"""

    duration_min: float | None = None
    """时长（分钟）。"""

    kcal_burned: float | None = None
    """消耗热量（千卡）。"""

    intensity: Literal["low", "medium", "high"] | None = None
    """强度。"""


class WeighInEvent(BaseEvent):
    """体重记录。"""

    type: Literal["weigh_in"] = "weigh_in"
    weight_kg: float
    """体重（公斤）。"""

    body_fat_pct: float | None = None
    """体脂率（百分比）。"""


class WaterIntakeEvent(BaseEvent):
    """饮水记录。"""

    type: Literal["water_intake"] = "water_intake"
    water_ml: float
    """饮水量（毫升）。"""


class StateCheckinEvent(BaseEvent):
    """状态签到。"""

    type: Literal["state_checkin"] = "state_checkin"
    energy: int | None = None
    """能量水平，1-10。"""

    mood: int | None = None
    """情绪水平，1-10。"""

    stress: int | None = None
    """压力水平，1-10。"""

    sleep_hours: float | None = None
    """睡眠时长（小时）。"""

    sleep_quality: int | None = None
    """睡眠质量，1-10。"""


class GoalEvent(BaseEvent):
    """目标与策略变更。"""

    type: Literal["goal"] = "goal"
    scope: Literal["overall", "phase", "strategy"]
    """目标层级：overall（总体目标）、phase（阶段性目标）、strategy（当前策略）。"""

    summary: str
    """变更摘要。"""

    details: str
    """变更详情。"""


class AppActionEvent(BaseEvent):
    """应用内行为。"""

    type: Literal["app_action"] = "app_action"
    action: str
    """行为标识。"""

    details: str | None = None
    """行为详情。"""


# --- 类型注册 ---

EventType = Union[
    MealEvent,
    ExerciseEvent,
    WeighInEvent,
    WaterIntakeEvent,
    StateCheckinEvent,
    GoalEvent,
    AppActionEvent,
]
"""所有事件类型的联合。"""
