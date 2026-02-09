# ABOUTME: 事件 Schema 单元测试
# ABOUTME: 验证事件模型的序列化、验证与类型解析

from datetime import datetime, timezone

import pytest
from pydantic import ValidationError

from constellate.schemas import (
    AppActionEvent,
    BaseEvent,
    EventType,
    ExerciseEvent,
    GoalEvent,
    MealEvent,
    StateCheckinEvent,
    WaterIntakeEvent,
    WeighInEvent,
)


# --- fixtures ---


@pytest.fixture
def ts() -> datetime:
    return datetime(2026, 2, 8, 7, 32, 15, tzinfo=timezone.utc)


@pytest.fixture
def base_fields(ts: datetime) -> dict:
    return {
        "ts": ts,
        "evidence": "我刚吃完早饭",
        "tags": ["breakfast", "home"],
    }


# --- BaseEvent ---


class TestBaseEvent:
    def test_required_fields(self, ts: datetime) -> None:
        event = BaseEvent(ts=ts, type="custom", evidence="用户说了什么")
        assert event.ts == ts
        assert event.type == "custom"
        assert event.evidence == "用户说了什么"
        assert event.tags == []

    def test_tags_default_empty(self, ts: datetime) -> None:
        event = BaseEvent(ts=ts, type="custom", evidence="test")
        assert event.tags == []

    def test_missing_required_fields(self) -> None:
        with pytest.raises(ValidationError):
            BaseEvent()  # type: ignore[call-arg]


# --- MealEvent ---


class TestMealEvent:
    def test_full_meal(self, base_fields: dict) -> None:
        event = MealEvent(
            **base_fields,
            summary="燕麦+蓝莓+黑咖啡",
            kcal=320,
            protein_g=12.5,
            carb_g=45.0,
            fat_g=8.0,
            fiber_g=5.0,
            water_ml=250,
            confidence=0.7,
        )
        assert event.type == "meal"
        assert event.kcal == 320
        assert event.protein_g == 12.5
        assert event.confidence == 0.7

    def test_minimal_meal(self, base_fields: dict) -> None:
        """只需 summary 和 confidence，营养字段可选。"""
        event = MealEvent(
            **base_fields,
            summary="随便吃了点",
            confidence=0.3,
        )
        assert event.kcal is None
        assert event.protein_g is None
        assert event.water_ml is None

    def test_type_literal(self, base_fields: dict) -> None:
        """type 字段固定为 'meal'。"""
        event = MealEvent(**base_fields, summary="test", confidence=0.5)
        assert event.type == "meal"

    def test_serialization_roundtrip(self, base_fields: dict) -> None:
        event = MealEvent(
            **base_fields,
            summary="燕麦",
            kcal=320,
            confidence=0.7,
        )
        data = event.model_dump(mode="json")
        restored = MealEvent.model_validate(data)
        assert restored == event

    def test_confidence_required(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            MealEvent(**base_fields, summary="test")  # type: ignore[call-arg]


# --- ExerciseEvent ---


class TestExerciseEvent:
    def test_full_exercise(self, base_fields: dict) -> None:
        event = ExerciseEvent(
            **base_fields,
            summary="晨跑 5km",
            exercise_type="running",
            duration_min=30,
            kcal_burned=350,
            intensity="medium",
        )
        assert event.type == "exercise"
        assert event.exercise_type == "running"
        assert event.duration_min == 30
        assert event.intensity == "medium"

    def test_minimal_exercise(self, base_fields: dict) -> None:
        event = ExerciseEvent(
            **base_fields,
            summary="做了几组俯卧撑",
            exercise_type="bodyweight",
        )
        assert event.duration_min is None
        assert event.kcal_burned is None
        assert event.intensity is None

    def test_intensity_enum(self, base_fields: dict) -> None:
        for level in ("low", "medium", "high"):
            event = ExerciseEvent(
                **base_fields,
                summary="test",
                exercise_type="test",
                intensity=level,
            )
            assert event.intensity == level

    def test_invalid_intensity(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            ExerciseEvent(
                **base_fields,
                summary="test",
                exercise_type="test",
                intensity="extreme",  # type: ignore[arg-type]
            )


# --- WeighInEvent ---


class TestWeighInEvent:
    def test_full_weigh_in(self, base_fields: dict) -> None:
        event = WeighInEvent(
            **base_fields,
            weight_kg=75.5,
            body_fat_pct=18.2,
        )
        assert event.type == "weigh_in"
        assert event.weight_kg == 75.5
        assert event.body_fat_pct == 18.2

    def test_weight_required(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            WeighInEvent(**base_fields)  # type: ignore[call-arg]

    def test_body_fat_optional(self, base_fields: dict) -> None:
        event = WeighInEvent(**base_fields, weight_kg=75.5)
        assert event.body_fat_pct is None


# --- WaterIntakeEvent ---


class TestWaterIntakeEvent:
    def test_water_intake(self, base_fields: dict) -> None:
        event = WaterIntakeEvent(**base_fields, water_ml=500)
        assert event.type == "water_intake"
        assert event.water_ml == 500

    def test_water_ml_required(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            WaterIntakeEvent(**base_fields)  # type: ignore[call-arg]


# --- StateCheckinEvent ---


class TestStateCheckinEvent:
    def test_full_checkin(self, base_fields: dict) -> None:
        event = StateCheckinEvent(
            **base_fields,
            energy=7,
            mood=6,
            stress=4,
            sleep_hours=7.5,
            sleep_quality=8,
        )
        assert event.type == "state_checkin"
        assert event.energy == 7
        assert event.sleep_hours == 7.5

    def test_all_optional(self, base_fields: dict) -> None:
        """所有指标字段都是可选的。"""
        event = StateCheckinEvent(**base_fields)
        assert event.energy is None
        assert event.mood is None
        assert event.stress is None
        assert event.sleep_hours is None
        assert event.sleep_quality is None


# --- GoalEvent ---


class TestGoalEvent:
    def test_overall_goal(self, base_fields: dict) -> None:
        event = GoalEvent(
            **base_fields,
            scope="overall",
            summary="半年内减到 70kg",
            details="当前 80kg，目标 BMI 22",
        )
        assert event.type == "goal"
        assert event.scope == "overall"
        assert event.summary == "半年内减到 70kg"

    def test_phase_goal(self, base_fields: dict) -> None:
        event = GoalEvent(
            **base_fields,
            scope="phase",
            summary="本月每天蛋白质 ≥ 120g",
            details="增加蛋白质摄入以维持肌肉量",
        )
        assert event.scope == "phase"

    def test_strategy(self, base_fields: dict) -> None:
        event = GoalEvent(
            **base_fields,
            scope="strategy",
            summary="用喝水代替下午零食",
            details="下午 3-5 点是零食高发期，改为喝水",
        )
        assert event.scope == "strategy"

    def test_scope_required(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            GoalEvent(
                **base_fields,
                summary="test",
                details="test",
            )  # type: ignore[call-arg]

    def test_invalid_scope(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            GoalEvent(
                **base_fields,
                scope="invalid",  # type: ignore[arg-type]
                summary="test",
                details="test",
            )

    def test_required_fields(self, base_fields: dict) -> None:
        with pytest.raises(ValidationError):
            GoalEvent(**base_fields, scope="overall")  # type: ignore[call-arg]


# --- AppActionEvent ---


class TestAppActionEvent:
    def test_app_action(self, base_fields: dict) -> None:
        event = AppActionEvent(
            **base_fields,
            action="view_weekly_trend",
            details="查看了周趋势图",
        )
        assert event.type == "app_action"

    def test_details_optional(self, base_fields: dict) -> None:
        event = AppActionEvent(**base_fields, action="open_dashboard")
        assert event.details is None


# --- EventType ---


class TestEventType:
    def test_covers_all_event_classes(self) -> None:
        """EventType 包含所有 7 种事件类型。"""
        expected = {
            "meal",
            "exercise",
            "weigh_in",
            "water_intake",
            "state_checkin",
            "goal",
            "app_action",
        }
        actual = {t.model_fields["type"].default for t in EventType.__args__}
        assert actual == expected
