# 📋 Frontend Pages Allocation Matrix
**Project:** EduBit LMS  
**Total Pages:** 50+  
**Team:** 3 Developers  
**Last Updated:** October 10, 2025

---

## 🎯 COMPLETE PAGE LIST WITH OWNERSHIP

### Legend
- ⭐⭐⭐ = Critical Priority (Week 1-2)
- ⭐⭐ = High Priority (Week 3-4)
- ⭐ = Medium Priority (Week 5-6)
- 🔴 = High Complexity
- 🟠 = Medium-High Complexity
- 🟡 = Medium Complexity
- 🟢 = Low Complexity

---

## 👨‍💻 DEVELOPER 1 - STUDENT & PARENT PORTALS (16 PAGES)

### Student Portal (`/apps/learner`) - 10 Pages

| # | Page | Route | Priority | Complexity | Time | API Calls |
|---|------|-------|----------|------------|------|-----------|
| 1 | **Login** | `/login` | ⭐⭐⭐ | 🟢 | 1 day | POST /auth/login |
| 2 | **Dashboard** | `/dashboard` | ⭐⭐⭐ | 🟠 | 3 days | 7 endpoints (profile, attendance, fees, timetable, assessments, announcements) |
| 3 | **Library List** | `/library` | ⭐⭐ | 🟡 | 1.5 days | GET /learner/library/resources |
| 4 | **Library Detail** | `/library/[id]` | ⭐⭐ | 🟢 | 0.5 days | GET /learner/library/resources/{id} |
| 5 | **Assessments List** | `/assessments` | ⭐⭐⭐ | 🟡 | 1 day | GET /learner/assessments |
| 6 | **Assessment Detail** | `/assessments/[id]` | ⭐⭐ | 🟡 | 0.5 days | GET /learner/assessments/{id} |
| 7 | **Take Assessment** | `/assessments/[id]/attempt` | ⭐⭐⭐ | 🔴 | 2 days | POST /learner/assessments/{id}/submit |
| 8 | **Assessment Result** | `/assessments/[id]/result` | ⭐⭐ | 🟢 | 0.5 days | GET /learner/assessments/{id}/result |
| 9 | **Timetable** | `/timetable` | ⭐⭐ | 🟡 | 2 days | GET /learner/profile/timetable |
| 10 | **Attendance** | `/attendance` | ⭐⭐ | 🟡 | 2 days | GET /learner/profile/attendance |
| 11 | **Documents** | `/documents` | ⭐⭐ | 🟡 | 2 days | GET /learner/documents, POST upload |
| 12 | **Fees** | `/fees` | ⭐⭐⭐ | 🟡 | 1.5 days | GET /learner/profile/fees, invoices |
| 13 | **Fee Invoice** | `/fees/[id]` | ⭐⭐ | 🟢 | 0.5 days | GET /learner/fees/invoices/{id} |
| 14 | **Announcements** | `/announcements` | ⭐⭐ | 🟢 | 1 day | GET /learner/announcements |
| 15 | **Profile** | `/profile` | ⭐ | 🟡 | 2 days | GET/PATCH /learner/profile |

**Total:** 15 pages, **~20 days** of work

---

### Parent Portal (`/apps/parent`) - 6 Pages

| # | Page | Route | Priority | Complexity | Time | Notes |
|---|------|-------|----------|------------|------|-------|
| 16 | **Login** | `/login` | ⭐⭐⭐ | 🟢 | 0.5 days | Reuse Student login |
| 17 | **Dashboard** | `/dashboard` | ⭐⭐ | 🟡 | 1.5 days | Child selector + read-only widgets |
| 18 | **Attendance** | `/attendance` | ⭐ | 🟢 | 0.5 days | Reuse Student attendance (read-only) |
| 19 | **Assessments** | `/assessments` | ⭐ | 🟢 | 0.5 days | Reuse Student assessments (read-only) |
| 20 | **Fees** | `/fees` | ⭐ | 🟢 | 0.5 days | Reuse Student fees (read-only) |
| 21 | **Announcements** | `/announcements` | ⭐ | 🟢 | 0.5 days | Reuse Student announcements |
| 22 | **Profile** | `/profile` | ⭐ | 🟢 | 0.5 days | Contact info, settings |

**Total:** 6 pages (1 new + 5 reused), **~4 days** of work

---

### D1 Components to Build

| Component | Used In | Complexity | Time |
|-----------|---------|------------|------|
| AttendanceGraph | Dashboard, Attendance page | 🟠 | 1 day |
| FeeStatusWidget | Dashboard, Fees page | 🟡 | 0.5 days |
| TimetableWidget | Dashboard, Timetable page | 🟡 | 1 day |
| AnnouncementsWidget | Dashboard | 🟢 | 0.5 days |
| AssessmentSubmissionForm | Take Assessment | 🔴 | 1.5 days |
| MCQQuestion | Take Assessment | 🟡 | 0.5 days |
| SAQQuestion | Take Assessment | 🟢 | 0.5 days |
| LAQQuestion | Take Assessment | 🟡 | 0.5 days |
| FileUploadWidget | Documents, Assessments | 🟡 | 1 day |
| ResourceCard | Library | 🟢 | 0.5 days |

**Total:** 10 components, **~7 days**

---

### D1 TOTAL EFFORT: **~31 days (6-7 weeks)**

---

## 👨‍💻 DEVELOPER 2 - ADMIN PORTALS (24 PAGES)

### Super Admin Portal (`/apps/admin`) - 9 Pages

| # | Page | Route | Priority | Complexity | Time | API Calls |
|---|------|-------|----------|------------|------|-----------|
| 23 | **Dashboard** | `/dashboard` | ⭐⭐⭐ | 🟠 | 2 days | GET /admin/analytics/dashboard |
| 24 | **Universities List** | `/universities` | ⭐⭐⭐ | 🟡 | 1.5 days | GET /admin/universities |
| 25 | **University Detail** | `/universities/[id]` | ⭐⭐ | 🟡 | 1 day | GET /admin/universities/{id} |
| 26 | **University Colleges** | `/universities/[id]/colleges` | ⭐⭐ | 🟡 | 1 day | GET /admin/universities/{id}/colleges |
| 27 | **Feature Toggles** | `/feature-toggles` | ⭐⭐ | 🟡 | 1 day | GET/PATCH /admin/feature-toggles |
| 28 | **Audit Log** | `/audit-log` | ⭐ | 🟡 | 2 days | GET /admin/audit-logs |
| 29 | **Backups** | `/backups` | ⭐ | 🟡 | 1 day | Custom API |
| 30 | **Billing** | `/billing` | ⭐ | 🟡 | 1.5 days | GET /admin/billing/invoices |
| 31 | **Invoices** | `/invoices` | ⭐ | 🟡 | 1 day | POST /admin/billing/invoices |
| 32 | **Change Requests** | `/change-requests` | ⭐ | 🟡 | 1 day | Custom API |

**Total:** 9 pages, **~13 days**

---

### College Admin Portal (`/apps/college-admin`) - 15 Pages

| # | Page | Route | Priority | Complexity | Time | API Calls |
|---|------|-------|----------|------------|------|-----------|
| 33 | **Dashboard** | `/dashboard` | ⭐⭐⭐ | 🟠 | 2 days | GET /admin/analytics/dashboard?college_id |
| 34 | **Students List** | `/students` | ⭐⭐⭐ | 🟡 | 2 days | GET /admin/students |
| 35 | **Student Detail** | `/students/[id]` | ⭐⭐ | 🟡 | 1.5 days | GET /admin/students/{id} |
| 36 | **Create Student** | `/students/create` | ⭐⭐ | 🟡 | 1.5 days | POST /admin/students |
| 37 | **Import Students** | `/students/import` | ⭐⭐⭐ | 🔴 | 3 days | POST /admin/students/import |
| 38 | **Faculty List** | `/faculty` | ⭐⭐ | 🟡 | 1.5 days | GET /admin/faculty |
| 39 | **Faculty Detail** | `/faculty/[id]` | ⭐ | 🟡 | 1 day | GET /admin/faculty/{id} |
| 40 | **Create Faculty** | `/faculty/create` | ⭐ | 🟡 | 1 day | POST /admin/faculty |
| 41 | **Departments** | `/departments` | ⭐ | 🟢 | 1 day | GET /admin/departments |
| 42 | **Fee Structures** | `/fees/structures` | ⭐⭐⭐ | 🟠 | 2 days | GET/POST /admin/fees/structures |
| 43 | **Fee Invoices** | `/fees/invoices` | ⭐⭐ | 🟡 | 1.5 days | GET /admin/fees/invoices |
| 44 | **Fee Payments** | `/fees/payments` | ⭐⭐ | 🟡 | 1 day | POST /admin/fees/invoices/{id}/payments |
| 45 | **Fee Reports** | `/fees/reports` | ⭐ | 🟡 | 1.5 days | GET /admin/analytics/fee-collection |
| 46 | **Library Resources** | `/library/resources` | ⭐⭐ | 🟡 | 2 days | GET/POST /admin/library/resources |
| 47 | **Library Categories** | `/library/categories` | ⭐ | 🟢 | 0.5 days | GET/POST /admin/library/categories |
| 48 | **Library Approval** | `/library/approval-queue` | ⭐⭐ | 🟡 | 1 day | POST /admin/library/resources/{id}/approve |
| 49 | **Timetable Schedule** | `/timetable/schedule` | ⭐⭐⭐ | 🔴 | 4 days | GET/POST /admin/timetable |
| 50 | **Timetable Conflicts** | `/timetable/conflicts` | ⭐⭐ | 🟠 | 1.5 days | GET /admin/timetable?conflicts=true |
| 51 | **Attendance Overview** | `/attendance/overview` | ⭐⭐ | 🟡 | 1.5 days | GET /admin/analytics/attendance |
| 52 | **Attendance Corrections** | `/attendance/corrections` | ⭐⭐ | 🟡 | 1 day | GET/POST /admin/attendance/corrections |
| 53 | **Attendance Reports** | `/attendance/reports` | ⭐ | 🟡 | 1 day | GET /admin/analytics/attendance |
| 54 | **Assessments List** | `/assessments/list` | ⭐⭐ | 🟡 | 1 day | GET /admin/assessments |
| 55 | **Assessment Results** | `/assessments/results` | ⭐⭐ | 🟡 | 1.5 days | GET /admin/assessments/results |
| 56 | **Assessment Analytics** | `/assessments/analytics` | ⭐ | 🟡 | 1.5 days | GET /admin/analytics/assessments |
| 57 | **Documents Folders** | `/documents/folders` | ⭐ | 🟢 | 1 day | GET/POST /admin/documents |
| 58 | **Documents Verification** | `/documents/verification` | ⭐⭐ | 🟡 | 1 day | POST /admin/documents/{id}/verify |
| 59 | **Create Announcement** | `/announcements/create` | ⭐⭐⭐ | 🟠 | 2 days | POST /admin/announcements |
| 60 | **Schedule Announcement** | `/announcements/schedule` | ⭐ | 🟡 | 1 day | POST /admin/announcements (scheduled) |
| 61 | **Announcement Analytics** | `/announcements/analytics` | ⭐ | 🟡 | 1 day | GET /admin/announcements/analytics |
| 62 | **Analytics Dashboard** | `/analytics` | ⭐⭐ | 🟠 | 2 days | Multiple analytics endpoints |

**Total:** 30 pages, **~41 days**

---

### D2 Components to Build

| Component | Used In | Complexity | Time |
|-----------|---------|------------|------|
| DataTable (Advanced) | All list pages | 🔴 | 2 days |
| BulkUploadInterface | Student import | 🔴 | 2 days |
| TimetableBuilder | Timetable schedule | 🔴 | 2 days |
| FeeStructureForm | Fee structures | 🟠 | 1 day |
| AnalyticsChart | Dashboards, analytics | 🟡 | 1 day |
| RichTextEditor | Announcements | 🟡 | 1 day |
| StudentForm | Create/edit student | 🟡 | 1 day |
| FacultyForm | Create/edit faculty | 🟡 | 0.5 days |
| InvoiceGenerator | Fee invoices | 🟡 | 1 day |
| ConflictAlert | Timetable conflicts | 🟢 | 0.5 days |

**Total:** 10 components, **~12 days**

---

### D2 TOTAL EFFORT: **~66 days (13+ weeks) - NEEDS HELP!**

**⚠️ RECOMMENDATION:** Split College Admin pages with D1 or D3 after Week 4

---

## 👨‍💻 DEVELOPER 3 - FACULTY PORTAL & SHARED COMPONENTS (10 PAGES + INFRASTRUCTURE)

### Shared Infrastructure (Week 1-3)

| # | Component/Feature | Priority | Complexity | Time |
|---|-------------------|----------|------------|------|
| 63 | **Authentication Flow** | ⭐⭐⭐ | 🟠 | 3 days |
| - | Login/logout logic | | | |
| - | Token management | | | |
| - | Auth context | | | |
| - | Protected routes | | | |
| 64 | **Basic UI Components** | ⭐⭐⭐ | 🟡 | 3 days |
| - | Button, Input, Card, Badge, Alert | | | |
| 65 | **Advanced UI Components** | ⭐⭐ | 🟠 | 5 days |
| - | DataTable, FileUpload, DatePicker | | | |
| - | Chart wrappers, Tabs, Pagination, Toast | | | |

**Total Infrastructure:** **~11 days**

---

### Faculty Portal (`/apps/faculty`) - 13 Pages

| # | Page | Route | Priority | Complexity | Time | API Calls |
|---|------|-------|----------|------------|------|-----------|
| 66 | **Dashboard** | `/dashboard` | ⭐⭐⭐ | 🟡 | 1 day | GET /faculty/timetable, assessments |
| 67 | **Timetable Weekly** | `/timetable/weekly` | ⭐⭐ | 🟡 | 1.5 days | GET /faculty/timetable |
| 68 | **Timetable Exceptions** | `/timetable/exceptions` | ⭐ | 🟡 | 1 day | POST /faculty/timetable/exceptions |
| 69 | **Mark Attendance** | `/attendance/mark` | ⭐⭐⭐ | 🟠 | 3 days | POST /faculty/attendance/mark |
| 70 | **Attendance History** | `/attendance/history` | ⭐⭐ | 🟢 | 1 day | GET /faculty/attendance/history |
| 71 | **Attendance Corrections** | `/attendance/corrections` | ⭐ | 🟡 | 1 day | POST /faculty/attendance/corrections |
| 72 | **Attendance Reports** | `/attendance/reports` | ⭐ | 🟡 | 1 day | GET /faculty/attendance/reports |
| 73 | **Assessments List** | `/assessments` | ⭐⭐⭐ | 🟡 | 1 day | GET /faculty/assessments |
| 74 | **Create Assessment** | `/assessments/create` | ⭐⭐⭐ | 🔴 | 3 days | POST /faculty/assessments |
| 75 | **Assessment Detail** | `/assessments/[id]` | ⭐⭐ | 🟡 | 1 day | GET /faculty/assessments/{id} |
| 76 | **Manage Questions** | `/assessments/[id]/questions` | ⭐⭐ | 🔴 | 2 days | POST /faculty/assessments/{id}/questions |
| 77 | **View Submissions** | `/assessments/[id]/submissions` | ⭐⭐⭐ | 🟡 | 1.5 days | GET /faculty/assessments/{id}/submissions |
| 78 | **Grading Interface** | `/assessments/[id]/grading` | ⭐⭐⭐ | 🔴 | 3 days | POST /faculty/assessments/{id}/grade |
| 79 | **My Uploads** | `/library/my-uploads` | ⭐⭐ | 🟡 | 1 day | GET /faculty/library/resources |
| 80 | **Upload Resource** | `/library/upload` | ⭐⭐ | 🟡 | 1.5 days | POST /faculty/library/resources |
| 81 | **Browse Library** | `/library/browse` | ⭐ | 🟢 | 0.5 days | GET /learner/library/resources |
| 82 | **My Classes** | `/students/classes` | ⭐⭐ | 🟡 | 1 day | GET /faculty/students |
| 83 | **Student Detail** | `/students/[id]` | ⭐ | 🟢 | 0.5 days | GET /admin/students/{id} |
| 84 | **Profile** | `/profile` | ⭐ | 🟡 | 1 day | GET/PATCH /faculty/profile |

**Total:** 19 pages, **~27 days**

---

### D3 Components to Build

| Component | Used In | Complexity | Time |
|-----------|---------|------------|------|
| AttendanceMarkingForm | Mark attendance | 🟠 | 1.5 days |
| AssessmentBuilder | Create assessment | 🔴 | 2 days |
| QuestionBuilder | Manage questions | 🔴 | 2 days |
| GradingInterface | Grading | 🟠 | 1.5 days |
| SubmissionViewer | View submissions | 🟡 | 1 day |

**Total:** 5 components, **~8 days**

---

### D3 TOTAL EFFORT: **~46 days (9+ weeks)**

---

## 📊 WORKLOAD SUMMARY

| Developer | Pages | Components | Total Days | Weeks |
|-----------|-------|------------|-----------|-------|
| **D1** | 21 | 10 | **31** | 6-7 |
| **D2** | 39 | 10 | **66** | 13+ ⚠️ |
| **D3** | 19 + Infrastructure | 15 | **46** | 9+ |

**⚠️ PROBLEM:** D2 is overloaded!

---

## ✅ RECOMMENDED REBALANCING

### Option 1: Split College Admin Pages

**Move to D1 (after Week 4):**
- Documents Folders & Verification (2 pages, 2 days)
- Announcement Analytics (1 page, 1 day)
- Assessment Analytics (1 page, 1.5 days)

**Move to D3 (after Week 5):**
- Faculty List & Detail (2 pages, 2.5 days)
- Departments (1 page, 1 day)
- Library Categories (1 page, 0.5 days)

**New Distribution:**
- **D1:** 21 → 25 pages, **35 days** (7 weeks)
- **D2:** 39 → 35 pages, **58 days** (11-12 weeks)
- **D3:** 19 → 23 pages, **50 days** (10 weeks)

---

### Option 2: Assign Help Pages

**Move to D1:**
- All "read-only" pages (parent portal naturally fits)
- Simple list pages

**Move to D3:**
- All form-heavy pages (natural fit with assessment builder)

---

## 🎯 FINAL RECOMMENDED ALLOCATION

### Developer 1 - STUDENT, PARENT & DOCUMENTS (25 PAGES)
- Student Portal (15 pages)
- Parent Portal (6 pages)
- College Admin Documents (2 pages)
- College Admin Announcements Analytics (1 page)
- College Admin Assessment Analytics (1 page)

**Total:** 25 pages, **~35 days (7 weeks)**

---

### Developer 2 - ADMIN DASHBOARDS & DATA (35 PAGES)
- Super Admin Portal (9 pages)
- College Admin Dashboard (1 page)
- College Admin Students (4 pages)
- College Admin Fees (4 pages)
- College Admin Library (3 pages)
- College Admin Timetable (2 pages)
- College Admin Attendance (3 pages)
- College Admin Assessments (2 pages)
- College Admin Announcements (2 pages)
- College Admin Analytics (1 page)

**Total:** 35 pages, **~58 days (11-12 weeks)**

---

### Developer 3 - FACULTY, COMPONENTS & FORMS (23 PAGES + INFRASTRUCTURE)
- Authentication (all portals)
- Shared UI Components (15+)
- Faculty Portal (19 pages)
- College Admin Faculty (2 pages)
- College Admin Departments (1 page)
- College Admin Library Categories (1 page)

**Total:** 23 pages + infrastructure, **~50 days (10 weeks)**

---

## 🎉 CONCLUSION

With rebalancing:
- **D1:** 7 weeks (user experience)
- **D2:** 11-12 weeks (admin power tools) - Still most complex
- **D3:** 10 weeks (infrastructure + teaching tools)

**Actual Timeline:** **12 weeks** (accounting for parallel work and overlaps)

**Recommendation:** Start with infrastructure (D3 Week 1-2), then all three developers work in parallel.

---

**Document Version:** 1.0  
**Last Updated:** October 10, 2025  
**Status:** Ready for Team Discussion
