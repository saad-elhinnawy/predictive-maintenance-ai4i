FROM node:20-alpine

WORKDIR /app

# Copy package manifests first for layer caching
COPY backend/package*.json backend/
COPY frontend/package*.json frontend/

# Install ALL deps (dev included — needed for tsc and vite)
# No NODE_ENV override needed: Docker build env is separate from runtime env vars
RUN npm --prefix backend install
RUN npm --prefix frontend install

# Copy full source
COPY . .

# Build: npm run build runs build:frontend + prisma generate + tsc
# npm --prefix sets CWD to backend/, so all relative paths work correctly
RUN npm --prefix backend run build

# Remove devDeps from backend for a leaner runtime image
RUN npm --prefix backend prune --production

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "start"]
