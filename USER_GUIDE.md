# Bitflow Owner Portal - User Guide

**Version 1.0** | Last Updated: 2024

---

## Table of Contents

1. [Introduction](#introduction)
2. [Getting Started](#getting-started)
3. [User Roles](#user-roles)
4. [Feature Guides](#feature-guides)
   - [For Bitflow Owners](#for-bitflow-owners-god-mode)
   - [For University Owners](#for-university-owners)
   - [For College Administrators](#for-college-administrators)
5. [Common Tasks](#common-tasks)
6. [Troubleshooting](#troubleshooting)
7. [FAQs](#faqs)

---

## Introduction

Welcome to the **Bitflow Owner Portal**! This comprehensive platform enables multi-level educational institution management across universities, colleges, departments, faculty, and students.

### Key Features
- ✅ **Multi-Tenant Architecture**: Secure data isolation between organizations
- ✅ **Role-Based Access Control**: Bitflow Owner, University Owner, College Admin roles
- ✅ **God Mode**: System-wide oversight for Bitflow administrators
- ✅ **Advanced Reporting**: PDF reports with custom templates and scheduling
- ✅ **Real-Time Notifications**: Stay updated on important events
- ✅ **Advanced Search**: Find data across all entities quickly
- ✅ **Bulk Operations**: Import/export data efficiently

---

## Getting Started

### Accessing the Portal

1. **Navigate** to the portal URL: `https://admin.bitflow.com`
2. **Enter** your email and password
3. **Click** "Login"
4. **Dashboard** loads based on your role

### First-Time Login

**University Owners and College Admins**:
1. Check your email for login credentials
2. Change your password on first login (recommended)
3. Complete your profile information
4. Explore the dashboard to familiarize yourself with features

**Password Requirements**:
- Minimum 8 characters
- Mix of letters and numbers recommended
- Case-sensitive

---

## User Roles

### 1. Bitflow Owner (Super Admin)

**Capabilities**:
- Full system access (God Mode)
- Manage all universities and their data
- View cross-organization analytics
- Create university owner accounts
- System-wide settings and configurations
- Access audit logs

**Dashboard View**:
- Total organizations count
- Total users across all organizations
- System-wide statistics
- Recent activities across all organizations

---

### 2. University Owner

**Capabilities**:
- Manage university profile
- Create and manage colleges
- Manage university-level users
- View university-wide reports
- Configure university settings
- Manage departments and faculty
- Monitor college activities

**Dashboard View**:
- University overview statistics
- Number of colleges
- Total students and faculty
- Recent enrollments
- Upcoming events

**Data Scope**: Can only view and manage data within their assigned university

---

### 3. College Administrator

**Capabilities**:
- Manage college profile
- Create and manage departments
- Manage faculty and students
- Generate college reports
- Enroll students
- View college analytics

**Dashboard View**:
- College overview
- Number of departments
- Student enrollment by department
- Faculty count
- Recent activities

**Data Scope**: Can only view and manage data within their assigned college

---

## Feature Guides

## For Bitflow Owners (God Mode)

### Accessing God Mode

1. **Login** as a Bitflow Owner
2. **Click** "God Mode" in the navigation menu
3. **Dashboard** displays system-wide overview

### Managing Organizations

#### View All Organizations

```
God Mode → Organizations → View All
```

**Features**:
- List of all universities
- Quick stats per organization
- Status indicators (active/inactive)
- Search and filter options

#### Switch Organization Context

```
God Mode → Organization Selector (dropdown in header)
```

**Steps**:
1. Click organization selector dropdown
2. Choose organization
3. View switches to that organization's data
4. All pages now show selected organization's data

**Use Case**: Review a specific university's data without switching accounts

#### Compare Organizations

```
God Mode → Comparison Tool
```

**Steps**:
1. Select Organization 1 from dropdown
2. Select Organization 2 from dropdown
3. Click "Compare"
4. View side-by-side metrics:
   - Total students
   - Total faculty
   - Number of colleges
   - Revenue (if configured)
   - Enrollment trends

### System Settings

```
God Mode → System Settings
```

**Available Settings**:
- **General**: Application name, logo, timezone
- **Security**: Session timeout, password policies
- **Email**: SMTP configuration for notifications
- **Features**: Enable/disable features per organization

### Audit Logs

```
God Mode → Audit Logs
```

**Information Tracked**:
- User login/logout events
- Data creation/modification/deletion
- Permission changes
- Bulk operations
- Report generation

**Filters**:
- Date range
- User
- Action type
- Organization
- Entity type (university, college, student, etc.)

**Export**: Download audit logs as CSV for compliance

---

## For University Owners

### Managing Your University

#### Update University Profile

```
Dashboard → Settings → University Profile
```

**Editable Fields**:
- University name
- Domain (e.g., harvard.edu)
- Established year
- Status (active/inactive)
- Contact information
- Address
- Website

**Steps**:
1. Navigate to University Profile
2. Click "Edit"
3. Update fields
4. Click "Save Changes"
5. Confirmation message appears

### Managing Colleges

#### Create a New College

```
Colleges → Add College
```

**Required Fields**:
- College name (e.g., "College of Engineering")
- College type (Engineering, Arts, Science, Commerce, Medical, Law, Other)
- Status (active/inactive)

**Optional Fields**:
- Established year
- Dean name
- Contact email
- Phone number

**Steps**:
1. Click "Add College" button
2. Fill in the form
3. Click "Create College"
4. College appears in colleges list

#### View College Details

```
Colleges → [Click on College Name]
```

**Displays**:
- College overview
- Number of departments
- Total students and faculty
- Recent activities
- Departments list

#### Edit/Delete College

- **Edit**: Click pencil icon → update fields → save
- **Delete**: Click trash icon → confirm deletion
  - ⚠️ **Warning**: Deleting a college removes all associated departments, faculty, and student records

### Managing Users

#### Create University-Level Users

```
Users → Add User
```

**Available Roles**:
- **College Admin**: Assign to a specific college
- **University Staff**: University-level access without admin privileges

**Required Fields**:
- Name
- Email (must be unique)
- Password
- Role
- Assigned College (if College Admin)

**Steps**:
1. Click "Add User"
2. Fill in user information
3. Select role from dropdown
4. If College Admin, select which college
5. Click "Create User"
6. User receives email with login credentials

#### View and Manage Users

```
Users → View All
```

**Features**:
- Filter by role
- Search by name or email
- Deactivate/reactivate users
- Reset passwords
- View user activity

### Viewing Reports

#### Generate University Report

```
Reports → Generate Report
```

**Report Types**:
1. **Student Enrollment Report**
   - Total students by college
   - Enrollment trends over time
   - Demographics breakdown

2. **Faculty Report**
   - Total faculty by college/department
   - Employment types
   - Qualifications overview

3. **Department Report**
   - Departments list
   - Student count per department
   - Faculty count per department

**Steps**:
1. Select report type
2. Choose date range
3. Select colleges to include (optional - default: all)
4. Click "Generate Report"
5. Report generates (may take 10-30 seconds)
6. Click "Download PDF" or "Export to Excel"

#### Schedule Recurring Reports

```
Reports → Scheduled Reports → Schedule New
```

**Configuration**:
- Report type
- Frequency (daily, weekly, monthly)
- Day of week/month
- Time of day
- Email recipients (comma-separated)
- Format (PDF, Excel)

**Example**: Send monthly enrollment report every 1st of the month at 9 AM to deans

---

## For College Administrators

### Managing Your College

#### Update College Profile

```
Dashboard → Settings → College Profile
```

**Editable Fields**:
- College name
- Type
- Dean information
- Contact details

### Managing Departments

#### Create a Department

```
Departments → Add Department
```

**Required Fields**:
- Department name (e.g., "Computer Science")
- Department code (e.g., "CS" or "CSE")

**Optional Fields**:
- Head of Department (HOD) name
- Contact email
- Office location

**Steps**:
1. Click "Add Department"
2. Fill in department information
3. Click "Create Department"

#### View/Edit/Delete Department

- **View**: Click department name
- **Edit**: Click pencil icon → update → save
- **Delete**: Click trash icon → confirm
  - ⚠️ **Warning**: Deletes all faculty and students in department

### Managing Faculty

#### Add Faculty Member

```
Faculty → Add Faculty
```

**Required Fields**:
- Select User Account (create user first if new)
- Employee ID
- Designation (Professor, Associate Professor, Assistant Professor, Lecturer)
- Employment Type (Full-time, Part-time, Visiting, Contract)
- Joining Date

**Optional Fields**:
- Department assignment
- Qualification (Ph.D., M.Tech, etc.)
- Specialization
- Experience years
- Salary

**Steps**:
1. Create user account first (Users → Add User)
2. Go to Faculty → Add Faculty
3. Select the user from dropdown
4. Fill in faculty details
5. Click "Create Faculty"

#### View Faculty List

```
Faculty → View All
```

**Features**:
- Filter by department
- Filter by employment type
- Search by name or employee ID
- View faculty profile
- Edit faculty details
- Remove faculty assignment (doesn't delete user account)

### Managing Students

#### Enroll a Student

```
Students → Enroll Student
```

**Required Fields**:
- Select User Account (create user first if new)
- Department
- Admission Number (must be unique)
- Admission Date
- Course (e.g., "B.Tech Computer Science")
- Year (1-6)

**Optional Fields**:
- Section (A, B, C, etc.)
- Roll Number
- Blood Group
- Date of Birth
- Gender
- Nationality
- Guardian Information (name, phone, email)
- Emergency Contact

**Steps**:
1. Create user account: Users → Add User → Role: Student
2. Go to Students → Enroll Student
3. Select the user
4. Fill in student details
5. Click "Enroll Student"

#### Bulk Student Enrollment

```
Students → Bulk Operations → Import Students
```

**Steps**:
1. Download template CSV file
2. Fill in student data (one per row)
3. Click "Upload CSV"
4. Review preview
5. Click "Import Students"
6. View import summary (success/failures)

**CSV Format**:
```csv
name,email,admission_number,course,year,department_code
John Doe,john@example.com,2024001,B.Tech CS,1,CS
Jane Smith,jane@example.com,2024002,B.Tech CS,1,CS
```

#### View and Manage Students

```
Students → View All
```

**Features**:
- Filter by department
- Filter by year
- Filter by status (active, suspended, graduated, dropped)
- Search by name, admission number, or roll number
- View student profile
- Edit student details
- Update student status

#### Graduate/Suspend Student

**Change Status**:
1. Go to student profile
2. Click "Edit"
3. Change status dropdown:
   - Active: Currently enrolled
   - Suspended: Temporarily not active
   - Graduated: Completed course
   - Dropped: Left before completion
4. Click "Save Changes"

### Viewing College Reports

#### Generate College Report

```
Reports → Generate Report
```

**Report Types**:
1. **Department-wise Enrollment**: Students per department
2. **Faculty Distribution**: Faculty per department
3. **Year-wise Enrollment**: Students by year
4. **Attendance Summary** (if configured)

**Steps**:
1. Select report type
2. Choose date range
3. Select departments (optional)
4. Click "Generate"
5. Download PDF or Excel

---

## Common Tasks

### Searching for Data

#### Global Search

**Location**: Search bar in top navigation

**Searches Across**:
- Universities
- Colleges
- Departments
- Faculty
- Students
- Users

**Steps**:
1. Type search term in search bar
2. Results appear as you type
3. Click result to view details

**Tips**:
- Use names, IDs, or email addresses
- Search is case-insensitive
- Minimum 3 characters required

#### Advanced Search

```
Search → Advanced Search
```

**Filters**:
- Entity type (universities, colleges, students, etc.)
- Date range (for created/modified dates)
- Status (active, inactive, etc.)
- Custom filters per entity type

### Managing Your Profile

```
Profile Icon (top right) → Settings
```

**Editable**:
- Name
- Email (requires verification)
- Password
- Profile picture
- Contact information
- Notification preferences

**Password Change**:
1. Click "Change Password"
2. Enter current password
3. Enter new password (min 8 characters)
4. Confirm new password
5. Click "Update Password"

### Notifications

#### Viewing Notifications

**Notification Bell** (top right):
- Badge shows unread count
- Click to see recent notifications
- Click "View All" for full list

#### Notification Types

- **System**: System updates, maintenance notices
- **Activity**: User activities related to you
- **Report**: Report generation complete
- **Alert**: Important alerts requiring action

#### Managing Notifications

```
Notifications → All Notifications
```

**Actions**:
- Mark as read
- Mark all as read
- Delete notification
- Filter by type
- Search notifications

#### Notification Preferences

```
Profile → Settings → Notifications
```

**Options**:
- Email notifications on/off
- Push notifications on/off
- Notification types to receive
- Frequency (real-time, daily digest, weekly digest)

### Bulk Operations

#### Bulk Import

**Supported Entities**:
- Students
- Faculty
- Departments

**Steps**:
1. Navigate to entity page (e.g., Students)
2. Click "Bulk Operations" → "Import"
3. Download CSV template
4. Fill in data
5. Upload CSV file
6. Review preview
7. Confirm import
8. View import summary

**Import Validation**:
- Checks for required fields
- Validates data formats
- Checks for duplicates
- Shows errors before import

#### Bulk Export

**Formats**: CSV, Excel

**Steps**:
1. Navigate to entity page
2. Apply filters (optional)
3. Click "Export"
4. Select format (CSV/Excel)
5. Download starts automatically

**Exported Data Includes**:
- All visible columns
- Respects current filters
- Maximum 10,000 records per export

---

## Troubleshooting

### Login Issues

**Problem**: Can't log in with correct credentials

**Solutions**:
1. Verify email is correct (case-sensitive)
2. Check Caps Lock is off for password
3. Clear browser cache and cookies
4. Try password reset: Login Page → "Forgot Password"
5. Contact administrator if issue persists

---

**Problem**: "Account not activated" error

**Solution**:
1. Check email for activation link
2. Click activation link
3. If link expired, request new activation email
4. Contact administrator if no email received

---

### Permission Errors

**Problem**: "You don't have permission" message

**Cause**: Trying to access feature not available for your role

**Solutions**:
1. Verify your role: Profile → View Role
2. Contact administrator to request permission
3. Check if you're in correct organization context (God Mode users)

---

**Problem**: Can't see certain data

**Cause**: Data scoping based on role

**Understanding**:
- **College Admins**: See only their college's data
- **University Owners**: See only their university's data
- **Bitflow Owners**: See all data (use organization selector)

---

### Report Generation Issues

**Problem**: Report taking too long to generate

**Solutions**:
1. Reduce date range
2. Select fewer colleges/departments
3. Large reports (>10,000 records) may take 1-2 minutes
4. Refresh page if stuck >3 minutes

---

**Problem**: Report shows no data

**Solutions**:
1. Verify date range includes data
2. Check filters (college, department selection)
3. Ensure you have data for selected report type
4. Verify data exists in system

---

### Bulk Import Errors

**Problem**: CSV import fails

**Common Errors**:
1. **"Invalid CSV format"**
   - Ensure file is .csv extension
   - Use template provided
   - Check for extra columns

2. **"Duplicate admission number"**
   - Admission numbers must be unique
   - Check for duplicates in CSV
   - Check existing records in system

3. **"Invalid department code"**
   - Department must exist before import
   - Create departments first
   - Verify department codes match

4. **"Required field missing"**
   - Check all required columns filled
   - Empty cells in required columns cause errors

**Best Practices**:
- Import in batches of 100-500 records
- Validate data before import
- Keep backup of CSV file
- Review preview before confirming

---

### Browser Compatibility

**Supported Browsers**:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

**Problem**: Features not working or display issues

**Solutions**:
1. Update browser to latest version
2. Clear browser cache (Ctrl+Shift+Delete)
3. Disable browser extensions temporarily
4. Try incognito/private mode
5. Switch to supported browser

---

## FAQs

### General

**Q: How do I change my password?**

A: Profile Icon → Settings → Security → Change Password

---

**Q: Can I have multiple user accounts?**

A: No, each email can have only one account, but accounts can have multiple roles.

---

**Q: How is my data secured?**

A: We use:
- JWT authentication
- Role-based access control
- Data encryption (HTTPS)
- Regular security audits
- Tenant data isolation

---

### For University Owners

**Q: Can I create university owner accounts?**

A: No, only Bitflow Owners can create University Owner accounts. Contact your Bitflow administrator.

---

**Q: How many colleges can I create?**

A: No limit. Create as many colleges as needed for your university.

---

**Q: Can I transfer a college to another university?**

A: No, colleges are permanently associated with a university. Contact Bitflow support for special cases.

---

**Q: Can I see other universities' data?**

A: No, University Owners can only see data from their assigned university.

---

### For College Admins

**Q: Can I create departments in other colleges?**

A: No, College Admins can only manage their assigned college.

---

**Q: What happens if I delete a department with students?**

A: The system will warn you and require confirmation. All faculty and students in that department will be removed. This cannot be undone.

---

**Q: Can students belong to multiple departments?**

A: No, each student is assigned to one primary department. Transfer students by editing their profile.

---

**Q: How do I handle student transfers between departments?**

A: Edit student profile → Change department dropdown → Save

---

### Reports

**Q: Can I customize report templates?**

A: Yes. Reports → Templates → Create Custom Template

---

**Q: How long are reports stored?**

A: Generated reports are stored for 30 days, then automatically deleted. Download and save locally if needed longer.

---

**Q: Can I schedule reports to multiple recipients?**

A: Yes, enter multiple emails separated by commas in the scheduled report configuration.

---

**Q: What's the maximum report size?**

A: Reports can include up to 50,000 records. For larger datasets, use filters or export in batches.

---

### Bulk Operations

**Q: What's the maximum bulk import size?**

A: 1,000 records per import. For larger imports, split into multiple CSV files.

---

**Q: Can I undo a bulk import?**

A: No, bulk imports are permanent. Review the preview carefully before confirming.

---

**Q: What if some records fail during bulk import?**

A: The system shows a summary:
- Successful imports
- Failed imports with error messages
- Download error report
- Successfully imported records are saved
- Fix errors in CSV and re-import failed records

---

### Notifications

**Q: Why am I not receiving email notifications?**

A: Check:
1. Email notifications enabled: Profile → Settings → Notifications
2. Email address is correct and verified
3. Check spam/junk folder
4. Contact administrator if issue persists

---

**Q: Can I disable notifications?**

A: Yes, but system alerts cannot be disabled. Profile → Settings → Notifications → Customize preferences

---

**Q: How long are notifications stored?**

A: Notifications are stored for 90 days, then automatically deleted.

---

## Getting Help

### Contact Support

**Email**: support@bitflow.com  
**Phone**: +1 (555) 123-4567  
**Hours**: Monday-Friday, 9 AM - 6 PM EST

### Documentation

- **API Documentation**: `docs/API_DOCUMENTATION.md`
- **Developer Guide**: `docs/implementation/`
- **Architecture**: `docs/ARCHITECTURE.md`

### Video Tutorials

Coming soon! Check the Help menu for updates.

---

## Appendix

### Glossary

- **Tenant**: An organization (university) with isolated data
- **God Mode**: System-wide administrative access for Bitflow Owners
- **RBAC**: Role-Based Access Control
- **JWT**: JSON Web Token (authentication method)
- **Bulk Operation**: Import/export multiple records at once

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + K` or `Cmd + K` | Focus global search |
| `Ctrl + /` or `Cmd + /` | Show keyboard shortcuts |
| `Esc` | Close modals/dropdowns |
| `Alt + N` | View notifications |

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Feedback**: docs@bitflow.com

---

© 2024 Bitflow. All rights reserved.
