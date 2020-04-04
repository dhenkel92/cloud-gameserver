module "gameserver_cloud_bucket" {
  source            = "./s3"
  bucket_name       = "gameserver-cloud"
  enable_versioning = true
  tags              = var.tags
}
