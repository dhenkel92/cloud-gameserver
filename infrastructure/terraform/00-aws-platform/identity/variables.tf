variable "tags" {
  type = map(string)
}

variable "pgp_key" {
  type = string
}

variable "game_state_bucket_arn" {
  type = string
}

variable "main_hz_id" {
  type = string
}
