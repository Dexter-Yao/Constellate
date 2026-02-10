# ABOUTME: Backend Dockerfile for LangGraph API server
# ABOUTME: Uses uv for Python dependency management, Python 3.12

FROM python:3.12-slim

WORKDIR /app

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

# Copy dependency files first for cache optimization
COPY pyproject.toml uv.lock ./

# Install dependencies
RUN uv sync --frozen --no-dev

# Copy application code
COPY src/ ./src/
COPY prompts/ ./prompts/
COPY config/ ./config/
COPY langgraph.json ./
COPY main.py ./

# Set Python path
ENV PYTHONPATH="/app/src"
ENV PYTHONUNBUFFERED=1

# Expose LangGraph API port
EXPOSE 2024

# Run LangGraph server
CMD ["uv", "run", "langgraph", "dev", "--host", "0.0.0.0", "--port", "2024", "--no-browser"]
