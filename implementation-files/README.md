# 🎓 Bitflow Implementation Files

This directory contains all the critical implementation files needed to build and deploy the Bitflow platform.

## 📁 Files Included

### 1. **docker-compose.yml**
Complete local development environment with:
- PostgreSQL database (master + tenant schemas)
- Redis for caching and queues
- PgAdmin for database management
- API, Auth, and Worker services
- Next.js web application
- Prisma Studio
- Mailhog for email testing

**Usage:**
```bash
docker-compose up -d        # Start all services
docker-compose logs -f      # View logs
docker-compose down         # Stop all services
docker-compose down -v      # Remove volumes
```

### 2. **Dockerfile**
Multi-stage Docker image for Node.js services with:
- Development stage (with hot reload)
- Production stage (optimized, secure, minimal)
- Non-root user for security
- Health checks
- Proper signal handling with dumb-init

**Usage:**
```bash
# Development
docker build --target development -t bitflow-api:dev .

# Production
docker build --target production -t bitflow-api:latest .
```

### 3. **prisma-schema.prisma**
Complete database schema including:
- Master schema (tenant registry)
- Tenant schema (replicated for each university)
- All 22 portal data models
- User management and authentication
- Academic records (LMS)
- HR records (HRMS)
- Support services
- Audit logging

**Key Features:**
- Schema-per-tenant multi-tenancy
- Comprehensive indexes for performance
- Soft deletes where appropriate
- Audit trails
- Flexible JSON fields for metadata

### 4. **github-actions-ci-cd.yml**
Complete CI/CD pipeline with 9 jobs:
1. Code quality checks (lint, typecheck, format)
2. Security scanning (Snyk, GitLeaks, CodeQL)
3. Unit and integration tests
4. E2E tests with Playwright
5. Docker image building and ECR push
6. Terraform plan (on PRs)
7. Database migration with safety checks
8. ECS deployment
9. Smoke tests and notifications

**Features:**
- Automated testing on every PR
- Security scanning
- Database snapshot before migration
- Zero-downtime deployment
- Deployment verification
- Slack and email notifications

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Docker and Docker Compose
- pnpm (recommended) or npm
- AWS account (for production)
- GitHub account (for CI/CD)

### Local Development

1. **Set up environment variables:**
```bash
cp .env.example .env
# Edit .env with your configuration
```

2. **Start services:**
```bash
docker-compose up -d
```

3. **Run migrations:**
```bash
docker-compose exec api npm run prisma:migrate
```

4. **Seed database:**
```bash
docker-compose exec api npm run prisma:seed
```

5. **Access applications:**
- API: http://localhost:3000
- Web App: http://localhost:3002
- PgAdmin: http://localhost:5050 (admin@bitflow.local / admin)
- Prisma Studio: http://localhost:5555
- Mailhog: http://localhost:8025

### Testing

```bash
# Unit tests
pnpm run test:unit

# Integration tests
pnpm run test:integration

# E2E tests
pnpm run test:e2e

# All tests with coverage
pnpm run test:coverage
```

### Production Deployment

1. **Set up AWS infrastructure:**
```bash
cd infra/terraform
terraform init
terraform plan -var-file=environments/prod.tfvars
terraform apply -var-file=environments/prod.tfvars
```

2. **Configure GitHub Secrets:**
Add these secrets in GitHub repository settings:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ACCOUNT_ID`
- `TF_STATE_BUCKET`
- `PRODUCTION_DATABASE_URL`
- `SNYK_TOKEN`
- `CODECOV_TOKEN`
- `SLACK_WEBHOOK`
- `EMAIL_USERNAME`
- `EMAIL_PASSWORD`

3. **Deploy:**
```bash
git push origin main
```

GitHub Actions will automatically handle the entire deployment pipeline.

## 📊 Architecture Overview

### Multi-Tenant Strategy
- **Schema-per-tenant**: Each university gets its own PostgreSQL schema
- **Tenant resolution**: Based on subdomain (e.g., stanford.bitflow.com)
- **Data isolation**: Complete separation at database level
- **Shared infrastructure**: All tenants on same AWS resources

### Service Architecture
```
┌─────────────────┐
│   CloudFront    │  (CDN + TLS)
└────────┬────────┘
         │
┌────────▼────────┐
│      ALB        │  (Load Balancer)
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼────┐
│  API  │ │  Auth │
│Service│ │Service│
└───┬───┘ └───┬───┘
    │         │
    └────┬────┘
         │
    ┌────▼────┐
    │  Redis  │
    └─────────┘
         │
    ┌────▼────┐
    │   RDS   │  (PostgreSQL)
    └─────────┘
```

### Database Schema Organization
```
bitflow_master (public schema)
├── tenants (registry)
└── platform_audit_logs

tenant_university1 (tenant schema)
├── users
├── roles
├── role_assignments
├── courses
├── enrollments
├── attendance
├── grades
└── ... (all tenant-scoped tables)

tenant_university2 (tenant schema)
└── ... (same structure)
```

## 🔒 Security Checklist

- [ ] All secrets in AWS Secrets Manager (production)
- [ ] Environment variables never committed to Git
- [ ] Database credentials rotated regularly
- [ ] RDS encryption at rest enabled
- [ ] S3 bucket encryption enabled
- [ ] TLS 1.3 for all communications
- [ ] WAF rules configured
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] SQL injection protection (Prisma)
- [ ] XSS protection enabled
- [ ] CSRF tokens for forms
- [ ] JWT tokens short-lived (15 min)
- [ ] Refresh token rotation
- [ ] Password hashing with bcrypt/argon2
- [ ] MFA for admin accounts
- [ ] Audit logging enabled
- [ ] Regular security scans (Snyk)
- [ ] Dependency updates automated

## 📈 Performance Optimization

### Database
- Connection pooling with PgBouncer
- Indexes on frequently queried columns
- Read replicas for reporting
- Query optimization
- Regular VACUUM and ANALYZE

### Caching
- Redis for session storage
- Redis for frequently accessed data
- CloudFront for static assets
- Browser caching headers

### Application
- Horizontal scaling with ECS
- Auto-scaling based on CPU/memory
- Load balancing across AZs
- Graceful shutdown handling
- Health checks

## 🔧 Troubleshooting

### Common Issues

**1. Database connection errors:**
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart service
docker-compose restart postgres
```

**2. Redis connection errors:**
```bash
# Check Redis
docker-compose ps redis
docker-compose logs redis
docker-compose restart redis
```

**3. Migration failures:**
```bash
# Check migration status
docker-compose exec api npm run prisma:migrate:status

# Reset database (DEV ONLY!)
docker-compose exec api npm run prisma:migrate:reset
```

**4. Docker build errors:**
```bash
# Clean Docker cache
docker builder prune -a

# Rebuild without cache
docker-compose build --no-cache
```

## 📚 Additional Resources

- [Complete Documentation](../BITFLOW_COMPREHENSIVE_DOCUMENTATION.md)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Documentation](https://docs.docker.com/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [Terraform Documentation](https://www.terraform.io/docs)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Run tests locally
4. Create a pull request
5. Wait for CI/CD checks to pass
6. Request code review

## 📞 Support

For issues or questions:
- Create a GitHub issue
- Email: dev-team@bitflow.com
- Slack: #bitflow-dev

---

**Last Updated:** October 30, 2025  
**Version:** 1.0.0
