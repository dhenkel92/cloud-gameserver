output "network" {
  value = {
    id = module.network.net_id
    subnet_ids = {
      base        = module.network.subnet_ids[0]
      game_server = module.network.subnet_ids[1]
    }
  }
}

output "ips" {
  value = {
    cloud_game = {
      private = module.cloud_game_server.private_ip
      public = module.cloud_game_server.public_ip
    }
  }
}

output "ssh_key_ids" {
  value = module.ssh_keys.ids
}
