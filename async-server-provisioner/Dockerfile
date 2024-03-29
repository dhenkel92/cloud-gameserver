FROM node:14.17.0-stretch as build

ENV NODE_ENV=development
WORKDIR /usr/src/app

COPY async-server-provisioner/package.json .
COPY async-server-provisioner/package-lock.json .

RUN npm ci

COPY async-server-provisioner/ .
RUN npm run build

FROM node:14.17.0-stretch

ENV NODE_ENV=production
WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget unzip \
    && wget https://releases.hashicorp.com/terraform/1.1.9/terraform_1.1.9_linux_amd64.zip -O /root/terraform.zip \
    && unzip -d /root/ /root/terraform.zip \
    && mv /root/terraform /usr/bin/terraform \
    && wget https://github.com/gruntwork-io/terragrunt/releases/download/v0.36.7/terragrunt_linux_amd64 -O /usr/bin/terragrunt \
    && chmod +x /usr/bin/terragrunt

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/dist ./dist

COPY infrastructure/terraform ./terraform

CMD ["npm", "start"]
