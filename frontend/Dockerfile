# Étape 1 : build React
FROM node:18-alpine AS builder

WORKDIR /app

# Copie les fichiers de dépendances
COPY package*.json ./

ENV NODE_ENV=production

# Installation clean
RUN npm ci

# Copie du code source
COPY . .

# Injection des variables d'environnement à la compilation (build)
ARG REACT_APP_SERVER_URL
ARG REACT_APP_BLOG_API_URL

ENV REACT_APP_SERVER_URL=${REACT_APP_SERVER_URL}
ENV REACT_APP_BLOG_API_URL=${REACT_APP_BLOG_API_URL}

# Build React app
RUN npm run build

# Étape 2 : image finale pour servir
FROM node:18-alpine

WORKDIR /app

# Serveur statique pour React
RUN npm install -g serve

# Copie du build généré dans le conteneur final
COPY --from=builder /app/build ./build

# Non-root user
USER node

EXPOSE 3000

CMD ["serve", "-s", "build", "-l", "3000"]
