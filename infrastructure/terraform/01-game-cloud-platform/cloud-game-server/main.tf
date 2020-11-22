resource "random_string" "mysql_root_pw" {
  length  = 16
  upper   = true
  special = false
}

resource "random_string" "mysql_pw" {
  length  = 16
  upper   = true
  special = false
}

module "cloud_game_server" {
  source = "../../modules/server"

  name        = var.name
  image       = var.cloud_game_server.image
  server_type = var.cloud_game_server.server_type
  location    = var.location
  ssh_keys    = var.ssh_keys
  tags        = var.tags

  user_data = {
    path = "${path.module}/files/cloud_game_server_init.sh"
    vars = {
      mysql_root_pw = random_string.mysql_root_pw.result
      mysql_pw      = random_string.mysql_pw.result

      proxy_image     = var.container_images.proxy
      strapi_fe_image = var.container_images.strapi_fe
      strapi_be_image = var.container_images.strapi_be
      react_fe_image  = var.container_images.react_fe

      ecr_access_key_id     = var.ecr_readonly_creds.access_key_id
      ecr_secret_access_key = var.ecr_readonly_creds.secret_access_key

      certbot_access_key_id     = var.certbot_creds.access_key_id
      certbot_secret_access_key = var.certbot_creds.secret_access_key
    }
  }

  volume = var.cloud_game_server.volume
  network = {
    attach = true
    subnet_id = var.subnet_id
  }
}