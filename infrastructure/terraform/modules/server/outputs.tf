output "public_ip" {
  value = hcloud_server.node.ipv4_address
}

output "private_ip" {
  value = join("", hcloud_server_network.network_attach.*.ip)
}
