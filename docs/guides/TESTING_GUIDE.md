# 🧪 TESTING GUIDE - What to Test Now

## 🎯 IMMEDIATE TESTING CHECKLIST

### Prerequisites:
```bash
# 1. Start backend server
cd d:\LMS\edu-bit-lms\bitflow-core
php artisan serve

# 2. Start frontend (in new terminal)
cd d:\LMS\edu-bit-lms\bitflow-frontend
pnpm dev
```

---

## 📱 STUDENT PORTAL TESTS

### Test 1: Library Page ✅
**URL:** `http://localhost:3001/library`

**What to Test:**
1. ✅ Page loads without errors
2. ✅ Resources display from API (not hardcoded)
3. ✅ Search box filters resources by title
4. ✅ Bookmark button toggles (changes icon)
5. ✅ Loading state shows spinner
6. ✅ Empty state shows when no resources

**Expected Data:**
- Should see actual library resources from database
- Each resource has: title, type, author, publication date
- Bookmarked resources show filled star icon

---

### Test 2: Documents Page ✅
**URL:** `http://localhost:3001/documents`

**What to Test:**
1. ✅ Folders load from API
2. ✅ Upload button opens modal
3. ✅ File selection works in modal
4. ✅ Storage quota displays correctly
5. ✅ Recent documents list populates
6. ✅ Pending uploads tracking works

**Expected Behavior:**
- Folders show actual document counts
- Upload modal has file picker + folder selector
- Storage shows used/total space
- Recent documents sortable by date

---

### Test 3: Results Page ✅
**URL:** `http://localhost:3001/results`

**What to Test:**
1. ✅ Assessments load from API (status: 'completed')
2. ✅ Statistics cards calculate correctly:
   - Total Assessments count
   - Pass Rate percentage
   - Average Score
3. ✅ Search filters by assessment title
4. ✅ Type filter works (MCQ, SAQ, LAQ, Assignment)
5. ✅ Pass/Fail badges display correctly
6. ✅ View Details button navigates

**Expected Data:**
- Only completed assessments visible
- Pass rate = (passed / total) * 100
- Average score = sum of scores / count
- Badges: Green for Pass, Red for Fail

---

## 👨‍🏫 FACULTY PORTAL TESTS

### Test 4: Dashboard ✅
**URL:** `http://localhost:3000/dashboard`

**What to Test:**
1. ✅ Stats cards show real numbers:
   - Today's Classes (from timetable)
   - Total Students (from timetable)
   - Pending Grades (from assessments)
2. ✅ Upcoming Classes list shows today's schedule
3. ✅ Classes filtered to show only current/future times
4. ✅ Pending Tasks list shows assessments to grade
5. ✅ "Mark Attendance" button navigates to attendance page
6. ✅ Quick action buttons work
7. ✅ Loading state displays correctly

**Click Tests:**
- Click "Mark Attendance" → Should go to `/attendance?block=X`
- Click "Create Assessment" → Should go to `/assessments/create`
- Click "View Schedule" → Should go to `/schedule`
- Click "Analytics" → Should go to `/analytics`

---

### Test 5: Attendance Marking ✅
**URL:** `http://localhost:3000/attendance?block=1&date=2024-10-11`

**What to Test:**
1. ✅ Student list loads from timetable block
2. ✅ Date picker changes date parameter
3. ✅ Subject and section display correctly
4. ✅ Statistics cards calculate:
   - Total Students
   - Present count
   - Absent count
   - Marked/Total ratio
5. ✅ Status buttons toggle per student:
   - Present (green)
   - Absent (red)
   - Late (orange)
   - Excused (blue)
6. ✅ Bulk mark dropdown works
7. ✅ Notes field accepts text
8. ✅ Save button submits attendance
9. ✅ Redirects to dashboard on success

**Validation Tests:**
- Can't save without marking at least 1 student
- Date must be valid
- Block ID must exist

---

### Test 6: Assessments List ✅
**URL:** `http://localhost:3000/assessments`

**What to Test:**
1. ✅ Assessments load from API
2. ✅ Status filter works (Draft, Published, Ongoing, Completed, Archived)
3. ✅ Type filter works (MCQ, SAQ, LAQ, Assignment, Practical)
4. ✅ Subject search filters assessments
5. ✅ Statistics cards show correct counts
6. ✅ DataTable displays all columns:
   - Title, Type, Status, Due Date, Submissions, Marks
7. ✅ Action buttons:
   - View (all statuses)
   - Edit (drafts only)
   - Grade (published/ongoing/completed)
8. ✅ Pagination works (if > 10 assessments)
9. ✅ "Create Assessment" button navigates to creator

**Expected Behavior:**
- Filters update results in real-time
- Clear filters button resets all filters
- Statistics dynamically update with filters

---

### Test 7: Assessment Creator ✅
**URL:** `http://localhost:3000/assessments/create`

**What to Test:**
1. ✅ Basic info form accepts input:
   - Title, Type, Subject, Course, Year
   - Duration, Due Date, Max Marks
   - Description, Instructions
2. ✅ Question builder works:
   - Type selector (MCQ/SAQ/LAQ)
   - Marks input
   - Question text area
   - MCQ: 4 options + correct answer selector
   - Add Question button
3. ✅ Questions list displays added questions
4. ✅ Remove question button works
5. ✅ Total marks calculated correctly
6. ✅ Save as Draft button creates draft assessment
7. ✅ Publish button creates published assessment
8. ✅ Validation prevents empty title or 0 questions
9. ✅ Redirects to assessments list on success

**Test Flow:**
1. Fill title: "Test Assessment"
2. Select type: MCQ
3. Set marks: 100
4. Add 5 questions
5. Save as draft → Check assessments list shows new draft
6. Edit draft → Publish → Check status changes to published

---

### Test 8: Grading Interface ✅
**URL:** `http://localhost:3000/assessments/1/grade` (replace 1 with real assessment ID)

**What to Test:**
1. ✅ Submissions load from API
2. ✅ Statistics cards show:
   - Total Submissions
   - Pending Grading count
   - Graded count
   - Progress percentage
3. ✅ Each submission card displays:
   - Student name + enrollment
   - Status badge (Submitted/Graded)
   - Submission timestamp
   - File attachment link (if present)
   - Student answer
   - Marks input field
   - Feedback textarea
   - Save Grade button
4. ✅ Marks validation (0 to max_marks)
5. ✅ Save Grade button submits grade
6. ✅ Graded submissions disable editing
7. ✅ Grid layout (2 columns)
8. ✅ Export report button works

**Test Flow:**
1. Navigate to grading page
2. Find submission with status "submitted"
3. Enter marks (e.g., 85/100)
4. Add feedback: "Good work!"
5. Click Save Grade
6. Verify status changes to "graded"
7. Verify marks and feedback saved
8. Verify statistics update

---

### Test 9: Students List ✅
**URL:** `http://localhost:3000/students`

**What to Test:**
1. ✅ Students load from timetable blocks
2. ✅ Search box filters by name or enrollment number
3. ✅ DataTable displays columns:
   - Name + Enrollment Number
   - Course, Year, Section
   - Email, Phone
   - View Profile button
4. ✅ Statistics cards:
   - Total Students
   - Filtered Results
   - Unique Courses count
5. ✅ Export list button works
6. ✅ Unique students (no duplicates)

**Test Search:**
- Type "john" → Should filter students with "john" in name
- Type "2021" → Should filter by enrollment number
- Clear search → All students return

---

### Test 10: Schedule View ✅
**URL:** `http://localhost:3000/schedule`

**What to Test:**
1. ✅ Weekly schedule loads from timetable API
2. ✅ Statistics cards show:
   - Classes per Week
   - Teaching Days
   - Unique Subjects count
3. ✅ Day cards display:
   - Day name
   - Number of classes
   - Empty state if no classes
4. ✅ Each class block shows:
   - Subject name
   - Section
   - Time slot (start - end)
   - Room location
   - Student count
   - Type badge (Lecture/Lab/Tutorial/Practical)
5. ✅ Export schedule button works
6. ✅ Responsive layout

**Expected Layout:**
```
Monday (5 classes)
  [Mathematics | Section A | 09:00-10:00 | Room 101 | 45 students | LECTURE]
  [Programming Lab | Section A | 10:30-12:00 | Lab 2 | 45 students | PRACTICAL]
  ...
Tuesday (4 classes)
  ...
```

---

### Test 11: Analytics Dashboard ✅
**URL:** `http://localhost:3000/analytics`

**What to Test:**
1. ✅ Key metrics cards calculate correctly:
   - Total Students (unique from timetable)
   - Weekly Classes (sum of all blocks)
   - Total Assessments (count)
   - Average Submission Rate (%)
2. ✅ Assessment Status breakdown:
   - Draft, Published, Ongoing, Completed, Archived
   - Progress bars show percentage
   - Count displayed
3. ✅ Assessment Types distribution:
   - MCQ, SAQ, LAQ, Assignment, Practical
   - Progress bars show percentage
   - Count displayed
4. ✅ Recent assessments list (top 5)
5. ✅ All calculations dynamic (update with data)

**Calculation Checks:**
- Total Students = unique student IDs from all timetable blocks
- Weekly Classes = total blocks across all days
- Avg Submission Rate = (Σ(submissions/total_students) / completed_assessments_count) * 100
- Status percentage = (status_count / total_assessments) * 100

---

### Test 12: Profile Page ✅
**URL:** `http://localhost:3000/profile`

**What to Test:**
1. ✅ Profile data displays (currently mock data)
2. ✅ Edit button enables edit mode
3. ✅ All fields become editable in edit mode:
   - Contact: Email, Phone, Office Location, Office Hours
   - Academic: Qualification, Specialization, Department, Joining Date, Bio
4. ✅ Save button updates data (TODO: connect to API)
5. ✅ Cancel button reverts changes
6. ✅ Statistics cards display:
   - Total Students Taught
   - Assessments Created
   - Average Rating

**Edit Flow:**
1. Click "Edit Profile"
2. Change email to "newemail@university.edu"
3. Change bio to "Updated bio text"
4. Click "Save Changes"
5. Verify edit mode exits
6. Click "Edit Profile" again
7. Click "Cancel"
8. Verify changes reverted

---

## 🐛 COMMON ISSUES & FIXES

### Issue 1: "Cannot find module" errors
**Cause:** TypeScript module resolution in monorepo  
**Fix:** These are expected in dev environment, won't affect runtime  
**Action:** Ignore these errors for now

### Issue 2: API returns 404
**Cause:** Backend not running or wrong base URL  
**Fix:**
```bash
# Check backend is running
cd bitflow-core
php artisan serve

# Verify API_BASE_URL in .env.local
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### Issue 3: No data displays
**Cause:** Database not seeded  
**Fix:**
```bash
cd bitflow-core
php artisan migrate:fresh --seed
```

### Issue 4: Authentication required
**Cause:** Not logged in  
**Fix:** 
1. Navigate to `/login`
2. Use test credentials (check seeders)
3. Or use Sanctum auth flow

### Issue 5: Attendance page shows "No block selected"
**Cause:** Missing `block` query parameter  
**Fix:** Navigate from dashboard "Mark Attendance" button, or manually add `?block=1`

---

## ✅ SUCCESS CRITERIA

### Student Portal:
- ✅ All 3 pages load without console errors
- ✅ Data comes from API, not hardcoded
- ✅ Search and filters work
- ✅ Actions (bookmark, upload) functional

### Faculty Portal:
- ✅ All 9 pages load without console errors
- ✅ Dashboard shows real-time data
- ✅ Attendance submission works
- ✅ Assessment creation flow complete
- ✅ Grading interface saves grades
- ✅ All navigation links work
- ✅ Statistics calculate correctly

---

## 📝 TESTING REPORT TEMPLATE

```
# Testing Report - [Date]

## Student Portal
- [ ] Library page: ✅ / ❌ (Notes: ___)
- [ ] Documents page: ✅ / ❌ (Notes: ___)
- [ ] Results page: ✅ / ❌ (Notes: ___)

## Faculty Portal
- [ ] Dashboard: ✅ / ❌ (Notes: ___)
- [ ] Attendance: ✅ / ❌ (Notes: ___)
- [ ] Assessments List: ✅ / ❌ (Notes: ___)
- [ ] Assessment Creator: ✅ / ❌ (Notes: ___)
- [ ] Grading Interface: ✅ / ❌ (Notes: ___)
- [ ] Students List: ✅ / ❌ (Notes: ___)
- [ ] Schedule: ✅ / ❌ (Notes: ___)
- [ ] Analytics: ✅ / ❌ (Notes: ___)
- [ ] Profile: ✅ / ❌ (Notes: ___)

## Critical Bugs Found:
1. [Description]
2. [Description]

## Minor Issues:
1. [Description]
2. [Description]

## Overall Assessment:
- Production Ready: YES / NO
- Blocking Issues: [Count]
- Recommended Actions: [List]
```

---

## 🚀 NEXT STEPS AFTER TESTING

### If All Tests Pass:
1. ✅ Commit all changes to Git
2. ✅ Deploy to staging environment
3. ✅ Run smoke tests in staging
4. ✅ Get stakeholder approval
5. ✅ Deploy to production

### If Issues Found:
1. Document bugs in GitHub Issues
2. Prioritize: Critical → High → Medium → Low
3. Fix critical bugs immediately
4. Retest after fixes
5. Repeat until all tests pass

---

**🎯 Goal: Get 100% pass rate on all 12 tests before deployment!**
