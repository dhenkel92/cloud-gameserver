packer {
  required_plugins {
    hcloud = {
      source  = "github.com/hetznercloud/hcloud"
      version = "~> 1"
    }
  }
}

variable "base_image" {
  type    = string
  default = "debian-11"
}

variable "server_type" {
  type    = string
  default = "cx11"
}

variable "location" {
  type    = string
  default = "nbg1"
}

source "hcloud" "basic_gameserver" {
  communicator = "ssh"

  image         = var.base_image
  location      = var.location
  server_type   = var.server_type
  ssh_username  = "root"
  snapshot_name = "basic-gameserver-{{timestamp}}"
  snapshot_labels = {
    "application" : "basic-gameserver"
  }
}

build {
  sources = ["hcloud.basic_gameserver"]

  provisioner "file" {
    source      = "../ansible"
    destination = "/tmp/ansible"
  }

  provisioner "shell" {
    execute_command = "echo 'root' | sudo -S env {{ .Vars }} {{ .Path }}"
    scripts = [
      "provisioners/common/install-ansible.sh"
    ]
  }
}
