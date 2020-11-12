locals {
  entries = flatten([
    for hz, domains in var.dns : [
      for domain, attr in domains : {
        (domain) = {
          hz      = hz
          domain  = domain
          ttl     = attr["ttl"]
          type    = attr["type"]
          records = attr["records"]
        }
      }
    ]
  ])
  domains = merge(local.entries...)
}

data "aws_route53_zone" "zone" {
  for_each = local.domains

  name         = "${each.value["hz"]}."
  private_zone = false
}

resource "aws_route53_record" "record" {
  for_each = local.domains

  zone_id = data.aws_route53_zone.zone[each.key].zone_id
  name    = each.key
  type    = each.value.type
  ttl     = each.value.ttl
  records = each.value.records
}
