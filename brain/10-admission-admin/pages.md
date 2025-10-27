# Admission Admin Portal - Pages & UI Wireframes

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Page Structure Overview

```
Admission Admin Portal
├── Dashboard (Home)
├── Applications
│   ├── Application List
│   ├── Application Detail
│   └── Application Timeline
├── Document Verification
│   ├── Verification Queue
│   ├── Document Review Interface
│   └── OCR Results Comparison
├── Merit Lists
│   ├── Merit List Generation
│   ├── Merit List Preview
│   └── Published Merit Lists
├── Seat Allocation
│   ├── Seat Allocation Matrix
│   ├── Counseling Rounds Configuration
│   └── Choice Filling Status
├── Communication
│   ├── Bulk Email/SMS Center
│   ├── Template Management
│   └── Notification Logs
├── Reports
│   ├── Application Statistics
│   ├── Verification Performance
│   ├── Merit List Analytics
│   └── Revenue Reports
└── Settings
    ├── Admission Cycle Configuration
    ├── Formula Configuration
    ├── Staff Management
    └── System Settings
```

---

## 1. Dashboard (Home)

**Route**: `/admission/dashboard`  
**Role Access**: All Admission Admins

### Layout Components

#### Top Stats Row
```
┌─────────────────────────────────────────────────────────────────────┐
│  Total Applications    Documents Pending   Merit Lists    Seats     │
│      42,847               247                 12         Filled      │
│  ↑ 12% vs last year    ↓ 18% vs yesterday    Published   2,847/3000│
└─────────────────────────────────────────────────────────────────────┘
```

#### Revenue Card
```
┌─────────────────────────────────────────────────────────────────────┐
│  Revenue Collected                                                   │
│  ₹11.8 Crores                                                       │
│  ↑ 8.5% vs last year                                                │
│  Pending: ₹28 Lakhs (from 342 applications)                        │
└─────────────────────────────────────────────────────────────────────┘
```

#### Application Status Breakdown (Pie Chart)
```
┌─────────────────────────────────────┐
│  Application Status                 │
│  • Submitted: 8,234 (19%)          │
│  • Under Verification: 3,456 (8%) │
│  • Verified: 28,157 (66%)         │
│  • Rejected: 1,234 (3%)           │
│  • Admitted: 1,766 (4%)           │
└─────────────────────────────────────┘
```

#### Recent Activities (Timeline)
```
┌─────────────────────────────────────────────────────────────────────┐
│  15:42  Merit List 2024-ENGG-Round-3 published by Dr. Sharma       │
│  14:30  247 documents assigned to verification team                 │
│  12:15  Seat Allocation algorithm completed (Round 2)              │
│  10:00  Bulk email sent to 1,234 applicants (Counseling reminder) │
└─────────────────────────────────────────────────────────────────────┘
```

#### Quick Actions (Role-Based)
```
[+ New Application]  [Assign Documents]  [Generate Merit List]  [Send Notification]
```

---

## 2. Application List

**Route**: `/admission/applications`  
**Role Access**: All Admission Admins

### Filters Panel (Left Sidebar)
```
┌─────────────────────────────────┐
│  Filters                         │
│  ─────────────────────────────  │
│  Program                         │
│  [All Programs ▼]               │
│                                  │
│  Application Status              │
│  ☑ Submitted                    │
│  ☑ Under Verification           │
│  ☑ Verified                     │
│  ☐ Rejected                     │
│  ☐ Admitted                     │
│                                  │
│  Date Range                      │
│  [01/06/2024] - [31/07/2024]   │
│                                  │
│  Category                        │
│  [All Categories ▼]             │
│                                  │
│  Payment Status                  │
│  ☑ Paid                         │
│  ☐ Pending                      │
│  ☐ Failed                       │
│                                  │
│  Document Status                 │
│  [All Statuses ▼]               │
│                                  │
│  [Apply Filters] [Reset]        │
└─────────────────────────────────┘
```

### Application Table (Main Content)
```
┌────────────────────────────────────────────────────────────────────────────────────────────┐
│  Search: [_______________]  [Export CSV] [Bulk Assign]                                    │
│  ──────────────────────────────────────────────────────────────────────────────────────── │
│  App ID    Name               Program        Category  Status       Payment  Actions      │
│  ──────────────────────────────────────────────────────────────────────────────────────── │
│  AD24-001  Rahul Sharma       B.Tech CSE     General   Verified     ✅ Paid  [View] [📎] │
│  AD24-002  Priya Patel        B.Tech Mech    OBC       Under Ver.   ✅ Paid  [View] [📎] │
│  AD24-003  Amit Kumar         B.Tech Civil   SC        Submitted    ⏳ Pend  [View] [📎] │
│  AD24-004  Sneha Deshmukh     B.Tech IT      General   Rejected     ✅ Paid  [View] [📎] │
│  AD24-005  Rohan Mehta        B.Tech EEE     OBC       Verified     ✅ Paid  [View] [📎] │
│  ──────────────────────────────────────────────────────────────────────────────────────── │
│  Showing 1-50 of 42,847 applications       [1] 2 3 ... 857 [Next]                        │
└────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Application Detail View

**Route**: `/admission/applications/:id`  
**Role Access**: All Admission Admins

### Top Header
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  ← Back to Applications          Application #AD24-001234                               │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Rahul Sharma | B.Tech Computer Science Engineering | General Category                  │
│  Status: Verified ✅ | Payment: Paid ✅ | Documents: 8/8 Verified                      │
│  [Edit Application] [Send Email] [Send SMS] [Mark as Rejected]                         │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Tabs Navigation
```
[Personal Info] [Academic Details] [Documents] [Payment] [Timeline] [Notes]
```

### Personal Info Tab
```
┌─────────────────────────────────────────────────────────────────────┐
│  Personal Information                                                │
│  ────────────────────────────────────────────────────────────────   │
│  Full Name:           Rahul Sharma                                  │
│  Date of Birth:       15/08/2006 (18 years)                        │
│  Gender:              Male                                           │
│  Email:               rahul.sharma@email.com                        │
│  Mobile:              +91 98765 43210                               │
│  Aadhar Number:       XXXX-XXXX-1234                                │
│  Address:             123, MG Road, Pune, Maharashtra - 411001      │
│                                                                      │
│  Parent/Guardian Information                                         │
│  ────────────────────────────────────────────────────────────────   │
│  Father's Name:       Vijay Sharma                                  │
│  Mother's Name:       Sunita Sharma                                 │
│  Guardian Mobile:     +91 98765 12345                               │
│  Annual Income:       ₹8,50,000                                     │
└─────────────────────────────────────────────────────────────────────┘
```

### Academic Details Tab
```
┌─────────────────────────────────────────────────────────────────────┐
│  HSC Details (12th Standard)                                        │
│  ────────────────────────────────────────────────────────────────   │
│  Board:               Maharashtra State Board                        │
│  School:              XYZ Junior College, Pune                      │
│  Year of Passing:     2024                                          │
│  Percentage:          92.4%                                         │
│  PCM Percentage:      94.2% (Phy: 95, Chem: 93, Math: 95)         │
│                                                                      │
│  Entrance Exam Details                                              │
│  ────────────────────────────────────────────────────────────────   │
│  Exam Name:           JEE Mains 2024                                │
│  Roll Number:         240987654                                     │
│  Percentile:          98.4                                          │
│  Score:               288/300                                       │
│  Rank:                2,847                                         │
│                                                                      │
│  Merit Calculation                                                   │
│  ────────────────────────────────────────────────────────────────   │
│  Entrance (60%):      172.8                                         │
│  HSC (30%):           27.72                                         │
│  Extra (10%):         8.5                                           │
│  Total Merit Score:   209.02/250                                    │
└─────────────────────────────────────────────────────────────────────┘
```

### Documents Tab
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Document Name          Type        Status      Verified By       Actions               │
│  ──────────────────────────────────────────────────────────────────────────────────────│
│  📄 HSC Marksheet       PDF         ✅ Verified  Ramesh Kumar     [View] [Download]    │
│  📄 School LC           PDF         ✅ Verified  Ramesh Kumar     [View] [Download]    │
│  📄 Aadhar Card         PDF         ✅ Verified  Priya Patel      [View] [Download]    │
│  📄 Caste Certificate   PDF         ⏳ Pending   -                [Verify]             │
│  📄 Income Certificate  PDF         ✅ Verified  Ramesh Kumar     [View] [Download]    │
│  📄 Passport Photo      JPG         ✅ Verified  Auto-OCR         [View] [Download]    │
│  📄 Signature           JPG         ✅ Verified  Auto-OCR         [View] [Download]    │
│  📄 JEE Scorecard       PDF         ✅ Verified  Ramesh Kumar     [View] [Download]    │
│  ──────────────────────────────────────────────────────────────────────────────────────│
│  Total: 8 documents | Verified: 7 | Pending: 1 | Rejected: 0                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Payment Tab
```
┌─────────────────────────────────────────────────────────────────────┐
│  Payment Details                                                     │
│  ────────────────────────────────────────────────────────────────   │
│  Application Fee:     ₹1,500                                        │
│  Payment Status:      Paid ✅                                       │
│  Transaction ID:      RZPAY20240625143052                           │
│  Payment Method:      Credit Card (VISA ****1234)                   │
│  Payment Date:        25/06/2024 14:30:52                           │
│  Gateway:             Razorpay                                       │
│  Receipt:             [Download Receipt]                             │
└─────────────────────────────────────────────────────────────────────┘
```

### Timeline Tab
```
┌─────────────────────────────────────────────────────────────────────┐
│  Application Timeline                                                │
│  ────────────────────────────────────────────────────────────────   │
│  ● 25/06/2024 14:30  Application submitted                          │
│  ● 25/06/2024 14:31  Payment successful (₹1,500)                   │
│  ● 26/06/2024 09:15  Documents assigned to Ramesh Kumar             │
│  ● 26/06/2024 15:45  HSC Marksheet verified                         │
│  ● 26/06/2024 16:20  School LC verified                             │
│  ● 27/06/2024 10:30  Aadhar Card verified                           │
│  ● 28/06/2024 11:00  All documents verified ✅                      │
│  ● 05/07/2024 18:00  Merit List published (Rank: 284)              │
│  ● 10/07/2024 09:00  Round 1 Counseling - Choice filled            │
│  ● 12/07/2024 14:00  Seat Allocated: B.Tech CSE                    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 4. Document Verification Interface

**Route**: `/admission/verification/:documentId`  
**Role Access**: Document Verifiers, Coordinators, Senior Officers

### Split View (Document on Left, Form on Right)
```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  Document Verification - HSC Marksheet                                                   │
│  Application: AD24-001234 | Applicant: Rahul Sharma                                     │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│                                              │                                            │
│  [Document Viewer - PDF]                     │  Verification Form                        │
│                                              │  ─────────────────────────────────────    │
│  ┌────────────────────────────────────────┐ │  OCR Extracted Data:                      │
│  │                                        │ │  Student Name: RAHUL SHARMA                │
│  │  HSC MARKSHEET                         │ │  Seat Number: A123456                     │
│  │  Maharashtra State Board               │ │  Percentage: 92.4%                        │
│  │                                        │ │  Year: 2024                                │
│  │  Name: RAHUL SHARMA                    │ │                                            │
│  │  Seat No: A123456                      │ │  Manual Verification:                     │
│  │  School: XYZ Junior College            │ │  ☑ Name matches application                │
│  │                                        │ │  ☑ Percentage correct                     │
│  │  Physics:     95/100                   │ │  ☑ Year of passing correct                │
│  │  Chemistry:   93/100                   │ │  ☑ Document authentic                     │
│  │  Mathematics: 95/100                   │ │  ☐ Fraud alert                            │
│  │  Total:       92.4%                    │ │                                            │
│  │                                        │ │  Comments:                                 │
│  └────────────────────────────────────────┘ │  [________________________________]        │
│  [Zoom In] [Zoom Out] [Rotate] [Download]  │  [________________________________]        │
│                                              │                                            │
│                                              │  Verification Decision:                    │
│                                              │  ○ Approve                                │
│                                              │  ○ Reject (Reason: ________)              │
│                                              │  ○ Request Re-upload                      │
│                                              │                                            │
│                                              │  [Submit Verification]                    │
├──────────────────────────────────────────────────────────────────────────────────────────┤
│  [← Previous Document]                              [Skip]              [Next Document →] │
└──────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Merit List Generation

**Route**: `/admission/merit-lists/generate`  
**Role Access**: Merit List Managers, Senior Officers

### Merit List Configuration
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Generate Merit List                                                                     │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Academic Year: [2024-2025 ▼]                                                           │
│  Program:       [B.Tech Computer Science ▼]                                             │
│  Round:         [Round 1 ▼]                                                             │
│                                                                                          │
│  Merit Calculation Formula                                                               │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Entrance Exam (JEE):  [60]% (Weight: 0.6)                                              │
│  HSC Percentage:       [30]% (Weight: 0.3)                                              │
│  Extra Credits:        [10]% (Weight: 0.1)                                              │
│                        ───                                                               │
│  Total:                100%                                                              │
│                                                                                          │
│  Filters                                                                                 │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  ☑ Include only verified applications                                                   │
│  ☑ Include only paid applications                                                       │
│  ☐ Exclude rejected applications                                                        │
│  ☑ Apply category-wise quota (OBC: 27%, SC: 15%, ST: 7.5%)                            │
│                                                                                          │
│  Tie-Breaking Rules                                                                      │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  1. Higher entrance exam score                                                           │
│  2. Higher HSC percentage                                                                │
│  3. Date of birth (older candidate preferred)                                           │
│                                                                                          │
│  Preview Statistics                                                                      │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Total Eligible Applications: 3,247                                                      │
│  Verified Applications:       3,189 (98.2%)                                             │
│  Available Seats:             300                                                        │
│  Expected Cutoff:             185.5/250                                                  │
│                                                                                          │
│  [Preview Merit List] [Generate & Publish]                                              │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Merit List Preview
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Merit List Preview - B.Tech CSE (Round 1)                                              │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Rank  App ID      Name               Category  Entrance  HSC    Extra  Total  Status   │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  1     AD24-00123  Aditya Kumar       General   180.0     28.5   10.0   218.5  ✅       │
│  2     AD24-00456  Priya Sharma       General   178.2     29.1   9.8    217.1  ✅       │
│  3     AD24-00789  Rahul Verma        OBC       175.8     28.8   10.0   214.6  ✅       │
│  ...                                                                                     │
│  298   AD24-12345  Sneha Patel        OBC       112.2     27.6   8.5    148.3  ✅       │
│  299   AD24-67890  Rohan Mehta        General   111.8     27.9   8.4    148.1  ✅       │
│  300   AD24-11111  Amit Gupta         SC        110.5     28.2   8.7    147.4  ✅       │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Cutoff Score: 147.4 | Total Selected: 300 (General: 150, OBC: 81, SC: 45, ST: 24)    │
│  [Export PDF] [Export Excel] [Publish Merit List]                                      │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Seat Allocation Matrix

**Route**: `/admission/seat-allocation`  
**Role Access**: Counseling Coordinators, Senior Officers

### Seat Availability Matrix
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Seat Allocation Matrix - Round 2                                                       │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Program              Total  Filled  Vacant  General  OBC   SC   ST   Cutoff  Actions   │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  B.Tech CSE           300    287     13      143/150  78/81 41/45 25/24  147.4  [View] │
│  B.Tech Mechanical    240    228     12      114/120  65/65 35/36 14/19  138.2  [View] │
│  B.Tech Civil         180    165     15      85/90    45/49 25/27 10/14  125.6  [View] │
│  B.Tech Electrical    200    192     8       96/100   54/54 30/30 12/16  132.8  [View] │
│  B.Tech IT            220    215     5       108/110  59/59 33/33 15/18  145.9  [View] │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Total                1140   1087    53      546/570  301/308 164/171 76/91             │
│  Overall Fill Rate: 95.4%                                                               │
│  [Export Report] [Send Vacancy Alerts] [Start Round 3]                                 │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

### Choice Filling Status
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Choice Filling Status (Counseling Round 2)                                             │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Total Eligible Candidates: 1,847                                                       │
│  Choices Filled:            1,623 (87.9%)                                               │
│  Pending:                   224 (12.1%)                                                 │
│  Deadline:                  15/07/2024 23:59                                            │
│                                                                                          │
│  [Send Reminder to Pending Candidates]                                                  │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 7. Communication Center

**Route**: `/admission/communication`  
**Role Access**: Senior Officers, Counseling Coordinators

### Bulk Messaging Interface
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Send Bulk Notification                                                                  │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Channel:  ☑ Email  ☑ SMS  ☐ WhatsApp                                                  │
│                                                                                          │
│  Recipient Group:                                                                        │
│  ○ All Applicants (42,847)                                                              │
│  ○ Verified Applicants (28,157)                                                         │
│  ● Merit List Selected (300)                                                            │
│  ○ Counseling Eligible (1,847)                                                          │
│  ○ Custom Filter                                                                         │
│                                                                                          │
│  Template: [Counseling Reminder ▼]    [Manage Templates]                               │
│                                                                                          │
│  Email Subject: Reminder: Round 2 Counseling - Choice Filling Deadline                  │
│                                                                                          │
│  Message Body:                                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐   │
│  │ Dear {{student_name}},                                                           │   │
│  │                                                                                   │   │
│  │ This is a reminder that Round 2 counseling choice filling will close on         │   │
│  │ {{deadline_date}} at 11:59 PM.                                                  │   │
│  │                                                                                   │   │
│  │ Your Merit Rank: {{rank}}                                                        │   │
│  │ Eligible Programs: {{programs}}                                                  │   │
│  │                                                                                   │   │
│  │ Login to fill your choices: https://admission.institution.edu/counseling        │   │
│  │                                                                                   │   │
│  │ For queries, contact: +91-XXXX-XXXX                                             │   │
│  │                                                                                   │   │
│  │ Best regards,                                                                     │   │
│  │ Admission Office                                                                  │   │
│  └─────────────────────────────────────────────────────────────────────────────────┘   │
│                                                                                          │
│  Preview Recipients: 300 emails, 300 SMS                                                │
│  Estimated Cost: ₹1,800 (SMS) + Free (Email)                                           │
│                                                                                          │
│  Send Schedule:  ● Now  ○ Schedule for: [__/__/____] [__:__]                           │
│                                                                                          │
│  [Preview] [Send Test] [Send to All Recipients]                                        │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 8. Reports Page

**Route**: `/admission/reports`  
**Role Access**: All Admission Admins (filtered by role)

### Report Categories
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Admission Reports                                                                       │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  [Application Reports]  [Verification Reports]  [Merit List Reports]  [Revenue Reports] │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│                                                                                          │
│  Application Statistics                                                                  │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Applications by Program (Bar Chart)                                              │  │
│  │  B.Tech CSE:        8,234 ████████████████████████████                           │  │
│  │  B.Tech Mech:       6,789 ████████████████████                                    │  │
│  │  B.Tech Civil:      4,567 ████████████                                            │  │
│  │  B.Tech Electrical: 5,432 ██████████████                                          │  │
│  │  B.Tech IT:         7,123 ███████████████████                                     │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  Document Verification Performance                                                       │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Verifier Name       Assigned  Verified  Rejected  Avg Time  Accuracy             │  │
│  │  ─────────────────────────────────────────────────────────────────────────────── │  │
│  │  Ramesh Kumar        1,234     1,198     36        12 min    97.1%               │  │
│  │  Priya Patel         1,089     1,065     24        15 min    97.8%               │  │
│  │  Suresh Nair         945        920       25        14 min    97.4%               │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  Revenue Report                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────────────────┐  │
│  │  Total Revenue:        ₹11.8 Crores                                               │  │
│  │  Pending Payments:     ₹28 Lakhs (342 applications)                               │  │
│  │  Refunds Processed:    ₹8.5 Lakhs (67 applications)                               │  │
│  │  By Payment Method:    Credit/Debit Card: 65%, Net Banking: 28%, UPI: 7%        │  │
│  └──────────────────────────────────────────────────────────────────────────────────┘  │
│                                                                                          │
│  [Export All Reports] [Schedule Email Report]                                          │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 9. Settings - Admission Cycle Configuration

**Route**: `/admission/settings/cycle`  
**Role Access**: Senior Officers Only

### Admission Cycle Settings
```
┌─────────────────────────────────────────────────────────────────────────────────────────┐
│  Admission Cycle Configuration                                                           │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Academic Year:             [2024-2025 ▼]                                               │
│  Admission Start Date:      [01/06/2024]                                                │
│  Admission End Date:        [31/08/2024]                                                │
│                                                                                          │
│  Application Fees                                                                        │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  General Category:          ₹ [1,500]                                                   │
│  OBC Category:              ₹ [1,000]                                                   │
│  SC/ST Category:            ₹ [500]                                                     │
│                                                                                          │
│  Programs & Seats                                                                        │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Program                    Total Seats  General  OBC   SC   ST                         │
│  B.Tech CSE                 [300]        [150]    [81]  [45] [24]                       │
│  B.Tech Mechanical          [240]        [120]    [65]  [36] [19]                       │
│  B.Tech Civil               [180]        [90]     [49]  [27] [14]                       │
│                                                                                          │
│  Merit Calculation Formula                                                               │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Entrance Exam:             [60]%                                                        │
│  HSC Percentage:            [30]%                                                        │
│  Extra Credits:             [10]%                                                        │
│                                                                                          │
│  Counseling Rounds                                                                       │
│  ─────────────────────────────────────────────────────────────────────────────────────  │
│  Round 1: [10/07/2024] - [15/07/2024]                                                  │
│  Round 2: [20/07/2024] - [25/07/2024]                                                  │
│  Round 3: [01/08/2024] - [05/08/2024]                                                  │
│                                                                                          │
│  [Save Configuration]                                                                    │
└─────────────────────────────────────────────────────────────────────────────────────────┘
```

---

**UI Framework**: Next.js 15 + React + Tailwind CSS  
**Charts**: Recharts / Chart.js  
**Tables**: TanStack Table (React Table v8)  
**Forms**: React Hook Form + Zod validation  
**Notifications**: React Hot Toast
