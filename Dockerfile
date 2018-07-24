FROM node:9.11.1-alpine
WORKDIR /app

RUN npm install -g cross-env

COPY node_modules .
COPY dist .
COPY server.js .
COPY package.json .

EXPOSE 8080
CMD [ "npm", "start" ]
