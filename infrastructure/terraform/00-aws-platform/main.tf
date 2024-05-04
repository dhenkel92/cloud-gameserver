locals {
  tags = merge(var.tags, {})
}

data "aws_route53_zone" "main" {
  name         = "${var.main_hosted_zone}."
  private_zone = false
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

  pgp_key               = var.pgp_key
  game_state_bucket_arn = module.game_state_bucket.bucket_arn
  main_hz_id            = data.aws_route53_zone.main.zone_id

  tags = var.tags
}

# module "ecr" {
# source = "./container-registry"
# tags   = local.tags
# }
