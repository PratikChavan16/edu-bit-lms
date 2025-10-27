# University Owner Portal - Pages & Wireframes

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Page Structure Overview

```
University Owner Portal (Port 3002)
├── Dashboard (/)
├── Colleges (/colleges)
│   ├── List View
│   ├── College Details (/colleges/:id)
│   └── Create College Modal
├── Academic Programs (/programs)
│   ├── List View
│   ├── Program Details (/programs/:id)
│   └── Curriculum Editor
├── Faculty (/faculty)
│   ├── List View
│   ├── Faculty Profile (/faculty/:id)
│   └── Hire Faculty Modal
├── Students (/students)
│   ├── List View
│   ├── Student Profile (/students/:id)
│   └── Bulk Import
├── Admissions (/admissions)
│   ├── Applications List
│   ├── Merit Lists
│   └── Entrance Tests
├── Financial (/financial)
│   ├── Fee Collection Dashboard
│   ├── Fee Structure Configuration
│   └── Expense Approvals
├── Reports (/reports)
│   ├── Academic Reports
│   ├── Faculty Analytics
│   └── Financial Reports
├── Infrastructure (/infrastructure)
│   ├── Facilities Overview
│   └── Hostel Management
└── Settings (/settings)
    ├── University Profile
    ├── Academic Calendar
    └── Users Management
```

---

## Page 1: University Dashboard

**Route**: `/`  
**Access**: University Owner, Super Admin  
**Purpose**: Real-time overview of university-wide metrics

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ [Logo] University Owner Portal          [Notifications] [User▼] │
├─────────────────────────────────────────────────────────────────┤
│ MIT University Dashboard                                         │
│ Last updated: 2 minutes ago                            [Refresh] │
├─────────────────────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐        │
│ │  Students │ │  Faculty  │ │  Colleges │ │   Fees    │        │
│ │   15,247  │ │    892    │ │     8     │ │   87.5%   │        │
│ │   +2.3%   │ │   +5.1%   │ │  Active   │ │ Collected │        │
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘        │
├─────────────────────────────────────────────────────────────────┤
│ Student Enrollment Trend          Fee Collection by College      │
│ ┌─────────────────────────┐      ┌─────────────────────────┐    │
│ │ [Line Chart]            │      │ [Bar Chart]             │    │
│ │ 15,000─┐                │      │ Engineering    ████ 78% │    │
│ │        │      ╱          │      │ Medicine      █████ 92% │    │
│ │ 10,000─┤    ╱           │      │ Arts & Sci    ████  85% │    │
│ │        │  ╱             │      │ Business     █████  90% │    │
│ │  5,000─┼─────────────   │      │                         │    │
│ │        Jan Mar May Jul  │      └─────────────────────────┘    │
│ └─────────────────────────┘                                      │
├─────────────────────────────────────────────────────────────────┤
│ Recent Activities                 Pending Approvals              │
│ ┌─────────────────────────────┐  ┌──────────────────────────┐   │
│ │ • 12 new students admitted  │  │ • 5 Faculty leave req... │   │
│ │ • Fee structure updated     │  │ • 3 Expense approvals    │   │
│ │ • College of Med... added   │  │ • 2 Program proposals    │   │
│ │ • Faculty hired (3)         │  │                          │   │
│ └─────────────────────────────┘  └──────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### Components

1. **StatCard** (Reusable)
   - Props: `title`, `value`, `trend` (+2.3%), `icon`
   - Variants: Success (green), Info (blue), Warning (yellow)

2. **LineChart** (Recharts)
   - Data: `enrollments` array with `month`, `count`
   - Responsive, tooltip on hover

3. **BarChart** (Recharts)
   - Data: `colleges` array with `name`, `collection_percentage`
   - Color coding: Red (<70%), Yellow (70-85%), Green (>85%)

4. **ActivityFeed**
   - Data: `activities` array with `type`, `description`, `timestamp`
   - Real-time updates via polling (30s interval)

5. **PendingApprovalsList**
   - Data: `approvals` array with `type`, `count`, `link`
   - Clickable → Navigate to respective page

### API Calls

```typescript
GET /api/owner/dashboard
Response: {
  stats: {
    total_students: 15247,
    total_faculty: 892,
    total_colleges: 8,
    fee_collection_percentage: 87.5
  },
  enrollment_trend: [
    { month: 'Jan', count: 14200 },
    { month: 'Feb', count: 14500 },
    ...
  ],
  fee_collection_by_college: [
    { college: 'Engineering', percentage: 78 },
    ...
  ],
  recent_activities: [...],
  pending_approvals: [...]
}
```

### State Management (Zustand)

```typescript
interface DashboardStore {
  dashboardData: DashboardData | null;
  isLoading: boolean;
  fetchDashboard: () => Promise<void>;
  refreshDashboard: () => Promise<void>;
}
```

---

## Page 2: Colleges Management

**Route**: `/colleges`  
**Access**: University Owner, Super Admin  
**Purpose**: View and manage all colleges within the university

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Colleges Management                        [+ Create College]    │
├─────────────────────────────────────────────────────────────────┤
│ [Search colleges...] [Filter: All ▼] [Sort: Name ▼] [Grid|List] │
├─────────────────────────────────────────────────────────────────┤
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ [College Logo]  │ │ [College Logo]  │ │ [College Logo]  │    │
│ │                 │ │                 │ │                 │    │
│ │ Engineering     │ │ Medicine        │ │ Arts & Science  │    │
│ │ Code: COE       │ │ Code: COM       │ │ Code: CAS       │    │
│ │                 │ │                 │ │                 │    │
│ │ 👨‍🎓 3,245 students│ │ 👨‍🎓 1,890 students│ │ 👨‍🎓 4,120 students│    │
│ │ 👨‍🏫 124 faculty   │ │ 👨‍🏫 89 faculty    │ │ 👨‍🏫 156 faculty   │    │
│ │ 📊 92% attendance│ │ 📊 95% attendance│ │ 📊 88% attendance│    │
│ │                 │ │                 │ │                 │    │
│ │ Principal:      │ │ Principal:      │ │ Principal:      │    │
│ │ Dr. John Doe    │ │ Dr. Jane Smith  │ │ Dr. Alex Brown  │    │
│ │                 │ │                 │ │                 │    │
│ │ [View Details]  │ │ [View Details]  │ │ [View Details]  │    │
│ │ [Edit] [•••]    │ │ [Edit] [•••]    │ │ [Edit] [•••]    │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
│                                                                  │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐    │
│ │ Business        │ │ Law             │ │ [+ Add More]    │    │
│ │ ...             │ │ ...             │ │                 │    │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Create College Modal

```
┌─────────────────────────────────────────┐
│ Create New College              [X]     │
├─────────────────────────────────────────┤
│ College Name *                          │
│ [____________________________]          │
│                                         │
│ College Code * (e.g., COE)              │
│ [_______]                               │
│                                         │
│ Address                                 │
│ [____________________________]          │
│                                         │
│ Contact Email                           │
│ [____________________________]          │
│                                         │
│ Contact Phone                           │
│ [____________________________]          │
│                                         │
│ Student Capacity *                      │
│ [_______]                               │
│                                         │
│ Assign Principal (Optional)             │
│ [Select faculty... ▼]                   │
│                                         │
│        [Cancel]  [Create College]       │
└─────────────────────────────────────────┘
```

### API Calls

```typescript
// List colleges
GET /api/owner/colleges?search=&filter=&sort=

// Create college
POST /api/owner/colleges
Body: { name, code, address, email, phone, capacity, principal_id? }

// Edit college
PATCH /api/owner/colleges/:id

// Delete college
DELETE /api/owner/colleges/:id
```

### Components

1. **CollegeCard**
   - Props: `college` object
   - Actions: View Details, Edit, Delete, Assign Principal

2. **CreateCollegeModal**
   - Form validation with Zod
   - React Hook Form

3. **SearchBar** + **FilterDropdown** + **SortDropdown**

---

## Page 3: College Details

**Route**: `/colleges/:id`  
**Access**: University Owner, Super Admin, Principal (own college)  
**Purpose**: Detailed view of a single college

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ ← Back to Colleges                                              │
├─────────────────────────────────────────────────────────────────┤
│ [Logo] College of Engineering (COE)              [Edit Profile] │
│        Principal: Dr. John Doe                                  │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ Students │ │ Faculty  │ │ Programs │ │ Depts    │           │
│ │  3,245   │ │   124    │ │    8     │ │    12    │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ [Overview] [Departments] [Programs] [Faculty] [Students] [...]  │
├─────────────────────────────────────────────────────────────────┤
│ Contact Information                Performance Metrics           │
│ Email: admin@coe.mit.edu           ┌──────────────────────┐     │
│ Phone: +1-617-253-2000             │ Attendance:    92%   │     │
│ Address: Building A, MIT Campus    │ Pass Rate:     87%   │     │
│                                    │ Placement:     78%   │     │
│ Principal Information              │ Faculty-Stud.: 1:26  │     │
│ Name: Dr. John Doe                 └──────────────────────┘     │
│ Email: jdoe@mit.edu                                             │
│ Phone: +1-617-253-2001             Recent Activities            │
│ [Change Principal]                 • 45 new admissions          │
│                                    • Mechanical Dept added       │
│                                    • Dr. Smith joined faculty    │
│                                    • Semester exam scheduled     │
└─────────────────────────────────────────────────────────────────┘
```

### Components

1. **CollegeHeader** - Logo, name, principal info
2. **StatsGrid** - Student/faculty counts
3. **TabNavigation** - Switch between sections
4. **ContactInfoCard** - College contact details
5. **PerformanceMetricsCard** - Key performance indicators
6. **ActivityTimeline** - Recent college activities

---

## Page 4: Academic Programs

**Route**: `/programs`  
**Access**: University Owner, Super Admin  
**Purpose**: Manage all degree programs offered by the university

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Academic Programs                      [+ Create Program]        │
├─────────────────────────────────────────────────────────────────┤
│ [Search...] [Filter: All Types ▼] [College: All ▼] [Sort ▼]    │
├─────────────────────────────────────────────────────────────────┤
│ Program Name             Type   Duration   College     Enrolled  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ Bachelor of Technology   UG     4 years    Engineering  1,245   │
│ (B.Tech)                                                [View]   │
│                                                                  │
│ Master of Business       PG     2 years    Business      456    │
│ Administration (MBA)                                    [View]   │
│                                                                  │
│ Bachelor of Medicine     UG     5.5 years  Medicine      678    │
│ (MBBS)                                                  [View]   │
│                                                                  │
│ Master of Science        PG     2 years    Arts & Sci    234    │
│ (M.Sc.)                                                 [View]   │
│                                                                  │
│ Diploma in Engineering   Dip    3 years    Engineering   345    │
│                                                         [View]   │
│                                                                  │
│                                     [Load More] Page 1 of 5      │
└─────────────────────────────────────────────────────────────────┘
```

### Create Program Modal

```
┌─────────────────────────────────────────┐
│ Create Academic Program         [X]     │
├─────────────────────────────────────────┤
│ Program Name *                          │
│ [____________________________]          │
│                                         │
│ Degree Type *                           │
│ [Select: UG/PG/Diploma/Certificate ▼]   │
│                                         │
│ Duration (years) *                      │
│ [___] years                             │
│                                         │
│ Total Credits Required *                │
│ [___]                                   │
│                                         │
│ Assign to College(s) *                  │
│ [☐ Engineering]                         │
│ [☐ Medicine]                            │
│ [☐ Arts & Science]                      │
│ [☐ Business]                            │
│                                         │
│ Eligibility Criteria                    │
│ [____________________________]          │
│ [____________________________]          │
│                                         │
│        [Cancel]  [Create Program]       │
└─────────────────────────────────────────┘
```

### API Calls

```typescript
GET /api/owner/programs
POST /api/owner/programs
PATCH /api/owner/programs/:id
DELETE /api/owner/programs/:id
```

---

## Page 5: Faculty Management

**Route**: `/faculty`  
**Access**: University Owner, Super Admin  
**Purpose**: View and manage all faculty members

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Faculty Management                            [+ Hire Faculty]   │
├─────────────────────────────────────────────────────────────────┤
│ [Search...] [College: All ▼] [Dept: All ▼] [Designation ▼]     │
├─────────────────────────────────────────────────────────────────┤
│ Photo  Name           Designation   College      Dept    Status │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ [👤]  Dr. John Smith  Professor     Engineering  CSE     Active │
│       jsmith@mit.edu                                    [View]   │
│                                                                  │
│ [👤]  Dr. Jane Doe    Assoc. Prof   Medicine     Anatomy Active │
│       jdoe@mit.edu                                      [View]   │
│                                                                  │
│ [👤]  Mr. Alex Brown  Asst. Prof    Business     Finance Active │
│       abrown@mit.edu                                    [View]   │
│                                                                  │
│ [👤]  Dr. Sarah Lee   Lecturer      Arts & Sci   Physics Active │
│       slee@mit.edu                                      [View]   │
│                                                                  │
│                                     [Load More] Page 1 of 12     │
└─────────────────────────────────────────────────────────────────┘
```

### Hire Faculty Modal

```
┌─────────────────────────────────────────┐
│ Hire New Faculty                [X]     │
├─────────────────────────────────────────┤
│ [Step 1 of 3: Personal Information]    │
│                                         │
│ First Name *        Last Name *         │
│ [____________]     [____________]       │
│                                         │
│ Email *            Phone *              │
│ [____________]     [____________]       │
│                                         │
│ Date of Birth *                         │
│ [MM/DD/YYYY]                            │
│                                         │
│               [Cancel]  [Next →]        │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Hire New Faculty                [X]     │
├─────────────────────────────────────────┤
│ [Step 2 of 3: Qualifications]          │
│                                         │
│ Highest Degree *                        │
│ [Select: Ph.D./M.Tech/M.Sc/... ▼]      │
│                                         │
│ Specialization                          │
│ [____________________________]          │
│                                         │
│ Years of Experience *                   │
│ [___] years                             │
│                                         │
│ Certifications (Optional)               │
│ [+ Add Certification]                   │
│                                         │
│           [← Back]  [Cancel]  [Next →]  │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│ Hire New Faculty                [X]     │
├─────────────────────────────────────────┤
│ [Step 3 of 3: Employment Details]      │
│                                         │
│ College *                               │
│ [Select college ▼]                      │
│                                         │
│ Department *                            │
│ [Select department ▼]                   │
│                                         │
│ Designation *                           │
│ [Select: Professor/Assoc.Prof/... ▼]   │
│                                         │
│ Employment Type *                       │
│ [Select: Full-time/Part-time/... ▼]    │
│                                         │
│ Joining Date *                          │
│ [MM/DD/YYYY]                            │
│                                         │
│ Monthly Salary                          │
│ $ [________]                            │
│                                         │
│       [← Back]  [Cancel]  [Hire Faculty]│
└─────────────────────────────────────────┘
```

---

## Page 6: Students Management

**Route**: `/students`  
**Access**: University Owner, Super Admin  
**Purpose**: View all students across university

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Students Management                       [Bulk Import] [Export] │
├─────────────────────────────────────────────────────────────────┤
│ [Search...] [College: All ▼] [Program: All ▼] [Year: All ▼]    │
├─────────────────────────────────────────────────────────────────┤
│ Photo  Roll No    Name         College      Program   Year CGPA │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ [👤]  BT2021001  John Student  Engineering  B.Tech  4    8.5   │
│       jstudent@mit.edu                                  [View]   │
│                                                                  │
│ [👤]  MB2022045  Jane Medical  Medicine     MBBS    3    9.2   │
│       jmedical@mit.edu                                  [View]   │
│                                                                  │
│ [👤]  BA2021234  Alex Business Business     MBA     2    7.8   │
│       abusiness@mit.edu                                 [View]   │
│                                                                  │
│                                     [Load More] Page 1 of 250    │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page 7: Admissions

**Route**: `/admissions`  
**Access**: University Owner, Super Admin, Admission Admin  
**Purpose**: Manage admission process

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Admissions Management                                           │
├─────────────────────────────────────────────────────────────────┤
│ [Applications] [Merit Lists] [Entrance Tests] [Configuration]   │
├─────────────────────────────────────────────────────────────────┤
│ Current Admission Cycle: 2025-2026                              │
│                                                                  │
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│ │ Total    │ │ Pending  │ │ Approved │ │ Rejected │           │
│ │  5,678   │ │  2,345   │ │  2,890   │ │   443    │           │
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘           │
├─────────────────────────────────────────────────────────────────┤
│ Application ID  Name          Program    Marks  Status  Action  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ APP2025001     John Applicant B.Tech    92%    Pending [Review] │
│ APP2025002     Jane Smith     MBBS      95%    Pending [Review] │
│ APP2025003     Alex Brown     MBA       88%    Approved [View]  │
│                                                                  │
│                                     [Load More] Page 1 of 95     │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page 8: Financial Management

**Route**: `/financial`  
**Access**: University Owner, Super Admin, Super Accountant  
**Purpose**: University-wide financial oversight

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Financial Management                                            │
├─────────────────────────────────────────────────────────────────┤
│ [Fee Collection] [Fee Structure] [Expenses] [Scholarships]      │
├─────────────────────────────────────────────────────────────────┤
│ Current Semester: Fall 2025                                     │
│                                                                  │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│ │ Total Fees   │ │ Collected    │ │ Pending      │            │
│ │ $ 24,567,890 │ │ $ 21,497,253 │ │ $ 3,070,637  │            │
│ │              │ │    87.5%     │ │    12.5%     │            │
│ └──────────────┘ └──────────────┘ └──────────────┘            │
├─────────────────────────────────────────────────────────────────┤
│ Fee Collection by College            Daily Collection Trend     │
│ ┌──────────────────────────┐         ┌──────────────────────┐  │
│ │ Engineering      78% ████ │         │ [Line Chart]         │  │
│ │ Medicine         92% █████│         │ $500K ─┐             │  │
│ │ Arts & Science   85% ████ │         │        │   ╱─╲       │  │
│ │ Business         90% █████│         │ $250K ─┤ ╱    ╲     │  │
│ │ Law              88% ████ │         │        │          ╲  │  │
│ │ Pharmacy         94% █████│         │      0 ┴──────────── │  │
│ └──────────────────────────┘         └──────────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│ Pending Expense Approvals (8)                      [View All]   │
│ • College of Engineering - Lab Equipment - $45,000              │
│ • College of Medicine - Medical Supplies - $32,000              │
│ • University Library - Books Purchase - $18,000                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page 9: Reports & Analytics

**Route**: `/reports`  
**Access**: University Owner, Super Admin  
**Purpose**: Comprehensive reporting

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Reports & Analytics                                             │
├─────────────────────────────────────────────────────────────────┤
│ [Academic] [Faculty] [Financial] [Attendance] [Custom Reports]  │
├─────────────────────────────────────────────────────────────────┤
│ Generate Report                                                 │
│                                                                  │
│ Report Type *                                                   │
│ [Select: Academic Performance ▼]                                │
│                                                                  │
│ Filters                                                         │
│ College:  [All ▼]    Program: [All ▼]    Semester: [Fall 25▼]  │
│                                                                  │
│ Date Range                                                      │
│ From: [MM/DD/YYYY]  To: [MM/DD/YYYY]                           │
│                                                                  │
│ Export Format                                                   │
│ [☐ PDF]  [☐ Excel]  [☐ CSV]                                    │
│                                                                  │
│                     [Generate Report]                           │
│                                                                  │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                                  │
│ Recent Reports                                    [View All]    │
│ • Academic Performance Report - Fall 2025 (Oct 20)              │
│ • Faculty Workload Analysis - Q3 2025 (Oct 15)                  │
│ • Fee Collection Report - September 2025 (Oct 1)                │
└─────────────────────────────────────────────────────────────────┘
```

---

## Page 10: Settings

**Route**: `/settings`  
**Access**: University Owner  
**Purpose**: University configuration

### Layout

```
┌─────────────────────────────────────────────────────────────────┐
│ Settings                                                        │
├─────────────────────────────────────────────────────────────────┤
│ [Profile] [Academic Calendar] [Users] [Email Templates] [...]   │
├─────────────────────────────────────────────────────────────────┤
│ University Profile                                              │
│                                                                  │
│ [Logo Preview]                                                  │
│ [Change Logo]                                                   │
│                                                                  │
│ University Name *                                               │
│ [____________________________]                                  │
│                                                                  │
│ Address                                                         │
│ [____________________________]                                  │
│ [____________________________]                                  │
│                                                                  │
│ Contact Email *                                                 │
│ [____________________________]                                  │
│                                                                  │
│ Contact Phone *                                                 │
│ [____________________________]                                  │
│                                                                  │
│ Website                                                         │
│ [____________________________]                                  │
│                                                                  │
│ Timezone *                                                      │
│ [Select timezone ▼]                                             │
│                                                                  │
│                     [Save Changes]                              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Common Components Library

### Reusable Components

1. **StatCard** - Metric display with trend
2. **DataTable** - Sortable, filterable table with pagination
3. **Modal** - Generic modal wrapper
4. **SearchBar** - Debounced search input
5. **FilterDropdown** - Multi-select filter
6. **DateRangePicker** - Date range selector
7. **FileUpload** - Drag-and-drop file uploader
8. **ConfirmDialog** - Confirmation modal for destructive actions
9. **Toast** - Notification system (sonner)
10. **LoadingSpinner** - Loading state indicator

---

## Responsive Design

- **Desktop**: Full layout as shown (> 1024px)
- **Tablet**: Stacked cards, collapsible sidebar (768px - 1024px)
- **Mobile**: Single column, bottom navigation (< 768px)

---

## Accessibility

- WCAG 2.1 AA compliant
- Keyboard navigation support
- Screen reader friendly (ARIA labels)
- Focus indicators on all interactive elements
- High contrast mode support

---

**Total Pages**: 10 primary pages + 15+ modal/detail views
