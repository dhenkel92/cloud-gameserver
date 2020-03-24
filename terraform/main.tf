provider "hcloud" {}

terraform {
  backend "s3" {
    bucket = "minecraft-cloud"
    key    = "terraform/state"
    region = "eu-central-1"
  }
}

module "network" {
  source = "./modules/networking"
  name   = "network"
  cidr   = "10.0.0.0/24"
}

module "common" {
  source   = "./modules/common"
  ssh_keys = { "daniel yubi" = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCpyqSshPP51uI9EQLDKv9iyMLl/EGqBdgkfed/dL0Kk+HheCWS/lMTX9ObP3nKFND3Cmwbf/dAd/81h3YrZcvU9E/F4fppdXvsh6W03CcfOijZNyymKn3MyKeXRu/zH2aqVeQNYXPOcnJDrKOXH4FxOMIbffewGZ6d2m00SJNsccWBxNSDR8yfOMEGCCyCpJkaXpRzinXOAonWh2J+7U328tvlNaf7ibPImwBLT5bwcTUeMvVYS4SlxJnEkeMZe2a8/Pm/uHERGTOFZ4zz7ymy2TovFjpwGdlW9B6sUqjxi0Zag3Jgywup7s7w/890SxFCvhd8kWvd/49naC04STHR cardno:000610347368" }
}

module "server" {
  source = "./modules/server"
  name = "minecraft"
  image = "ubuntu-16.04"
  server_type = "cx31"
  ssh_keys = module.common.ssh_keys
  network_id = module.network.network_id
  ip = "10.0.0.10"
}


