# BITFLOW ADMIN - SYSTEMATIC TESTING GUIDE

## Purpose
This guide provides step-by-step instructions to test EVERY feature in Bitflow Admin (God Mode) portal.

---

## SETUP - Before Testing

### Prerequisites
1. Backend server running (`php artisan serve`)
2. Frontend dev server running (`npm run dev`)
3. Database seeded with test data
4. Login as bitflow_owner role

### Test Account
- Email: admin@bitflow.com (or your bitflow_owner account)
- Role: bitflow_owner

---

## SECTION 1: AUTHENTICATION ✅

### Test 1.1: Login Flow
1. Navigate to login page
2. Enter invalid credentials
3. **VERIFY**: Error message shown
4. Enter valid credentials
5. **VERIFY**: Redirects to dashboard
6. **VERIFY**: Token stored in localStorage

### Test 1.2: Protected Routes
1. Logout
2. Try to access `/universities` directly
3. **VERIFY**: Redirects to login

---

## SECTION 2: UNIVERSITIES MANAGEMENT

### Test 2.1: Universities List
1. Navigate to `/universities`
2. **VERIFY**: Page loads without 404
3. **VERIFY**: Shows list of universities
4. **VERIFY**: Each card shows:
   - University name
   - Type (Public/Private)
   - Status badge
   - Location
   - Colleges count
   - Students count
5. **VERIFY**: Search box visible
6. **VERIFY**: "Add University" button visible

### Test 2.2: Create University
1. Click "Add University"
2. **VERIFY**: Modal/form opens
3. Fill in:
   - Name: "Test University XYZ"
   - Short name: "TU-XYZ"
   - Type: Select "Public"
   - Email: "contact@tuxxyz.edu"
   - Phone: "1234567890"
   - Address: "123 Test St"
   - City: "Test City"
   - State: "Test State"
   - Postal Code: "12345"
   - Country: "India"
   - Status: "Active"
4. Submit form
5. **VERIFY**: Success message shown
6. **VERIFY**: New university appears in list
7. **VERIFY**: Stats are 0 for new university

### Test 2.3: View University Detail
1. Click on newly created university
2. **VERIFY**: Navigates to `/universities/{id}`
3. **VERIFY**: Overview page loads
4. **VERIFY**: Shows university info
5. **VERIFY**: Shows stat cards (Colleges, Students, etc.)
6. **VERIFY**: Breadcrumb shows: Universities > [University Name]

### Test 2.4: Edit University
1. Click "Edit" button (if exists)
2. **VERIFY**: Form pre-populates with data
3. Change name to "Test University XYZ Updated"
4. Submit
5. **VERIFY**: Name updated on overview page
6. **VERIFY**: Name updated in universities list

### Test 2.5: Search Universities
1. Go to `/universities`
2. Type in search box: "XYZ"
3. **VERIFY**: Filters to show only matching universities
4. Clear search
5. **VERIFY**: Shows all universities again

---

## SECTION 3: UNIVERSITY MANAGEMENT TEAM ⭐ JUST FIXED

### Test 3.1: View Management Team
1. Navigate to university detail: `/universities/{id}`
2. Click "Management Team" link or navigate to `/universities/{id}/management`
3. **VERIFY**: Page loads without 404
4. **VERIFY**: Shows list of university owners/super admins
5. **VERIFY**: Each row shows:
   - User avatar/name
   - Role badge
   - Email
   - Status
   - Actions (Edit/Delete)

### Test 3.2: Add User (JUST FIXED)
1. Click "Add User" button
2. **VERIFY**: Modal opens ✅ SHOULD WORK NOW
3. Fill in form:
   - Name: "John Doe"
   - Email: "john.doe@tuxxyz.edu"
   - Role: Select "University Owner"
   - Password: "password123"
   - Confirm Password: "password123"
4. Click "Create User"
5. **VERIFY**: Modal closes
6. **VERIFY**: User appears in list
7. **VERIFY**: Success message shown

### Test 3.3: Edit User (JUST FIXED)
1. Click Edit icon on a user row
2. **VERIFY**: Modal opens with pre-filled data ✅ SHOULD WORK NOW
3. Change name to "John Doe Updated"
4. Leave password blank (should keep existing)
5. Click "Update User"
6. **VERIFY**: Modal closes
7. **VERIFY**: Name updated in list

### Test 3.4: Edit User Password
1. Click Edit on same user
2. Enter new password: "newpassword123"
3. Confirm password: "newpassword123"
4. Click "Update User"
5. **VERIFY**: Password updated
6. Try logging in with new password (if test account)

### Test 3.5: Delete User (JUST FIXED)
1. Click Delete icon on a user row
2. **VERIFY**: Confirmation dialog appears ✅ SHOULD WORK NOW
3. Click Cancel
4. **VERIFY**: User still in list
5. Click Delete again
6. Click Confirm
7. **VERIFY**: User removed from list

### Test 3.6: Search Management Team
1. Type in search box
2. **VERIFY**: Filters users by name/email

### Test 3.7: Data Isolation
1. Create another university (University B)
2. Add users to University B management
3. Go to University A management
4. **VERIFY**: Only shows users for University A
5. **VERIFY**: University B users NOT shown

---

## SECTION 4: COLLEGES MANAGEMENT

### Test 4.1: View Colleges List
1. Navigate to `/universities/{id}/colleges`
2. **VERIFY**: Page loads
3. **VERIFY**: Shows colleges for THIS university only
4. **VERIFY**: Each college card shows:
   - College name
   - Type badge
   - Location
   - Stats (departments, students, faculty)

### Test 4.2: Create College
1. Click "Add College"
2. Fill form:
   - Name: "Engineering College"
   - Short name: "ENGG"
   - Type: "Engineering"
   - University: Pre-selected (should be current university)
   - Contact details
3. Submit
4. **VERIFY**: College created
5. **VERIFY**: Appears in list
6. **VERIFY**: university_id is correct

### Test 4.3: View College Hub
1. Click on a college
2. **VERIFY**: Navigates to `/universities/{uid}/colleges/{cid}`
3. **VERIFY**: Hub page loads
4. **VERIFY**: Shows 13+ section cards:
   - Leadership
   - Departments
   - Academic Staff
   - Administrative Staff
   - Non-Teaching Staff
   - Students
   - Curriculum
   - Exams
   - Library
   - Transport
   - Hostel
   - Fees
   - Attendance
   - Settings
5. **VERIFY**: Breadcrumb shows: Universities > [Uni] > Colleges > [College]

### Test 4.4: College Stats Accuracy
1. On college hub, note the stats:
   - Departments: 0
   - Students: 0
   - Faculty: 0
2. Go to Departments section
3. Add a department
4. Return to college hub
5. **VERIFY**: Departments count = 1
6. Repeat for students, faculty
7. **VERIFY**: All stats update correctly

---

## SECTION 5: COLLEGE DEPARTMENTS ✅

### Test 5.1: View Departments
1. Navigate to `/universities/{uid}/colleges/{cid}/departments`
2. **VERIFY**: Page loads without 500 error
3. **VERIFY**: Shows departments for THIS college only
4. **VERIFY**: Each row shows:
   - Department name
   - Code
   - HOD name
   - Student count
   - Faculty count

### Test 5.2: Add Department
1. Click "Add Department"
2. Fill form:
   - Name: "Computer Science"
   - Code: "CSE"
   - HOD: Select from dropdown
3. Submit
4. **VERIFY**: Department created
5. **VERIFY**: Appears in list
6. **VERIFY**: college_id is correct

### Test 5.3: Edit Department
1. Click Edit on a department
2. Change name to "Computer Science & Engineering"
3. Submit
4. **VERIFY**: Name updated

### Test 5.4: Delete Department
1. Click Delete on a department
2. Confirm
3. **VERIFY**: Department removed

### Test 5.5: Data Isolation
1. Create College B in same university
2. Add departments to College B
3. Go to College A departments
4. **VERIFY**: Only shows College A departments

---

## SECTION 6: ACADEMIC STAFF ✅

### Test 6.1: View Faculty
1. Navigate to `/universities/{uid}/colleges/{cid}/academic-staff`
2. **VERIFY**: Page loads
3. **VERIFY**: Shows faculty for THIS college only
4. **VERIFY**: Filter by department works
5. **VERIFY**: Filter by designation works

### Test 6.2: Add Faculty
1. Click "Add Faculty"
2. Fill form:
   - Name: "Dr. Jane Smith"
   - Email: "jane.smith@college.edu"
   - Department: Select
   - Designation: "Professor"
3. Submit
4. **VERIFY**: Faculty created
5. **VERIFY**: college_id correct

### Test 6.3: Edit/Delete Faculty
1. Edit faculty member
2. **VERIFY**: Updates correctly
3. Delete faculty member
4. **VERIFY**: Removes correctly

---

## SECTION 7: STUDENTS ✅

### Test 7.1: View Students
1. Navigate to `/universities/{uid}/colleges/{cid}/students`
2. **VERIFY**: Page loads
3. **VERIFY**: Shows students for THIS college only
4. **VERIFY**: Filters work (department, year, status)

### Test 7.2: Add Student
1. Click "Add Student"
2. **VERIFY**: Form opens
3. **VERIFY**: Department dropdown has options
4. Fill form and submit
5. **VERIFY**: Student created
6. **VERIFY**: college_id correct

---

## SECTION 8: LIBRARY ✅

### Test 8.1: View Books
1. Navigate to `/universities/{uid}/colleges/{cid}/library`
2. **VERIFY**: Page loads
3. **VERIFY**: Shows books for THIS college only

### Test 8.2: Add Book
1. Click "Add Book"
2. Fill form and submit
3. **VERIFY**: Book created
4. **VERIFY**: college_id correct

---

## SECTION 9: TRANSPORT ✅

### Test 9.1: View Routes
1. Navigate to `/universities/{uid}/colleges/{cid}/transport`
2. **VERIFY**: Page loads
3. **VERIFY**: Shows routes for THIS college only

### Test 9.2: Add Route
1. Click "Add Route"
2. Fill form and submit
3. **VERIFY**: Route created

---

## SECTION 10: PLACEHOLDER PAGES

### Test 10.1: Leadership
1. Navigate to `/universities/{uid}/colleges/{cid}/leadership`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Backend exists, UI needs building

### Test 10.2: Administrative Staff
1. Navigate to `/universities/{uid}/colleges/{cid}/administrative-staff`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Needs backend controller

### Test 10.3: Non-Teaching Staff
1. Navigate to `/universities/{uid}/colleges/{cid}/non-teaching-staff`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Needs backend controller

### Test 10.4: Curriculum
1. Navigate to `/universities/{uid}/colleges/{cid}/curriculum`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Should connect to CourseController

### Test 10.5: Hostel
1. Navigate to `/universities/{uid}/colleges/{cid}/hostel`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Backend exists, UI needs building

### Test 10.6: Attendance
1. Navigate to `/universities/{uid}/colleges/{cid}/attendance`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Needs backend controller

### Test 10.7: Settings
1. Navigate to `/universities/{uid}/colleges/{cid}/settings`
2. **VERIFY**: Loads (no 404) ✅
3. **VERIFY**: Shows "Coming Soon" message ✅
4. **NOTE**: Backend exists, UI needs building

---

## SECTION 11: EXAMS & FEES

### Test 11.1: Exams
1. Navigate to `/universities/{uid}/colleges/{cid}/exams`
2. **VERIFY**: Page loads
3. **TEST**: Add/edit/delete functionality

### Test 11.2: Fees
1. Navigate to `/universities/{uid}/colleges/{cid}/fees`
2. **VERIFY**: Page loads
3. **TEST**: Fee management functionality

---

## CRITICAL TESTS - DATA ISOLATION

### Test CI-1: University Isolation
1. Create University A
2. Add colleges to University A
3. Create University B
4. Navigate to University B
5. **VERIFY**: Does NOT show University A's colleges

### Test CI-2: College Isolation
1. Create College A in University X
2. Add departments to College A
3. Create College B in University X
4. Navigate to College B departments
5. **VERIFY**: Does NOT show College A's departments

### Test CI-3: Cross-Section Isolation
1. Add students to College A
2. Add faculty to College A
3. Navigate to College B
4. Check students list
5. **VERIFY**: College B shows 0 students
6. Check faculty list
7. **VERIFY**: College B shows 0 faculty

---

## PERFORMANCE TESTS

### Test P-1: Large Data Sets
1. Create university with 50 colleges
2. **VERIFY**: List loads quickly
3. **VERIFY**: Search works
4. **VERIFY**: Pagination works (if implemented)

### Test P-2: Stats Loading
1. Navigate to college hub
2. **VERIFY**: Stats load without delay
3. **VERIFY**: No N+1 query issues (check backend logs)

---

## ERROR HANDLING TESTS

### Test E-1: Invalid Routes
1. Navigate to `/universities/999999` (non-existent ID)
2. **VERIFY**: Shows error page or 404
3. **VERIFY**: No console errors

### Test E-2: API Failures
1. Stop backend server
2. Try to load a page
3. **VERIFY**: Shows friendly error message
4. **VERIFY**: Doesn't crash

### Test E-3: Validation Errors
1. Try to create user with duplicate email
2. **VERIFY**: Shows validation error
3. Try to create department with empty name
4. **VERIFY**: Shows validation error

---

## BROWSER COMPATIBILITY

### Test B-1: Chrome
- [ ] All features work

### Test B-2: Firefox
- [ ] All features work

### Test B-3: Safari
- [ ] All features work

### Test B-4: Mobile Responsive
- [ ] Layout adapts to mobile
- [ ] Buttons clickable
- [ ] Forms usable

---

## FINAL CHECKLIST

### Core Functionality
- [ ] No 404 errors on any page
- [ ] No 500 errors on any API call
- [ ] No console errors
- [ ] All breadcrumbs work
- [ ] All navigation works

### CRUD Operations
- [ ] Universities: Create, Read, Update, Delete
- [ ] Management Team: Create, Read, Update, Delete ✅ FIXED
- [ ] Colleges: Create, Read, Update, Delete
- [ ] Departments: Create, Read, Update, Delete
- [ ] Academic Staff: Create, Read, Update, Delete
- [ ] Students: Create, Read, Update, Delete
- [ ] Library: Create, Read, Update, Delete
- [ ] Transport: Create, Read, Update, Delete

### Data Integrity
- [ ] University-level isolation works
- [ ] College-level isolation works
- [ ] Stats are accurate
- [ ] Filters work correctly
- [ ] Search works correctly

### UI/UX
- [ ] Loading states show
- [ ] Error messages clear
- [ ] Success messages show
- [ ] Modals work smoothly
- [ ] Forms validate properly

---

## KNOWN ISSUES (Document As Found)

### HIGH Priority
- [ ] List any HIGH priority bugs found during testing

### MEDIUM Priority
- [ ] List any MEDIUM priority bugs found during testing

### LOW Priority
- [ ] List any LOW priority bugs found during testing

---

## TESTING NOTES

### Date: _____________
### Tester: _____________
### Environment: _____________

### Summary:
- Total Tests: ___
- Passed: ___
- Failed: ___
- Blocked: ___

### Critical Findings:
1. 
2. 
3. 

### Recommendations:
1. 
2. 
3. 
