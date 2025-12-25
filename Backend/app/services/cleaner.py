import re

def clean_text(text: str) -> str:
    # Supprimer les espaces multiples
    text = re.sub(r'\s+', ' ', text)
    
    # Supprimer les lignes vides
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    
    # Garder seulement les lignes avec un contenu significatif
    meaningful_lines = []
    for line in lines:
        # Ignorer les lignes trop courtes ou qui ne contiennent que des caractères spéciaux
        if len(line) > 30 and any(c.isalnum() for c in line):
            meaningful_lines.append(line)
    
    return ' '.join(meaningful_lines)