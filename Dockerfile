FROM node:9.11.1-alpine
WORKDIR /app

COPY server.js .
COPY dist .

EXPOSE 8080
CMD [ "npm", "start" ]
