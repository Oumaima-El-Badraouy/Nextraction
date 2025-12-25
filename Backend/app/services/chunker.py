def chunk_text(text: str, size: int = 50, overlap: int = 2) -> list:
    """Découpe le texte en chunks avec overlap"""
    words = text.split()
    chunks = []
    
    if len(words) <= size:
        return [" ".join(words)]
    
    i = 0
    while i < len(words):
        chunk = words[i:i + size]
        chunks.append(" ".join(chunk))
        i += size - overlap
    
    return chunks