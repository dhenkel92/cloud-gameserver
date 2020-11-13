variable "name" {
  type = string
}

variable "network_id" {
  type = string
}

variable "location" {
  type = string
}

variable "ssh_keys" {
  type = list(string)
}

variable "tags" {
  type = map(string)
}

variable "cloud_game_server" {
  type = object({
    image       = string
    server_type = string
    volume = object({
      create = bool
      size   = number
    })
  })
}

variable "container_images" {
  type = object({
    strapi_fe = string
    strapi_be = string
    react_fe  = string
  })
}

variable "ecr_readonly_creds" {
  type = object({
    access_key_id     = string
    secret_access_key = string
  })
}

variable "certbot_creds" {
  type = object({
    access_key_id     = string
    secret_access_key = string
  })
}
