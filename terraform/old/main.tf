provider "hcloud" {}

provider "aws" {
  version = "~> 2.0"
  region  = "eu-central-1"
}

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
  source     = "./modules/server"
  name       = "minecraft"
  image      = var.general_setup.image
  ssh_keys   = module.common.ssh_keys
  network_id = module.network.network_id
  ip         = var.general_setup.net_base_range

  aws_access_key           = var.aws_access_key
  aws_secret_access_key_id = var.aws_secret_access_key_id
  packs                    = var.packs
}

module "dns" {
  source      = "./modules/dns"
  pack_ip_map = module.server.ips
  dns_base    = var.general_setup.dns_base
}
