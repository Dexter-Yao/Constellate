# ABOUTME: LangGraph Dev Server 入口
# ABOUTME: 暴露模块级 graph 变量，供 langgraph.json 引用

from pathlib import Path

from constellate.config.models import ModelRegistry
from constellate.config.prompts import PromptRegistry
from constellate.agent import create_coach_agent

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


def _init() -> None:
    """初始化全局配置（仅在模块首次加载时执行）。"""
    ModelRegistry.load_from_toml(_PROJECT_ROOT / "config" / "models.toml")
    PromptRegistry.load(_PROJECT_ROOT / "prompts")


_init()
graph = create_coach_agent()
