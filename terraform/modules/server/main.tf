data "template_file" "init" {
  template = "${file("${path.module}/files/start.sh")}"
  vars = {
  }
}

resource "hcloud_server" "server" {
  name = var.name
  image = var.image
  server_type = var.server_type
  location = "nbg1"
  ssh_keys = var.ssh_keys
  user_data = data.template_file.init.rendered
}

resource "hcloud_server_network" "srvnetwork" {
  server_id = hcloud_server.server.id
  network_id = var.network_id
  ip = var.ip
}
