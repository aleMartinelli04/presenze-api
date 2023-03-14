FROM node:19.4-bullseye

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY . /usr/src/app

RUN apt-get update && apt-get install -y python3 make g++

RUN npm install

CMD [ "npm", "start" ]