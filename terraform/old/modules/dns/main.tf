data "aws_route53_zone" "base" {
  name         = var.dns_base
  private_zone = false
}

resource "random_pet" "prefix" {
  for_each = var.pack_ip_map

  length = 1
  keepers = {
    pack_name = each.key
  }
}

resource "aws_route53_record" "domain" {
  for_each = var.pack_ip_map

  zone_id = data.aws_route53_zone.base.zone_id
  name    = "${random_pet.prefix[each.key].id}.mc.${var.dns_base}"
  type    = "A"
  ttl     = "60"
  records = [each.value]
}
