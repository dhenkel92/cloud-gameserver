variable "name" {
  type = string
}

variable "lifecycle_policy" {
  type    = string
  default = ""
}

variable "tag_mutability" {
  type    = string
  default = "IMMUTABLE"
}

variable "scan_on_push" {
  type    = bool
  default = true
}

variable "tags" {
  type    = map(string)
  default = {}
}
