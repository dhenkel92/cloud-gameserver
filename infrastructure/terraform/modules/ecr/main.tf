resource "aws_ecr_repository" "repo" {
  name                 = var.name
  image_tag_mutability = var.tag_mutability

  image_scanning_configuration {
    scan_on_push = var.scan_on_push
  }

  tags = var.tags
}


resource "aws_ecr_lifecycle_policy" "foopolicy" {
  count = var.lifecycle_policy == "" ? 0 : 1

  repository = aws_ecr_repository.repo.name
  policy     = var.lifecycle_policy
}
