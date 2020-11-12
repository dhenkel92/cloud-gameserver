output "access_keys" {
  value = merge(
    module.game_user.access_keys,
    module.github_deployer.access_keys,
    module.ecr_readonly.access_keys,
  )
}
