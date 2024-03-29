locals {
  subnets = cidrsubnets(var.ip_range, 2, 2)
}

resource "hcloud_network" "net" {
  name     = var.name
  ip_range = var.ip_range
}

resource "hcloud_network_subnet" "subnet" {
  count = length(local.subnets)

  network_id   = hcloud_network.net.id
  type         = "cloud"
  network_zone = var.network_zone
  ip_range     = local.subnets[count.index]
}
