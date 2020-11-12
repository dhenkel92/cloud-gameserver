module "strapi-backend-api" {
  source     = "./ecr"
  name       = "cloud-game/strapi/backend"
  keep_count = 3

  tags = var.tags
}

module "strapi-backend-react" {
  source     = "./ecr"
  name       = "cloud-game/strapi/frontend"
  keep_count = 3

  tags = var.tags
}

module "react_frontend" {
  source     = "./ecr"
  name       = "cloud-game/react/frontend"
  keep_count = 3

  tags = var.tags
}
