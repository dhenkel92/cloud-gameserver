output "access_keys" {
  value = {
    (aws_iam_user.user.name) = {
      access_key_id     = join("", aws_iam_access_key.user_key.*.id),
      secret_access_key = join("", var.pgp_key == null ? aws_iam_access_key.user_key.*.secret : aws_iam_access_key.user_key.*.encrypted_secret),
    }
  }
}
