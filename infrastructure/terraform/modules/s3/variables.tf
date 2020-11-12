variable "name" {
  type = string
}

variable "tags" {
  type = map(string)
}

variable "block_public_access" {
  type    = bool
  default = true
}