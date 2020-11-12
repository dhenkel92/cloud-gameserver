resource "hcloud_ssh_key" "default" {
  for_each   = var.ssh_keys
  name       = each.key
  public_key = each.value
}
