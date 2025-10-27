# Bitflow Admin Portal - Features

**Last Updated**: October 27, 2025  
**Philosophy**: God Mode - Full cross-tenant access with audit logging

---

## God Mode Philosophy

**Bitflow Owner = Platform Superuser with FULL ACCESS**

The Bitflow Owner has complete access to all operations across all universities, including:
- Creating/editing/deleting universities
- Creating/editing/deleting colleges (typically done by University Owner)
- Creating/editing/deleting users at any level
- Viewing and modifying all data across tenants

**Typical Workflow (Delegation Model):**
1. Bitflow Owner creates university → Auto-creates University Owner
2. University Owner creates colleges
3. Principals manage college operations
4. Department Heads manage departments

**God Mode Usage (Emergency/Support):**
1. Quick onboarding: Create university + colleges + users in one session
2. Emergency access: Fix critical issues when University Owner unavailable
3. Data corrections: Edit/delete any entity across all universities
4. Demo/testing: Rapidly set up complete test environments

**All Bitflow Owner actions are logged in audit logs for compliance.**

---

## Core Features

### 1. University Management

#### 1.1 Create University
- **Description**: Create new tenant (university) in the system
- **Inputs**: Name, email, phone, domain (optional)
- **Outputs**: University ID, auto-generated slug, University Owner credentials
- **Permissions**: `universities.create`
- **Validation**:
  - Name: Required, 3-100 chars, unique
  - Email: Required, valid format, unique
  - Phone: Required, valid format
  - Domain: Optional, valid domain format, unique

#### 1.2 List Universities
- **Description**: View all universities with pagination
- **Filters**: Status (active/inactive), search by name/email
- **Sorting**: By name, created date, status
- **Pagination**: 20 per page
- **Permissions**: `universities.read`

#### 1.3 Edit University
- **Description**: Update university details
- **Editable Fields**: Name, email, phone, address, logo, storage_quota, is_active
- **Permissions**: `universities.update`
- **Audit**: All changes logged

#### 1.4 Deactivate University
- **Description**: Soft delete university (can be restored)
- **Impact**: All users in university cannot login
- **Permissions**: `universities.delete`
- **Warning**: Requires confirmation
- **Audit**: Logged with reason

#### 1.5 View University Statistics
- **Metrics**:
  - Total colleges
  - Total students
  - Total faculty
  - Total staff
  - Storage used / quota
  - Active users (last 30 days)
  - Subscription status
- **Permissions**: `universities.read`

---

### 2. College Management (God Mode)

**Note**: Typically, colleges are created by University Owners. Bitflow Owner has God Mode access for onboarding, support, and emergency situations.

#### 2.1 Create College
- **Description**: Create college under any university
- **Inputs**: University (dropdown), name, code, type, email, phone, address, capacity
- **Outputs**: College ID, auto-generated slug
- **Permissions**: `colleges.create` (cross-tenant)
- **Warning**: Displayed - "Typically done by University Owner. Action will be logged."
- **Validation**:
  - University: Required, must exist
  - Name: Required, 3-200 chars
  - Code: Required, unique within university (e.g., "SOE", "ARTS")
  - Email: Required, valid format
  - Capacity: Optional, integer

#### 2.2 List Colleges
- **Description**: View all colleges across all universities
- **Filters**: University, status, college type, search by name/code
- **Sorting**: By name, university, created date
- **Pagination**: 15 per page
- **Permissions**: `colleges.read`
- **Display**: Shows university name for each college

#### 2.3 Edit College
- **Description**: Update college details across any university
- **Editable Fields**: Name, code, type, email, phone, address, capacity, status
- **Permissions**: `colleges.update` (cross-tenant)
- **Warning**: Displayed - "God Mode access. Action will be logged."
- **Audit**: All changes logged with reason

#### 2.4 Delete College
- **Description**: Soft delete college (can be restored)
- **Impact**: College and all sub-entities (departments, programs) hidden
- **Permissions**: `colleges.delete` (cross-tenant)
- **Warning**: Requires confirmation + displays impact
- **Audit**: Logged with reason

#### 2.5 View College Statistics
- **Metrics**:
  - Total departments
  - Total students enrolled
  - Total faculty
  - Enrollment percentage (current/capacity)
  - Available seats
- **Permissions**: `colleges.read`

---

### 3. Platform Dashboard

#### 2.1 Key Metrics Cards
- **Total Universities**: Count of active tenants
- **Total Users**: Sum across all universities
- **Platform Uptime**: Last 30 days
- **Active Subscriptions**: Paying universities
- **MRR**: Monthly recurring revenue
- **Storage Usage**: GB used / total allocated
- **API Calls (24h)**: Total requests processed
- **Error Rate**: Percentage of failed requests

#### 2.2 System Health
- **Database**: Connection status, query latency
- **Redis**: Connection status, memory usage
- **Queue**: Pending jobs, failed jobs
- **Storage**: Disk usage percentage
- **Status**: Green (healthy), Yellow (warning), Red (critical)

#### 2.3 Recent Activity Feed
- New universities created
- Subscription renewals
- System alerts
- Failed payments
- Support tickets

---

### 3. User Management (Platform Level)

#### 3.1 Create Platform User
- **Roles**: Bitflow Owner, University Owner
- **Inputs**: Name, email, role, permissions
- **Outputs**: User ID, temporary password
- **Permissions**: `users.create`
- **Note**: 
  - Bitflow Owner: Global platform administrator (Level 1, Global Scope)
  - University Owner: Manages a single university (Level 2, University Scope)
  - These are the only two roles that can be created at platform level

#### 3.2 List Platform Users
- **Filters**: Role, status, search by name/email
- **Columns**: Name, email, role, last login, status
- **Permissions**: `users.read`

#### 3.3 Edit User
- **Editable**: Name, email, role, permissions, is_active
- **Permissions**: `users.update`
- **Restriction**: Cannot edit own role/permissions

#### 3.4 Deactivate User
- **Action**: Revoke access, invalidate tokens
- **Permissions**: `users.delete`
- **Restriction**: Cannot deactivate self

---

### 4. Analytics & Reporting

#### 4.1 Platform Overview
- **Charts**:
  - Universities created over time (line chart)
  - User growth across all tenants (area chart)
  - Revenue trend (bar chart)
  - Storage usage by university (pie chart)

#### 4.2 Tenant Comparison
- **Table**: Compare universities by:
  - Total users
  - Active users
  - Storage usage
  - Subscription tier
  - Revenue contribution

#### 4.3 System Performance
- **Metrics**:
  - Average API response time
  - Database query performance
  - Cache hit rate
  - Queue throughput

#### 4.4 Export Reports
- **Formats**: CSV, PDF, Excel
- **Types**: User report, Revenue report, Usage report
- **Permissions**: `analytics.export`

---

### 5. Billing & Subscriptions

#### 5.1 Subscription Management
- **View**: All university subscriptions
- **Columns**: University, plan, status, next billing date, MRR
- **Actions**: Renew, upgrade, downgrade, cancel

#### 5.2 Payment Processing
- **View**: Payment history
- **Actions**: Process refund, retry failed payment
- **Permissions**: `billing.manage`

#### 5.3 Pricing Plans
- **Manage**: Create/edit subscription tiers
- **Fields**: Name, price, features, limits (storage, users)
- **Permissions**: `billing.manage_plans`

#### 5.4 Invoices
- **Generate**: Monthly invoices for all universities
- **Send**: Email invoices automatically
- **Download**: PDF invoices
- **Permissions**: `billing.read`

---

### 6. Global Settings

#### 6.1 Email Configuration
- **Provider**: SendGrid, AWS SES, SMTP
- **Settings**: API key, from email, templates
- **Test**: Send test email

#### 6.2 SMS Configuration
- **Provider**: Twilio, AWS SNS
- **Settings**: API credentials, sender ID

#### 6.3 Payment Gateway
- **Provider**: Stripe, Razorpay, PayPal
- **Settings**: API keys, webhook URL
- **Test**: Process test payment

#### 6.4 Storage Configuration
- **Provider**: AWS S3, Google Cloud Storage
- **Settings**: Bucket name, region, credentials
- **Default Quota**: Set default storage per university

#### 6.5 Security Settings
- **Password Policy**: Min length, complexity, expiry
- **MFA**: Enforce MFA for platform admins
- **Session**: Timeout duration, concurrent sessions
- **IP Whitelist**: Restrict access by IP

#### 6.6 Maintenance Mode
- **Toggle**: Enable/disable platform maintenance
- **Message**: Custom message for users
- **Scheduled**: Set maintenance window

---

### 7. Audit Logs

#### 7.1 View Logs
- **Filters**: User, action, entity type, date range
- **Columns**: Timestamp, user, action, entity, IP address, changes (JSON)
- **Pagination**: 50 per page
- **Permissions**: `audit_logs.read`

#### 7.2 Export Logs
- **Format**: CSV
- **Use Case**: Compliance, security investigations
- **Permissions**: `audit_logs.export`

---

### 8. Support & Tickets

#### 8.1 View Support Tickets
- **From**: All university users
- **Columns**: Ticket #, university, subject, priority, status, assigned to
- **Filters**: Priority, status, university

#### 8.2 Respond to Ticket
- **Action**: Add comment, change status, assign to team member
- **Permissions**: `support.manage`

#### 8.3 Ticket Analytics
- **Metrics**: Total tickets, open, closed, average response time, customer satisfaction

---

### 9. System Logs & Monitoring

#### 9.1 Error Logs
- **View**: Application errors across all tenants
- **Filters**: Severity, date range, search by message
- **Details**: Stack trace, request data, user context

#### 9.2 API Logs
- **View**: All API requests
- **Metrics**: Response time, status code, endpoint, user
- **Filters**: Status code (4xx, 5xx), endpoint, date range

#### 9.3 Performance Monitoring
- **View**: Real-time performance metrics
- **Metrics**: CPU usage, memory usage, disk I/O, network traffic
- **Alerts**: Set thresholds for alerts

---

### 10. Database Management

#### 10.1 Backup Status
- **View**: Last backup date/time, size, status
- **Action**: Trigger manual backup
- **Permissions**: `database.backup`

#### 10.2 Restore Database
- **Action**: Restore from backup
- **Warning**: Requires confirmation, notifies all users
- **Permissions**: `database.restore`

#### 10.3 Run Migrations
- **View**: Migration status
- **Action**: Run pending migrations
- **Permissions**: `database.migrate`

---

## Feature Comparison with Other Portals

| Feature | Bitflow Admin | University Owner | Student |
|---------|---------------|------------------|---------|
| Manage Universities | ✅ Yes | ❌ No | ❌ No |
| Manage Colleges | ❌ No | ✅ Yes | ❌ No |
| View Students | ✅ All | ✅ University | ✅ Self Only |
| Billing | ✅ Platform | ✅ University | ✅ Own Fees |
| Global Settings | ✅ Yes | ❌ No | ❌ No |
| System Health | ✅ Yes | ✅ Limited | ❌ No |

---

## Hierarchical Navigation Features (v2.1+)

### Overview

The hierarchical navigation system provides organized access to ALL 13 portals' functionality through a systematic drill-down interface.

### Navigation Hierarchy

```
Dashboard
  └─ Universities
      └─ University Hub
          ├─ Management Team
          └─ Colleges
              └─ College Hub
                  ├─ Leadership
                  ├─ Departments
                  ├─ Academic Staff
                  ├─ Administrative Staff
                  ├─ Non-Teaching Staff
                  ├─ Students
                  ├─ Curriculum & Exams
                  ├─ Library
                  ├─ Transport
                  ├─ Hostel
                  └─ Settings
```

### 10. University Hub Features

#### 10.1 University Overview
- **Description**: Central dashboard showing university-level statistics and quick actions
- **Display Elements**:
  - University name, logo, contact info
  - Status badge (Active/Inactive/Suspended)
  - Subscription tier and status
  - Statistics cards:
    - Total colleges count
    - Total students count
    - Total faculty count
    - Total staff count
- **Quick Action Cards**:
  - Management Team (navigate to university owners/super admins)
  - Colleges (navigate to colleges list)
  - Settings (navigate to university settings)
- **Permissions**: `universities.view`
- **Navigation**: `/universities/[id]`

#### 10.2 University Management Team
- **Description**: View and manage University Owners and Super Admins
- **Features**:
  - List all management users (University Owner, Super Admin roles)
  - View user details (name, email, phone, role, status, last login)
  - Filter by role
  - Search by name/email
  - View user activity logs
- **Actions**: View details, suspend, activate
- **Permissions**: `universities.view_users`
- **Navigation**: `/universities/[id]/management`

#### 10.3 University Colleges List (Contextual)
- **Description**: View all colleges belonging to specific university
- **Features**:
  - Colleges list filtered by university context
  - Display: name, code, type, email, phone, status
  - Filter by: status (active/inactive), type (engineering/arts/etc.)
  - Search by: name, code
  - Sorting: name, established year, student count
- **Actions**: View college hub, edit, suspend, activate, delete (with warning)
- **Permissions**: `colleges.view`
- **Navigation**: `/universities/[id]/colleges`

#### 10.4 University Settings
- **Description**: Configure university-level settings
- **Settings Categories**:
  - Basic Info: name, email, phone, address, logo
  - Subscription: tier, status, renewal date
  - Limits: storage quota, user limits, API rate limits
  - Customization: branding, domain, SSO configuration
- **Actions**: Edit, save
- **Permissions**: `universities.update_settings`
- **Navigation**: `/universities/[id]/settings`

### 11. College Hub Features (Integrated from All Portals)

#### 11.1 College Overview
- **Description**: Central dashboard showing college-level statistics and all sections
- **Display Elements**:
  - College name, code, type, accreditation
  - Status badge, established year
  - Statistics cards:
    - Departments count
    - Students count
    - Faculty count
    - Courses count
- **Section Cards** (links to all features):
  - Leadership
  - Departments
  - Academic Staff
  - Administrative Staff
  - Non-Teaching Staff
  - Students
  - Curriculum & Exams
  - Library
  - Transport
  - Hostel
  - Attendance
  - Settings
- **Permissions**: `colleges.view`
- **Navigation**: `/universities/[id]/colleges/[collegeId]`

#### 11.2 College Leadership Management
**Source**: Principal Portal + College Admin Portal features

- **Description**: Manage Principal and College Admin roles
- **Features**:
  - List all leadership users (Principal, College Admin roles)
  - View user details and permissions
  - Assign/remove Principal
  - Assign/remove College Admin
  - View activity logs
- **User Details Display**:
  - Name, email, phone, photo
  - Role and department assignment
  - Status and last login
  - Assigned permissions
- **Actions**: View, edit, suspend, activate
- **Permissions**: `colleges.manage_leadership`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/leadership`

#### 11.3 Department Management
**Source**: Principal Portal features

- **Description**: Complete CRUD for departments
- **Features**:
  - List all departments in college
  - Create new department
  - Edit department details
  - Delete department (with dependency check)
  - Assign/change HOD (Head of Department)
- **Department Fields**:
  - Name, code, established year
  - HOD assignment
  - Status (active/inactive)
  - Description
- **Display**: Department cards with HOD info, student count, faculty count
- **Validations**:
  - Name: Required, 2-100 chars
  - Code: Required, 2-20 chars, unique per college
  - HOD: Must be faculty member from this department
- **Actions**: Create, view, edit, delete (with warning), assign HOD
- **Permissions**: `departments.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/departments`

#### 11.4 Academic Staff Management
**Source**: Principal Portal + Faculty/Teacher Portal features

- **Description**: Manage all teaching staff (faculty, professors, teachers)
- **Features**:
  - List all faculty members in college
  - Filter by: department, designation (Professor/Assoc Prof/Asst Prof/Lecturer)
  - Search by: name, email, employee ID
  - Create new faculty member
  - Edit faculty details
  - Assign to department
  - View teaching assignments
  - View attendance records
- **Faculty Fields**:
  - Personal: name, email, phone, photo, address
  - Professional: employee ID, designation, department, qualification
  - Employment: joining date, experience years, status
- **Display**: Faculty cards with photo, designation, department, contact
- **Actions**: Create, view, edit, delete, assign courses, view performance
- **Permissions**: `faculty.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/academic-staff`

#### 11.5 Administrative Staff Management
**Source**: Admission Admin + Super Accountant + College Accounts Admin + College Fee Admin portals

- **Description**: Manage non-teaching administrative staff
- **Staff Categories**:
  - **Admission Staff**: Handle student admissions, applications, enrollment
  - **Accounts Staff**: Manage college finances, accounting, budgets
  - **Fee Collection Staff**: Process fee payments, generate receipts
- **Features**:
  - List by category
  - Create new admin staff
  - Assign roles and permissions
  - View activity logs
  - Manage access to modules
- **Staff Fields**:
  - Personal: name, email, phone
  - Role: Admission Admin / Accountant / Fee Admin
  - Department: Assigned department (if any)
  - Permissions: Module-specific permissions
- **Actions**: Create, view, edit, suspend, delete
- **Permissions**: `administrative_staff.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/administrative-staff`

#### 11.6 Non-Teaching Staff Management
**Source**: Super Non-Teaching Manager Portal features

- **Description**: Manage support staff (lab assistants, peons, maintenance, security)
- **Staff Categories**:
  - Lab Assistants: Technical support for labs
  - Peons/Attendants: Office support
  - Maintenance Staff: Infrastructure maintenance
  - Security Staff: Campus security
  - Transport Staff: Driver, conductors
  - Hostel Staff: Wardens, caretakers
  - Library Staff: Librarians, assistants
- **Features**:
  - List by category
  - Create new staff member
  - Assign to department/section
  - Track attendance
  - Manage shifts (if applicable)
- **Staff Fields**:
  - Personal: name, phone, address
  - Employment: employee ID, category, department
  - Shift: Shift timings (if applicable)
  - Status: Active/on-leave/inactive
- **Actions**: Create, view, edit, delete, track attendance
- **Permissions**: `non_teaching_staff.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/non-teaching-staff`

#### 11.7 Student Management
**Source**: Principal Portal + College Admin Portal + Student Portal features

- **Description**: Complete student lifecycle management
- **Features**:
  - List all students in college
  - Filter by: department, year, status (active/graduated/dropped)
  - Search by: name, enrollment number, email
  - Create/enroll new student
  - Edit student details
  - View academic records
  - View attendance
  - View fee payment history
  - View documents
  - Bulk import students (CSV/Excel)
- **Student Fields**:
  - Personal: name, email, phone, photo, DOB, gender, address
  - Academic: enrollment number, department, year, section, roll number
  - Parent: Parent name, phone, email
  - Status: Active/graduated/dropped/suspended
  - Admission date, expected graduation
- **Student Profile Sections**:
  - Overview: Basic info and current status
  - Academic Records: Courses, grades, GPA
  - Attendance: Subject-wise attendance percentage
  - Fees: Payment history, pending dues
  - Documents: ID cards, certificates, marksheets
  - Activities: Extracurricular participation
- **Actions**: Create, view, edit, promote, graduate, suspend, delete
- **Permissions**: `students.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/students`

#### 11.8 Curriculum & Examinations
**Source**: Super Academics Portal features

- **Description**: Manage curriculum, courses, syllabus, and examinations
- **Sub-Features**:
  
  **11.8a Curriculum Management**
  - Define curriculum structure (semesters, years)
  - Create/edit courses
  - Assign courses to departments
  - Set prerequisites
  - Manage syllabus content
  - Map learning outcomes
  
  **11.8b Course Management**
  - List all courses in college
  - Filter by department, year, semester
  - Create new course
  - Edit course details (name, code, credits, description)
  - Assign faculty to courses
  - Set course capacity
  
  **11.8c Examination Management**
  - Create exam schedule
  - Define exam types (midterm, final, practical, quiz)
  - Set exam dates and timings
  - Assign exam halls
  - Assign invigilators
  - Enter marks/grades
  - Generate result reports
  - Publish results to students

- **Permissions**: `curriculum.manage`, `exams.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/curriculum`

#### 11.9 Library Management
**Source**: College Admin Portal (Library section)

- **Description**: Complete library operations
- **Features**:
  
  **11.9a Book Inventory**
  - List all books
  - Add new books
  - Edit book details
  - Track book copies
  - Manage categories/genres
  - Search books (title, author, ISBN)
  
  **11.9b Issue & Return**
  - Issue books to students/faculty
  - Track issued books
  - Return books
  - Calculate late fees
  - Send reminders for due dates
  
  **11.9c Library Settings**
  - Set issue limits (max books per user)
  - Set issue duration
  - Configure late fee rules
  - Manage library timings

- **Permissions**: `library.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/library`

#### 11.10 Transport Management
**Source**: College Admin Portal (Transport section)

- **Description**: Manage college transportation
- **Features**:
  
  **11.10a Bus Routes**
  - Create/edit bus routes
  - Define stops and timings
  - Assign buses to routes
  - View route maps
  
  **11.10b Vehicle Management**
  - List all vehicles (buses, vans)
  - Add new vehicle
  - Edit vehicle details (registration, capacity, type)
  - Track maintenance schedule
  - Record fuel expenses
  
  **11.10c Student Transport**
  - Assign students to routes
  - Track transport fee payments
  - View passenger lists
  - Send route change notifications

- **Permissions**: `transport.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/transport`

#### 11.11 Hostel Management
**Source**: College Admin Portal (Hostel section)

- **Description**: Manage college hostel facilities
- **Features**:
  
  **11.11a Room Management**
  - List all hostel rooms
  - Define room types (single, double, triple)
  - Set room capacity
  - Track room occupancy
  
  **11.11b Room Allocation**
  - Assign students to rooms
  - Handle room change requests
  - View allocation history
  - Generate room lists
  
  **11.11c Hostel Attendance**
  - Mark daily attendance
  - Track leave/outpass
  - Send attendance reports
  
  **11.11d Mess Management**
  - Manage mess menu
  - Track meal plans
  - Handle mess fee payments

- **Permissions**: `hostel.manage`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/hostel`

#### 11.12 Attendance Management
**Source**: Faculty Portal + Principal Portal features

- **Description**: Track and report attendance across college
- **Features**:
  
  **11.12a Student Attendance**
  - View subject-wise attendance
  - Filter by department, year, subject
  - View defaulter lists (below 75%)
  - Generate attendance reports
  - Send notifications to parents
  
  **11.12b Faculty Attendance**
  - Mark faculty attendance
  - View faculty attendance reports
  - Track leave requests
  
  **11.12c Staff Attendance**
  - Track non-teaching staff attendance
  - Manage shift-based attendance

- **Permissions**: `attendance.view_all`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/attendance`

#### 11.13 College Settings
- **Description**: Configure college-specific settings
- **Settings Categories**:
  - Basic Info: name, code, type, email, phone, address
  - Academic: academic year, semester dates, holidays
  - Attendance: Minimum attendance requirement (default 75%)
  - Fees: Fee structure, payment deadlines
  - Notifications: Email/SMS templates, notification preferences
  - Customization: College logo, colors, branding
- **Actions**: Edit, save
- **Permissions**: `colleges.update_settings`
- **Navigation**: `/universities/[id]/colleges/[collegeId]/settings`

---

## Context Features

### 12. Context Preservation

#### 12.1 Breadcrumb Navigation
- **Description**: Always show current location in hierarchy
- **Display Format**: `Dashboard > Universities > MIT > Colleges > Engineering > Students`
- **Behavior**: Each level is clickable to navigate back
- **Always Visible**: On all pages within hierarchy

#### 12.2 Context-Aware Forms
- **Description**: Forms pre-filled with context
- **Examples**:
  - Creating student in Engineering College → College field pre-filled
  - Creating department → University and College pre-selected
  - Assigning faculty to course → Department context preserved
- **Benefits**: Faster data entry, fewer errors

#### 12.3 Contextual API Calls
- **Description**: API endpoints scoped to current context
- **Examples**:
  - `/api/admin/universities/{id}/colleges` → Only colleges for this university
  - `/api/admin/universities/{id}/colleges/{collegeId}/students` → Only students for this college
- **Benefits**: Better performance, clearer data scope

---

**🎯 The Bitflow Admin Portal is the control center for the entire platform.**

