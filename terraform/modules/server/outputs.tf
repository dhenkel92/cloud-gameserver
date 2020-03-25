output "ips" {
    value = zipmap(var.packs.*.pack_name, hcloud_server.server.*.ipv4_address)
}