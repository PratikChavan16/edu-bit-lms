# 🚀 Bitflow Quick Start Guide

**Time to first running app: 30 minutes**

## 📋 Prerequisites Checklist

- [ ] Node.js 20+ installed (`node --version`)
- [ ] Docker Desktop installed and running
- [ ] Git installed
- [ ] pnpm installed (`npm install -g pnpm`)
- [ ] Code editor (VS Code recommended)
- [ ] 8GB+ RAM available
- [ ] 20GB+ free disk space

## ⚡ 5-Minute Local Setup

### Step 1: Create Project Directory
```bash
mkdir bitflow && cd bitflow
git init
pnpm init
```

### Step 2: Copy Implementation Files
```bash
# Copy from implementation-files/ to your project:
cp implementation-files/docker-compose.yml .
cp implementation-files/Dockerfile services/api/
cp implementation-files/prisma-schema.prisma prisma/schema.prisma
```

### Step 3: Create Environment File
```bash
cat > .env << EOL
DATABASE_URL=postgresql://bitflow:bitflow_dev_password@localhost:5432/bitflow_master
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=bitflow_redis_password
JWT_SECRET=dev_jwt_secret_change_in_production_min_32_chars
JWT_REFRESH_SECRET=dev_jwt_refresh_secret_change_in_production_min_32_chars
NODE_ENV=development
EOL
```

### Step 4: Start Services
```bash
docker-compose up -d
```

### Step 5: Verify Everything is Running
```bash
docker-compose ps

# Should show:
# - bitflow-postgres (healthy)
# - bitflow-redis (healthy)
# - bitflow-api (running)
# - bitflow-auth (running)
# - bitflow-web (running)
# - bitflow-pgadmin (running)
# - bitflow-prisma-studio (running)
```

### Step 6: Access Applications
- **API**: http://localhost:3000
- **Web App**: http://localhost:3002
- **PgAdmin**: http://localhost:5050 (admin@bitflow.local / admin)
- **Prisma Studio**: http://localhost:5555

## 🎯 First Development Tasks

### 1. Create Your First Tenant
```bash
docker-compose exec api node scripts/provision-tenant.js \
  --name "Demo University" \
  --domain "demo" \
  --email "admin@demo.edu" \
  --password "SecurePass123!"
```

### 2. Access Your Tenant
Visit: http://demo.bitflow.local:3002
Login: admin@demo.edu / SecurePass123!

### 3. Explore the Database
- Open PgAdmin: http://localhost:5050
- Add server: `postgres:5432` with credentials from .env
- Explore schemas: `public` (master) and `tenant_demo` (tenant)

### 4. View Prisma Studio
- Open: http://localhost:5555
- Browse all tables
- Edit data directly
- Run queries

## 🧪 Running Tests

```bash
# Unit tests
docker-compose exec api pnpm run test:unit

# Integration tests
docker-compose exec api pnpm run test:integration

# Watch mode
docker-compose exec api pnpm run test:watch
```

## 🔧 Common Commands

### Docker Commands
```bash
# View logs
docker-compose logs -f api

# Restart a service
docker-compose restart api

# Stop all services
docker-compose down

# Remove volumes (⚠️ deletes data)
docker-compose down -v

# Rebuild services
docker-compose build --no-cache
```

### Database Commands
```bash
# Run migrations
docker-compose exec api npx prisma migrate dev

# Create migration
docker-compose exec api npx prisma migrate dev --name add_new_table

# Reset database (⚠️ deletes all data)
docker-compose exec api npx prisma migrate reset

# Seed database
docker-compose exec api npx prisma db seed
```

### Application Commands
```bash
# Install new package
docker-compose exec api pnpm add <package-name>

# Run linter
docker-compose exec api pnpm run lint

# Format code
docker-compose exec api pnpm run format

# Type check
docker-compose exec api pnpm run typecheck
```

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000  # Mac/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
```

### Database Connection Failed
```bash
# Check if PostgreSQL is running
docker-compose ps postgres

# View logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres
```

### Redis Connection Failed
```bash
# Check Redis
docker-compose logs redis
docker-compose restart redis
```

### Out of Memory
```bash
# Increase Docker memory limit to 8GB in Docker Desktop settings
# Or reduce number of running services
```

## 📚 Next Steps

1. **Read Full Documentation**: `BITFLOW_COMPREHENSIVE_DOCUMENTATION.md`
2. **Study Implementation Files**: Understand Prisma schema, Docker setup
3. **Build First Portal**: Start with Student Portal
4. **Add Tests**: Write unit tests as you build
5. **Join Community**: Connect with other developers

## 🎓 Learning Path

### Week 1: Basics
- [x] Set up local environment
- [ ] Understand multi-tenancy concept
- [ ] Explore Prisma schema
- [ ] Make first API endpoint

### Week 2: Core Features
- [ ] Implement authentication
- [ ] Build user management
- [ ] Create role-based access
- [ ] Test tenant isolation

### Week 3: First Portal
- [ ] Design Student Portal UI
- [ ] Implement course listing
- [ ] Add assignment submission
- [ ] Create grade viewing

### Week 4: Testing & Deployment
- [ ] Write comprehensive tests
- [ ] Set up CI/CD pipeline
- [ ] Deploy to AWS (dev environment)
- [ ] Monitor and optimize

## 🆘 Get Help

- **Documentation**: `BITFLOW_COMPREHENSIVE_DOCUMENTATION.md`
- **Issues**: Create GitHub issue
- **Email**: dev-team@bitflow.com
- **Community**: Join Slack #bitflow-dev

## ✅ Daily Checklist

### Before Starting Development
- [ ] Pull latest code: `git pull`
- [ ] Start services: `docker-compose up -d`
- [ ] Check service health: `docker-compose ps`
- [ ] View logs: `docker-compose logs -f`

### Before Committing
- [ ] Run tests: `pnpm run test`
- [ ] Run linter: `pnpm run lint`
- [ ] Type check: `pnpm run typecheck`
- [ ] Format code: `pnpm run format`

### Before Going Home
- [ ] Commit your work: `git commit -am "Your message"`
- [ ] Push to remote: `git push`
- [ ] Stop services: `docker-compose down`

## 🎉 You're Ready!

You now have a fully functional local development environment. Start building!

**Estimated time from here to first working portal: 2-4 weeks**

---

*Last Updated: October 30, 2025*
