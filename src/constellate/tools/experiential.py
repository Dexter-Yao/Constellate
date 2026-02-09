# ABOUTME: 体验式干预工具
# ABOUTME: 调用 Gemini 3 Pro Image API 生成干预内容，通过 interrupt() 供用户审阅

import base64
import os

from langchain_core.tools import tool
from langgraph.types import interrupt

_intervention_cache: dict[int, tuple[str, str]] = {}
"""模块级缓存，避免 resume 重执行时重复调用 Gemini API。

LangGraph 在 interrupt() 后 resume 时会从 node 起重新执行。
缓存确保同一 prompt 不会重复调用付费 API。
值为 (base64_data, mime_type) 元组。
"""


@tool
def compose_experiential_intervention(
    prompt: str,
    aspect_ratio: str = "3:4",
    purpose: str = "",
    caption: str = "",
) -> str:
    """根据教练干预意图生成体验式干预内容并展示给用户审阅。

    干预内容基于研究理论（Future Self-Continuity、MCII/WOOP、概念隐喻、CBT），
    服务于明确的教练目的：传递洞察、触发情感共鸣、辅助场景代入。

    Args:
        prompt: 完整的生成 prompt，由 Intervention Composer 组装。
        aspect_ratio: 宽高比，如 "3:4"、"1:1"、"16:9"。
        purpose: 干预类型标识，如 "future_self"、"scene_rehearsal"。
        caption: Coach 语气的说明文字，传达干预意图。
    """
    cache_key = hash(prompt)

    if cache_key not in _intervention_cache:
        from google import genai
        from google.genai import types

        client = genai.Client(api_key=os.environ["GEMINI_API_KEY"])
        response = client.models.generate_content(
            model="gemini-3-pro-image-preview",
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
                image_config=types.ImageConfig(
                    aspect_ratio=aspect_ratio,
                ),
            ),
        )
        image_part = response.candidates[0].content.parts[0]
        _intervention_cache[cache_key] = (
            base64.b64encode(image_part.inline_data.data).decode(),
            image_part.inline_data.mime_type or "image/jpeg",
        )

    cached_b64, cached_mime = _intervention_cache[cache_key]

    decision = interrupt({
        "type": "experiential_intervention_review",
        "image_base64": cached_b64,
        "mime_type": cached_mime,
        "purpose": purpose,
        "caption": caption,
    })

    _intervention_cache.pop(cache_key, None)

    if isinstance(decision, dict) and decision.get("accepted"):
        return f"用户收下了体验式干预（{purpose}）。{caption}"
    return f"用户取消了体验式干预（{purpose}）"
