name     = "cloud-game"
ip_range = "10.0.0.0/24"

ssh_keys = {
  yubi   = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAACAQC35h+SwNo4jtVYSMdEmdVEj8pEY5dWtiL8wIJe/81pKxOHd8Cglm8FAnzB/Dwu4p+QZcATzSc5Dk5a1Qo5LgHPSp4fe0HHjjm6LX3kU2OAtodO7+zcX4eOFBSOzM/1MO5C4TNN028GW27LN7OV8MFKKGGlbg/QYpYiDh8Wi5axx5WBTrbrrEbeuN5uHYBVTMdOMOyAAlU+QFZKKspWwP5cpkVwLGQ7r2Y0wBHeh0957SxU4fSyqpzJOAcFeZ5ibZST98Kieeih+mbnfdiHdNdxcyq9BJW6T4TYqRuQLss1EMjz7kWnyhFMbidzeI3r/Li5qMDIk6QrKil982E512KTrT6fYoicDX6DiTfcCi16u/kVK40O7f2+xLP21YEOt/Ek4g9tq/qXhBNsi5qXB7dfLAceiG0f+rSnv4XJQlUlApcbkAOXmM8T0FiuYCRu6HojHkZpDyIysIdb14pSnDE6XsfzEy08/47aWg5Xt1DNSYw4y0uzrOnHCsv/N5PrTuc66+BzKXP1Le/XaezRakLLQYwwqt5ShpilBaEGPpyod+2Ff1Azn5xDDuIgomWrnb/kZ7AY+ObUdrGhxe7m6Dl284Gx7Am9l8sel4WJb7nEB/MgTie1yedYKXbLCpV9f2XLi5fnraP1XYJEqQy2/5OyA6wJ09cQ/QxF1+4Odd1b6w=="
  github = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQDWuWRXYYpFVrEmNtQ0pB0wjo632GFk7TrlzAUsNtk9ZHNP06VKmZBC/cbwzgbJ/m78UE6MEb7JBF0cu1UmQmNZJxP4bpSg+o+eoOM569kDebIYu/TntQAvvPVfGgdRbeaeghHje7vj+4MYpqwBrWXr4SrfUI/3NsCir/OTnyFYgW6kSJvMnHYZhItGJ+L1WJKw5dHLo7I11X/MQ1k3tfeAzRT4x6IQUq9qx6f7K7UhCh4Vsy+EzAQeF0s1WyhxV7nLFQPFFMcjLkeM0FYov/Tj9lBFMipyI4eqwIu/fM7L086D9C52qSpmKbazZzllofd5WIFkY15fG4p+Z2ulids0uKM2i+Q9UgaogXD45gOO4gNSjjcLxaZU12GNRJ2XNRHlTVtiyAEeqA1wfVp85SzdEXb+o0XPG9ggSWo84IMyTKNbdzwsALaJsAXaWCscIFoaqCsyBqGYWOSavTUktG6QvjctpTor9CnMHQju8qIGuwlcch/AefgHDAxC7+dAFjs="
}

cloud_game_server = {
  image       = "162785630"
  server_type = "cx21"
  volume = {
    create = true
    size   = 10
  }
}

dns = {
  "cloud-game.app" = [
    "cloud-game.app",
    "api.cloud-game.app",
    "admin.cloud-game.app",
    "ext.cloud-game.app",
  ]
}

tags = {}
