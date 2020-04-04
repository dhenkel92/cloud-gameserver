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
}
