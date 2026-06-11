FROM node:20

WORKDIR /app

COPY . .

# Install only production dependencies — TypeScript and Vite outputs are pre-built in dist/
RUN cd /app/backend && npm install --omit=dev

EXPOSE 4000

CMD ["node", "backend/dist/server.js"]
