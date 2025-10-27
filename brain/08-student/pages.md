# Student Portal - Page Specifications

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Page-by-Page Specification

Each page specification includes:
- URL route
- Wireframe description
- Components used
- Data requirements
- User interactions
- Validation rules
- Error states
- Loading states

---

## 1. Dashboard (`/`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Header: Student Portal | [Notifications 🔔3] | [Profile ▼] │
├─────────────────────────────────────────────────────────────┤
│ Welcome back, John Doe! 👋                                   │
├──────────────┬──────────────┬──────────────┬───────────────┤
│ Current Sem  │ CGPA         │ Attendance   │ Pending Tasks │
│ Semester 5   │ 8.5 / 10     │ 88%          │ 3 Assignments │
│              │ ⭐⭐⭐⭐     │ ✅ Safe      │ 1 Fee Payment │
└──────────────┴──────────────┴──────────────┴───────────────┘
├─────────────────────────┬───────────────────────────────────┤
│ 📚 Upcoming Deadlines   │ 📊 Recent Grades                  │
├─────────────────────────┼───────────────────────────────────┤
│ • ML Assignment 3       │ • Data Mining Mid-Term: A (85%)   │
│   Due: Oct 28 (3 days)  │ • Web Dev Assignment 2: A+ (95%)  │
│ • DBMS Project          │ • Algorithms Quiz 5: B+ (78%)     │
│   Due: Oct 30 (5 days)  │ • Compiler Design Lab: A (90%)    │
│ • Fee Payment Sem 5     │ • OS Assignment 4: A (88%)        │
│   Due: Nov 1 (7 days)   │                                   │
└─────────────────────────┴───────────────────────────────────┘
├───────────────────────────────────────────────────────────── │
│ 🕐 Today's Classes                                           │
├───────────────────────────────────────────────────────────── │
│ 9:00 AM - 10:00 AM    CS501 Machine Learning    Room 301    │
│ 10:00 AM - 11:00 AM   CS502 Data Mining         Room 302    │
│ 2:00 PM - 5:00 PM     CS503 ML Lab              Lab 5       │
└─────────────────────────────────────────────────────────────┘
├───────────────────────────────────────────────────────────── │
│ 📢 Announcements                                             │
├───────────────────────────────────────────────────────────── │
│ • Mid-term exams scheduled for Nov 10-15                    │
│ • Holiday on Oct 28 (Diwali)                                │
│ • Library timing extended till 10 PM during exams           │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `DashboardHeader` - Welcome message and quick stats
- `StatCard` - Reusable stat display component
- `DeadlinesList` - Upcoming deadlines with countdown
- `GradesList` - Recent grades
- `ClassSchedule` - Today's classes
- `AnnouncementsFeed` - Latest announcements

### Data Requirements
```typescript
interface DashboardData {
  student: Student;
  stats: {
    currentSemester: number;
    cgpa: number;
    attendancePercentage: number;
    pendingAssignments: number;
    outstandingFees: number;
  };
  upcomingDeadlines: Deadline[];
  recentGrades: Grade[];
  todayClasses: ClassSchedule[];
  announcements: Announcement[];
}
```

### API Calls
- `GET /api/students/me` - Student info
- `GET /api/students/{id}/dashboard` - All dashboard data (aggregated)

### Loading State
- Skeleton loaders for each section
- Progressive loading: Show stats first, then deadlines, then classes

### Error State
- If dashboard API fails, show cached data with warning banner
- "Unable to load latest data. Showing cached information."
- Retry button

---

## 2. My Courses (`/courses`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ My Courses - Semester 5                    [Semester ▼] [⚙️]│
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ │ CS501        │  │ CS502        │  │ CS503        │      │
│ │ Machine      │  │ Data Mining  │  │ ML Lab       │      │
│ │ Learning     │  │              │  │              │      │
│ ├──────────────┤  ├──────────────┤  ├──────────────┤      │
│ │ Prof. Smith  │  │ Prof. Johnson│  │ Prof. Smith  │      │
│ │ 📊 Grade: A  │  │ 📊 Grade: A+ │  │ 📊 Grade: A  │      │
│ │ 📅 88% Att.  │  │ 📅 92% Att.  │  │ 📅 85% Att.  │      │
│ │ [View] [Mat.]│  │ [View] [Mat.]│  │ [View] [Mat.]│      │
│ └──────────────┘  └──────────────┘  └──────────────┘      │
│                                                             │
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ │ CS504        │  │ CS505        │  │ HS501        │      │
│ │ Web Dev      │  │ Algorithms   │  │ Ethics       │      │
│ └──────────────┘  └──────────────┘  └──────────────┘      │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `CourseCard` - Individual course display
- `CourseGrid` - Responsive grid layout
- `SemesterSelector` - Dropdown to switch semesters
- `CourseFilters` - Filter by department, status

### Data Requirements
```typescript
interface CourseListData {
  courses: Array<{
    id: string;
    code: string;
    name: string;
    credits: number;
    facultyName: string;
    facultyAvatar: string;
    currentGrade: string | null;
    attendancePercentage: number;
    nextClassTime: string | null;
    semester: number;
  }>;
}
```

### Interactions
- Click "View" → Navigate to `/courses/[id]`
- Click "Materials" → Navigate to `/courses/[id]/materials`
- Change semester → Reload courses for selected semester

---

## 3. Course Details (`/courses/[id]`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Courses                                           │
├─────────────────────────────────────────────────────────────┤
│ CS501 - Machine Learning                        Credits: 4  │
│ Department of Computer Science | Semester 5                 │
├─────────────────────────────────────────────────────────────┤
│ 👨‍🏫 Faculty: Prof. John Smith                               │
│ 📧 Email: john.smith@university.edu                         │
│ 🕐 Office Hours: Mon-Fri 2-4 PM | Room: Faculty Block 302  │
├─────────────────────────────────────────────────────────────┤
│ [Syllabus PDF] [Course Materials]                           │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [Overview] [Attendance] [Grades] [Assignments]       │
├─────────────────────────────────────────────────────────────┤
│ Overview Tab:                                               │
│ Description: Introduction to machine learning algorithms... │
│                                                             │
│ Class Schedule:                                             │
│ • Monday    9:00 AM - 10:00 AM    Room 301                 │
│ • Wednesday 9:00 AM - 10:00 AM    Room 301                 │
│ • Friday    2:00 PM - 5:00 PM     Lab 5 (Practical)        │
└─────────────────────────────────────────────────────────────┘
```

### Tabs Content

**Attendance Tab**:
```
Total Classes: 45  |  Present: 40  |  Absent: 5  |  Percentage: 88.9%

Calendar View:
Oct 2025:  S  M  T  W  T  F  S
           -  ✅ -  ✅ -  ✅ -
           -  ❌ -  ✅ -  ✅ -
           -  ✅ -  ✅ -  ✅ -
```

**Grades Tab**:
```
Component Breakdown:
┌──────────────────┬──────────┬────────┬──────────┬────────┐
│ Component        │ Weightage│ Marks  │ Max      │ %      │
├──────────────────┼──────────┼────────┼──────────┼────────┤
│ Assignments (5)  │ 20%      │ 18     │ 20       │ 90%    │
│ Mid-Term Exam    │ 30%      │ 25     │ 30       │ 83.3%  │
│ End-Term Exam    │ 40%      │ TBD    │ 40       │ -      │
│ Attendance       │ 10%      │ 9      │ 10       │ 90%    │
├──────────────────┼──────────┼────────┼──────────┼────────┤
│ Total (so far)   │ 60%      │ 52     │ 60       │ 86.7%  │
└──────────────────┴──────────┴────────┴──────────┴────────┘

Current Grade: A (Projected)
```

**Assignments Tab**:
```
┌────────┬─────────────────────┬──────────┬─────────┬────────┐
│ #      │ Title               │ Due Date │ Status  │ Grade  │
├────────┼─────────────────────┼──────────┼─────────┼────────┤
│ 1      │ Linear Regression   │ Sep 15   │ Graded  │ 9/10   │
│ 2      │ Decision Trees      │ Oct 1    │ Graded  │ 8/10   │
│ 3      │ Neural Networks     │ Oct 28   │ Pending │ -      │
│ 4      │ SVM Implementation  │ Nov 15   │ Not Yet │ -      │
└────────┴─────────────────────┴──────────┴─────────┴────────┘
```

### Components
- `CourseHeader` - Course title and metadata
- `FacultyCard` - Faculty information
- `TabNavigation` - Switch between views
- `AttendanceCalendar` - Visual attendance representation
- `GradesBreakdown` - Component breakdown table
- `AssignmentsTable` - List of assignments

---

## 4. Attendance (`/attendance`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ My Attendance                                               │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Overall Attendance: 88.5%                    ✅ Safe    │ │
│ │ ████████████████████████░░░░░░░░ (75% minimum required)│ │
│ │ Total Classes: 250 | Present: 221 | Absent: 29         │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ By Course:                                                  │
├────────┬────────┬────────┬────────┬───────────┬───────────┤
│ Course │ Total  │ Present│ Absent │ Percentage│ Status    │
├────────┼────────┼────────┼────────┼───────────┼───────────┤
│ CS501  │ 45     │ 40     │ 5      │ 88.9%     │ ✅ Safe   │
│ CS502  │ 42     │ 39     │ 3      │ 92.9%     │ ✅ Safe   │
│ CS503  │ 38     │ 32     │ 6      │ 84.2%     │ ✅ Safe   │
│ CS504  │ 40     │ 28     │ 12     │ 70.0%     │ ⚠️ Warning│
│ CS505  │ 45     │ 43     │ 2      │ 95.6%     │ ✅ Safe   │
│ HS501  │ 40     │ 39     │ 1      │ 97.5%     │ ✅ Safe   │
└────────┴────────┴────────┴────────┴───────────┴───────────┘
[View Details] buttons for each course
```

### Components
- `AttendanceSummary` - Overall stats with progress bar
- `CourseAttendanceTable` - Tabular view by course
- `AttendanceStatus` - Color-coded status indicator
- `AttendanceAlert` - Warning banner if below threshold

### Validation
- Highlight courses with attendance < 75% in red
- Show warning: "Your attendance in CS504 is below 75%. You may not be eligible for exams."

---

## 5. Course Attendance Detail (`/attendance/[courseId]`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Attendance                                        │
├─────────────────────────────────────────────────────────────┤
│ CS501 - Machine Learning | Attendance: 88.9%                │
├─────────────────────────────────────────────────────────────┤
│ Stats: Total: 45 | Present: 40 | Absent: 5                  │
│ Longest Streak: 12 classes | Most Absent Day: Friday        │
├─────────────────────────────────────────────────────────────┤
│ View: [Calendar] [List]                      [Download PDF] │
├─────────────────────────────────────────────────────────────┤
│ October 2025                                                │
│   Sun  Mon  Tue  Wed  Thu  Fri  Sat                        │
│    -   ✅   -   ✅   -   ✅   -                            │
│    -   ✅   -   ✅   -   ❌   -                            │
│    -   ✅   -   ✅   -   ✅   -                            │
│    -   ❌   -   ✅   -   ✅   -                            │
│                                                             │
│ List View:                                                  │
│ Oct 28, 2025 - Present ✅ (Marked by: Prof. Smith)          │
│ Oct 25, 2025 - Present ✅ (Marked by: Prof. Smith)          │
│ Oct 23, 2025 - Absent  ❌ (Marked by: Prof. Smith)          │
│ Oct 21, 2025 - Present ✅ (Marked by: Prof. Smith)          │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `AttendanceCalendar` - Month view with color coding
- `AttendanceList` - Chronological list
- `AttendanceStats` - Statistics cards
- `DownloadButton` - Export as PDF

---

## 6. Grades (`/grades`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ My Grades & Results                                         │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│ │ Current CGPA │  │ Semester GPA │  │ Total Credits│      │
│ │     8.5      │  │     8.7      │  │     120      │      │
│ │   / 10.0     │  │  (Semester 5)│  │  (Completed) │      │
│ └──────────────┘  └──────────────┘  └──────────────┘      │
├─────────────────────────────────────────────────────────────┤
│ GPA Trend:                                                  │
│  10 ┤                                                       │
│   9 ┤     ●─────●─────●─────●─────●                        │
│   8 ┤   ●                                                   │
│   7 ┤                                                       │
│     └─────┬─────┬─────┬─────┬─────┬──                      │
│          Sem1  Sem2  Sem3  Sem4  Sem5                      │
├─────────────────────────────────────────────────────────────┤
│ Semester: [5 ▼]                        [Download Transcript]│
├────────┬─────────────────┬────────┬───────┬───────────────┤
│ Code   │ Course Name     │ Credits│ Grade │ Grade Points  │
├────────┼─────────────────┼────────┼───────┼───────────────┤
│ CS501  │ Machine Learning│ 4      │ A     │ 9.0           │
│ CS502  │ Data Mining     │ 3      │ A+    │ 10.0          │
│ CS503  │ ML Lab          │ 2      │ A     │ 9.0           │
│ CS504  │ Web Development │ 3      │ A     │ 9.0           │
│ CS505  │ Algorithms      │ 4      │ B+    │ 8.0           │
│ HS501  │ Ethics          │ 2      │ A+    │ 10.0          │
├────────┴─────────────────┴────────┴───────┴───────────────┤
│ Semester GPA: 8.7 | Total Credits: 18                      │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `CGPACard` - Display CGPA
- `GPATrendChart` - Line chart (using Recharts)
- `GradesTable` - Semester-wise grades
- `SemesterSelector` - Filter by semester

---

## 7. Assignments (`/assignments`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ My Assignments                                              │
├─────────────────────────────────────────────────────────────┤
│ Tabs: [All] [Pending (3)] [Submitted] [Graded]             │
│ Filters: Course [All ▼] | Sort: Due Date [▼]              │
├─────────────────────────────────────────────────────────────┤
│ ┌───────────────────────────────────────────────────────┐   │
│ │ CS501 - Machine Learning                              │   │
│ │ Assignment 3: Neural Networks Implementation          │   │
│ │ Posted: Oct 20, 2025 | Due: Oct 28, 2025 (3 days)    │   │
│ │ Max Marks: 10 | Status: ⏳ Pending                    │   │
│ │ [View Details] [Submit Assignment]                    │   │
│ └───────────────────────────────────────────────────────┘   │
│                                                             │
│ ┌───────────────────────────────────────────────────────┐   │
│ │ CS504 - Web Development                               │   │
│ │ Assignment 4: REST API with Express.js                │   │
│ │ Posted: Oct 18, 2025 | Due: Oct 30, 2025 (5 days)    │   │
│ │ Max Marks: 15 | Status: ⏳ Pending                    │   │
│ │ [View Details] [Submit Assignment]                    │   │
│ └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `AssignmentCard` - Individual assignment preview
- `AssignmentTabs` - Filter by status
- `AssignmentFilters` - Course and sort filters
- `CountdownTimer` - Due date countdown

---

## 8. Assignment Detail & Submit (`/assignments/[id]`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Assignments                                       │
├─────────────────────────────────────────────────────────────┤
│ CS501 - Machine Learning                                    │
│ Assignment 3: Neural Networks Implementation                │
├─────────────────────────────────────────────────────────────┤
│ Posted by: Prof. John Smith         Posted: Oct 20, 2025   │
│ Due Date: Oct 28, 2025 23:59       ⏱️ Due in 3 days 5 hours│
│ Max Marks: 10                                               │
├─────────────────────────────────────────────────────────────┤
│ Description:                                                │
│ Implement a simple feedforward neural network from scratch  │
│ in Python. Your implementation should include...            │
│                                                             │
│ Requirements:                                               │
│ • Implement forward propagation                             │
│ • Implement backpropagation                                 │
│ • Test on MNIST dataset                                     │
│                                                             │
│ 📎 Question Paper: [assignment_3.pdf] (Download)           │
├─────────────────────────────────────────────────────────────┤
│ Your Submission:                                            │
│ Status: Not Submitted                                       │
│                                                             │
│ Upload File: [Drag & drop or click to browse]              │
│ Allowed: PDF, DOCX, ZIP | Max size: 10MB                   │
│                                                             │
│ Comments (optional):                                        │
│ ┌─────────────────────────────────────────────────────┐     │
│ │ Add any comments or notes for your instructor...    │     │
│ └─────────────────────────────────────────────────────┘     │
│                                                             │
│ [ Cancel ]                          [Submit Assignment]     │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `AssignmentHeader` - Title and metadata
- `AssignmentDescription` - Full description
- `FileUpload` - Drag-drop file upload
- `SubmissionForm` - Form with validation

### Validation Rules
```typescript
const schema = z.object({
  file: z
    .instanceof(File)
    .refine((f) => f.size <= 10 * 1024 * 1024, 'Max 10MB')
    .refine(
      (f) => ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/zip'].includes(f.type),
      'Only PDF, DOCX, ZIP allowed'
    ),
  comments: z.string().max(500).optional(),
});
```

### Loading State
- Show spinner on submit button
- Disable form during upload
- Progress bar for file upload

### Success State
```
✅ Assignment submitted successfully!
Submission ID: SUB123456
Submitted at: Oct 25, 2025 14:30 PM
Your submission has been recorded and the instructor will be notified.
[View My Submissions] [Back to Assignments]
```

### Error State
```
❌ Submission failed
Error: File size exceeds 10MB limit. Please compress your file and try again.
[Try Again]
```

---

## 9. Timetable (`/timetable`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ My Timetable - Week of Oct 23-28, 2025      [◀ This Week ▶]│
│ View: [Calendar] [List]                 [Export to Calendar]│
├─────────────────────────────────────────────────────────────┤
│      Mon      Tue      Wed      Thu      Fri      Sat       │
├──────────────────────────────────────────────────────────────┤
│ 9-10 CS501     -      CS501     -      CS501     -         │
│      Room 301         Room 301         Room 301            │
│      Prof. Smith      Prof. Smith     Prof. Smith          │
├──────────────────────────────────────────────────────────────┤
│ 10-11 CS502   CS503   CS502   CS503     -      CS503       │
│      R 302    R 201   R 302   R 201           Lab 5        │
├──────────────────────────────────────────────────────────────┤
│ 11-12  -     CS504     -      CS504   CS504   CS503        │
│              R 202            R 202   R 202   Lab 5        │
├──────────────────────────────────────────────────────────────┤
│ 12-1  LUNCH   LUNCH   LUNCH   LUNCH   LUNCH   LUNCH        │
├──────────────────────────────────────────────────────────────┤
│ 2-3   CS505     -     CS505     -      -       -           │
│      R 101            R 101                                │
├──────────────────────────────────────────────────────────────┤
│ 3-4   CS505     -     HS501     -      -       -           │
│      R 101            R 105                                │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `TimetableGrid` - Weekly calendar view
- `ClassCell` - Individual class information
- `WeekNavigation` - Navigate between weeks
- `ExportButton` - Export to iCal

### Interactions
- Click on class → Show class details modal
- Hover on class → Tooltip with faculty, room
- Current class highlighted in color
- Next class has pulsing border

---

## 10. Fees (`/fees`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ Fee Management                                              │
├─────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ Total Fee: ₹1,00,000                                    │ │
│ │ ███████████████████░░░░░░░░░                            │ │
│ │ Paid: ₹60,000 (60%) | Pending: ₹40,000 (Due: Dec 31)   │ │
│ │                                                         │ │
│ │ ⚠️ Payment overdue by 5 days          [Pay Now]        │ │
│ └─────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────┤
│ Fee Breakdown:                                              │
├──────────────┬─────────┬──────────┬────────────┬──────────┤
│ Fee Type     │ Semester│ Amount   │ Due Date   │ Status   │
├──────────────┼─────────┼──────────┼────────────┼──────────┤
│ Tuition Fee  │ 5       │ ₹50,000  │ Aug 15,2025│✅ Paid   │
│ Lab Fee      │ 5       │ ₹5,000   │ Aug 15,2025│✅ Paid   │
│ Library Fee  │ 5       │ ₹2,000   │ Aug 15,2025│✅ Paid   │
│ Exam Fee     │ 5       │ ₹3,000   │ Dec 31,2025│⏳ Pending│
│              │         │          │            │ [Pay]    │
└──────────────┴─────────┴──────────┴────────────┴──────────┘
│ [Payment History] [Download All Receipts]                  │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `FeeSummary` - Overall fee status
- `FeeBreakdownTable` - Detailed fee list
- `PaymentButton` - Initiate payment
- `OverdueAlert` - Warning banner for overdue fees

---

## 11. Payment Page (`/fees/pay`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ ← Back to Fees                                              │
├─────────────────────────────────────────────────────────────┤
│ Make Payment                                                │
├─────────────────────────────────────────────────────────────┤
│ Select Fee Components:                                      │
│ ☑️ Exam Fee - Semester 5          ₹3,000                   │
│ ☐ Sports Fee - Annual             ₹1,000                   │
│                                                             │
│ Total Amount: ₹3,000                                        │
├─────────────────────────────────────────────────────────────┤
│ Payment Method:                                             │
│ ( ) UPI                                                     │
│ ( ) Debit/Credit Card                                       │
│ (●) Net Banking                                             │
│ ( ) Wallet (Paytm, PhonePe)                                │
├─────────────────────────────────────────────────────────────┤
│ Student Information:                                        │
│ Name: John Doe                                              │
│ Roll Number: 2021CS001                                      │
│ Email: john.doe@student.university.edu                      │
├─────────────────────────────────────────────────────────────┤
│ [ Cancel ]                              [Proceed to Pay →] │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `FeeSelector` - Checkboxes for fee components
- `PaymentMethodSelector` - Radio buttons for payment methods
- `PaymentSummary` - Review total amount
- `PaymentButton` - Redirect to gateway

### Payment Flow
1. Student selects fees to pay
2. Reviews total amount
3. Clicks "Proceed to Pay"
4. Redirected to Razorpay payment gateway
5. Completes payment
6. Redirected back to success page
7. Receipt generated and emailed

---

## 12. Profile (`/profile`)

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│ My Profile                                    [Edit Profile]│
├─────────────────────────────────────────────────────────────┤
│ ┌────────┐  John Doe                                        │
│ │ Photo  │  Roll Number: 2021CS001                          │
│ │ [Edit] │  Email: john.doe@student.university.edu          │
│ └────────┘  Phone: +91 9876543210                           │
├─────────────────────────────────────────────────────────────┤
│ Personal Information:                                       │
│ Date of Birth: Jan 15, 2003                                 │
│ Gender: Male                                                │
│ Blood Group: O+                                             │
│ Address: 123 Main Street, City, State - 123456             │
├─────────────────────────────────────────────────────────────┤
│ Academic Information:                                       │
│ College: ABC Engineering College                            │
│ Department: Computer Science                                │
│ Program: B.Tech in Computer Science                         │
│ Current Semester: 5                                         │
│ Enrollment Year: 2021                                       │
│ Expected Graduation: 2025                                   │
│ Status: Active                                              │
├─────────────────────────────────────────────────────────────┤
│ Emergency Contact:                                          │
│ Guardian Name: Richard Doe                                  │
│ Guardian Phone: +91 9876543211                              │
│ Relationship: Father                                        │
├─────────────────────────────────────────────────────────────┤
│ [Change Password]                                           │
└─────────────────────────────────────────────────────────────┘
```

### Components
- `ProfileHeader` - Photo and basic info
- `ProfileSection` - Reusable section component
- `EditButton` - Navigate to edit mode

---

**📄 These page specifications provide complete UI/UX guidance for implementing the Student Portal.**
