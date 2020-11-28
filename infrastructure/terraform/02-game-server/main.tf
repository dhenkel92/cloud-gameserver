locals {
  tags = merge(var.tags, {})
}

data "terraform_remote_state" "aws_platform" {
  backend = "s3"
  config = {
    bucket = "cloud-game.tf-states"
    key    = "terraform/00-aws-platform"
    region = "eu-central-1"
  }
}

data "terraform_remote_state" "game_cloud" {
  backend = "s3"
  config = {
    bucket = "cloud-game.tf-states"
    key    = "terraform/01-game-cloud-platform"
    region = "eu-central-1"
  }
}

module "game_server" {
  source = "../modules/server"

  name     = var.name
  location = var.location

  server_type = var.server.type
  image       = var.server.image

  ssh_keys = data.terraform_remote_state.game_cloud.outputs.ssh_key_ids
  tags = local.tags

  network = {
    attach = true
    subnet_id = data.terraform_remote_state.game_cloud.outputs.network.subnet_ids.game_server
  }

  user_data = {
    path = "${path.module}/files/startup.sh"
    vars = {
      s3_base_path = var.s3_base_path
      AWS_ACCESS_KEY_ID=data.terraform_remote_state.aws_platform.outputs.access_keys["game_user.cloud-game"].access_key_id
      AWS_SECRET_ACCESS_KEY=data.terraform_remote_state.aws_platform.outputs.access_keys["game_user.cloud-game"].secret_access_key
    }
  }
}
