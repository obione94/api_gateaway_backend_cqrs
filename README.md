# Apigateaway_backendCQRS


Comment l’utiliser ?
Pour compiler le TS localement :

bash
make build
Pour lancer en développement (avec hot reload dans Docker) :

bash
make dev
Pour lancer en production (exécute le build TS, puis démarre le conteneur Docker en mode détaché) :

bash
make build
make start
Pour arrêter tous les conteneurs :

bash
make stop
Pour afficher les logs en temps réel :

bash
make logs
Pour lancer les tests (localement) :

bash
make test
Pour nettoyer le dossier de build :

bash
make clean