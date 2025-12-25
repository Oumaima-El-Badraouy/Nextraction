import faiss
import numpy as np
import pickle
import os
from typing import List, Dict, Optional

class VectorStore:
    def __init__(self, dimension: int = 384):
        self.dimension = dimension
        self.index = faiss.IndexFlatL2(dimension)
        self.chunks: List[str] = []
        self.metadata: List[Dict] = []
    
    def add_vector(self, vector: List[float], text: str, metadata: Optional[Dict] = None):
        """Ajouter un seul vecteur"""
        if len(vector) != self.dimension:
            raise ValueError(f"Dimension attendue: {self.dimension}, reçue: {len(vector)}")
        
        # Convertir en numpy
        vector_np = np.array([vector]).astype("float32")
        
        # Ajouter à FAISS
        self.index.add(vector_np)
        
        # Stocker le texte et métadonnées
        self.chunks.append(text)
        self.metadata.append(metadata or {})
    
    def add_documents(self, vectors: List[List[float]], texts: List[str], metadatas: Optional[List[Dict]] = None):
        """Ajouter plusieurs documents"""
        if len(vectors) != len(texts):
            raise ValueError("Nombre de vecteurs et textes doit être égal")
        
        for vector in vectors:
            if len(vector) != self.dimension:
                raise ValueError(f"Dimension attendue: {self.dimension}, reçue: {len(vector)}")
        
        # Convertir en numpy
        vectors_np = np.array(vectors).astype("float32")
        
        # Ajouter à FAISS
        self.index.add(vectors_np)
        
        # Stocker textes
        self.chunks.extend(texts)
        
        # Stocker métadonnées
        if metadatas:
            self.metadata.extend(metadatas)
        else:
            self.metadata.extend([{} for _ in range(len(texts))])
    
    def search_vector(self, query_vector: List[float], k: int = 5) -> List[str]:
        """Rechercher les textes similaires"""
        if self.index.ntotal == 0:
            return []
        
        if len(query_vector) != self.dimension:
            raise ValueError(f"Dimension attendue: {self.dimension}, reçue: {len(query_vector)}")
        
        # Convertir query
        query_np = np.array([query_vector]).astype("float32")
        
        # Rechercher
        k = min(k, self.index.ntotal)
        distances, indices = self.index.search(query_np, k)
        
        # Récupérer les textes
        results = []
        for idx in indices[0]:
            if 0 <= idx < len(self.chunks):
                results.append(self.chunks[idx])
        
        return results
    
    def search(self, query_vector: List[float], k: int = 5) -> List[Dict]:
        """Recherche avec métadonnées"""
        if self.index.ntotal == 0:
            return []
        
        query_np = np.array([query_vector]).astype("float32")
        k = min(k, self.index.ntotal)
        distances, indices = self.index.search(query_np, k)
        
        results = []
        for i, (distance, idx) in enumerate(zip(distances[0], indices[0])):
            if 0 <= idx < len(self.chunks):
                results.append({
                    "text": self.chunks[idx],
                    "metadata": self.metadata[idx],
                    "distance": float(distance),
                    "score": 1.0 / (1.0 + distance)
                })
        
        return results
    
    def save(self, path: str = "data/vector_store"):
        """Sauvegarder"""
        os.makedirs(os.path.dirname(path), exist_ok=True)
        
        # Sauvegarder index FAISS
        faiss.write_index(self.index, f"{path}.index")
        
        # Sauvegarder données
        data = {
            "chunks": self.chunks,
            "metadata": self.metadata,
            "dimension": self.dimension
        }
        
        with open(f"{path}.data", "wb") as f:
            pickle.dump(data, f)
    
    def load(self, path: str = "data/vector_store") -> bool:
        """Charger"""
        if os.path.exists(f"{path}.index"):
            try:
                self.index = faiss.read_index(f"{path}.index")
                
                with open(f"{path}.data", "rb") as f:
                    data = pickle.load(f)
                
                self.chunks = data["chunks"]
                self.metadata = data.get("metadata", [{}] * len(self.chunks))
                self.dimension = data.get("dimension", 384)
                return True
            except Exception as e:
                print(f"Erreur de chargement: {e}")
        
        return False

# Instance globale
vector_store = VectorStore()

# Charger au démarrage si existant
vector_store.load()