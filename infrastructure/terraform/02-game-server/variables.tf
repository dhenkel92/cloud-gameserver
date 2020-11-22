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

variable "tags" {
  type    = map(string)
  default = {}
}
