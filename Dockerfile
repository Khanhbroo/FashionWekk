# syntax=docker/dockerfile:1

# Shared dependency layer so every target reuses the same npm install
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# Development image with hot reload for both the Vite client and the Express API
FROM deps AS dev
COPY . .
EXPOSE 5173 5000
CMD ["npx", "concurrently", "npm run dev:server", "npm run dev:client -- --host 0.0.0.0"]

# Production build of the static frontend
FROM deps AS build
COPY . .
RUN npm run build

# Production API, tsx stays available because it is a dev dependency of this project
FROM deps AS api
ENV NODE_ENV=production
COPY . .
EXPOSE 5000
CMD ["npx", "tsx", "server/index.ts"]

# Production web server, serves the SPA and forwards /api to the api service
FROM nginx:1.27-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
