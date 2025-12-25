from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import logging
from app.services.scraper import fetch_text
from app.services.cleaner import clean_text
from app.services.chunker import chunk_text
from app.services.embeddings import embed
from app.services.vector_store import vector_store

router = APIRouter(prefix="/api")
logger = logging.getLogger(__name__)

class IngestRequest(BaseModel):
    urls: List[str]

@router.post("/ingest")
async def ingest(request: IngestRequest):
    results = []
    
    for url in request.urls:
        try:
            logger.info(f"Traitement de l'URL: {url}")
            
            # 1. Scraper
            text = fetch_text(url)
            if not text or len(text.strip()) < 50:
                results.append({
                    "url": url,
                    "status": "failed",
                    "reason": "Contenu insuffisant"
                })
                continue
            
            # 2. Nettoyer
            cleaned_text = clean_text(text)
            logger.info(f"Texte nettoyé: {len(cleaned_text)} caractères")
            
            # 3. Découper en chunks
            chunks = chunk_text(cleaned_text, size=300)
            logger.info(f"Nombre de chunks: {len(chunks)}")
            
            # 4. Traiter chaque chunk
            chunk_count = 0
            for i, chunk in enumerate(chunks):
                try:
                    # Embedding
                    vector = embed(chunk)
                    
                    # Ajouter au vector store
                    metadata = {
                        "url": url,
                        "chunk_index": i,
                        "char_count": len(chunk)
                    }
                    vector_store.add_vector(vector, chunk, metadata)
                    chunk_count += 1
                    
                except Exception as e:
                    logger.error(f"Erreur sur chunk {i}: {e}")
                    continue
            
            # Sauvegarder après chaque URL
            vector_store.save()
            
            results.append({
                "url": url,
                "status": "success",
                "chunks_added": chunk_count,
                "total_chars": len(cleaned_text)
            })
            
        except Exception as e:
            logger.error(f"Erreur sur l'URL {url}: {e}")
            results.append({
                "url": url,
                "status": "failed",
                "reason": str(e)
            })
    
    return {
        "status": "completed",
        "results": results,
        "total_urls": len(request.urls),
        "successful": len([r for r in results if r["status"] == "success"]),
        "total_vectors": vector_store.index.ntotal
    }