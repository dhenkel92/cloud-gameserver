metadata = {
  name     = "minecraft-test"
  location = "nbg1"
}

server = {
  type         = "cx31"
  image        = "68074861"
  docker_image = "cloudgame/minecraft:vanilla-1.18.2"
  ports        = []
  backup_paths = [{ path = "isso" }]
}

datadog = {
  enabled = false
  api_key = "placeholder"
}

tags = {}
