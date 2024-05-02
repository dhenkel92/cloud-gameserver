#! /bin/bash

cat <<EOF > /root/ansible/vars/game-server.yaml
# base-server variables
aws:
  aws_access_key_id: ${aws_access_key_id}
  aws_secret_access_key: ${aws_secret_access_key}
  aws_default_region: eu-central-1

# game server start varibales
server:
  docker_image: ${game_server_image}
  backup_paths:
  %{ for p in backup_paths ~}
  - path: ${p.path}
  %{ endfor ~}
datadog:
  enabled: ${datadog_enabled}
  api_key: ${datadog_api_key}
  agent_image: gcr.io/datadoghq/agent:7
watcher:
  docker_image: cloudgame/game-server-watcher:latest
  port: 8080
EOF

git clone -b ${ansible_branch} https://github.com/dhenkel92/cloud-gameserver.git /tmp/cloud-gameserver
ansible-playbook /tmp/cloud-gameserver/infrastructure/ansible/game-server-start.yml --extra-vars "@/root/ansible/vars/game-server.yaml"
