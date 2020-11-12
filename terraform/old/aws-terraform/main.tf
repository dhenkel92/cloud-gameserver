provider "aws" {
  version = "~> 2.0"
  region  = "eu-central-1"
}

terraform {
  backend "s3" {
    bucket = "cloud-game-tf"
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

module "identity" {
  source            = "./modules/identity"
  public_bucket_arn = module.storage.public_bucket_arn
  tags              = var.tags
  pgp_key           = var.pgp_key
}

