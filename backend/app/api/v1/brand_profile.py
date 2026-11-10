from datetime import datetime, timezone
from typing import Dict
from fastapi import APIRouter, Header, HTTPException, status
from backend.app.domain.brand_profile import (
    BrandProfileCreate,
    BrandProfileUpdate,
    BrandProfileResponse,
    ContentCategory,
    ProductionStyle,
    AspectRatioPreference,
)

router = APIRouter()

# In-memory store keyed by workspace_id for Phase 1 (bound to PostgreSQL in Task 1.3)
_PROFILES_STORE: Dict[str, BrandProfileResponse] = {}

DEFAULT_WORKSPACE_ID = "ws_default_01"


def _get_or_create_default(workspace_id: str) -> BrandProfileResponse:
    """Return existing profile or initialize empty default for workspace."""
    if workspace_id not in _PROFILES_STORE:
        now = datetime.now(timezone.utc)
        _PROFILES_STORE[workspace_id] = BrandProfileResponse(
            id=f"bp_{workspace_id}",
            workspace_id=workspace_id,
            brand_name="My Content Brand",
            description="AI-first content creation brand profile",
            primary_category=ContentCategory.EDUCATIONAL,
            niches=["tech", "productivity", "ai"],
            target_audience="Creators, builders and professionals",
            languages=["en"],
            tone=["concise", "engaging", "practical"],
            content_goals=["audience growth", "authority"],
            production_style=ProductionStyle.FACELESS,
            preferred_aspect_ratios=[AspectRatioPreference.VERTICAL_9_16],
            brand_colors=["#0F172A", "#38BDF8"],
            preferred_voice_id="en-US-ChristopherNeural",
            voice_provider="edge-tts",
            recurring_characters=[],
            default_call_to_action="Follow for daily actionable AI workflows",
            content_restrictions=["no financial advice", "no unsubstantiated claims"],
            created_at=now,
            updated_at=now,
        )
    return _PROFILES_STORE[workspace_id]


@router.get("/brand-profile", response_model=BrandProfileResponse, tags=["Brand Profile"])
async def get_brand_profile(x_workspace_id: str = Header(default=DEFAULT_WORKSPACE_ID)):
    """Fetch current workspace brand profile."""
    if not x_workspace_id or not x_workspace_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Header X-Workspace-Id is required for tenant isolation",
        )
    return _get_or_create_default(x_workspace_id.strip())


@router.put("/brand-profile", response_model=BrandProfileResponse, tags=["Brand Profile"])
async def update_brand_profile(
    payload: BrandProfileUpdate,
    x_workspace_id: str = Header(default=DEFAULT_WORKSPACE_ID),
):
    """Update workspace brand profile with partial or full attributes."""
    if not x_workspace_id or not x_workspace_id.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Header X-Workspace-Id is required for tenant isolation",
        )
    
    ws_id = x_workspace_id.strip()
    profile = _get_or_create_default(ws_id)
    
    # Apply partial updates
    update_data = payload.model_dump(exclude_unset=True)
    existing_data = profile.model_dump()
    existing_data.update(update_data)
    existing_data["updated_at"] = datetime.now(timezone.utc)
    
    updated_profile = BrandProfileResponse(**existing_data)
    _PROFILES_STORE[ws_id] = updated_profile
    return updated_profile

