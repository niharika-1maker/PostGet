import os
import asyncio
from backend.app.adapters.tts.edge_tts_adapter import EdgeTTSAdapter


def test_edge_tts_synthesize_audio(tmp_path):
    adapter = EdgeTTSAdapter(output_dir=str(tmp_path))
    test_audio_path = os.path.join(tmp_path, "test_speech.mp3")

    result = asyncio.run(
        adapter.synthesize(
            text="AI Content OS zero cost neural voice synthesis verified.",
            voice_id="en-US-ChristopherNeural",
            output_path=test_audio_path,
        )
    )

    assert result.provider == "edge-tts"
    assert result.cost_usd == 0.0
    assert os.path.exists(test_audio_path)
    assert os.path.getsize(test_audio_path) > 1000  # Valid MP3 file with real audio data

