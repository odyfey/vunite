FROM node:9.11.1-alpine
WORKDIR /app

RUN npm install -g cross-env
RUN npm install express vue-server-renderer@2.5.16

COPY dist .
COPY server.js .
COPY package.json .

EXPOSE 8080
CMD [ "npm", "start" ]
