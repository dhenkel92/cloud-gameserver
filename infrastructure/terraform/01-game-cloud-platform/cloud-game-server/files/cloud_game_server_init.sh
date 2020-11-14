#! /bin/bash

set -ex 

# Mount Volume
mkdir -p /var/lib/mysql
mount -o discard,defaults ${linux_device} /var/lib/mysql
chown -R 999:999 /var/lib/mysql

rm -Rf /var/lib/mysql/lost+found

# Install general things
apt-get update
apt-get install -y vim telnet unzip

# Install firewall
apt-get install -y ufw
ufw allow proto tcp from any to any port 22
ufw allow proto tcp from any to any port 443
ufw allow proto tcp from any to any port 80
yes | ufw enable

# Install AWS CLI

unzip awscliv2.zip
./aws/install
rm -Rf ./aws ./awscliv2.zip

mkdir -p /root/.aws
cat <<EOF > /root/.aws/config
[default]
region = eu-central-1
EOF

cat <<EOF > /root/.aws/credentials
[default]
aws_access_key_id = ${ecr_access_key_id}
aws_secret_access_key = ${ecr_secret_access_key}
EOF

# Install certbot
cat <<EOF > /usr/local/bin/certbot
#! /bin/bash

set -e

docker run -i --rm --name certbot \\
  -e AWS_ACCESS_KEY_ID=${certbot_access_key_id} \\
  -e AWS_SECRET_ACCESS_KEY=${certbot_secret_access_key} \\
  -v /etc/letsencrypt:/etc/letsencrypt \\
  certbot/dns-route53:latest \$@
EOF
chmod +x /usr/local/bin/certbot

# Install deploy script
cat <<EOF > /usr/local/bin/deploy
#! /bin/bash

set -ex

aws ecr get-login-password  | docker login --username AWS --password-stdin 220002198733.dkr.ecr.eu-central-1.amazonaws.com

docker-compose -f /root/docker-compose.yaml pull
docker-compose -f /root/docker-compose.yaml up -d
EOF
chmod +x /usr/local/bin/deploy

# Install MySql
cat <<EOF > /etc/systemd/system/mysql.service
[Unit]
Description=MySql
After=network.target
After=docker.target

[Service]
StartLimitInterval=5
StartLimitBurst=10
ExecStartPre=-docker rm -f mysql
ExecStart=docker run -i \\
    --net=host \\
    --name mysql \\
    -e "MYSQL_ROOT_PASSWORD=${mysql_root_pw}" \\
    -e "MYSQL_DATABASE=strapi" \\
    -e "MYSQL_USER=strapi" \\
    -e "MYSQL_PASSWORD=${mysql_pw}" \\
    -v /var/lib/mysql:/var/lib/mysql \\
    percona:5.7.31
ExecStop=docker stop mysql

Restart=always
RestartSec=120

[Install]
WantedBy=multi-user.target
EOF

systemctl daemon-reload
systemctl enable mysql
systemctl start mysql

cat <<EOF > /root/docker-compose.yaml
version: '3'

services:
  proxy:
    image: ${proxy_image}:latest
    container_name: proxy
    network_mode: host
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt

  react-fe:
    image: ${react_fe_image}:latest
    container_name: react-fe
    network_mode: host

  strapi-fe:
    image: ${strapi_fe_image}:latest
    container_name: strapi-fe
    network_mode: host

  strapi:
    image: ${strapi_be_image}:latest
    container_name: strapi-be
    environment:
      - NODE_ENV=production
      - DATABASE_CLIENT=mysql
      - DATABASE_HOST=localhost
      - DATABASE_PORT=3306
      - DATABASE_NAME=strapi
      - DATABASE_USERNAME=strapi
      - DATABASE_PASSWORD=${mysql_pw}
      - AWS_ACCESS_KEY_ID=foo
      - AWS_SECRET_ACCESS_KEY=bar
      - AWS_BUCKET_NAME=cloud-game-public
    network_mode: host
EOF

deploy
