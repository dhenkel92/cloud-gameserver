resource "aws_ecr_repository" "image" {
  name                 = var.name
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = var.tags
}

resource "aws_ecr_lifecycle_policy" "foopolicy" {
  repository = aws_ecr_repository.image.name

  policy = <<EOF
{
    "rules": [
        {
            "rulePriority": 1,
            "description": "Keep last ${var.keep_count} images",
            "selection": {
                "tagStatus": "any",
                "countType": "imageCountMoreThan",
                "countNumber": ${var.keep_count}
            },
            "action": {
                "type": "expire"
            }
        }
    ]
}
EOF
}
