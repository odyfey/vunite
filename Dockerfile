FROM node:9.11.1-alpine
WORKDIR /app

RUN mkdir src

COPY dist ./
COPY src/index.template.html src/index.template.html
COPY server.js .
COPY package*.json ./

RUN npm install -g cross-env
RUN npm install express vue-server-renderer@2.5.16

EXPOSE 8080
CMD [ "npm", "start" ]
