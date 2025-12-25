from typing import List
from app.services.embeddings import embed
from app.services.vector_store import vector_store
from app.config import GEMINI_API_KEY

def answer_question(question: str) -> str:
    # 1. Embedding de la question
    try:
        question_vector = embed(question)
    except Exception as e:
        return f"Erreur d'embedding: {str(e)}"
    
    # 2. Recherche dans la base vectorielle
    try:
        relevant_chunks = vector_store.search_vector(question_vector, k=5)
    except Exception as e:
        return f"Erreur de recherche: {str(e)}"
    
    if not relevant_chunks:
        return "Je n'ai pas d'information sur ce sujet dans ma base de connaissances."
    
    # 3. Préparer le contexte
    context = "\n\n".join(relevant_chunks[:3])  # Limiter à 3 chunks
    
    # 4. Utiliser Gemini si disponible
    if GEMINI_API_KEY and GEMINI_API_KEY != "PUT_YOUR_KEY_HERE":
        try:
            from google import genai
            
            client = genai.Client(api_key=GEMINI_API_KEY)
            
            prompt = f"""Tu es un assistant IA qui répond aux questions en utilisant uniquement le contexte fourni.

CONTEXTE:
{context}

QUESTION: {question}

INSTRUCTIONS:
1. Utilise EXCLUSIVEMENT les informations du contexte
2. Si la réponse n'est pas dans le contexte, dis "Je n'ai pas d'information sur ce sujet dans ma base de connaissances."
3. Sois précis et concis

RÉPONSE:"""
            
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt
            )
            
            return response.text
            
        except ImportError:
            # Fallback sans Gemini
            return f"Contexte pertinent trouvé:\n\n{context[:500]}..."
        except Exception as e:
            return f"Erreur Gemini: {str(e)}\n\nContexte: {context[:500]}..."
    
    # Fallback sans Gemini
    return f"Contexte pertinent trouvé:\n\n{context[:1000]}..."