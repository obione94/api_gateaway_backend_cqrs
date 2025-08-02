#!/bin/bash

# Variables
IMAGE="obione94/api_gateaway_backend_cqrs:latest"
CONTAINER_NAME="api_gateaway"
PORT_LOCAL=3000      # port sur ton serveur
PORT_INTERNE=3000    # port exposé par ton image

# (Optionnel) Authentification si ton image est privée
# echo "xxxx" | docker login -u "obione94" --password-stdin

# Vérifie si le conteneur existe déjà
if docker ps -a --format '{{.Names}}' | grep -Eq "^${CONTAINER_NAME}\$"; then
  echo "🔁 Conteneur $CONTAINER_NAME existe déjà. Suppression..."
  docker stop "$CONTAINER_NAME"
  docker rm "$CONTAINER_NAME"
fi

# Récupération de l’image (pull)
echo "📥 Récupération de l’image $IMAGE"
docker pull "$IMAGE"

# Lancement du conteneur
echo "🚀 Lancement du conteneur $CONTAINER_NAME"
docker run -d \
  --name "$CONTAINER_NAME" \
  -p $PORT_LOCAL:$PORT_INTERNE \
  "$IMAGE"

# Affiche l'état
echo "✅ Conteneur '$CONTAINER_NAME' lancé sur http://localhost:$PORT_LOCAL"
