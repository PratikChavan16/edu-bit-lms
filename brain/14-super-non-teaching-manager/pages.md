# Super Non-Teaching Manager Portal - Page Specifications

**Design System**: Material Design 3  
**Framework**: Next.js 15 + React 18  
**Component Library**: shadcn/ui + Radix UI  
**Color Palette**: Professional Blue (#1976D2 primary)

---

## Design System

### Colors
```css
/* Primary - Professional Blue */
--primary-50: #E3F2FD;
--primary-100: #BBDEFB;
--primary-500: #1976D2;
--primary-600: #1565C0;
--primary-700: #0D47A1;

/* Status Colors */
--success: #4CAF50;
--warning: #FF9800;
--error: #F44336;
--info: #2196F3;

/* Neutral */
--gray-50: #FAFAFA;
--gray-100: #F5F5F5;
--gray-500: #9E9E9E;
--gray-900: #212121;
```

### Typography
- **Font Family**: Inter (body), Roboto (headings)
- **Headings**: H1 (32px/700), H2 (24px/600), H3 (20px/600)
- **Body**: Regular (16px/400), Medium (16px/500)
- **Small**: 14px, Caption: 12px

### Spacing
- Base unit: 8px
- Scale: 8, 16, 24, 32, 40, 48, 64px

---

## Page 1: Dashboard (Super NT Manager Home)

**Route**: `/dashboard`  
**Access**: Super Non-Teaching Manager

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Logo | "Super NT Manager Dashboard" | Profile       │
├─────────────────────────────────────────────────────────────┤
│ Sidebar │ Main Content                                      │
│         │ ┌───────────────────────────────────────────────┐ │
│ • Dash  │ │ Quick Stats (4 Cards)                         │ │
│ • Staff │ │ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐               │ │
│ • Recruit│ │ │2,150││ 150 ││  85 ││ 12  │               │ │
│ • Attend│ │ │Staff││Recruit│Leave││Pending│               │ │
│ • Leave │ │ └─────┘ └─────┘ └─────┘ └─────┘               │ │
│ • Perform│ │                                               │ │
│ • Train │ │ ┌───────────────────────────────────────────┐ │ │
│ • Reports│ │ │ Attendance Overview (Chart)               │ │ │
│         │ │ │ Line chart: Last 7 days attendance %      │ │ │
│         │ │ └───────────────────────────────────────────┘ │ │
│         │ │                                               │ │
│         │ │ ┌─────────────────┐ ┌─────────────────────┐ │ │
│         │ │ │ Pending Actions │ │ Recent Activities   │ │ │
│         │ │ │ • 12 Leave      │ │ • John Doe joined  │ │ │
│         │ │ │ • 8 Regularize  │ │ • 5 interviews     │ │ │
│         │ │ │ • 3 Transfers   │ │ • Training completed││ │
│         │ │ └─────────────────┘ └─────────────────────┘ │ │
│         │ └───────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Components

**Quick Stats Cards**
```jsx
<StatsCard
  icon={UsersIcon}
  label="Total Staff"
  value="2,150"
  change="+25 this month"
  trend="up"
/>
```

**Attendance Chart**
- Type: Line chart (7 days)
- Data: Daily attendance percentage
- Threshold line at 95%

**Pending Actions Table**
- Columns: Type, Employee, Date, Action Button
- Max 5 rows with "View All" link

---

## Page 2: Employee Directory

**Route**: `/employees`  
**Access**: Super NT Manager, College Admin

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header: "Employee Directory" | Add New Employee Button       │
├─────────────────────────────────────────────────────────────┤
│ Filters Bar                                                  │
│ [College ▼] [Designation ▼] [Status ▼] [Search...]          │
├─────────────────────────────────────────────────────────────┤
│ Employee Table                                               │
│ ┌────┬─────────┬──────────┬────────┬────────┬────────────┐ │
│ │Photo│EMP-Code │Name      │College │Desig   │Status      │ │
│ ├────┼─────────┼──────────┼────────┼────────┼────────────┤ │
│ │ 👤 │EMP-0001 │John Doe  │ABC Eng │Clerk   │🟢 Active   │ │
│ │ 👤 │EMP-0002 │Jane Smith│XYZ Arts│Lab Asst│🟡 Probation│ │
│ └────┴─────────┴──────────┴────────┴────────┴────────────┘ │
│ Pagination: « 1 2 3 ... 50 »                                │
└─────────────────────────────────────────────────────────────┘
```

### Filters
- **College**: Dropdown (All, ABC Engineering, XYZ Arts...)
- **Designation**: Dropdown (All, Clerk, Lab Assistant, Peon...)
- **Status**: Dropdown (All, Active, Probation, Resigned...)
- **Search**: Text input (by name, employee code, email)

### Table Columns
1. Photo (40×40px circular)
2. Employee Code
3. Name (clickable to detail page)
4. College
5. Designation
6. Status Badge (color-coded)
7. Actions: View, Edit, Transfer

### Status Badges
- 🟢 Active (green)
- 🟡 Probation (yellow)
- 🔴 Suspended (red)
- ⚫ Resigned (gray)

---

## Page 3: Employee Detail Page

**Route**: `/employees/:id`

### Layout (Tabbed Interface)
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to List | EMP-0001 | John Doe                        │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐   │
│ │ Profile Card                                          │   │
│ │ ┌──────┐                                              │   │
│ │ │Photo │  John Doe                                    │   │
│ │ │ 👤   │  Clerk - Admin Department                    │   │
│ │ └──────┘  ABC Engineering College                     │   │
│ │           📧 john@college.edu | 📱 +91-9876543210     │   │
│ │           Status: 🟢 Active | DOJ: Jan 15, 2023       │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                              │
│ Tabs: [Personal] [Attendance] [Leave] [Performance] [Docs]  │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Tab Content                                             │ │
│ │ (Dynamic based on selected tab)                         │ │
│ └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Tab 1: Personal Info
- Basic Details (Name, DOB, Gender, Blood Group)
- Contact (Phone, Email, Address)
- Employment (Employee Code, DOJ, Designation, Department, Reporting To)
- Salary Details (Basic, HRA, DA, Total CTC)
- Bank Account (Account Number, IFSC, Bank Name)
- Edit Button (top right)

### Tab 2: Attendance History
- Month selector
- Attendance calendar view (color-coded: Present=Green, Absent=Red, Leave=Blue)
- Summary: Present Days, Absent Days, Late Marks, Overtime Hours

### Tab 3: Leave Records
- Leave balance card (CL: 8/12, SL: 6/10, EL: 15/20)
- Leave history table (Date, Type, Days, Status, Reason)

### Tab 4: Performance
- Current year appraisal status
- Overall rating (1-5 stars)
- Goal progress (% completion)
- Performance history (past 3 years)

### Tab 5: Documents
- Document list (Aadhar, PAN, Certificates, Offer Letter)
- Upload new document button
- Download/View actions

---

## Page 4: Recruitment Dashboard

**Route**: `/recruitment`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Recruitment Dashboard | + New Job Requisition                │
├─────────────────────────────────────────────────────────────┤
│ Pipeline View                                                │
│ ┌──────────┬──────────┬──────────┬──────────┬──────────┐    │
│ │ Open (8) │Screen(25)│Interview │Offer (3) │Joined(2) │    │
│ ├──────────┼──────────┼──────────┼──────────┼──────────┤    │
│ │• Clerk(3)│• Applicant│• John   │• Jane    │• Bob     │    │
│ │• Lab(2)  │• Applicant│• Alice  │• Tom     │• Alice   │    │
│ │• Peon(3) │  ...     │  ...    │          │          │    │
│ └──────────┴──────────┴──────────┴──────────┴──────────┘    │
│                                                              │
│ Active Job Postings                                          │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Clerk - Admin Dept (3 positions)                       │  │
│ │ Applications: 45 | Shortlisted: 12 | Interviewed: 5    │  │
│ │ [View Applications] [Schedule Interview]               │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Features
- Kanban-style pipeline view
- Drag-and-drop to move candidates between stages
- Quick actions on each card
- Filters by position, college, urgency

---

## Page 5: Attendance Management

**Route**: `/attendance`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Attendance Management                                        │
│ [College: All ▼] [Date: Today ▼] [Export Muster Roll]       │
├─────────────────────────────────────────────────────────────┤
│ Summary: Present: 1,850 | Absent: 50 | On Leave: 35 | Late: 15│
├─────────────────────────────────────────────────────────────┤
│ Employee Attendance Table                                    │
│ ┌──────┬───────────┬─────────┬──────────┬────────┬────────┐ │
│ │Name  │Emp Code   │In Time  │Out Time  │Status  │Action  │ │
│ ├──────┼───────────┼─────────┼──────────┼────────┼────────┤ │
│ │John  │EMP-0001   │08:55 AM │05:10 PM  │Present │        │ │
│ │Jane  │EMP-0002   │09:20 AM │--:-- --  │Late⚠️  │Regularize│
│ │Bob   │EMP-0003   │--:-- -- │--:-- --  │Absent🔴│Mark    │ │
│ └──────┴───────────┴─────────┴──────────┴────────┴────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Features
- Real-time attendance tracking
- Late mark indicators (>15 min = Late)
- Absent with reason options
- Regularization workflow (pending approvals highlighted)
- Bulk actions (Mark Leave, Export)

---

## Page 6: Leave Management

**Route**: `/leave`

### Layout (Three Tabs)
```
┌─────────────────────────────────────────────────────────────┐
│ Leave Management                                             │
│ Tabs: [Pending Approvals (12)] [Leave History] [Policies]   │
├─────────────────────────────────────────────────────────────┤
│ Pending Approvals Tab                                        │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ John Doe (EMP-0001)                                    │  │
│ │ Leave Type: Casual Leave (2 days)                      │  │
│ │ Date: Feb 15-16, 2024                                  │  │
│ │ Reason: Personal work                                  │  │
│ │ Balance: CL 8/12 available                             │  │
│ │ [✓ Approve] [✗ Reject]                                 │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Pending Approvals
- Cards for each pending leave request
- Employee details and leave type
- Leave balance display
- Quick approve/reject buttons
- Comment section for rejection

### Leave History
- Filter by college, employee, leave type, date range
- Table view with columns: Employee, Leave Type, Dates, Days, Status
- Export to Excel option

### Leave Policies Tab
- Display leave policy document
- Leave entitlement by designation
- Edit policy button (admin only)

---

## Page 7: Performance Appraisal

**Route**: `/performance`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Performance Appraisals | Start New Cycle                     │
│ [Year: 2024 ▼] [Status: In Progress ▼]                      │
├─────────────────────────────────────────────────────────────┤
│ Appraisal Progress                                           │
│ ┌──────────────────────────────────────────────────────┐    │
│ │ 2024 Annual Appraisal                                │    │
│ │ Progress: ███████░░░░ 70% (1,505/2,150 completed)    │    │
│ │ Deadline: March 31, 2024 (35 days left)              │    │
│ └──────────────────────────────────────────────────────┘    │
│                                                              │
│ Appraisal Status by College                                  │
│ ┌─────────────────┬──────────┬──────────┬─────────────┐    │
│ │ College         │ Total    │ Completed│ % Complete  │    │
│ ├─────────────────┼──────────┼──────────┼─────────────┤    │
│ │ ABC Engineering │ 250      │ 200      │ 80% ✓       │    │
│ │ XYZ Arts        │ 180      │ 120      │ 67% ⚠️      │    │
│ │ PQR Commerce    │ 150      │ 90       │ 60% ⚠️      │    │
│ └─────────────────┴──────────┴──────────┴─────────────┘    │
│                                                              │
│ [View Incomplete Appraisals] [Generate Reports]             │
└─────────────────────────────────────────────────────────────┘
```

### Features
- Appraisal cycle management
- Progress tracking by college
- Reminder emails to managers
- Performance rating distribution chart
- Export appraisal data

---

## Page 8: Training Programs

**Route**: `/training`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Training Programs | + Create Program                         │
├─────────────────────────────────────────────────────────────┤
│ Upcoming Programs (3)                                        │
│ ┌────────────────────────────────────────────────────────┐  │
│ │ 📚 MS Excel Advanced Training                          │  │
│ │ Date: Feb 20-22, 2024 | Trainer: Prof. ABC            │  │
│ │ Enrolled: 25/30 | Venue: Conference Hall               │  │
│ │ [View Details] [Manage Enrollments]                    │  │
│ └────────────────────────────────────────────────────────┘  │
│                                                              │
│ Completed Programs (Tab)                                     │
│ Past Training History (Tab)                                  │
└─────────────────────────────────────────────────────────────┘
```

### Create Program Form
- Training Title
- Description
- Trainer Name
- Dates (Start - End)
- Venue
- Capacity
- Training Type (Technical, Soft Skills, Compliance, Safety)
- Target Audience (Designation-wise)

---

## Page 9: Transfer Requests

**Route**: `/transfers`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Transfer Requests | + New Transfer                           │
│ [Status: Pending ▼] [From College ▼] [To College ▼]         │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Transfer Request #TR-2024-001                          │  │
│ │ Employee: John Doe (EMP-0001) - Clerk                  │  │
│ │ From: ABC Engineering → To: XYZ Arts College           │  │
│ │ Reason: Family relocation                              │  │
│ │ Effective Date: March 1, 2024                          │  │
│ │ Status: Pending Approval ⏳                            │  │
│ │ [✓ Approve] [✗ Reject] [View Details]                 │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Transfer Workflow
1. Employee/Manager initiates transfer
2. HR reviews request
3. Both colleges approve
4. Effective date confirmed
5. Employee record updated

---

## Page 10: Separation Management

**Route**: `/separations`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Separations (Resignations/Terminations)                     │
│ [Type: All ▼] [Status: In Progress ▼]                       │
├─────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────┐  │
│ │ Resignation - SEP-2024-001                             │  │
│ │ Employee: Jane Smith (EMP-0050) - Lab Assistant        │  │
│ │ College: ABC Engineering                               │  │
│ │ Resignation Date: Feb 1, 2024                          │  │
│ │ Last Working Day: March 1, 2024 (Notice: 30 days)     │  │
│ │ Reason: Higher studies                                 │  │
│ │                                                        │  │
│ │ Exit Checklist:                                        │  │
│ │ ✓ Exit interview completed                             │  │
│ │ ✓ Handover completed                                   │  │
│ │ ⏳ Final settlement pending                            │  │
│ │ [ ] Clearance certificate issued                       │  │
│ │                                                        │  │
│ │ [Process Final Settlement] [Issue Clearance]           │  │
│ └────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### Exit Checklist Items
- Exit interview
- Handover documentation
- Asset return (ID card, laptop, keys)
- Final settlement calculation
- Full & final clearance certificate
- Experience letter generation

---

## Page 11: Reports & Analytics

**Route**: `/reports`

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ HR Reports & Analytics                                       │
├─────────────────────────────────────────────────────────────┤
│ Report Categories                                            │
│ ┌─────────────┬─────────────┬─────────────┬─────────────┐  │
│ │ Attendance  │ Leave       │ Performance │ Attrition   │  │
│ │ Reports     │ Reports     │ Reports     │ Reports     │  │
│ └─────────────┴─────────────┴─────────────┴─────────────┘  │
│                                                              │
│ Quick Reports                                                │
│ • Monthly Attendance Summary                                 │
│ • Leave Utilization Report                                   │
│ • Attrition Analysis (YoY)                                   │
│ • Training Effectiveness Report                              │
│ • Headcount by College/Designation                           │
│                                                              │
│ Custom Report Builder                                        │
│ [Select Metrics ▼] [Date Range] [Filters] [Generate]        │
└─────────────────────────────────────────────────────────────┘
```

### Key Metrics Dashboards
1. **Attendance Dashboard**
   - Average attendance % (trend line)
   - Late marks trend
   - Absenteeism by department

2. **Attrition Dashboard**
   - Attrition rate (YoY comparison)
   - Resignation reasons (pie chart)
   - Retention by designation

3. **Performance Dashboard**
   - Rating distribution (bell curve)
   - Top performers list
   - Improvement areas

---

## Responsive Design

### Mobile Breakpoints
- **Desktop**: ≥1200px (full sidebar)
- **Tablet**: 768-1199px (collapsible sidebar)
- **Mobile**: <768px (hamburger menu)

### Mobile Adaptations
- Tables → Card view
- Multi-column → Single column stack
- Sidebar → Bottom navigation
- Charts → Simplified versions

---

## Common UI Components

### Navigation Sidebar
```jsx
<Sidebar>
  <MenuItem icon={HomeIcon} label="Dashboard" route="/dashboard" />
  <MenuItem icon={UsersIcon} label="Employees" route="/employees" />
  <MenuItem icon={BriefcaseIcon} label="Recruitment" route="/recruitment" />
  <MenuItem icon={ClockIcon} label="Attendance" route="/attendance" />
  <MenuItem icon={CalendarIcon} label="Leave" route="/leave" />
  <MenuItem icon={StarIcon} label="Performance" route="/performance" />
  <MenuItem icon={AcademicCapIcon} label="Training" route="/training" />
  <MenuItem icon={ArrowRightLeftIcon} label="Transfers" route="/transfers" />
  <MenuItem icon={LogOutIcon} label="Separations" route="/separations" />
  <MenuItem icon={ChartBarIcon} label="Reports" route="/reports" />
</Sidebar>
```

### Header Component
```jsx
<Header>
  <Logo />
  <PageTitle />
  <SearchBar placeholder="Search employees..." />
  <NotificationBell count={5} />
  <UserProfile name="HR Manager" avatar="/avatar.jpg" />
</Header>
```

### Filter Bar Component
```jsx
<FilterBar>
  <Select label="College" options={colleges} />
  <Select label="Designation" options={designations} />
  <Select label="Status" options={statuses} />
  <DateRangePicker />
  <SearchInput placeholder="Search..." />
  <Button variant="outline">Reset Filters</Button>
</FilterBar>
```

---

*Complete UI/UX specifications for Super Non-Teaching Manager Portal with 11 core pages and responsive design.*
