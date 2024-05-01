variable "name" {
  type = string
}

variable "rules" {
  type = list(object({
    proto       = string
    port        = string
    source_ips  = list(string)
    description = string
  }))
}
