variable "aws_region" {
  type        = string
  description = "AWS region for the sandbox environment"
  default     = "ap-south-1"
}

variable "vpc_cidr" {
  type        = string
  description = "CIDR block for the sandbox VPC"
  default     = "10.50.0.0/16"
}

variable "azs" {
  type        = list(string)
  description = "Availability zones to use"
  default     = ["ap-south-1a", "ap-south-1b"]
}

variable "public_subnets" {
  type        = list(string)
  description = "Public subnet CIDRs"
  default     = ["10.50.1.0/24", "10.50.2.0/24"]
}

variable "private_subnets" {
  type        = list(string)
  description = "Private subnet CIDRs"
  default     = ["10.50.101.0/24", "10.50.102.0/24"]
}

variable "db_username" {
  type        = string
  description = "Master username for the sandbox database"
  default     = "bitflow"
}

variable "db_password" {
  type        = string
  description = "Master password for the sandbox database"
}
