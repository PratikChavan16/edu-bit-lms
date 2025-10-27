# Principal Portal - Pages & Wireframes

Version: 2.0
Last Updated: October 25, 2025
Total Pages: 16

Scope: Principal manages a single college within a university. All data is strictly scoped by university_id + college_id. Screens emphasize approvals, college performance, and rapid decision-making.

Global Navigation
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 🎓 Principal Portal                                     🔔 4   👤 Dr. A. Rao │
├──────────────────────────────────────────────────────────────────────────────┤
│ Dashboard │ Faculty │ Students │ Departments │ Programs │ Admissions │ Exams │
│ Reports   │ Infra   │ Finance  │ Comms       │ Settings                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

Design Notes
- Density: Medium; lists default to 25 rows/page; charts prioritized on Dashboard/Reports.
- Approvals: Consistent approve/reject modals with mandatory remarks and audit trail.
- Status colors: Green=On track, Amber=Attention, Red=Action required, Grey=Draft.
- Empty, Loading, Error states defined per page; show contextual help links.
- Accessibility: Keyboard navigable, ARIA labels; color-contrast AA; focus rings.
- Responsive: Breakpoints at 1440/1200/992/768/576px; tables collapse to cards under 768px.

---

## Page 1: Dashboard

Route: `/principal/dashboard`
Access: role=principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ 📊 Key Metrics                                                               │
│ ┌──────────────┬──────────────┬─────────────────┬──────────────────────────┐ │
│ │ Students     │ Faculty      │ Departments     │ Budget Utilization       │ │
│ │ 856          │ 67           │ 12              │ 85% (₹2.04M/₹2.4M)       │ │
│ └──────────────┴──────────────┴─────────────────┴──────────────────────────┘ │
│                                                                              │
│ 🎯 Pending Approvals (11)                         🔔 Notifications (4)       │
│ ┌──────────────────────────────┐  ┌────────────────────────────────────────┐ │
│ │ Leave Requests        (5)     │  │ Budget ≥₹5L escalated to Owner (1)   │ │
│ │ Budget Requisitions   (3)     │  │ Exam grievance submitted (2)         │ │
│ │ Course Proposals      (2)     │  │ Interview panel confirmation (1)     │ │
│ │ Admission Appeals     (1)     │  └──────────────────────────────────────┘ │
│ └──────────────────────────────┘                                            │
│                                                                              │
│ 🧭 Department Performance (12)                                               │
│ ┌──────────────────────────────────────────────────────────────────────────┐ │
│ │ CS 92  │ EE 88 │ ME 84 │ CE 81 │ MBA 86 │ Math 79 │ Physics 82 │ Chem 80 │ │
│ │ Cards show: students, pass%, workload, budget use, alerts                │ │
│ └──────────────────────────────────────────────────────────────────────────┘ │
│                                                                              │
│ ⚡ Quick Actions                                                              │
│ [Approve Leave] [Review Budget] [Send Announcement] [Open Reports]           │
└──────────────────────────────────────────────────────────────────────────────┘
```

Components
- Metric cards update every 60s via SSE.
- Pending approvals sorted by SLA; red when >24h.
- Department cards link to department detail; score composite of pass%, research, compliance.
- Quick actions open modal forms; success toasts + activity feed log.

States
- Empty: show “Connect departments to see performance.” CTA → Departments page.
- Loading: skeleton cards; fallback summary banner.
- Error: transient banner with retry; logs to Sentry with college_id.

---

## Page 2: Faculty Directory

Route: `/principal/faculty`
Access: principal, hod (read-only name/email), hr_manager (if delegated)

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Filters: Dept ▼ Designation ▼ Status ▼   Search: [ name/email ]  (67)        │
├──────────────────────────────────────────────────────────────────────────────┤
│ Name          │ Dept  │ Designation │ Workload │ On Leave │ Last Eval │ ⚙️  │
│ Dr. S. Mehta  │ CS    │ Assoc Prof  │ 14h/wk   │ No       │ 2025-05   │ ⋯  │
│ …             │ …     │ …           │ …        │ …        │ …         │ ⋯  │
├──────────────────────────────────────────────────────────────────────────────┤
│ [➕ Post Vacancy]  [📄 Export]  [⚖️ Workload Heatmap]                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

Row actions
- View Profile, Assign Courses, Approve Leave, Start Evaluation, Raise Grievance Case, Start Exit.

Notes
- Workload heatmap aggregates teaching hours vs 18h/week cap.
- Export limited to college scope; masked personal identifiers by policy.

---

## Page 3: Faculty Recruitment

Route: `/principal/faculty/recruitment`
Access: principal, hr_manager (if delegated)

Layout (Kanban)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Draft (3)     │ Applications (74)     │ Shortlist (12)  │ Interviews (6)     │
│ Offer (2)     │ Onboarding (1)                                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Cards: Candidate, Role, Score, Stage age, Next action [⋯]                             │
└──────────────────────────────────────────────────────────────────────────────┘
```

Panel: Right side details for selected candidate
- Tabs: Profile | Documents | Scores | Panel Notes | Decision
- Actions: Schedule interview, Assign panel (3–5), Approve Hire, Reject with reason.

SLA
- Applications triage < 48h; interview feedback < 24h; offer validity 7 days.

---

## Page 4: Course Assignments

Route: `/principal/faculty/assignments`
Access: principal, hod (proposal), timetable_officer (view)

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Semester: 2025-26 S1  Program: B.Tech CS (60)                                │
├──────────────────────────────────────────────────────────────────────────────┤
│ Course     │ Sections │ Hours │ Assigned Faculty        │ Load │ Conflicts │
│ CS101      │ A,B      │ 4     │ Dr. Mehta, Ms. Rao      │ 16   │ 0         │
│ CS202      │ A        │ 3     │ Mr. Kulkarni            │ 9    │ 1         │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Detect Conflicts]  [Rebalance Load]  [Export Timetable Proposal]            │
└──────────────────────────────────────────────────────────────────────────────┘
```

Rules
- Max 18 teaching hours/week; overload flagged amber; hard cap 22 with justification.
- Conflict detector checks person-time-location across sections.

---

## Page 5: Leave Approvals

Route: `/principal/faculty/leave`
Access: principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Pending (5) │ Approved │ Rejected │ History                                   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Applicant     │ Type     │ From → To     │ Days │ Balance │ Attach │ Action   │
│ Dr. Mehta     │ Annual   │ 25-10 → 29-10 │ 3    │ 14      │ 📎 PDF │ Approve  │
│ …             │ …        │ …             │ …    │ …       │ …      │ Reject   │
└──────────────────────────────────────────────────────────────────────────────┘
```

Policy
- Annual 21d, Medical 12d, Emergency 7d; Sabbatical via special approval route.
- Auto-escalate if pending >48h. Mandatory remarks on rejection.

---

## Page 6: Performance Evaluations

Route: `/principal/faculty/evaluations`
Access: principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Cycle: 2025 Annual  │ Status: In Progress                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│ Faculty       │ Teaching │ Research │ Service │ Innovation │ Leadership │ Avg │
│ Dr. Mehta     │ 4.5      │ 3.8      │ 4.2     │ 4.1        │ 4.4        │ 4.2 │
│ …             │ …        │ …        │ …       │ …          │ …          │ …   │
└──────────────────────────────────────────────────────────────────────────────┘
```

Actions
- Launch 360° feedback, Lock scores, Recommend increment (3–15%), Nominate for promotion.

---

## Page 7: Students Directory

Route: `/principal/students`
Access: principal, hod (limited), counselor (read)

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Filters: Program ▼ Year ▼ Section ▼ Status ▼   Search: [ name/roll/email ]   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Name           │ Program   │ Year │ Section │ CGPA │ Attendance │ Risk │ ⚙️ │
│ A. Sharma      │ B.Tech CS │ 2    │ A       │ 7.2  │ 88%        │ Low  │ ⋯  │
│ …              │ …         │ …    │ …       │ …    │ …          │ …    │ ⋯  │
└──────────────────────────────────────────────────────────────────────────────┘
```

Highlights
- At-risk banner for CGPA < 6.0 or attendance < 75%; click to open intervention plan.
- Alumni tab for graduated cohorts with employment summaries.

---

## Page 8: Admissions Console

Route: `/principal/admissions`
Access: principal, admission_officer (operates), finance (payments view)

Layout (Funnel + Worklists)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Funnel: Applied 500 → Verified 420 → Admitted 200 → Enrolled 195 (39%)       │
├──────────────────────────────────────────────────────────────────────────────┤
│ Tabs: Applications │ Verification │ Merit List │ Counseling │ Seat Allocation │
│      │ Payments │ Reports                                                            │
├──────────────────────────────────────────────────────────────────────────────┤
│ Worklist (Verification)                                                       │
│ Applicant │ Program │ Score │ Docs ✓ │ Flags │ Action [Verify ▾]              │
│ …         │ …       │ …     │ …      │ …     │ …                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

Controls
- Criteria: Entrance 60%, Academics 30%, Interview 10%; reservations as per policy.
- Auto-waitlist promotion; payment gateway with installments; refunds tracked.

---

## Page 9: Department Management

Route: `/principal/departments`
Access: principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Cards (12): Dept → HOD → Students → Faculty → Budget Alloc → Score          │
│ [Assign/Reassign HOD] [Distribute Budget] [View Report]                      │
└──────────────────────────────────────────────────────────────────────────────┘
```

Details Drawer
- KPIs: pass%, research output, utilization, compliance. Actions feed per dept.

---

## Page 10: Academic Programs

Route: `/principal/programs`
Access: principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Program │ Seats │ Curriculum Ver │ Outcome Attain │ Industry MoUs │ Status  │
│ B.Tech CS│ 60   │ ✅ 2025         │ 82%             │ 6             │ Active  │
│ …        │ …    │ …              │ …               │ …             │ …       │
├──────────────────────────────────────────────────────────────────────────────┤
│ [Approve Curriculum Change] [Initiate Review] [Add MoU]                       │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes
- 20% local customization allowed; track change requests and approvals.

---

## Page 11: Examinations Oversight

Route: `/principal/exams`
Access: principal, exam_controller (operate)

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Timetables │ Committees │ Conduct │ Grievances │ Results │ Supplementary     │
├──────────────────────────────────────────────────────────────────────────────┤
│ Timetable Approval                                                           │
│ Program  │ Semester │ Draft by │ Conflicts │ Action [Approve / Request fix] │
│ B.Tech CS│ 2025 S1  │ SA Team  │ 0         │ Approve                         │
│ …        │ …        │ …        │ …         │ …                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes
- Committees include chief superintendent; conduct panel logs incidents; results approval requires grade distribution check.

---

## Page 12: Reports & Analytics

Route: `/principal/reports`
Access: principal

Layout (Builder)
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Dimensions: Students ▢ Faculty ▢ Programs ▢ Finance ▢ Exams ▢ Admissions     │
│ Filters: Time ▼ Dept ▼ Program ▼                                             │
├──────────────────────────────────────────────────────────────────────────────┤
│ Visualization: [Bar ▾]  Group by: [Program]  Metric: [Pass %]                │
│                                                                              │
│   ███████   ██████    █████████                                              │
│   CS        EE         MBA                                                   │
│                                                                              │
│ [Save] [Export PDF] [Schedule Email]                                         │
└──────────────────────────────────────────────────────────────────────────────┘
```

Samples
- Enrollment trends, workload, finance summary, placement rate, accreditation KPIs.

---

## Page 13: Infrastructure

Route: `/principal/infra`
Access: principal, facilities_manager (operate)

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Rooms & Labs │ Maintenance │ Equipment │ Bookings │ Projects │ Safety │ Util  │
├──────────────────────────────────────────────────────────────────────────────┤
│ Rooms & Labs (45)                                                             │
│ Calendar view: utilization 85%; filter by type; conflict alerts               │
├──────────────────────────────────────────────────────────────────────────────┤
│ Maintenance Worklist: Ticket → Assignment → Completion → Approval             │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Page 14: Financial Overview

Route: `/principal/finance`
Access: principal, finance_officer (operate)

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Budget vs Actual: ₹2.4M vs ₹2.04M (85%)                                      │
│ Dept Distribution: CS ₹400K … Math ₹150K                                      │
├──────────────────────────────────────────────────────────────────────────────┤
│ Expense Approvals                                                             │
│ Req# │ Dept │ Amount │ Category │ Age │ Action [Approve <₹5L / Escalate ≥₹5L] │
└──────────────────────────────────────────────────────────────────────────────┘
```

Notes
- Salary verification monthly; audit trail printable; export to XLSX.

---

## Page 15: Communication Center

Route: `/principal/comms`
Access: principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Announcements │ PTMs │ Grievances │ Town Halls │ Memos │ External │ Alerts   │
├──────────────────────────────────────────────────────────────────────────────┤
│ Composer: Audience (College/Dept/Program/Targeted)                           │
│ Message [………………………………………]  Attachments [📎]  [Send Now ▾]                 │
├──────────────────────────────────────────────────────────────────────────────┤
│ Grievances SLA: Students 24h ack, 7d resolve; Faculty 7d                     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Page 16: Settings

Route: `/principal/settings`
Access: principal

Layout
```
┌──────────────────────────────────────────────────────────────────────────────┐
│ Profile │ Notifications │ Delegations │ Permissions │ Security (2FA)         │
├──────────────────────────────────────────────────────────────────────────────┤
│ Delegations: Assign temporary approver (date range, features).               │
│ Permissions: View RBAC matrix; request new permissions from Owner.           │
│ Security: Enable 2FA (TOTP/SMS), session timeout (60m), device management.   │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

Cross-cutting Components
- Approval Modal: always requires reason; records approver_id, timestamp, SLA.
- Audit Trail Drawer: side panel on most detail pages; exportable.
- Activity Feed: chronological log per entity; real-time updates.
- Search: global college-scoped search across faculty, students, departments.

Error & Edge Cases
- No Departments configured → onboarding wizard to create/assign HODs.
- High budget variance (>10%) → finance alert banner with quick link to Reports.
- Exam malpractice incident → auto-notify exam controller + create case record.

Performance & Telemetry
- 95th percentile page load < 1.5s at 20 req/s; charts lazy-load after content.
- Critical interactions (approve/reject) log to analytics with decision latency.

Security & Privacy
- All endpoints require JWT with university_id + college_id; UI blocks cross-college navigation.
- PII masked in lists; full view behind “View details” with purpose logging.

Internationalization
- Date/time/number formats per locale; INR currency default with i18n support.

