# University Owner Portal Documentation

**Portal Name**: University Owner Portal  
**Portal ID**: 02  
**Version**: 2.0  
**Last Updated**: October 25, 2025  
**Port**: 3002  
**Role**: University Owner

---

## Overview

The University Owner Portal is the **top-level management interface** for university administrators who own and operate educational institutions within the Bitflow LMS platform. This portal provides comprehensive control over all aspects of a single university, including multiple colleges, academic programs, faculty management, student lifecycle, and financial operations.

**Scope**: University-wide operations (Multi-college management)  
**Access Level**: Full access to assigned university, read-only visibility to platform metrics  
**Key Differentiator**: Unlike Bitflow Admin (platform-level), University Owner manages ONE university with multiple colleges

---

## Portal Characteristics

### User Role
- **Role Name**: `university_owner`
- **Hierarchy**: Reports to Bitflow Admin (platform level)
- **Authority**: Complete control over assigned university
- **Typical Users**: Vice-Chancellors, University Registrars, Education Group CEOs

### Scope of Operations
```
Bitflow Platform
└── University (MIT University) ← University Owner manages THIS level
    ├── College of Engineering
    ├── College of Medicine
    ├── College of Arts & Sciences
    └── College of Business
```

**Manages**:
- ✅ Multiple colleges within the university
- ✅ University-wide academic programs and curricula
- ✅ Faculty and staff across all colleges
- ✅ Student admissions and lifecycle
- ✅ Financial operations (fees, expenses, budgets)
- ✅ Infrastructure and resources
- ✅ Compliance and accreditation

**Does NOT Manage**:
- ❌ Other universities on the platform (Bitflow Admin only)
- ❌ Platform-level settings (Bitflow Admin only)
- ❌ Cross-university analytics (Bitflow Admin only)

---

## Key Metrics Tracked

### Dashboard Overview
- **Total Colleges**: 8 colleges
- **Total Students**: 15,247 students
- **Total Faculty**: 892 faculty members
- **Total Staff**: 234 non-teaching staff
- **Active Programs**: 45 degree programs
- **Fee Collection Rate**: 87.5%
- **Storage Used**: 125GB / 500GB quota

### Real-Time Monitoring
- Current attendance rate (today)
- Fee collection status (current semester)
- Faculty-to-student ratio
- Upcoming accreditation deadlines
- Pending approvals (faculty leaves, expense requests)

---

## Portal Features Summary

### 1. University Dashboard
- **Purpose**: Real-time overview of university-wide metrics
- **Key Widgets**: Student enrollment trends, fee collection, attendance rates, college performance comparison
- **Refresh Rate**: Live data (30-second polling)

### 2. Colleges Management
- **Purpose**: Create, configure, and manage all colleges
- **Actions**: Add new colleges, assign principals, set college quotas, monitor college performance
- **Sub-modules**: College details, department structure, resource allocation

### 3. Academic Programs
- **Purpose**: Define degree programs, courses, and curricula
- **Actions**: Create programs (B.Tech, MBA, etc.), assign to colleges, set credit requirements, manage course catalog
- **Integration**: Syncs with Faculty Portal (course assignments) and Student Portal (enrollments)

### 4. Faculty Management
- **Purpose**: Hire, onboard, and manage faculty across all colleges
- **Actions**: Create faculty profiles, assign to departments, track qualifications, manage leave requests
- **Reports**: Faculty performance, workload distribution, attendance

### 5. Student Management
- **Purpose**: Oversee student lifecycle from admission to graduation
- **Actions**: View all students, track academic progress, handle transfers between colleges, manage disciplinary actions
- **Reports**: Enrollment analytics, retention rates, graduation rates

### 6. Admissions
- **Purpose**: Configure admission processes for the university
- **Actions**: Set admission criteria, review applications, approve merit lists, manage entrance tests
- **Workflow**: Application → Test → Merit List → Admission Confirmation

### 7. Financial Management
- **Purpose**: University-wide financial oversight
- **Actions**: View consolidated fee collection, approve budgets, track expenses, generate financial reports
- **Sub-modules**: Fee structure configuration, scholarship management, expense approvals

### 8. Reports & Analytics
- **Purpose**: Comprehensive reporting across all domains
- **Reports**: Academic performance, financial health, faculty analytics, student retention, compliance reports
- **Export**: PDF, Excel, CSV formats

### 9. Infrastructure
- **Purpose**: Manage university facilities and resources
- **Actions**: View campus infrastructure, allocate classrooms, manage hostel capacity, track maintenance
- **Integration**: Links to Super NT Manager Portal

### 10. Settings & Configuration
- **Purpose**: University-level settings and preferences
- **Actions**: Update university profile, configure academic calendar, set policies, manage communication preferences
- **Access Control**: Only University Owner can modify critical settings

---

## User Workflow Examples

### Example 1: Creating a New College
1. Navigate to **Colleges Management** page
2. Click "Add New College" button
3. Fill in college details (name, code, address, principal assignment)
4. Set college quotas (student capacity, faculty count)
5. Submit and await confirmation
6. System creates college, assigns principal, sends welcome email

### Example 2: Monitoring Fee Collection
1. Open **University Dashboard**
2. View "Fee Collection" widget (shows 87.5% collected)
3. Click widget to drill down by college
4. Identify College of Engineering has lowest collection (78%)
5. Navigate to **Financial Management** → Fee Collection Reports
6. Export list of students with pending fees
7. Send payment reminders via bulk email

### Example 3: Approving a New Academic Program
1. Navigate to **Academic Programs** page
2. Click "Pending Approvals" tab
3. Review new program proposal (M.Tech in AI) submitted by College of Engineering
4. Check curriculum, credit structure, faculty assignments
5. Approve or request changes
6. Program becomes active for next semester admissions

---

## Access Control & Permissions

### Authentication
- **Method**: JWT-based authentication via Laravel Sanctum
- **2FA**: Optional (recommended for high-value accounts)
- **Session Timeout**: 60 minutes of inactivity
- **IP Whitelisting**: Optional (can be enabled per university)

### Authorization
- **Middleware**: `EnsureUniversityOwner` (checks `role === 'university_owner'`)
- **Row-Level Security**: All queries scoped to `university_id`
- **Cross-University Access**: Blocked (cannot view other universities' data)

### Audit Logging
- All actions logged to `audit_logs` table
- Logged events: College creation, program approval, faculty hiring, fee adjustments
- Retention: 2 years

---

## Technical Architecture

### Frontend
- **Framework**: Next.js 16.0.0-canary.6 (App Router)
- **Language**: TypeScript 5.6
- **State Management**: Zustand
- **UI Library**: Radix UI + Tailwind CSS
- **Data Fetching**: TanStack Query (React Query)
- **Port**: 3002

### Backend
- **Framework**: Laravel 11
- **Language**: PHP 8.3+
- **Database**: PostgreSQL 16 (shared with Bitflow Admin)
- **Cache**: Redis 7
- **Port**: 8000 (shared API, scoped by `university_id`)

### Database Schema
- **University-Scoped Tables**: `colleges`, `programs`, `departments`, `faculty`, `students`, `fee_structures`
- **Shared Tables**: `users` (with `university_id` foreign key)
- **Multi-Tenancy**: Enforced via `university_id` column + middleware

---

## Integration Points

### Upstream Integration (Bitflow Admin)
- **University Created**: Bitflow Admin creates university → University Owner invited
- **Storage Quota**: Enforced by Bitflow Admin, monitored in University Owner Portal
- **Subscription Status**: University suspension by Bitflow Admin disables University Owner access

### Downstream Integration (Other Portals)
- **Super Admin Portal (03)**: University Owner assigns Super Admin role
- **Principal Portal (04)**: University Owner assigns Principals to colleges
- **Faculty Portal (07)**: Faculty hired by University Owner can access Faculty Portal
- **Student Portal (08)**: Students admitted via University Owner Portal can access Student Portal

### External Integration
- **Stripe**: Not directly integrated (billing handled by Bitflow Admin)
- **AWS S3**: Storage for university documents, reports (uses university-specific folder)
- **Email**: SendGrid for transactional emails (university-branded)

---

## Security Considerations

### Data Isolation
- **Multi-Tenancy**: Strict university-level isolation via `university_id` filter
- **Query Scoping**: Global scope applied to all Eloquent models
- **API Guards**: Every endpoint validates `university_id` matches authenticated user's university

### Compliance
- **GDPR**: Student data export/deletion features
- **FERPA**: Educational records access controls
- **Data Retention**: Configurable per university policy

### Backup & Recovery
- **Database Backups**: Daily automated backups (Bitflow Admin responsibility)
- **Document Backups**: S3 versioning enabled
- **Disaster Recovery**: RTO 4 hours, RPO 24 hours

---

## Performance Targets

- **Page Load Time**: < 1 second (90th percentile)
- **API Response Time**: < 300ms (95th percentile)
- **Concurrent Users**: Support up to 50 concurrent University Owners across platform
- **Database Queries**: < 50ms for dashboard queries (with caching)

---

## Development Roadmap

### Phase 1 (Completed)
- ✅ University dashboard with key metrics
- ✅ Colleges management (CRUD operations)
- ✅ Basic faculty and student views

### Phase 2 (Current - October 2025)
- 🔄 Academic programs management
- 🔄 Admissions workflow
- 🔄 Financial reporting enhancements

### Phase 3 (Q1 2026)
- 📅 Real-time notifications (Laravel Reverb)
- 📅 Advanced analytics (predictive insights)
- 📅 Mobile app (React Native)

---

## Documentation Structure

This portal documentation includes:

1. **README.md** (this file) - Overview and introduction
2. **features.md** - Detailed feature specifications
3. **pages.md** - Complete page-by-page wireframes and requirements
4. **api_spec.yaml** - OpenAPI 3.1 specification for all API endpoints
5. **auth_and_permissions.md** - Authentication, authorization, and security
6. **backend_guide.md** - Laravel implementation guide
7. **frontend_guide.md** - Next.js implementation guide
8. **db_schema.sql** - PostgreSQL database schema
9. **build_steps.md** - Step-by-step build and deployment guide
10. **integration_contracts.md** - External APIs, webhooks, events
11. **security_checklist.md** - OWASP Top 10, compliance, hardening
12. **tests.md** - Testing strategy and test cases
13. **lessons_and_postmortem.md** - Best practices and lessons learned
14. **sync_checklist.json** - Type synchronization (TypeScript ↔ PHP ↔ Database)

---

## Quick Start

### For Developers
1. Read `build_steps.md` for environment setup
2. Review `api_spec.yaml` for API contracts
3. Check `db_schema.sql` for database structure
4. Follow `backend_guide.md` and `frontend_guide.md` for implementation

### For University Owners (End Users)
1. Log in at `https://{university-slug}.bitflow.edu:3002`
2. Complete profile setup (first-time login)
3. Configure university settings (academic calendar, policies)
4. Add colleges and assign principals
5. Set up academic programs
6. Begin onboarding faculty and students

---

## Support & Contact

- **Technical Support**: support@bitflow.edu
- **Documentation Issues**: docs@bitflow.edu
- **Feature Requests**: features@bitflow.edu

---

**Portal Status**: ✅ Production-Ready  
**Last Deployment**: October 25, 2025  
**Next Review**: January 2026
