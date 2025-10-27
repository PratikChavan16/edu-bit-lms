# University Owner Portal - Features

**Last Updated**: October 25, 2025

---

## Core Features

### 1. Colleges Management

#### 1.1 Create College
- **Description**: Add new college within the university
- **Inputs**: College name, code, address, principal assignment, student capacity, faculty count
- **Outputs**: College ID, auto-generated slug
- **Permissions**: `colleges.create`
- **Validation**:
  - Name: Required, 3-100 chars, unique within university
  - Code: Required, 3-10 chars (e.g., "COE", "COM"), unique
  - Principal: Optional, select from faculty with principal qualification
  - Capacity: Required, positive integer

#### 1.2 List Colleges
- **Description**: View all colleges in the university
- **Filters**: Status (active/inactive), search by name/code
- **Sorting**: By name, student count, created date
- **Display**: Grid or List view
- **Permissions**: `colleges.read`

#### 1.3 View College Details
- **Description**: Detailed view of single college
- **Data Shown**:
  - Basic info (name, code, principal, contact)
  - Statistics (students, faculty, departments, programs)
  - Performance metrics (attendance rate, pass percentage)
  - Recent activities
- **Actions**: Edit, Assign Principal, View Reports

#### 1.4 Edit College
- **Description**: Update college information
- **Editable Fields**: Name, code, address, contact, capacity, status
- **Permissions**: `colleges.update`
- **Audit**: All changes logged

#### 1.5 Assign/Change Principal
- **Description**: Assign a principal to manage the college
- **Workflow**: Select faculty member with principal role → Send notification → Update college record
- **Permissions**: `colleges.assign_principal`
- **Validation**: Selected user must have `principal` role

---

### 2. Academic Programs Management

#### 2.1 Create Academic Program
- **Description**: Define new degree program (B.Tech, MBA, M.Sc, etc.)
- **Inputs**:
  - Program name (e.g., "Bachelor of Technology")
  - Degree type (UG/PG/Diploma/Certificate)
  - Duration (years)
  - Total credits required
  - Assigned college(s)
  - Eligibility criteria
- **Outputs**: Program ID, program code (auto-generated)
- **Permissions**: `programs.create`

#### 2.2 List Programs
- **Description**: View all academic programs in university
- **Filters**: Degree type, college, status (active/inactive)
- **Sorting**: By name, student enrollment, created date
- **Permissions**: `programs.read`

#### 2.3 View Program Details
- **Description**: Detailed program information
- **Data Shown**:
  - Basic info (name, degree type, duration, credits)
  - Assigned colleges
  - Enrolled students count
  - Course list with credits
  - Faculty teaching in program
- **Actions**: Edit, Add Courses, Assign to College

#### 2.4 Manage Curriculum
- **Description**: Define courses and curriculum for program
- **Actions**:
  - Add courses to program
  - Set course prerequisites
  - Define semester-wise course distribution
  - Set elective groups
- **Permissions**: `programs.manage_curriculum`

---

### 3. Faculty Management

#### 3.1 Hire Faculty
- **Description**: Onboard new faculty member
- **Inputs**:
  - Personal info (name, email, phone, date of birth)
  - Qualifications (degrees, certifications)
  - Department assignment
  - Employment type (Full-time/Part-time/Visiting)
  - Designation (Professor/Associate Professor/Assistant Professor/Lecturer)
  - Joining date
- **Outputs**: Faculty ID, login credentials sent via email
- **Permissions**: `faculty.create`

#### 3.2 List Faculty
- **Description**: View all faculty across university
- **Filters**: College, department, designation, employment type
- **Search**: By name, email, employee ID
- **Display**: Table with photo, name, designation, college, contact
- **Permissions**: `faculty.read`

#### 3.3 View Faculty Profile
- **Description**: Complete faculty profile
- **Data Shown**:
  - Personal information
  - Qualifications and certifications
  - Courses teaching (current semester)
  - Attendance record
  - Performance reviews
  - Leave history
- **Actions**: Edit, Assign Courses, Grant Leave, Terminate

#### 3.4 Assign Faculty to Department
- **Description**: Assign faculty to specific department within college
- **Workflow**: Select faculty → Select college → Select department → Confirm
- **Permissions**: `faculty.assign`

#### 3.5 Manage Faculty Leaves
- **Description**: Approve or reject faculty leave requests
- **Workflow**: View pending leaves → Review reason and dates → Approve/Reject → Notify faculty
- **Permissions**: `faculty.approve_leave`

---

### 4. Student Management

#### 4.1 View All Students
- **Description**: University-wide student directory
- **Filters**: College, program, year, status (active/graduated/dropped)
- **Search**: By name, email, roll number
- **Display**: Table with photo, name, roll number, college, program
- **Permissions**: `students.read`

#### 4.2 View Student Profile
- **Description**: Complete student information
- **Data Shown**:
  - Personal information
  - Academic details (program, semester, CGPA)
  - Attendance summary
  - Fee payment status
  - Disciplinary records
- **Actions**: Edit, Transfer College, Suspend, View Transcript

#### 4.3 Student Transfer (Inter-College)
- **Description**: Transfer student from one college to another within university
- **Workflow**: Select student → Choose target college → Verify eligibility → Approve transfer → Notify student
- **Permissions**: `students.transfer`

#### 4.4 Bulk Student Import
- **Description**: Import multiple students via CSV
- **Format**: CSV with columns (name, email, program, college, roll_number)
- **Validation**: Email uniqueness, program existence, college capacity check
- **Permissions**: `students.bulk_import`

---

### 5. Admissions Management

#### 5.1 Configure Admission Criteria
- **Description**: Set admission rules for programs
- **Inputs**:
  - Minimum marks/percentage required
  - Entrance test requirement (yes/no)
  - Age limits
  - Domicile requirements
  - Reservation quotas (SC/ST/OBC/General)
- **Permissions**: `admissions.configure`

#### 5.2 View Applications
- **Description**: View all admission applications
- **Filters**: Program, college, application status (pending/approved/rejected)
- **Display**: Table with applicant name, program, marks, application date
- **Permissions**: `admissions.view_applications`

#### 5.3 Approve Merit List
- **Description**: Review and approve final merit list for admissions
- **Workflow**: View merit list generated by system → Verify ranks → Approve → Publish to applicants
- **Permissions**: `admissions.approve_merit_list`

#### 5.4 Conduct Entrance Tests
- **Description**: Schedule and manage entrance tests
- **Actions**:
  - Create test schedule
  - Assign test centers
  - Upload test results
  - Generate rank list
- **Permissions**: `admissions.manage_tests`

---

### 6. Financial Management

#### 6.1 View Fee Collection Dashboard
- **Description**: University-wide fee collection overview
- **Metrics**:
  - Total fees receivable (current semester)
  - Total fees collected
  - Collection percentage
  - Pending fees by college
- **Charts**: Bar chart (college-wise collection), Trend line (daily collection)
- **Permissions**: `finance.view_dashboard`

#### 6.2 Configure Fee Structure
- **Description**: Set fee amounts for programs
- **Inputs**:
  - Program selection
  - Semester
  - Fee components (Tuition, Lab, Library, Sports, etc.)
  - Amount for each component
  - Due date
- **Outputs**: Fee structure ID
- **Permissions**: `finance.configure_fees`

#### 6.3 View Fee Collection Reports
- **Description**: Detailed fee collection reports
- **Filters**: College, program, semester, date range
- **Export**: PDF, Excel, CSV
- **Permissions**: `finance.view_reports`

#### 6.4 Approve Expense Requests
- **Description**: Approve budget requests from colleges
- **Workflow**: View pending requests → Review justification → Approve/Reject → Notify requester
- **Permissions**: `finance.approve_expenses`

#### 6.5 Scholarship Management
- **Description**: Manage scholarships offered by university
- **Actions**:
  - Create scholarship schemes
  - Set eligibility criteria
  - Approve scholarship applications
  - Track scholarship disbursements
- **Permissions**: `finance.manage_scholarships`

---

### 7. Reports & Analytics

#### 7.1 University Dashboard
- **Description**: Real-time overview of key metrics
- **Widgets**:
  - Total students (with trend)
  - Total faculty (with trend)
  - Fee collection rate
  - Average attendance
  - Upcoming events
  - Pending approvals count
- **Refresh**: Auto-refresh every 30 seconds

#### 7.2 Academic Performance Reports
- **Description**: University-wide academic analytics
- **Reports**:
  - Semester-wise pass percentage
  - Program-wise CGPA distribution
  - Top performers list
  - Subjects with low pass rates
- **Filters**: College, program, semester, academic year
- **Export**: PDF, Excel

#### 7.3 Faculty Analytics
- **Description**: Faculty performance and workload reports
- **Reports**:
  - Workload distribution (courses per faculty)
  - Attendance record
  - Student feedback ratings
  - Research publications count
- **Permissions**: `reports.faculty_analytics`

#### 7.4 Student Retention Analysis
- **Description**: Track student dropout and retention rates
- **Metrics**:
  - Dropout rate by year
  - Reasons for dropout
  - Retention rate by program
  - Readmission statistics
- **Permissions**: `reports.retention_analysis`

#### 7.5 Financial Reports
- **Description**: Comprehensive financial analytics
- **Reports**:
  - Revenue vs expenses
  - Fee collection trends
  - Scholarship disbursements
  - Budget utilization by college
- **Permissions**: `reports.financial`

---

### 8. Infrastructure Management

#### 8.1 View Campus Infrastructure
- **Description**: Overview of university facilities
- **Data Shown**:
  - Total classrooms and capacity
  - Lab facilities by college
  - Hostel capacity and occupancy
  - Library resources
  - Sports facilities
- **Actions**: View Details, Allocate Resources

#### 8.2 Classroom Allocation
- **Description**: Allocate classrooms to colleges/departments
- **Workflow**: View available classrooms → Assign to college → Set capacity → Confirm
- **Permissions**: `infrastructure.allocate_classrooms`

#### 8.3 Hostel Management
- **Description**: Manage hostel facilities
- **Actions**:
  - View hostel occupancy
  - Allocate rooms to students
  - Track maintenance requests
  - Generate hostel reports
- **Permissions**: `infrastructure.manage_hostels`

---

### 9. Communication & Notifications

#### 9.1 Send Announcements
- **Description**: Broadcast announcements to university community
- **Recipients**: All users, specific roles (students/faculty), specific colleges
- **Channels**: Email, SMS, In-app notification
- **Inputs**: Title, message, attachments, target audience
- **Permissions**: `communication.send_announcements`

#### 9.2 Notification Center
- **Description**: View all notifications sent and received
- **Filters**: Type, date, recipient group
- **Actions**: View details, Resend, Delete

---

### 10. Settings & Configuration

#### 10.1 University Profile Settings
- **Description**: Update university information
- **Editable Fields**: Name, logo, address, contact email, phone, website, timezone
- **Permissions**: `settings.update_profile`

#### 10.2 Academic Calendar Configuration
- **Description**: Define academic year and semester dates
- **Inputs**:
  - Academic year (e.g., 2025-2026)
  - Semester start and end dates
  - Holiday list
  - Exam schedule
- **Permissions**: `settings.configure_calendar`

#### 10.3 User Management
- **Description**: Manage University Owner and Super Admin users
- **Actions**:
  - Add new user
  - Assign roles (university_owner, super_admin)
  - Deactivate users
  - Reset passwords
- **Permissions**: `settings.manage_users`

#### 10.4 Email & SMS Configuration
- **Description**: Configure communication templates
- **Templates**: Welcome emails, admission confirmation, fee reminders, event notifications
- **Customization**: Subject, body, variables (e.g., {student_name})
- **Permissions**: `settings.configure_templates`

---

## Permission Matrix

| Feature | University Owner | Super Admin | Principal |
|---------|------------------|-------------|-----------|
| Colleges Management | ✅ Full | ✅ Full | ❌ View Only |
| Academic Programs | ✅ Full | ✅ Full | ❌ View Only |
| Faculty Management | ✅ Full | ✅ Full | ✅ College-specific |
| Student Management | ✅ Full | ✅ Full | ✅ College-specific |
| Admissions | ✅ Full | ✅ Full | ❌ View Only |
| Financial Management | ✅ Full | ✅ Full | ❌ View Only |
| Reports & Analytics | ✅ Full | ✅ Full | ✅ College-specific |
| Infrastructure | ✅ Full | ✅ Full | ❌ View Only |
| Settings | ✅ Full | ✅ Limited | ❌ None |

---

**Total Features**: 50+ distinct features across 10 categories
