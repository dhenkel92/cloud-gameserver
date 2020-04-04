module "strapi-backend-api" {
  source     = "./ecr"
  name       = "minecraft/backend"
  keep_count = 3
}

module "strapi-backend-react" {
  source     = "./ecr"
  name       = "minecraft/frontend"
  keep_count = 3
}
