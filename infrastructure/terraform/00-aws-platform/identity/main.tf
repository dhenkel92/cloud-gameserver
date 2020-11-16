module "game_user" {
  source = "../../modules/iam_user"

  name = "game_user"
  tags = var.tags

  create_key = true

  policy = templatefile("${path.module}/files/backup.json", {
    bucket_arn = var.game_state_bucket_arn
  })
}

module "github_deployer" {
  source = "../../modules/iam_user"

  name = "github_deployer"
  tags = var.tags

  create_key = true
  pgp_key    = var.pgp_key

  policy = templatefile("${path.module}/files/github_deploy.json", {})
}

module "ecr_readonly" {
  source = "../../modules/iam_user"

  name = "ecr_readonly"
  tags = var.tags

  create_key = true

  policy = templatefile("${path.module}/files/ecr_readonly.json", {})
}

module "certbot" {
  source = "../../modules/iam_user"

  name = "certbot"
  tags = var.tags

  create_key = true

  policy = templatefile("${path.module}/files/certbot.json", {
    hz_id = var.main_hz_id
  })
}
