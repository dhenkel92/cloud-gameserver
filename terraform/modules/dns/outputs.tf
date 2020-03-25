output "domains" {
    value = zipmap(local.packs, aws_route53_record.domain.*.name)
}