FROM node:24.21.0-bookworm-slim AS build

ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY async-server-provisioner/package.json .
COPY async-server-provisioner/package-lock.json .

RUN npm ci

COPY async-server-provisioner/ .
RUN npm run build && npm prune --omit=dev

FROM node:24.21.0-bookworm-slim

ARG TARGETARCH
ARG OPENTOFU_VERSION=1.13.1
ARG TERRAGRUNT_VERSION=1.1.6

ARG DD_GIT_REPOSITORY_URL
ARG DD_GIT_COMMIT_SHA
ENV DD_GIT_REPOSITORY_URL=${DD_GIT_REPOSITORY_URL}
ENV DD_GIT_COMMIT_SHA=${DD_GIT_COMMIT_SHA}
ENV DD_VERSION=${DD_GIT_COMMIT_SHA}

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN set -eux; \
    case "${TARGETARCH}" in amd64|arm64) ;; *) echo "Unsupported architecture: ${TARGETARCH}" >&2; exit 1 ;; esac; \
    apt-get update; \
    apt-get install -y --no-install-recommends ca-certificates curl tar gzip; \
    mkdir /tmp/provisioner-tools; \
    cd /tmp/provisioner-tools; \
    curl --proto '=https' --tlsv1.2 -fsSL \
        "https://github.com/opentofu/opentofu/releases/download/v${OPENTOFU_VERSION}/tofu_${OPENTOFU_VERSION}_linux_${TARGETARCH}.tar.gz" \
        -o "tofu_${OPENTOFU_VERSION}_linux_${TARGETARCH}.tar.gz"; \
    curl --proto '=https' --tlsv1.2 -fsSL \
        "https://github.com/opentofu/opentofu/releases/download/v${OPENTOFU_VERSION}/tofu_${OPENTOFU_VERSION}_SHA256SUMS" \
        -o tofu_SHA256SUMS; \
    sha256sum --check --ignore-missing tofu_SHA256SUMS; \
    tar -xzf "tofu_${OPENTOFU_VERSION}_linux_${TARGETARCH}.tar.gz" -C /usr/local/bin tofu; \
    curl --proto '=https' --tlsv1.2 -fsSL \
        "https://github.com/gruntwork-io/terragrunt/releases/download/v${TERRAGRUNT_VERSION}/terragrunt_linux_${TARGETARCH}" \
        -o "terragrunt_linux_${TARGETARCH}"; \
    curl --proto '=https' --tlsv1.2 -fsSL \
        "https://github.com/gruntwork-io/terragrunt/releases/download/v${TERRAGRUNT_VERSION}/SHA256SUMS" \
        -o terragrunt_SHA256SUMS; \
    sha256sum --check --ignore-missing terragrunt_SHA256SUMS; \
    install -m 0755 "terragrunt_linux_${TARGETARCH}" /usr/local/bin/terragrunt; \
    rm -rf /tmp/provisioner-tools /var/lib/apt/lists/*

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/dist ./dist

COPY infrastructure/terraform ./terraform

CMD ["npm", "start"]
