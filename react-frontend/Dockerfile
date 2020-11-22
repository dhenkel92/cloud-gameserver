FROM node:14.15.1-stretch as build

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

FROM nginx:1.17.9-alpine

RUN rm -Rf /usr/share/nginx/*

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
