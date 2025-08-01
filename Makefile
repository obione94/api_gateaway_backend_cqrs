# Variables
COMPOSE_FILE=docker-compose.yml

.PHONY: start start-prod stop restart logs clean

# Démarrer les services via docker-compose
start:
	docker-compose -f $(COMPOSE_FILE) up -d --build


# Démarrer les services via docker-compose pour la production
start-prod:
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Arrêter les services
stop:
	docker-compose -f $(COMPOSE_FILE) down

# Redémarrer les services (stop + start)
restart: stop start

# Afficher les logs des deux services
logs:
	docker-compose -f $(COMPOSE_FILE) logs -f

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
