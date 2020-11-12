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
    attach = bool
    net_id = number
  })
  default = {
    attach = false
    net_id = -1
  }
}

variable "user_data" {
  type = object({
    path = string
    vars = map(string)
  })
  default = {
    path = ""
    vars = {}
  }
}
