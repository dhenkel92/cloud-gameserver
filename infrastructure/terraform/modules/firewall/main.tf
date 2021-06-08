resource "hcloud_firewall" "firewall" {
  name = var.name
  dynamic "rule" {
    for_each = toset(var.rules)
    content {
      direction  = "in"
      protocol   = rule.value.proto
      port       = rule.value.port
      source_ips = rule.value.source_ips
    }
  }
}
