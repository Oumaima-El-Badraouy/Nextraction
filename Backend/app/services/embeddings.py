from sentence_transformers import SentenceTransformer
from typing import List

# Modèle global
_model = None

def get_model():
    """Singleton pour charger le modèle une fois"""
    global _model
    if _model is None:
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model

def embed(text: str) -> List[float]:
    """Convertir un texte en vecteur d'embedding"""
    model = get_model()
    vector = model.encode(text)
    return vector.tolist()

def embed_batch(texts: List[str]) -> List[List[float]]:
    """Convertir plusieurs textes en une fois (plus efficace)"""
    model = get_model()
    vectors = model.encode(texts)
    return vectors.tolist()