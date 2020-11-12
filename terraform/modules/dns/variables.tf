variable "dns" {
  type = map(map(object({
    type    = string
    ttl     = string
    records = list(string)
  })))
}
