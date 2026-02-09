# ABOUTME: Coach Agent 工厂函数
# ABOUTME: 组装 DeepAgent 配置，创建 Coach Agent 实例

from langgraph.graph.state import CompiledStateGraph
from langgraph.store.base import BaseStore
from langgraph.store.memory import InMemoryStore

from deepagents import create_deep_agent
from deepagents.backends import CompositeBackend, StateBackend, StoreBackend

from constellate.config.models import ModelRegistry
from constellate.config.prompts import PromptRegistry


def _create_backend_factory() -> callable:
    """创建 CompositeBackend 工厂函数。

    路由规则：
    - /user/ → StoreBackend（持久存储）
    - 其他 → StateBackend（临时存储）
    """

    def factory(rt):  # noqa: ANN001
        return CompositeBackend(
            default=StateBackend(rt),
            routes={
                "/user/": StoreBackend(
                    rt,
                    namespace=lambda ctx: ("constellate", "user"),
                ),
            },
        )

    return factory


def create_coach_agent(
    *,
    store: BaseStore | None = None,
) -> CompiledStateGraph:
    """创建 Coach Agent。

    Args:
        store: 持久化存储后端。默认为 None，由 LangGraph API 自动注入。
    """
    kwargs = {
        "model": ModelRegistry.get("coach"),
        "system_prompt": PromptRegistry.get("coach_system"),
        "backend": _create_backend_factory(),
        "name": "coach",
    }
    if store is not None:
        kwargs["store"] = store

    return create_deep_agent(**kwargs)

