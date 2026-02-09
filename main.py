# ABOUTME: Constellate 应用入口
# ABOUTME: 初始化配置并创建 Coach Agent

from pathlib import Path

from constellate.config.models import ModelRegistry
from constellate.config.prompts import PromptRegistry
from constellate.agent import create_coach_agent

PROJECT_ROOT = Path(__file__).parent


def init() -> None:
    """初始化全局配置。"""
    ModelRegistry.load_from_toml(PROJECT_ROOT / "config" / "models.toml")
    PromptRegistry.load(PROJECT_ROOT / "prompts")


def main() -> None:
    """创建 Coach Agent 并启动。"""
    init()
    agent = create_coach_agent()
    print(f"Coach Agent 就绪: {agent.name}")


if __name__ == "__main__":
    main()
