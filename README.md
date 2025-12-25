# Nextraction
# ** Nexus RAG System - Documentation Complète**

## ** Vue d'Ensemble**

**Nexus RAG System** est un système complet de **Recherche Augmentée par Génération** (RAG) qui permet de créer une base de connaissances personnalisée à partir de sites web et d'y poser des questions en langage naturel.

### ** Fonctionnalités Principales**
- ✅ **Scraping web intelligent** - Extrait le contenu de n'importe quel site web
- ✅ **Indexation vectorielle** - Convertit le texte en embeddings et les stocke dans FAISS
- ✅ **Recherche sémantique** - Trouve les contenus les plus pertinents pour une question
- ✅ **Génération de réponses** - Utilise Gemini AI pour formuler des réponses précises
- ✅ **Interface admin intuitive** - Pour gérer la base de connaissances
- ✅ **Interface client moderne** - Pour poser des questions naturellement

---

## ** Architecture du Système**

```
┌─────────────────────────────────────────────────────────────┐
│                    ARCHITECTURE COMPLÈTE                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐    │
│  │ FRONTEND    │    │   BACKEND   │    │  DATABASE   │    │
│  │  Admin      │◀──▶│  FastAPI    │◀──▶│   FAISS     │    │
│  │  Client     │    │  (Python)   │    │  Vector     │    │
│  └─────────────┘    └─────────────┘    └─────────────┘    │
│         │                        │              │          │
│         │                        │              │          │
│  ┌──────▼──────┐          ┌──────▼──────┐ ┌────▼──────┐   │
│  │  HTML/CSS   │          │   Gemini    │ │Sentence   │   │
│  │ JavaScript  │          │     AI      │ │Transformers│   │
│  └─────────────┘          └─────────────┘ └───────────┘   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## **📁 Structure des Fichiers**

```
projectRag/
│
├── 📁 Backend/                          # Serveur FastAPI
│   ├── 📁 app/
│   │   ├── 📁 routers/                  # Endpoints API
│   │   │   ├── ingest.py               # Ajout d'URLs
│   │   │   ├── ask.py                  # Questions/Réponses
│   │   │   ├── health.py               # Vérification santé
│   │   │   ├── verify.py               # Vérification URLs
│   │   │   └── stats.py                # Statistiques
│   │   │
│   │   ├── 📁 services/                 # Logique métier
│   │   │   ├── scraper.py              # Scraping web
│   │   │   ├── cleaner.py              # Nettoyage texte
│   │   │   ├── chunker.py              # Découpage en morceaux
│   │   │   ├── embeddings.py           # Conversion texte→vecteurs
│   │   │   ├── vector_store.py         # Base vectorielle FAISS
│   │   │   └── qa.py                   # Système question/réponse
│   │   │
│   │   ├── main.py                     # Application FastAPI
│   │   └── config.py                   # Configuration
│   │
│   ├── requirements.txt                # Dépendances Python
│   ├── .env                           # Variables d'environnement
│   └── run.py                         # Script de démarrage
│
├── 📁 Frontend-Admin/                  # Interface administration
│   ├── index.html                     # Interface principale
│   └── admin.js                       # Logique JavaScript
│
└── 📁 Frontend-Client/                 # Interface utilisateur
    ├── index.html                     # Chat interface
    └── client.js                      # Logique JavaScript
```

---

## ** Installation et Configuration**

### **Prérequis**
- Python 3.8+
- Node.js (pour le développement frontend)
- Clé API Google Gemini

### **Étape 1 : Configuration du Backend**

```bash
# 1. Cloner/créer le projet
mkdir projectRag
cd projectRag

# 2. Créer l'environnement virtuel
python -m venv venv

# 3. Activer l'environnement
# Sur Windows:
venv\Scripts\activate
# Sur Mac/Linux:
source venv/bin/activate

# 4. Installer les dépendances
cd Backend
pip install -r requirements.txt
```

### **Étape 2 : Configurer les variables d'environnement**

**Créer le fichier `Backend/.env` :**
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

**Pour obtenir une clé API Gemini :**
1. Rendez-vous sur [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Créez un nouveau projet
3. Générez une clé API
4. Copiez-la dans le fichier `.env`

### **Étape 3 : Démarrer le serveur**

```bash
# Depuis le dossier Backend
python run.py
```

Le serveur démarrera sur : `http://localhost:8000`

### **Étape 4 : Vérifier l'installation**

Ouvrez votre navigateur et allez sur :
- `http://localhost:8000/` - Page d'accueil de l'API
- `http://localhost:8000/docs` - Documentation Swagger UI
- `http://localhost:8000/api/health` - Vérification santé

---

## ** Utilisation du Système**

### **1. Interface Administration**

**Localisation :** `Frontend-Admin/index.html`

**Fonctions disponibles :**
- **Ajouter des URLs** : Collez des URLs de sites web à indexer
- **Vérifier les URLs** : Teste l'accessibilité des sites
- **Indexer le contenu** : Scrape, nettoie et indexe le contenu
- **Voir les statistiques** : Nombre de documents indexés, vecteurs stockés
- **Journal d'activité** : Logs détaillés de toutes les opérations

**Exemples d'URLs à tester :**
```
https://example.com
https://fr.wikipedia.org/wiki/Python_(langage)
https://docs.python.org/3/tutorial/
https://fr.wikipedia.org/wiki/Intelligence_artificielle
```

### **2. Interface Client**

**Localisation :** `Frontend-Client/index.html`

**Fonctions disponibles :**
- **Chat interactif** : Posez des questions en langage naturel
- **Suggestions rapides** : Questions prédéfinies
- **Statistiques en temps réel** : Taille de la base, temps de réponse
- **Mode sombre/clair** : Interface personnalisable
- **Historique des conversations** : Sauvegarde locale

**Exemples de questions :**
- "Qu'est-ce que Python ?"
- "Explique-moi l'intelligence artificielle"
- "Quelles sont les fonctionnalités principales ?"
- "Donne-moi un résumé"

---

## ** API Endpoints**

### **Endpoints Principaux**

| Méthode | Endpoint | Description | Exemple de Requête |
|---------|----------|-------------|-------------------|
| **POST** | `/api/ingest` | Indexer des URLs | `{"urls": ["https://example.com"]}` |
| **POST** | `/api/ask` | Poser une question | `{"question": "Qu'est-ce que Python ?"}` |
| **GET** | `/api/health` | Vérifier l'état du service | - |
| **POST** | `/api/verify-urls` | Vérifier l'accessibilité | `{"urls": ["https://example.com"]}` |
| **GET** | `/api/stats` | Obtenir des statistiques | - |

### **Exemples d'utilisation avec curl**

```bash
# Indexer une URL
curl -X POST "http://localhost:8000/api/ingest" \
  -H "Content-Type: application/json" \
  -d '{"urls": ["https://example.com"]}'

# Poser une question
curl -X POST "http://localhost:8000/api/ask" \
  -H "Content-Type: application/json" \
  -d '{"question": "À quoi sert example.com ?"}'

# Vérifier la santé
curl -X GET "http://localhost:8000/api/health"
```

---

## ** Comment Fonctionne le Système RAG**

### **Processus d'Indexation (Pipeline ETL)**

```
ÉTAPE 1: SCRAPING
   ↓
URL → Requests → HTML → BeautifulSoup → Texte Brut
   ↓
ÉTAPE 2: PRÉPROCESSING
   ↓
Texte Brut → Nettoyage → Découpage → Chunks (300 mots)
   ↓
ÉTAPE 3: EMBEDDING
   ↓
Chunks → Sentence Transformers → Vecteurs (384 dimensions)
   ↓
ÉTAPE 4: STOCKAGE
   ↓
Vecteurs → FAISS Index + Texte → Base Vectorielle
```

### **Processus de Question/Réponse**

```
ÉTAPE 1: QUESTION UTILISATEUR
   ↓
"Qu'est-ce que Python ?" → Embedding → Vecteur Question
   ↓
ÉTAPE 2: RECHERCHE
   ↓
Vecteur Question → FAISS → 5 Chunks Pertinents
   ↓
ÉTAPE 3: CONSTRUCTION CONTEXTE
   ↓
Chunks Pertinents → Contexte Structuré
   ↓
ÉTAPE 4: GÉNÉRATION
   ↓
Contexte + Question → Gemini AI → Réponse
   ↓
ÉTAPE 5: FORMATAGE
   ↓
Réponse → Formatage → Affichage Utilisateur
```

---

## ** Technologies Utilisées**

### **Backend**
- **FastAPI** : Framework web moderne et rapide
- **FAISS** (Facebook AI Similarity Search) : Indexation vectorielle
- **Sentence Transformers** : Modèles d'embeddings
- **BeautifulSoup4** : Parsing HTML
- **Google Generative AI** : Modèle de langage Gemini

### **Frontend**
- **Bootstrap 5** : Framework CSS responsive
- **Font Awesome** : Icônes
- **Vanilla JavaScript** : Logique client-side
- **Anime.js** : Animations

### **Modèles IA**
- **all-MiniLM-L6-v2** : Modèle d'embedding (384 dimensions)
- **Gemini 1.5 Flash/Pro** : Modèle de génération de texte

---

## ** Performances et Limitations**

### **Performances**
- **Indexation** : ~1-5 secondes par page web
- **Recherche** : < 100ms pour trouver des similarités
- **Génération** : 2-10 secondes selon la complexité

### **Limitations**
1. **Scraping** : Certains sites bloquent les robots
2. **Tokens** : Limite de contexte à ~8000 tokens
3. **Langues** : Principalement optimisé pour le français/anglais
4. **Coût** : API Gemini peut avoir un coût à l'usage

### **Capacités**
- **Taille de la base** : Jusqu'à 1M+ vecteurs avec FAISS
- **Types de contenu** : Sites web, documentation, articles
- **Langues supportées** : Multilingue (selon le modèle)

---

## **  Sécurité et Bonnes Pratiques**

### **Sécurité**
1. **Environment Variables** : Stockage sécurisé des clés API
2. **CORS Configuration** : Restriction des origines en production
3. **Rate Limiting** : À implémenter pour l'API publique
4. **Validation Input** : Validation stricte des URLs et questions

### **Bonnes Pratiques**
```python
# Exemple de validation d'URL
def validate_url(url: str) -> bool:
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False
```

---

## ** Dépannage Courant**

### **Problème 1 : Le serveur ne démarre pas**
```bash
# Vérifier les ports
netstat -ano | findstr :8000

# Vérifier les dépendances
pip list | grep -E "fastapi|uvicorn|faiss"

# Vérifier Python version
python --version
```

### **Problème 2 : Erreur "Module not found"**
```bash
# Réinstaller les dépendances
pip install -r requirements.txt --force-reinstall

# Vérifier l'environnement virtuel
python -c "import sys; print(sys.executable)"
```

### **Problème 3 : Scraping ne fonctionne pas**
- Vérifier que le site n'est pas derrière Cloudflare
- Ajouter un User-Agent dans les headers
- Augmenter le timeout
- Essayer avec `https://example.com` d'abord

### **Problème 4 : Gemini ne répond pas**
- Vérifier la clé API dans `.env`
- Tester la connexion à l'API Gemini
- Vérifier les quotas d'API

### **Problème 5 : Interface ne se connecte pas**
- Vérifier CORS dans `main.py`
- Ouvrir la console du navigateur (F12)
- Vérifier les erreurs réseau

---

## ** Déploiement en Production**

### **Option 1 : Docker (Recommandé)**
**Dockerfile :**
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "run.py"]
```

**docker-compose.yml :**
```yaml
version: '3.8'

services:
  backend:
    build: ./Backend
    ports:
      - "8000:8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    volumes:
      - ./data:/app/data
```

### **Option 2 : Serveur Dédié**
```bash
# Installer Nginx
sudo apt install nginx

# Configuration Nginx
sudo nano /etc/nginx/sites-available/rag-system

# Démarrer avec Gunicorn
gunicorn app.main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000

# Service systemd
sudo nano /etc/systemd/system/rag.service
```

### **Option 3 : Plateformes Cloud**
- **Render** : Déploiement simple
- **Railway** : Intégration Git
- **AWS Elastic Beanstalk** : Scalabilité
- **Google Cloud Run** : Serverless

---

## **📈 Monitoring et Maintenance**

### **Métriques à Surveiller**
1. **Taille de la base** : Nombre de vecteurs indexés
2. **Temps de réponse** : Latence des requêtes
3. **Usage API** : Coûts Gemini
4. **Erreurs** : Taux d'échec scraping/réponses

### **Maintenance Régulière**
```bash
# Sauvegarde de la base FAISS
python -c "from app.services.vector_store import vector_store; vector_store.save()"

# Nettoyage des logs
find . -name "*.log" -type f -mtime +7 -delete

# Mise à jour des dépendances
pip list --outdated
pip install --upgrade -r requirements.txt
```

---

## **🔮 Extensions et Améliorations Futures**

### **Améliorations Immediates**
1. **Support PDF** : Ajouter PyPDF2 pour les documents
2. **Authentification** : Système de login pour l'admin
3. **Cache** : Redis pour mettre en cache les réponses fréquentes
4. **Batch Processing** : Indexation par lots pour gros volumes

### **Fonctionnalités Avancées**
1. **Multimodal** : Support images + texte avec Gemini
2. **Fine-tuning** : Adapter les embeddings à ton domaine
3. **Webhooks** : Notifications pour nouveaux contenus
4. **API Publique** : Documentation OpenAPI complète

### **Intégrations**
- **Slack** : Bot pour poser des questions
- **Chrome Extension** : Indexation depuis le navigateur
- **Mobile App** : Application React Native
- **Zapier/Make** : Automatisations

---

## **📚 Ressources et Références**

### **Documentation Officielle**
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FAISS GitHub](https://github.com/facebookresearch/faiss)
- [Sentence Transformers](https://www.sbert.net/)
- [Google Gemini API](https://ai.google.dev/)

### **Articles Utiles**
- [Introduction au RAG](https://arxiv.org/abs/2005.11401)
- [Best Practices RAG](https://www.pinecone.io/learn/retrieval-augmented-generation/)
- [Vector Search Explained](https://www.elastic.co/what-is/vector-search)

### **Outils de Développement**
- **Postman** : Tester les APIs
- **VS Code** : Éditeur recommandé
- **DBeaver** : Gestion de bases de données
- **Ngrok** : Tunnel pour tests webhooks

---

## **👥 Support et Contribution**

### **Signaler un Bug**
1. Vérifier si le problème existe déjà dans les issues
2. Créer une nouvelle issue avec :
   - Description détaillée
   - Étapes pour reproduire
   - Logs d'erreur
   - Configuration système

### **Proposer une Amélioration**
1. Fork le repository
2. Créer une branche pour ta feature
3. Ajouter des tests
4. Soumettre une Pull Request

### **Obtenir de l'Aide**
- **Documentation** : Lire ce README en entier
- **Issues GitHub** : Rechercher des problèmes similaires
- **Stack Overflow** : Taguer avec `rag-system`
- **Email** : support@example.com

---

## **📄 Licence**

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

```
MIT License

Copyright (c) 2024 Nexus RAG System

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## **🌟 Remerciements**

- **Google** pour l'API Gemini
- **Facebook Research** pour FAISS
- **Hugging Face** pour les modèles transformers
- **FastAPI** pour le framework backend
- **Tous les contributeurs open source**

---

** Projet maintenu avec par Oumaima el badraouy*

*Dernière mise à jour : Janvier 2024*