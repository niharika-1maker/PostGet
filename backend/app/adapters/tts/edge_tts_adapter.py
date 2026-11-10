import os
from typing import List
import edge_tts
from backend.app.adapters.tts.interface import TTSAdapter, TTSResult, VoiceInfo


class EdgeTTSAdapter(TTSAdapter):
    """
    100% Free Microsoft Neural Text-to-Speech adapter via edge-tts.
    Requires zero API keys and generates high-fidelity voiceover tracks.
    """

    DEFAULT_VOICE = "en-US-ChristopherNeural"

    def __init__(self, output_dir: str = "./temp/audio"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)

    async def synthesize(self, text: str, voice_id: str = None, output_path: str = None) -> TTSResult:
        """Synthesizes text into an MP3 audio file asynchronously."""
        voice = voice_id or self.DEFAULT_VOICE
        if not output_path:
            import uuid
            output_path = os.path.join(self.output_dir, f"speech_{uuid.uuid4().hex[:10]}.mp3")

        os.makedirs(os.path.dirname(output_path), exist_ok=True)

        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_path)

        return TTSResult(
            audio_path=os.path.abspath(output_path),
            voice_id=voice,
            cost_usd=0.0,
            provider="edge-tts",
        )

    async def list_voices(self, locale_prefix: str = "en") -> List[VoiceInfo]:
        """Fetch available neural voices filtered by locale prefix."""
        voices = await edge_tts.list_voices()
        result = []
        for v in voices:
            locale = v.get("Locale", "")
            if locale.lower().startswith(locale_prefix.lower()):
                result.append(
                    VoiceInfo(
                        voice_id=v.get("ShortName", ""),
                        name=v.get("FriendlyName", v.get("ShortName", "")),
                        gender=v.get("Gender", "Unknown"),
                        locale=locale,
                        provider="edge-tts",
                    )
                )
        return result

