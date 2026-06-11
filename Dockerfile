FROM node:20

WORKDIR /app

COPY . .

RUN cd /app/backend && NODE_ENV=development npm install
RUN cd /app/frontend && NODE_ENV=development npm install
RUN cd /app/frontend && npm run build
RUN cd /app/backend && npx prisma generate
RUN cd /app/backend && npx tsc

EXPOSE 4000

CMD ["node", "backend/dist/server.js"]
