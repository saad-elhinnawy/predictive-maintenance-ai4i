FROM node:20-alpine

WORKDIR /app

# Copy manifests first for layer caching
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/
COPY backend/prisma backend/prisma

# Install ALL deps (dev included) — needed for tsc and vite
RUN npm --prefix backend install
RUN npm --prefix frontend install

# Copy rest of source
COPY . .

# Build: frontend → prisma generate → tsc (backend)
RUN npm --prefix backend run build:frontend
RUN npm --prefix backend exec -- prisma generate
RUN npm --prefix backend exec -- tsc

# Prune devDeps from backend after compile
RUN npm --prefix backend prune --production

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "start"]
