FROM node:20

WORKDIR /app

COPY backend/package*.json backend/
RUN npm --prefix backend install

COPY frontend/package*.json frontend/
RUN npm --prefix frontend install

COPY . .

WORKDIR /app/frontend
RUN npm run build

WORKDIR /app/backend
RUN npx prisma generate
RUN npx tsc

WORKDIR /app

EXPOSE 4000

CMD ["npm", "--prefix", "backend", "start"]
