locals {
  tags = merge(var.tags, {})
}

module "game_state_bucket" {
  source = "../modules/s3"

  name                = var.bucket_name
  block_public_access = true

  tags = local.tags
}

module "public_game_bucket" {
  source = "../modules/s3"

  name                = "${var.bucket_name}-public"
  block_public_access = true

  tags = local.tags
}

module "identity" {
  source = "./identity"

  pgp_key = var.pgp_key
  game_state_bucket_arn = module.game_state_bucket.bucket_arn

  tags = var.tags
}

module "ecr" {
  source = "./container-registry"
  tags   = local.tags
}
