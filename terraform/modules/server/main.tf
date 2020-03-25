resource "random_integer" "ip" {
  for_each = var.packs

  min = 3
  max = 250
  keepers = {
    pack_name = each.key
  }
}

data "template_file" "stop" {
  for_each = var.packs

  template = "${file("${path.module}/files/stop.sh")}"
  vars = {
    pack_name = each.key
  }
}

data "template_file" "init" {
  for_each = var.packs

  template = "${file("${path.module}/files/start.sh")}"
  vars = {
    aws_access_key           = var.aws_access_key
    aws_secret_access_key_id = var.aws_secret_access_key_id
    stop_file                = data.template_file.stop[each.key].rendered
    pack_name                = each.key
  }
}

resource "hcloud_server" "server" {
  for_each = var.packs

  name        = "${var.name}-${each.key}"
  image       = var.image
  server_type = each.value.server_type
  location    = "nbg1"
  ssh_keys    = var.ssh_keys
  user_data   = data.template_file.init[each.key].rendered

  provisioner "remote-exec" {
    when   = destroy
    inline = ["/usr/local/bin/stop-server"]

    connection {
      type     = "ssh"
      user     = "root"
      host     = self.ipv4_address
    }
  }
}

resource "hcloud_server_network" "srvnetwork" {
  for_each = var.packs

  server_id  = hcloud_server.server[each.key].id
  network_id = var.network_id
  ip         = "${var.ip}.${random_integer.ip[each.key].result}"
}
