# Faculty/Teacher Portal (Portal 07)

**Version**: 2.0  
**Role**: Faculty/Teacher  
**Port**: 3007  
**Last Updated**: October 25, 2025

---

## Table of Contents

1. [Overview](#overview)
2. [Purpose and Goals](#purpose-and-goals)
3. [Scope and Boundaries](#scope-and-boundaries)
4. [Key Performance Indicators (KPIs)](#key-performance-indicators-kpis)
5. [Core Workflows](#core-workflows)
6. [User Personas](#user-personas)
7. [Security and Compliance](#security-and-compliance)
8. [Performance Requirements](#performance-requirements)
9. [Success Criteria](#success-criteria)
10. [Technical Stack](#technical-stack)
11. [Navigation Structure](#navigation-structure)
12. [Integration Points](#integration-points)
13. [Related Documentation](#related-documentation)
14. [Quick Start Guide](#quick-start-guide)

---

## Overview

The Faculty/Teacher Portal is the primary workspace for educators to manage their daily teaching responsibilities, including attendance tracking, assessment creation and grading, course materials distribution, student communication, and administrative tasks. This portal emphasizes efficiency, offline-first capabilities, and a streamlined user experience designed to minimize administrative burden on faculty.

**Key Highlights**:
- 📱 **Offline-First Attendance**: Mark attendance without internet connectivity, sync automatically when online
- ⚡ **Quick Actions Dashboard**: Complete daily tasks in under 5 minutes
- 📊 **Smart Gradebook**: Automated calculations with rubric-based grading
- 🔔 **Real-Time Notifications**: Immediate alerts for student submissions and urgent messages
- 📚 **Materials Management**: Organize and distribute course resources with version control
- 🔒 **Privacy-Focused**: Student data protection with granular access controls

---

## Purpose and Goals

### Primary Purpose
Enable faculty members to efficiently manage all teaching-related activities within a single, intuitive platform that respects their time and enhances their ability to engage with students effectively.

### Strategic Goals
1. **Reduce Administrative Overhead**: Minimize time spent on attendance, grading, and reporting tasks by 40%
2. **Enhance Teaching Quality**: Provide tools and analytics to identify at-risk students and improve learning outcomes
3. **Improve Communication**: Streamline faculty-student and faculty-administration communication channels
4. **Support Flexibility**: Enable offline work and flexible workflows that adapt to diverse teaching styles
5. **Ensure Accountability**: Maintain comprehensive audit trails for all academic actions
6. **Promote Data-Driven Decisions**: Offer actionable insights through course and student analytics

### User Benefits
- **For Faculty**: Simplified daily routines, mobile-friendly interface, minimal clicks for common tasks
- **For Students**: Timely feedback, accessible materials, transparent grading, responsive communication
- **For Administration**: Real-time compliance monitoring, automated reporting, reduced errors
- **For Institution**: Improved retention through early intervention, data-backed quality assurance

---

## Scope and Boundaries

### In Scope

#### Teaching Activities
- **Course Management**: View and manage assigned courses across multiple semesters
- **Attendance Tracking**: Mark, edit (within window), and report attendance with offline support
- **Assessment Creation**: Design quizzes, assignments, exams with rubrics and automated grading
- **Grading Workflow**: Enter grades, apply curves, publish results, handle regrade requests
- **Materials Distribution**: Upload lecture notes, videos, links; organize by topics with versioning

#### Student Engagement
- **Messaging**: Send class announcements, 1:1 student communication with context awareness
- **Office Hours**: Schedule and manage virtual/physical office hours with booking system
- **Student Analytics**: View individual and class-level performance, attendance, and engagement metrics
- **Intervention Tools**: Flag at-risk students, send early alerts, document interactions

#### Administrative Functions
- **Timetable Management**: View schedule, request substitutions, manage teaching swaps
- **Leave Requests**: Apply for leave, assign substitute teachers, track approval status
- **Exam Duties**: View invigilation assignments, record incidents, submit duty reports
- **Professional Development**: Track completed trainings, certifications, and workshops

#### Reporting and Analytics
- **Course Analytics**: Attendance trends, grade distributions, completion rates
- **Personal Dashboard**: Teaching load, pending tasks, performance metrics
- **Export Capabilities**: Generate CSV/PDF reports for attendance, grades, and student rosters

### Out of Scope

❌ **Financial Operations**: Salary management, reimbursements, budget approvals (handled by Finance Portal)  
❌ **Recruitment**: Hiring processes, interviews, onboarding (handled by HR Portal)  
❌ **Cross-College Configuration**: Multi-institution settings, global policies (handled by Super Admin)  
❌ **Infrastructure Management**: Server setup, database administration (handled by IT Portal)  
❌ **Curriculum Design**: Program-level curriculum changes (handled by Principal/Academic Admin)  
❌ **Student Admissions**: Application review, enrollment processing (handled by Admission Portal)

### Boundary Clarifications

| Function | Faculty Portal | Other Portal |
|----------|---------------|--------------|
| Course creation | ❌ View only | ✅ Principal/Academic Office |
| Student enrollment | ❌ View only | ✅ Registrar/Academic Office |
| Grade moderation | ✅ Request | ✅ HOD/Principal approval |
| Fee waivers | ❌ Recommend only | ✅ Finance/Principal |
| Disciplinary actions | ❌ Report only | ✅ Principal/Dean |
| Classroom booking | ✅ Request | ✅ Admin/Timetable Office |

---

## Key Performance Indicators (KPIs)

### Operational KPIs

#### Attendance Compliance
- **Target**: ≥ 95% of attendance marked within 30 minutes of class end
- **Measurement**: Timestamp delta between class end and attendance submission
- **Reporting**: Daily dashboard, weekly email summary
- **Escalation**: Automated reminder at +20 minutes, HOD notification at +2 hours

#### Grading Turnaround
- **Target**: ≤ 5 working days from assessment deadline to grade publication
- **Measurement**: Time between submission close and grade publish event
- **Reporting**: Real-time gradebook indicator, monthly HOD report
- **Escalation**: Yellow flag at +3 days, red flag at +7 days

#### Material Upload Timeliness
- **Target**: ≥ 90% of materials posted before class start
- **Measurement**: Upload timestamp vs. scheduled class time
- **Reporting**: Calendar view with indicators, term-end summary
- **Escalation**: Reminder 24h before class, student visibility toggle

#### Student Communication Responsiveness
- **Target**: ≤ 24 hours response time to student messages
- **Measurement**: Time between message receipt and faculty reply
- **Reporting**: Message inbox stats, monthly communication report
- **Escalation**: Highlight at +18 hours, HOD notification at +48 hours

### Quality KPIs

#### Grade Distribution Health
- **Target**: Avoid extreme distributions (e.g., <5% failures, <10% A grades unless justified)
- **Measurement**: Statistical analysis of grade curves per course
- **Reporting**: Term-end academic review
- **Action**: Flagged for HOD review if outside institutional norms

#### Student Satisfaction
- **Target**: ≥ 4.0/5.0 average rating in end-of-term feedback
- **Measurement**: Anonymous student surveys on teaching effectiveness
- **Reporting**: Post-term faculty report, department comparison
- **Action**: <3.5 triggers mandatory faculty development plan

#### Content Engagement
- **Target**: ≥ 70% of students access uploaded materials within 48 hours
- **Measurement**: View/download analytics per material
- **Reporting**: Materials dashboard with engagement heatmap
- **Action**: Low engagement triggers material quality review

### Technical KPIs

#### System Uptime
- **Target**: 99.5% uptime during academic hours (8 AM - 10 PM)
- **Measurement**: Automated health checks, error rate monitoring
- **Reporting**: Real-time status page, monthly SLA report
- **Action**: Incident response within 15 minutes

#### Offline Sync Success Rate
- **Target**: ≥ 99% of offline records sync without conflicts
- **Measurement**: Conflict resolution logs, sync success vs. failure
- **Reporting**: Weekly sync health report
- **Action**: Investigate patterns if conflict rate >1%

#### Performance Benchmarks
- **Target**: Attendance page TTI < 1.5s, Gradebook compute < 5s
- **Measurement**: Real User Monitoring (RUM), synthetic tests
- **Reporting**: Performance dashboard, monthly trend analysis
- **Action**: Optimization sprint if targets missed 3 consecutive weeks

---

## Core Workflows

### 1. Daily Teaching Routine

**Typical Day Flow**:
```
08:00 AM → Login → Dashboard shows today's schedule
08:15 AM → Click "Mark Attendance" quick action (pre-filled with current class)
08:45 AM → Mark attendance offline (no network in classroom)
09:00 AM → Attendance auto-syncs when returning to staffroom WiFi
09:30 AM → Post lecture slides to Materials section
10:00 AM → Check gradebook for pending assignments (15 submissions)
12:00 PM → Grade 5 assignments during lunch break
02:00 PM → Send class announcement about upcoming quiz
04:00 PM → Review analytics for at-risk students, send intervention messages
05:00 PM → Logout
```

**Time Estimate**: ~20 minutes of administrative work per day (excluding grading)

### 2. Attendance Marking Workflow

**Scenario**: Faculty teaching 60-student class

**Online Flow**:
1. Navigate to Attendance → Select Course → Select Date (auto-filled)
2. View student roster with photos and IDs
3. Use bulk actions: "Mark All Present" → Manually mark 3 absences
4. Add remarks for absent students (sick, excused, etc.)
5. Submit → Instant save + notification to absent students
6. **Time**: ~2 minutes

**Offline Flow**:
1. Open Attendance page (loads cached roster)
2. Mark attendance normally (saved to IndexedDB)
3. See "Offline Mode" indicator
4. When network returns, click "Sync Now" or wait for auto-sync
5. Conflict resolution (if another faculty marked same student): Choose correct record
6. **Time**: ~2 minutes + 5 seconds sync

**Conflict Resolution**:
- System auto-resolves if marks match
- If different, show side-by-side comparison with timestamps
- Faculty chooses correct record or escalates to HOD
- All actions logged in audit trail

### 3. Assessment and Grading Workflow

**Creation Phase**:
1. Navigate to Assessments → "Create New"
2. Select type: Quiz/Assignment/Exam/Project
3. Configure:
   - Title, description, due date
   - Total marks, passing threshold
   - Rubric (if applicable): criteria + weightage
   - Submission type: Online/Offline/Both
   - Late submission penalty policy
4. Attach resources (question paper, dataset, etc.)
5. Publish → Students receive notification
6. **Time**: ~10 minutes for typical assignment

**Grading Phase**:
1. Navigate to Assessment → View Submissions (sorted by submission time)
2. Click student submission → Opens grading interface
3. View submission (document viewer/code viewer/text)
4. Enter marks:
   - Manual: Enter total score with comments
   - Rubric-based: Score each criterion, auto-computes total
   - MCQ: Auto-graded, review flagged answers
5. Save Draft or Publish Grade → Student receives notification if published
6. Repeat for all submissions
7. **Time**: ~3-5 minutes per submission (varies by type)

**Bulk Actions**:
- Download all submissions as ZIP
- Export grades to CSV
- Bulk comment insertion
- Curve adjustment (add X% to all, cap at maximum)

**Regrade Requests**:
1. Student submits regrade request with justification
2. Faculty receives notification
3. Review original submission + request
4. Accept (update grade) or Reject (with explanation)
5. Decision logged and communicated to student

### 4. Materials Management Workflow

**Upload Flow**:
1. Navigate to Materials → Select Course → Select Topic/Module
2. Click "Upload Material"
3. Configure:
   - Title and description
   - File upload (PDF, PPT, video, etc.) or URL
   - Visibility: Immediate, Scheduled, Hidden
   - Tags for searchability
   - Prerequisites (if any)
4. Click "Publish" → Students receive notification
5. **Time**: ~2 minutes per material

**Organization**:
- Drag-and-drop reordering within topics
- Create folders for modular organization
- Version control: Upload new version, students see "Updated" badge
- Archive old materials (hidden from students, retained for compliance)

**Student Interaction Tracking**:
- View/download counts per material
- Time-on-page analytics for embedded content
- Export engagement report

### 5. Student Communication Workflow

**Class Announcement**:
1. Navigate to Messaging → "New Announcement"
2. Select recipients: Entire class, Specific section, Custom group
3. Compose message (rich text editor, attach files)
4. Set priority: Normal/Urgent
5. Schedule: Send now or schedule for later
6. Send → Delivered via in-app notification + email
7. **Time**: ~1-2 minutes

**1:1 Student Message**:
1. Navigate to Student → Select student profile
2. Click "Send Message"
3. Context aware: Shows student's recent activity, grades, attendance
4. Compose message with suggested templates (feedback, concern, encouragement)
5. Set follow-up reminder (if needed)
6. Send → Student receives notification
7. **Time**: ~3-5 minutes

**Guardrails**:
- All messages logged for compliance
- Inappropriate content flagged (keyword detection)
- Option to CC HOD for sensitive conversations
- Students cannot delete messages (audit requirement)

### 6. Leave and Substitution Workflow

**Faculty Applying for Leave**:
1. Navigate to Leaves → "Request Leave"
2. Enter: Start date, end date, reason, supporting documents
3. Suggest substitute faculty (system recommends based on availability)
4. Affected classes auto-populated
5. Submit request → Sent to HOD for approval
6. Receive notification on approval/rejection
7. If approved, substitute faculty notified
8. **Time**: ~5 minutes

**Acting as Substitute**:
1. Receive substitution request notification
2. Review: Dates, courses, materials, teaching plan
3. Accept/Decline with reason
4. If accepted: Temporary access granted to course materials, attendance, etc.
5. Mark attendance as "Substitute: [Your Name]" (tracked separately)
6. Access revoked automatically after substitution period
7. **Time**: ~2 minutes review + teaching time

### 7. Exam Duty Workflow

**Invigilation Assignment**:
1. Receive exam duty notification (email + in-app)
2. Navigate to Exam Duties → View assignment details
3. Details: Date, time, venue, exam type, number of students
4. Acknowledge duty → Confirm availability
5. If conflict, request reassignment with justification
6. **Time**: ~1 minute

**During Invigilation**:
1. Open duty details on mobile device
2. Mark attendance (scan QR codes or manual entry)
3. Record incidents: Late arrivals, malpractice, medical emergencies
4. Attach evidence (photos, videos)
5. Submit incident report immediately
6. **Time**: Real-time during exam

**Post-Exam**:
1. Submit final duty report: Attendance, incidents, observations
2. Confirm all answer scripts collected and sealed
3. Sign-off → Duty marked complete
4. **Time**: ~5 minutes

### 8. Analytics and Reporting Workflow

**Course Performance Review**:
1. Navigate to Analytics → Select Course
2. View dashboards:
   - Attendance trends (line chart, weekly averages)
   - Grade distribution (histogram, percentiles)
   - Assessment performance (bar chart per assessment)
   - At-risk student list (automatic flagging based on criteria)
3. Apply filters: Date range, section, student groups
4. Export reports as PDF/CSV
5. **Time**: ~5-10 minutes exploration

**Student Intervention**:
1. Identify at-risk student (auto-flagged or manual selection)
2. View detailed profile:
   - Attendance history (color-coded calendar)
   - Grade trend (line graph across assessments)
   - Submission timeliness (on-time vs. late)
   - Engagement metrics (material access, message response)
3. Send intervention message (template-based)
4. Schedule follow-up meeting
5. Document interaction in notes
6. **Time**: ~10 minutes per student

---

## User Personas

### Persona 1: Prof. Rajesh Kumar (Experienced Full-Time Faculty)

**Demographics**:
- Age: 45
- Department: Computer Science
- Teaching Experience: 20 years
- Tech Savviness: Moderate

**Teaching Load**:
- 4 courses (3 undergrad, 1 postgrad)
- Total students: 240
- Classes per week: 18 hours

**Goals**:
- Minimize time on administrative tasks
- Provide timely feedback to students
- Identify struggling students early
- Maintain high teaching quality ratings

**Pain Points**:
- Finds current systems slow and buggy
- Loses connectivity in basement classrooms
- Frustrated by manual grade calculations
- Overwhelmed by email volume from students

**Portal Usage Patterns**:
- Logs in 2-3 times daily (morning, afternoon, evening)
- Primarily uses: Attendance, Gradebook, Analytics
- Prefers desktop for grading, mobile for attendance
- Values efficiency over advanced features

### Persona 2: Dr. Priya Sharma (Young Assistant Professor)

**Demographics**:
- Age: 30
- Department: Data Science
- Teaching Experience: 3 years
- Tech Savviness: High

**Teaching Load**:
- 2 courses (1 lecture, 1 lab)
- Total students: 90
- Classes per week: 12 hours
- Research commitments: 20 hours/week

**Goals**:
- Balance teaching and research
- Use technology to enhance learning
- Build strong rapport with students
- Experiment with innovative assessment methods

**Pain Points**:
- Needs mobile-first solutions (always on the go)
- Wants integration with external tools (GitHub, Jupyter)
- Frustrated by rigid grading rubrics
- Needs better analytics to measure effectiveness

**Portal Usage Patterns**:
- Logs in 4-5 times daily (often via mobile)
- Uses all features actively
- Appreciates automation and smart suggestions
- Provides detailed feedback to improve system

### Persona 3: Prof. Ahmed Ali (Visiting/Part-Time Faculty)

**Demographics**:
- Age: 52
- Industry Experience: 25 years
- Teaching Experience: 5 years (part-time)
- Tech Savviness: Low

**Teaching Load**:
- 1 course (weekend MBA program)
- Total students: 45
- Classes per week: 4 hours

**Goals**:
- Deliver practical industry knowledge
- Complete administrative tasks quickly
- Avoid technical complications
- Maintain professional relationship with institution

**Pain Points**:
- Limited time on campus (only weekends)
- Unfamiliar with academic systems
- Needs extensive onboarding
- Prefers simple, guided workflows

**Portal Usage Patterns**:
- Logs in once per week (Saturday morning)
- Batches all tasks (attendance, grading, messages)
- Requires clear instructions and tooltips
- Relies on help desk support frequently

---

## Security and Compliance

### Authentication and Authorization

**JWT Token Structure**:
```json
{
  "sub": "faculty_uuid",
  "role": "faculty",
  "faculty_id": "FAC001",
  "college_id": "CLG123",
  "department_id": "CSE",
  "permissions": [
    "attendance:mark",
    "attendance:edit",
    "grade:update",
    "grade:publish",
    "materials:manage",
    "message:send"
  ],
  "substitute_for": null,
  "substitute_until": null,
  "device_id": "device_fingerprint_hash",
  "2fa_verified": true,
  "iat": 1729852800,
  "exp": 1729939200
}
```

**Access Control**:
- **College-Scoped**: Faculty can only access data from their assigned college
- **Course-Scoped**: Faculty can only manage courses they are assigned to
- **Time-Scoped**: Certain actions (e.g., attendance editing) restricted by time windows
- **Row-Level Security (RLS)**: PostgreSQL policies enforce data isolation at database level

**2FA Requirements**:
- Mandatory for grade publishing
- Required for first login from new device
- Step-up authentication for sensitive actions (bulk grade changes, student data export)
- TOTP (Google Authenticator) or SMS-based

### Data Protection

**Personal Identifiable Information (PII)**:
- Student names, IDs, contact details encrypted at rest
- Masked in logs and error messages
- Access logged with justification
- Retention policy: Purged 2 years after student graduation

**Academic Records**:
- Grades immutable after term-end finalization
- All changes require approval and justification
- Tamper-evident audit logs (blockchain-backed checksums)
- Compliance with FERPA (if applicable) and local regulations

**Communication Privacy**:
- Messages encrypted in transit (TLS 1.3)
- Stored encrypted at rest
- Cannot be deleted by students (audit requirement)
- Exported only for legal/compliance purposes

### Audit and Logging

**Critical Events Logged**:
- Attendance marking and editing (with before/after values)
- Grade entry, update, and publication
- Assessment creation and modification
- Material uploads and deletions
- Student communications
- Leave requests and substitutions
- Exam duty acknowledgments and incident reports

**Log Contents**:
- **Who**: Faculty ID, name, IP address, device fingerprint
- **What**: Action type, entity ID, before/after values
- **When**: Timestamp (ISO 8601 with timezone)
- **Why**: Reason/justification (if required)
- **How**: API endpoint, request ID, user agent

**Retention and Access**:
- Audit logs retained for 7 years
- Immutable storage (write-once, read-many)
- Accessible to faculty (own actions), HOD (department), Principal (college), Auditors (full)

### Compliance Requirements

**Data Residency**:
- All data stored within institutional/national boundaries
- No third-party analytics that export PII
- Cloud services must comply with local data protection laws

**Right to Access**:
- Students can request their data (attendance, grades, communications)
- Faculty can download their own teaching records
- Response within 30 days

**Right to Rectification**:
- Students can dispute attendance/grade errors
- Faculty reviews and approves/rejects corrections
- Changes logged with justification

**Security Standards**:
- OWASP Top 10 mitigation (see security_checklist.md)
- Regular penetration testing (quarterly)
- Dependency vulnerability scanning (automated)
- Security training for all users (annual)

---

## Performance Requirements

### Response Time Targets

| Action | Target | Acceptable | Critical Threshold |
|--------|--------|------------|-------------------|
| Dashboard Load | < 1.0s | < 2.0s | 3.0s |
| Attendance Page TTI | < 1.5s | < 3.0s | 5.0s |
| Mark Attendance (online) | < 0.5s | < 1.0s | 2.0s |
| Gradebook Load (100 students) | < 2.0s | < 4.0s | 6.0s |
| Grade Update | < 0.3s | < 0.8s | 1.5s |
| Materials Upload (10MB) | < 5.0s | < 10.0s | 15.0s |
| Analytics Dashboard Load | < 3.0s | < 6.0s | 10.0s |
| Search (Student/Course) | < 0.5s | < 1.0s | 2.0s |

### Scalability Targets

**Concurrent Users**:
- Support 500 faculty active concurrently (peak: exam grading period)
- Graceful degradation under 150% load
- Load balancing across multiple app servers

**Data Volume**:
- Attendance records: 10M+ per semester
- Grade entries: 2M+ per semester
- Materials storage: 500GB per semester
- Messages: 1M+ per semester

**Offline Sync**:
- Batch size: 1,000 records per sync
- Sync time: < 10 seconds for typical batch
- Conflict rate: < 1%
- Queue depth: Max 5,000 pending operations

### Resource Optimization

**Frontend**:
- Bundle size: < 500KB initial load (gzipped)
- Lazy loading for non-critical routes
- Image optimization: WebP with fallback, lazy loading
- Cache strategy: Stale-while-revalidate for static assets

**Backend**:
- API response size: < 100KB per request (paginated)
- Database query time: < 100ms for 95th percentile
- Redis cache hit rate: > 80% for frequent queries
- Background job processing: < 5 minutes for non-critical tasks

**Mobile Performance**:
- Time to Interactive (TTI): < 3s on mid-tier devices (Snapdragon 660 equivalent)
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1

---

## Success Criteria

### Phase 1: Launch (Week 1-4)

✅ **Adoption**: 80% of faculty complete onboarding and mark attendance at least once  
✅ **Stability**: <5 critical bugs reported, <10 high-priority bugs  
✅ **Performance**: 95th percentile response times meet targets  
✅ **Training**: 100% of faculty complete orientation workshop  

### Phase 2: Stabilization (Month 2-3)

✅ **Engagement**: 90% of faculty use portal as primary attendance tool  
✅ **Grading Workflow**: 70% of assessments graded via portal  
✅ **Materials Usage**: 60% of course materials distributed via portal  
✅ **Support Load**: <50 support tickets per week  

### Phase 3: Optimization (Month 4-6)

✅ **Full Adoption**: 95% of faculty use portal for all teaching tasks  
✅ **Offline Sync**: 99% success rate, <1% conflict rate  
✅ **Satisfaction**: Faculty satisfaction score ≥ 4.0/5.0  
✅ **Efficiency Gains**: 40% reduction in time spent on administrative tasks  

### Phase 4: Maturity (Month 7+)

✅ **Innovation**: Faculty actively request new features  
✅ **Integration**: Seamless data flow with Student, Principal, and Registrar portals  
✅ **Analytics**: Faculty use analytics to improve teaching outcomes  
✅ **Retention**: <5% faculty revert to manual/legacy systems  

### Long-Term Success Indicators

📈 **Student Outcomes**: Improved pass rates, reduced dropout rates in courses with high portal adoption  
📈 **Institutional Efficiency**: Reduced errors in attendance/grade records, faster term-end processing  
📈 **Faculty Satisfaction**: Lower burnout rates, higher job satisfaction scores  
📈 **System Reliability**: 99.5% uptime, <1 critical incident per quarter  

---

## Technical Stack

### Frontend

**Framework**: Next.js 15 (App Router)  
**Language**: TypeScript 5.6  
**UI Library**: React 19  
**State Management**: Zustand  
**API Client**: Axios with interceptors  
**Styling**: Tailwind CSS 4.0  
**Form Validation**: Zod  
**Offline Storage**: IndexedDB (via Dexie.js)  
**PWA**: Service Worker with Workbox  
**Charts**: Recharts  
**Date Handling**: date-fns  
**File Uploads**: React Dropzone  
**Rich Text Editor**: TipTap  

### Backend

**Framework**: Laravel 11  
**Language**: PHP 8.3  
**Database**: PostgreSQL 16  
**Cache**: Redis 7  
**Queue**: Laravel Horizon (Redis-backed)  
**Search**: PostgreSQL Full-Text Search (or Meilisearch for advanced use cases)  
**Storage**: AWS S3 (or MinIO for on-premise)  
**Authentication**: JWT (RS256) via Laravel Sanctum  
**API Documentation**: OpenAPI 3.1 (Swagger UI)  

### DevOps

**Version Control**: Git (GitHub/GitLab)  
**CI/CD**: GitHub Actions  
**Containerization**: Docker + Docker Compose  
**Orchestration**: Kubernetes (production)  
**Monitoring**: Prometheus + Grafana  
**Logging**: ELK Stack (Elasticsearch, Logstash, Kibana)  
**Error Tracking**: Sentry  
**Performance Monitoring**: New Relic or Datadog  

### Testing

**Backend**: PHPUnit, Pest  
**Frontend**: Jest, React Testing Library  
**E2E**: Playwright  
**API Testing**: Postman/Newman  
**Load Testing**: k6  

---

## Navigation Structure

```
Faculty Portal (/)
│
├── 📊 Dashboard (/)
│   ├── Today's Classes
│   ├── Quick Actions (Attendance, Materials, Announcements)
│   ├── Pending Items (Grading, Messages, Approvals)
│   └── Recent Activity
│
├── 📚 My Courses (/courses)
│   ├── Course List (Grid/List view)
│   ├── Course Details (/courses/{id})
│   │   ├── Overview
│   │   ├── Roster
│   │   ├── Syllabus
│   │   ├── Teaching Plan
│   │   └── Analytics
│   └── Course Materials (/courses/{id}/materials)
│
├── ✅ Attendance (/attendance)
│   ├── Mark Attendance (/attendance/mark)
│   ├── Edit Attendance (/attendance/edit)
│   ├── Attendance Reports (/attendance/reports)
│   └── Sync Status (offline mode)
│
├── 📝 Assessments & Grading (/assessments)
│   ├── Create Assessment (/assessments/create)
│   ├── Assessment List (/assessments)
│   ├── Grading Interface (/assessments/{id}/grade)
│   ├── Gradebook (/gradebook)
│   │   ├── Grade Entry
│   │   ├── Grade Calculations
│   │   ├── Publish Grades
│   │   └── Export Options
│   └── Regrade Requests (/assessments/regrade-requests)
│
├── 📄 Materials (/materials)
│   ├── Upload Material (/materials/upload)
│   ├── Organize Materials (/materials/organize)
│   ├── Material Analytics (/materials/analytics)
│   └── Archive (/materials/archive)
│
├── 📅 Timetable (/timetable)
│   ├── Weekly View
│   ├── Substitution Requests (/timetable/substitutions)
│   └── Teaching Swaps (/timetable/swaps)
│
├── 💬 Messaging (/messages)
│   ├── Inbox
│   ├── Sent Messages
│   ├── Announcements (/messages/announcements)
│   └── Compose Message (/messages/compose)
│
├── 🏖️ Leaves & Substitution (/leaves)
│   ├── Request Leave (/leaves/request)
│   ├── My Leaves (/leaves/my-leaves)
│   ├── Substitute Assignments (/leaves/substitute)
│   └── Leave History
│
├── 📋 Exams & Duties (/exams)
│   ├── Duty Assignments (/exams/duties)
│   ├── Invigilation Schedule (/exams/schedule)
│   ├── Incident Reports (/exams/incidents)
│   └── Duty Reports (/exams/reports)
│
├── 📈 Analytics (/analytics)
│   ├── Course Performance
│   ├── Student Insights
│   ├── Teaching Effectiveness
│   └── At-Risk Students
│
└── ⚙️ Settings (/settings)
    ├── Profile
    ├── Preferences (Notifications, Theme)
    ├── Security (2FA, Sessions)
    └── Help & Support
```

---

## Integration Points

### Inbound Integrations (Data Faculty Portal Receives)

1. **From Student Portal**:
   - Assignment submissions
   - Quiz responses
   - Regrade requests
   - Message replies
   - Material download events

2. **From Principal Portal**:
   - Course assignments
   - Timetable allocations
   - Policy updates (attendance windows, grading deadlines)
   - Substitute approvals
   - Exam duty assignments

3. **From Academic Office/Registrar**:
   - Student enrollments
   - Course rosters
   - Drop/add notifications
   - Student status changes (withdrawal, suspension)

4. **From HR Portal**:
   - Leave balances
   - Professional development records
   - Contract status

### Outbound Integrations (Data Faculty Portal Sends)

1. **To Student Portal**:
   - Grade publications
   - Attendance records
   - Material notifications
   - Assignment feedback
   - Class announcements

2. **To Principal Portal**:
   - Attendance summary reports
   - Grade distribution analytics
   - At-risk student flags
   - Leave requests
   - Incident reports

3. **To Academic Office/Registrar**:
   - Final grades (end of term)
   - Attendance certificates
   - Course completion reports

4. **To Notification Service**:
   - Email triggers (grade published, assignment due)
   - SMS alerts (urgent messages)
   - Push notifications (mobile app)

### Event Bus Topics

**Published Events**:
- `faculty.attendance.marked`
- `faculty.attendance.edited`
- `faculty.grade.entered`
- `faculty.grade.published`
- `faculty.material.uploaded`
- `faculty.announcement.sent`
- `faculty.leave.requested`
- `faculty.incident.reported`

**Subscribed Events**:
- `student.assignment.submitted`
- `student.regrade.requested`
- `principal.course.assigned`
- `principal.duty.assigned`
- `registrar.enrollment.changed`
- `system.policy.updated`

---

## Related Documentation

### Core Documents
- **[features.md](./features.md)**: Detailed feature breakdown with user stories and acceptance criteria
- **[pages.md](./pages.md)**: Complete UI/UX specifications with wireframes and interaction patterns
- **[api_spec.yaml](./api_spec.yaml)**: OpenAPI 3.1 specification with all endpoints, request/response schemas
- **[auth_and_permissions.md](./auth_and_permissions.md)**: Comprehensive authentication, authorization, and delegation guide

### Implementation Guides
- **[backend_guide.md](./backend_guide.md)**: Laravel patterns, database queries, service layer, job queues
- **[frontend_guide.md](./frontend_guide.md)**: Next.js architecture, state management, offline sync, component library
- **[db_schema.sql](./db_schema.sql)**: Complete database schema with tables, indexes, RLS policies, triggers

### Operations
- **[build_steps.md](./build_steps.md)**: Development setup, build process, deployment checklist
- **[integration_contracts.md](./integration_contracts.md)**: API contracts, event schemas, webhook specifications
- **[security_checklist.md](./security_checklist.md)**: OWASP compliance, penetration test results, security best practices
- **[tests.md](./tests.md)**: Test coverage, test scenarios, QA reports

### Reference
- **[lessons_and_postmortem.md](./lessons_and_postmortem.md)**: Architecture decisions, challenges, solutions, future improvements
- **[sync_checklist.json](./sync_checklist.json)**: Canonical enums, types, and data structures shared across portals

---

## Quick Start Guide

### For Faculty (First-Time Users)

1. **Access Portal**: Navigate to `https://faculty.yourinstitution.edu` (or provided URL)
2. **Login**: Use institutional credentials (username/password + 2FA)
3. **Complete Profile**: Fill in office hours, contact preferences, profile photo
4. **Dashboard Tour**: Interactive tour highlights key features (5 minutes)
5. **First Attendance**: Mark attendance for your first class (guided workflow)
6. **Explore**: Check out My Courses, Materials, and Messaging sections
7. **Mobile Setup**: Install PWA for offline attendance (optional but recommended)

### For Developers

1. **Clone Repository**: `git clone <repo_url>`
2. **Backend Setup**:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate --seed
   php artisan serve --port=8007
   ```
3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev -- --port 3007
   ```
4. **Access**: `http://localhost:3007`
5. **Test Credentials**: See `docs/test_accounts.md`

### For Administrators

1. **Environment Configuration**: Review `.env` for database, Redis, S3, SMTP settings
2. **Database Migration**: Run `php artisan migrate --seed` to create tables and sample data
3. **Queue Workers**: Start `php artisan horizon` for background job processing
4. **Monitoring**: Configure Prometheus endpoints, set up Grafana dashboards
5. **Backup Strategy**: Schedule daily database backups, test restore procedures
6. **Faculty Onboarding**: Bulk import faculty via CSV, assign initial courses

---

## Support and Feedback

**Technical Support**: support@yourinstitution.edu  
**Feature Requests**: Submit via in-app feedback form or GitHub Issues  
**Security Concerns**: security@yourinstitution.edu (PGP key available)  
**Training Materials**: [training.yourinstitution.edu/faculty](https://training.yourinstitution.edu/faculty)  

**Office Hours** (for faculty):  
Monday-Friday, 9 AM - 5 PM  
Phone: +1-XXX-XXX-XXXX  
Chat: Available in portal (bottom-right corner)

---

**Document Version**: 2.0  
**Last Reviewed**: October 25, 2025  
**Next Review**: January 25, 2026  
**Maintained By**: Faculty Portal Development Team
