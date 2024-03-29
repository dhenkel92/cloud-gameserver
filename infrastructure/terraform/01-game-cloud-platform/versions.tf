terraform {
  required_providers {
    aws = {
      source = "hashicorp/aws"
    }
    hcloud = {
      source  = "hetznercloud/hcloud"
      version = "1.26.2"
    }
  }
  required_version = ">= 1.0"
}
