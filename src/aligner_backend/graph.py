# ABOUTME: LangGraph Dev Server 入口
# ABOUTME: 暴露模块级 graph 变量，供 langgraph.json 引用

from pathlib import Path

from aligner_backend.config.models import ModelRegistry
from aligner_backend.config.prompts import PromptRegistry
from aligner_backend.agent import create_coach_agent

_PROJECT_ROOT = Path(__file__).resolve().parent.parent.parent


def _init() -> None:
    """初始化全局配置（仅在模块首次加载时执行）。"""
    ModelRegistry.configure({
        "coach": {
            "model": "azure_openai:gpt-5.2",
            "azure_deployment": "gpt-52-eastus",
        },
    })
    PromptRegistry.load(_PROJECT_ROOT / "prompts")


_init()
graph = create_coach_agent()
