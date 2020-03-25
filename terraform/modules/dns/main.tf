locals {
  ips   = values(var.pack_ip_map)
  packs = keys(var.pack_ip_map)
}

data "aws_route53_zone" "base" {
  name         = var.dns_base
  private_zone = false
}

resource "random_pet" "prefix" {
  count  = length(local.ips)
  length = 1
  keepers = {
    pack_name = local.packs[count.index]
  }
}

resource "aws_route53_record" "domain" {
  count = length(local.ips)

  zone_id = data.aws_route53_zone.base.zone_id
  name    = "${random_pet.prefix[count.index].id}.mc.${var.dns_base}"
  type    = "A"
  ttl     = "60"
  records = [local.ips[count.index]]
}
