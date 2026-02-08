# ABOUTME: PromptRegistry 单元测试
# ABOUTME: 验证提示词加载、获取与错误处理行为

from pathlib import Path

import pytest

from aligner.config.prompts import PromptRegistry


class TestPromptRegistry:
    """PromptRegistry 全局提示词管理中心测试。"""

    def setup_method(self) -> None:
        """每个测试前重置 registry 状态。"""
        PromptRegistry._prompts = {}

    def test_load_reads_md_files(self, tmp_path: Path) -> None:
        """load 应从目录加载所有 .md 文件。"""
        (tmp_path / "coach_system.md").write_text("你是教练。")
        (tmp_path / "analyzer.md").write_text("你是分析师。")

        PromptRegistry.load(tmp_path)

        assert "coach_system" in PromptRegistry._prompts
        assert "analyzer" in PromptRegistry._prompts

    def test_load_ignores_non_md_files(self, tmp_path: Path) -> None:
        """load 应忽略非 .md 文件。"""
        (tmp_path / "coach_system.md").write_text("你是教练。")
        (tmp_path / "config.toml").write_text("[settings]")
        (tmp_path / "notes.txt").write_text("备注")

        PromptRegistry.load(tmp_path)

        assert len(PromptRegistry._prompts) == 1
        assert "coach_system" in PromptRegistry._prompts

    def test_get_returns_prompt_content(self, tmp_path: Path) -> None:
        """get 应返回提示词的完整内容。"""
        content = "你是 Aligner 的教练。\n\n核心原则：冷静、精准。"
        (tmp_path / "coach_system.md").write_text(content)

        PromptRegistry.load(tmp_path)
        result = PromptRegistry.get("coach_system")

        assert result == content

    def test_get_unknown_name_raises(self) -> None:
        """获取未加载的提示词应抛出 KeyError。"""
        with pytest.raises(KeyError):
            PromptRegistry.get("nonexistent")

    def test_load_clears_previous_prompts(self, tmp_path: Path) -> None:
        """重新 load 应清除之前加载的提示词。"""
        PromptRegistry._prompts["old_prompt"] = "旧内容"

        (tmp_path / "new_prompt.md").write_text("新内容")
        PromptRegistry.load(tmp_path)

        assert "old_prompt" not in PromptRegistry._prompts
        assert "new_prompt" in PromptRegistry._prompts

    def test_load_empty_directory(self, tmp_path: Path) -> None:
        """加载空目录应正常执行，结果为空。"""
        PromptRegistry.load(tmp_path)
        assert PromptRegistry._prompts == {}
