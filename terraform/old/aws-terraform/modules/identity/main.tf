module "strapi_s3" {
  source     = "./iam"
  name       = "strapi_s3"
  create_key = true
  pgp_key    = var.pgp_key
  policy     = templatefile("${path.module}/files/strapi_s3_policy.tftemplate", { bucket_arn = var.public_bucket_arn })
  tags       = var.tags
}
