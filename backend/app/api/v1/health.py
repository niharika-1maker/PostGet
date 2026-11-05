from fastapi import APIRouter
from backend.app.core.config import get_settings

router = APIRouter()
settings = get_settings()


@router.get("/health", tags=["System"])
async def health_check():
    """Returns application health and operational status."""
    return {
        "status": "healthy",
        "app_name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "environment": settings.ENVIRONMENT,
        "adapters": {
            "video_provider": settings.VIDEO_PROVIDER,
            "tts_provider": settings.TTS_PROVIDER,
            "zero_cost_dev_ready": True,
        },
    }
