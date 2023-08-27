from fastapi import APIRouter

from infrastructure.api.v1.http_routes import router as api_v1_router

router = APIRouter(prefix="/api")
router.include_router(api_v1_router)
