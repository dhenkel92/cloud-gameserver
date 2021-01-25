#############################################
# This is basically a copy of /infrasturcure/terraform/02-game-server/variables.tf
#############################################
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

variable "tags" {
  type    = map(string)
  default = {}
}
