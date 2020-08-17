FROM node:12
WORKDIR /app

COPY ./package.json ./
COPY ./src ./
COPY ./static ./
COPY ./rollup.config.js ./

RUN npm install

VOLUME [ "/app/plugins", "/app/config.yml" ]

CMD ["npm", "start"]
