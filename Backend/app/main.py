from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ingest, ask, health, verify, stats

# Créer l'instance app
app = FastAPI(
    title="Nextraction 2 - Backend",
    description="API pour le RAG avec scraping web",
    version="1.0.0"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(ingest.router)
app.include_router(ask.router)
app.include_router(health.router)
app.include_router(verify.router)
app.include_router(stats.router)

@app.get("/")
async def root():
    return {
        "message": "Nextraction 2 Backend API",
        "endpoints": {
            "ingest": "POST /api/ingest",
            "ask": "POST /api/ask",
            "health": "GET /api/health",
            "verify-urls": "POST /api/verify-urls",
            "stats": "GET /api/stats"
        }
    }