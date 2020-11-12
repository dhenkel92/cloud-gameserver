resource "aws_iam_user" "user" {
  name = "${var.name}.cloud-game"
  path = "/"

  tags = var.tags
}

resource "aws_iam_user_policy" "policy" {
  name = "${var.name}-policy.cloud-game"
  user = aws_iam_user.user.name

  policy = var.policy
}

resource "aws_iam_access_key" "user_key" {
  count   = var.create_key ? 1 : 0
  user    = aws_iam_user.user.name
  pgp_key = var.pgp_key
}
