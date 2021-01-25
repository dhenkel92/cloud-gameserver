resource "hcloud_ssh_key" "key" {
  for_each = var.ssh_keys

  name       = each.key
  public_key = each.value
}
