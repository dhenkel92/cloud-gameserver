variable "name" {
  type = string
}

variable "ssh_keys" {
  type = map(string)
}

variable "ip_range" {
  type = string
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

variable "location" {
  type    = string
  default = "nbg1"
}

variable "network_zone" {
  type    = string
  default = "eu-central"
}

variable "dns" {
  type    = map(list(string))
  default = {}
}

variable "tags" {
  type    = map(string)
  default = {}
}
