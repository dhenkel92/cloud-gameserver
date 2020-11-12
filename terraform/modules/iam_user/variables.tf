variable "name" {
  type = string
}

variable "policy" {
  type = string
}

variable "create_key" {
  type    = bool
  default = false
}

variable "pgp_key" {
  type    = string
  default = null
}

variable "tags" {
  type = map(string)
}
