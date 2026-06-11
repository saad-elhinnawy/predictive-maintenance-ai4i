FROM node:20
WORKDIR /app
COPY s.js .
CMD ["node", "s.js"]
