remote_state {
    backend = "s3"
    generate = {
        path = "backend.tf"
        if_exists = "overwrite_terragrunt"
    }
    config = {
        bucket = "cloud-game.tf-states"
        key = "terraform/${path_relative_to_include()}"
        region = "eu-central-1"
    }
}

generate "provider" {
    path = "provider.tf"
    if_exists = "overwrite_terragrunt"
    contents = <<EOF
provider "hcloud" {}
provider "aws" {
  version = "~> 2.0"
  region  = "eu-central-1"
}
EOF
}
