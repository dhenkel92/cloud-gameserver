metadata = {
  name     = "minecraft-test"
  location = "nbg1"
  game_instance = {
    id = 2
  }
}

server = {
  type             = "cx31"
  image            = "placeholder"
  docker_image     = "cloudgame/minecraft:vanilla-1.18.2"
  ports            = []
  backup_s3_bucket = "cloud-game-dev"
  backup_paths     = [{ path = "isso" }]
}

datadog = {
  enabled = false
  api_key = "placeholder"
}

tags = {}
