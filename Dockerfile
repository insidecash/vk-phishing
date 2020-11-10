FROM node:12-alpine
WORKDIR /app

RUN apk add --no-cache \
  chromium \
  nss \
  freetype \
  freetype-dev \
  harfbuzz \
  ca-certificates \
  ttf-freefont 

COPY ./package.json ./
COPY ./package-lock.json ./
COPY ./config.yml ./

COPY ./__sapper__ ./__sapper__
COPY ./static ./static
COPY ./plugins ./plugins

RUN npm ci --only=prod

CMD ["npm", "start"]
