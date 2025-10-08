# AWS Sandbox Provisioning

Infrastructure for shared development testing is defined in `infra/sandbox/terraform`. The goal is to provision a minimal yet production-like stack:

- VPC with public/private subnets
- RDS MySQL 8.0 (db.t3.medium)
- ElastiCache Redis (cache.t3.small)
- S3 bucket for uploads + versioning
- MediaConvert job queue + IAM roles
- CloudFront distribution fronting S3 media
- IAM roles for GitHub Actions OIDC deployments

## Prerequisites

- Terraform 1.7+
- AWS CLI v2 configured with the Bitflow sandbox account
- `AWS_PROFILE` set to the sandbox profile

## Usage

```bash
cd infra/sandbox/terraform
terraform init
terraform workspace new mvp-sandbox   # once per deployment target
terraform apply                       # review plan before approving
```

## Outputs

The Terraform module exports connection strings and resource identifiers used by application `.env` files:

- `db_endpoint`
- `redis_endpoint`
- `s3_bucket`
- `mediaconvert_role_arn`
- `cloudfront_domain`

Store these values in AWS Secrets Manager under `/bitflow/sandbox/<university>/` for automated retrieval by deploy pipelines.

## Teardown

```bash
terraform destroy
```

Only destroy environments after confirming no teams are actively using the sandbox.
