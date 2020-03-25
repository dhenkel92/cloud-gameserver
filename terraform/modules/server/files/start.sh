#! /bin/bash

set -ex

# General setup
apt-get update
apt-get install -y openjdk-8-jre-headless unzip wget

# Install AWS cli 
cd /root
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip -q awscliv2.zip
./aws/install

mkdir -p /root/.aws
cat <<EOF > /root/.aws/config
[default]
region = eu-central-1
EOF

cat <<EOF > /root/.aws/credentials
[default]
aws_access_key_id = ${aws_access_key}
aws_secret_access_key = ${aws_secret_access_key_id}
EOF

%{ if pack_name != "empty" }
# Download server files
mkdir -p /root/server
latest_version=$(/usr/local/bin/aws s3 ls s3://minecraft-cloud/minecraft/backups/${pack_name}/ | grep 'backup-' | tail -n 1 | awk '{print $4}')
/usr/local/bin/aws s3 cp s3://minecraft-cloud/minecraft/backups/${pack_name}/$latest_version /root/$latest_version
tar -C /root/server -xf /root/$latest_version

# Run server
screen -S minecraft -dm bash -c "cd /root/server && ./tf_start_server.sh"
%{ endif }

# add stop-script

%{ if pack_name != "empty" }
cat <<EOF > /usr/local/bin/stop-server
${stop_file}
EOF
%{ else }
cat <<EOF > /usr/local/bin/stop-server
#! /bin/bash
echo "Nothing to do here"
EOF
%{ endif }

chmod +x /usr/local/bin/stop-server