import os
import asyncio
from backend.app.adapters.video.mock_adapter import MockVideoAdapter
from backend.app.adapters.video.interface import VideoClipRequest, VideoJobState


def test_mock_video_adapter_generates_valid_clip(tmp_path):
    adapter = MockVideoAdapter(output_dir=str(tmp_path))
    request = VideoClipRequest(
        scene_id="scene_001",
        prompt="Cinematic drone shot of modern tech office with glowing screens",
        aspect_ratio="9:16",
        duration_seconds=5,
    )

    result = asyncio.run(adapter.submit_clip_generation(request))

    assert result.state == VideoJobState.SUCCEEDED
    assert result.job_id.startswith("mock-job-")
    assert result.width == 1080
    assert result.height == 1920
    assert result.duration_seconds == 5.0
    assert result.local_path is not None
    assert os.path.exists(result.local_path)
    assert os.path.getsize(result.local_path) > 0  # Real non-empty video file

    # Verify query status
    status_result = asyncio.run(adapter.get_job_status(result.job_id))
    assert status_result.job_id == result.job_id
    assert status_result.state == VideoJobState.SUCCEEDED
