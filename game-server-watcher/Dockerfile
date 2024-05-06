FROM golang:1.22-alpine3.19 as build

ENV workdir=/usr/app
WORKDIR /usr/app

COPY . .

RUN CGO_ENABLED=0 go build -o ./game-server-watcher ./cmd/game-server-watcher/*

FROM alpine:3.19

COPY --from=build /usr/app/game-server-watcher /usr/bin/game-server-watcher

ENTRYPOINT ["game-server-watcher"]
