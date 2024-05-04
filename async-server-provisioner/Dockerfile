FROM node:21.7-bullseye-slim as build

ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY async-server-provisioner/package.json .
COPY async-server-provisioner/package-lock.json .

RUN npm ci

COPY async-server-provisioner/ .
RUN npm run build

FROM node:21.7-bullseye-slim

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget curl unzip \
    && curl --proto '=https' --tlsv1.2 -fsSL https://get.opentofu.org/install-opentofu.sh -o install-opentofu.sh \
    && chmod +x install-opentofu.sh \
    && ./install-opentofu.sh --install-method deb \
    && wget https://github.com/gruntwork-io/terragrunt/releases/download/v0.58.0/terragrunt_linux_amd64 -O /usr/bin/terragrunt \
    && chmod +x /usr/bin/terragrunt

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/dist ./dist

COPY infrastructure/terraform ./terraform

CMD ["npm", "start"]
