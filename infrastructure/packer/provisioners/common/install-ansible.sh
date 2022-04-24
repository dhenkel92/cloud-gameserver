#! /bin/bash

set -ex

# Install ansible
apt-get update
apt-get install -y python3 python3-pip
pip3 install -I ansible==5.6.0

# Move ansible files from temp to proper folder
mv /tmp/ansible /root
mkdir -p /root/ansible/vars

cat <<EOF > /root/ansible/vars/base-server.yaml
aws:
  aws_access_key_id: placeholder
  aws_secret_access_key: placeholder
  aws_default_region: eu-central-1
EOF

ansible-playbook /root/ansible/base-server.yml --extra-vars "@/root/ansible/vars/base-server.yaml"
