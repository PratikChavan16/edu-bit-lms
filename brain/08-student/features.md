# Student Portal - Detailed Features

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Feature Catalog

### 1. Dashboard (Home Page)

**Route**: `/`

**Purpose**: Provide at-a-glance overview of student's academic status

**Components**:
- **Welcome Banner**: "Welcome back, [Student Name]!"
- **Quick Stats Cards**:
  - Current Semester
  - CGPA / Percentage
  - Attendance Percentage (average across all courses)
  - Pending Assignments count
  - Outstanding Fees amount
- **Upcoming Deadlines**: Next 5 assignment due dates
- **Recent Grades**: Last 5 posted grades
- **Today's Classes**: Class schedule for current day
- **Announcements**: Latest 3 announcements (college/university-wide)
- **Recent Notifications**: Last 5 notifications

**Interactions**:
- Click stat cards to navigate to detailed view
- Click assignment deadline to open assignment page
- Click grade to view full grade report
- Mark notification as read
- Dismiss announcement

**Data Sources**:
- `GET /api/students/me` - Student profile with stats
- `GET /api/students/{id}/courses?semester=current` - Current courses
- `GET /api/students/{id}/assignments?status=pending&limit=5` - Pending assignments
- `GET /api/students/{id}/grades?limit=5` - Recent grades
- `GET /api/announcements?target=student&limit=3` - Latest announcements
- `GET /api/notifications?unread=true&limit=5` - Recent notifications

---

### 2. My Courses

**Route**: `/courses`

**Purpose**: View all enrolled courses for current semester

**Layout**: Grid of course cards (3 columns on desktop, 1 on mobile)

**Course Card Contents**:
- Course code and name
- Faculty name with avatar
- Semester and credits
- Current grade (if available)
- Attendance percentage for this course
- Next class timing
- Action buttons: "View Details", "Materials"

**Filters**:
- Semester dropdown (current, previous semesters)
- Department filter (if student has courses across departments)
- Status filter (ongoing, completed)

**Course Details Page** (`/courses/[id]`):
- **Course Information**: Full description, credits, syllabus PDF link
- **Faculty Details**: Name, email, office hours, cabin number
- **Class Schedule**: Days, timings, room numbers
- **Attendance Summary**: Present/Absent/Total classes, percentage, graphical representation
- **Grades Breakdown**: Assignment grades, mid-term, end-term, total
- **Assignments**: List of all assignments (pending, submitted, graded)
- **Materials**: Lecture notes, slides, reference materials (downloadable)
- **Announcements**: Course-specific announcements from faculty

**Data Sources**:
- `GET /api/students/{id}/courses` - All enrolled courses
- `GET /api/courses/{courseId}` - Course details
- `GET /api/students/{studentId}/enrollments/{courseId}` - Enrollment details
- `GET /api/courses/{courseId}/materials` - Course materials
- `GET /api/courses/{courseId}/announcements` - Course announcements

---

### 3. Attendance

**Route**: `/attendance`

**Purpose**: Track attendance across all courses

**Overall Attendance View**:
- **Summary Card**: Overall attendance percentage with color coding (green ≥75%, yellow 65-74%, red <65%)
- **Attendance Goal**: Progress bar showing 75% requirement for exam eligibility
- **By Course Table**:
  | Course | Total Classes | Present | Absent | Percentage | Status |
  |--------|---------------|---------|--------|------------|--------|
  | CS101  | 45            | 40      | 5      | 88.9%      | ✅ Safe |
  | CS102  | 42            | 30      | 12     | 71.4%      | ⚠️ Warning |

**Course-Specific Attendance** (`/attendance/[courseId]`):
- **Calendar View**: Month calendar with color-coded days (green = present, red = absent, gray = no class)
- **List View**: Chronological list of all classes with date, status, marked by (faculty name)
- **Statistics**: 
  - Longest streak of consecutive attendance
  - Most common day absent (Monday, Friday, etc.)
  - Projected attendance by semester end (if current trend continues)
- **Download**: Export attendance as PDF report

**Alerts**:
- Warning if attendance drops below 75% (affects exam eligibility)
- Notification when attendance is marked by faculty

**Data Sources**:
- `GET /api/students/{studentId}/attendance` - All attendance records
- `GET /api/students/{studentId}/attendance?course_id={courseId}` - Course-specific
- `GET /api/students/{studentId}/attendance/summary` - Attendance statistics

---

### 4. Grades & Results

**Route**: `/grades`

**Purpose**: View academic performance (assignments, exams, CGPA)

**Overall Performance**:
- **CGPA Card**: Current CGPA (4.0 scale) or percentage
- **Semester-wise GPA**: Line chart showing GPA trend across semesters
- **Grade Distribution**: Pie chart (A+, A, B+, B, C, etc.)
- **Class Rank**: Current rank in class (if enabled by university)

**Semester Grades Table**:
| Semester | Course Code | Course Name | Credits | Grade | Grade Points |
|----------|-------------|-------------|---------|-------|--------------|
| Sem 5    | CS501       | Machine Learning | 4    | A     | 9.0          |
| Sem 5    | CS502       | Data Mining      | 3    | A+    | 10.0         |

**Grade Details** (`/grades/course/[courseId]`):
- **Components Breakdown**:
  | Component      | Weightage | Marks Obtained | Max Marks | Percentage |
  |----------------|-----------|----------------|-----------|------------|
  | Assignment 1   | 5%        | 8              | 10        | 80%        |
  | Assignment 2   | 5%        | 9              | 10        | 90%        |
  | Mid-Term Exam  | 30%       | 25             | 30        | 83.3%      |
  | End-Term Exam  | 50%       | 42             | 50        | 84%        |
  | Attendance     | 10%       | 10             | 10        | 100%       |
  | **Total**      | **100%**  | **94**         | **110**   | **85.5%**  |

- **Final Grade**: A (85.5%)
- **Faculty Feedback**: Text feedback from instructor (if provided)

**Exam Results** (`/grades/exam/[examId]`):
- Detailed scorecard for mid-term or end-term exams
- Subject-wise marks
- Total marks and percentage
- Grade and result status (Pass/Fail)
- Comparison with class average (if enabled)

**Download Options**:
- Download grade sheet as PDF
- Download full academic transcript
- Download semester-wise marksheet

**Data Sources**:
- `GET /api/students/{studentId}/grades` - All grades
- `GET /api/students/{studentId}/grades?semester={sem}` - Semester grades
- `GET /api/students/{studentId}/grades/cgpa` - CGPA calculation
- `GET /api/students/{studentId}/grades/transcript` - Full transcript

---

### 5. Assignments

**Route**: `/assignments`

**Purpose**: Manage assignments (view, submit, track feedback)

**Assignment List**:
- **Tabs**: All | Pending | Submitted | Graded
- **Filters**: Course, Due date range
- **Sort**: Due date (ascending/descending), Posted date

**Assignment Card**:
- Course name and code
- Assignment title
- Description (truncated, click to expand)
- Max marks
- Due date with countdown timer (if pending)
- Status badge: "Pending", "Submitted", "Graded", "Overdue"
- Action button: "Submit" / "View Submission" / "View Feedback"

**Assignment Details Page** (`/assignments/[id]`):
- **Assignment Information**:
  - Title and full description
  - Posted by: Faculty name
  - Posted on: Date and time
  - Due date: Date, time, and countdown
  - Max marks
  - Attachment: Question paper or instructions (downloadable)
- **Submission Section** (if not yet submitted):
  - File upload (drag-drop or browse)
  - Allowed formats: PDF, DOCX, XLSX, ZIP
  - Max size: 10MB
  - Comments/Notes (optional text field)
  - Submit button
- **Submission Status** (if already submitted):
  - Submitted on: Date and time
  - Submitted file: Downloadable link
  - Status: "Under Review" / "Graded"
  - Marks obtained (if graded)
  - Faculty feedback (if graded)
  - Grade: A, B+, etc.
  - Option to resubmit (if allowed by faculty and before deadline)

**Submission Workflow**:
1. Click "Submit Assignment"
2. Upload file (validation for type and size)
3. Preview uploaded file
4. Add optional comments
5. Click "Confirm Submission"
6. Confirmation modal with submission details
7. Success message with submission timestamp
8. Email notification sent to student

**Notifications**:
- Assignment posted: Immediate notification
- Assignment due reminder: 24 hours before due date
- Assignment graded: When faculty posts grade and feedback

**Data Sources**:
- `GET /api/students/{studentId}/assignments` - All assignments
- `GET /api/assignments/{assignmentId}` - Assignment details
- `GET /api/students/{studentId}/submissions?assignment_id={assignmentId}` - Student's submission
- `POST /api/assignments/{assignmentId}/submit` - Submit assignment
- `POST /api/file-uploads` - Upload file to storage

---

### 6. Timetable

**Route**: `/timetable`

**Purpose**: View weekly class schedule

**Layout Options**:
- **Calendar View**: Weekly grid (Monday-Saturday)
- **List View**: Chronological list of all classes

**Calendar View**:
```
         Monday    Tuesday   Wednesday  Thursday   Friday    Saturday
9-10 AM  CS501     -         CS502      -          CS501     -
         Room 301            Room 302              Room 301

10-11    CS503     CS504     CS503      CS504      -         Lab
         Room 201  Room 202  Room 201   Room 202              Lab 5

11-12    -         CS502     -          CS501      CS504     Lab
                   Room 302             Room 301   Room 202  Lab 5
```

**Class Card** (click on any class):
- Course code and name
- Faculty name
- Room number
- Building/Floor (if multi-building campus)
- Start and end time
- Class type: Lecture, Tutorial, Lab
- Optional: Map link to classroom location

**Features**:
- **Current class highlighting**: Current ongoing class highlighted in color
- **Next class indicator**: Next class shown prominently
- **Filters**: 
  - Current week / Next week / Custom date range
  - Show only labs / Show only lectures
- **Export**: Download timetable as PDF or iCal (import to Google Calendar)
- **Reminders**: Enable notifications 10 minutes before class

**Data Sources**:
- `GET /api/students/{studentId}/timetable` - Weekly schedule
- `GET /api/students/{studentId}/timetable?week={date}` - Specific week
- `GET /api/students/{studentId}/classes/next` - Next upcoming class

---

### 7. Fee Management

**Route**: `/fees`

**Purpose**: Track fee structure, payments, pending dues

**Fee Dashboard**:
- **Summary Cards**:
  - Total Fee: ₹1,00,000
  - Paid: ₹60,000 (60%)
  - Pending: ₹40,000 (Due: Dec 31, 2025)
- **Payment Progress Bar**: Visual representation of paid vs pending
- **Alert**: "Payment overdue" if past due date (red banner)

**Fee Structure** (Semester-wise breakdown):
| Fee Type          | Semester | Amount   | Due Date    | Status     |
|-------------------|----------|----------|-------------|------------|
| Tuition Fee       | 5        | ₹50,000  | Aug 15, 2025| ✅ Paid    |
| Lab Fee           | 5        | ₹5,000   | Aug 15, 2025| ✅ Paid    |
| Library Fee       | 5        | ₹2,000   | Aug 15, 2025| ✅ Paid    |
| Exam Fee          | 5        | ₹3,000   | Dec 31, 2025| ⏳ Pending |

**Payment History** (`/fees/history`):
| Date           | Receipt No | Amount   | Mode        | Transaction ID |
|----------------|------------|----------|-------------|----------------|
| Aug 10, 2025   | RCP/2025/001 | ₹60,000 | Online      | TXN123456789   |
| Feb 5, 2025    | RCP/2025/002 | ₹60,000 | Cheque      | CHQ987654      |

**Actions**:
- **Pay Now** button (for pending fees)
- **Download Invoice** (for each fee structure)
- **Download Receipt** (for each payment)
- **Payment History PDF** (all payments in one document)

**Online Payment Flow** (`/fees/pay`):
1. Select fee components to pay (checkboxes)
2. Review total amount
3. Choose payment method: UPI, Debit/Credit Card, Net Banking
4. Redirect to payment gateway (Razorpay/Stripe)
5. Complete payment
6. Redirect back with transaction status
7. Display success message with receipt number
8. Email receipt to student
9. Update payment status in database

**Payment Methods**:
- Razorpay integration (UPI, Cards, Net Banking, Wallets)
- Offline: Bank transfer, Cheque, DD (requires manual verification by accounts office)

**Receipts**:
- Auto-generated PDF receipt with:
  - University logo and name
  - Student details (name, roll number, course)
  - Receipt number and date
  - Fee components paid
  - Amount (in words and figures)
  - Payment mode and transaction ID
  - Authorized signatory (digital signature)

**Data Sources**:
- `GET /api/students/{studentId}/fees` - Fee structure
- `GET /api/students/{studentId}/fees/summary` - Fee summary
- `GET /api/students/{studentId}/invoices` - Invoices
- `GET /api/students/{studentId}/payments` - Payment history
- `POST /api/payments/initiate` - Initiate payment
- `GET /api/invoices/{invoiceId}/download` - Download invoice PDF
- `GET /api/payments/{paymentId}/receipt` - Download receipt PDF

---

### 8. Profile Management

**Route**: `/profile`

**Purpose**: View and update personal information

**Profile View**:
- **Personal Information**:
  - Profile photo
  - Full name
  - Roll number (read-only)
  - Email (read-only)
  - Phone number (editable)
  - Date of birth (read-only)
  - Gender (read-only)
  - Blood group (editable)
  - Address (editable)
- **Academic Information**:
  - College name
  - Department
  - Course/Program
  - Current semester (read-only)
  - Enrollment year (read-only)
  - Expected graduation year
  - Current status: Active, On Leave, Graduated, etc.
- **Emergency Contact**:
  - Guardian name (editable)
  - Guardian phone (editable)
  - Relationship (editable)
- **Account Settings**:
  - Email notification preferences
  - SMS notification preferences
  - Language preference

**Edit Profile** (`/profile/edit`):
- Form with editable fields
- Client-side validation (Zod schema)
- Server-side validation
- Success/Error messages
- Audit log entry created on update

**Change Password** (`/profile/change-password`):
- Current password (required)
- New password (min 8 chars, complexity rules)
- Confirm new password (must match)
- Validation:
  - Current password correct
  - New password meets policy
  - New password different from current
- Success: Log out user, require re-login with new password
- Email notification: "Your password was changed"

**Profile Photo Upload**:
- Click on photo to upload new image
- Allowed formats: JPG, PNG
- Max size: 2MB
- Crop tool to adjust (square aspect ratio)
- Preview before saving
- Stored in S3 bucket

**Data Sources**:
- `GET /api/students/me` - Student profile
- `PUT /api/students/{studentId}` - Update profile
- `POST /api/students/{studentId}/photo` - Upload photo
- `POST /api/auth/change-password` - Change password

---

### 9. Notifications

**Route**: `/notifications`

**Purpose**: View all notifications and announcements

**Notification Types**:
1. **Academic**: Grade posted, assignment graded, attendance marked
2. **Financial**: Fee due reminder, payment successful
3. **Administrative**: Exam schedule announced, holiday notification
4. **System**: Password changed, profile updated

**Notification List**:
- Unread notifications at top (bold, colored background)
- Read notifications below (grayed out)
- Grouped by date: Today, Yesterday, Last 7 days, Older
- Each notification shows:
  - Icon (based on type)
  - Title
  - Message (truncated)
  - Timestamp (relative: "5 minutes ago")
  - Link (if applicable): "View Grade", "Pay Now", etc.
  - Mark as read/unread button

**Notification Detail Modal** (click on notification):
- Full notification content
- Timestamp
- Related action button
- Mark as read/delete button

**Actions**:
- **Mark all as read**: Clear all unread notifications
- **Filter**: By type (academic, financial, system)
- **Delete**: Remove notification (soft delete)

**Real-time Updates**:
- WebSocket connection for instant notifications
- Browser notification permission request on first visit
- Desktop notifications when new notification arrives (if enabled)
- Badge count on notification icon in header

**Data Sources**:
- `GET /api/notifications?user_id={userId}` - All notifications
- `GET /api/notifications?user_id={userId}&unread=true` - Unread count
- `PUT /api/notifications/{notificationId}/read` - Mark as read
- `DELETE /api/notifications/{notificationId}` - Delete notification
- WebSocket: `ws://api.bitflow.edu/notifications` - Real-time updates

---

### 10. Support & Helpdesk

**Route**: `/support`

**Purpose**: Get help, contact faculty, raise complaints

**Support Options**:

**1. Contact Faculty** (`/support/contact`):
- Select course
- Select faculty (automatically filtered by course)
- Subject line
- Message body
- Attachment (optional)
- Send button
- Faculty receives email notification
- Student gets acknowledgment email

**2. Raise Complaint/Ticket** (`/support/complaint`):
- Category dropdown: Academic, Financial, Technical, Infrastructure, Harassment, Other
- Priority: Low, Medium, High, Urgent
- Subject
- Detailed description
- Attachments (screenshots, documents)
- Submit button
- Ticket created with unique ticket number
- Email confirmation sent
- Track ticket status: Open → In Progress → Resolved → Closed

**3. FAQ Section**:
- Searchable knowledge base
- Categories: Admission, Exams, Fees, Technical, General
- Common questions:
  - "How do I submit an assignment?"
  - "What if I missed the payment deadline?"
  - "How is CGPA calculated?"
  - "How do I download my transcript?"

**4. My Tickets** (`/support/my-tickets`):
| Ticket No | Category  | Subject             | Priority | Status      | Created    |
|-----------|-----------|---------------------|----------|-------------|------------|
| #1001     | Technical | Cannot submit assignment | High  | In Progress | Oct 20, 2025 |
| #1002     | Academic  | Grade discrepancy   | Medium   | Resolved    | Oct 18, 2025 |

**Ticket Detail** (`/support/tickets/[id]`):
- Ticket information
- Status timeline (Open → Assigned → In Progress → Resolved)
- Comments/Updates from support team
- Add reply/comment
- Attach additional files
- Close ticket (if issue resolved)

**Data Sources**:
- `GET /api/faculty?course_id={courseId}` - Faculty list
- `POST /api/messages` - Send message to faculty
- `POST /api/tickets` - Create support ticket
- `GET /api/tickets?created_by={userId}` - Student's tickets
- `GET /api/tickets/{ticketId}` - Ticket details
- `POST /api/tickets/{ticketId}/comments` - Add comment

---

**🎓 These features collectively provide a comprehensive student experience, covering all academic, financial, and support needs.**
