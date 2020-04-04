module "cloud_game_bucket" {
  source            = "./s3"
  bucket_name       = "cloud-game"
  enable_versioning = true
  tags              = var.tags
}

module "cloud_game_public_bucket" {
  source            = "./s3"
  bucket_name       = "cloud-game-public"
  enable_versioning = true
  tags              = var.tags
}
