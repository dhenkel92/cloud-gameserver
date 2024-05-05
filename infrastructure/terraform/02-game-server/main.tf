locals {
  tags           = merge(var.tags, {})
  default_rules  = [{ proto = "tcp", port = "22", description = "ssh" }]
  firewall_rules = concat(local.default_rules, var.server.ports)
}

data "terraform_remote_state" "aws_platform" {
  backend = "s3"
  config = {
    bucket = "cloud-game-tf-states"
    key    = "terraform/00-aws-platform"
    region = "eu-central-1"
  }
}

data "hcloud_ssh_keys" "all_keys" {
}

data "hcloud_network" "cloud_game" {
  name = "cloud-game"
}

data "hcloud_image" "latest_game_server_image" {
  with_selector = "application=basic-gameserver"
  most_recent   = true
}

module "firewall" {
  source = "../modules/firewall"

  name = var.metadata.name
  rules = [for rule in local.firewall_rules : {
    proto       = rule.proto
    port        = rule.port
    description = rule.description
    source_ips  = ["0.0.0.0/0"]
  }]
}

module "game_server" {
  source = "../modules/server"

  name     = var.metadata.name
  location = var.metadata.location

  server_type  = var.server.type
  image        = data.hcloud_image.latest_game_server_image.id
  firewall_ids = [module.firewall.id]

  ssh_keys = [for key in data.hcloud_ssh_keys.all_keys.ssh_keys : key.id]
  tags     = local.tags

  network = {
    attach     = true
    network_id = data.hcloud_network.cloud_game.id
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
      game_instance_id      = var.metadata.game_instance.id

      backup_s3_bucket = var.server.backup_s3_bucket
      backup_paths     = [for path in var.server.backup_paths : { path = path.path }]
    }
  }
}
