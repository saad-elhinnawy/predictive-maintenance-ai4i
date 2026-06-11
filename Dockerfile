FROM node:20

WORKDIR /app

# node:20 is Debian Bookworm which already has OpenSSL 3.0, but make it explicit
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY . .

RUN cd /app/backend && NODE_ENV=development npm install
RUN cd /app/frontend && NODE_ENV=development npm install
RUN cd /app/frontend && npm run build
RUN cd /app/backend && npx prisma generate
RUN cd /app/backend && npx tsc

# Sanity-check the build produced the entry point
RUN test -f /app/backend/dist/server.js && echo "✓ dist/server.js exists"

CMD ["node", "backend/dist/server.js"]
