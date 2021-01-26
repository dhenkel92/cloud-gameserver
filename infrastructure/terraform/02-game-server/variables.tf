variable "name" {
  type = string
}

variable "location" {
  type = string
}

variable "server" {
  type = object({
    image = string
    type  = string
  })
}

variable "s3_base_path" {
  type = string
}

variable "game_config" {
  type = map
}

variable "tags" {
  type    = map(string)
  default = {}
}
