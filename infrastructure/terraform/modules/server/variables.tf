variable "name" {
  type = string
}

variable "image" {
  type = string
}

variable "server_type" {
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

variable "volume" {
  type = object({
    create = bool
    size   = number
  })
  default = {
    create = false
    size   = 5
  }
}

variable "network" {
  type = object({
    attach     = bool
    network_id = string
  })
  default = {
    attach     = false
    network_id = ""
  }
}

variable "user_data" {
  type = object({
    path = string
    vars = any
  })
  default = {
    path = ""
    vars = {}
  }
}

variable "firewall_ids" {
  default = []
  type    = list(string)
}
