FROM node:20

WORKDIR /app

COPY . .

# Install production dependencies
RUN cd /app/backend && npm install --omit=dev

# Generate Prisma client for this platform (prevents runtime auto-install of wrong version)
RUN cd /app/backend && ./node_modules/.bin/prisma generate

EXPOSE 4000

CMD ["node", "backend/dist/server.js"]
