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

variable "backups" {
  type = list(object({
    name = string
    path = string
  }))
}

variable "s3_base_path" {
  type = string
}

variable "game_config" {
  type = map(any)
}

variable "tags" {
  type    = map(string)
  default = {}
}
