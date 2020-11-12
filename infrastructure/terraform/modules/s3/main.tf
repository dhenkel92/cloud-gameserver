resource "aws_s3_bucket" "bucket" {
  bucket = var.name
  acl    = "private"

  versioning {
    enabled = false
  }

  tags = var.tags
}

resource "aws_s3_bucket_public_access_block" "block" {
  count  = var.block_public_access ? 1 : 0
  bucket = aws_s3_bucket.bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
