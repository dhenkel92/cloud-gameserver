#! /bin/bash

cat <<EOF > /root/ansible/vars/game-server.yaml
aws:
  aws_access_key_id: ${AWS_ACCESS_KEY_ID}
  aws_secret_access_key: ${AWS_SECRET_ACCESS_KEY}
  aws_default_region: eu-central-1
EOF

ansible-playbook /root/ansible/minecraft.yml --extra-vars "@/root/ansible/vars/game-server.yaml"
