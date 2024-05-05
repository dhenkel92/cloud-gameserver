locals {
  user_data_vars = merge(var.user_data.vars, {
    linux_device = join("", hcloud_volume.master.*.linux_device)
  })
}

resource "hcloud_server" "node" {
  name        = var.name
  image       = var.image
  server_type = var.server_type
  location    = var.location
  user_data   = templatefile(var.user_data.path, local.user_data_vars)

  ssh_keys     = var.ssh_keys
  firewall_ids = var.firewall_ids

  labels = var.tags

  lifecycle {
    ignore_changes = [user_data]
  }
}

resource "hcloud_volume" "master" {
  count = var.volume.create ? 1 : 0

  name     = "${var.name}-vol"
  location = var.location
  size     = var.volume.size
  format   = "ext4"
}

resource "hcloud_volume_attachment" "attach" {
  count = var.volume.create ? 1 : 0

  volume_id = hcloud_volume.master[count.index].id
  server_id = hcloud_server.node.id
  automount = false
}

resource "hcloud_server_network" "network_attach" {
  count = var.network.attach ? 1 : 0

  server_id  = hcloud_server.node.id
  network_id = var.network.network_id
}
