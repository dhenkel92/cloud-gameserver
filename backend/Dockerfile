FROM node:13.12-stretch

WORKDIR /usr/src/app
ENV TF_VERSION 0.12.24

COPY package.json .

RUN wget https://releases.hashicorp.com/terraform/${TF_VERSION}/terraform_${TF_VERSION}_linux_amd64.zip -O /root/terraform.zip \
  && unzip -d /usr/local/bin /root/terraform.zip \
  && chmod +x /usr/local/bin/terraform \
  && yarn install

COPY . .

CMD ["npm", "run", "develop"]
