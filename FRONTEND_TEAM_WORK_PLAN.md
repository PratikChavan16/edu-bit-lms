# 🚀 Frontend Development Team Work Plan
**Project:** EduBit LMS - Bitflow Nova  
**Team Size:** 3 Frontend Developers  
**Timeline:** 6-8 Weeks  
**Last Updated:** October 10, 2025

---

## 📊 PROJECT UNDERSTANDING SUMMARY

### What We're Building
A **multi-tenant Learning Management System** with 5 distinct user portals:
1. **Super Admin Portal** - System-wide management (Bitflow Nova team)
2. **College Admin Portal** - College operations management
3. **Faculty Portal** - Teaching, attendance, assessments
4. **Student Portal (Learner)** - Learning, submissions, self-service
5. **Parent Portal** - Read-only monitoring of children

### Current Backend Status
- ✅ **95% Complete** - 135+ API endpoints functional
- ✅ **85% Test Coverage** - Production-ready
- ✅ **Complete Authentication** - Laravel Sanctum with JWT
- ✅ **Full Database Schema** - 20+ tables with relationships
- ✅ **Analytics & Reports** - PDF/Excel exports ready

### Frontend Status
- 🟡 **25% Complete** - Basic scaffolding only
- ✅ Monorepo structure (Next.js 15 + React 19)
- ✅ Shared UI component library scaffolded
- ✅ TanStack Query API client package ready
- ❌ **Pages to Build:** 50+ pages across 5 portals

### Technology Stack
```json
{
  "framework": "Next.js 15 (App Router)",
  "language": "TypeScript",
  "styling": "Tailwind CSS",
  "state": "React Context + TanStack Query",
  "apiClient": "Axios with interceptors",
  "forms": "React Hook Form + Zod",
  "charts": "Recharts",
  "icons": "Lucide Icons",
  "components": "Radix UI + Custom"
}
```

---

## 🎯 WORK DIVISION STRATEGY

### Team Member Roles

#### **Developer 1 (D1) - Student & Parent Portals Lead**
**Focus:** User-facing learning experience
- Student Portal (Learner) - 10 pages
- Parent Portal - 6 pages
- Shared components for students/parents
- **Complexity:** Medium (data visualization, interactive features)

#### **Developer 2 (D2) - Admin Portals Lead**
**Focus:** Administrative & management interfaces
- Super Admin Portal - 9 pages
- College Admin Portal - 15 pages
- Bulk upload interfaces
- **Complexity:** High (complex forms, data tables, approvals)

#### **Developer 3 (D3) - Faculty Portal & Shared Components**
**Focus:** Teaching tools & reusable UI library
- Faculty Portal - 10 pages
- Shared UI Component Library - 15+ components
- Authentication flow (shared across all portals)
- **Complexity:** Medium-High (assessment builder, grading interface)

---

## 📋 DETAILED WORK BREAKDOWN

---

## 👨‍💻 DEVELOPER 1 - STUDENT & PARENT PORTALS

### **Student Portal (Learner)** - `/apps/learner`

#### Phase 1: Authentication & Dashboard (Week 1-2)
**Priority: CRITICAL ⭐⭐⭐**

##### 1.1 Login Page (`/login`)
```tsx
File: apps/learner/app/login/page.tsx
```
**Features:**
- Email/password form with validation
- Show/hide password toggle
- "Remember me" checkbox
- Forgot password link
- Error handling with toast notifications
- Loading state during authentication
- Auto-redirect to dashboard on success

**API Integration:**
```typescript
POST /api/auth/login
{
  "email": "student@example.com",
  "password": "password123",
  "remember": true
}
```

**Components Needed:**
- Input field (with error states)
- Button (primary, loading states)
- Checkbox
- Toast/Alert component

**Estimated Time:** 1 day

---

##### 1.2 Dashboard (`/dashboard`)
```tsx
File: apps/learner/app/dashboard/page.tsx
```
**Features:**
- Welcome banner with student name
- Profile widget with quick stats
- Attendance graph (last 30 days line chart)
- Fee status widget (progress bar)
- Today's timetable widget
- Upcoming assessments list
- Recent announcements feed (last 5)
- Quick action buttons

**API Calls:**
```typescript
GET /api/auth/me                              // User profile
GET /api/learner/profile                      // Student details
GET /api/learner/profile/attendance?days=30   // Attendance graph data
GET /api/learner/profile/fees                 // Fee widget data
GET /api/learner/profile/timetable            // Today's schedule
GET /api/learner/assessments?status=upcoming  // Upcoming tests
GET /api/learner/announcements?limit=5        // Recent announcements
```

**Components Needed:**
- Card (with header, content, footer)
- AttendanceGraph (Recharts line chart)
- FeeStatusWidget (progress bar, amounts)
- TimetableWidget (today's classes)
- AnnouncementsWidget (list with badges)
- LoadingSkeleton

**Data Transformations:**
```typescript
// Attendance graph data
interface AttendanceGraphData {
  date: string;
  percentage: number;
  present: number;
  total: number;
}

// Fee widget data
interface FeeWidgetData {
  progress_percentage: number;
  amount_paid: number;
  amount_pending: number;
  next_due_date: string;
}
```

**Estimated Time:** 3 days

---

#### Phase 2: Core Student Features (Week 3-4)

##### 1.3 Library Resources Page (`/library`)
```tsx
Files:
- apps/learner/app/library/page.tsx
- apps/learner/app/library/[id]/page.tsx
```

**Features:**
- Search bar with filters (type, category, subject)
- Resource cards grid layout
- Resource type badges (Book, Notes, Video, etc.)
- Bookmark functionality
- Status indicator (Available, Issued, Reserved)
- Download/view button
- Resource detail modal/page

**API Calls:**
```typescript
GET /api/learner/library/resources?type=book&search=python
GET /api/learner/library/resources/{id}
POST /api/learner/library/resources/{id}/bookmark
DELETE /api/learner/library/resources/{id}/bookmark
```

**Components Needed:**
- SearchBar with filters
- ResourceCard
- Badge (for type/status)
- Bookmark button (toggle state)
- Modal/Drawer for details

**Estimated Time:** 2 days

---

##### 1.4 Assessments Pages (`/assessments`)
```tsx
Files:
- apps/learner/app/assessments/page.tsx
- apps/learner/app/assessments/[id]/page.tsx
- apps/learner/app/assessments/[id]/attempt/page.tsx
- apps/learner/app/assessments/[id]/result/page.tsx
```

**Features:**
- Tab navigation (Pending, Submitted, Graded)
- Assessment cards with countdown timer
- Status badges
- Assessment details page
- **Submission interface:**
  - MCQ: Radio buttons
  - SAQ: Text area
  - LAQ: Text area + file upload option
  - Timer (auto-submit on timeout)
- Results display with marks breakdown
- Past assessments history

**API Calls:**
```typescript
GET /api/learner/assessments                  // List all
GET /api/learner/assessments/{id}             // Details
POST /api/learner/assessments/{id}/submit     // Submit answers
GET /api/learner/assessments/{id}/result      // View grade
```

**Components Needed:**
- Tab component
- AssessmentCard
- CountdownTimer
- MCQ question component
- TextArea with character count
- FileUpload component
- ProgressBar (for multi-page assessments)
- ResultsCard

**Estimated Time:** 3 days

---

##### 1.5 Timetable Page (`/timetable`)
```tsx
Files:
- apps/learner/app/timetable/page.tsx
```

**Features:**
- Weekly calendar view
- Day-wise class blocks
- Subject, faculty, time, room details
- Filter by day
- Today's classes highlighted
- Color-coded by subject

**API Calls:**
```typescript
GET /api/learner/profile/timetable
```

**Components Needed:**
- Calendar/Timetable grid
- TimeBlock component
- Day selector

**Estimated Time:** 2 days

---

##### 1.6 Attendance Page (`/attendance`)
```tsx
Files:
- apps/learner/app/attendance/page.tsx
```

**Features:**
- Monthly attendance graph (bar/line chart)
- Subject-wise breakdown table
- Overall percentage display
- Date range filter
- Download attendance certificate (PDF)
- Low attendance warning (<75%)

**API Calls:**
```typescript
GET /api/learner/profile/attendance?start_date=...&end_date=...
```

**Components Needed:**
- AttendanceGraph (enhanced version)
- SubjectTable
- DateRangePicker
- DownloadButton (PDF export)
- Alert (for low attendance)

**Estimated Time:** 2 days

---

##### 1.7 Documents Page (`/documents`)
```tsx
Files:
- apps/learner/app/documents/page.tsx
- apps/learner/app/documents/upload/page.tsx
```

**Features:**
- Folder structure view
- Document list with status (Verified, Pending, Rejected)
- Upload document interface
- Preview documents (PDF, images)
- Download documents
- Verification status tracking

**API Calls:**
```typescript
GET /api/learner/documents                    // List all
POST /api/learner/documents/upload            // Upload new
GET /api/learner/documents/{id}               // View/download
```

**Components Needed:**
- FolderTree
- DocumentCard
- FileUploadDropzone
- DocumentViewer (PDF/image preview)
- StatusBadge

**Estimated Time:** 2 days

---

##### 1.8 Fees Page (`/fees`)
```tsx
Files:
- apps/learner/app/fees/page.tsx
- apps/learner/app/fees/[id]/page.tsx
```

**Features:**
- Invoice list with status
- Payment history
- Download invoice (PDF)
- Pay online button (Razorpay integration)
- Fee summary dashboard
- Upcoming payments alerts

**API Calls:**
```typescript
GET /api/learner/profile/fees                 // Summary
GET /api/learner/fees/invoices                // All invoices
GET /api/learner/fees/invoices/{id}           // Invoice details
POST /api/learner/fees/invoices/{id}/pay      // Initiate payment
```

**Components Needed:**
- InvoiceCard
- PaymentButton (Razorpay modal)
- InvoiceDetailView
- PaymentHistoryTable
- DownloadButton

**Estimated Time:** 2 days

---

##### 1.9 Announcements Page (`/announcements`)
```tsx
Files:
- apps/learner/app/announcements/page.tsx
- apps/learner/app/announcements/[id]/page.tsx
```

**Features:**
- Announcement list (priority badges)
- Filter by priority & type
- Unread indicator (blue dot)
- Mark as read
- Full announcement view
- Pinned announcements at top

**API Calls:**
```typescript
GET /api/learner/announcements                // List
GET /api/learner/announcements/{id}           // Details
POST /api/learner/announcements/{id}/read     // Mark as read
```

**Components Needed:**
- AnnouncementCard
- PriorityBadge
- FilterDropdown
- MarkAsReadButton

**Estimated Time:** 1 day

---

##### 1.10 Profile Page (`/profile`)
```tsx
Files:
- apps/learner/app/profile/page.tsx
```

**Features:**
- Tabbed interface
- Personal info tab (editable form)
- Attendance tab (full graph)
- Fees tab (all invoices)
- Performance tab (grades chart)
- Timetable tab
- Library tab (issued resources)
- Profile picture upload
- Change password

**API Calls:**
```typescript
GET /api/learner/profile                      // Full profile
PATCH /api/learner/profile                    // Update profile
POST /api/learner/profile/picture             // Upload picture
POST /api/auth/change-password                // Change password
```

**Components Needed:**
- Tabs component
- EditableForm
- ProfilePictureUpload
- All previous widgets (reused)

**Estimated Time:** 2 days

---

### **Parent Portal** - `/apps/parent`

#### Phase 3: Parent Portal (Week 5)

##### 1.11 Parent Dashboard (`/parent/dashboard`)
```tsx
File: apps/parent/app/dashboard/page.tsx
```

**Features:**
- Child selector dropdown (if multiple children)
- Read-only view of child's:
  - Attendance summary
  - Recent grades
  - Fee status
  - Recent announcements
  - Performance graph

**API Calls:**
```typescript
GET /api/parent/children                      // List of children
GET /api/parent/children/{id}/dashboard       // Child's dashboard data
```

**Components Needed:**
- ChildSelector
- Reuse student dashboard widgets (read-only mode)

**Estimated Time:** 2 days

---

##### 1.12-1.16 Parent Portal Pages
```tsx
Files:
- apps/parent/app/attendance/page.tsx
- apps/parent/app/assessments/page.tsx
- apps/parent/app/fees/page.tsx
- apps/parent/app/announcements/page.tsx
- apps/parent/app/profile/page.tsx
```

**Features:**
- All read-only versions of student pages
- No edit/submit capabilities
- Contact college admin button

**Estimated Time:** 2 days (reuse components from student portal)

---

### **D1 Summary**
- **Total Pages:** 16 pages
- **Total Time:** 4-5 weeks
- **Complexity:** Medium
- **Key Skills:** Data visualization, forms, API integration

---

## 👨‍💻 DEVELOPER 2 - ADMIN PORTALS

### **Super Admin Portal** - `/apps/admin`

#### Phase 1: Super Admin Core (Week 1-2)

##### 2.1 Admin Dashboard (`/admin/dashboard`)
```tsx
File: apps/admin/app/dashboard/page.tsx
```

**Features:**
- System-wide statistics cards
- University count
- Total students/faculty count
- Active colleges
- System health indicators
- Recent activities feed
- Quick action menu
- Analytics charts (attendance, fees, performance)

**API Calls:**
```typescript
GET /api/admin/analytics/dashboard
GET /api/admin/analytics/attendance
GET /api/admin/analytics/fee-collection
GET /api/admin/analytics/student-performance
```

**Components Needed:**
- StatCard
- ActivityFeed
- AnalyticsChart (bar, line, pie)
- QuickActionMenu

**Estimated Time:** 2 days

---

##### 2.2 Universities Management (`/admin/universities`)
```tsx
Files:
- apps/admin/app/universities/page.tsx
- apps/admin/app/universities/[id]/page.tsx
- apps/admin/app/universities/[id]/colleges/page.tsx
```

**Features:**
- University list with search & filters
- Create/edit university modal
- University details page
- College list under university
- Provisioning status
- Feature toggle controls
- Billing information

**API Calls:**
```typescript
GET /api/admin/universities
POST /api/admin/universities
PATCH /api/admin/universities/{id}
GET /api/admin/universities/{id}/colleges
```

**Components Needed:**
- DataTable (sortable, filterable, paginated)
- UniversityForm
- CollegeList

**Estimated Time:** 3 days

---

##### 2.3 Feature Toggles (`/admin/feature-toggles`)
```tsx
File: apps/admin/app/feature-toggles/page.tsx
```

**Features:**
- Feature flag list
- Toggle switches for each feature
- Per-university feature controls
- Bulk enable/disable
- Feature descriptions

**API Calls:**
```typescript
GET /api/admin/feature-toggles
POST /api/admin/feature-toggles
PATCH /api/admin/feature-toggles/{id}
```

**Components Needed:**
- ToggleSwitch
- FeatureCard
- BulkActionToolbar

**Estimated Time:** 1 day

---

##### 2.4 Audit Log (`/admin/audit-log`)
```tsx
File: apps/admin/app/audit-log/page.tsx
```

**Features:**
- Log entries table
- Filter by user, action, date
- Search by entity
- Export logs (CSV/PDF)
- Log detail modal

**API Calls:**
```typescript
GET /api/admin/audit-logs
```

**Components Needed:**
- LogTable
- FilterPanel
- ExportButton

**Estimated Time:** 2 days

---

##### 2.5 Billing & Invoices (`/admin/billing`, `/admin/invoices`)
```tsx
Files:
- apps/admin/app/billing/page.tsx
- apps/admin/app/invoices/page.tsx
```

**Features:**
- Generate invoices for universities
- Invoice list with status
- Payment tracking
- Download invoices (PDF)
- Billing analytics

**API Calls:**
```typescript
GET /api/admin/billing/invoices
POST /api/admin/billing/invoices
GET /api/admin/billing/analytics
```

**Estimated Time:** 2 days

---

### **College Admin Portal** - `/apps/college-admin`

#### Phase 2: College Admin Core (Week 3-5)

##### 2.6 College Admin Dashboard (`/college-admin/dashboard`)
```tsx
File: apps/college-admin/app/dashboard/page.tsx
```

**Features:**
- College-specific statistics
- Student enrollment trends
- Fee collection status
- Attendance overview
- Recent activities
- Pending approvals count
- Quick actions

**API Calls:**
```typescript
GET /api/admin/analytics/dashboard?college_id={id}
```

**Estimated Time:** 2 days

---

##### 2.7 Student Management (`/college-admin/students`)
```tsx
Files:
- apps/college-admin/app/students/page.tsx
- apps/college-admin/app/students/[id]/page.tsx
- apps/college-admin/app/students/create/page.tsx
- apps/college-admin/app/students/import/page.tsx
```

**Features:**
- Student list with advanced filters
- Search by name, roll number, course
- Student profile view/edit
- Create new student form
- **Bulk import via CSV**
- Student status management
- Export student list

**API Calls:**
```typescript
GET /api/admin/students?college_id={id}
POST /api/admin/students
PATCH /api/admin/students/{id}
POST /api/admin/students/import          // Bulk upload
```

**Components Needed:**
- DataTable (advanced)
- StudentForm (multi-step)
- BulkUploadInterface (CSV template download, drag-drop, validation, preview, errors)
- StudentProfileCard

**Estimated Time:** 4 days (bulk upload is complex)

---

##### 2.8 Faculty Management (`/college-admin/faculty`)
```tsx
Files:
- apps/college-admin/app/faculty/page.tsx
- apps/college-admin/app/faculty/[id]/page.tsx
- apps/college-admin/app/faculty/create/page.tsx
```

**Features:**
- Faculty list
- Faculty profile
- Create/edit faculty
- Subject assignment
- Workload tracking

**API Calls:**
```typescript
GET /api/admin/faculty?college_id={id}
POST /api/admin/faculty
PATCH /api/admin/faculty/{id}
```

**Estimated Time:** 2 days

---

##### 2.9 Fees Management (`/college-admin/fees`)
```tsx
Files:
- apps/college-admin/app/fees/structures/page.tsx
- apps/college-admin/app/fees/invoices/page.tsx
- apps/college-admin/app/fees/payments/page.tsx
- apps/college-admin/app/fees/reports/page.tsx
```

**Features:**
- Fee structure configuration
- Invoice generation
- Payment recording
- Defaulter list
- Collection reports
- Export reports (PDF/Excel)

**API Calls:**
```typescript
GET /api/admin/fees/structures
POST /api/admin/fees/structures
GET /api/admin/fees/invoices
POST /api/admin/fees/invoices/{id}/payments
GET /api/admin/analytics/fee-collection
```

**Components Needed:**
- FeeStructureForm
- InvoiceGenerator
- PaymentRecordForm
- FeeReportsTable

**Estimated Time:** 3 days

---

##### 2.10 Library Management (`/college-admin/library`)
```tsx
Files:
- apps/college-admin/app/library/resources/page.tsx
- apps/college-admin/app/library/categories/page.tsx
- apps/college-admin/app/library/approval-queue/page.tsx
```

**Features:**
- Resource management (CRUD)
- Category management
- Approval workflow for faculty uploads
- Resource status tracking
- Bulk upload resources

**API Calls:**
```typescript
GET /api/admin/library/resources
POST /api/admin/library/resources
POST /api/admin/library/resources/{id}/approve
GET /api/admin/library/categories
```

**Estimated Time:** 2 days

---

##### 2.11 Timetable Management (`/college-admin/timetable`)
```tsx
Files:
- apps/college-admin/app/timetable/schedule/page.tsx
- apps/college-admin/app/timetable/conflicts/page.tsx
```

**Features:**
- Timetable builder (drag-drop interface)
- Conflict detection (same faculty, same time)
- Exception management (holidays, events)
- View by course/year/section
- Export timetable (PDF)

**API Calls:**
```typescript
GET /api/admin/timetable
POST /api/admin/timetable
PATCH /api/admin/timetable/{id}
DELETE /api/admin/timetable/{id}
```

**Components Needed:**
- TimetableBuilder (complex drag-drop)
- ConflictAlert
- ExceptionForm

**Estimated Time:** 4 days (complex UI)

---

##### 2.12 Attendance Management (`/college-admin/attendance`)
```tsx
Files:
- apps/college-admin/app/attendance/overview/page.tsx
- apps/college-admin/app/attendance/corrections/page.tsx
- apps/college-admin/app/attendance/reports/page.tsx
```

**Features:**
- College-wide attendance overview
- Approve attendance corrections
- Generate reports
- Low attendance alerts

**API Calls:**
```typescript
GET /api/admin/attendance/corrections
POST /api/admin/attendance/corrections/{id}/approve
GET /api/admin/analytics/attendance
```

**Estimated Time:** 2 days

---

##### 2.13 Assessments Management (`/college-admin/assessments`)
```tsx
Files:
- apps/college-admin/app/assessments/list/page.tsx
- apps/college-admin/app/assessments/results/page.tsx
- apps/college-admin/app/assessments/analytics/page.tsx
```

**Features:**
- View all assessments
- Grade management
- Performance analytics
- Export results

**Estimated Time:** 2 days

---

##### 2.14 Documents Management (`/college-admin/documents`)
```tsx
Files:
- apps/college-admin/app/documents/folders/page.tsx
- apps/college-admin/app/documents/verification/page.tsx
```

**Features:**
- Folder management
- Document verification workflow
- Bulk document requests

**Estimated Time:** 1 day

---

##### 2.15 Announcements (`/college-admin/announcements`)
```tsx
Files:
- apps/college-admin/app/announcements/create/page.tsx
- apps/college-admin/app/announcements/schedule/page.tsx
- apps/college-admin/app/announcements/analytics/page.tsx
```

**Features:**
- Create announcements (rich text editor)
- Schedule future announcements
- Target audience selection
- Read analytics

**API Calls:**
```typescript
GET /api/admin/announcements
POST /api/admin/announcements
POST /api/admin/announcements/{id}/publish
```

**Components Needed:**
- RichTextEditor (TipTap or Quill)
- ScheduleForm
- AudienceSelector

**Estimated Time:** 2 days

---

##### 2.16 Analytics Dashboard (`/college-admin/analytics`)
```tsx
File: apps/college-admin/app/analytics/page.tsx
```

**Features:**
- Student performance trends
- Faculty workload analysis
- Fee collection insights
- Library usage statistics
- Custom date ranges
- Export reports

**API Calls:**
```typescript
GET /api/admin/analytics/student-performance
GET /api/admin/analytics/fee-collection
GET /api/admin/analytics/library-usage
```

**Estimated Time:** 2 days

---

### **D2 Summary**
- **Total Pages:** 24 pages
- **Total Time:** 5-6 weeks
- **Complexity:** High
- **Key Skills:** Complex forms, data tables, bulk operations, analytics

---

## 👨‍💻 DEVELOPER 3 - FACULTY PORTAL & SHARED COMPONENTS

### **Shared Authentication** (Week 1)

#### 3.1 Authentication Flow (All Portals)
```tsx
Files:
- packages/api-client/src/auth.ts
- context/AuthContext.tsx
- middleware.ts (route protection)
```

**Features:**
- Login/logout logic
- Token management (localStorage)
- Auth context provider
- Protected route middleware
- Role-based redirects
- Token refresh logic

**Components:**
- LoginForm (reusable)
- ForgotPasswordForm
- ChangePasswordForm

**Estimated Time:** 3 days

---

### **Shared UI Component Library** (Week 2-3)

#### 3.2 Core Components (`/packages/ui/src/`)

##### Basic Components
1. **Button** (`button.tsx`)
   - Variants: primary, secondary, ghost, destructive
   - Sizes: sm, md, lg
   - Loading state
   - Icon support

2. **Input** (`input.tsx`)
   - Text, email, password, number types
   - Error states
   - Label integration
   - Helper text

3. **Card** (`card.tsx`)
   - Header, content, footer sections
   - Variants: default, bordered, elevated

4. **Badge** (`badge.tsx`)
   - Variants: default, success, warning, error, info
   - Sizes: sm, md, lg

5. **Alert** (`alert.tsx`)
   - Types: info, success, warning, error
   - Dismissible
   - Icon support

6. **Modal/Dialog** (`modal.tsx`)
   - Backdrop click handling
   - Close button
   - Header, content, footer
   - Size variants

7. **Dropdown** (`dropdown.tsx`)
   - Menu items
   - Keyboard navigation
   - Multi-select support

8. **Checkbox & Radio** (`checkbox.tsx`, `radio.tsx`)
   - Label integration
   - Group support
   - Indeterminate state (checkbox)

##### Advanced Components

9. **DataTable** (`data-table.tsx`)
   - Sortable columns
   - Filterable
   - Paginated
   - Row selection
   - Bulk actions
   - Export functionality

10. **FileUpload** (`file-upload.tsx`)
    - Drag-and-drop
    - File preview (images, PDFs)
    - Progress bar
    - File type validation
    - Size limit
    - Multiple file support

11. **DatePicker** (`date-picker.tsx`)
    - Single date
    - Date range
    - Calendar popup
    - Min/max date constraints

12. **Chart Components** (`chart.tsx`)
    - LineChart wrapper (Recharts)
    - BarChart wrapper
    - PieChart wrapper
    - Customizable colors/tooltips

13. **Tabs** (`tabs.tsx`)
    - Horizontal/vertical orientation
    - Active state
    - Badge count on tabs

14. **Pagination** (`pagination.tsx`)
    - Page numbers
    - Next/previous
    - Jump to page
    - Items per page selector

15. **Toast** (`toast.tsx`)
    - Success, error, warning, info types
    - Auto-dismiss
    - Action button support
    - Queue multiple toasts

**Estimated Time:** 5 days

---

### **Faculty Portal** - `/apps/faculty`

#### Phase 2: Faculty Core (Week 4-5)

##### 3.3 Faculty Dashboard (`/faculty/dashboard`)
```tsx
File: apps/faculty/app/dashboard/page.tsx
```

**Features:**
- Today's schedule widget
- Upcoming assessments
- Attendance summary
- Recent announcements
- Quick actions (mark attendance, create assessment)

**API Calls:**
```typescript
GET /api/faculty/timetable
GET /api/faculty/assessments
```

**Estimated Time:** 1 day

---

##### 3.4 Timetable (`/faculty/timetable`)
```tsx
Files:
- apps/faculty/app/timetable/weekly/page.tsx
- apps/faculty/app/timetable/exceptions/page.tsx
```

**Features:**
- Weekly schedule view
- My classes highlighted
- Request timetable changes
- Exception requests (leave, substitution)

**API Calls:**
```typescript
GET /api/faculty/timetable
POST /api/faculty/timetable/exceptions
```

**Estimated Time:** 2 days

---

##### 3.5 Attendance (`/faculty/attendance`)
```tsx
Files:
- apps/faculty/app/attendance/mark/page.tsx
- apps/faculty/app/attendance/history/page.tsx
- apps/faculty/app/attendance/corrections/page.tsx
```

**Features:**
- **Mark attendance interface:**
  - Select class/subject
  - Student list with checkboxes
  - Bulk actions (mark all present/absent)
  - Late/excused status
  - Save as draft
  - Submit attendance
- Attendance history view
- Request corrections

**API Calls:**
```typescript
GET /api/faculty/attendance/classes        // My classes
POST /api/faculty/attendance/mark          // Submit attendance
GET /api/faculty/attendance/history
POST /api/faculty/attendance/corrections
```

**Components Needed:**
- AttendanceMarkingForm
- StudentCheckboxList
- BulkActionToolbar

**Estimated Time:** 3 days

---

##### 3.6 Assessments (`/faculty/assessments`)
```tsx
Files:
- apps/faculty/app/assessments/page.tsx
- apps/faculty/app/assessments/create/page.tsx
- apps/faculty/app/assessments/[id]/page.tsx
- apps/faculty/app/assessments/[id]/questions/page.tsx
- apps/faculty/app/assessments/[id]/submissions/page.tsx
- apps/faculty/app/assessments/[id]/grading/page.tsx
```

**Features:**
- **Assessment Builder:**
  - Multi-step form (details, questions, settings)
  - Assessment type (MCQ, SAQ, LAQ, Practical, Project)
  - Question bank integration
  - Add/edit/remove questions
  - Set marks per question
  - Time limit setting
  - Start/end date
  - Auto-grading config (MCQ)
  - Draft/publish

- **View Submissions:**
  - Student list with submission status
  - Filter by status (pending, submitted, graded)
  - View individual submission

- **Grading Interface:**
  - View student answers
  - Enter marks per question
  - Add feedback/comments
  - Bulk grading (assign same marks)
  - Submit grades

**API Calls:**
```typescript
GET /api/faculty/assessments
POST /api/faculty/assessments
PATCH /api/faculty/assessments/{id}
POST /api/faculty/assessments/{id}/questions
GET /api/faculty/assessments/{id}/submissions
POST /api/faculty/assessments/{id}/submissions/{submissionId}/grade
```

**Components Needed:**
- AssessmentForm (multi-step)
- QuestionBuilder
- QuestionBankModal
- SubmissionList
- GradingForm
- MarkdownEditor (for questions)

**Estimated Time:** 5 days (most complex feature)

---

##### 3.7 Library (`/faculty/library`)
```tsx
Files:
- apps/faculty/app/library/my-uploads/page.tsx
- apps/faculty/app/library/upload/page.tsx
- apps/faculty/app/library/browse/page.tsx
```

**Features:**
- My uploaded resources
- Upload new resource (notes, videos, assignments)
- Browse all resources
- Approval status tracking

**API Calls:**
```typescript
GET /api/faculty/library/resources
POST /api/faculty/library/resources
GET /api/learner/library/resources            // Browse all
```

**Estimated Time:** 2 days

---

##### 3.8 Students View (`/faculty/students`)
```tsx
Files:
- apps/faculty/app/students/classes/page.tsx
- apps/faculty/app/students/[id]/page.tsx
```

**Features:**
- My classes (students enrolled in my subjects)
- Student details view
- Performance tracking
- Contact information

**API Calls:**
```typescript
GET /api/faculty/students?class_id={id}
GET /api/admin/students/{id}
```

**Estimated Time:** 1 day

---

##### 3.9 Profile (`/faculty/profile`)
```tsx
File: apps/faculty/app/profile/page.tsx
```

**Features:**
- Personal information
- Assigned subjects
- Timetable
- Upload profile picture
- Change password

**Estimated Time:** 1 day

---

### **D3 Summary**
- **Total Pages:** 10 pages (Faculty) + Auth flow + 15 shared components
- **Total Time:** 5-6 weeks
- **Complexity:** Medium-High
- **Key Skills:** Reusable components, complex forms, assessment builder

---

## 📅 TIMELINE & MILESTONES

### **Week 1-2: Foundation**
- **D1:** Login + Student Dashboard + Library
- **D2:** Super Admin Dashboard + Universities
- **D3:** Authentication + Basic UI Components

**Milestone:** Authentication working, basic dashboards visible

---

### **Week 3-4: Core Features**
- **D1:** Assessments + Timetable + Attendance
- **D2:** Student Management + Fees + Timetable Builder
- **D3:** Advanced UI Components + Faculty Dashboard

**Milestone:** Student can view/submit assessments, Admin can manage students

---

### **Week 5-6: Advanced Features**
- **D1:** Documents + Fees + Profile + Parent Portal
- **D2:** Library + Attendance + Assessments + Announcements
- **D3:** Faculty Assessments + Grading + Library

**Milestone:** All core workflows functional

---

### **Week 7-8: Polish & Testing**
- **All Devs:** Bug fixes, UI polish, responsive design, testing
- **D1:** E2E tests for student flows
- **D2:** E2E tests for admin flows
- **D3:** Component unit tests

**Milestone:** Production-ready frontend

---

## 🛠️ SHARED SETUP TASKS (All Developers)

### Initial Setup (Day 1)
```bash
# Clone repository
git clone https://github.com/PratikChavan16/edu-bit-lms.git
cd edu-bit-lms

# Install dependencies
cd bitflow-frontend
pnpm install

# Setup environment variables
cd apps/admin
cp .env.example .env.local
# Edit .env.local: NEXT_PUBLIC_API_URL=http://localhost:8000/api

cd ../learner
cp .env.example .env.local
# Same for other apps

# Start dev servers
pnpm --filter admin dev        # http://localhost:3000
pnpm --filter learner dev      # http://localhost:3001
pnpm --filter faculty dev      # http://localhost:3002
```

### API Client Setup (D3 - Week 1)
```typescript
// packages/api-client/src/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Handle 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

---

## 📊 COMPONENT REUSABILITY MATRIX

| Component | Used By | Priority |
|-----------|---------|----------|
| Button | All portals | ⭐⭐⭐ Critical |
| Input | All portals | ⭐⭐⭐ Critical |
| Card | All dashboards | ⭐⭐⭐ Critical |
| DataTable | Admin, Faculty | ⭐⭐⭐ Critical |
| FileUpload | Student, Faculty, Admin | ⭐⭐⭐ Critical |
| Chart | Dashboards, Analytics | ⭐⭐ High |
| Modal | All portals | ⭐⭐ High |
| Badge | All portals | ⭐⭐ High |
| Tabs | Profile pages | ⭐⭐ High |
| DatePicker | Admin, Faculty | ⭐ Medium |
| Toast | All portals | ⭐⭐⭐ Critical |

**Strategy:** D3 builds shared components first, D1 & D2 consume them

---

## 🧪 TESTING STRATEGY

### Unit Tests
**Who:** All developers for their own components
**What:** Test individual components in isolation
**Tool:** Vitest + React Testing Library
**Coverage Goal:** 70%+

Example:
```tsx
// Button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalled();
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
```

### Integration Tests
**Who:** All developers for their pages
**What:** Test page workflows
**Tool:** Vitest + MSW (Mock Service Worker)

Example:
```tsx
// StudentDashboard.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { StudentDashboard } from './page';

const server = setupServer(
  rest.get('/api/learner/profile', (req, res, ctx) => {
    return res(ctx.json({ name: 'John Doe', roll_number: '2021CS001' }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('StudentDashboard', () => {
  it('displays student name', async () => {
    render(<StudentDashboard />);
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });
});
```

### E2E Tests
**Who:** All developers (Week 7-8)
**What:** Test complete user flows
**Tool:** Playwright

Example:
```typescript
// e2e/student-assessment.spec.ts
import { test, expect } from '@playwright/test';

test('student can submit assessment', async ({ page }) => {
  await page.goto('/login');
  await page.fill('input[name="email"]', 'student@example.com');
  await page.fill('input[name="password"]', 'password');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  await page.goto('/assessments');
  await page.click('text=Mid-Term Exam');
  await page.click('text=Start Assessment');

  // Fill in answers
  await page.check('input[value="Option A"]');
  await page.fill('textarea', 'My answer for SAQ');

  await page.click('text=Submit Assessment');
  await expect(page.locator('text=Assessment submitted successfully')).toBeVisible();
});
```

---

## 📝 CODE REVIEW PROCESS

### Daily Stand-ups (10 AM)
Each developer reports:
1. What I completed yesterday
2. What I'm working on today
3. Any blockers

### Pull Request (PR) Guidelines
1. **Branch naming:** `feature/D1-student-dashboard` or `fix/D2-fee-calculation`
2. **PR title:** Clear description (e.g., "Add Student Dashboard with Attendance Graph")
3. **Description:** Include screenshots/screen recordings
4. **Review:** At least 1 other developer must approve
5. **Testing:** All tests must pass (GitHub Actions)
6. **Merge:** Squash and merge to `main`

### PR Checklist
- [ ] Code follows TypeScript best practices
- [ ] Components are responsive (mobile, tablet, desktop)
- [ ] No console errors or warnings
- [ ] Proper error handling
- [ ] Loading states implemented
- [ ] API calls use proper error handling
- [ ] Tests written (if applicable)
- [ ] Documentation updated

---

## 🔧 TOOLING & DEPENDENCIES

### Required Packages (install as needed)
```bash
# Forms
pnpm add react-hook-form @hookform/resolvers zod

# API Client
pnpm add axios @tanstack/react-query

# UI Components
pnpm add @radix-ui/react-dialog @radix-ui/react-dropdown-menu
pnpm add @radix-ui/react-tabs @radix-ui/react-select

# Charts
pnpm add recharts

# Date handling
pnpm add date-fns

# File upload
pnpm add react-dropzone

# Rich text editor (for admin announcements)
pnpm add @tiptap/react @tiptap/starter-kit

# PDF generation (client-side)
pnpm add jspdf html2canvas

# Icons
pnpm add lucide-react

# Utilities
pnpm add clsx tailwind-merge

# Toast notifications
pnpm add sonner

# Payment gateway (for fees)
pnpm add razorpay
```

---

## 🎨 DESIGN GUIDELINES

### Colors (Tailwind Classes)
```css
/* Primary (Blue) */
bg-blue-600 text-blue-600 border-blue-600

/* Success (Green) */
bg-green-600 text-green-600

/* Warning (Orange) */
bg-orange-600 text-orange-600

/* Error (Red) */
bg-red-600 text-red-600

/* Neutral (Gray) */
bg-gray-100 bg-gray-200 text-gray-600 text-gray-900
```

### Spacing
```css
/* Padding */
p-4    /* 16px - Default for cards */
p-6    /* 24px - Large cards */
p-2    /* 8px - Buttons */

/* Margin */
mb-4   /* 16px - Between sections */
mb-6   /* 24px - Between major sections */

/* Gap (for grids/flex) */
gap-4  /* 16px - Default grid gap */
gap-6  /* 24px - Between cards */
```

### Typography
```css
/* Headings */
text-3xl font-bold    /* Page title */
text-2xl font-semibold /* Section title */
text-xl font-medium   /* Subsection */

/* Body */
text-base             /* Regular text */
text-sm text-gray-600 /* Secondary text */
```

### Responsive Breakpoints
```css
/* Mobile first approach */
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

/* Breakpoints: */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
```

---

## 🚨 COMMON PITFALLS & SOLUTIONS

### 1. API CORS Issues
**Problem:** `Access-Control-Allow-Origin` error  
**Solution:** Ensure backend has CORS enabled for `http://localhost:3000`, `3001`, `3002`

### 2. Authentication Token Not Persisting
**Problem:** User logged out on page refresh  
**Solution:** Store token in `localStorage`, read on app initialization

### 3. Slow Data Tables
**Problem:** DataTable lags with 1000+ rows  
**Solution:** Implement server-side pagination, load only 20-50 rows at a time

### 4. Chart Not Responsive
**Problem:** Chart overflows on mobile  
**Solution:** Use `ResponsiveContainer` from Recharts

### 5. File Upload Fails
**Problem:** Large files not uploading  
**Solution:** Implement chunked upload or increase backend file size limit

---

## 📞 COMMUNICATION CHANNELS

### Slack Channels
- `#frontend-team` - General frontend discussions
- `#api-integration` - API questions
- `#design-system` - UI component discussions
- `#bugs` - Bug reports
- `#daily-standup` - Daily updates

### GitHub Projects Board
- **Columns:** To Do, In Progress, Review, Done
- **Labels:** `D1-student`, `D2-admin`, `D3-faculty`, `bug`, `enhancement`

### Weekly Sync (Fridays 3 PM)
- Demo completed features
- Discuss blockers
- Plan next week

---

## ✅ DEFINITION OF DONE (DoD)

A feature is considered "done" when:
- [ ] Code implemented and committed
- [ ] Responsive design (works on mobile/tablet/desktop)
- [ ] API integration complete (real data, not mocked)
- [ ] Error handling implemented
- [ ] Loading states added
- [ ] Unit tests written (if applicable)
- [ ] Peer code review completed
- [ ] Merged to `main` branch
- [ ] Feature tested on dev environment
- [ ] Documentation updated (if needed)

---

## 🎯 SUCCESS METRICS

### Week 4 Checkpoint
- [ ] Authentication working across all portals
- [ ] Student can view dashboard with real data
- [ ] Admin can view dashboard
- [ ] Shared UI component library has 10+ components

### Week 6 Checkpoint
- [ ] Student can submit assessments
- [ ] Faculty can create assessments and grade
- [ ] Admin can manage students (including bulk upload)
- [ ] Timetable visible and editable

### Week 8 Final
- [ ] All 50+ pages implemented
- [ ] All critical user flows work end-to-end
- [ ] 70%+ test coverage
- [ ] Zero critical bugs
- [ ] Responsive on all devices
- [ ] Ready for production deployment

---

## 🚀 FINAL DEPLOYMENT CHECKLIST

- [ ] Environment variables set for production
- [ ] API base URL points to production backend
- [ ] All `console.log` statements removed
- [ ] Build succeeds with no errors (`pnpm build`)
- [ ] Lighthouse score > 90
- [ ] Security headers configured
- [ ] Analytics setup (Google Analytics / Mixpanel)
- [ ] Error monitoring (Sentry)
- [ ] User acceptance testing (UAT) completed
- [ ] Documentation for deployment

---

## 📚 LEARNING RESOURCES

### Next.js 15
- [Official Docs](https://nextjs.org/docs)
- [App Router Guide](https://nextjs.org/docs/app)

### React 19
- [Official Docs](https://react.dev)
- [React Query](https://tanstack.com/query/latest)

### TypeScript
- [Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)

### Tailwind CSS
- [Official Docs](https://tailwindcss.com/docs)
- [Tailwind UI](https://tailwindui.com/) (Paid components)

### Recharts
- [Official Docs](https://recharts.org/en-US/)

---

## 🎉 CONCLUSION

This plan divides **50+ pages** across **3 developers** with clear ownership, realistic timelines, and prioritization. Each developer has a focused domain:

- **D1:** User-facing experience (Student + Parent)
- **D2:** Administrative power tools (Admin portals)
- **D3:** Teaching tools + reusable infrastructure (Faculty + Components)

**Estimated Completion:** 6-8 weeks

**Key to Success:**
1. Start with authentication and core dashboards
2. Build shared components early (D3)
3. Daily communication and code reviews
4. Test as you build (don't leave testing for the end)
5. Focus on MVP features first, enhancements later

---

**Let's build an amazing LMS! 🚀**

*Questions? Reach out in `#frontend-team` Slack channel.*

---

**Document Version:** 1.0  
**Last Updated:** October 10, 2025  
**Status:** Ready for Development
