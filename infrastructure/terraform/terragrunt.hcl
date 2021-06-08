locals {
    aws_region = "eu-central-1"
    tags = {}
}

remote_state {
  backend = "s3"
  config = {
    encrypt             = true
        bucket = "cloud-game-tf-states"
        key = "terraform/${path_relative_to_include()}"
    region              = local.aws_region
    dynamodb_table      = "terraform-locks"
    s3_bucket_tags      = local.tags
    dynamodb_table_tags = local.tags
  }
  generate = {
    path      = "backend.tf"
    if_exists = "overwrite_terragrunt"
  }
}

generate "provider" {
    path = "provider.tf"
    if_exists = "overwrite_terragrunt"
    contents = <<EOF
provider "hcloud" {}
provider "aws" {
  region  = "${local.aws_region}"
}
EOF
}
