#! /bin/bash

set -ex

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
