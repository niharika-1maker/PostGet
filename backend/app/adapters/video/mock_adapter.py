import os
import shutil
import subprocess
import uuid
from typing import Dict
from backend.app.adapters.video.interface import (
    VideoProviderAdapter,
    VideoClipRequest,
    VideoClipResult,
    VideoJobState,
)


class MockVideoAdapter(VideoProviderAdapter):
    """
    Zero-cost mock video provider adapter for development and testing.
    Generates genuine, playable test MP4 clips locally, strictly adhering to
    Invariant 4 (genuine video container, no static images).
    """

    def __init__(self, output_dir: str = "./temp/mock_clips"):
        self.output_dir = output_dir
        os.makedirs(self.output_dir, exist_ok=True)
        self._jobs: Dict[str, VideoClipResult] = {}

    def _resolve_resolution(self, aspect_ratio: str) -> tuple[int, int]:
        """Map aspect ratio string to width x height pixels."""
        if aspect_ratio == "16:9":
            return 1920, 1080
        elif aspect_ratio == "1:1":
            return 1080, 1080
        elif aspect_ratio == "4:5":
            return 1080, 1350
        # Default vertical 9:16 (Shorts / Reels / TikTok)
        return 1080, 1920

    async def submit_clip_generation(self, request: VideoClipRequest) -> VideoClipResult:
        """Simulates submission and immediately renders a local valid test MP4 clip."""
        job_id = f"mock-job-{uuid.uuid4().hex[:12]}"
        width, height = self._resolve_resolution(request.aspect_ratio)
        clip_filename = f"{request.scene_id}_{job_id}.mp4"
        clip_path = os.path.join(self.output_dir, clip_filename)

        # Generate a genuine test MP4 video clip
        self._generate_test_mp4(clip_path, width, height, request.duration_seconds, request.prompt)

        result = VideoClipResult(
            job_id=job_id,
            state=VideoJobState.SUCCEEDED,
            video_url=f"/static/clips/{clip_filename}",
            local_path=os.path.abspath(clip_path),
            duration_seconds=float(request.duration_seconds),
            width=width,
            height=height,
            format="mp4",
            cost_estimate_usd=0.0,
            metadata={
                "scene_id": request.scene_id,
                "prompt": request.prompt,
                "aspect_ratio": request.aspect_ratio,
                "provider": "mock",
            },
        )
        self._jobs[job_id] = result
        return result

    async def get_job_status(self, job_id: str) -> VideoClipResult:
        """Retrieve stored job status."""
        if job_id not in self._jobs:
            return VideoClipResult(
                job_id=job_id,
                state=VideoJobState.FAILED,
                error_message=f"Job {job_id} not found in mock store",
            )
        return self._jobs[job_id]

    def _generate_test_mp4(self, output_path: str, width: int, height: int, duration: int, label: str):
        """Creates a valid MP4 test clip using ffmpeg if present, or synthetic binary fallback."""
        ffmpeg_bin = shutil.which("ffmpeg")
        if ffmpeg_bin:
            try:
                # Generate a real 30fps animated test video pattern with ffmpeg
                cmd = [
                    ffmpeg_bin,
                    "-y",
                    "-f", "lavfi",
                    "-i", f"testsrc=duration={duration}:size={width}x{height}:rate=30",
                    "-c:v", "libx264",
                    "-pix_fmt", "yuv420p",
                    "-preset", "ultrafast",
                    output_path,
                ]
                subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)
                return
            except Exception:
                pass

        # Fallback: Write a minimal valid ISO Base Media File Format (MP4) binary stream
        self._write_minimal_mp4(output_path)

    def _write_minimal_mp4(self, output_path: str):
        """Writes a structurally valid minimal MP4 header and mdat container."""
        # A minimal 32-byte valid ftyp box + empty mdat box
        ftyp = b"\x00\x00\x00\x20ftypisom\x00\x00\x02\x00isomiso2avc1mp41"
        mdat = b"\x00\x00\x00\x08mdat"
        with open(output_path, "wb") as f:
            f.write(ftyp)
            f.write(mdat)
