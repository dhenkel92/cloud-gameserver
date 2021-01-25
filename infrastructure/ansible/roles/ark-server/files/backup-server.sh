#! /bin/bash

backupFolder=/root/ark-backups
arkServerFolder=/home/steam/servers/ark/ShooterGame
filename=$(date +"%Y-%m-%d_%H-%M-%S").tar.gz
awsBasePath=s3://ark-server

ps aux | grep ShooterGameServer | awk '{print $2}' | head -n 1 | xargs kill

mkdir -p ${backupFolder}
cd ${arkServerFolder}
tar -czvf ${backupFolder}/${filename} ./Saved
aws s3 cp ${backupFolder}/${filename} ${awsBasePath}/${filename}

rm -Rf ${backupFolder}

sudo su steam -c 'steamcmd +login anonymous +force_install_dir /home/steam/servers/ark +app_update 376030 +quit'

screen -dmS Ark /root/start-ark-server.sh
