FROM node:20

WORKDIR /app

COPY . .

# Install backend deps (devDeps included for TypeScript, etc.)
RUN NODE_ENV=development npm --prefix backend install

# Install frontend deps (devDeps included for Vite)
RUN NODE_ENV=development npm --prefix frontend install

# Build frontend
RUN npm --prefix frontend run build

# Generate Prisma client
RUN cd backend && npx prisma generate

# Compile TypeScript
RUN cd backend && npx tsc

EXPOSE 4000

# Start: migrate (60s timeout), seed (30s timeout), then serve
CMD ["/bin/sh", "-c", "cd /app/backend && timeout 60 npx prisma migrate deploy 2>/dev/null || true && timeout 30 node prisma/seed.js 2>/dev/null || true && node dist/server.js"]
