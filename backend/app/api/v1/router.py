from fastapi import APIRouter
from backend.app.api.v1.health import router as health_router
from backend.app.api.v1.brand_profile import router as brand_profile_router

api_v1_router = APIRouter(prefix="/api/v1")
api_v1_router.include_router(health_router)
api_v1_router.include_router(brand_profile_router)
