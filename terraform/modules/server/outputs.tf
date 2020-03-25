output "ips" {
    value = zipmap(hcloud_server.server.*.name, hcloud_server.server.*.ipv4_address)
}