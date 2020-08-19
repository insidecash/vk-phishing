FROM node:12
WORKDIR /app

COPY ./package.json ./
COPY ./config.yml ./

COPY ./__sapper__ ./__sapper__
COPY ./static ./static
COPY ./plugins ./plugins

RUN npm ci --only=prod

CMD ["npm", "start"]
