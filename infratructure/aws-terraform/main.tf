provider "aws" {
  version = "~> 2.0"
  region  = "eu-central-1"
}

terraform {
  backend "s3" {
    bucket = "gameserver-cloud-tf"
    key    = "terraform-state/production"
    region = "eu-central-1"
  }
}

module "docker-registry" {
  source = "./modules/docker-registry"
  tags   = var.tags
}

module "storage" {
  source = "./modules/storge"
  tags   = var.tags
}

module "dns" {
  source    = "./modules/dns"
  ips       = var.ips
  zone_name = var.route53_zone_name
}
