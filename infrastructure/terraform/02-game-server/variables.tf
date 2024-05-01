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

    ports = list(object({
      proto       = string
      port        = string
      description = string
    }))
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

variable "ansible_branch" {
  type    = string
  default = "main"
}
