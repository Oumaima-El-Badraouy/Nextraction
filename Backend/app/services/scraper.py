import requests
from bs4 import BeautifulSoup
import logging
from urllib.parse import urlparse
import time

logger = logging.getLogger(__name__)

def fetch_text(url: str) -> str:
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7',
            'Accept-Encoding': 'gzip, deflate, br',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        }
        
        # Délai pour éviter de surcharger les serveurs
        time.sleep(1)
        
        # Gérer les redirections
        session = requests.Session()
        session.max_redirects = 5
        
        # Pour Wikipedia, utiliser l'API est plus fiable
        if 'wikipedia.org' in url:
            return fetch_wikipedia_content(url, session, headers)
        
        response = session.get(url, headers=headers, timeout=15)
        response.raise_for_status()
        
        # Vérifier l'encodage
        response.encoding = response.apparent_encoding or 'utf-8'
        
        return extract_content(response.text, url)
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Erreur de requête pour {url}: {e}")
        return ""
    except Exception as e:
        logger.error(f"Erreur inattendue pour {url}: {e}")
        return ""

def fetch_wikipedia_content(url: str, session: requests.Session, headers: dict) -> str:
    """Récupérer le contenu de Wikipedia via l'API"""
    try:
        # Extraire le titre de la page Wikipedia
        parsed = urlparse(url)
        path_parts = parsed.path.split('/')
        if len(path_parts) >= 3 and path_parts[1] == 'wiki':
            page_title = path_parts[2]
            
            # Utiliser l'API REST de Wikipedia
            api_url = f"https://fr.wikipedia.org/api/rest_v1/page/summary/{page_title}"
            
            response = session.get(api_url, headers=headers, timeout=10)
            response.raise_for_status()
            
            data = response.json()
            
            # Combiner titre et contenu
            content = f"{data.get('title', '')}\n\n{data.get('extract', '')}"
            
            # Si on veut le contenu complet, utiliser cette API :
            # api_url = f"https://fr.wikipedia.org/api/rest_v1/page/html/{page_title}"
            
            return content if content.strip() else ""
            
    except Exception as e:
        logger.error(f"Erreur API Wikipedia pour {url}: {e}")
    
    # Fallback: scraping normal
    try:
        response = session.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        return extract_content(response.text, url)
    except:
        return ""

def extract_content(html: str, url: str) -> str:
    """Extraire le texte utile du HTML"""
    soup = BeautifulSoup(html, 'html.parser')
    
    # Supprimer les éléments inutiles
    for element in soup(['script', 'style', 'nav', 'footer', 'header', 
                         'iframe', 'noscript', 'svg', 'img', 'form']):
        element.decompose()
    
    # Stratégie d'extraction selon le site
    if 'wikipedia.org' in url:
        # Pour Wikipedia, prendre le contenu principal
        content_div = soup.find('div', {'id': 'mw-content-text'})
        if content_div:
            # Enlever les références
            for ref in content_div.find_all(class_='reference'):
                ref.decompose()
            text = content_div.get_text(separator='\n', strip=True)
        else:
            text = soup.get_text(separator='\n', strip=True)
    
    elif 'docs.python.org' in url:
        # Pour la doc Python
        main_content = soup.find('div', {'role': 'main'}) or soup.find('main')
        text = main_content.get_text(separator='\n', strip=True) if main_content else ""
    
    else:
        # Stratégie générique
        main_content = soup.find('main') or soup.find('article') or soup.find('div', class_='content')
        if main_content:
            text = main_content.get_text(separator='\n', strip=True)
        else:
            text = soup.get_text(separator='\n', strip=True)
    
    # Nettoyer le texte
    lines = [line.strip() for line in text.split('\n') if line.strip()]
    lines = [line for line in lines if len(line) > 20]  # Enlever les lignes trop courtes
    
    return '\n'.join(lines)