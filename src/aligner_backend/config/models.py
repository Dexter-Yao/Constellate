# ABOUTME: 全局 LLM 配置中心
# ABOUTME: 统一管理所有模型 profile，不设置 temperature 参数

from langchain.chat_models import init_chat_model
from langchain_core.language_models import BaseChatModel


class ModelRegistry:
    """全局 LLM 配置中心，单一事实来源。"""

    _profiles: dict[str, dict] = {}
    _instances: dict[str, BaseChatModel] = {}

    @classmethod
    def configure(cls, profiles: dict[str, dict]) -> None:
        """加载模型 profile 配置，清除已缓存实例。"""
        cls._profiles = profiles
        cls._instances.clear()

    @classmethod
    def get(cls, profile: str) -> BaseChatModel:
        """获取指定 profile 的模型实例，自动缓存。"""
        if profile not in cls._instances:
            config = cls._profiles[profile]
            cls._instances[profile] = init_chat_model(**config)
        return cls._instances[profile]
