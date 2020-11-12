resource "aws_iam_user" "user" {
  name = "${var.name}.cloudgame"
  tags = var.tags
}

resource "aws_iam_access_key" "user_key" {
  count   = var.create_key ? 1 : 0
  user    = aws_iam_user.user.name
  pgp_key = var.pgp_key
}

resource "aws_iam_user_policy" "user_policy" {
  name   = "${var.name}-policy.cloudgame"
  user   = aws_iam_user.user.name
  policy = var.policy
}
