#! /bin/bash

set -ex 

cat <<EOF > /root/ansible/vars/game-server.yaml
images:
  proxy: ${proxy_image}
  consumer: ${consumer_image}
  react_fe: ${react_fe_image}
  strapi_fe: ${strapi_fe_image}
  strapi_be: ${strapi_be_image}

mysql:
  root_pw: ${mysql_root_pw}
  strapi_pw: ${mysql_pw}

domains:
  - cloud-game.app
  - api.cloud-game.app
  - admin.cloud-game.app

aws:
  aws_access_key_id: ${ecr_access_key_id}
  aws_secret_access_key: ${ecr_secret_access_key}
  aws_default_region: eu-central-1

certbot:
  access_key_id: ${certbot_access_key_id}
  secret_access_key: ${certbot_secret_access_key}
EOF

# Mount Volume
mkdir -p /var/lib/mysql
mount -o discard,defaults ${linux_device} /var/lib/mysql
chown -R 999:999 /var/lib/mysql

rm -Rf /var/lib/mysql/lost+found

# ansible-playbook /root/ansible/game-server.yml --extra-vars "@/root/ansible/vars/game-server.yaml"

# Install firewall
# apt-get install -y ufw
# ufw allow proto tcp from any to any port 22
# ufw allow proto tcp from any to any port 443
# ufw allow proto tcp from any to any port 80
# yes | ufw enable
