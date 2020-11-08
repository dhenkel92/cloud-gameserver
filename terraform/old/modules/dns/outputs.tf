output "domains" {
    value = zipmap(keys(aws_route53_record.domain), values(aws_route53_record.domain).*.name)
}