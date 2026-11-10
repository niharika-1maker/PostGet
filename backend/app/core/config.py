from functools import lru_cache
from typing import Optional
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Authoritative application settings loaded from environment or .env."""

    # Application & Environment
    ENVIRONMENT: str = "development"
    LOG_LEVEL: str = "INFO"
    APP_NAME: str = "AI Content OS Backend"
    APP_VERSION: str = "0.1.0"
    APP_URL: str = "http://localhost:3000"
    BACKEND_URL: str = "http://localhost:8000"

    # Supabase (PostgreSQL, Auth, Storage)
    NEXT_PUBLIC_SUPABASE_URL: str = "https://your-project.supabase.co"
    NEXT_PUBLIC_SUPABASE_ANON_KEY: str = "anon-key-placeholder"
    SUPABASE_SERVICE_ROLE_KEY: Optional[str] = None
    DATABASE_URL: Optional[str] = None

    # AI Reasoning (BYOK)
    GEMINI_API_KEY: Optional[str] = None
    OPENAI_API_KEY: Optional[str] = None
    ANTHROPIC_API_KEY: Optional[str] = None

    # Video & Voice Adapters
    VIDEO_PROVIDER: str = "mock"
    REPLICATE_API_TOKEN: Optional[str] = None
    TTS_PROVIDER: str = "edge-tts"
    ELEVENLABS_API_KEY: Optional[str] = None

    # Media Paths
    TEMP_MEDIA_DIR: str = "./temp"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache()
def get_settings() -> Settings:
    """Return cached application settings instance."""
    return Settings()

