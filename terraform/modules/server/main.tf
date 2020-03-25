data "template_file" "stop" {
  count = length(var.packs)

  template = "${file("${path.module}/files/stop.sh")}"
  vars = {
    pack_name = var.packs[count.index].pack_name
  }
}

data "template_file" "init" {
  count = length(var.packs)

  template = "${file("${path.module}/files/start.sh")}"
  vars = {
    aws_access_key = var.aws_access_key
    aws_secret_access_key_id = var.aws_secret_access_key_id
    stop_file = data.template_file.stop[count.index].rendered
    pack_name = var.packs[count.index].pack_name
  }
}

resource "hcloud_server" "server" {
  count = length(var.packs)

  name        = "${var.name}-${var.packs[count.index].pack_name}"
  image       = var.image
  server_type = var.server_type
  location    = "nbg1"
  ssh_keys    = var.ssh_keys
  user_data   = data.template_file.init[count.index].rendered

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
  count = length(var.packs)

  server_id  = hcloud_server.server[count.index].id
  network_id = var.network_id
  ip         = "${var.ip}.1${count.index}"
}
