#! /bin/bash

set -ex

echo "$DEPLOY_SSH_PRIV_KEY" > ssh_key
chmod 400 ./ssh_key
ssh -i ./ssh_key -p 2332 -o StrictHostKeyChecking=no github-deploy@mc.henkel.tech bash -c 'deploy'
rm -f ssh_key