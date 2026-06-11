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

# Start: migrate, seed, then serve
CMD ["/bin/sh", "-c", "cd /app/backend && npx prisma migrate deploy 2>/dev/null || true && node prisma/seed.js 2>/dev/null || true && node dist/server.js"]
