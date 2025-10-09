# Bitflow Core - Backend Setup Guide

## ✅ Completed Foundation Tasks

### 1. Data & Domain Foundation
- ✅ **15 Database Migrations Created**
  - Universities & Colleges (tenant hierarchy)
  - Users, Roles & Permissions (RBAC)
  - Students & Faculty
  - Feature Catalog & Toggles
  - Notices & Timetable
  - Library Resources
  - Assessments & Submissions
  - Documents & Folders
  - Fee Structures, Invoices & Payments
  - Attendance & Corrections
  - Audit Logs

- ✅ **10 Core Models with Relationships**
  - University, College, Department
  - User, Student, Faculty
  - Role, Permission
  - Notice, TimetableBlock
  - FeatureCatalog, FeatureToggle

- ✅ **Tenant Resolution Middleware**
  - Domain/subdomain-based tenant detection
  - Header-based fallback for local dev
  - Automatic context injection into requests

### 2. RBAC & Seeding
- ✅ **Complete RBAC System**
  - 11 predefined roles (Bitflow Owner, University Owner, Super Admin, College Admin, Faculty, Student, etc.)
  - 35+ granular permissions across modules
  - Role-permission mapping with multi-tenant scoping

- ✅ **Feature Catalog Seeder**
  - 16 system features (HRMS, Finance, Library, Assessments, etc.)
  - Dependency management
  - Billing model configuration

- ✅ **Demo Data Seeder**
  - MVP Engineering College with 5 students, 1 faculty, 1 principal
  - Pre-configured roles and permissions
  - Sample notices and timetable blocks

### 3. Repositories & Services
- ✅ **4 Repository Classes**
  - NoticeRepository
  - TimetableRepository
  - StudentRepository
  - (Extensible architecture for more)

- ✅ **2 Service Classes**
  - StudentDashboardService (full dashboard aggregation)
  - CollegeAdminService (student management)

### 4. Controllers & Endpoints
- ✅ **Updated Learner Dashboard Controller**
  - Real data integration with StudentDashboardService
  - Returns notices, timetable, student info

- ✅ **New College Admin Students Controller**
  - GET /admin/students (list with filters)
  - GET /admin/students/{id} (detailed profile)

### 5. Background Jobs
- ✅ **ProcessDocumentUpload Job**
  - Async document processing to S3
  - Temp file cleanup

- ✅ **SendNoticeNotification Job**
  - Fan-out notifications to target audience
  - Ready for email/SMS/push integration

### 6. Artisan Commands
- ✅ **bitflow:setup**
  - One-command migration + RBAC + features setup
  - Optional `--fresh` flag

- ✅ **bitflow:seed-demo**
  - Loads MVP demo college with test users

---

## 🚀 Quick Start

### Prerequisites
- PHP 8.3+
- Composer 2.7+
- MySQL 8.0+ or PostgreSQL 15+
- Redis (for queues & caching)

### Installation Steps

1. **Clone and install dependencies**
   ```bash
   cd bitflow-core
   composer install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Run setup command**
   ```bash
   php artisan bitflow:setup
   ```

   This will:
   - Run all migrations
   - Seed RBAC (roles & permissions)
   - Seed feature catalog
   - Optionally seed demo data

4. **Start development server**
   ```bash
   php artisan serve
   ```

5. **Start queue worker** (in separate terminal)
   ```bash
   php artisan queue:work
   ```

---

## 🔐 Demo Credentials

After running `bitflow:seed-demo`:

| Role               | Username          | Password        |
|--------------------|-------------------|-----------------|
| Bitflow Owner      | bitflow_admin     | gMAP@2025?      |
| University Owner   | college_123       | cOLLEGE@123?    |
| Principal          | principal_mvp     | Principal@123   |
| Faculty            | prof_sharma       | Faculty@123     |
| Students (1-5)     | student_mvp_1     | Student@123     |

---

## 📋 Available API Endpoints

### Learner Portal
- `GET /learner/dashboard` - Student dashboard with notices, timetable, quick links

### Admin Portal
- `GET /admin/students` - List students (with filters: course, year, status)
- `GET /admin/students/{id}` - Student profile details

### Planned Endpoints
- Timetable management
- Library resources CRUD
- Assessment creation & grading
- Document folder management
- Fee invoice generation
- Attendance marking & corrections

---

## 🏗️ Architecture Highlights

### Tenant Context Resolution
Every request automatically resolves university + college context via middleware:
```php
// Access tenant anywhere
$university = app('tenant.university');
$college = app('tenant.college');

// Or from request
$university = $request->get('_tenant_university');
```

### Service Layer Pattern
Controllers delegate business logic to services:
```php
class DashboardController {
    public function __construct(
        private StudentDashboardService $service
    ) {}
    
    public function index() {
        return $this->service->getDashboardData();
    }
}
```

### Repository Pattern
Services use repositories for data access:
```php
class StudentDashboardService {
    public function __construct(
        private NoticeRepository $notices,
        private TimetableRepository $timetable
    ) {}
}
```

---

## 🧪 Testing

Run PHPUnit tests:
```bash
composer test
```

Run code linting:
```bash
composer lint
```

Auto-fix code style:
```bash
composer format
```

---

## 📦 Next Steps

### Immediate Priorities
1. **Authentication & JWT** - Wire Laravel Sanctum or JWT auth
2. **OpenAPI Contracts** - Finalize specs for remaining endpoints
3. **Library Module** - Complete CRUD for notes, videos, e-books
4. **Assessment Module** - MCQ auto-grading, SAQ/LAQ submission
5. **Documents Module** - Upload, verification workflows
6. **Fee Management** - Invoice generation, payment recording

### Queue Pipeline
- Configure Horizon for queue monitoring
- Set up Redis or database queue driver
- Add retry logic and failed job handling

### Observability
- Integrate Laravel Telescope for local debugging
- Add CloudWatch logging for production
- Set up Sentry for error tracking

---

## 🔧 Troubleshooting

### Migration Errors
```bash
# Reset database
php artisan migrate:fresh

# Or use setup command
php artisan bitflow:setup --fresh
```

### Queue Jobs Not Processing
```bash
# Check queue worker is running
php artisan queue:work

# For development, sync driver works without worker
# Set QUEUE_CONNECTION=sync in .env
```

### Cache Issues
```bash
php artisan cache:clear
php artisan config:clear
```

---

## 📚 Documentation References
- [Architecture Overview](./docs/architecture/overview.md)
- [Backend Implementation Tracker](./docs/backend-implementation.md)
- [API Contracts](./docs/contracts/)
- [Development Runbook](./docs/runbook/development.md)

---

**Version:** 0.1.0 (Alpha)  
**Last Updated:** October 8, 2025  
**Maintainer:** Bitflow Platform Team
