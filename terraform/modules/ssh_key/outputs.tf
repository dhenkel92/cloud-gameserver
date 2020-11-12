locals {
  key_values = values(hcloud_ssh_key.key)
}
output "ids" {
  value = local.key_values.*.id
}