locals {
  tags = merge(var.tags, {})
}

data "terraform_remote_state" "aws_platform" {
  backend = "s3"
  config = {
    bucket = "cloud-game-tf-states"
    key    = "terraform/00-aws-platform"
    region = "eu-central-1"
  }
}

data "terraform_remote_state" "game_cloud" {
  backend = "s3"
  config = {
    bucket = "cloud-game-tf-states"
    key    = "terraform/01-game-cloud-platform"
    region = "eu-central-1"
  }
}

module "firewall" {
  source = "../modules/firewall"

  name = var.metadata.name
  rules = [
    {
      proto      = "tcp"
      port       = "22"
      source_ips = ["0.0.0.0/0"]
    },
    {
      proto      = "tcp"
      port       = "25565"
      source_ips = ["0.0.0.0/0"]
    },
    {
      proto      = "tcp"
      port       = "8080"
      source_ips = ["0.0.0.0/0"]
    }
  ]
}

module "game_server" {
  source = "../modules/server"

  name     = var.metadata.name
  location = var.metadata.location

  server_type  = var.server.type
  image        = var.server.image
  firewall_ids = [module.firewall.id]

  ssh_keys = data.terraform_remote_state.game_cloud.outputs.ssh_key_ids
  tags     = local.tags

  network = {
    attach    = true
    subnet_id = data.terraform_remote_state.game_cloud.outputs.network.subnet_ids.game_server
  }

  user_data = {
    path = "${path.module}/files/startup.sh"
    vars = {
      game_server_image     = var.server.docker_image
      datadog_enabled       = var.datadog.enabled
      datadog_api_key       = var.datadog.api_key
      aws_access_key_id     = data.terraform_remote_state.aws_platform.outputs.access_keys["game_user.cloud-game"].access_key_id
      aws_secret_access_key = data.terraform_remote_state.aws_platform.outputs.access_keys["game_user.cloud-game"].secret_access_key
      ansible_branch        = var.ansible_branch
    }
  }
}
