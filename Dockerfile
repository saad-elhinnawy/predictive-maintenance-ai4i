FROM node:20

WORKDIR /app

COPY . .

# Install production dependencies
RUN cd /app/backend && npm install --omit=dev

# Generate Prisma client for this platform (prevents runtime auto-install of wrong version)
RUN cd /app/backend && ./node_modules/.bin/prisma generate

EXPOSE 4000

CMD ["sh", "-c", "cd /app/backend && node_modules/.bin/prisma migrate deploy && (node_modules/.bin/prisma db seed || true) && node /app/backend/dist/server.js"]
