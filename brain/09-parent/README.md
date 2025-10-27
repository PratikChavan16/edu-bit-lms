# Parent Portal - Complete Specification

**Portal Name**: Parent Portal  
**Route**: `/parent/*`  
**Port**: `3009`  
**Primary Role**: `parent`  
**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Portal Purpose & Scope](#portal-purpose--scope)
3. [User Personas](#user-personas)
4. [Key Performance Indicators](#key-performance-indicators)
5. [Core Features](#core-features)
6. [Workflows](#workflows)
7. [Security & Privacy](#security--privacy)
8. [Performance Requirements](#performance-requirements)
9. [Technical Stack](#technical-stack)
10. [Navigation Structure](#navigation-structure)
11. [Integration Points](#integration-points)
12. [Mobile App Considerations](#mobile-app-considerations)
13. [Quick Start Guide](#quick-start-guide)

---

## Executive Summary

The Parent Portal is a dedicated interface for parents and guardians to monitor their children's academic progress, attendance, grades, fee payments, and school communications. It provides real-time insights into student performance while maintaining strict privacy boundaries and FERPA compliance.

### Target Users
- **Primary**: Parents/Guardians of enrolled students
- **Secondary**: Legal guardians, extended family members (with authorization)

### Key Statistics (Expected)
- **Total Parents**: 10,000+ (avg 1.5 parents per student)
- **Daily Active Users**: 3,000+ (30% DAU)
- **Peak Usage**: 8-10 AM, 6-9 PM (checking before/after school)
- **Mobile Usage**: 85% (highest mobile usage among all portals)
- **Push Notifications**: 15,000+/day (attendance, grade updates, announcements)

### Success Criteria
✅ 90% parent registration within first semester  
✅ < 3s page load time on mobile (3G network)  
✅ 95% push notification delivery rate  
✅ 80% parent satisfaction score  
✅ 50% weekly active usage rate  
✅ Zero privacy/data breach incidents  

---

## Portal Purpose & Scope

### Primary Purpose
Enable parents to:
1. **Monitor Academic Progress**: View children's grades, assignments, test scores
2. **Track Attendance**: Real-time attendance notifications, monthly reports
3. **Manage Finances**: View fee structure, make payments, download receipts
4. **Communicate**: Message teachers, receive school announcements
5. **Support Learning**: Access study materials, exam schedules, performance insights

### In Scope
✅ Multi-child management (view all children from one account)  
✅ Real-time attendance notifications  
✅ Grade and report card access  
✅ Fee payment integration  
✅ Teacher communication (messages, requests)  
✅ School announcements and circulars  
✅ Leave applications for children  
✅ Parent-teacher meeting scheduling  
✅ Performance analytics and insights  
✅ Document downloads (report cards, fee receipts)  
✅ Mobile app (iOS + Android)  
✅ Push notifications  
✅ Multi-language support (English, Hindi, regional)  

### Out of Scope
❌ Direct interaction with other students/parents (for privacy)  
❌ Grade changes or academic interventions (faculty only)  
❌ Attendance marking (faculty only)  
❌ Course enrollment changes (registrar only)  
❌ Fee structure modifications (admin only)  
❌ Direct access to LMS/learning materials (student-only access)  

---

## User Personas

### Persona 1: Engaged Parent (Mrs. Sharma)

**Demographics**:
- Age: 38
- Occupation: IT Manager
- Tech Savvy: High
- Children: 2 (Class 8, Class 11)

**Goals**:
- Monitor both children's performance daily
- Get instant notifications for absences
- Communicate with teachers proactively
- Track fee payments and deadlines

**Pain Points**:
- Too many apps to manage
- Delayed notifications from school
- Hard to compare performance trends
- Missing important announcements

**Usage Pattern**:
- Checks app 3-4 times daily
- Responds to notifications within 30 minutes
- Uses analytics/reports extensively
- Prefers mobile app over web

**Portal Solution**:
- Unified dashboard for both children
- Real-time push notifications
- Comparative performance charts
- Centralized announcement feed

---

### Persona 2: Working Parent (Mr. Kumar)

**Demographics**:
- Age: 42
- Occupation: Business Owner
- Tech Savvy: Medium
- Children: 1 (Class 10)

**Goals**:
- Quick check on child's attendance/grades
- Easy fee payment (no time to visit school)
- Receive critical alerts only
- Minimal time investment

**Pain Points**:
- Limited time during work hours
- Information overload from school
- Complex payment processes
- Difficulty scheduling meetings

**Usage Pattern**:
- Checks app once daily (evening)
- Wants digest notifications, not real-time
- Uses quick actions (pay fees, approve leave)
- Rarely explores detailed analytics

**Portal Solution**:
- Daily digest notifications (8 PM)
- One-click fee payments
- Priority alerts only (absences, low grades)
- Quick action shortcuts on home screen

---

### Persona 3: Less Tech-Savvy Parent (Mrs. Patel)

**Demographics**:
- Age: 45
- Occupation: Homemaker
- Tech Savvy: Low
- Children: 1 (Class 6)

**Goals**:
- Understand child's performance
- Stay informed about school events
- Pay fees without visiting bank
- Contact teacher when needed

**Pain Points**:
- Overwhelmed by complex interfaces
- Difficulty navigating apps
- Unclear terminology (GPA, percentile)
- Fear of making mistakes online

**Usage Pattern**:
- Checks app 2-3 times weekly
- Needs simple, guided workflows
- Prefers visual indicators over numbers
- Relies on spouse/child for help

**Portal Solution**:
- Simple, intuitive UI with large buttons
- Visual indicators (color-coded grades)
- In-app help and tooltips
- Guided payment wizard
- Regional language support

---

## Key Performance Indicators

### Engagement Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Parent Registration Rate | 90% | Registered parents / Total students |
| Daily Active Users (DAU) | 30% | Unique logins per day |
| Weekly Active Users (WAU) | 50% | Unique logins per week |
| Mobile App Adoption | 80% | Mobile users / Total users |
| Push Notification Open Rate | 65% | Opened / Sent |
| Average Session Duration | 8 min | Time spent per session |
| Feature Usage (Top 3) | 70%+ | % users accessing core features |

### Performance Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Page Load Time (Mobile) | < 3s | 95th percentile |
| API Response Time | < 500ms | Average across all endpoints |
| App Crash Rate | < 0.5% | Crashes / Sessions |
| Push Notification Latency | < 30s | Time from event to notification |
| Payment Success Rate | 98% | Successful / Attempted |

### Business Metrics

| KPI | Target | Measurement |
|-----|--------|-------------|
| Parent Satisfaction Score | 4.0/5.0 | Quarterly survey |
| Support Ticket Reduction | 40% | vs manual processes |
| Fee Collection Rate | 95% | On-time payments |
| Parent-Teacher Meeting Attendance | 85% | Scheduled vs attended |

---

## Core Features

### 1. Multi-Child Dashboard 👨‍👩‍👧‍👦

**Purpose**: Manage multiple children from single parent account

**Features**:
- Switch between children with dropdown/swipe
- Unified view showing all children's key metrics
- Color-coded child profiles
- Quick access to each child's details

**Data Displayed**:
```
┌─────────────────────────────────────────────────┐
│  My Children                          [+ Add]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  🟦 Aarav Kumar (Class 10-A)         [Active]  │
│     Attendance: 94%  |  CGPA: 8.5              │
│     Last Activity: Today, 2:30 PM              │
│     📊 View Details →                          │
│                                                 │
│  🟨 Ananya Kumar (Class 8-B)         [Active]  │
│     Attendance: 96%  |  Percentage: 87%        │
│     Last Activity: Today, 3:45 PM              │
│     📊 View Details →                          │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 2. Real-Time Attendance Tracking 📅

**Purpose**: Monitor child's attendance with instant notifications

**Sub-Features**:
- Real-time attendance notifications (within 5 minutes of marking)
- Monthly attendance calendar view
- Absence explanations and leave requests
- Attendance percentage tracking
- Historical attendance reports

**Notification Example**:
```
🔔 Attendance Update
Aarav Kumar was marked ABSENT in English (Period 2)
Time: 10:05 AM | Teacher: Dr. Sharma
[Request Leave] [Contact Teacher]
```

**Calendar View**:
```
October 2025 - Aarav Kumar
Mo  Tu  We  Th  Fr
 1   2   3   4   5
[P] [P] [P] [A] [P]   A = Absent (1)
 8   9  10  11  12    P = Present (20)
[P] [P] [P] [P] [P]   L = Leave (0)
15  16  17  18  19    H = Holiday (2)
[P] [L] [P] [P] [H]
22  23  24  25  26
[P] [P] [P] [P] [?]

Overall: 94.7% (18 Present / 19 Days)
```

---

### 3. Grade & Report Card Access 📊

**Purpose**: View child's academic performance and progress

**Sub-Features**:
- Subject-wise grades and marks
- Assessment breakdown (quizzes, exams, assignments)
- Report card downloads (PDF)
- Performance trends (graphs)
- Comparison with class average (optional, privacy-controlled)
- Grade notifications on publish

**Grade Dashboard**:
```
┌─────────────────────────────────────────────────┐
│  Aarav Kumar - Class 10-A | Semester 1          │
├─────────────────────────────────────────────────┤
│                                                 │
│  📚 Mathematics               [Grade: A | 91%]  │
│      ├─ Quiz 1: 18/20        ├─ Quiz 2: 19/20  │
│      ├─ Assignment: 45/50    ├─ Midterm: 82/100│
│      └─ Project: 48/50                          │
│      Trend: ↗ Improving                         │
│                                                 │
│  📚 Science                   [Grade: A+ | 94%] │
│      ├─ Lab Work: 48/50      ├─ Quiz: 38/40    │
│      └─ Midterm: 90/100                         │
│      Trend: ➡ Stable                            │
│                                                 │
│  📚 English                   [Grade: B+ | 82%] │
│      ├─ Essay: 40/50         ├─ Quiz: 32/40    │
│      └─ Midterm: 76/100                         │
│      Trend: ↘ Needs Attention ⚠️                │
│                                                 │
├─────────────────────────────────────────────────┤
│  Overall CGPA: 8.5 / 10.0                      │
│  [Download Report Card] [View Analytics]       │
└─────────────────────────────────────────────────┘
```

---

### 4. Fee Management & Payments 💰

**Purpose**: View fee structure and make online payments

**Sub-Features**:
- Fee structure breakdown
- Pending vs paid amounts
- Payment history
- Multiple payment methods (UPI, card, net banking)
- Payment receipts (PDF download)
- Payment reminders (before due date)
- Installment tracking
- Late fee calculations

**Fee Dashboard**:
```
┌─────────────────────────────────────────────────┐
│  Fee Summary - Aarav Kumar (Class 10-A)        │
├─────────────────────────────────────────────────┤
│                                                 │
│  Total Annual Fee: ₹85,000                     │
│  Paid: ₹60,000 (70.6%)                         │
│  Pending: ₹25,000 (29.4%)                      │
│                                                 │
│  ⚠️ Next Payment Due: Nov 15, 2025 (21 days)   │
│     Amount: ₹25,000 (Semester 2 Fee)           │
│                                                 │
│  [Pay Now] [Set Reminder] [View Breakdown]     │
│                                                 │
├─────────────────────────────────────────────────┤
│  Recent Payments                                │
│  ✅ Sep 1, 2025 - ₹30,000 (Semester 1 - 2/2)  │
│     Receipt: #FEE-2025-001234                   │
│  ✅ Jun 1, 2025 - ₹30,000 (Semester 1 - 1/2)  │
│                                                 │
└─────────────────────────────────────────────────┘
```

**Payment Flow**:
```
1. Select pending fee
2. Review amount + breakdown
3. Choose payment method
   ├─ UPI (Google Pay, PhonePe, Paytm)
   ├─ Debit/Credit Card
   ├─ Net Banking
   └─ Wallet (if available)
4. Complete payment (redirected to gateway)
5. Get instant confirmation
6. Download receipt
7. Receive email/SMS confirmation
```

---

### 5. Teacher Communication 💬

**Purpose**: Direct messaging with teachers and coordinators

**Sub-Features**:
- Message teachers (subject-wise)
- View sent/received messages
- Leave requests and approvals
- Meeting scheduling
- Announcement viewing
- Read receipts

**Message Interface**:
```
┌─────────────────────────────────────────────────┐
│  ← Messages | Teachers                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  📧 Dr. Sharma (English Teacher)        [New]  │
│     "Aarav's essay submission..."              │
│     2 hours ago                                 │
│                                                 │
│  📧 Prof. Verma (Math Teacher)                 │
│     "Great progress in recent test!"           │
│     Yesterday, 4:30 PM                          │
│                                                 │
│  📧 Ms. Gupta (Class Coordinator)       [New]  │
│     "PTM scheduled for Nov 5th"                │
│     5 hours ago                                 │
│                                                 │
│  [+ New Message]                                │
└─────────────────────────────────────────────────┘

Compose Message:
┌─────────────────────────────────────────────────┐
│  To: Dr. Sharma (English Teacher)              │
│  Subject: [Regarding Aarav's Performance]      │
│                                                 │
│  Message:                                       │
│  ┌───────────────────────────────────────────┐ │
│  │ I would like to discuss Aarav's recent   │ │
│  │ essay grades. Is there an opportunity    │ │
│  │ for improvement?                          │ │
│  └───────────────────────────────────────────┘ │
│                                                 │
│  [📎 Attach] [Send] [Cancel]                   │
└─────────────────────────────────────────────────┘
```

---

### 6. Performance Analytics 📈

**Purpose**: Insights into child's academic trends and patterns

**Sub-Features**:
- Subject-wise performance graphs
- Attendance trends over time
- Comparison with previous semesters
- Strengths and weaknesses analysis
- Predictive insights (at-risk subjects)
- Peer comparison (anonymized, opt-in)

**Analytics Dashboard**:
```
┌─────────────────────────────────────────────────┐
│  Performance Analytics - Aarav Kumar            │
├─────────────────────────────────────────────────┤
│                                                 │
│  📊 Grade Trend (Last 3 Semesters)             │
│                                                 │
│   95%│              ●                           │
│   90%│         ●    │                           │
│   85%│    ●    │    │                           │
│   80%│    │    │    │                           │
│   75%│────┴────┴────┴───                        │
│       Sem3  Sem4  Sem5                          │
│                                                 │
│  Trend: ↗ Consistent Improvement                │
│                                                 │
├─────────────────────────────────────────────────┤
│  🎯 Strengths                                   │
│  • Mathematics (Top 10% in class)              │
│  • Science (Lab work excellent)                │
│  • Computer Science (91% average)              │
│                                                 │
│  ⚠️ Areas for Improvement                      │
│  • English (Essay writing skills)              │
│  • Social Studies (Needs more attention)       │
│                                                 │
└─────────────────────────────────────────────────┘
```

---

### 7. School Announcements & Events 📢

**Purpose**: Stay informed about school activities and updates

**Sub-Features**:
- Important announcements
- Event calendar
- Holiday calendar
- Exam schedules
- PTM dates and reminders
- School circulars (PDF)

---

### 8. Leave Applications 🏖️

**Purpose**: Request leave for child with proper documentation

**Sub-Features**:
- Leave request form
- Document upload (medical certificates)
- Approval tracking
- Leave history
- Remaining leave balance

**Leave Request Flow**:
```
1. Select child
2. Fill leave form:
   - Date range (from-to)
   - Reason (dropdown + description)
   - Upload documents (optional)
3. Submit request
4. Track approval status:
   ├─ Pending (Class Coordinator)
   ├─ Approved ✅
   └─ Rejected (with reason)
5. Receive notification on status change
```

---

## Workflows

### Workflow 1: Morning Routine Check (Daily)

**Actor**: Engaged Parent (Mrs. Sharma)  
**Time**: 8:00 AM (before work)  
**Duration**: 3 minutes

```
1. Open mobile app
2. View dashboard (both children)
3. Check attendance notifications
   ├─ Child 1: Present ✅
   └─ Child 2: Present ✅
4. Check today's schedule
5. Review any new announcements
6. Close app
```

**Success Criteria**: All children marked present, no urgent issues

---

### Workflow 2: Grade Check After Exam Results (Weekly)

**Actor**: Working Parent (Mr. Kumar)  
**Time**: Evening (after work)  
**Duration**: 10 minutes

```
1. Receive push notification: "New grades published"
2. Open app → Navigate to Grades
3. View subject-wise breakdown
4. Check class average comparison
5. If grade is low:
   ├─ View detailed assessment scores
   ├─ Identify weak areas
   └─ Send message to teacher for clarification
6. Download report card PDF
7. Discuss with child
```

**Success Criteria**: Grades reviewed, action plan if needed

---

### Workflow 3: Fee Payment Before Deadline (Monthly)

**Actor**: Less Tech-Savvy Parent (Mrs. Patel)  
**Time**: 3 days before due date  
**Duration**: 5 minutes

```
1. Receive payment reminder notification
2. Open app → Navigate to Fees
3. View pending amount
4. Click "Pay Now"
5. Payment wizard:
   ├─ Review amount (₹25,000)
   ├─ Select UPI option
   ├─ Enter UPI ID
   ├─ Confirm payment
   └─ Payment successful ✅
6. Download receipt
7. Receive SMS confirmation
```

**Success Criteria**: Payment successful, receipt saved

---

### Workflow 4: Leave Request (As Needed)

**Actor**: Any Parent  
**Duration**: 5 minutes

```
1. Navigate to Leave Requests
2. Click "Apply for Leave"
3. Fill form:
   ├─ Select child
   ├─ Select dates (Nov 10-12)
   ├─ Reason: "Family function"
   └─ Upload invitation (optional)
4. Submit request
5. Receive confirmation: "Request submitted"
6. Track status:
   ├─ Day 1: Pending
   └─ Day 2: Approved ✅
7. Receive approval notification
```

**Success Criteria**: Leave approved in time

---

### Workflow 5: Teacher Communication (As Needed)

**Actor**: Engaged Parent  
**Duration**: 10 minutes

```
1. Notice child struggling in Math
2. Navigate to Messages
3. Click "New Message"
4. Select teacher: "Prof. Verma (Math)"
5. Compose message:
   "I noticed Aarav is struggling with algebra.
    Can we schedule a meeting to discuss?"
6. Send message
7. Receive reply within 24 hours
8. Schedule meeting via app
9. Add meeting to calendar
10. Receive reminder 1 day before
```

**Success Criteria**: Meeting scheduled, concerns addressed

---

## Security & Privacy

### Privacy Principles

1. **Data Minimization**: Parents only see their children's data
2. **Child-Centric Access**: Student must exist and be linked to parent
3. **Audit Logging**: All access logged for compliance
4. **FERPA Compliance**: Educational records protected
5. **Secure Linking**: Multi-factor verification for parent-child linking

### Authentication

- **2-Factor Authentication**: Optional but recommended
- **Biometric Login**: Face ID / Fingerprint on mobile
- **Session Management**: 30-day remember me, 2-hour active session
- **Device Linking**: Max 3 devices per parent

### Authorization Model

```yaml
Parent Permissions:
  own_children:
    view:
      - attendance_records
      - grades
      - report_cards
      - fee_details
      - exam_schedules
      - announcements
    create:
      - leave_requests
      - messages_to_teachers
      - meeting_requests
    update:
      - own_profile
      - notification_preferences
      - payment_methods
    
  restrictions:
    - Cannot view other students' data
    - Cannot modify academic records
    - Cannot access internal staff communications
    - Cannot view confidential administrative data
```

### Data Protection

- **Encryption at Rest**: AES-256-GCM
- **Encryption in Transit**: TLS 1.3
- **PII Protection**: Student names, contact info encrypted
- **Payment Security**: PCI DSS compliant
- **Backup**: Daily encrypted backups, 30-day retention

---

## Performance Requirements

### Response Time Targets

| Operation | Target | Max Acceptable |
|-----------|--------|----------------|
| Dashboard Load (Mobile) | < 2s | < 3s |
| Grade Refresh | < 1s | < 2s |
| Payment Processing | < 5s | < 10s |
| Message Send | < 1s | < 2s |
| PDF Download | < 3s | < 5s |

### Scalability

- **Concurrent Users**: 5,000+ during peak
- **API Rate Limit**: 100 requests/minute per user
- **Push Notifications**: 10,000+ per minute during grade publish
- **Payment Gateway**: 500 concurrent transactions

### Availability

- **Uptime SLA**: 99.5% (excluding maintenance)
- **Maintenance Window**: 2 AM - 4 AM Sunday
- **Disaster Recovery**: 4-hour RTO, 1-hour RPO

---

## Technical Stack

### Backend

```yaml
Framework: Laravel 11 (PHP 8.3)
Database: PostgreSQL 16 (with RLS)
Cache: Redis 7
Queue: Laravel Horizon (Redis)
Search: PostgreSQL Full-Text Search
File Storage: AWS S3
CDN: CloudFront
```

### Frontend (Web)

```yaml
Framework: Next.js 15 (App Router)
Language: TypeScript 5.6
UI Library: React 19
State Management: Zustand + React Query
Styling: Tailwind CSS + shadcn/ui
Charts: Recharts
PDF Generation: jsPDF
```

### Mobile App

```yaml
Framework: React Native 0.73
State: Redux Toolkit
Navigation: React Navigation
Push Notifications: Firebase Cloud Messaging
Payments: Razorpay/PhonePe SDK
Biometrics: React Native Biometrics
Offline: AsyncStorage + SQLite
```

### Payment Integration

```yaml
Gateways:
  - Razorpay (Primary)
  - PhonePe (Alternative)
  - Paytm (Alternative)
Methods:
  - UPI
  - Credit/Debit Cards
  - Net Banking
  - Wallets (Paytm, PhonePe)
```

### Notifications

```yaml
Push: Firebase Cloud Messaging (FCM)
Email: AWS SES
SMS: AWS SNS / Twilio
In-App: WebSockets (Socket.io)
```

---

## Navigation Structure

```
Parent Portal
│
├─ 🏠 Home / Dashboard
│  ├─ All Children Overview
│  ├─ Today's Attendance Status
│  ├─ Recent Notifications
│  ├─ Pending Fee Payments
│  └─ Quick Actions
│
├─ 👦 Child Profile (Per Child)
│  ├─ Overview
│  ├─ Attendance
│  │  ├─ Monthly Calendar
│  │  ├─ Attendance History
│  │  └─ Apply Leave
│  ├─ Grades
│  │  ├─ Subject-wise Marks
│  │  ├─ Assessment Breakdown
│  │  ├─ Report Cards
│  │  └─ Performance Trends
│  ├─ Fees
│  │  ├─ Fee Structure
│  │  ├─ Payment History
│  │  ├─ Pending Payments
│  │  └─ Pay Now
│  └─ Analytics
│     ├─ Performance Graphs
│     ├─ Strengths & Weaknesses
│     └─ Class Comparison
│
├─ 💬 Messages
│  ├─ Inbox
│  ├─ Sent
│  ├─ Compose
│  └─ Teacher Contacts
│
├─ 📢 Announcements
│  ├─ School News
│  ├─ Events Calendar
│  ├─ Exam Schedule
│  └─ Holiday Calendar
│
├─ 🗓️ Meetings
│  ├─ Upcoming PTMs
│  ├─ Schedule Meeting
│  └─ Meeting History
│
├─ 📄 Documents
│  ├─ Report Cards
│  ├─ Fee Receipts
│  ├─ Leave Approvals
│  └─ Circulars
│
└─ ⚙️ Settings
   ├─ Profile
   ├─ Children Management
   ├─ Notification Preferences
   ├─ Payment Methods
   ├─ Security (2FA)
   └─ Language Selection
```

---

## Integration Points

### 1. Student Portal Integration

```yaml
Purpose: Access student academic data
Data Flow: Student Portal → Parent Portal (read-only)
Endpoints:
  - GET /api/students/{id}/attendance
  - GET /api/students/{id}/grades
  - GET /api/students/{id}/report-cards
Authorization: Parent-child relationship verified
```

### 2. Faculty Portal Integration

```yaml
Purpose: Teacher communication, grade notifications
Data Flow: Faculty Portal → Parent Portal
Endpoints:
  - POST /api/messages
  - GET /api/teachers/{id}/availability
Events:
  - faculty.grade.published → notify_parent
  - faculty.attendance.marked → notify_parent
```

### 3. Fee Management System

```yaml
Purpose: Fee payments and receipts
Data Flow: Bidirectional
Endpoints:
  - GET /api/fees/student/{id}/pending
  - POST /api/fees/payments
  - GET /api/fees/receipts/{id}
Webhooks:
  - payment.success → update_parent_portal
  - payment.failed → notify_parent
```

### 4. Principal/Admin Portal

```yaml
Purpose: Announcements, event notifications
Data Flow: Admin Portal → Parent Portal
Events:
  - admin.announcement.published → notify_all_parents
  - admin.event.created → notify_relevant_parents
  - admin.exam_schedule.updated → notify_parents
```

### 5. Payment Gateways

```yaml
Razorpay Integration:
  - Payment initiation
  - Payment status webhooks
  - Refund processing
  - Receipt generation

PhonePe Integration:
  - UPI payments
  - Transaction status
  - Settlement reports
```

---

## Mobile App Considerations

### Platform Support

- **iOS**: 14.0+
- **Android**: 8.0+ (API Level 26+)
- **Distribution**: App Store, Google Play

### Mobile-Specific Features

1. **Push Notifications**: Real-time alerts
2. **Biometric Auth**: Face ID / Touch ID / Fingerprint
3. **Offline Mode**: View cached data (grades, attendance)
4. **Home Screen Widgets**: Quick attendance view
5. **Deep Linking**: Open specific child/section from notification
6. **Share Sheet**: Share report cards, receipts
7. **Camera**: Upload documents for leave requests

### Mobile Performance

- **App Size**: < 30 MB
- **Startup Time**: < 2 seconds
- **Memory Usage**: < 150 MB
- **Battery Impact**: Minimal (< 2% daily)

### Mobile UX

- **Bottom Navigation**: Easy thumb access
- **Large Touch Targets**: Minimum 44x44 pt
- **Swipe Gestures**: Switch between children
- **Pull to Refresh**: Update data
- **Haptic Feedback**: Confirmation actions

---

## Quick Start Guide

### For Developers

```bash
# Clone repository
git clone https://github.com/institution/edu-bit-lms.git
cd edu-bit-lms/portals/09-parent

# Backend setup
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve --port=3009

# Frontend setup (web)
cd ../frontend
npm install
cp .env.example .env.local
npm run dev

# Mobile app setup
cd ../mobile
npm install
npx pod-install (iOS only)
npm run ios  # or npm run android
```

### For Parents

```
1. Download mobile app from App Store / Play Store
2. Register with mobile number + OTP
3. Link children (using school-provided code)
4. Set notification preferences
5. Enable biometric login (optional)
6. Start monitoring!
```

### For Administrators

```
1. Generate parent invitation codes
2. Share codes with parents via email/SMS
3. Verify parent-child linking requests
4. Configure notification settings
5. Set up payment gateway (if not done)
6. Test complete parent journey
7. Launch and monitor!
```

---

## Related Documentation

- [Authentication & Permissions](./auth_and_permissions.md)
- [UI Pages Specification](./pages.md)
- [Security Checklist](./security_checklist.md)
- [Testing Strategy](./tests.md)
- [Integration Contracts](./integration_contracts.md)
- [Build & Deployment](./build_steps.md)
- [Lessons & Postmortem](./lessons_and_postmortem.md)

---

**Last Updated**: October 25, 2025  
**Maintained By**: Parent Portal Team  
**Support**: parent-portal@institution.edu  
**App Store**: https://apps.apple.com/parent-portal  
**Play Store**: https://play.google.com/parent-portal
