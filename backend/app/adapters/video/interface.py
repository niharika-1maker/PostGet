from abc import ABC, abstractmethod
from enum import Enum
from typing import Optional, Dict, Any
from pydantic import BaseModel, Field


class VideoJobState(str, Enum):
    QUEUED = "QUEUED"
    RUNNING = "RUNNING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class VideoClipRequest(BaseModel):
    """Normalized request specification for generating a scene video clip."""
    scene_id: str
    prompt: str = Field(..., min_length=5, description="Visual prompt for the diffusion model")
    negative_prompt: Optional[str] = None
    aspect_ratio: str = Field(default="9:16", description="9:16, 16:9, 1:1, or 4:5")
    duration_seconds: int = Field(default=5, ge=3, le=15, description="Target clip duration")
    seed: Optional[int] = None
    character_references: Optional[list] = None


class VideoClipResult(BaseModel):
    """Result of a completed or in-progress video clip generation job."""
    job_id: str
    state: VideoJobState
    video_url: Optional[str] = None
    local_path: Optional[str] = None
    duration_seconds: Optional[float] = None
    width: Optional[int] = None
    height: Optional[int] = None
    format: Optional[str] = "mp4"
    cost_estimate_usd: float = 0.0
    error_message: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class VideoProviderAdapter(ABC):
    """Provider-agnostic interface for scene-level AI video generation."""

    @abstractmethod
    async def submit_clip_generation(self, request: VideoClipRequest) -> VideoClipResult:
        """Submit a scene video clip generation job."""
        pass

    @abstractmethod
    async def get_job_status(self, job_id: str) -> VideoClipResult:
        """Query status of a durable video generation job."""
        pass
