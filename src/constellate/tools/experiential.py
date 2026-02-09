# ABOUTME: 体验式干预工具
# ABOUTME: 调用 Gemini 3 Pro Image API 生成干预内容，通过 A2UI interrupt() 供用户审阅

import base64
import os

from langchain_core.tools import tool
from langgraph.types import interrupt

from constellate.a2ui import (
    A2UIPayload,
    A2UIResponse,
    ImageComponent,
    SelectComponent,
    SelectOption,
    TextComponent,
)

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
    """Generate experiential intervention content and present it for user review.

    Based on research theories (Future Self-Continuity, MCII/WOOP, Conceptual Metaphor, CBT),
    translates coaching insights into felt experiences.

    Args:
        prompt: Full generation prompt, assembled by Intervention Composer.
        aspect_ratio: Aspect ratio, e.g. "3:4", "1:1", "16:9".
        purpose: Intervention type identifier, e.g. "future_self", "scene_rehearsal".
        caption: Coach-voice narrative conveying the intervention intent.
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

    payload = A2UIPayload(
        components=[
            ImageComponent(src=f"data:{cached_mime};base64,{cached_b64}", alt=purpose),
            TextComponent(content=caption),
            SelectComponent(
                name="decision",
                label="",
                options=[
                    SelectOption(label="Accept", value="accept"),
                    SelectOption(label="Dismiss", value="dismiss"),
                ],
            ),
        ],
        layout="full",
    )
    raw_response = interrupt(payload.model_dump())
    response = A2UIResponse.model_validate(raw_response)

    _intervention_cache.pop(cache_key, None)

    if response.action == "reject":
        return f"User dismissed the experiential intervention ({purpose})."
    if response.data.get("decision") == "accept":
        return f"User accepted the experiential intervention ({purpose}). {caption}"
    return f"User dismissed the experiential intervention ({purpose})."
