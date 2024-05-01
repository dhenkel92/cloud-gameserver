FROM node:21.7-bullseye-slim

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY . .

CMD ["npm", "run", "develop"]
