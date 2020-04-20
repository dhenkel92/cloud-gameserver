ssh_keys = {
  "daniel yubi" = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCpyqSshPP51uI9EQLDKv9iyMLl/EGqBdgkfed/dL0Kk+HheCWS/lMTX9ObP3nKFND3Cmwbf/dAd/81h3YrZcvU9E/F4fppdXvsh6W03CcfOijZNyymKn3MyKeXRu/zH2aqVeQNYXPOcnJDrKOXH4FxOMIbffewGZ6d2m00SJNsccWBxNSDR8yfOMEGCCyCpJkaXpRzinXOAonWh2J+7U328tvlNaf7ibPImwBLT5bwcTUeMvVYS4SlxJnEkeMZe2a8/Pm/uHERGTOFZ4zz7ymy2TovFjpwGdlW9B6sUqjxi0Zag3Jgywup7s7w/890SxFCvhd8kWvd/49naC04STHR cardno:000610347368",
  "WW Yubi"     = "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQC6kOTAjfKJRoVTg5Y0TWLPiBzHglBmdvCa3B7L7bxN1Im5dW3KBqJoU6ib5l46ZI+0dJGv4ilvy8ykEnH4POuCBKbO/S9fCwQoo/fRKfEFwvQ245LP5m1MOjTV0w6SMus68voFLnShL1hBw8r6l7hl7DWh4YC/beTri/Lks5wpbgmBpoWwe2XhwRMvrvFNcnoRd3H1jZaevSopbQG1esaGvZleTTEBo75bE97RiA12q4KFGt5y7VItidQNxbBfy/BG/QvXkuJjlOd/KjM/PRd9xrzq0ukvP+GNRq9eMh8T0nfxz1wudpkbmuySagI9+EejjvTSjhcTaOlRuRdhqBYD cardno:000609500928",
}
general_setup = {
  image          = "ubuntu-16.04"
  net_base_range = "10.0.0"

  dns_base = "henkel.media"
}

packs = {
#   the-pack = {
#     server_type = "cx31"
#   },
  "vanilla-1.15" = {
    server_type = "cx31"
  },
#   empty = {
#     server_type = "cx21"
#   },
}
