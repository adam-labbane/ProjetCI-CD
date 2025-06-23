# frontend/Dockerfile
FROM node:18-alpine AS builder
WORKDIR /src
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
ARG REACT_APP_SERVER_URL
ENV REACT_APP_SERVER_URL=$REACT_APP_SERVER_URL
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN pnpm add -g serve   # ou npm install -g serve
COPY --from=builder /src/build ./build
EXPOSE 3000
CMD ["serve", "-s", "build", "-l", "3000"]
