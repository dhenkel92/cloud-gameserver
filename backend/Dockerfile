FROM node:13.12-stretch

WORKDIR /usr/src/app

COPY package.json .

RUN yarn install

COPY . .

CMD ["npm", "run", "develop"]
