from abc import ABC, abstractmethod
from typing import List, Optional
from pydantic import BaseModel, Field


class VoiceInfo(BaseModel):
    """Voice metadata for TTS selection."""
    voice_id: str
    name: str
    gender: str
    locale: str
    provider: str = "edge-tts"


class TTSResult(BaseModel):
    """Result of speech synthesis."""
    audio_path: str
    duration_seconds: Optional[float] = None
    voice_id: str
    cost_usd: float = 0.0
    provider: str = "edge-tts"


class TTSAdapter(ABC):
    """Interface for text-to-speech audio synthesis."""

    @abstractmethod
    async def synthesize(self, text: str, voice_id: str, output_path: str) -> TTSResult:
        """Synthesize text into an audio file."""
        pass

    @abstractmethod
    async def list_voices(self, locale_prefix: str = "en") -> List[VoiceInfo]:
        """List available voices matching the locale."""
        pass
