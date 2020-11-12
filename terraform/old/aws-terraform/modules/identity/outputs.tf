output "access_keys" {
  value = {
      "strapi_s3" = module.strapi_s3.key_pair
  }
}
