# ABOUTME: Coach Agent 工厂函数测试
# ABOUTME: 验证 agent 创建配置的正确性

from unittest.mock import MagicMock, patch

import pytest
from langgraph.store.memory import InMemoryStore

from constellate.agent import create_coach_agent


class TestCreateCoachAgent:
    """Coach Agent 工厂函数测试。"""

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_passes_model_from_registry(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """应使用 ModelRegistry 获取 coach 模型。"""
        mock_model = MagicMock()
        mock_model_reg.get.return_value = mock_model
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        create_coach_agent()

        mock_model_reg.get.assert_called_once_with("coach")
        call_kwargs = mock_create.call_args
        assert call_kwargs.kwargs["model"] == mock_model

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_passes_prompt_from_registry(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """应使用 PromptRegistry 获取 coach 系统提示词。"""
        mock_model_reg.get.return_value = MagicMock()
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        create_coach_agent()

        mock_prompt_reg.get.assert_called_once_with("coach_system")
        call_kwargs = mock_create.call_args
        assert call_kwargs.kwargs["system_prompt"] == "你是教练。"

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_passes_store(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """应传入 store 实例。"""
        mock_model_reg.get.return_value = MagicMock()
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        store = InMemoryStore()
        create_coach_agent(store=store)

        call_kwargs = mock_create.call_args
        assert call_kwargs.kwargs["store"] is store

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_backend_is_callable_factory(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """backend 应为可调用的工厂函数（接受 ToolRuntime）。"""
        mock_model_reg.get.return_value = MagicMock()
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        create_coach_agent()

        call_kwargs = mock_create.call_args
        backend_factory = call_kwargs.kwargs["backend"]
        assert callable(backend_factory)

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_backend_factory_creates_composite(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """backend 工厂函数应创建 CompositeBackend。"""
        from deepagents.backends import CompositeBackend

        mock_model_reg.get.return_value = MagicMock()
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        create_coach_agent()

        call_kwargs = mock_create.call_args
        backend_factory = call_kwargs.kwargs["backend"]

        # 用 mock runtime 调用工厂函数
        mock_runtime = MagicMock()
        backend = backend_factory(mock_runtime)
        assert isinstance(backend, CompositeBackend)

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_no_custom_tools_in_v1(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """V1 不配置自定义工具。"""
        mock_model_reg.get.return_value = MagicMock()
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        create_coach_agent()

        call_kwargs = mock_create.call_args
        assert call_kwargs.kwargs.get("tools") is None

    @patch("constellate.agent.create_deep_agent")
    @patch("constellate.agent.PromptRegistry")
    @patch("constellate.agent.ModelRegistry")
    def test_sets_agent_name(
        self,
        mock_model_reg: MagicMock,
        mock_prompt_reg: MagicMock,
        mock_create: MagicMock,
    ) -> None:
        """应设置 agent 名称为 coach。"""
        mock_model_reg.get.return_value = MagicMock()
        mock_prompt_reg.get.return_value = "你是教练。"
        mock_create.return_value = MagicMock()

        create_coach_agent()

        call_kwargs = mock_create.call_args
        assert call_kwargs.kwargs["name"] == "coach"
