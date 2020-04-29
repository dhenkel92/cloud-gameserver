output "key_pair" {
  value = {
      access_key_id = aws_iam_access_key.user_key.*.id,
      secret_access_key = aws_iam_access_key.user_key.*.encrypted_secret,
  }
}
