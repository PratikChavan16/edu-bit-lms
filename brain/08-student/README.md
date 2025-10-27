# Student Portal - Complete Specification

**Portal Name**: Student Portal  
**Route**: `/student/*`  
**Port**: `3008`  
**Primary Role**: `student`  
**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Executive Summary

The Student Portal is the primary interface for enrolled students to access their academic information, track progress, submit assignments, view grades, check attendance, manage fee payments, and communicate with faculty and administration.

### Target Users
- **Primary**: Students (undergraduate, postgraduate, diploma)
- **Secondary**: None (students only access their own data)

### Key Performance Indicators (KPIs)
- Average session duration: 15-20 minutes
- Daily active users: 60-70% of enrolled students
- Assignment submission rate: 95%+
- Average page load time: < 2 seconds
- Mobile usage: 65%+ of sessions

---

## Portal Overview

### Purpose
Provide students with self-service access to:
- Academic information (courses, grades, attendance)
- Assignment submission and tracking
- Fee payment status and invoices
- Timetable and class schedules
- Notifications and announcements
- Profile management

### Scope
- **Included**: View own academic data, submit assignments, check fees, receive notifications
- **Excluded**: Administrative functions, modifying grades/attendance, accessing other students' data

### Business Value
- **Transparency**: Students have 24/7 access to their academic records
- **Efficiency**: Reduces administrative burden (fee inquiries, grade requests)
- **Engagement**: Keeps students informed and connected to institution
- **Accountability**: Clear visibility of deadlines and requirements

---

## Core Features (Summary)

1. **Dashboard** - Overview of courses, upcoming deadlines, recent grades
2. **My Courses** - List of enrolled courses with details
3. **Attendance** - View attendance records by course
4. **Grades & Results** - View grades, exam results, CGPA
5. **Assignments** - View assignments, submit work, check feedback
6. **Timetable** - Weekly class schedule
7. **Fee Management** - View fee structure, payment history, pending dues
8. **Profile** - Update personal information, change password
9. **Notifications** - Real-time alerts and announcements
10. **Support** - Contact faculty, raise complaints

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16.0.0-canary.6 (App Router)
- **UI Library**: React 19
- **Language**: TypeScript 5.6 (strict mode)
- **State Management**: Zustand 5.0
- **Styling**: TailwindCSS 4
- **Forms**: React Hook Form + Zod validation
- **HTTP Client**: Axios with interceptors
- **Icons**: Lucide React
- **Charts**: Recharts (for GPA trends)
- **Calendar**: React Big Calendar (for timetable)

### Backend APIs Consumed
- `/api/students/*` - Student profile and enrollment data
- `/api/courses/*` - Course information
- `/api/attendance/*` - Attendance records
- `/api/grades/*` - Grades and results
- `/api/assignments/*` - Assignments and submissions
- `/api/fees/*` - Fee structure and payments
- `/api/notifications/*` - Real-time notifications

---

## User Roles & Permissions

### Student Role
- **Scope**: Individual student (own data only)
- **Permissions**:
  - `students.view_own` - View own student profile
  - `courses.read` - View enrolled courses
  - `attendance.view_own` - View own attendance records
  - `grades.view_own` - View own grades and results
  - `assignments.read` - View assignments for enrolled courses
  - `assignments.submit` - Submit assignment solutions
  - `fees.view_own` - View own fee records
  - `notifications.read_own` - View own notifications
  - `profile.update_own` - Update own profile information

### Data Access Rules
- Students can ONLY access their own data
- Multi-tenancy enforced: `university_id` in JWT token
- Row-level security: `student_id = auth()->id()`
- Cannot view other students' data even in same college

---

## Navigation Structure

```
Student Portal
├── Dashboard (/)
├── My Courses (/courses)
│   ├── Course Details (/courses/[id])
│   └── Course Materials (/courses/[id]/materials)
├── Attendance (/attendance)
│   └── Course Attendance (/attendance/[courseId])
├── Grades (/grades)
│   ├── Semester Grades (/grades/semester/[sem])
│   └── Exam Results (/grades/exam/[examId])
├── Assignments (/assignments)
│   ├── Assignment Details (/assignments/[id])
│   └── Submit Assignment (/assignments/[id]/submit)
├── Timetable (/timetable)
├── Fees (/fees)
│   ├── Payment History (/fees/history)
│   └── Pay Now (/fees/pay)
├── Profile (/profile)
│   ├── Edit Profile (/profile/edit)
│   └── Change Password (/profile/change-password)
├── Notifications (/notifications)
└── Support (/support)
    ├── Contact Faculty (/support/contact)
    └── Raise Complaint (/support/complaint)
```

---

## Security & Compliance

### Authentication
- JWT token (RS256) with 15-minute expiry
- Refresh token (7 days) in HttpOnly cookie
- Automatic token refresh via axios interceptor
- MFA optional (can be enabled by university)

### Authorization
- Role verification: `role === 'student'`
- University isolation: `university_id` in token claims
- Student-specific checks: `student_id` matches authenticated user

### Data Protection
- All API calls over HTTPS (TLS 1.3)
- Sensitive data (DOB, blood group) displayed with masked option
- File uploads scanned for viruses
- File size limits: 10MB per assignment submission
- Allowed file types: PDF, DOCX, XLSX, JPG, PNG, ZIP

### Privacy
- Students cannot see other students' data
- Personal information (phone, address) not shared publicly
- Email notifications use BCC for group announcements
- FERPA compliant: Academic records protected

---

## Performance Requirements

### Response Time
- Page load: < 2 seconds (initial)
- API calls: < 500ms (median)
- Assignment submission: < 5 seconds (including upload)

### Scalability
- Support 10,000+ concurrent students
- Handle exam result day traffic spikes (10x normal)
- Assignment submission during deadline rush (500+ submissions/minute)

### Offline Support
- View cached grades and attendance when offline
- Queue assignment submissions for retry when connection restored
- Progressive Web App (PWA) capabilities

---

## Monitoring & Analytics

### Metrics to Track
- Page views by feature (dashboard, grades, assignments)
- Assignment submission patterns (deadline proximity)
- Average time to complete assignment submission
- Fee payment completion rate
- Search queries (help students find features)
- Error rates by API endpoint
- Mobile vs desktop usage

### Alerts
- High error rate on assignment submission (> 5%)
- API latency exceeding 1 second
- Failed payment transactions
- Unusually high 404 errors (broken links)

---

## Integration Points

### Upstream Dependencies
- **Authentication Service**: `/api/auth/*`
- **Student API**: `/api/students/*`
- **Academic API**: `/api/courses/*`, `/api/attendance/*`, `/api/grades/*`
- **Assignment API**: `/api/assignments/*`
- **Financial API**: `/api/fees/*`, `/api/invoices/*`
- **Notification Service**: `/api/notifications/*`
- **File Storage**: AWS S3 for assignment uploads

### Events Published
- `assignment.submitted` - When student submits assignment
- `profile.updated` - When student updates profile
- `fee.payment.initiated` - When payment process starts
- `support.ticket.created` - When student raises complaint

### Webhooks Consumed
- `grade.posted` - Trigger notification to student
- `assignment.graded` - Trigger notification with feedback
- `fee.due.reminder` - Send payment reminder notification
- `announcement.published` - Display new announcement

---

## Deployment

### Environment Variables
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_PORTAL_NAME=Student Portal
NEXT_PUBLIC_FILE_UPLOAD_MAX_SIZE=10485760
NEXT_PUBLIC_ALLOWED_FILE_TYPES=.pdf,.docx,.xlsx,.jpg,.png,.zip
```

### Build & Run
```bash
# Development
cd bitflow-frontend/apps/student
pnpm dev  # Runs on port 3008

# Production
pnpm build
pnpm start
```

### Docker
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 3008
CMD ["pnpm", "start"]
```

---

## Future Enhancements

1. **AI-Powered Study Assistant**: Chatbot for common queries
2. **Peer Study Groups**: Create/join study groups for courses
3. **Career Services**: Job postings, internships, career guidance
4. **Library Integration**: Book reservations, digital resources
5. **Transport & Hostel**: Bus tracking, hostel room bookings
6. **Alumni Network**: Connect with alumni for mentorship
7. **Gamification**: Badges for milestones (perfect attendance, early submissions)

---

**📚 The Student Portal is the heart of the student experience - it must be intuitive, fast, and reliable.**
