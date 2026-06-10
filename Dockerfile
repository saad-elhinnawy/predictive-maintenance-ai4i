FROM node:20-slim

WORKDIR /app

# ── Install deps ──────────────────────────────────────────────────────────────
COPY backend/package*.json backend/
RUN npm --prefix backend install

COPY frontend/package*.json frontend/
RUN npm --prefix frontend install

# ── Copy source ───────────────────────────────────────────────────────────────
COPY . .

# ── Build frontend ────────────────────────────────────────────────────────────
WORKDIR /app/frontend
RUN npm run build

# ── Generate Prisma client ────────────────────────────────────────────────────
WORKDIR /app/backend
RUN npx prisma generate

# ── Compile TypeScript ────────────────────────────────────────────────────────
RUN npx tsc

# ── Prune backend devDeps ─────────────────────────────────────────────────────
RUN npm prune --production

WORKDIR /app

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "start"]
