#! /bin/bash

set -ex

echo "$DEPLOY_SSH_PRIV_KEY" > ssh_key
ssh -i ./ssh_key -p 2332 github-deploy@mc.henkel.tech bash -c 'deploy'
rm -f ssh_key
