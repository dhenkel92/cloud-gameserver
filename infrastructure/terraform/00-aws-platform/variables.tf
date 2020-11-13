variable "bucket_name" {
  type = string
}

variable "pgp_key" {
  type = string
}

variable "tags" {
  type    = map(string)
  default = {}
}

variable "main_hosted_zone" {
  type = string
}
