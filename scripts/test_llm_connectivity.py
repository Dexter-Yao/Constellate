#!/usr/bin/env python3
# ABOUTME: 测试 LLM 配置连通性的脚本
# ABOUTME: 向各 profile 发送简单消息验证是否正常响应

from pathlib import Path

from dotenv import load_dotenv

from constellate.config.models import ModelRegistry


def main() -> None:
    """加载配置并测试 coach profile 连通性。"""
    load_dotenv()

    config_path = Path(__file__).parent.parent / "config" / "models.toml"
    print(f"Loading config from: {config_path}")
    ModelRegistry.load_from_toml(config_path)

    print("\n" + "=" * 50)
    print("Testing 'coach' profile (Gemini 3 Pro)...")
    print("=" * 50)

    try:
        coach = ModelRegistry.get("coach")
        response = coach.invoke("你好")
        print(f"[OK] Response: {response.content}")
    except Exception as e:
        print(f"[ERROR] {e}")


if __name__ == "__main__":
    main()
