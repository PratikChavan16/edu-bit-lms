# 🧠 BITFLOW LMS - MASTER PROJECT BRAIN

**Version**: 2.0  
**Date**: October 25, 2025  
**Status**: Production-Ready Architecture  
**Purpose**: Complete system specification for 14-portal enterprise campus management platform

---

## 📋 EXECUTIVE SUMMARY

### System Overview
BitFlow LMS is a **multi-tenant, microservices-based, enterprise-grade Campus Operating System** designed for universities managing multiple colleges. The platform serves **14 distinct user portals** with role-based access control, real-time collaboration, and comprehensive audit trails.

### Key Metrics
- **14 Portals**: Bitflow Admin → University Owner → Super Admin → Principal → College Admin → Super Academics → Faculty → Student → Parent → Admission Admin → Super Accountant → College Accounts → College Fee Admin → Super NT Manager
- **38 Core Modules**: Academic, Financial, HR, Operations, Communications
- **50+ Database Tables**: Multi-tenant row-level security
- **200+ API Endpoints**: RESTful + WebSocket for real-time features
- **Target Scale**: 100,000+ users, 10,000+ concurrent sessions, 1M+ transactions/day

---

## 🏗️ SYSTEM ARCHITECTURE

### Multi-Tenancy Strategy
**Row-Level Tenant Isolation** (not separate databases)
- Every table includes `university_id UUID NOT NULL`
- Middleware automatically injects tenant context from JWT
- Database indexes: `CREATE INDEX idx_table_university ON table(university_id, id)`
- **Why**: Simplified backups, cross-tenant analytics, resource efficiency

### Technology Stack

#### Backend
- **Runtime**: PHP 8.3 with Laravel 11
- **Database**: PostgreSQL 16 (primary), Redis 7 (cache/sessions/queues)
- **API Style**: RESTful JSON + Laravel Sanctum (token auth)
- **Real-time**: Laravel Broadcasting + Pusher/Soketi (WebSockets)
- **Jobs**: Laravel Queues with Redis driver
- **Storage**: AWS S3 (documents/media), local for dev

#### Frontend
- **Framework**: Next.js 16.0.0-canary.6 (App Router, React 19, Turbopack)
- **Language**: TypeScript 5.6 (strict mode)
- **State**: Zustand 4.x (lightweight, no Redux complexity)
- **UI Library**: Custom component library (`@bitflow/ui`) + TailwindCSS 4.x
- **Forms**: React Hook Form + Zod validation
- **API Client**: Fetch API with axios fallback, custom `useAuth` hook

#### Infrastructure
- **Deployment**: Docker containers, Kubernetes (production)
- **CI/CD**: GitHub Actions → Build → Test → Security Scan → Deploy
- **Monitoring**: Prometheus + Grafana, Sentry (error tracking)
- **Logging**: Structured JSON logs → ELK Stack (Elasticsearch, Logstash, Kibana)

---

## 🗄️ MASTER DATABASE SCHEMA

### Core Tables (38 total)

#### 1. Identity & Access (6 tables)
```sql
users, roles, permissions, role_user, role_permissions, sessions
```

#### 2. University & Structure (5 tables)
```sql
universities, colleges, departments, courses, academic_years
```

#### 3. Academic (8 tables)
```sql
students, enrollments, attendance, grades, assignments, submissions, timetables, class_schedules
```

#### 4. Faculty & Staff (4 tables)
```sql
faculty, staff, leaves, payroll_records
```

#### 5. Financial (7 tables)
```sql
fee_structures, fee_payments, invoices, ledger_entries, expense_categories, expenses, payment_gateways
```

#### 6. Operations (4 tables)
```sql
notifications, audit_logs, file_uploads, settings
```

#### 7. Communications (4 tables)
```sql
announcements, messages, parent_links, complaint_tickets
```

### ER Diagram (Simplified)
```
┌─────────────┐
│ University  │──┐
└─────────────┘  │
                 │ 1:N
                 ▼
           ┌──────────┐
           │ Colleges │──┐
           └──────────┘  │
                         │ 1:N
                         ▼
                   ┌────────────┐
                   │Departments │──┐
                   └────────────┘  │
                                   │ 1:N
                                   ▼
                             ┌─────────┐
                             │ Courses │
                             └─────────┘
                                   │
                                   │ N:M
                                   ▼
┌───────┐                    ┌────────────┐
│ Users │──────────────┬────▶│Enrollments │
└───────┘              │     └────────────┘
    │                  │
    │ 1:N              │ N:M
    ▼                  ▼
┌─────────┐       ┌──────────┐
│Students │       │ Faculty  │
└─────────┘       └──────────┘
    │                  │
    │ 1:N              │ 1:N
    ▼                  ▼
┌──────────┐      ┌────────────┐
│Attendance│      │Assignments │
└──────────┘      └────────────┘
    │
    │ 1:N
    ▼
┌────────┐
│ Grades │
└────────┘
```

### Multi-Tenancy Implementation
Every entity table includes:
```sql
university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
deleted_at TIMESTAMPTZ NULL  -- Soft deletes
```

**Global Middleware** (Laravel):
```php
// app/Http/Middleware/ResolveTenantContext.php
public function handle(Request $request, Closure $next) {
    $universityId = auth()->user()->university_id;
    
    // Inject into all queries automatically
    Model::addGlobalScope('university', function ($query) use ($universityId) {
        $query->where('university_id', $universityId);
    });
    
    return $next($request);
}
```

---

## 🔐 AUTHENTICATION & AUTHORIZATION

### Authentication Flow (OAuth2-like with JWT)

#### 1. Login (POST /api/auth/login)
```json
Request:
{
  "email": "student@university.edu",
  "password": "SecurePass123!",
  "portal": "student"
}

Response (200):
{
  "access_token": "eyJhbGc...",  // RS256 JWT, 15 min expiry
  "refresh_token": "uuid-v4",     // Stored in DB, 7 day expiry
  "token_type": "Bearer",
  "expires_in": 900,
  "user": {
    "id": "uuid",
    "email": "student@university.edu",
    "roles": ["student"],
    "university_id": "uuid",
    "college_id": "uuid"
  }
}
```

#### 2. JWT Claims Structure
```json
{
  "sub": "user-uuid",
  "email": "user@domain.com",
  "role": "student",
  "university_id": "uuid",
  "college_id": "uuid",
  "permissions": ["read:grades", "submit:assignments"],
  "iat": 1698264000,
  "exp": 1698264900,
  "jti": "unique-token-id"
}
```

#### 3. Token Refresh (POST /api/auth/refresh)
```json
Request:
{
  "refresh_token": "uuid-v4"
}

Response (200):
{
  "access_token": "new-jwt",
  "expires_in": 900
}
```

#### 4. Logout (POST /api/auth/logout)
- Invalidate refresh token in DB
- Add JWT `jti` to Redis blacklist (expires with token TTL)

### Role Hierarchy (14 roles)
```yaml
bitflow_owner:        # Platform superadmin (Bitflow company)
  level: 1
  scope: global
  can_create: [university_owner]
  
university_owner:     # University CEO
  level: 2
  scope: university
  can_create: [super_admin, principal, college_admin]
  
super_admin:          # University IT/Operations
  level: 3
  scope: university
  same_powers_as: university_owner
  
principal:            # College head
  level: 4
  scope: college
  can_create: [faculty, student, college_admin, admission_admin]
  
college_admin:        # College operations manager
  level: 4
  scope: college
  same_powers_as: principal
  
super_academics:      # University-level curriculum head
  level: 3
  scope: university
  focus: [courses, programs, academic_standards]
  
faculty:              # Teachers
  level: 5
  scope: college/department
  permissions: [grade_students, take_attendance, create_assignments]
  
student:              # Enrolled learners
  level: 6
  scope: college
  permissions: [view_grades, submit_assignments, view_timetable]
  
parent:               # Student guardians
  level: 7
  scope: student (child)
  permissions: [view_child_grades, view_child_attendance, contact_faculty]
  
admission_admin:      # Admissions office
  level: 4
  scope: college
  permissions: [create_students, manage_applications, bulk_admit]
  
super_accountant:     # University CFO
  level: 3
  scope: university
  permissions: [view_all_finances, approve_expenses, generate_reports]
  
college_accounts_admin: # College accountant
  level: 4
  scope: college
  permissions: [manage_college_fees, track_expenses, reconcile_payments]
  
college_fee_admin:    # Fee collection
  level: 5
  scope: college
  permissions: [record_payments, send_reminders, generate_receipts]
  
super_nt_manager:     # Non-teaching staff manager
  level: 3
  scope: university
  permissions: [manage_staff, track_attendance, process_payroll]
```

### Permission Matrix (Sample)
| Action | Bitflow Owner | Univ Owner | Super Admin | Principal | Faculty | Student |
|--------|--------------|------------|-------------|-----------|---------|---------|
| Create University | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Create College | ✅ | ✅ | ✅ | ❌ | ❌ | ❌ |
| Manage Courses | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ |
| Grade Students | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| View Own Grades | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| Submit Assignments | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

---

## 🎨 MASTER DESIGN SYSTEM

### Color Palette
```css
/* Primary (Blue) */
--color-primary-50:  #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-500: #3b82f6;  /* Main brand */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-900: #1e3a8a;

/* Neutral (Slate) */
--color-neutral-50:  #f8fafc;
--color-neutral-100: #f1f5f9;
--color-neutral-500: #64748b;
--color-neutral-700: #334155;
--color-neutral-900: #0f172a;

/* Semantic Colors */
--color-success: #10b981;  /* Green-500 */
--color-warning: #f59e0b;  /* Amber-500 */
--color-error:   #ef4444;  /* Red-500 */
--color-info:    #06b6d4;  /* Cyan-500 */
```

### Typography
```css
/* Font Family */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;

/* Font Sizes */
--text-xs:   0.75rem;   /* 12px */
--text-sm:   0.875rem;  /* 14px */
--text-base: 1rem;      /* 16px */
--text-lg:   1.125rem;  /* 18px */
--text-xl:   1.25rem;   /* 20px */
--text-2xl:  1.5rem;    /* 24px */
--text-3xl:  1.875rem;  /* 30px */
--text-4xl:  2.25rem;   /* 36px */

/* Line Heights */
--leading-tight:  1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;
```

### Spacing Scale (8px base)
```css
--space-1:  0.25rem;  /* 4px */
--space-2:  0.5rem;   /* 8px */
--space-3:  0.75rem;  /* 12px */
--space-4:  1rem;     /* 16px */
--space-6:  1.5rem;   /* 24px */
--space-8:  2rem;     /* 32px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

### Component Primitives

#### 1. Button
```tsx
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

// Usage
<Button variant="primary" size="md" loading={isSubmitting}>
  Submit Assignment
</Button>
```

#### 2. DataTable
```tsx
interface DataTableProps<T> {
  columns: Array<{
    key: keyof T;
    label: string;
    sortable?: boolean;
    render?: (value: any, row: T) => React.ReactNode;
  }>;
  data: T[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
  };
  onSort?: (key: keyof T, direction: 'asc' | 'desc') => void;
}
```

#### 3. Form Field
```tsx
interface FormFieldProps {
  label: string;
  name: string;
  type: 'text' | 'email' | 'password' | 'number' | 'date' | 'select' | 'textarea';
  required?: boolean;
  error?: string;
  options?: Array<{ value: string; label: string }>;  // For select
}
```

---

## 🔗 API GATEWAY & ROUTING

### Base URLs (Development)
```
Bitflow Admin:       http://localhost:3006/api/*
University Owner:    http://localhost:3001/api/*
Super Admin:         http://localhost:3002/api/*
Principal:           http://localhost:3003/api/*
College Admin:       http://localhost:3004/api/*
Super Academics:     http://localhost:3005/api/*
Faculty:             http://localhost:3007/api/*
Student:             http://localhost:3008/api/*
Parent:              http://localhost:3009/api/*
Admission Admin:     http://localhost:3010/api/*
Super Accountant:    http://localhost:3011/api/*
College Accounts:    http://localhost:3012/api/*
College Fee Admin:   http://localhost:3013/api/*
Super NT Manager:    http://localhost:3014/api/*

Backend (Shared):    http://localhost:8000/api/*
```

### API Gateway (Production)
**Nginx Reverse Proxy** or **AWS API Gateway**
```nginx
upstream backend {
    server backend:8000;
}

server {
    listen 443 ssl http2;
    server_name api.bitflowlms.com;
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=100r/m;
    limit_req zone=api burst=20 nodelay;
    
    # CORS
    add_header Access-Control-Allow-Origin $http_origin;
    add_header Access-Control-Allow-Credentials true;
    
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
    }
}
```

---

## 📊 GLOBAL FEATURES ACROSS ALL PORTALS

### 1. Dashboard (Every Portal)
- **Role-specific KPIs**: Student sees grades, Faculty sees classes, Admin sees finances
- **Recent activity feed**: Last 10 actions (audit log entries)
- **Quick actions**: Context-aware shortcuts
- **Notifications center**: Real-time alerts (WebSocket)

### 2. Profile Management
- **Avatar upload**: S3 signed URLs, max 5MB, JPEG/PNG only
- **Contact info**: Email, phone, address (with validation)
- **Password change**: Old password verification + strength meter
- **2FA setup**: TOTP (Google Authenticator) - optional but recommended

### 3. Notifications System
- **Channels**: In-app (bell icon), Email, SMS (Twilio), Push (FCM)
- **Types**: System alerts, Deadlines, Grade updates, Announcements
- **Preferences**: User can enable/disable per channel per type
- **Delivery**: Queue jobs, retry with exponential backoff

### 4. File Management
- **Upload**: Drag-and-drop, max 100MB per file
- **Storage**: S3 buckets with presigned URLs (15 min expiry)
- **Security**: Virus scan (ClamAV), filename sanitization
- **Organization**: Nested folders, tags, search

### 5. Audit Logging
**Every mutation tracked**:
```json
{
  "id": "uuid",
  "user_id": "uuid",
  "action": "UPDATE",
  "entity_type": "Student",
  "entity_id": "uuid",
  "changes": {
    "grade": {"old": "B", "new": "A"}
  },
  "ip_address": "192.168.1.100",
  "user_agent": "Mozilla/5.0...",
  "timestamp": "2025-10-25T10:30:00Z"
}
```

### 6. Search (Global)
- **ElasticSearch** powered full-text search
- **Indexed entities**: Students, Faculty, Courses, Documents
- **Filters**: By type, date range, status
- **Permissions**: Only show results user can access

---

## 🧪 TESTING STRATEGY

### 1. Unit Tests
- **Coverage Target**: 80%+
- **Framework**: PHPUnit (backend), Vitest (frontend)
- **Focus**: Business logic, validators, formatters
- **Example**:
```php
public function test_student_enrollment_creates_audit_log() {
    $student = Student::factory()->create();
    $course = Course::factory()->create();
    
    $enrollment = $student->enrollIn($course);
    
    $this->assertDatabaseHas('audit_logs', [
        'entity_type' => 'Enrollment',
        'entity_id' => $enrollment->id,
        'action' => 'CREATE'
    ]);
}
```

### 2. Integration Tests
- **Database**: Use Docker PostgreSQL container (reset between tests)
- **API Tests**: Laravel HTTP tests with `RefreshDatabase`
- **External Services**: Mock Stripe, Twilio, AWS S3 using interfaces

### 3. E2E Tests
- **Framework**: Playwright (cross-browser)
- **Critical Paths**:
  1. Login → View Dashboard → Logout
  2. Faculty: Grade student → Student sees grade notification
  3. Admin: Create fee → Student pays → Receipt generated
  4. Admission: Bulk import 100 students (performance test)

### 4. Performance Tests
- **Tool**: Apache JMeter or k6
- **Scenarios**:
  - 1,000 concurrent logins (< 2s response time)
  - 10,000 grade submissions/hour
  - Dashboard load under 500ms (P95)

---

## 🚀 DEPLOYMENT STRATEGY

### CI/CD Pipeline (GitHub Actions)
```yaml
name: Deploy Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Run Tests
        run: |
          composer install
          php artisan test --coverage --min=80
  
  security:
    runs-on: ubuntu-latest
    steps:
      - name: OWASP Dependency Check
        run: dependency-check --scan . --format JSON
      - name: Snyk Security Scan
        run: snyk test --severity-threshold=high
  
  build:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - name: Build Docker Image
        run: docker build -t bitflow-backend:${{ github.sha }} .
      - name: Push to Registry
        run: docker push bitflow-backend:${{ github.sha }}
  
  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to Kubernetes
        run: |
          kubectl set image deployment/backend \
            backend=bitflow-backend:${{ github.sha }}
          kubectl rollout status deployment/backend
```

### Blue-Green Deployment
1. **Blue** (current production) handles all traffic
2. Deploy **Green** (new version) to separate pods
3. Run smoke tests on Green
4. Switch load balancer to Green
5. Keep Blue running for 1 hour (rollback safety)
6. Terminate Blue if no issues

---

## 📁 FILES IN THIS BRAIN

### Top-Level Files (13)
1. `README.md` - This file (master specification)
2. `manifest.json` - Complete file inventory
3. `master_db_schema.sql` - Full database DDL
4. `master_api_gateway.yaml` - OpenAPI gateway spec
5. `master_theme_design.md` - UI/UX design system
6. `master_auth_system.md` - Authentication details
7. `master_roles_permissions.yaml` - RBAC matrix
8. `global_build_guide.md` - Build instructions
9. `mismatch_detector.md` - Sync validation tool
10. `global_security_compliance.md` - Security checklist
11. `global_observability.md` - Logging/monitoring
12. `global_deployment.md` - Infrastructure guide
13. `master_er_diagram.txt` - Database relationships

### Per-Portal Files (14 portals × 13 files = 182)
Each portal contains:
1. `README.md` - Portal overview
2. `features.md` - Feature list
3. `pages.md` - Page-by-page specs
4. `api_spec.yaml` - API endpoints
5. `db_schema.sql` - Portal-specific tables
6. `frontend_guide.md` - React components
7. `backend_guide.md` - Controllers/services
8. `integration_contracts.md` - Cross-portal APIs
9. `auth_and_permissions.md` - Role permissions
10. `security_checklist.md` - Security controls
11. `build_steps.md` - Build instructions
12. `tests.md` - Test cases
13. `sync_checklist.json` - Frontend-backend sync points

---

## 🎯 PRIORITY ACTION PLAN

### Phase 1: Foundation (Week 1-2)
1. ✅ Setup master database schema
2. ✅ Implement authentication system (JWT + refresh tokens)
3. ✅ Create base API gateway routing
4. ✅ Build shared UI component library
5. ⏳ Setup CI/CD pipeline skeleton

### Phase 2: Core Portals (Week 3-6)
6. ⏳ Bitflow Admin portal (university creation)
7. ⏳ University Owner portal (college management)
8. ⏳ Student portal (grades, assignments, timetable)
9. ⏳ Faculty portal (grade entry, attendance)
10. ⏳ Principal portal (college dashboard, approvals)

### Phase 3: Financial (Week 7-8)
11. ⏳ Fee structure & payment processing
12. ⏳ Accounting ledger & reports
13. ⏳ Integration with payment gateways

### Phase 4: Operations (Week 9-10)
14. ⏳ Admission workflow & bulk import
15. ⏳ HR/Payroll for staff
16. ⏳ Notifications & communication tools

### Phase 5: Polish (Week 11-12)
17. ⏳ E2E tests for critical paths
18. ⏳ Performance optimization (caching, indexing)
19. ⏳ Security audit (penetration testing)
20. ⏳ Production deployment & monitoring

---

## 🚨 RED FLAGS (Must Not Ignore)

### 1. **Database Performance**
❌ **Danger**: Missing indexes on foreign keys  
✅ **Fix**: Every FK must have an index
```sql
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
```

### 2. **Authentication**
❌ **Danger**: Storing plaintext passwords  
✅ **Fix**: Bcrypt with cost factor 12+
```php
Hash::make($password, ['rounds' => 12]);
```

### 3. **Multi-Tenancy**
❌ **Danger**: Forgetting to filter by `university_id`  
✅ **Fix**: Global scope middleware (auto-inject)

### 4. **File Uploads**
❌ **Danger**: Storing files in database as BLOBs  
✅ **Fix**: S3 presigned URLs, store only paths

### 5. **Money Calculations**
❌ **Danger**: Using FLOAT for currency  
✅ **Fix**: `NUMERIC(12,2)` in DB, integer cents in code

### 6. **Race Conditions**
❌ **Danger**: Concurrent grade updates  
✅ **Fix**: Optimistic locking with `version` column

### 7. **API Rate Limiting**
❌ **Danger**: No throttling → DDoS vulnerability  
✅ **Fix**: Laravel throttle middleware (60 req/min)

### 8. **CORS**
❌ **Danger**: `Access-Control-Allow-Origin: *`  
✅ **Fix**: Whitelist specific frontend domains

### 9. **Error Handling**
❌ **Danger**: Exposing stack traces in production  
✅ **Fix**: Generic errors to users, detailed logs to Sentry

### 10. **Secrets Management**
❌ **Danger**: Hardcoded API keys in `.env`  
✅ **Fix**: AWS Secrets Manager or HashiCorp Vault

---

## 📞 SUPPORT & ESCALATION

### Development Team Contacts
- **Backend Lead**: backend-lead@bitflow.com
- **Frontend Lead**: frontend-lead@bitflow.com
- **DevOps**: devops@bitflow.com
- **Security**: security@bitflow.com

### Documentation Updates
This brain is a **living document**. Update after:
- New feature implementation
- Bug fixes that change contracts
- Performance optimizations
- Security patches

**Last Updated**: October 25, 2025  
**Next Review**: November 25, 2025
