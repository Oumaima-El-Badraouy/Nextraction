from fastapi import APIRouter
from app.services.vector_store import vector_store

router = APIRouter(prefix="/api")

@router.get("/stats")
async def get_stats():
    return {
        "total_vectors": vector_store.index.ntotal,
        "dimension": vector_store.dimension,
        "chunks_count": len(vector_store.chunks),
        "index_size": f"{vector_store.index.ntotal * vector_store.dimension * 4 / 1024:.2f} KB"
    }