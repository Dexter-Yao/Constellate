#!/usr/bin/env python3
# ABOUTME: 测试 LLM 配置连通性的脚本
# ABOUTME: 向各 profile 发送简单消息验证是否正常响应

import os
from pathlib import Path

# 加载 .env 文件
from dotenv import load_dotenv
load_dotenv()

from constellate.config.models import ModelRegistry

# 加载配置
config_path = Path(__file__).parent.parent / "config" / "models.toml"
print(f"Loading config from: {config_path}")
ModelRegistry.load_from_toml(config_path)

# 测试 coach profile
print("\n" + "="*50)
print("Testing 'coach' profile (Azure OpenAI GPT-5.2)...")
print("="*50)

try:
    coach = ModelRegistry.get("coach")
    response = coach.invoke("你好")
    print(f"✅ Response: {response.content}")
except Exception as e:
    print(f"❌ Error: {e}")
