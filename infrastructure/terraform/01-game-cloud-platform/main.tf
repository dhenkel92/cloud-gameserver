locals {
  tags = merge(var.tags, {})

  domains = [
    for hz, domains in var.dns : {
      (hz) = {
        for domain in domains :
        domain => {
          type    = "A"
          ttl     = "60"
          records = [module.cloud_game_server.public_ip]
        }
      }
    }
  ]
}

data "terraform_remote_state" "aws_platform" {
  backend = "s3"
  config = {
    bucket = "cloud-game.tf-states"
    key    = "terraform/00-aws-platform"
    region = "eu-central-1"
  }
}

module "ssh_keys" {
  source   = "../modules/ssh_key"
  ssh_keys = var.ssh_keys
}

module "network" {
  source = "../modules/network"

  name         = var.name
  ip_range     = var.ip_range
  network_zone = var.network_zone
}

module "cloud_game_server" {
  source = "./cloud-game-server"

  name               = var.name
  subnet_id         = module.network.subnet_ids[0]
  location           = var.location
  ssh_keys           = module.ssh_keys.ids
  cloud_game_server  = var.cloud_game_server
  container_images   = data.terraform_remote_state.aws_platform.outputs.images
  ecr_readonly_creds = data.terraform_remote_state.aws_platform.outputs.access_keys["ecr_readonly.cloud-game"]
  certbot_creds      = data.terraform_remote_state.aws_platform.outputs.access_keys["certbot.cloud-game"]

  tags = local.tags
}

module "dns" {
  source = "../modules/dns"

  dns = merge(local.domains...)
}
