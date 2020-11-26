locals {
  prefix = "cloud-game"
  policy = templatefile("${path.module}/files/lifecycle_policy.json", {})
}

module "strapi_fe" {
  source = "../../modules/ecr"

  name             = "${local.prefix}/strapi/frontend"
  lifecycle_policy = local.policy
  tag_mutability   = "MUTABLE"

  tags = var.tags
}

module "strapi_be" {
  source = "../../modules/ecr"

  name             = "${local.prefix}/strapi/backend"
  lifecycle_policy = local.policy
  tag_mutability   = "MUTABLE"

  tags = var.tags
}

module "cloud_game" {
  source = "../../modules/ecr"

  name             = "${local.prefix}/react/frontend"
  lifecycle_policy = local.policy
  tag_mutability   = "MUTABLE"

  tags = var.tags
}

module "proxy" {
  source = "../../modules/ecr"

  name             = "${local.prefix}/proxy"
  lifecycle_policy = local.policy
  tag_mutability   = "MUTABLE"

  tags = var.tags
}

module "consumer" {
  source = "../../modules/ecr"

  name             = "${local.prefix}/consumer"
  lifecycle_policy = local.policy
  tag_mutability   = "MUTABLE"

  tags = var.tags
}
