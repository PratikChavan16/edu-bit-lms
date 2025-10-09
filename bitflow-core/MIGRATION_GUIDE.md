# Database Migration & Setup Instructions

## Prerequisites Checklist

Before running migrations, ensure:

- [ ] PHP 8.3+ installed (`php -v`)
- [ ] Composer 2.7+ installed (`composer -V`)
- [ ] MySQL 8.0+ or PostgreSQL 15+ running
- [ ] Database created (e.g., `bitflow_nova_dev`)
- [ ] `.env` file configured with correct credentials

---

## Environment Configuration

### 1. Copy Environment File
```bash
cp .env.example .env
```

### 2. Configure Database Settings

Edit `.env` and set:

```env
# Application
APP_NAME="Bitflow Nova"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bitflow_nova_dev
DB_USERNAME=root
DB_PASSWORD=your_password

# Queue (for background jobs)
QUEUE_CONNECTION=database  # or redis for production
BROADCAST_DRIVER=log
CACHE_DRIVER=file
SESSION_DRIVER=file

# Redis (optional, for production)
REDIS_HOST=127.0.0.1
REDIS_PASSWORD=null
REDIS_PORT=6379

# AWS (for production document storage)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=
```

### 3. Generate Application Key
```bash
php artisan key:generate
```

---

## Installation Methods

### Method 1: Automated Setup (Recommended)

Run the all-in-one setup command:

```bash
php artisan bitflow:setup
```

**This will:**
1. Run all 15 migrations
2. Seed RBAC (roles & permissions)
3. Seed feature catalog
4. Prompt to load demo data

**For fresh install (WARNING: deletes all data):**
```bash
php artisan bitflow:setup --fresh
```

### Method 2: Manual Step-by-Step

```bash
# 1. Run migrations
php artisan migrate

# 2. Seed RBAC
php artisan db:seed --class=RBACSeeder

# 3. Seed features
php artisan db:seed --class=FeatureCatalogSeeder

# 4. (Optional) Load demo college
php artisan bitflow:seed-demo
```

---

## Verification

### Check Migration Status
```bash
php artisan migrate:status
```

Expected output:
```
Migration name ..................................... Batch / Status
2024_01_01_000001_create_universities_table ......... [1] Ran
2024_01_01_000002_create_colleges_table ............. [1] Ran
2024_01_01_000003_create_departments_table .......... [1] Ran
2024_01_01_000004_create_users_table ................ [1] Ran
2024_01_01_000005_create_roles_and_permissions_tables [1] Ran
... (and 10 more)
```

### Verify Database Tables
```sql
-- Connect to database
mysql -u root -p bitflow_nova_dev

-- Check tables
SHOW TABLES;

-- Verify seeded data
SELECT COUNT(*) FROM roles;       -- Should show 11 roles
SELECT COUNT(*) FROM permissions; -- Should show 35+ permissions
SELECT COUNT(*) FROM feature_catalog; -- Should show 16 features
```

### Verify Demo Data (if seeded)
```sql
SELECT * FROM universities;  -- Should show MVP
SELECT * FROM colleges;      -- Should show MVP Engineering College
SELECT * FROM users LIMIT 5; -- Should show test users
```

---

## Starting the Application

### 1. Start API Server
```bash
php artisan serve
```
Access at: `http://localhost:8000`

### 2. Start Queue Worker (separate terminal)
```bash
php artisan queue:work
```

For development with auto-reload:
```bash
php artisan queue:work --timeout=60
```

---

## Testing Endpoints

### Test Student Dashboard
```bash
curl http://localhost:8000/api/learner/dashboard \
  -H "X-Tenant-University: mvp" \
  -H "X-Tenant-College: mvp-engg"
```

### Test Admin Students List
```bash
curl http://localhost:8000/api/admin/students \
  -H "X-Tenant-College: <college-uuid>"
```

---

## Troubleshooting

### Error: "Access denied for user"
**Solution:** Check DB credentials in `.env`

### Error: "Base table or view not found"
**Solution:** Run migrations
```bash
php artisan migrate
```

### Error: "Class 'App\Models\University' not found"
**Solution:** Dump autoload
```bash
composer dump-autoload
```

### Fresh Install Needed
```bash
# WARNING: Deletes all data
php artisan migrate:fresh --seed
```

### Reset Specific Table
```bash
# Rollback last batch
php artisan migrate:rollback

# Rollback specific migration
php artisan migrate:rollback --step=1
```

---

## Production Deployment Checklist

- [ ] Run migrations on production DB
- [ ] Seed RBAC & features (NOT demo data)
- [ ] Configure queue driver (Redis/SQS)
- [ ] Set up queue workers as systemd service
- [ ] Configure AWS S3 for document storage
- [ ] Enable query logging (CloudWatch)
- [ ] Set `APP_ENV=production` and `APP_DEBUG=false`
- [ ] Run `php artisan config:cache`
- [ ] Run `php artisan route:cache`

---

## Migration File Naming Convention

Format: `YYYY_MM_DD_HHMMSS_description.php`

Our migrations use date-based prefixes for logical ordering:
- `2024_01_01_0000XX` - Core infrastructure
- Future migrations will use actual timestamps

---

## Database Schema Reference

### Tenant Hierarchy
```
universities (1) → (N) colleges → (N) departments
```

### User Relationships
```
users (1) → (1) student
users (1) → (1) faculty
users (N) → (N) roles (via user_roles pivot)
```

### Key Indexes
- `students.college_id, roll_number` (unique)
- `attendance.student_id, timetable_block_id, date` (unique)
- `library_resources.college_id, type, subject`
- `fee_invoices.student_id, status`

---

## Support

For issues, check:
- `storage/logs/laravel.log`
- `php artisan route:list` (verify routes)
- `php artisan tinker` (test models)

---

**Last Updated:** October 8, 2025  
**Database Version:** v0.1.0 (15 migrations)
