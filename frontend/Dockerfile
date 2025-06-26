# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /src
COPY package*.json ./
ENV NODE_ENV=production
RUN npm ci
COPY . .
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=${REACT_APP_SERVER_URL}
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /src/build ./build

# Utilisateur non root
USER node
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
