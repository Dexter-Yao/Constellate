# ABOUTME: ModelRegistry 单元测试
# ABOUTME: 验证 LLM 配置中心的加载、获取与缓存行为

from unittest.mock import MagicMock, patch

import pytest

from aligner_backend.config.models import ModelRegistry


class TestModelRegistry:
    """ModelRegistry 全局 LLM 配置中心测试。"""

    def setup_method(self) -> None:
        """每个测试前重置 registry 状态。"""
        ModelRegistry._profiles = {}
        ModelRegistry._instances = {}

    def test_configure_loads_profiles(self) -> None:
        """configure 应加载 profile 配置。"""
        profiles = {
            "coach": {"model": "openai:gpt-4o"},
        }
        ModelRegistry.configure(profiles)
        assert ModelRegistry._profiles == profiles

    def test_configure_clears_cached_instances(self) -> None:
        """重新 configure 应清除已缓存的模型实例。"""
        ModelRegistry._instances["old"] = MagicMock()
        ModelRegistry.configure({"coach": {"model": "openai:gpt-4o"}})
        assert ModelRegistry._instances == {}

    @patch("aligner_backend.config.models.init_chat_model")
    def test_get_creates_model_instance(self, mock_init: MagicMock) -> None:
        """get 应使用 profile 配置创建模型实例。"""
        mock_model = MagicMock()
        mock_init.return_value = mock_model

        ModelRegistry.configure({"coach": {"model": "openai:gpt-4o"}})
        result = ModelRegistry.get("coach")

        mock_init.assert_called_once_with(model="openai:gpt-4o")
        assert result is mock_model

    @patch("aligner_backend.config.models.init_chat_model")
    def test_get_caches_instance(self, mock_init: MagicMock) -> None:
        """多次 get 同一 profile 应返回缓存实例，不重复创建。"""
        mock_init.return_value = MagicMock()

        ModelRegistry.configure({"coach": {"model": "openai:gpt-4o"}})
        first = ModelRegistry.get("coach")
        second = ModelRegistry.get("coach")

        assert first is second
        mock_init.assert_called_once()

    def test_get_unknown_profile_raises(self) -> None:
        """获取未配置的 profile 应抛出 KeyError。"""
        ModelRegistry.configure({})
        with pytest.raises(KeyError):
            ModelRegistry.get("nonexistent")

    @patch("aligner_backend.config.models.init_chat_model")
    def test_get_passes_extra_kwargs(self, mock_init: MagicMock) -> None:
        """profile 中的额外参数应传递给 init_chat_model。"""
        mock_init.return_value = MagicMock()

        ModelRegistry.configure({
            "coach": {
                "model": "azure_openai:gpt-5.2",
                "azure_deployment": "gpt-52-eastus",
            },
        })
        ModelRegistry.get("coach")

        mock_init.assert_called_once_with(
            model="azure_openai:gpt-5.2",
            azure_deployment="gpt-52-eastus",
        )
