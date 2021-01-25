output "access_keys" {
  value = module.identity.access_keys
}

output "images" {
  value = module.ecr.images
}
