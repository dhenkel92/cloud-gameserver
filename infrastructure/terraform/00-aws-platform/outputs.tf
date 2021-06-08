output "access_keys" {
  sensitive = true
  value     = module.identity.access_keys
}

output "images" {
  value = module.ecr.images
}
