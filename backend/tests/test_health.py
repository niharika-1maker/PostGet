import asyncio
from backend.app.api.v1.health import health_check


def test_health_check_returns_healthy():
    data = asyncio.run(health_check())
    assert data["status"] == "healthy"
    assert data["adapters"]["zero_cost_dev_ready"] is True
    assert data["adapters"]["video_provider"] == "mock"
    assert data["adapters"]["tts_provider"] == "edge-tts"
