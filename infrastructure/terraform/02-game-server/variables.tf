variable "metadata" {
  type = object({
    name     = string
    location = string
  })
}

variable "server" {
  type = object({
    image        = string
    type         = string
    docker_image = string
  })
}

variable "datadog" {
  type = object({
    enabled = bool
    api_key = string
  })
}

variable "tags" {
  type    = map(string)
  default = {}
}
