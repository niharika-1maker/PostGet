from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field, HttpUrl


class ContentCategory(str, Enum):
    EDUCATIONAL = "educational"
    ENTERTAINMENT = "entertainment"
    STORYTELLING = "storytelling"
    PRODUCT_SHOWCASE = "product_showcase"
    PERSONAL_BRAND = "personal_brand"
    DOCUMENTARY = "documentary"
    OTHER = "other"


class ProductionStyle(str, Enum):
    FACELESS = "faceless"
    AVATAR = "avatar"
    HYBRID = "hybrid"


class AspectRatioPreference(str, Enum):
    VERTICAL_9_16 = "9:16"
    HORIZONTAL_16_9 = "16:9"
    SQUARE_1_1 = "1:1"
    PORTRAIT_4_5 = "4:5"


class BrandProfileBase(BaseModel):
    """Core domain schema for creator and brand profiles."""

    brand_name: str = Field(..., min_length=1, max_length=120, description="Name of the brand or creator")
    description: Optional[str] = Field(None, max_length=1000, description="Overview of brand identity and mission")
    
    # Niche & Audience
    primary_category: ContentCategory = Field(default=ContentCategory.EDUCATIONAL)
    niches: List[str] = Field(default_factory=list, description="Target topics or content niches")
    target_audience: Optional[str] = Field(None, max_length=500, description="Audience demographic & psychographics")
    
    # Languages, Tone & Goals
    languages: List[str] = Field(default_factory=lambda: ["en"], description="Content languages (e.g. en, es, hi)")
    tone: List[str] = Field(default_factory=lambda: ["engaging", "informative"], description="Tone descriptors")
    content_goals: List[str] = Field(default_factory=list, description="Goals e.g. growth, authority, sales")
    
    # Formats & Aesthetics
    production_style: ProductionStyle = Field(default=ProductionStyle.FACELESS, description="Faceless vs Avatar")
    preferred_aspect_ratios: List[AspectRatioPreference] = Field(
        default_factory=lambda: [AspectRatioPreference.VERTICAL_9_16]
    )
    brand_colors: List[str] = Field(default_factory=list, description="Hex color codes, e.g. #0F172A")
    logo_url: Optional[str] = Field(None, description="Storage URL for brand logo")
    
    # Voice & Audio
    preferred_voice_id: Optional[str] = Field(None, description="Voice ID from Edge-TTS or ElevenLabs")
    voice_provider: str = Field(default="edge-tts", description="edge-tts or elevenlabs")
    
    # Recurring Elements & Guardrails
    recurring_characters: List[Dict[str, Any]] = Field(default_factory=list, description="Continuity character refs")
    default_call_to_action: Optional[str] = Field(None, max_length=300)
    content_restrictions: List[str] = Field(default_factory=list, description="Forbidden topics, words, or styles")


class BrandProfileCreate(BrandProfileBase):
    """Schema for creating a new brand profile."""
    pass


class BrandProfileUpdate(BaseModel):
    """Schema for partial or full brand profile update."""
    brand_name: Optional[str] = Field(None, min_length=1, max_length=120)
    description: Optional[str] = None
    primary_category: Optional[ContentCategory] = None
    niches: Optional[List[str]] = None
    target_audience: Optional[str] = None
    languages: Optional[List[str]] = None
    tone: Optional[List[str]] = None
    content_goals: Optional[List[str]] = None
    production_style: Optional[ProductionStyle] = None
    preferred_aspect_ratios: Optional[List[AspectRatioPreference]] = None
    brand_colors: Optional[List[str]] = None
    logo_url: Optional[str] = None
    preferred_voice_id: Optional[str] = None
    voice_provider: Optional[str] = None
    recurring_characters: Optional[List[Dict[str, Any]]] = None
    default_call_to_action: Optional[str] = None
    content_restrictions: Optional[List[str]] = None


class BrandProfileResponse(BrandProfileBase):
    """Schema for returning brand profile data."""
    id: str
    workspace_id: str
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
