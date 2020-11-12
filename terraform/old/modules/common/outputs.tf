output "ssh_keys" {
  value = values(hcloud_ssh_key.default).*.id
}
