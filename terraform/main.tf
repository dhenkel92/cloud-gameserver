provider "hcloud" {}

terraform {
  backend "s3" {
    bucket = "minecraft-cloud"
    key    = "terraform/state"
    region = "eu-central-1"
  }
}

module "network" {
  source = "./modules/networking"
  name   = "network"
  cidr   = "${var.general_setup.net_base_range}.0/24"
}

module "common" {
  source   = "./modules/common"
  ssh_keys = var.ssh_keys
}

module "server" {
  source = "./modules/server"
  name = "minecraft"
  image = var.general_setup.image
  server_type = var.general_setup.server_type
  ssh_keys = module.common.ssh_keys
  network_id = module.network.network_id
  ip = "${var.general_setup.net_base_range}.10"

  aws_access_key = var.aws_access_key
  aws_secret_access_key_id = var.aws_secret_access_key_id
  pack_name = var.pack_name
}


