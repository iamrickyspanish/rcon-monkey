FROM node:lts

COPY . /app
WORKDIR /app

VOLUME /app

RUN npm i
