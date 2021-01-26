#! /bin/bash

cat <<EOF > /root/ansible/vars/game-server.yaml
bucket_name: cloud-game
base_path: ${s3_base_path}
aws:
  aws_access_key_id: ${AWS_ACCESS_KEY_ID}
  aws_secret_access_key: ${AWS_SECRET_ACCESS_KEY}
  aws_default_region: eu-central-1
configuration: '${game_config}'
EOF

ansible-playbook /root/ansible/minecraft.yml --extra-vars "@/root/ansible/vars/game-server.yaml"
