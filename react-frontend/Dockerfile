FROM node:21.7-bullseye-slim as build

ARG API_URL=http://localhost:1337
ENV REACT_APP_API_URL=$API_URL

WORKDIR /usr/src/app

COPY . .

RUN npm install && npm run build

FROM nginx:1.17.9-alpine

ARG DD_GIT_REPOSITORY_URL
ARG DD_GIT_COMMIT_SHA
ENV DD_GIT_REPOSITORY_URL=${DD_GIT_REPOSITORY_URL}
ENV DD_GIT_COMMIT_SHA=${DD_GIT_COMMIT_SHA}

RUN rm -Rf /usr/share/nginx/*

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /usr/src/app/build /usr/share/nginx/html
