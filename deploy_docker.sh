#!/bin/bash

# Variables
USERNAME="obione94"
PASSWORD="xxxx"  # Remplace par ton vrai mot de passe ou token
IMAGE_NAME="api_gateaway"
TAG="latest"
FULL_IMAGE="$USERNAME/$IMAGE_NAME:$TAG"

# Étape 1 : Connexion à Docker Hub
echo "🔐 Connexion à Docker Hub..."
echo "$PASSWORD" | docker login -u "$USERNAME" --password-stdin
if [ $? -ne 0 ]; then
  echo "❌ Échec de la connexion à Docker Hub"
  exit 1
fi

# Étape 2 (optionnel) : Build de l'image localement
echo "🏗️ Construction de l'image Docker..."
docker build -t "$IMAGE_NAME" .
if [ $? -ne 0 ]; then
  echo "❌ Échec du build Docker"
  exit 1
fi

# Étape 3 : Tag de l'image
echo "🏷️ Tag de l'image en $FULL_IMAGE"
docker tag "$IMAGE_NAME" "$FULL_IMAGE"

# Étape 4 : Push vers Docker Hub
echo "🚀 Push de l'image vers Docker Hub..."
docker push "$FULL_IMAGE"
if [ $? -ne 0 ]; then
  echo "❌ Échec du push"
  exit 1
fi

echo "✅ Déploiement Docker terminé avec succès : $FULL_IMAGE"
