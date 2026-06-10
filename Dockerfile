FROM node:20

WORKDIR /app

COPY . .

RUN NODE_ENV=development npm --prefix backend install
RUN NODE_ENV=development npm --prefix backend run build

CMD ["npm", "--prefix", "backend", "start"]
