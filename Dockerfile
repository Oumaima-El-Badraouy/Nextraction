# Dockerfile
FROM python:3.9-slim

# Variables d'environnement
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=1

# Dossier de travail
WORKDIR /app

# Installation des dépendances système
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    curl \
    wget \
    && rm -rf /var/lib/apt/lists/*

# Copier les requirements d'abord (pour meilleur cache)
COPY Backend/requirements.txt /app/requirements.txt

# Installer les dépendances Python
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r /app/requirements.txt

# Copier tout le projet
COPY . /app/

# Créer les dossiers nécessaires
RUN mkdir -p /app/data /app/logs

# Exposer le port
EXPOSE 8000

# Commande de démarrage
CMD ["python", "Backend/run.py"]