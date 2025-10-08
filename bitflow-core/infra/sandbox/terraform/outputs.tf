output "db_endpoint" {
  description = "RDS endpoint"
  value       = module.db.db_instance_endpoint
}

output "db_security_group" {
  description = "Security group used by the DB"
  value       = module.network.default_security_group_id
}

output "vpc_id" {
  description = "Sandbox VPC ID"
  value       = module.network.vpc_id
}
