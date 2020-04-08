data "aws_route53_zone" "zone" {
  name = var.zone_name
}

module "strapi_backend" {
  source  = "./route53"
  zone_id = data.aws_route53_zone.zone.id
  record  = "api.cloud-game.${var.zone_name}"
  ip      = var.ips.strapi_backend
}

module "strapi_frontend" {
  source  = "./route53"
  zone_id = data.aws_route53_zone.zone.id
  record  = "admin.cloud-game.${var.zone_name}"
  ip      = var.ips.strapi_frontend
}

module "react_frontend" {
  source  = "./route53"
  zone_id = data.aws_route53_zone.zone.id
  record  = "cloud-game.${var.zone_name}"
  ip      = var.ips.react_frontend
}
