from fastapi import APIRouter
from app.services.vector_store import vector_store

router = APIRouter(prefix="/api")

@router.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "Nextraction 2 Backend",
        "vector_store": vector_store.index.ntotal
    }