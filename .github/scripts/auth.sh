#! /bin/bash

set -ex

aws ecr get-login-password  | docker login --username AWS --password-stdin $ECR_ACCOUNT