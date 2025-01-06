FROM node:16

WORKDIR /

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.mjs"]
