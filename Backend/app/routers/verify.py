from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
import requests

router = APIRouter(prefix="/api")

class VerifyRequest(BaseModel):
    urls: List[str]

@router.post("/verify-urls")
async def verify_urls(request: VerifyRequest):
    results = []
    
    for url in request.urls:
        try:
            headers = {'User-Agent': 'Mozilla/5.0'}
            response = requests.head(url, headers=headers, timeout=5, allow_redirects=True)
            
            if response.status_code == 200:
                results.append({
                    "url": url,
                    "accessible": True,
                    "status_code": response.status_code,
                    "content_type": response.headers.get('content-type', '')
                })
            else:
                results.append({
                    "url": url,
                    "accessible": False,
                    "status_code": response.status_code,
                    "error": f"Code HTTP: {response.status_code}"
                })
                
        except Exception as e:
            results.append({
                "url": url,
                "accessible": False,
                "error": str(e)
            })
    
    return results