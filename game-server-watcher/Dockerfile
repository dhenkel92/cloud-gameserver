ARG BUILD_BASE=1.56.1-alpine3.14
ARG BASE=3.14

FROM rust:${BUILD_BASE} as build

WORKDIR /root

RUN apk add --no-cache musl-dev

COPY . .

ENV CARGO_HTTP_MULTIPLEXING=false
RUN cargo build --release --features "strict"

FROM alpine:${BASE}

COPY --from=build /root/target/release/game-server-watcher /usr/bin/game-server-watcher

ENTRYPOINT ["/usr/bin/game-server-watcher"]
