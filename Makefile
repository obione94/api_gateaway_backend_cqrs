# Variables
COMPOSE_FILE=docker-compose.yml

.PHONY: build dev start stop restart logs clean test container test-coverage clean-dist docker-hub-run

# Build TypeScript en local
build:
	npm run build

# Démarrer les services via docker-compose
dev:
	docker-compose up -d --build

# Lancer le projet en production (Docker compose production)
start:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Arrêter les services
stop:
	docker-compose -f $(COMPOSE_FILE) down

# Redémarrer les services (stop + start)
restart: stop start

# Afficher les logs des deux services
logs:
	docker logs -f $$(docker-compose ps -q $(APP_NAME))

# Nettoyer les images (optionnel)
clean:
	docker-compose -f $(COMPOSE_FILE) down --rmi all --volumes --remove-orphans

# lancer les tests
test:
	 npm test

# lancer les tests
test-coverage:
	 npm run test:coverage

# sh deploye docker hub
docker-hub-deploy:
	 restart test chmod +x deploy_docker.sh && ./deploy_docker.sh

# sh run docker hub
docker-hub-run:
	 +x run_docker_image.sh && ./run_docker_image.sh

container:
	 docker exec -it api_gateaway sh

# Nettoyer les fichiers de build locaux
clean-dist:
	rm -rf dist
