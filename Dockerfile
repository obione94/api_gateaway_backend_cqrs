FROM node:24-alpine

# Installer bash (optionnel) et outils utiles
RUN apk add --no-cache bash

WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package.json package-lock.json ./

# Installer toutes les dépendances (dev + prod)
RUN npm install
RUN npm run build

# Copier le code source TS
COPY ./src ./src

# Copier tsconfig.json pour la compilation TS
COPY tsconfig.json ./

EXPOSE 3000

# CMD par défaut : mode production (après build TS)
CMD ["node", "dist/index.js"]