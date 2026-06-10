# ── Build stage ───────────────────────────────────────────────────────────────
FROM node:20 AS builder

WORKDIR /app

COPY backend/package*.json backend/
RUN npm --prefix backend install

COPY frontend/package*.json frontend/
RUN npm --prefix frontend install

COPY . .

# Build frontend
WORKDIR /app/frontend
RUN npm run build

# Generate Prisma client + compile TypeScript
WORKDIR /app/backend
RUN npx prisma generate
RUN npx tsc

# Prune devDeps so we only copy production node_modules
RUN npm prune --omit=dev

# ── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-slim AS runtime

WORKDIR /app

# Copy backend: production node_modules + compiled dist + prisma artifacts
COPY --from=builder /app/backend/node_modules  backend/node_modules
COPY --from=builder /app/backend/dist          backend/dist
COPY --from=builder /app/backend/prisma        backend/prisma
COPY --from=builder /app/backend/package.json  backend/package.json

# Copy built frontend static files
COPY --from=builder /app/frontend/dist         frontend/dist

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "start"]
