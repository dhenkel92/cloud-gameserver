data "template_file" "stop" {
  template = "${file("${path.module}/files/stop.sh")}"
  vars = {
    pack_name = var.pack_name
  }
}

data "template_file" "init" {
  template = "${file("${path.module}/files/start.sh")}"
  vars = {
    aws_access_key = var.aws_access_key
    aws_secret_access_key_id = var.aws_secret_access_key_id
    stop_file = data.template_file.stop.rendered
    pack_name = var.pack_name
  }
}

resource "hcloud_server" "server" {
  name        = var.name
  image       = var.image
  server_type = var.server_type
  location    = "nbg1"
  ssh_keys    = var.ssh_keys
  user_data   = data.template_file.init.rendered

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
  server_id  = hcloud_server.server.id
  network_id = var.network_id
  ip         = var.ip
}
