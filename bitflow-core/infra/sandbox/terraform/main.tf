terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.50"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "network" {
  source = "terraform-aws-modules/vpc/aws"

  name = "bitflow-sandbox"
  cidr = var.vpc_cidr

  azs             = var.azs
  public_subnets  = var.public_subnets
  private_subnets = var.private_subnets

  enable_nat_gateway = true
  single_nat_gateway = true
}

module "db" {
  source  = "terraform-aws-modules/rds/aws"
  version = "~> 6.5"

  identifier = "bitflow-sandbox-db"
  engine     = "mysql"
  engine_version = "8.0"

  instance_class = "db.t3.medium"
  allocated_storage = 50

  db_subnet_group_name   = module.network.database_subnet_group
  vpc_security_group_ids = [module.network.default_security_group_id]

  username = var.db_username
  password = var.db_password
}

# TODO: add Redis, S3, MediaConvert, IAM roles.
