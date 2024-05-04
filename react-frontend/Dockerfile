FROM node:21.7-bullseye-slim as build

ARG API_URL=http://localhost:1337
ENV REACT_APP_API_URL=$API_URL

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

FROM nginx:1.17.9-alpine

RUN rm -Rf /usr/share/nginx/*

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
