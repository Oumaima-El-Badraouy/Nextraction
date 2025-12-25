# Dockerfile - Version ultra simple
FROM python:3.9-slim

# Dossier de travail
WORKDIR /app

# Copier seulement le backend d'abord
COPY Backend/requirements.txt .

# Installer les dépendances
RUN pip install --no-cache-dir -r requirements.txt

# Copier TOUT le projet
COPY . .

# Créer un dossier pour les données
RUN mkdir -p /app/data

# Port
EXPOSE 8000

# Commande simple
CMD ["python", "Backend/run.py"]