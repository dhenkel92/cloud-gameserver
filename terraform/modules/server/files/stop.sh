#! /bin/bash

set -ex

timestamp=\$(date +%F_%T)

# stop session 
screen_name=\$(screen -ls | head -2 | tail -1 | awk '{print \$1}')
echo "Send ^C to screen \$${screen_name}"
screen -S \$${screen_name} -X stuff ^C

# wait until server shutdown
# todo: replace with until
sleep 20

# Create tar.gz backup
cd /root/server
tar -czf /root/backup-\$timestamp.tar.gz .
/usr/local/bin/aws s3 cp /root/backup-\$timestamp.tar.gz s3://minecraft-cloud/minecraft/backups/${pack_name}/backup-\$timestamp.tar.gz

echo "Backup done"