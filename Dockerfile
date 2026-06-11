FROM node:20

WORKDIR /app

COPY . .

# Install backend deps (NODE_ENV=development ensures devDeps: TypeScript, etc.)
RUN cd /app/backend && NODE_ENV=development npm install

# Install frontend deps (devDeps: Vite, etc.)
RUN cd /app/frontend && NODE_ENV=development npm install

# Build frontend
RUN cd /app/frontend && npm run build

# Generate Prisma client
RUN cd /app/backend && npx prisma generate

# Compile TypeScript
RUN cd /app/backend && npx tsc

# Start: bare server — /api/health has no DB dependency
CMD ["node", "/app/backend/dist/server.js"]
