# Bitflow Nova - System Architecture

## 🏗️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                       Frontend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Admin      │  │   Learner    │  │   Faculty    │         │
│  │   Portal     │  │   Portal     │  │   Portal     │         │
│  │  (Next.js)   │  │  (Next.js)   │  │  (Next.js)   │         │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
└─────────┼──────────────────┼──────────────────┼────────────────┘
          │                  │                  │
          │    TanStack Query / API Client     │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │   API Gateway   │
                    │  (Laravel 11)   │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Middleware    │  │   Controllers   │  │   Routes       │
│  - Tenant      │  │   - Admin       │  │   - API        │
│  - Auth        │  │   - Learner     │  │   - Web        │
│  - RBAC        │  │   - Faculty     │  │                │
└───────┬────────┘  └────────┬────────┘  └────────────────┘
        │                    │
        └────────────────────┼────────────────────┐
                             │                    │
                    ┌────────▼────────┐           │
                    │    Services     │           │
                    │  - Dashboard    │           │
                    │  - Admin        │           │
                    │  - Library      │           │
                    │  - Assessment   │           │
                    └────────┬────────┘           │
                             │                    │
                    ┌────────▼────────┐           │
                    │  Repositories   │           │
                    │  - Notice       │           │
                    │  - Timetable    │           │
                    │  - Student      │           │
                    └────────┬────────┘           │
                             │                    │
        ┌────────────────────┼────────────────────┘
        │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌────────────────┐
│    Models      │  │   Queue Jobs    │  │   Events       │
│  - University  │  │  - DocUpload    │  │  - Notice      │
│  - College     │  │  - Notification │  │  - Payment     │
│  - Student     │  │  - Reminder     │  │  - Assessment  │
└───────┬────────┘  └────────┬────────┘  └────────────────┘
        │                    │
        └────────────────────┼────────────────────┐
                             │                    │
        ┌────────────────────▼────────────────────▼────────┐
        │              Database Layer                       │
        │  ┌──────────┐  ┌──────────┐  ┌──────────┐       │
        │  │  MySQL   │  │  Redis   │  │  S3/CDN  │       │
        │  │   RDS    │  │  Cache   │  │  Assets  │       │
        │  └──────────┘  └──────────┘  └──────────┘       │
        └──────────────────────────────────────────────────┘
```

---

## 🔄 Request Flow - Student Dashboard

```
1. User Request
   ┌──────────────────────────────────────────────────┐
   │ GET /api/learner/dashboard                       │
   │ Headers:                                         │
   │   Authorization: Bearer <token>                  │
   │   X-Tenant-University: mvp                       │
   └──────────────────┬───────────────────────────────┘
                      │
2. Middleware Pipeline
   ┌──────────────────▼───────────────────────────────┐
   │ ResolveTenantContext                             │
   │  ├─ Resolve University (cache/DB)                │
   │  ├─ Resolve College (cache/DB)                   │
   │  └─ Inject into request & app container          │
   └──────────────────┬───────────────────────────────┘
                      │
   ┌──────────────────▼───────────────────────────────┐
   │ Authenticate User (Sanctum/JWT)                  │
   │  ├─ Verify token                                 │
   │  ├─ Load user + roles                            │
   │  └─ Check 'student' role                         │
   └──────────────────┬───────────────────────────────┘
                      │
3. Controller Layer
   ┌──────────────────▼───────────────────────────────┐
   │ Learner\DashboardController::index()             │
   │  └─ Inject StudentDashboardService               │
   └──────────────────┬───────────────────────────────┘
                      │
4. Service Layer
   ┌──────────────────▼───────────────────────────────┐
   │ StudentDashboardService::getDashboardData()      │
   │  ├─ Get student from StudentRepository           │
   │  ├─ Get notices from NoticeRepository            │
   │  ├─ Get timetable from TimetableRepository       │
   │  └─ Aggregate & format data                      │
   └──────────────────┬───────────────────────────────┘
                      │
5. Repository Layer
   ┌──────────────────▼───────────────────────────────┐
   │ Repositories query models with tenant scope      │
   │  ├─ NoticeRepository::getImportantNotices()      │
   │  └─ TimetableRepository::getUpcomingLectures()   │
   └──────────────────┬───────────────────────────────┘
                      │
6. Response
   ┌──────────────────▼───────────────────────────────┐
   │ JSON Response                                    │
   │ {                                                │
   │   "success": true,                               │
   │   "data": {                                      │
   │     "student": {...},                            │
   │     "important_notices": [...],                  │
   │     "upcoming_lectures": [...]                   │
   │   }                                              │
   │ }                                                │
   └──────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema - Core Tables

```
universities
├── id (uuid, PK)
├── name
├── slug (unique)
├── domain (unique)
├── status (live/staging/suspended)
└── branding (json)

colleges
├── id (uuid, PK)
├── university_id (FK → universities)
├── name
├── code (unique)
└── status

users
├── id (uuid, PK)
├── username (unique)
├── email (unique)
├── password
└── status

roles
├── id (uuid, PK)
├── name
├── slug (unique)
└── scope (system/university/college)

user_roles (pivot)
├── user_id (FK)
├── role_id (FK)
├── university_id (FK, nullable)
└── college_id (FK, nullable)

students
├── id (uuid, PK)
├── user_id (FK → users)
├── college_id (FK → colleges)
├── roll_number (unique)
├── course
└── year

notices
├── id (uuid, PK)
├── college_id (FK)
├── title
├── content
├── priority (normal/high/critical)
├── is_important (bool)
└── published_at

timetable_blocks
├── id (uuid, PK)
├── college_id (FK)
├── faculty_id (FK)
├── subject
├── day_of_week
├── start_time
└── end_time
```

---

## 🔐 RBAC Model

```
┌─────────────────────────────────────────────────────────────┐
│                        User                                 │
│  ├─ id                                                      │
│  ├─ username                                                │
│  └─ roles[] (many-to-many)                                  │
└─────────────────┬───────────────────────────────────────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐        ┌───────▼────────┐
│   Role     │        │  user_roles    │
│  ├─ id     │◄───────┤  ├─ user_id    │
│  ├─ slug   │        │  ├─ role_id    │
│  ├─ scope  │        │  ├─ univ_id    │
│  └─ perms[]│        │  └─ college_id │
└─────┬──────┘        └────────────────┘
      │
      │ many-to-many
      │
┌─────▼──────────┐
│  Permission    │
│  ├─ id         │
│  ├─ slug       │
│  └─ module     │
└────────────────┘

Role Examples:
- bitflow_owner (scope: system)
  └─ All permissions
- super_admin (scope: university)
  └─ Manage all colleges
- college_admin (scope: college)
  └─ Manage single college
- student (scope: college)
  └─ View only permissions
```

---

## 🎯 Tenant Context Resolution

```
Request Flow:
┌──────────────────────────────────────────────────────────┐
│  Client Request                                          │
│  ┌────────────────────────────────────────────┐         │
│  │ URL: https://mvp-engg.mvp.bitflow.com/api │         │
│  │ Headers:                                   │         │
│  │   X-Tenant-University: mvp                 │         │
│  │   X-Tenant-College: mvp-engg               │         │
│  └────────────────────────────────────────────┘         │
└───────────────────────┬──────────────────────────────────┘
                        │
            ┌───────────▼──────────┐
            │  Middleware Check    │
            │  - Header present?   │
            │  - Domain match?     │
            └───────────┬──────────┘
                        │
          ┌─────────────┴─────────────┐
          │                           │
    ┌─────▼─────┐             ┌───────▼────────┐
    │  Header   │             │    Domain      │
    │  Based    │             │    Based       │
    │  (Dev)    │             │  (Production)  │
    └─────┬─────┘             └───────┬────────┘
          │                           │
          └─────────────┬─────────────┘
                        │
            ┌───────────▼──────────┐
            │  Cache Lookup        │
            │  Key: "univ:mvp"     │
            └───────────┬──────────┘
                        │
                 ┌──────┴──────┐
                 │ Found?      │
                 └──────┬──────┘
                   Yes  │  No
              ┌─────────┴─────────┐
              │                   │
        ┌─────▼─────┐      ┌──────▼──────┐
        │  Return   │      │  DB Query   │
        │  Cached   │      │  + Cache    │
        └─────┬─────┘      └──────┬──────┘
              │                   │
              └─────────┬─────────┘
                        │
            ┌───────────▼──────────┐
            │  Inject into:        │
            │  - Request object    │
            │  - App container     │
            │  - Global scope      │
            └──────────────────────┘
```

---

## 📦 Module Dependencies

```
Core Modules:
┌──────────────────────────────────────────────────────────┐
│  Tenant Management (Universities, Colleges, Departments) │
└───────────────────────┬──────────────────────────────────┘
                        │
        ┌───────────────┼───────────────┐
        │               │               │
┌───────▼──────┐ ┌──────▼─────┐ ┌──────▼─────┐
│ Identity &   │ │  Feature   │ │   Audit    │
│ Access (RBAC)│ │  Toggles   │ │   Logs     │
└───────┬──────┘ └──────┬─────┘ └────────────┘
        │               │
        └───────┬───────┘
                │
    ┌───────────┼───────────┐
    │           │           │
┌───▼───┐  ┌────▼────┐  ┌──▼──┐
│Library│  │Academic │  │Finance│
└───┬───┘  └────┬────┘  └──┬──┘
    │           │          │
    │      ┌────▼────┐     │
    │      │ Assess  │     │
    │      │ ments   │     │
    │      └────┬────┘     │
    │           │          │
    └───────────┼──────────┘
                │
        ┌───────▼───────┐
        │ Communication │
        │ (Notices,     │
        │  Notifications)│
        └───────────────┘
```

---

## 🔄 Background Job Processing

```
Trigger Event
    │
    ├─ Document Uploaded
    │   └─► ProcessDocumentUpload::dispatch($docId, $path)
    │           │
    │           ├─ Move to S3
    │           ├─ Update DB record
    │           └─ Clean temp file
    │
    ├─ Notice Published
    │   └─► SendNoticeNotification::dispatch($noticeId)
    │           │
    │           ├─ Resolve target audience
    │           ├─ Send in-app notifications
    │           ├─ Queue email jobs (optional)
    │           └─ Queue SMS jobs (optional)
    │
    └─ Fee Due Date Approaching
        └─► SendFeeReminder::dispatch($invoiceId)
                │
                ├─ Check if already sent
                ├─ Send to student
                ├─ Send to parent (if enabled)
                └─ Log reminder sent

All jobs queued via:
    - Redis (production)
    - Database (development)
    - Sync (testing)

Process with:
    php artisan queue:work
    php artisan horizon (production)
```

---

## 📊 Metrics & Observability

```
Application Metrics
    │
    ├─ API Response Times
    │   └─ Track per endpoint
    │
    ├─ Queue Job Success/Failure
    │   └─ Alert on failure rate > 5%
    │
    ├─ Database Query Performance
    │   └─ Slow query log (>100ms)
    │
    └─ Tenant-Level Metrics
        ├─ Storage usage
        ├─ API request volume
        └─ Active user count

Logging Layers:
    Local Dev → Laravel Log (storage/logs)
    Staging   → CloudWatch Logs
    Production → CloudWatch + Sentry

Alerts:
    - Failed jobs > 10 in 5 min
    - API error rate > 1%
    - Database connection failures
    - Storage quota exceeded (90%)
```

---

**Document Version:** 1.0  
**Last Updated:** October 8, 2025  
**Status:** Foundation Complete, Module Expansion In Progress
