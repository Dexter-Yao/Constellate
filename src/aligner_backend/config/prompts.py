# ABOUTME: 全局提示词管理中心
# ABOUTME: 从 prompts/ 目录加载 Markdown 文件，提供统一的提示词获取接口

from pathlib import Path


class PromptRegistry:
    """全局提示词管理中心，从文件加载，git diff 友好。"""

    _prompts: dict[str, str] = {}

    @classmethod
    def load(cls, prompts_dir: Path) -> None:
        """从指定目录加载所有 .md 文件作为提示词。

        文件名（不含扩展名）作为提示词名称。
        """
        cls._prompts.clear()
        for md_file in prompts_dir.glob("*.md"):
            cls._prompts[md_file.stem] = md_file.read_text()

    @classmethod
    def get(cls, name: str) -> str:
        """获取指定名称的提示词内容。"""
        return cls._prompts[name]
