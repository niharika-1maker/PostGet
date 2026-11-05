import asyncio
from backend.app.api.v1.brand_profile import get_brand_profile, update_brand_profile
from backend.app.domain.brand_profile import BrandProfileUpdate, ContentCategory, ProductionStyle


def test_brand_profile_get_default():
    profile = asyncio.run(get_brand_profile(x_workspace_id="ws_test_01"))
    assert profile.workspace_id == "ws_test_01"
    assert profile.production_style == ProductionStyle.FACELESS
    assert "9:16" in [r.value for r in profile.preferred_aspect_ratios]


def test_brand_profile_update_and_tenant_isolation():
    # Update Workspace Alpha
    update_payload = BrandProfileUpdate(
        brand_name="Alpha AI Studios",
        niches=["autonomous-agents", "video-generation"],
        tone=["bold", "visionary"],
        primary_category=ContentCategory.EDUCATIONAL,
    )
    profile_alpha = asyncio.run(update_brand_profile(payload=update_payload, x_workspace_id="ws_alpha"))
    assert profile_alpha.brand_name == "Alpha AI Studios"
    assert "autonomous-agents" in profile_alpha.niches

    # Read Workspace Beta (must have its own isolated default, NOT Alpha's data)
    profile_beta = asyncio.run(get_brand_profile(x_workspace_id="ws_beta"))
    assert profile_beta.brand_name != "Alpha AI Studios"
    assert "autonomous-agents" not in profile_beta.niches
