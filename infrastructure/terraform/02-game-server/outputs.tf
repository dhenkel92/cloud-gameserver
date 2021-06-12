output "server_public_ip" {
  value = module.game_server.public_ip
}

output "server_private_ip" {
  value = module.game_server.private_ip
}
