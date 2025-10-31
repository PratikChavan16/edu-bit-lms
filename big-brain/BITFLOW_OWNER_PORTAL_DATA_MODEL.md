# Bitflow Owner Portal - Data Model & Database Design

_Last updated: October 30, 2025_  
_Portal: Bitflow Owner Portal (bitflow-admin)_  
_Database Source: `brain/master_db_schema.sql` v2.0_  
_Documentation Source: `big-brain/BITFLOW_OWNER_PORTAL_DOCUMENTATION.md`_

---

## 1. Portal Overview & Data Scope

**Portal Name**: Bitflow Owner Portal  
**Portal Code**: `bitflow-admin`  
**Access URL**: `http://localhost:3001`  
**Primary Role**: `bitflow_owner` (Level 1 - Global Scope)  
**Database Context**: Full cross-tenant access with God Mode privileges

### Data Access Characteristics
- **Scope**: Platform-wide (bypasses `university_id` scoping)
- **Tenancy**: Multi-tenant with unrestricted access
- **Authorization**: God Mode - no row-level restrictions apply
- **Audit Trail**: All actions logged with `god_mode_context` flag

---

## 2. Core Data Entities & Relationships

### 2.1 Identity & Access Layer

#### **Users Table** (`users`)
**Purpose**: Master identity store for all platform actors  
**Bitflow Owner Access**: Full CRUD on all users across all tenants  

**Key Columns for Portal**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
username            VARCHAR(50) UNIQUE
email               VARCHAR(255) UNIQUE
password_hash       VARCHAR(255)
first_name          VARCHAR(100)
last_name           VARCHAR(100)
full_name           VARCHAR(255) GENERATED (first_name || ' ' || last_name)
phone               VARCHAR(20)
photo_url           TEXT
status              VARCHAR(20) CHECK (status IN ('active','inactive','suspended','deleted'))
email_verified_at   TIMESTAMPTZ
last_login_at       TIMESTAMPTZ
two_factor_enabled  BOOLEAN DEFAULT FALSE
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
deleted_at          TIMESTAMPTZ (soft delete)
```

**Portal Operations**:
- **Dashboard**: Count total users across platform, track active sessions
- **Users Page** (`/users`): 
  - Display Bitflow Admins and University Owners
  - Create Bitflow Admin accounts
  - View all user activity logs
  - Reset passwords for any user
  - Activate/deactivate/suspend accounts
- **God Mode**: Access ANY user record regardless of `university_id`

**Indexes Used**:
- `idx_users_university` - For tenant filtering (when needed)
- `idx_users_email` - Email uniqueness lookup
- `idx_users_status` - Active user queries

**Relationships**:
- `1:N` with `role_user` (user can have multiple roles)
- `1:N` with `sessions` (user login sessions)
- `1:1` with `students`, `faculty`, `staff` (persona extensions)
- `1:N` with `audit_logs` (tracks user actions)

---

#### **Roles Table** (`roles`)
**Purpose**: Hierarchical role definitions  
**Bitflow Owner Access**: Read-only reference; create/modify via API

**Key Roles for Portal**:
| Role Slug | Name | Level | Scope | Shown in Portal |
|---|---|---|---|---|
| `bitflow_owner` | Bitflow Owner | 1 | global | Yes - Platform admin |
| `bitflow_admin` | Bitflow Admin | 1 | global | Yes - Created by Owner |
| `university_owner` | University Owner | 2 | university | Yes - Read-only view |
| `super_admin` | Super Admin | 3 | university | No - Managed in Univ Hub |
| `principal` | Principal | 4 | college | No - Managed in College Hub |
| `college_admin` | College Admin | 4 | college | No - Managed in College Hub |
| `faculty` | Faculty | 5 | department | No - Managed in College Hub |
| `student` | Student | 6 | college | No - Managed in College Hub |

**Portal Operations**:
- **Users Page**: Filter users by role (Bitflow Owner/Admin/University Owner)
- **Permissions Management**: View role-permission mappings
- **Hierarchy Display**: Show role levels in user management

**Relationships**:
- `N:M` with `users` via `role_user`
- `N:M` with `permissions` via `role_permissions`

---

#### **Role_User Table** (`role_user`)
**Purpose**: User-role assignment junction  
**Bitflow Owner Access**: Full CRUD for role assignments

**Key Columns**:
```sql
id              UUID PRIMARY KEY
user_id         UUID NOT NULL (FK → users)
role_id         UUID NOT NULL (FK → roles)
assigned_at     TIMESTAMPTZ
assigned_by     UUID (FK → users) - Tracks who assigned
expires_at      TIMESTAMPTZ (optional temporary roles)
UNIQUE(user_id, role_id)
```

**Portal Operations**:
- **Users Page**: Assign/revoke roles for Bitflow Admins
- **Audit**: Track role changes with `assigned_by` provenance

---

#### **Sessions Table** (`sessions`)
**Purpose**: Active session & refresh token management  
**Bitflow Owner Access**: Monitor all sessions, revoke suspicious logins

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
user_id             UUID NOT NULL (FK → users)
refresh_token       UUID UNIQUE
ip_address          INET
user_agent          TEXT
last_activity_at    TIMESTAMPTZ
expires_at          TIMESTAMPTZ
```

**Portal Operations**:
- **Dashboard**: Display "Active Sessions" count
- **Security Monitoring**: View login IPs and user agents
- **Session Management**: Force logout by deleting session

---

### 2.2 Organizational Structure Layer

#### **Universities Table** (`universities`)
**Purpose**: Root tenant entities  
**Bitflow Owner Access**: Full CRUD - Create, configure, monitor, delete universities

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
name                VARCHAR(255) NOT NULL
slug                VARCHAR(255) UNIQUE (subdomain identifier)
domain              VARCHAR(255) UNIQUE (custom domain)
email               VARCHAR(255)
phone               VARCHAR(20)
address             TEXT
established_year    INTEGER
timezone            VARCHAR(50) DEFAULT 'UTC'
status              VARCHAR(20) CHECK (status IN ('setup','live','suspended','archived'))
storage_quota_gb    INTEGER DEFAULT 1000
storage_used_mb     BIGINT DEFAULT 0
branding            JSONB {primary_color, logo_url, favicon_url}
settings            JSONB (feature flags, configurations)
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
deleted_at          TIMESTAMPTZ
```

**Portal Operations**:
- **Dashboard**: 
  - Count total universities
  - Show active vs. inactive vs. trial
  - Track storage usage: `SUM(storage_used_mb) / SUM(storage_quota_gb * 1024)`
- **Universities Page** (`/universities`):
  - List all university tenants
  - Create university with branding & quota
  - Edit university details
  - Monitor status (Live/Suspended)
  - View storage usage percentage
  - Delete university (archive with confirmation)
- **University Hub** (`/universities/{id}`):
  - University overview dashboard
  - Access Management Team, Colleges, Settings

**Branding JSONB Structure**:
```json
{
  "primary_color": "#A51C30",
  "secondary_color": "#000000",
  "logo_url": "https://cdn.bitflow.edu/harvard/logo.png",
  "favicon_url": "https://cdn.bitflow.edu/harvard/favicon.ico"
}
```

**Settings JSONB Structure**:
```json
{
  "features": {
    "enable_hostel": true,
    "enable_transport": true,
    "enable_library": true
  },
  "notifications": {
    "sms_enabled": true,
    "email_enabled": true
  }
}
```

**Indexes**:
- `idx_universities_slug` - Subdomain lookups
- `idx_universities_status` - Active university filtering

**Relationships**:
- `1:N` with `colleges`
- `1:N` with `users` (all users belong to a university)
- `1:N` with `academic_years`
- `1:N` with `fee_structures`, `subscriptions`, `invoices`

---

#### **Colleges Table** (`colleges`)
**Purpose**: College-level subdivisions within universities  
**Bitflow Owner Access**: Full CRUD across all universities

**Key Columns**:
```sql
id                      UUID PRIMARY KEY
university_id           UUID NOT NULL (FK → universities)
name                    VARCHAR(255)
code                    VARCHAR(50) UNIQUE per university
type                    VARCHAR(50) (Engineering, Medical, Arts, etc.)
email                   VARCHAR(255)
phone                   VARCHAR(20)
address                 TEXT
established_year        INTEGER
status                  VARCHAR(20) CHECK (status IN ('active','inactive','suspended'))
capacity                INTEGER (max student enrollment)
current_enrollment      INTEGER DEFAULT 0
accreditation           JSONB {body, valid_until, certificate_url}
created_at              TIMESTAMPTZ
updated_at              TIMESTAMPTZ
deleted_at              TIMESTAMPTZ
UNIQUE(university_id, code)
```

**Portal Operations**:
- **Dashboard**: Count total colleges across all universities
- **Colleges Page** (`/colleges`):
  - Cross-university view of all colleges
  - Filter by university
  - Search by name/code
  - View college statistics (departments, students, faculty)
- **University Hub → Colleges** (`/universities/{id}/colleges`):
  - List colleges under specific university
  - Create new college
  - Navigate to College Hub
- **College Hub** (`/universities/{id}/colleges/{collegeId}`):
  - 13 management modules (Leadership, Departments, Faculty, etc.)

**Accreditation JSONB**:
```json
{
  "body": "NAAC",
  "grade": "A++",
  "valid_until": "2027-12-31",
  "certificate_url": "https://cdn.bitflow.edu/college/naac_cert.pdf"
}
```

**Indexes**:
- `idx_colleges_university` - University scoped queries
- `idx_colleges_status` - Active college filtering

**Relationships**:
- `N:1` with `universities`
- `1:N` with `departments`
- `1:N` with `students`, `faculty`, `staff`
- `1:N` with `fee_structures`

---

#### **Departments Table** (`departments`)
**Purpose**: Academic department organization  
**Bitflow Owner Access**: Full CRUD; create without HOD initially

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NOT NULL (FK → colleges)
name                VARCHAR(255)
code                VARCHAR(50) UNIQUE per college
head_faculty_id     UUID (FK → faculty) NULLABLE
email               VARCHAR(255)
phone               VARCHAR(20)
floor_location      VARCHAR(100)
status              VARCHAR(20) CHECK (status IN ('active','inactive'))
created_at          TIMESTAMPTZ
updated_at          TIMESTAMPTZ
deleted_at          TIMESTAMPTZ
UNIQUE(college_id, code)
```

**Portal Operations**:
- **College Hub → Departments** (`/universities/{id}/colleges/{collegeId}/departments`):
  - Create department (HOD optional to avoid circular dependency)
  - Assign HOD after faculty are added
  - View department statistics
  - Edit department details

**Workflow**:
1. Create department (CSE) - Leave `head_faculty_id` NULL
2. Add faculty members to CSE department
3. Edit CSE department - Assign senior faculty as HOD

**Indexes**:
- `idx_departments_university` - Tenant filtering
- `idx_departments_college` - College scoped queries

**Relationships**:
- `N:1` with `colleges`, `universities`
- `1:N` with `courses`, `faculty`, `students`
- `1:1` with `faculty` (HOD reference)

---

#### **Courses Table** (`courses`)
**Purpose**: Master course catalog  
**Bitflow Owner Access**: View all courses across platform

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NOT NULL (FK → colleges)
department_id       UUID NOT NULL (FK → departments)
code                VARCHAR(50) UNIQUE per department
name                VARCHAR(255)
description         TEXT
credits             INTEGER
level               VARCHAR(50) (undergraduate, postgraduate)
semester            VARCHAR(20) (Fall, Spring, Both)
prerequisites       JSONB (array of course IDs)
syllabus_url        TEXT
status              VARCHAR(20) CHECK (status IN ('active','inactive','archived'))
UNIQUE(department_id, code)
```

**Portal Operations**:
- **College Hub → Curriculum** (`/universities/{id}/colleges/{collegeId}/curriculum`):
  - Create courses
  - Assign faculty
  - Upload syllabus
  - Track course enrollment

**Prerequisites JSONB**:
```json
["uuid-of-prereq-course-1", "uuid-of-prereq-course-2"]
```

**Relationships**:
- `N:1` with `departments`, `colleges`, `universities`
- `1:N` with `enrollments`, `assignments`, `timetables`

---

#### **Academic_Years Table** (`academic_years`)
**Purpose**: Academic calendar management  
**Bitflow Owner Access**: View calendars across all universities

**Key Columns**:
```sql
id              UUID PRIMARY KEY
university_id   UUID NOT NULL (FK → universities)
name            VARCHAR(100) (e.g., '2025-2026')
start_date      DATE
end_date        DATE
is_current      BOOLEAN DEFAULT FALSE
status          VARCHAR(20) CHECK (status IN ('upcoming','active','completed'))
UNIQUE(university_id, name)
```

**Portal Operations**:
- **University Hub → Settings**: Configure academic years
- **Analytics**: Track enrollments by academic year

**Relationships**:
- `N:1` with `universities`
- `1:N` with `enrollments`, `timetables`, `fee_structures`

---

### 2.3 Academic Operations Layer

#### **Students Table** (`students`)
**Purpose**: Student profile extension of users  
**Bitflow Owner Access**: View all students across platform

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
user_id             UUID UNIQUE NOT NULL (FK → users)
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NOT NULL (FK → colleges)
department_id       UUID (FK → departments) NULLABLE
admission_number    VARCHAR(50) UNIQUE
admission_date      DATE
course              VARCHAR(100) (B.Tech Computer Science)
year                INTEGER CHECK (year BETWEEN 1 AND 6)
section             VARCHAR(10)
roll_number         VARCHAR(50)
blood_group         VARCHAR(5)
date_of_birth       DATE
gender              VARCHAR(20)
nationality         VARCHAR(100)
emergency_contact   JSONB {name, relation, phone}
guardian_name       VARCHAR(255)
guardian_phone      VARCHAR(20)
guardian_email      VARCHAR(255)
status              VARCHAR(20) CHECK (status IN ('active','suspended','graduated','dropped'))
```

**Portal Operations**:
- **Dashboard**: Count total students across platform
- **College Hub → Students**: 
  - Manage student records
  - Bulk upload students
  - Track enrollment status
  - View academic records

**Emergency Contact JSONB**:
```json
{
  "name": "Mrs. Sunita Mehta",
  "relation": "Mother",
  "phone": "+91 9876543210"
}
```

**Relationships**:
- `1:1` with `users`
- `N:1` with `universities`, `colleges`, optional `departments`
- `1:N` with `enrollments`, `attendance`, `fee_payments`, `submissions`

---

#### **Faculty Table** (`faculty`)
**Purpose**: Faculty profile extension of users  
**Bitflow Owner Access**: View all faculty across platform

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
user_id             UUID UNIQUE NOT NULL (FK → users)
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NOT NULL (FK → colleges)
department_id       UUID (FK → departments) NULLABLE
employee_id         VARCHAR(50) UNIQUE
designation         VARCHAR(100) (Professor, Associate Prof, Assistant Prof)
qualification       VARCHAR(255) (Ph.D. in Computer Science)
specialization      TEXT
experience_years    INTEGER
employment_type     VARCHAR(50) (full-time, part-time, visiting)
joining_date        DATE
salary              NUMERIC(12,2) (encrypted in practice)
status              VARCHAR(20) CHECK (status IN ('active','on-leave','terminated'))
```

**Portal Operations**:
- **College Hub → Academic Staff**: 
  - Manage faculty profiles
  - Assign to departments
  - Track qualifications

**Relationships**:
- `1:1` with `users`
- `N:1` with `universities`, `colleges`, optional `departments`
- `1:N` with `leaves`, `payroll_records`
- Referenced by `departments.head_faculty_id` (HOD)

---

#### **Staff Table** (`staff`)
**Purpose**: Non-teaching staff profiles  
**Bitflow Owner Access**: View all staff across platform

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
user_id             UUID UNIQUE NOT NULL (FK → users)
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NULLABLE (NULL for university-level staff)
employee_id         VARCHAR(50) UNIQUE
designation         VARCHAR(100)
department_name     VARCHAR(100) (Administration, IT Support, etc.)
employment_type     VARCHAR(50)
joining_date        DATE
salary              NUMERIC(12,2)
status              VARCHAR(20) CHECK (status IN ('active','on-leave','terminated'))
```

**Portal Operations**:
- **University Hub → Management Team**: Create university-level staff (Super Admin, etc.)
- **College Hub → Administrative Staff**: Create college-level admin staff
- **College Hub → Non-Teaching Staff**: Create support staff (lab assistants, etc.)

**Relationships**:
- `1:1` with `users`
- `N:1` with `universities`, optional `colleges`
- `1:N` with `leaves`, `payroll_records`

---

### 2.4 Financial Management Layer

#### **Fee_Structures Table** (`fee_structures`)
**Purpose**: Tuition/fee blueprints per academic year  
**Bitflow Owner Access**: View fee structures across all universities

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NOT NULL (FK → colleges)
academic_year_id    UUID NOT NULL (FK → academic_years)
name                VARCHAR(255) (B.Tech First Year Fees)
course              VARCHAR(100)
year                INTEGER
amount              NUMERIC(12,2)
currency            VARCHAR(3) DEFAULT 'USD'
installments        INTEGER DEFAULT 1
due_dates           JSONB (array of dates)
late_fee_per_day    NUMERIC(8,2) DEFAULT 0
components          JSONB {tuition: 10000, library: 500, lab: 1500}
status              VARCHAR(20) CHECK (status IN ('active','inactive'))
```

**Portal Operations**:
- **College Hub → Fees**: Configure fee structures
- **Billing Analytics**: Track revenue by fee type

**Components JSONB**:
```json
{
  "tuition": 10000,
  "library": 500,
  "lab": 1500,
  "sports": 300,
  "exam": 200
}
```

**Due Dates JSONB**:
```json
["2025-08-15", "2025-12-15", "2026-04-15"]
```

**Relationships**:
- `N:1` with `universities`, `colleges`, `academic_years`
- `1:N` with `fee_payments`, `invoices`

---

#### **Fee_Payments Table** (`fee_payments`)
**Purpose**: Student payment transaction ledger  
**Bitflow Owner Access**: View all payments across platform

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
student_id          UUID NOT NULL (FK → students)
fee_structure_id    UUID NOT NULL (FK → fee_structures)
amount_paid         NUMERIC(12,2)
payment_date        TIMESTAMPTZ
payment_method      VARCHAR(50) (online, cash, cheque, card)
transaction_id      VARCHAR(255) UNIQUE
receipt_number      VARCHAR(100) UNIQUE
installment_number  INTEGER
late_fee            NUMERIC(8,2) DEFAULT 0
remarks             TEXT
status              VARCHAR(20) CHECK (status IN ('pending','completed','failed','refunded'))
recorded_by         UUID (FK → users)
```

**Portal Operations**:
- **Billing → Revenue**: Track total payments
- **Analytics**: Revenue trends, payment method analysis
- **College Hub → Fees**: View student payment history

**Relationships**:
- `N:1` with `universities`, `students`, `fee_structures`
- `N:1` with `users` (recorded_by)

---

#### **Invoices Table** (`invoices`)
**Purpose**: Generic billing artifacts (students, vendors)  
**Bitflow Owner Access**: View/manage all invoices

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
invoice_number      VARCHAR(100) UNIQUE
entity_type         VARCHAR(50) (student, vendor, other)
entity_id           UUID
issue_date          DATE
due_date            DATE
total_amount        NUMERIC(12,2)
tax_amount          NUMERIC(12,2) DEFAULT 0
discount_amount     NUMERIC(12,2) DEFAULT 0
paid_amount         NUMERIC(12,2) DEFAULT 0
balance_amount      NUMERIC(12,2) GENERATED (total - paid - discount + tax)
line_items          JSONB (array of {description, quantity, unit_price, amount})
status              VARCHAR(20) CHECK (status IN ('unpaid','partially_paid','paid','cancelled'))
```

**Portal Operations**:
- **Billing → Invoices**: 
  - View all invoices
  - Filter by status
  - Mark as paid
  - Download PDF

**Line Items JSONB**:
```json
[
  {
    "description": "Tuition Fee - Fall 2025",
    "quantity": 1,
    "unit_price": 10000,
    "amount": 10000
  },
  {
    "description": "Lab Fee",
    "quantity": 1,
    "unit_price": 1500,
    "amount": 1500
  }
]
```

**Relationships**:
- `N:1` with `universities`
- Polymorphic: `entity_type` + `entity_id` references students/vendors

---

#### **Ledger_Entries Table** (`ledger_entries`)
**Purpose**: Double-entry bookkeeping for all financial transactions  
**Bitflow Owner Access**: View complete financial ledger

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NULLABLE (FK → colleges)
transaction_date    DATE
account_type        VARCHAR(50) (income, expense, asset, liability)
category            VARCHAR(100) (tuition_fees, salary, infrastructure)
debit_amount        NUMERIC(12,2) DEFAULT 0
credit_amount       NUMERIC(12,2) DEFAULT 0
description         TEXT
reference_type      VARCHAR(50) (fee_payment, expense, payroll)
reference_id        UUID
created_by          UUID (FK → users)
CHECK: (debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0)
```

**Portal Operations**:
- **Analytics → Financial Reports**: 
  - Income statements
  - Balance sheets
  - Cash flow analysis
- **Audit**: Track all financial transactions

**Relationships**:
- `N:1` with `universities`, optional `colleges`
- Polymorphic: `reference_type` + `reference_id`

---

#### **Expenses Table** (`expenses`)
**Purpose**: Expense tracking and approval  
**Bitflow Owner Access**: Monitor all university expenses

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NULLABLE (FK → colleges)
category_id         UUID NOT NULL (FK → expense_categories)
expense_date        DATE
amount              NUMERIC(12,2)
vendor_name         VARCHAR(255)
invoice_number      VARCHAR(100)
description         TEXT
attachment_urls     JSONB (array of receipt/bill URLs)
payment_method      VARCHAR(50)
payment_status      VARCHAR(20) CHECK (payment_status IN ('pending','paid','cancelled'))
approved_by         UUID (FK → users)
approved_at         TIMESTAMPTZ
recorded_by         UUID (FK → users)
```

**Portal Operations**:
- **Analytics**: Track expenses by category
- **College Hub → Fees**: View college expenses

**Attachment URLs JSONB**:
```json
[
  "https://cdn.bitflow.edu/invoices/receipt_001.pdf",
  "https://cdn.bitflow.edu/invoices/bill_002.pdf"
]
```

**Relationships**:
- `N:1` with `universities`, optional `colleges`, `expense_categories`
- `N:1` with `users` (approved_by, recorded_by)

---

### 2.5 Billing & Subscriptions (SaaS Layer)

**Note**: These tables are implied by the portal functionality but may exist outside the main schema or as extensions.

#### **Subscriptions (Implied)**
**Purpose**: University subscription plans  
**Bitflow Owner Access**: Full CRUD

**Assumed Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID UNIQUE (FK → universities)
plan_name           VARCHAR(100) (Basic, Pro, Enterprise, Custom)
billing_cycle       VARCHAR(50) (monthly, annual)
amount              NUMERIC(12,2)
currency            VARCHAR(3) DEFAULT 'USD'
status              VARCHAR(20) (active, trial, expired, cancelled)
trial_ends_at       TIMESTAMPTZ
next_billing_date   DATE
auto_renewal        BOOLEAN DEFAULT TRUE
created_at          TIMESTAMPTZ
cancelled_at        TIMESTAMPTZ
```

**Portal Operations**:
- **Billing → Subscriptions**: 
  - Manage subscription plans
  - Change university tier
  - Process cancellations
  - Renew subscriptions

---

#### **Payment_Gateways Table** (`payment_gateways`)
**Purpose**: Payment service provider configurations  
**Bitflow Owner Access**: Configure gateway integrations

**Key Columns**:
```sql
id                          UUID PRIMARY KEY
university_id               UUID NOT NULL (FK → universities)
name                        VARCHAR(100) (Stripe, Razorpay, PayPal)
credentials                 JSONB (encrypted API keys)
is_active                   BOOLEAN DEFAULT TRUE
is_test_mode                BOOLEAN DEFAULT TRUE
supported_methods           JSONB (['card','upi','netbanking','wallet'])
transaction_fee_percentage  NUMERIC(5,2)
```

**Portal Operations**:
- **Settings → Payment Settings**: 
  - Configure Stripe/PayPal/Razorpay
  - Test payment integration
  - Set active gateway

**Credentials JSONB** (encrypted):
```json
{
  "publishable_key": "pk_live_...",
  "secret_key": "sk_live_...",
  "webhook_secret": "whsec_..."
}
```

**Relationships**:
- `N:1` with `universities`

---

### 2.6 Operations & System Layer

#### **Notifications Table** (`notifications`)
**Purpose**: In-app notification feed for all users  
**Bitflow Owner Access**: View all notifications across platform

**Key Columns**:
```sql
id              UUID PRIMARY KEY
university_id   UUID NOT NULL (FK → universities)
user_id         UUID NOT NULL (FK → users)
type            VARCHAR(50) (grade_updated, assignment_due, fee_reminder)
title           VARCHAR(255)
message         TEXT
action_url      TEXT
icon            VARCHAR(50)
priority        VARCHAR(20) CHECK (priority IN ('low','normal','high','urgent'))
is_read         BOOLEAN DEFAULT FALSE
read_at         TIMESTAMPTZ
channels        JSONB (['in-app','email','sms','push'])
sent_at         TIMESTAMPTZ
created_at      TIMESTAMPTZ
```

**Portal Operations**:
- **Dashboard**: Recent notifications feed
- **System Monitoring**: Track notification delivery
- **Future**: Notification center for Bitflow Owner

**Channels JSONB**:
```json
["in-app", "email", "sms"]
```

**Relationships**:
- `N:1` with `universities`, `users`

---

#### **Audit_Logs Table** (`audit_logs`)
**Purpose**: Immutable activity log for compliance  
**Bitflow Owner Access**: View ALL audit logs across platform

**Key Columns**:
```sql
id              UUID PRIMARY KEY
university_id   UUID NOT NULL (FK → universities)
user_id         UUID NULLABLE (FK → users)
action          VARCHAR(50) (CREATE, UPDATE, DELETE, LOGIN)
entity_type     VARCHAR(100) (University, User, College, etc.)
entity_id       UUID
changes         JSONB {old: {...}, new: {...}}
ip_address      INET
user_agent      TEXT
created_at      TIMESTAMPTZ
```

**Portal Operations**:
- **Audit Logs Page** (`/audit-logs`):
  - View all user actions
  - Filter by user, action, entity, date
  - Export compliance reports
  - Track God Mode actions

**Changes JSONB**:
```json
{
  "old": {
    "status": "active",
    "storage_quota_gb": 1000
  },
  "new": {
    "status": "suspended",
    "storage_quota_gb": 500
  }
}
```

**God Mode Tracking**: When Bitflow Owner performs cross-tenant actions, `changes` includes:
```json
{
  "god_mode_context": true,
  "target_university_id": "uuid-of-other-university"
}
```

**Indexes**:
- `idx_audit_logs_university` - Tenant filtering
- `idx_audit_logs_user` - User activity queries
- `idx_audit_logs_entity` - Entity change tracking
- `idx_audit_logs_created` - Time-based queries

**Relationships**:
- `N:1` with `universities`, optional `users`

---

#### **System_Logs (Implied)**
**Purpose**: Technical logs for system monitoring  
**Bitflow Owner Access**: View all system events

**Assumed Columns**:
```sql
id              UUID PRIMARY KEY
timestamp       TIMESTAMPTZ
log_level       VARCHAR(20) (INFO, WARNING, ERROR, CRITICAL)
event_type      VARCHAR(50) (API_REQUEST, DB_QUERY, BACKGROUND_JOB, etc.)
message         TEXT
request_id      VARCHAR(255)
user_id         UUID NULLABLE (FK → users)
ip_address      INET
stack_trace     TEXT (for errors)
```

**Portal Operations**:
- **System Logs Page** (`/system-logs`):
  - Monitor API errors
  - Track database performance
  - View background job status
  - Filter by log level

---

#### **File_Uploads Table** (`file_uploads`)
**Purpose**: Binary asset registry (logos, documents, receipts)  
**Bitflow Owner Access**: View all uploaded files

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
uploaded_by         UUID NOT NULL (FK → users)
filename            VARCHAR(255)
original_filename   VARCHAR(255)
file_path           TEXT (S3 key or local path)
file_size_bytes     BIGINT
mime_type           VARCHAR(100)
category            VARCHAR(50) (assignment, profile_photo, document)
entity_type         VARCHAR(100)
entity_id           UUID
is_public           BOOLEAN DEFAULT FALSE
download_count      INTEGER DEFAULT 0
created_at          TIMESTAMPTZ
deleted_at          TIMESTAMPTZ
```

**Portal Operations**:
- **Dashboard**: Track total storage used across platform
- **Universities Page**: Monitor storage per university
- **Settings**: Configure S3/CDN

**Relationships**:
- `N:1` with `universities`, `users`
- Polymorphic: `entity_type` + `entity_id`

---

#### **Settings Table** (`settings`)
**Purpose**: Key/value configuration store  
**Bitflow Owner Access**: Full CRUD on global and tenant settings

**Key Columns**:
```sql
id              UUID PRIMARY KEY
university_id   UUID NULLABLE (NULL for global settings)
key             VARCHAR(100)
value           JSONB
data_type       VARCHAR(50) (string, integer, boolean, json)
category        VARCHAR(100) (general, email, sms, payment, api, security)
description     TEXT
is_public       BOOLEAN DEFAULT FALSE
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
UNIQUE(university_id, key)
```

**Portal Operations**:
- **Settings Page** (`/settings`):
  - General, Email, SMS, Payment, API, Security, Storage
  - Edit platform-wide settings
  - Test integrations

**Example Settings**:
```sql
-- Global SMTP Configuration
INSERT INTO settings (university_id, key, value, category) VALUES 
(NULL, 'smtp_host', '"smtp.gmail.com"', 'email'),
(NULL, 'smtp_port', '587', 'email'),
(NULL, 'smtp_username', '"noreply@bitflow.edu"', 'email');

-- University-specific Feature Flags
INSERT INTO settings (university_id, key, value, category) VALUES
('harvard-uuid', 'enable_hostel_module', 'true', 'features'),
('harvard-uuid', 'enable_transport_module', 'true', 'features');
```

**Relationships**:
- `N:1` with optional `universities`

---

### 2.7 Communications & Support Layer

#### **Announcements Table** (`announcements`)
**Purpose**: Platform-wide broadcast messages  
**Bitflow Owner Access**: Create global announcements

**Key Columns**:
```sql
id                  UUID PRIMARY KEY
university_id       UUID NOT NULL (FK → universities)
college_id          UUID NULLABLE (FK → colleges)
title               VARCHAR(255)
content             TEXT
target_audience     VARCHAR(50) (all, students, faculty, parents)
attachment_urls     JSONB
priority            VARCHAR(20) CHECK (priority IN ('low','normal','high'))
published_at        TIMESTAMPTZ
expires_at          TIMESTAMPTZ
created_by          UUID (FK → users)
status              VARCHAR(20) CHECK (status IN ('draft','published','expired'))
```

**Portal Operations**:
- **Future Feature**: Create platform-wide announcements
- **University Hub**: View university announcements

**Relationships**:
- `N:1` with `universities`, optional `colleges`, `users`

---

#### **Complaint_Tickets Table** (`complaint_tickets`)
**Purpose**: Support ticket management  
**Bitflow Owner Access**: View and respond to all tickets

**Key Columns**:
```sql
id              UUID PRIMARY KEY
university_id   UUID NOT NULL (FK → universities)
ticket_number   VARCHAR(50) UNIQUE
raised_by       UUID NOT NULL (FK → users)
category        VARCHAR(100) (academic, infrastructure, technical, billing, other)
subject         VARCHAR(255)
description     TEXT
priority        VARCHAR(20) CHECK (priority IN ('low','normal','high','critical'))
status          VARCHAR(20) CHECK (status IN ('open','in-progress','resolved','closed'))
assigned_to     UUID NULLABLE (FK → users)
resolution      TEXT
resolved_at     TIMESTAMPTZ
created_at      TIMESTAMPTZ
updated_at      TIMESTAMPTZ
```

**Portal Operations**:
- **Support Tickets Page** (`/support`):
  - View all support tickets
  - Filter by status, priority, category, university
  - Reply to tickets (sends email)
  - Assign to support agents
  - Close/resolve tickets

**Relationships**:
- `N:1` with `universities`, `users` (raised_by, assigned_to)

---

#### **Messages Table** (`messages`)
**Purpose**: Internal direct messaging system  
**Bitflow Owner Access**: View message threads (for support)

**Key Columns**:
```sql
id                      UUID PRIMARY KEY
university_id           UUID NOT NULL (FK → universities)
sender_id               UUID NOT NULL (FK → users)
recipient_id            UUID NOT NULL (FK → users)
subject                 VARCHAR(255)
body                    TEXT
attachment_urls         JSONB
is_read                 BOOLEAN DEFAULT FALSE
read_at                 TIMESTAMPTZ
parent_message_id       UUID NULLABLE (FK → messages) (threading)
created_at              TIMESTAMPTZ
deleted_by_sender       BOOLEAN DEFAULT FALSE
deleted_by_recipient    BOOLEAN DEFAULT FALSE
```

**Portal Operations**:
- **Support**: Message exchange with university owners
- **Future**: In-app messaging for Bitflow Owner

**Relationships**:
- `N:1` with `universities`, `users` (sender, recipient)
- Self-referencing for threads

---

## 3. Data Flow Diagrams

### 3.1 University Creation Workflow

```
Bitflow Owner → Universities Page → Create University Form
    ↓
Validation (name, slug, domain unique)
    ↓
INSERT INTO universities (name, slug, domain, storage_quota_gb, status='setup')
    ↓
Generate default settings (INSERT INTO settings for university_id)
    ↓
Send welcome email to university contact
    ↓
Redirect to University Hub
    ↓
Owner creates University Owner user
    ↓
INSERT INTO users (university_id, email, password_hash)
INSERT INTO role_user (user_id, role_id='university_owner')
    ↓
University Owner receives credentials, logs into University Owner Portal
```

### 3.2 College Setup Workflow (via College Hub)

```
Bitflow Owner → University Hub → Colleges → Create College
    ↓
INSERT INTO colleges (university_id, name, code, type)
    ↓
Navigate to College Hub
    ↓
Leadership → Create Principal
    INSERT INTO users (university_id, email)
    INSERT INTO staff (user_id, college_id, designation='Principal')
    INSERT INTO role_user (user_id, role_id='principal')
    ↓
Departments → Create Department (HOD = NULL)
    INSERT INTO departments (college_id, name, code, head_faculty_id=NULL)
    ↓
Academic Staff → Add Faculty
    INSERT INTO users (university_id, email)
    INSERT INTO faculty (user_id, college_id, department_id, designation)
    INSERT INTO role_user (user_id, role_id='faculty')
    ↓
Departments → Edit Department → Assign HOD
    UPDATE departments SET head_faculty_id = <faculty_uuid> WHERE id = <dept_uuid>
    ↓
Students → Bulk Upload Students
    INSERT INTO users (university_id, email) [bulk]
    INSERT INTO students (user_id, college_id, admission_number, year) [bulk]
    INSERT INTO role_user (user_id, role_id='student') [bulk]
```

### 3.3 Billing Workflow

```
Bitflow Owner → Billing → Subscriptions → Create Subscription
    ↓
INSERT INTO subscriptions (university_id, plan_name, amount, billing_cycle)
    ↓
Auto-generate invoice at billing date
    INSERT INTO invoices (university_id, entity_type='university', total_amount)
    ↓
Send invoice email to University Owner
    ↓
Payment received (via payment gateway webhook)
    UPDATE invoices SET status='paid', paid_amount=total_amount
    INSERT INTO ledger_entries (account_type='income', credit_amount)
    ↓
Revenue Analytics updated in real-time
```

### 3.4 Audit Trail Workflow

```
Any user action (CREATE/UPDATE/DELETE)
    ↓
Application triggers audit log
    INSERT INTO audit_logs (
        university_id, 
        user_id, 
        action, 
        entity_type, 
        entity_id, 
        changes={old:{...}, new:{...}},
        ip_address,
        user_agent
    )
    ↓
Bitflow Owner views Audit Logs Page
    SELECT * FROM audit_logs 
    WHERE entity_type='University' 
    ORDER BY created_at DESC
    ↓
Export compliance report (CSV)
```

---

## 4. Key Indexes & Performance

### Critical Indexes for Portal Performance

```sql
-- Dashboard Queries (aggregate across all universities)
CREATE INDEX idx_users_status ON users(status) WHERE status='active';
CREATE INDEX idx_sessions_expires ON sessions(expires_at) WHERE expires_at > NOW();

-- Universities Page (listing, filtering)
CREATE INDEX idx_universities_status ON universities(status);
CREATE INDEX idx_universities_slug ON universities(slug);

-- Colleges Page (cross-tenant view)
CREATE INDEX idx_colleges_university ON colleges(university_id, id);
CREATE INDEX idx_colleges_status ON colleges(university_id, status);

-- Billing Queries
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Audit Logs (time-based queries with filters)
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);

-- Support Tickets
CREATE INDEX idx_tickets_status ON complaint_tickets(status);
CREATE INDEX idx_tickets_priority ON complaint_tickets(priority);
```

### Query Optimization Examples

**Dashboard - Total Active Users**:
```sql
SELECT COUNT(*) FROM users 
WHERE status = 'active' AND deleted_at IS NULL;
-- Uses: idx_users_status
```

**Dashboard - Active Sessions**:
```sql
SELECT COUNT(*) FROM sessions 
WHERE expires_at > NOW();
-- Uses: idx_sessions_expires
```

**Universities Page - List with Storage**:
```sql
SELECT 
    id, name, slug, status,
    storage_used_mb,
    storage_quota_gb,
    (storage_used_mb::float / (storage_quota_gb * 1024) * 100) as usage_percentage
FROM universities
WHERE deleted_at IS NULL
ORDER BY created_at DESC;
-- Uses: idx_universities_status (if filtered)
```

**Audit Logs - Filter by Entity Type**:
```sql
SELECT * FROM audit_logs
WHERE entity_type = 'University'
  AND action = 'UPDATE'
  AND created_at >= '2025-10-01'
ORDER BY created_at DESC
LIMIT 100;
-- Uses: idx_audit_logs_entity, idx_audit_logs_created
```

---

## 5. Data Integrity & Constraints

### Referential Integrity Rules

**CASCADE on DELETE**:
- `universities` deleted → All dependent records cascade (colleges, users, etc.)
- `colleges` deleted → Departments, students, faculty cascade
- `users` deleted → Sessions, audit_logs cascade

**SET NULL on DELETE**:
- `departments.head_faculty_id` → Faculty deleted, HOD set to NULL
- `audit_logs.user_id` → User deleted, preserve log with NULL user

**Business Rule Constraints**:

```sql
-- Storage quota validation
ALTER TABLE universities ADD CONSTRAINT storage_quota_positive 
CHECK (storage_quota_gb > 0);

-- Student year validation
ALTER TABLE students ADD CONSTRAINT student_year_valid 
CHECK (year BETWEEN 1 AND 6);

-- Ledger balance enforcement
ALTER TABLE ledger_entries ADD CONSTRAINT ledger_balance_check 
CHECK (
    (debit_amount > 0 AND credit_amount = 0) OR 
    (credit_amount > 0 AND debit_amount = 0)
);

-- Invoice balance calculation
ALTER TABLE invoices ADD COLUMN balance_amount NUMERIC(12,2) 
GENERATED ALWAYS AS (total_amount + tax_amount - discount_amount - paid_amount) STORED;
```

---

## 6. Security & Access Control

### Row-Level Security (RLS) Bypass for God Mode

**Normal Users** (e.g., University Owner):
```sql
-- Row-level security policy
CREATE POLICY university_isolation ON colleges
FOR ALL
TO authenticated_users
USING (university_id = current_setting('app.current_university_id')::uuid);
```

**Bitflow Owner (God Mode)**:
```sql
-- Bypass RLS for Bitflow Owner role
ALTER TABLE colleges FORCE ROW LEVEL SECURITY;
CREATE POLICY god_mode_bypass ON colleges
FOR ALL
TO bitflow_owner_role
USING (true); -- No restrictions
```

**Application-Level God Mode**:
```php
// Laravel backend - Disable scoping for Bitflow Owner
if ($user->hasRole('bitflow_owner')) {
    Model::withoutGlobalScope(UniversityScope::class);
}
```

### Password Security

- **Hashing**: bcrypt with cost factor 12
- **Storage**: `users.password_hash` column (255 characters)
- **Reset**: Temporary tokens stored in separate table (not shown in schema)
- **2FA**: `users.two_factor_secret` + `two_factor_enabled` flag

### Session Security

- **Token Rotation**: Refresh token regenerated on each use
- **Expiration**: Configurable (default 2 hours inactivity)
- **Revocation**: Delete from `sessions` table for forced logout
- **IP Tracking**: `sessions.ip_address` for suspicious login detection

---

## 7. Data Lifecycle & Maintenance

### Soft Deletes

**Tables with Soft Delete**:
- `users.deleted_at`
- `universities.deleted_at`
- `colleges.deleted_at`
- `departments.deleted_at`
- `students.deleted_at`
- `faculty.deleted_at`
- `staff.deleted_at`

**Query Pattern**:
```sql
-- Active records only
SELECT * FROM users WHERE deleted_at IS NULL;

-- Include deleted (for audit/recovery)
SELECT * FROM users; -- No filter
```

### Data Archival

**Audit Logs Retention**:
```sql
-- Archive logs older than 2 years to separate table
INSERT INTO audit_logs_archive 
SELECT * FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '2 years';

DELETE FROM audit_logs 
WHERE created_at < NOW() - INTERVAL '2 years';
```

**Session Cleanup**:
```sql
-- Delete expired sessions (run daily)
DELETE FROM sessions 
WHERE expires_at < NOW() - INTERVAL '7 days';
```

### Backup Strategy

**Full Backup** (nightly):
```bash
pg_dump -h localhost -U postgres -d bitflow_lms -F c -b -v -f backup_$(date +%Y%m%d).dump
```

**Point-in-Time Recovery**: Enable WAL archiving in PostgreSQL

**Retention**: Keep daily backups for 30 days, weekly for 1 year

---

## 8. Analytics & Reporting Queries

### Platform-Wide Statistics (Dashboard)

**Total Universities by Status**:
```sql
SELECT 
    status,
    COUNT(*) as count
FROM universities
WHERE deleted_at IS NULL
GROUP BY status;
```

**Storage Usage Across Platform**:
```sql
SELECT 
    SUM(storage_used_mb) / 1024 as total_used_gb,
    SUM(storage_quota_gb) as total_quota_gb,
    (SUM(storage_used_mb)::float / (SUM(storage_quota_gb) * 1024) * 100) as usage_percentage
FROM universities
WHERE status = 'live';
```

**Active Users (Last 30 Days)**:
```sql
SELECT COUNT(DISTINCT user_id) as active_users
FROM sessions
WHERE last_activity_at >= NOW() - INTERVAL '30 days';
```

**Revenue Analytics (Monthly Recurring Revenue)**:
```sql
SELECT 
    DATE_TRUNC('month', payment_date) as month,
    SUM(amount_paid) as revenue
FROM fee_payments
WHERE status = 'completed'
  AND payment_date >= NOW() - INTERVAL '12 months'
GROUP BY month
ORDER BY month;
```

### University-Specific Analytics

**Student Enrollment by College**:
```sql
SELECT 
    c.name as college_name,
    COUNT(s.id) as student_count,
    c.capacity,
    (COUNT(s.id)::float / c.capacity * 100) as occupancy_percentage
FROM colleges c
LEFT JOIN students s ON c.id = s.college_id AND s.status = 'active'
WHERE c.university_id = :university_id
GROUP BY c.id, c.name, c.capacity;
```

**Faculty Distribution by Department**:
```sql
SELECT 
    d.name as department,
    COUNT(f.id) as faculty_count
FROM departments d
LEFT JOIN faculty f ON d.id = f.department_id AND f.status = 'active'
WHERE d.college_id = :college_id
GROUP BY d.id, d.name;
```

---

## 9. Future Enhancements & Schema Evolution

### Planned Schema Additions

**1. Multi-Currency Support**:
```sql
ALTER TABLE fee_structures 
ADD COLUMN currency_code VARCHAR(3) DEFAULT 'USD';

ALTER TABLE invoices 
ADD COLUMN exchange_rate NUMERIC(10,4) DEFAULT 1.0;
```

**2. Advanced Analytics Tables**:
```sql
CREATE TABLE analytics_snapshots (
    id UUID PRIMARY KEY,
    university_id UUID NOT NULL,
    snapshot_date DATE NOT NULL,
    metrics JSONB, -- {total_students, total_faculty, revenue, etc.}
    created_at TIMESTAMPTZ
);
```

**3. Email/SMS Campaigns**:
```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY,
    university_id UUID NOT NULL,
    name VARCHAR(255),
    type VARCHAR(50), -- email, sms
    target_audience JSONB, -- filter criteria
    content TEXT,
    scheduled_at TIMESTAMPTZ,
    status VARCHAR(20)
);
```

### Partitioning Strategy

**Audit Logs** (time-based partitioning):
```sql
CREATE TABLE audit_logs (
    ...
) PARTITION BY RANGE (created_at);

CREATE TABLE audit_logs_2025_10 PARTITION OF audit_logs
FOR VALUES FROM ('2025-10-01') TO ('2025-11-01');
```

**Notifications** (university partitioning for scale):
```sql
CREATE TABLE notifications (
    ...
) PARTITION BY HASH (university_id);

CREATE TABLE notifications_0 PARTITION OF notifications
FOR VALUES WITH (MODULUS 4, REMAINDER 0);
```

---

## 10. Data Validation & Business Rules

### Form Validation Rules (Frontend + Backend)

**University Creation**:
- `name`: Required, 3-100 chars
- `slug`: Required, lowercase, alphanumeric + hyphens, unique
- `domain`: Required, valid domain format, unique
- `email`: Required, valid email, unique
- `storage_quota_gb`: Required, min 1, max 10,000

**College Creation**:
- `name`: Required, 3-150 chars
- `code`: Required, 2-10 chars, uppercase, unique per university
- `type`: Required, enum (Engineering, Medical, Arts, etc.)
- `accreditation`: Optional, enum (NAAC A++, A+, A, B++, etc.)

**Department Creation**:
- `name`: Required, 3-100 chars
- `code`: Required, 2-10 chars, uppercase, unique per college
- `head_faculty_id`: Optional (to avoid circular dependency)

**User Creation**:
- `email`: Required, valid format, unique across platform
- `password`: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
- `phone`: Optional, E.164 format (+91 9876543210)

### Data Consistency Checks

**Storage Quota Enforcement**:
```sql
-- Trigger to prevent file uploads exceeding quota
CREATE OR REPLACE FUNCTION check_storage_quota()
RETURNS TRIGGER AS $$
BEGIN
    IF (
        SELECT storage_used_mb + NEW.file_size_bytes / 1024 / 1024
        FROM universities
        WHERE id = NEW.university_id
    ) > (
        SELECT storage_quota_gb * 1024
        FROM universities
        WHERE id = NEW.university_id
    ) THEN
        RAISE EXCEPTION 'Storage quota exceeded for university %', NEW.university_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_storage_quota
BEFORE INSERT ON file_uploads
FOR EACH ROW EXECUTE FUNCTION check_storage_quota();
```

**Unique Admission Numbers**:
```sql
CREATE UNIQUE INDEX idx_students_admission_number 
ON students(admission_number) 
WHERE deleted_at IS NULL;
```

---

## 11. Summary & Reference Tables

### Portal-to-Database Mapping

| Portal Page | Primary Tables | Key Operations |
|---|---|---|
| Dashboard | universities, colleges, users, students, sessions, fee_payments | COUNT, SUM aggregations |
| Universities | universities, colleges, users, subscriptions | CRUD universities, view metrics |
| University Hub | universities, users (management team), colleges, settings | Manage university staff & colleges |
| Colleges (Cross-tenant) | colleges, departments, students, faculty | View all colleges |
| College Hub | colleges, departments, faculty, students, staff, courses | 13 management modules |
| Users | users, roles, role_user | Create Bitflow Admins |
| Support Tickets | complaint_tickets, users | View/reply to tickets |
| Billing → Subscriptions | subscriptions, universities | Manage subscriptions |
| Billing → Invoices | invoices, fee_payments | Track billing |
| Analytics | fee_payments, ledger_entries, users, students | Revenue & growth trends |
| System Logs | system_logs (implied) | Monitor errors |
| Audit Logs | audit_logs | Compliance reporting |
| Settings | settings, payment_gateways | Platform configuration |

### Entity Cardinalities

```
universities (1) ─── (N) colleges
universities (1) ─── (N) users
universities (1) ─── (N) academic_years
colleges (1) ─── (N) departments
colleges (1) ─── (N) students
colleges (1) ─── (N) faculty
departments (1) ─── (N) courses
departments (1) ─── (1) faculty (HOD, nullable)
students (N) ─── (M) courses via enrollments
users (1) ─── (1) students/faculty/staff (persona extension)
users (N) ─── (M) roles via role_user
roles (N) ─── (M) permissions via role_permissions
```

### Critical JSONB Schemas

**universities.branding**:
```json
{"primary_color": "#HEX", "logo_url": "URL", "favicon_url": "URL"}
```

**universities.settings**:
```json
{"features": {"enable_hostel": bool}, "notifications": {"sms_enabled": bool}}
```

**courses.prerequisites**:
```json
["uuid1", "uuid2"]
```

**fee_structures.components**:
```json
{"tuition": 10000, "library": 500, "lab": 1500}
```

**invoices.line_items**:
```json
[{"description": "str", "quantity": int, "unit_price": decimal, "amount": decimal}]
```

**audit_logs.changes**:
```json
{"old": {...}, "new": {...}, "god_mode_context": bool}
```

---

## 12. Conclusion

This data model supports the **Bitflow Owner Portal** with:

✅ **God Mode Access**: Unrestricted cross-tenant queries  
✅ **Multi-Tenant Isolation**: `university_id` scoping (bypassed for Bitflow Owner)  
✅ **Hierarchical Data**: Universities → Colleges → Departments → Students/Faculty  
✅ **Financial Tracking**: Subscriptions, Invoices, Ledger, Expenses  
✅ **Compliance**: Audit logs, soft deletes, immutable records  
✅ **Performance**: Strategic indexes for dashboard & analytics  
✅ **Extensibility**: JSONB for flexible metadata, partitioning for scale  

**For detailed column definitions and complete schema, reference**:
- `brain/master_db_schema.sql` - Canonical PostgreSQL DDL
- `brain/master_er_diagram.txt` - ASCII ER diagrams
- `big-brain/DATA_MODEL_AND_DATABASE_DESIGN.md` - Platform-wide data model
- `big-brain/BITFLOW_OWNER_PORTAL_DOCUMENTATION.md` - Portal features & workflows

---

_Document Version: 1.0_  
_Author: Bitflow Development Team_  
_Status: Production Ready_
