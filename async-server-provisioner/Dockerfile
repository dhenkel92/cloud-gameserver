FROM node:14.15.1-stretch as build

ENV NODE_ENV=production
WORKDIR /usr/src/app

COPY async-server-provisioner/package.json .
COPY async-server-provisioner/package-lock.json .

RUN npm ci

COPY async-server-provisioner/. .
RUN npm run build

FROM node:14.15.1-stretch

WORKDIR /usr/src/app

RUN apt-get update \
    && apt-get install -y wget unzip \
    && wget https://releases.hashicorp.com/terraform/0.13.5/terraform_0.13.5_linux_amd64.zip -O /root/terraform.zip \
    && unzip -d /root/ /root/terraform.zip \
    && mv /root/terraform /usr/bin/terraform

COPY --from=build /usr/src/app/package.json .
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/config ./config
COPY --from=build /usr/src/app/dist ./dist

COPY infrastructure/terraform ./terraform

CMD ["npm", "start"]
