output "ips" {
    value = zipmap(values(hcloud_server.server).*.name, values(hcloud_server.server).*.ipv4_address)
}