#! /bin/bash

set -ex

# Move Game Server Watcher executable
mv /tmp/game-server-watcher /usr/bin/game-server-watcher

# Install ansible
echo "deb http://ppa.launchpad.net/ansible/ansible/ubuntu trusty main" > /etc/apt/sources.list.d/ansible.list
apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 93C4A3FD7BB9C367
apt-get update
apt-get install -y ansible
ansible-galaxy collection install amazon.aws

# Move ansible files from temp to proper folder
mv /tmp/ansible /root
mkdir -p /root/ansible/vars

cp /root/ansible/host/ansible.cfg /etc/ansible/ansible.cfg

cat <<EOF > /root/ansible/vars/base-server.yaml
aws:
  aws_access_key_id: placeholder
  aws_secret_access_key: placeholder
  aws_default_region: eu-central-1
EOF

ansible-playbook /root/ansible/base-server.yml --extra-vars "@/root/ansible/vars/base-server.yaml"
