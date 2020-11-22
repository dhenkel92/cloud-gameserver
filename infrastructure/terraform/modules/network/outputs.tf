output "net_id" {
  value = hcloud_network.net.id
}

output "subnet_ids" {
  value = hcloud_network_subnet.subnet.*.id
}
