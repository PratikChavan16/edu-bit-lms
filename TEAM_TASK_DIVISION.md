# 🎯 FRONTEND TEAM TASK DIVISION
**Project:** EduBit LMS - Bitflow Nova  
**Team:** Ameya (Lead), Gauri (Beginner), Manthan (Beginner)  
**Timeline:** 8 weeks  
**Date:** October 10, 2025

---

## 📊 DIVISION STRATEGY

Since **Gauri and Manthan are beginners**, the work is divided based on:
- ✅ **Complexity Level** - Beginners get simpler pages first
- ✅ **Learning Path** - Gradual progression from easy → medium → advanced
- ✅ **Clear Patterns** - Repetitive tasks to build confidence
- ✅ **Mentorship** - Ameya builds infrastructure and mentors

---

## 👥 TEAM ROLES

### 👨‍💻 **AMEYA** - Team Lead & Infrastructure Specialist
**Experience Level:** Advanced  
**Role:** Build foundation + Complex features + Mentor team

### 👩‍💻 **GAURI** - User Experience Developer
**Experience Level:** Beginner  
**Role:** Student & Parent portals (user-facing interfaces)

### 👨‍💻 **MANTHAN** - Admin & CRUD Specialist
**Experience Level:** Beginner  
**Role:** Admin & Faculty portals (data management interfaces)

---

## 📋 DETAILED TASK ALLOCATION

---

## 👨‍💻 AMEYA'S TASKS (Team Lead)

### **Total Work:** ~10 complex pages + Infrastructure + Mentoring
### **Focus:** Build the foundation everyone else needs

---

### **PHASE 1: INFRASTRUCTURE (Week 1-2) - CRITICAL PATH** 🚨

#### 1. Authentication System (Week 1)
**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🔴 High  
**Time:** 3-4 days

**What to Build:**
- Login flow for all 5 portals (Super Admin, College Admin, Faculty, Student, Parent)
- Token management (JWT with refresh)
- Protected routes (redirect if not authenticated)
- Role-based access control (RBAC)
- Logout functionality
- Password reset flow

**Files to Create:**
```
/packages/api-client/src/auth.ts
/packages/ui/src/components/ProtectedRoute.tsx
/packages/ui/src/hooks/useAuth.ts
/packages/ui/src/context/AuthContext.tsx
```

**APIs to Integrate:**
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`
- `POST /api/auth/password/reset`

---

#### 2. Shared Component Library (Week 1-2)
**Priority:** ⭐⭐⭐ CRITICAL  
**Complexity:** 🔴 High  
**Time:** 5-6 days

**Basic Components (Week 1):**
- ✅ Button (primary, secondary, danger variants)
- ✅ Input (text, email, password, number)
- ✅ Textarea
- ✅ Select/Dropdown
- ✅ Checkbox
- ✅ Radio
- ✅ Card
- ✅ Badge
- ✅ Alert (success, error, warning, info)
- ✅ Modal
- ✅ Spinner/Loader

**Advanced Components (Week 2):**
- ✅ DataTable (sortable, filterable, paginated)
- ✅ FileUpload (drag-drop, preview)
- ✅ DatePicker
- ✅ Charts (Line, Bar, Pie using Recharts)
- ✅ Tabs
- ✅ Pagination
- ✅ Toast notifications
- ✅ Breadcrumbs

**Files to Create:**
```
/packages/ui/src/components/Button.tsx
/packages/ui/src/components/Input.tsx
/packages/ui/src/components/DataTable.tsx
/packages/ui/src/components/FileUpload.tsx
/packages/ui/src/components/Charts/LineChart.tsx
... (15+ component files)
```

**Why This is Critical:**
- Gauri & Manthan will use these components in ALL their pages
- Ensures consistent design across all portals
- Reduces duplicate code

---

### **PHASE 2: COMPLEX FEATURES (Week 3-8)**

#### 3. Admin Timetable Builder (Week 3-4)
**Priority:** ⭐⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 4-5 days

**What to Build:**
- Drag-and-drop interface for creating weekly timetables
- Conflict detection (teacher/room double-booking)
- Visual grid layout (days × time slots)
- Bulk operations (copy week, duplicate)

**APIs:**
- `GET /api/timetable/grid`
- `POST /api/timetable/slots`
- `PUT /api/timetable/slots/{id}`
- `POST /api/timetable/validate`

**Tech:**
- Use `react-beautiful-dnd` or `dnd-kit`
- Complex state management

---

#### 4. Admin Bulk Student Upload (Week 4)
**Priority:** ⭐⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 3-4 days

**What to Build:**
- CSV file upload with validation
- Preview data before import
- Error handling (show which rows failed)
- Progress indicator for large uploads
- Download error report

**APIs:**
- `POST /api/students/bulk/validate`
- `POST /api/students/bulk/import`
- `GET /api/students/bulk/status/{jobId}`

**Tech:**
- CSV parsing (`papaparse`)
- Chunked uploads for large files
- Real-time progress updates

---

#### 5. Faculty Assessment Builder (Week 5-6)
**Priority:** ⭐⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 5-6 days

**What to Build:**
- Multi-step form for creating assessments
- Question builder supporting:
  - MCQ (Multiple Choice Questions)
  - SAQ (Short Answer Questions)
  - LAQ (Long Answer Questions)
- Rich text editor for questions
- Image upload for questions
- Marking scheme configuration
- Preview mode

**APIs:**
- `POST /api/assessments`
- `POST /api/assessments/{id}/questions`
- `PUT /api/assessments/{id}/questions/{qid}`
- `POST /api/media/upload`

**Tech:**
- Multi-step form wizard
- Rich text editor (`tiptap` or `lexical`)
- Dynamic form fields

---

#### 6. Faculty Grading Interface (Week 6-7)
**Priority:** ⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 3-4 days

**What to Build:**
- View all student submissions
- Grade SAQ/LAQ responses
- Add feedback comments
- Bulk grade operations
- Export results to CSV

**APIs:**
- `GET /api/assessments/{id}/submissions`
- `PUT /api/submissions/{id}/grade`
- `POST /api/submissions/bulk/grade`
- `GET /api/assessments/{id}/export`

---

#### 7. Admin Analytics Dashboard (Week 7-8)
**Priority:** ⭐⭐ High  
**Complexity:** 🔴 High  
**Time:** 4-5 days

**What to Build:**
- Multiple chart types (revenue, enrollment, attendance trends)
- Date range filters
- Export to PDF/Excel
- Real-time data updates
- KPI cards

**APIs:**
- `GET /api/analytics/revenue`
- `GET /api/analytics/enrollment`
- `GET /api/analytics/attendance`
- `GET /api/analytics/fees`

**Tech:**
- Recharts for visualizations
- Date range picker
- PDF generation (`jspdf`)

---

### **ONGOING: MENTORSHIP & CODE REVIEW (Week 1-8)**

**Daily Responsibilities:**
- ✅ 10 AM Daily Standup (15 min)
- ✅ Code review all PRs from Gauri & Manthan
- ✅ Unblock issues (Slack/pair programming)
- ✅ Architecture decisions

**Weekly Responsibilities:**
- ✅ Friday 3 PM Demo & Planning (60 min)
- ✅ Review progress vs timeline
- ✅ Adjust tasks if needed

---

## 👩‍💻 GAURI'S TASKS (Beginner - User Experience)

### **Total Work:** 16 pages (Student + Parent portals)
### **Focus:** Beautiful, user-friendly interfaces

---

### **WHY THESE PORTALS?**
- ✅ Simpler business logic (mostly displaying data)
- ✅ Clear UI/UX patterns (good for learning)
- ✅ Uses Ameya's components (learn by example)
- ✅ Visual elements (graphs, cards - satisfying to build)
- ✅ Direct user impact (students will love it!)

---

### **STUDENT PORTAL (10 pages)**

---

#### 1. Student Login Page (Week 2)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Login form (email + password)
- "Remember me" checkbox
- "Forgot password" link
- Error messages
- Loading state

**Components to Use (from Ameya):**
- `<Input>`, `<Button>`, `<Checkbox>`, `<Alert>`

**APIs:**
- `POST /api/auth/login`

**Learning Goals:**
- Form handling with React Hook Form
- API integration with Axios
- Error handling
- Loading states

---

#### 2. Student Dashboard (Week 2-3)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟡 Medium  
**Time:** 2-3 days

**What to Build:**
- Welcome message with student name
- Attendance overview card (graph)
- Fee status widget
- Today's timetable widget
- Recent announcements list
- Quick actions (view library, take assessment)

**Components to Use:**
- `<Card>`, `<Badge>`, `<LineChart>`, `<Button>`

**APIs:**
- `GET /api/students/me`
- `GET /api/students/me/attendance`
- `GET /api/students/me/fees`
- `GET /api/students/me/timetable/today`
- `GET /api/announcements?limit=5`

**Learning Goals:**
- Layout composition
- Multiple API calls
- Data visualization
- Responsive design

---

#### 3. Student Library (Week 3)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
- List of educational resources
- Search bar
- Filter by category
- Download/view resource
- Bookmark functionality

**Components to Use:**
- `<Input>`, `<Select>`, `<Card>`, `<Button>`, `<Badge>`

**APIs:**
- `GET /api/library/resources`
- `POST /api/library/resources/{id}/bookmark`

**Learning Goals:**
- List rendering
- Search/filter logic
- File downloads

---

#### 4. Student Timetable (Week 4)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
- Weekly timetable grid (Monday-Friday)
- Time slots with subject names
- Color-coded by subject
- View teacher name on hover
- Current class highlighted

**Components to Use:**
- `<Card>`, `<Badge>`

**APIs:**
- `GET /api/students/me/timetable`

**Learning Goals:**
- Grid layout with CSS Grid
- Date/time handling
- Conditional styling

---

#### 5. Student Attendance (Week 4)
**Priority:** ⭐⭐ High  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Monthly attendance graph (line chart)
- Attendance percentage card
- Subject-wise breakdown (table)
- Date range selector

**Components to Use:**
- `<LineChart>`, `<Card>`, `<DataTable>`, `<DatePicker>`

**APIs:**
- `GET /api/students/me/attendance`
- `GET /api/students/me/attendance/summary`

**Learning Goals:**
- Data visualization
- Date filtering
- Chart customization

---

#### 6. Student Documents (Week 5)
**Priority:** ⭐⭐ High  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Upload documents (ID proof, certificates)
- View uploaded documents (with preview)
- Download documents
- Document status (pending/verified/rejected)
- Delete documents

**Components to Use:**
- `<FileUpload>`, `<Card>`, `<Badge>`, `<Button>`, `<Modal>`

**APIs:**
- `GET /api/students/me/documents`
- `POST /api/students/me/documents/upload`
- `DELETE /api/students/me/documents/{id}`
- `GET /api/students/me/documents/{id}/download`

**Learning Goals:**
- File uploads
- File preview
- CRUD operations

---

#### 7. Student Announcements (Week 5)
**Priority:** ⭐ Medium  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- List of announcements (newest first)
- Mark as read
- Filter by date
- View full announcement in modal

**Components to Use:**
- `<Card>`, `<Badge>`, `<Modal>`, `<Button>`

**APIs:**
- `GET /api/announcements`
- `PUT /api/announcements/{id}/read`

**Learning Goals:**
- List with pagination
- Modal interactions
- State updates

---

#### 8. Student Profile (Week 6)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
- View personal information
- Edit contact details
- Change password
- Upload profile photo
- View academic info (read-only)

**Components to Use:**
- `<Input>`, `<Button>`, `<FileUpload>`, `<Card>`, `<Alert>`

**APIs:**
- `GET /api/students/me`
- `PUT /api/students/me`
- `PUT /api/auth/password/change`
- `POST /api/students/me/avatar`

**Learning Goals:**
- Form pre-filling
- Update operations
- Image upload
- Password validation

---

#### 9. Student Assessments (Week 6-7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟡 Medium  
**Time:** 3-4 days

**What to Build:**
- List of available assessments
- View assessment details
- Attempt assessment (MCQ/SAQ/LAQ)
- Submit assessment
- View results and feedback

**Components to Use:**
- `<Card>`, `<Radio>`, `<Textarea>`, `<Button>`, `<Modal>`, `<Badge>`

**APIs:**
- `GET /api/students/me/assessments`
- `GET /api/assessments/{id}`
- `POST /api/assessments/{id}/submit`
- `GET /api/students/me/assessments/{id}/result`

**Learning Goals:**
- Multi-question form
- Timer logic
- Complex form submission
- Result visualization

---

#### 10. Student Fees (Week 7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟡 Medium  
**Time:** 2-3 days

**What to Build:**
- View fee structure
- List of invoices (paid/unpaid)
- Payment history
- Online payment (Razorpay integration)
- Download receipt

**Components to Use:**
- `<Card>`, `<DataTable>`, `<Button>`, `<Badge>`, `<Modal>`

**APIs:**
- `GET /api/students/me/fees`
- `GET /api/students/me/invoices`
- `POST /api/payments/initiate`
- `GET /api/payments/{id}/receipt`

**Learning Goals:**
- Payment gateway integration
- Transaction handling
- Receipt generation

---

### **PARENT PORTAL (6 pages)**

---

#### 11. Parent Dashboard (Week 7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Select child (dropdown if multiple)
- View child's dashboard (similar to student dashboard)
- Read-only view

**Components to Use:**
- Reuse Student Dashboard components
- `<Select>`, `<Card>`, `<LineChart>`, `<Badge>`

**APIs:**
- `GET /api/parents/me/children`
- `GET /api/students/{id}/dashboard`

**Learning Goals:**
- Component reuse
- Dynamic data loading

---

#### 12. Parent - Child Attendance (Week 7)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Reuse Student Attendance page with read-only view

**Components to Use:**
- Reuse from Student Attendance

**APIs:**
- `GET /api/students/{id}/attendance`

---

#### 13. Parent - Child Assessments (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- View child's assessment results (read-only)

**Components to Use:**
- Reuse from Student Assessments

**APIs:**
- `GET /api/students/{id}/assessments`

---

#### 14. Parent - Child Fees (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- View child's fee status (read-only)

**Components to Use:**
- Reuse from Student Fees

**APIs:**
- `GET /api/students/{id}/fees`

---

#### 15. Parent - Announcements (Week 8)
**Priority:** ⭐ Medium  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- View school announcements (read-only)

**Components to Use:**
- Reuse from Student Announcements

**APIs:**
- `GET /api/announcements`

---

#### 16. Parent Profile (Week 8)
**Priority:** ⭐ Medium  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Edit parent contact details
- Change password
- View children list

**Components to Use:**
- `<Input>`, `<Button>`, `<Card>`, `<Alert>`

**APIs:**
- `GET /api/parents/me`
- `PUT /api/parents/me`
- `PUT /api/auth/password/change`

---

### **GAURI'S LEARNING PATH**

**Week 2-3:** Start with simple pages (Login, Dashboard, Library)  
**Week 4-5:** Practice with medium complexity (Attendance, Documents)  
**Week 6-7:** Build confidence with complex pages (Assessments, Fees)  
**Week 8:** Master component reuse (Parent Portal)

**Key Skills to Learn:**
- React basics (components, props, state, hooks)
- Form handling (React Hook Form + Zod)
- API integration (Axios + React Query)
- State management (Context API)
- Routing (Next.js App Router)
- Styling (Tailwind CSS)
- Charts (Recharts)
- File handling (uploads/downloads)

---

## 👨‍💻 MANTHAN'S TASKS (Beginner - CRUD Master)

### **Total Work:** 24 pages (Admin + Faculty portals)
### **Focus:** Data management, CRUD operations

---

### **WHY THESE PORTALS?**
- ✅ Clear repetitive patterns (learn once, repeat)
- ✅ CRUD mastery through practice
- ✅ Table-heavy (good for DataTable practice)
- ✅ Form-heavy (good for form practice)
- ✅ Backend-focused (less complex UI)

---

### **SUPER ADMIN PORTAL (9 pages)**

---

#### 1. Super Admin Dashboard (Week 2)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1-2 days

**What to Build:**
- System-wide statistics cards
  - Total universities
  - Total colleges
  - Total students
  - Total revenue
- Simple charts (no complex interactions)

**Components to Use:**
- `<Card>`, `<Badge>`, `<BarChart>`

**APIs:**
- `GET /api/super-admin/stats`

**Learning Goals:**
- Layout with grid
- Stats cards
- Basic charts

---

#### 2. Universities List (Week 3)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Table of universities
- Search by name
- Sort by columns
- Actions: View, Edit, Delete

**Components to Use:**
- `<DataTable>`, `<Button>`, `<Input>`, `<Modal>`

**APIs:**
- `GET /api/universities`
- `DELETE /api/universities/{id}`

**Learning Goals:**
- DataTable usage
- CRUD operations (Read, Delete)

---

#### 3. Create University (Week 3)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Form to add new university
  - Name (text)
  - Code (text)
  - Location (text)
  - Status (select)
- Validation
- Success/error messages

**Components to Use:**
- `<Input>`, `<Select>`, `<Button>`, `<Alert>`

**APIs:**
- `POST /api/universities`

**Learning Goals:**
- Form creation
- Form validation (Zod)
- API POST requests

---

#### 4. Edit University (Week 3)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Reuse Create University form
- Pre-fill with existing data
- Update on submit

**Components to Use:**
- Reuse Create form

**APIs:**
- `GET /api/universities/{id}`
- `PUT /api/universities/{id}`

**Learning Goals:**
- Form pre-filling
- Update operations

---

#### 5. Colleges List (Week 4)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Table of colleges per university
- Filter by university
- Search by name
- Actions: View, Edit

**Components to Use:**
- `<DataTable>`, `<Button>`, `<Input>`, `<Select>`

**APIs:**
- `GET /api/colleges`

**Learning Goals:**
- Filtering
- Related data (university → colleges)

---

#### 6. Feature Toggles (Week 4)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- List of features (Library, Assessments, Fees, etc.)
- Enable/disable per college
- Checkbox grid (colleges × features)

**Components to Use:**
- `<Checkbox>`, `<Card>`, `<Button>`

**APIs:**
- `GET /api/colleges/{id}/features`
- `PUT /api/colleges/{id}/features`

**Learning Goals:**
- Checkbox handling
- Bulk updates

---

#### 7. Audit Log (Week 5)
**Priority:** ⭐ Medium  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Read-only table of system activities
- Filter by date, user, action
- Pagination

**Components to Use:**
- `<DataTable>`, `<DatePicker>`, `<Select>`

**APIs:**
- `GET /api/audit-log`

**Learning Goals:**
- Read-only tables
- Date filtering
- Pagination

---

#### 8. Backups Management (Week 5)
**Priority:** ⭐ Medium  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- List of backups
- Create new backup button
- Download backup
- Delete old backups

**Components to Use:**
- `<DataTable>`, `<Button>`, `<Modal>`

**APIs:**
- `GET /api/backups`
- `POST /api/backups/create`
- `GET /api/backups/{id}/download`
- `DELETE /api/backups/{id}`

**Learning Goals:**
- Action buttons
- File downloads
- Confirmation modals

---

#### 9. Billing & Invoices (Week 6)
**Priority:** ⭐⭐ High  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Revenue dashboard (charts)
- Invoices table
- Generate invoice for college
- Download invoice PDF

**Components to Use:**
- `<DataTable>`, `<BarChart>`, `<Button>`, `<Modal>`

**APIs:**
- `GET /api/billing/revenue`
- `GET /api/invoices`
- `POST /api/invoices/generate`
- `GET /api/invoices/{id}/download`

**Learning Goals:**
- Charts with real data
- PDF downloads
- Invoice generation

---

### **COLLEGE ADMIN PORTAL (8 pages)**

---

#### 10. College Admin Dashboard (Week 6)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- College-level statistics
  - Total students
  - Total faculty
  - Fee collection
  - Attendance rate
- Charts (enrollment trends, fee collection)

**Components to Use:**
- `<Card>`, `<Badge>`, `<LineChart>`, `<BarChart>`

**APIs:**
- `GET /api/colleges/me/stats`

**Learning Goals:**
- Reuse dashboard pattern from Super Admin

---

#### 11. Students List (Week 6-7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Table of students
- Search by name, roll number
- Filter by department, year, status
- Sort by columns
- Export to CSV
- Actions: View, Edit, Delete

**Components to Use:**
- `<DataTable>`, `<Input>`, `<Select>`, `<Button>`

**APIs:**
- `GET /api/students`
- `DELETE /api/students/{id}`
- `GET /api/students/export`

**Learning Goals:**
- Complex filtering
- CSV export
- Large dataset handling

---

#### 12. Create Student (Week 7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Multi-section form
  - Personal info (name, DOB, gender, etc.)
  - Academic info (department, year, roll number)
  - Contact info (email, phone, address)
  - Parent info (name, phone, email)
- Validation
- Success/error messages

**Components to Use:**
- `<Input>`, `<Select>`, `<DatePicker>`, `<Textarea>`, `<Button>`, `<Alert>`

**APIs:**
- `POST /api/students`
- `GET /api/departments` (for dropdown)

**Learning Goals:**
- Large forms
- Form sections
- Complex validation
- Related data fetching

---

#### 13. Edit Student (Week 7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Reuse Create Student form
- Pre-fill with student data
- Update on submit

**Components to Use:**
- Reuse Create Student form

**APIs:**
- `GET /api/students/{id}`
- `PUT /api/students/{id}`

**Learning Goals:**
- Form reuse pattern

---

#### 14. Faculty List (Week 7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Table of faculty members
- Search, filter, sort
- Actions: View, Edit, Delete

**Components to Use:**
- `<DataTable>`, `<Input>`, `<Select>`, `<Button>`

**APIs:**
- `GET /api/faculty`
- `DELETE /api/faculty/{id}`

**Learning Goals:**
- Repeat Students List pattern

---

#### 15. Create/Edit Faculty (Week 7)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Form for faculty (similar to student but simpler)
- Pre-fill for edit mode

**Components to Use:**
- `<Input>`, `<Select>`, `<DatePicker>`, `<Button>`

**APIs:**
- `POST /api/faculty`
- `GET /api/faculty/{id}`
- `PUT /api/faculty/{id}`

**Learning Goals:**
- Repeat Create Student pattern

---

#### 16. Departments Management (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Table of departments
- Add new department (modal form)
- Edit department
- Delete department

**Components to Use:**
- `<DataTable>`, `<Modal>`, `<Input>`, `<Button>`

**APIs:**
- `GET /api/departments`
- `POST /api/departments`
- `PUT /api/departments/{id}`
- `DELETE /api/departments/{id}`

**Learning Goals:**
- CRUD in modal
- Simple master data management

---

#### 17. Document Management (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Folder/file structure
- View student-uploaded documents
- Verify/reject documents
- Download documents
- Organize in folders

**Components to Use:**
- `<Card>`, `<Button>`, `<Badge>`, `<Modal>`

**APIs:**
- `GET /api/documents`
- `PUT /api/documents/{id}/verify`
- `PUT /api/documents/{id}/reject`
- `GET /api/documents/{id}/download`

**Learning Goals:**
- File management
- Approval workflows
- Document preview

---

### **FACULTY PORTAL (7 pages)**

---

#### 18. Faculty Dashboard (Week 8)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟢 Simple  
**Time:** 1 day

**What to Build:**
- Today's classes
- Upcoming assessments
- Recent attendance
- Quick actions

**Components to Use:**
- `<Card>`, `<Badge>`, `<Button>`

**APIs:**
- `GET /api/faculty/me/dashboard`

**Learning Goals:**
- Reuse dashboard pattern

---

#### 19. My Timetable (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Weekly schedule view (read-only)
- Similar to Student Timetable

**Components to Use:**
- `<Card>`, `<Badge>`

**APIs:**
- `GET /api/faculty/me/timetable`

**Learning Goals:**
- Reuse timetable layout

---

#### 20. Attendance History (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Table of past attendance records
- Filter by date, class

**Components to Use:**
- `<DataTable>`, `<DatePicker>`

**APIs:**
- `GET /api/faculty/me/attendance`

**Learning Goals:**
- Read-only table with filters

---

#### 21. My Students (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Table of students in my classes
- View student details

**Components to Use:**
- `<DataTable>`, `<Button>`

**APIs:**
- `GET /api/faculty/me/students`

**Learning Goals:**
- Simple table display

---

#### 22. Faculty Library (Week 8)
**Priority:** ⭐⭐ High  
**Complexity:** 🟡 Medium  
**Time:** 1 day

**What to Build:**
- Upload teaching resources
- View my uploads
- Delete resources

**Components to Use:**
- `<FileUpload>`, `<DataTable>`, `<Button>`

**APIs:**
- `GET /api/library/my-resources`
- `POST /api/library/resources/upload`
- `DELETE /api/library/resources/{id}`

**Learning Goals:**
- File uploads
- My content management

---

#### 23. Faculty Profile (Week 8)
**Priority:** ⭐ Medium  
**Complexity:** 🟢 Simple  
**Time:** 0.5 day

**What to Build:**
- Edit personal info
- Change password

**Components to Use:**
- `<Input>`, `<Button>`, `<Alert>`

**APIs:**
- `GET /api/faculty/me`
- `PUT /api/faculty/me`
- `PUT /api/auth/password/change`

**Learning Goals:**
- Reuse profile pattern

---

#### 24. Mark Attendance (Week 8)
**Priority:** ⭐⭐⭐ Critical  
**Complexity:** 🟡 Medium  
**Time:** 2 days

**What to Build:**
- Select class and date
- List of students with checkboxes (Present/Absent)
- Bulk actions (Mark all present)
- Submit attendance

**Components to Use:**
- `<Select>`, `<DatePicker>`, `<Checkbox>`, `<Button>`, `<DataTable>`

**APIs:**
- `GET /api/faculty/me/classes`
- `GET /api/classes/{id}/students`
- `POST /api/attendance/bulk`

**Learning Goals:**
- Bulk checkbox handling
- Bulk submission
- Related data loading

---

### **MANTHAN'S LEARNING PATH**

**Week 2-3:** Master basic CRUD (Universities, Create forms)  
**Week 4-5:** Practice filtering & actions (Colleges, Feature Toggles, Audit Log)  
**Week 6-7:** Build confidence with complex forms (Students, Faculty)  
**Week 8:** Speed through Faculty portal (using learned patterns)

**Key Skills to Learn:**
- React basics (components, props, state, hooks)
- CRUD operations (Create, Read, Update, Delete)
- Form handling (React Hook Form + Zod)
- Table handling (DataTable with sort, filter, pagination)
- API integration (Axios + React Query)
- Bulk operations
- File handling (uploads/downloads)
- Modal interactions

---

## 📅 WEEK-BY-WEEK TIMELINE

### **WEEK 1: SETUP & FOUNDATION**

**Ameya:**
- ✅ Set up monorepo structure
- ✅ Configure Tailwind, TypeScript, ESLint
- ✅ Build authentication system (3-4 days)
- ✅ Build basic components (Button, Input, Card, etc.)

**Gauri & Manthan:**
- ✅ Complete environment setup (Node, pnpm, VS Code)
- ✅ Read documentation
- ✅ Learn Git workflow
- ✅ Watch Ameya build auth (pair programming)

**Goal:** Everyone can log in by end of week

---

### **WEEK 2: FIRST PAGES**

**Ameya:**
- ✅ Complete component library (DataTable, FileUpload, Charts)
- ✅ Review PRs from Gauri & Manthan
- ✅ Help with blockers

**Gauri:**
- ✅ Build Student Login (1 day)
- ✅ Build Student Dashboard (2-3 days)

**Manthan:**
- ✅ Build Super Admin Dashboard (1-2 days)
- ✅ Start Universities List (1 day)

**Goal:** Basic dashboards visible for all portals

---

### **WEEK 3: BUILDING MOMENTUM**

**Ameya:**
- ✅ Start Timetable Builder (continue in Week 4)
- ✅ Code reviews

**Gauri:**
- ✅ Build Student Library (1-2 days)
- ✅ Start Student Timetable (1-2 days)

**Manthan:**
- ✅ Complete Universities CRUD (Create, Edit)
- ✅ Build Colleges List (1 day)

**Goal:** CRUD patterns established, first data pages complete

---

### **WEEK 4: CORE FEATURES**

**Ameya:**
- ✅ Complete Timetable Builder
- ✅ Build Bulk Upload feature

**Gauri:**
- ✅ Complete Student Timetable
- ✅ Build Student Attendance (2 days)

**Manthan:**
- ✅ Build Feature Toggles (1 day)
- ✅ Build Audit Log (1 day)

**Goal:** Complex admin features working

---

### **WEEK 5: MID-POINT**

**Ameya:**
- ✅ Start Assessment Builder (continue in Week 6)
- ✅ Code reviews

**Gauri:**
- ✅ Build Student Documents (2 days)
- ✅ Build Student Announcements (1 day)

**Manthan:**
- ✅ Build Backups Management (1 day)
- ✅ Start Billing & Invoices (continue in Week 6)

**Goal:** File uploads working, announcements system live

---

### **WEEK 6: ADVANCED FEATURES**

**Ameya:**
- ✅ Complete Assessment Builder
- ✅ Start Grading Interface

**Gauri:**
- ✅ Build Student Profile (1-2 days)
- ✅ Start Student Assessments (continue in Week 7)

**Manthan:**
- ✅ Complete Billing & Invoices
- ✅ Build College Admin Dashboard (1 day)
- ✅ Start Students List (continue in Week 7)

**Goal:** Assessment creation working

---

### **WEEK 7: SPRINT TO FINISH**

**Ameya:**
- ✅ Complete Grading Interface
- ✅ Start Analytics Dashboard

**Gauri:**
- ✅ Complete Student Assessments
- ✅ Build Student Fees (2-3 days)
- ✅ Start Parent Portal

**Manthan:**
- ✅ Complete Students List
- ✅ Build Create/Edit Student (2.5 days)
- ✅ Build Faculty List (1 day)
- ✅ Build Create/Edit Faculty (1 day)

**Goal:** Student portal complete, Admin CRUD complete

---

### **WEEK 8: POLISH & LAUNCH**

**Ameya:**
- ✅ Complete Analytics Dashboard
- ✅ Final code reviews
- ✅ Bug fixes
- ✅ Performance optimization

**Gauri:**
- ✅ Complete Parent Portal (all 5 remaining pages - 3 days)
- ✅ Bug fixes
- ✅ Responsive design polish

**Manthan:**
- ✅ Build Departments Management (1 day)
- ✅ Build Document Management (2 days)
- ✅ Build Faculty Portal (all 7 pages - 3 days)
- ✅ Bug fixes

**Goal:** ALL 50+ pages complete, tested, ready for production! 🎉

---

## 🤝 COLLABORATION GUIDELINES

### **Daily Standup (10:00 AM - 15 min)**

**Format:**
1. What did I complete yesterday?
2. What am I working on today?
3. Am I blocked on anything?

**Example (Gauri):**
```
Yesterday: Completed Student Dashboard with attendance graph
Today: Starting Student Library page
Blocked: Need clarification on bookmark API
```

---

### **Code Review Process**

**Before Creating PR:**
- ✅ Test your code locally
- ✅ Check for console errors
- ✅ Ensure responsive design
- ✅ Run linter (`pnpm lint`)
- ✅ Write meaningful commit message

**PR Template:**
```
## What does this PR do?
Build Student Dashboard page

## What pages/components are included?
- Dashboard layout
- Attendance graph widget
- Fee status widget
- Timetable widget

## Screenshots
[Attach screenshots]

## Testing Done
- ✅ Tested on desktop (Chrome, Firefox)
- ✅ Tested on mobile (responsive)
- ✅ Tested API integration
- ✅ No console errors

## Review Checklist
- [ ] Code follows project structure
- [ ] Used shared components from Ameya
- [ ] Added proper TypeScript types
- [ ] No hardcoded values
- [ ] Responsive design works
```

**Review By:**
- All PRs reviewed by **Ameya** (mandatory)
- Gauri & Manthan review each other's PRs (learning)

---

### **Pair Programming Sessions**

**Week 1-2: Ameya pairs with beginners**
- Ameya + Gauri: Build first page together
- Ameya + Manthan: Build first CRUD together

**Week 3+: Beginners pair with each other**
- Gauri + Manthan: Help each other when stuck
- Screen share on Slack/Discord

---

### **Weekly Demo (Friday 3:00 PM - 60 min)**

**Format:**
1. **Demo Time (30 min)**
   - Each person demos what they built this week
   - Show live in browser
   - Celebrate wins! 🎉

2. **Retrospective (15 min)**
   - What went well?
   - What could be better?
   - Any blockers for next week?

3. **Planning (15 min)**
   - Confirm next week's tasks
   - Discuss dependencies
   - Adjust timeline if needed

---

### **Communication Channels**

**Slack Channels:**
- `#frontend-team` - General discussion, questions
- `#frontend-demos` - Share screenshots, videos
- `#frontend-blockers` - Ask for help urgently

**When to Ask for Help:**
- Stuck for more than 30 minutes → Post in Slack
- Urgent blocker → Tag Ameya in Slack
- General question → Post in `#frontend-team`

**Response Time:**
- Ameya responds within 1-2 hours during work hours
- Team helps each other immediately

---

## 🎓 LEARNING RESOURCES FOR BEGINNERS

### **For Gauri & Manthan:**

**Week 1 (Before coding):**
- [ ] React Official Docs: https://react.dev
- [ ] Next.js App Router: https://nextjs.org/docs
- [ ] TypeScript Basics: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
- [ ] Tailwind CSS: https://tailwindcss.com/docs

**Week 2 (While building first page):**
- [ ] React Hook Form: https://react-hook-form.com/get-started
- [ ] Zod Validation: https://zod.dev
- [ ] Axios: https://axios-http.com/docs/intro

**Week 3+ (As needed):**
- [ ] TanStack Query: https://tanstack.com/query/latest/docs/react/overview
- [ ] Recharts: https://recharts.org/en-US/examples

**Tips:**
- Don't read everything at once
- Learn by doing (build pages, refer docs when stuck)
- Ask Ameya questions
- Reference Ameya's code as examples

---

## ✅ DEFINITION OF DONE

A page is "done" when:

- [ ] ✅ All functionality works as per requirements
- [ ] ✅ Integrated with real APIs (not mock data)
- [ ] ✅ No console errors or warnings
- [ ] ✅ Responsive design (desktop + tablet + mobile)
- [ ] ✅ Loading states implemented
- [ ] ✅ Error handling implemented
- [ ] ✅ Form validation works
- [ ] ✅ Code reviewed and approved by Ameya
- [ ] ✅ Merged to `frontend` branch
- [ ] ✅ Tested by another team member

---

## 🚨 CRITICAL DEPENDENCIES

### **Week 1-2 Dependencies:**

```
Ameya builds Auth
    ↓
Gauri & Manthan can build Login pages
    ↓
Ameya builds Components
    ↓
Gauri & Manthan can build all other pages
```

**Impact:**
- If Ameya delays, everyone delays
- Gauri & Manthan MUST wait for Week 1-2 to complete
- No parallel work possible in Week 1

---

### **Week 3+ Dependencies:**

```
Manthan creates Students
    ↓
Gauri can test Student login
    ↓
Ameya builds Assessment Builder
    ↓
Gauri can build Assessment Attempt page
```

**Impact:**
- Most pages can be built in parallel
- Use mock data if APIs not ready
- Replace with real APIs later

---

## 📊 PROGRESS TRACKING

### **Daily Progress Update (in Slack):**

Format:
```
Date: October 15, 2025
Developer: Gauri
Page: Student Dashboard
Status: 🟢 In Progress (80% complete)
Blockers: None
ETA: End of day
```

---

### **Weekly Progress Dashboard:**

| Developer | Week | Pages Completed | Pages In Progress | Pages Remaining |
|-----------|------|-----------------|-------------------|-----------------|
| Ameya     | 1    | 0               | Auth + Components | 10              |
| Gauri     | 1    | 0               | Learning          | 16              |
| Manthan   | 1    | 0               | Learning          | 24              |

*(Update this table every Friday)*

---

## 🎯 SUCCESS METRICS

### **Week 4 Checkpoint:**
- [ ] All developers can log in to all 5 portals
- [ ] At least 3 dashboards complete
- [ ] Ameya's component library 80% complete
- [ ] Gauri completed 4+ pages
- [ ] Manthan completed 6+ pages

### **Week 6 Checkpoint:**
- [ ] Student can take an assessment
- [ ] Faculty can grade it
- [ ] Admin can view results
- [ ] Bulk upload works
- [ ] Gauri completed 10+ pages
- [ ] Manthan completed 15+ pages

### **Week 8 Final:**
- [ ] All 50+ pages complete
- [ ] All portals fully functional
- [ ] No critical bugs
- [ ] Responsive on all devices
- [ ] Code reviewed and merged
- [ ] Ready for deployment 🚀

---

## 💡 TIPS FOR SUCCESS

### **For Ameya:**
- ✅ Build component library with clear examples
- ✅ Document each component with usage
- ✅ Be available for quick questions
- ✅ Review PRs within 2-4 hours
- ✅ Share code snippets in Slack

### **For Gauri:**
- ✅ Don't hesitate to ask questions
- ✅ Start with simple pages to build confidence
- ✅ Reference Ameya's component code
- ✅ Focus on UI/UX details (you're building user-facing pages!)
- ✅ Test on mobile frequently

### **For Manthan:**
- ✅ Master the CRUD pattern (you'll use it 20+ times)
- ✅ Create reusable form components
- ✅ Keep code organized
- ✅ Use DataTable for all list views
- ✅ Pair with Gauri when stuck

### **For Everyone:**
- ✅ Commit code daily (even if not complete)
- ✅ Write meaningful commit messages
- ✅ Test before creating PR
- ✅ Celebrate small wins
- ✅ Help each other
- ✅ Have fun! 🎉

---

## 🎉 LET'S BUILD!

You have:
- ✅ Clear task division
- ✅ Week-by-week plan
- ✅ Learning resources
- ✅ Support system

**Next Steps:**
1. **Ameya:** Read "AMEYA_DETAILED_GUIDE.md" (to be created)
2. **Gauri:** Read "GAURI_DETAILED_GUIDE.md" (to be created)
3. **Manthan:** Read "MANTHAN_DETAILED_GUIDE.md" (to be created)
4. **Everyone:** Set up dev environment (Week 1 Day 1)
5. **Everyone:** Daily standup starting Week 1 Day 2

**Let's make this the best LMS ever! 🚀**

---

**Document Version:** 1.0  
**Created:** October 10, 2025  
**Branch:** `frontend`  
**Status:** Ready for Development

---

## 📞 CONTACT

**Questions about this document?**
- Post in `#frontend-team` Slack channel
- Tag @Ameya for technical questions
- Tag @ProjectManager for timeline questions

**Found an error?**
- Create GitHub issue
- Or update this document directly

---

**🎯 GOAL: 50+ pages in 8 weeks. We got this! 💪**
