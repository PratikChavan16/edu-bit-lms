# Bitflow LMS API - Testing Guide

## API Endpoints Overview

### 🏥 Health & Status
- `GET http://localhost:3000/health` - Health check
- `GET http://localhost:3000/api/v1/welcome` - Welcome message

### 🗄️ Database & Tenants
- `GET http://localhost:3000/api/v1/tenants/db-test` - Test database connection
- `GET http://localhost:3000/api/v1/tenants` - List all tenants
- `POST http://localhost:3000/api/v1/tenants` - Create new tenant

### 🔐 Authentication
- `POST http://localhost:3000/api/v1/auth/register` - Register new user
- `POST http://localhost:3000/api/v1/auth/login` - User login
- `POST http://localhost:3000/api/v1/auth/refresh` - Refresh access token

---

## Testing with PowerShell

### 1. Register a New User

```powershell
$registerData = @{
    email = "john.doe@university.edu"
    password = "SecurePass123!"
    firstName = "John"
    lastName = "Doe"
    role = "student"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $registerData
```

### 2. Login

```powershell
$loginData = @{
    email = "john.doe@university.edu"
    password = "SecurePass123!"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $loginData

# Save the access token
$accessToken = $response.accessToken
$refreshToken = $response.refreshToken

Write-Host "Access Token: $accessToken"
Write-Host "Refresh Token: $refreshToken"
```

### 3. Refresh Token

```powershell
$refreshData = @{
    refreshToken = $refreshToken
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/auth/refresh" `
    -Method Post `
    -ContentType "application/json" `
    -Body $refreshData
```

### 4. Test Database Connection

```powershell
Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tenants/db-test" -Method Get
```

### 5. Create a Tenant

```powershell
$tenantData = @{
    name = "Stanford University"
    subdomain = "stanford"
    contactEmail = "admin@stanford.edu"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/api/v1/tenants" `
    -Method Post `
    -ContentType "application/json" `
    -Body $tenantData
```

---

## Testing with curl (if available)

### Register User
```bash
curl -X POST http://localhost:3000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@university.edu",
    "password": "SecurePass456!",
    "firstName": "Jane",
    "lastName": "Smith",
    "role": "teacher"
  }'
```

### Login
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane.smith@university.edu",
    "password": "SecurePass456!"
  }'
```

---

## Docker Services Status

Check running services:
```powershell
docker ps
```

Expected containers:
- `bitflow-postgres` - PostgreSQL database (port 5432)
- `bitflow-redis` - Redis cache (port 6379)

View PostgreSQL logs:
```powershell
docker logs bitflow-postgres
```

Connect to PostgreSQL:
```powershell
docker exec -it bitflow-postgres psql -U bitflow -d bitflow_master
```

---

## Database Schema

### Master Schema (public)
- **tenants** - Multi-tenant registry

### Tenant Schema (tenant)
- **users** - User accounts
- **roles** - Role definitions
- **courses** - Course catalog
- **enrollments** - Student enrollments
- **audit_logs** - Activity logging

---

## What's Working ✅

1. ✅ Express API server with TypeScript
2. ✅ Security middleware (Helmet, CORS, Rate Limiting)
3. ✅ PostgreSQL database with multi-schema support
4. ✅ Redis for caching/sessions
5. ✅ Prisma ORM with migrations
6. ✅ Authentication endpoints (register/login/refresh)
7. ✅ JWT token generation (15min access, 7d refresh)
8. ✅ Password hashing with bcrypt
9. ✅ Input validation with Zod
10. ✅ Tenant management endpoints
11. ✅ Hot reload with ts-node-dev

---

## Next Steps 🚀

1. **Connect Prisma Client** - Wire up actual database queries
2. **Authentication Middleware** - Protect routes with JWT verification
3. **Tenant Resolver** - Extract tenant from subdomain
4. **First Portal** - Build Student Portal endpoints
5. **File Upload** - Integrate AWS S3 for document storage
6. **Email Service** - Configure Mailhog/SendGrid
7. **Testing** - Add Jest unit and integration tests
8. **Documentation** - Generate API docs with Swagger

---

## Useful Commands

**Start API server:**
```powershell
cd services/api
pnpm dev
```

**Run migrations:**
```powershell
cd services/api
npx prisma migrate dev --schema ../../prisma/schema-simple.prisma
```

**View database:**
```powershell
cd services/api
npx prisma studio --schema ../../prisma/schema-simple.prisma
```

**Docker commands:**
```powershell
docker-compose up -d          # Start all services
docker-compose down           # Stop all services
docker-compose ps             # List running containers
docker-compose logs api       # View API logs
```
