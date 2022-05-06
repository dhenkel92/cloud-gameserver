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
  backups:
  %{ for backup in backups ~}
  - name: ${backup.name}
    path: ${backup.path}
  %{ endfor ~}
datadog:
  enabled: ${datadog_enabled}
  api_key: ${datadog_api_key}
  agent_image: gcr.io/datadoghq/agent:7
watcher:
  docker_image: cloudgame/game-server-watcher:latest
  port: 8080
EOF

ansible-playbook /root/ansible/game-server-start.yml --extra-vars "@/root/ansible/vars/game-server.yaml"
