output "images" {
  value = {
    strapi_be = module.strapi_be.repository_url,
    strapi_fe = module.strapi_fe.repository_url,
    react_fe  = module.cloud_game.repository_url,
    proxy     = module.proxy.repository_url,
    consumer  = module.consumer.repository_url,
  }
}
