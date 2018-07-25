FROM node:9.11.1-alpine
WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g cross-env

COPY . .

RUN npm run build

EXPOSE 8080
CMD [ "npm", "start" ]
