FROM node:22-alpine

WORKDIR /src

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8585

CMD [ "node", "./dist/src/index.js" ]