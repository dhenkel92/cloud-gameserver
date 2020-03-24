resource "hcloud_network" "net" {
  name     = var.name
  ip_range = var.cidr
}

resource "hcloud_network_subnet" "subnet" {
  network_id   = hcloud_network.net.id
  type         = "server"
  network_zone = "eu-central"
  ip_range     = var.cidr
}
