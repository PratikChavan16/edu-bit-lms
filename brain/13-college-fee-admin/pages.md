# College Fee Admin Portal - Pages & UI/UX Specifications

**Version**: 1.0.0  
**Last Updated**: 2024  
**Portal**: College Fee Admin (#13)  
**Port**: 3013  
**Annual Revenue**: ₹60 Crores/year

---

## Table of Contents
1. [Overview](#overview)
2. [Dashboard](#dashboard)
3. [Fee Structure Management](#fee-structure-management)
4. [Payment Gateway](#payment-gateway)
5. [Cash Counter](#cash-counter)
6. [Receipt Management](#receipt-management)
7. [Installment Manager](#installment-manager)
8. [Defaulter Management](#defaulter-management)
9. [Refund Processing](#refund-processing)
10. [Scholarship Portal](#scholarship-portal)
11. [Reports & Analytics](#reports--analytics)
12. [Settings](#settings)

---

## Overview

### Design System
- **Framework**: Next.js 15 + TailwindCSS 3.4
- **Component Library**: Shadcn/UI + Radix UI primitives
- **Color Palette**: 
  - Primary: Indigo 600 (₹60 Cr revenue)
  - Success: Green 500 (payments)
  - Warning: Yellow 500 (defaulters)
  - Error: Red 500 (refunds)
- **Typography**: Inter (headings), Open Sans (body)
- **Responsive**: Mobile-first, tablet, desktop breakpoints

### Navigation Structure
```
Top Navbar:
- College Logo | College Fee Admin | Profile Dropdown

Sidebar Menu:
├── Dashboard
├── Fee Structure
│   ├── Components
│   └── Programs
├── Payments
│   ├── Online Gateway
│   ├── Cash Counter
│   └── Cheque/DD
├── Receipts
│   ├── View All
│   └── Verification
├── Installments
│   ├── Plans
│   └── Student Schedules
├── Defaulters
│   ├── List
│   └── Reminders
├── Refunds
│   ├── Requests
│   └── Approvals
├── Scholarships
│   ├── Applications
│   └── Approvals
├── Reports
│   ├── Daily Collection
│   ├── Monthly Revenue
│   └── Payment Analytics
└── Settings
```

---

## Dashboard

### Purpose
Real-time financial overview with ₹60 Cr annual tracking.

### Layout
```
+----------------------------------------------------------+
|  College Fee Admin Dashboard           [Date Picker]     |
+----------------------------------------------------------+
|                                                           |
|  [Card: Today's Collection]  [Card: Pending Payments]    |
|  ₹12.5 Lakhs                 ₹45.2 Lakhs                 |
|  +18% vs yesterday           320 students                |
|                                                           |
|  [Card: Active Defaulters]   [Card: Pending Refunds]     |
|  145 students                18 requests                 |
|  ₹15.8 Lakhs overdue         ₹3.2 Lakhs                  |
+----------------------------------------------------------+
|                                                           |
|  Payment Mode Distribution (Pie Chart)                   |
|  - Online: 65% (₹39 Cr)                                  |
|  - Cash: 20% (₹12 Cr)                                    |
|  - Cheque: 10% (₹6 Cr)                                   |
|  - Others: 5% (₹3 Cr)                                    |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  Recent Transactions (Last 10)                           |
|  +-----------------------------------------------------+  |
|  | Student    | Amount   | Mode   | Time    | Receipt|  |
|  +-----------------------------------------------------+  |
|  | Rahul Sharma| ₹75,000 | Online | 10:30 AM| RCP-001|  |
|  | Priya Patel | ₹50,000 | Cash   | 10:25 AM| RCP-002|  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  Monthly Revenue Trend (Line Chart)                      |
|  Jan: ₹4 Cr | Feb: ₹4.5 Cr | Mar: ₹5.2 Cr | Apr: ₹4.8 Cr|
|                                                           |
+----------------------------------------------------------+
```

### Key Features
- **Real-time Updates**: WebSocket connection for live transaction updates
- **Quick Actions**: 
  - "Collect Payment" button
  - "View Defaulters" button
  - "Generate Report" button
- **Filters**: Date range, payment mode, program-wise
- **Export**: Excel/PDF export for all widgets

---

## Fee Structure Management

### Purpose
Configure and manage fee components and program-wise structures.

### Page: Fee Components
```
+----------------------------------------------------------+
|  Fee Components Management              [+ Add Component]|
+----------------------------------------------------------+
|                                                           |
|  Search: [____________] Filter: [All | Mandatory | Optional]|
|                                                           |
|  +-----------------------------------------------------+  |
|  | Component Name    | Amount    | GST | Type | Actions|  |
|  +-----------------------------------------------------+  |
|  | Tuition Fee       | ₹1,20,000 | 0%  | Mandatory  |   |  |
|  |                   |           |     | [Edit][Delete] |  |
|  +-----------------------------------------------------+  |
|  | Library Fee       | ₹10,000   | 18% | Mandatory  |   |  |
|  | Development Fee   | ₹25,000   | 0%  | Mandatory  |   |  |
|  | Sports Fee        | ₹5,000    | 18% | Optional   |   |  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
```

### Page: Program-wise Fee Structure
```
+----------------------------------------------------------+
|  Program Fee Structure                [Academic Year: 2024]|
+----------------------------------------------------------+
|                                                           |
|  Program: [B.Tech Computer Science ▼]  Year: [1st ▼]     |
|                                                           |
|  Assigned Components:                                     |
|  +-----------------------------------------------------+  |
|  | Component         | Base Amount | Customized Amount|  |
|  +-----------------------------------------------------+  |
|  | Tuition Fee       | ₹1,20,000   | ₹1,20,000        |  |
|  | Library Fee       | ₹10,000     | ₹10,000          |  |
|  | Development Fee   | ₹25,000     | ₹25,000          |  |
|  | Sports Fee        | ₹5,000      | ₹5,000           |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  Total Fee: ₹1,60,000                                     |
|                                                           |
|  [Save Structure]  [Preview Student View]                |
|                                                           |
+----------------------------------------------------------+
```

### Validation Rules
- Tuition fee must be ≥ ₹50,000
- GST percentage must be 0%, 5%, 12%, 18%, or 28%
- Mandatory components cannot be deleted if assigned to active programs

---

## Payment Gateway

### Purpose
Online payment collection via Razorpay (₹39 Cr/year).

### Page: Initiate Payment
```
+----------------------------------------------------------+
|  Online Payment Gateway                                   |
+----------------------------------------------------------+
|                                                           |
|  Step 1: Student Selection                               |
|  Roll Number: [__________] [Search]                      |
|                                                           |
|  Student Details:                                         |
|  Name: Rahul Sharma                                       |
|  Program: B.Tech Computer Science - 1st Year             |
|  Total Fee: ₹1,60,000                                     |
|  Paid: ₹85,000                                            |
|  Pending: ₹75,000                                         |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  Step 2: Payment Details                                 |
|  Payment For: ( ) Full Pending  (•) Installment          |
|  Installment: [2nd Installment - Due: 15 Jan 2024 ▼]     |
|  Amount: ₹75,000                                          |
|                                                           |
|  Gateway Charges: ₹1,500 (2%)                            |
|  Total Payable: ₹76,500                                   |
|                                                           |
|  [Generate Payment Link]  [Send to Student via SMS/Email]|
|                                                           |
+----------------------------------------------------------+
```

### Payment Flow
1. **Student Selection** → Search by roll number/name
2. **Amount Selection** → Full/Installment
3. **Payment Link Generation** → Razorpay order creation
4. **Payment Page** → Redirect to Razorpay hosted checkout
5. **Callback Handling** → Webhook verification
6. **Receipt Generation** → Auto-generate PDF receipt
7. **Notification** → SMS + Email to student/parent

### Supported Payment Modes
- UPI (BHIM, PhonePe, Google Pay)
- Credit/Debit Cards (Visa, Mastercard, RuPay)
- Net Banking (50+ banks)
- Wallets (Paytm, Amazon Pay)

---

## Cash Counter

### Purpose
Record cash/cheque payments at college counter.

### Page: Cash Payment Entry
```
+----------------------------------------------------------+
|  Cash Counter - Payment Entry            Counter #3      |
+----------------------------------------------------------+
|                                                           |
|  Student Details:                                         |
|  Roll Number: [__________] [Search]                      |
|  Name: Priya Patel                                        |
|  Pending Amount: ₹50,000                                  |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  Payment Details:                                         |
|  Amount Received: [₹ __________]                          |
|  Payment Mode: (•) Cash  ( ) Cheque  ( ) DD              |
|                                                           |
|  Cash Denominations:                                      |
|  ₹2000 × [__] = ₹ 0                                       |
|  ₹500  × [__] = ₹ 0                                       |
|  ₹200  × [__] = ₹ 0                                       |
|  ₹100  × [__] = ₹ 0                                       |
|  ₹50   × [__] = ₹ 0                                       |
|  ₹20   × [__] = ₹ 0                                       |
|  ₹10   × [__] = ₹ 0                                       |
|  Total: ₹ 0                                               |
|                                                           |
|  [Record Payment]  [Print Receipt]                       |
|                                                           |
+----------------------------------------------------------+
```

### Page: Cheque/DD Entry
```
+----------------------------------------------------------+
|  Cheque/DD Payment Entry                                  |
+----------------------------------------------------------+
|                                                           |
|  Student: Amit Kumar | Pending: ₹1,20,000                 |
|                                                           |
|  Cheque Details:                                          |
|  Bank Name: [___________________]                         |
|  Branch: [___________________]                            |
|  Cheque Number: [___________________]                     |
|  Cheque Date: [DD/MM/YYYY]                                |
|  Amount: [₹ __________]                                   |
|                                                           |
|  Cheque Photo: [Upload Image] (Max 5 MB)                 |
|                                                           |
|  [Record Payment]  [Print Acknowledgment]                |
|                                                           |
+----------------------------------------------------------+
```

### Validation Rules
- Cash denominations total must match entered amount
- Cheque date cannot be future date beyond 3 months
- Cheque photo mandatory for amounts > ₹50,000

---

## Receipt Management

### Purpose
View, verify, and reissue receipts (30,000+ receipts/year).

### Page: Receipt Viewer
```
+----------------------------------------------------------+
|  Receipt Management                 [+ Generate Duplicate]|
+----------------------------------------------------------+
|                                                           |
|  Search: [Receipt Number / Student Name]  [Search]       |
|  Filters: Date Range [________] to [________]            |
|           Payment Mode: [All ▼]                          |
|                                                           |
|  +-----------------------------------------------------+  |
|  | Receipt # | Student | Amount | Date | Mode | Actions|  |
|  +-----------------------------------------------------+  |
|  | RCP-2024-001| Rahul | ₹75,000| 10 Jan| Online |[View]|  |
|  | RCP-2024-002| Priya | ₹50,000| 10 Jan| Cash   |[View]|  |
|  | RCP-2024-003| Amit  |₹1,20,000| 10 Jan| Cheque |[View]|  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
```

### Receipt Format (PDF)
```
╔════════════════════════════════════════════════════════╗
║                 [College Logo]                         ║
║         ST. XAVIER'S COLLEGE OF ENGINEERING            ║
║              Mumbai, Maharashtra 400001                ║
╠════════════════════════════════════════════════════════╣
║                   FEE RECEIPT                          ║
╠════════════════════════════════════════════════════════╣
║ Receipt No: RCP-2024-001234        Date: 10 Jan 2024  ║
║ Student Name: Rahul Sharma         Roll: 21CS001       ║
║ Program: B.Tech Computer Science   Year: 1st          ║
╠════════════════════════════════════════════════════════╣
║ Payment Details:                                       ║
║ ┌────────────────────────────────────────────────────┐ ║
║ │ Component         │ Amount                         │ ║
║ ├────────────────────────────────────────────────────┤ ║
║ │ Tuition Fee       │ ₹1,20,000                      │ ║
║ │ Library Fee       │ ₹10,000                        │ ║
║ │ Development Fee   │ ₹25,000                        │ ║
║ │ Sports Fee        │ ₹5,000                         │ ║
║ ├────────────────────────────────────────────────────┤ ║
║ │ Total             │ ₹1,60,000                      │ ║
║ │ Scholarship       │ -₹10,000                       │ ║
║ │ Paid Previously   │ -₹75,000                       │ ║
║ │ Amount Paid Now   │ ₹75,000                        │ ║
║ └────────────────────────────────────────────────────┘ ║
╠════════════════════════════════════════════════════════╣
║ Payment Mode: Online (UPI)                             ║
║ Transaction ID: pay_ABC123XYZ789                       ║
║ Received By: Mr. Suresh Kumar (Fee Admin)             ║
╠════════════════════════════════════════════════════════╣
║              [QR Code for Verification]                ║
║         Scan to verify receipt authenticity            ║
╠════════════════════════════════════════════════════════╣
║ This is a computer-generated receipt.                  ║
║ For queries: fees@stxaviers.edu.in                    ║
╚════════════════════════════════════════════════════════╝
```

### Public Verification Page
```
+----------------------------------------------------------+
|  Receipt Verification (Public - No Login Required)       |
+----------------------------------------------------------+
|                                                           |
|  Enter Receipt Number: [RCP-2024-______]  [Verify]       |
|                                                           |
|  OR                                                       |
|                                                           |
|  [Scan QR Code from Receipt]                             |
|                                                           |
+----------------------------------------------------------+
|                                                           |
|  Verification Result:                                     |
|  ✓ Valid Receipt                                          |
|                                                           |
|  Student: Rahul Sharma                                    |
|  Amount: ₹75,000                                          |
|  Date: 10 January 2024                                    |
|  Mode: Online (UPI)                                       |
|                                                           |
+----------------------------------------------------------+
```

---

## Installment Manager

### Purpose
Configure installment plans and track student-wise schedules.

### Page: Installment Plans
```
+----------------------------------------------------------+
|  Installment Plans                    [+ Create New Plan] |
+----------------------------------------------------------+
|                                                           |
|  Active Plans:                                            |
|  +-----------------------------------------------------+  |
|  | Plan Name                  | Students | Actions    |  |
|  +-----------------------------------------------------+  |
|  | Standard 3-Installment     | 2,850    | [View][Edit]| |
|  | Early Bird 2-Installment   | 650      | [View][Edit]| |
|  | Scholarship 4-Installment  | 350      | [View][Edit]| |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
```

### Page: Create Installment Plan
```
+----------------------------------------------------------+
|  Create Installment Plan                                  |
+----------------------------------------------------------+
|                                                           |
|  Plan Name: [_______________________]                     |
|  Academic Year: [2024-25 ▼]                               |
|                                                           |
|  Installments:                                            |
|  +-----------------------------------------------------+  |
|  | # | Percentage | Due Date   | Amount (Example)     |  |
|  +-----------------------------------------------------+  |
|  | 1 | 40%        | 15 Jun 2024| ₹64,000              |  |
|  | 2 | 40%        | 15 Oct 2024| ₹64,000              |  |
|  | 3 | 20%        | 15 Jan 2025| ₹32,000              |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  Total: 100%  |  Example Fee: ₹1,60,000                   |
|                                                           |
|  Late Fee Policy:                                         |
|  After 7 days: ₹500                                       |
|  After 15 days: ₹1,000                                    |
|  After 30 days: ₹2,000                                    |
|                                                           |
|  [Save Plan]  [Preview]                                   |
|                                                           |
+----------------------------------------------------------+
```

### Page: Student Installment Schedule
```
+----------------------------------------------------------+
|  Student Installment Schedule                             |
+----------------------------------------------------------+
|                                                           |
|  Student: Rahul Sharma | Roll: 21CS001 | Total: ₹1,60,000|
|  Plan: Standard 3-Installment                             |
|                                                           |
|  +-----------------------------------------------------+  |
|  | # | Due Date   | Amount  | Paid | Pending | Status |  |
|  +-----------------------------------------------------+  |
|  | 1 | 15 Jun 2024| ₹64,000 |₹64,000| ₹0    | ✓ Paid  |  |
|  | 2 | 15 Oct 2024| ₹64,000 |₹21,000|₹43,000| Partial|  |
|  | 3 | 15 Jan 2025| ₹32,000 | ₹0    |₹32,000| Pending|  |
|  +-----------------------------------------------------+  |
|                                                           |
|  [Make Payment]  [View Payment History]                  |
|                                                           |
+----------------------------------------------------------+
```

---

## Defaulter Management

### Purpose
Track overdue payments and send automated reminders (145 defaulters).

### Page: Defaulter List
```
+----------------------------------------------------------+
|  Defaulter Management                [Send Bulk Reminders]|
+----------------------------------------------------------+
|                                                           |
|  Aging Buckets:                                           |
|  [0-30 Days: 45]  [31-60 Days: 50]  [61-90 Days: 30]     |
|  [>90 Days: 20]                                           |
|                                                           |
|  Filters: Program [All ▼]  Year [All ▼]  Amount [All ▼]  |
|                                                           |
|  +-----------------------------------------------------+  |
|  | ☐| Student | Roll | Pending | Overdue | Actions    |  |
|  +-----------------------------------------------------+  |
|  | ☐| Rahul   |21CS001|₹75,000 | 15 days |[Remind][Pay]| |
|  | ☐| Priya   |21CS002|₹50,000 | 45 days |[Remind][Pay]| |
|  | ☐| Amit    |21CS003|₹1,20,000|120 days|[Remind][Pay]| |
|  +-----------------------------------------------------+  |
|                                                           |
|  Selected: 0 students | Total Overdue: ₹15.8 Lakhs        |
|                                                           |
|  [Select All]  [Send SMS]  [Send Email]  [Block Hall Ticket]|
|                                                           |
+----------------------------------------------------------+
```

### Reminder Templates
```
Template 1: 7 Days Before Due Date
───────────────────────────────────
Dear Rahul Sharma,

Your 2nd installment of ₹64,000 is due on 15 Oct 2024.
Please pay before the due date to avoid late fee.

Pay online: https://fees.stxaviers.edu.in/pay/21CS001

- St. Xavier's Fee Department

Template 2: 3 Days After Due Date
───────────────────────────────────
Dear Rahul Sharma,

Your 2nd installment of ₹64,000 was due on 15 Oct 2024.
Outstanding amount: ₹43,000 (including ₹500 late fee)

Please pay immediately to avoid hall ticket block.

Pay online: https://fees.stxaviers.edu.in/pay/21CS001

- St. Xavier's Fee Department
```

---

## Refund Processing

### Purpose
Handle dropout refunds, overpayments, and scholarship adjustments (500+ refunds/year).

### Page: Refund Requests
```
+----------------------------------------------------------+
|  Refund Processing                   [+ New Refund Request]|
+----------------------------------------------------------+
|                                                           |
|  Status Filter: [Pending ▼]  Type: [All ▼]               |
|                                                           |
|  +-----------------------------------------------------+  |
|  | ID | Student | Type | Expected | Status | Actions  |  |
|  +-----------------------------------------------------+  |
|  | 101| Rahul   |Dropout|₹80,000  |Pending|[Review]  |  |
|  | 102| Priya   |Overpay|₹5,000   |Approved|[Disburse]|  |
|  | 103| Amit    |Scholar|₹10,000  |Rejected|[View]    |  |
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
```

### Page: Refund Review
```
+----------------------------------------------------------+
|  Refund Request Review - ID: 101                          |
+----------------------------------------------------------+
|                                                           |
|  Student Details:                                         |
|  Name: Rahul Sharma                                       |
|  Roll: 21CS001                                            |
|  Program: B.Tech Computer Science - 1st Year             |
|  Admission Date: 15 Jun 2024                              |
|  Dropout Date: 10 Oct 2024                                |
|                                                           |
|  Fee Details:                                             |
|  Total Fee Paid: ₹1,20,000                                |
|  Tuition Fee (Non-refundable): ₹40,000                    |
|  Refundable Components: ₹80,000                           |
|                                                           |
|  Refund Calculation:                                      |
|  Refundable Amount: ₹80,000                               |
|  Processing Charges (5%): -₹4,000                         |
|  Net Refund: ₹76,000                                      |
|                                                           |
|  Bank Details:                                            |
|  Account Number: 1234567890                               |
|  IFSC Code: SBIN0001234                                   |
|  Account Holder: Rahul Sharma                             |
|                                                           |
|  Remarks: [________________________________]              |
|                                                           |
|  [Approve ₹76,000]  [Reject]  [Request More Info]        |
|                                                           |
+----------------------------------------------------------+
```

---

## Scholarship Portal

### Purpose
Manage scholarship applications and fee adjustments (₹1.2 Cr/year).

### Page: Scholarship Applications
```
+----------------------------------------------------------+
|  Scholarship Management           [+ New Application]     |
+----------------------------------------------------------+
|                                                           |
|  Status: [Pending Review ▼]  Type: [All ▼]               |
|                                                           |
|  +-----------------------------------------------------+  |
|  | ID | Student | Type | Year | Amount | Status | Actions|
|  +-----------------------------------------------------+  |
|  | 201| Rahul   |Merit |2024-25|₹20,000|Pending|[Review]|
|  | 202| Priya   |Sports|2024-25|₹15,000|Approved|[View] |
|  | 203| Amit    |Govt  |2024-25|₹50,000|Pending|[Review]|
|  +-----------------------------------------------------+  |
|                                                           |
+----------------------------------------------------------+
```

### Scholarship Types
- **Merit Scholarship**: Top 5% students, ₹10,000-₹50,000
- **Financial Aid**: Based on family income, up to 100% waiver
- **Sports Quota**: National/State level players, ₹10,000-₹30,000
- **Government Schemes**: EBC/OBC/SC/ST, as per government norms

---

## Reports & Analytics

### Purpose
Financial insights and compliance reporting.

### Page: Daily Collection Report
```
+----------------------------------------------------------+
|  Daily Collection Report          Date: [10 Jan 2024 ▼]  |
+----------------------------------------------------------+
|                                                           |
|  Summary:                                                 |
|  Total Collection: ₹12.5 Lakhs                            |
|  Transactions: 28                                         |
|                                                           |
|  Payment Mode Breakdown:                                  |
|  +-----------------------------------------------------+  |
|  | Mode   | Count | Amount    | Percentage             |  |
|  +-----------------------------------------------------+  |
|  | Online | 18    | ₹8.5 Lakhs| 68%                    |  |
|  | Cash   | 7     | ₹2.8 Lakhs| 22%                    |  |
|  | Cheque | 3     | ₹1.2 Lakhs| 10%                    |  |
|  +-----------------------------------------------------+  |
|                                                           |
|  Program-wise Collection:                                 |
|  B.Tech Computer Science: ₹4.5 Lakhs (36%)                |
|  B.Tech Mechanical: ₹3.2 Lakhs (26%)                      |
|  MBA: ₹2.8 Lakhs (22%)                                    |
|  Other: ₹2.0 Lakhs (16%)                                  |
|                                                           |
|  [Export Excel]  [Export PDF]  [Email Report]            |
|                                                           |
+----------------------------------------------------------+
```

### Page: Monthly Revenue Report
```
+----------------------------------------------------------+
|  Monthly Revenue Report           [October 2024 ▼]       |
+----------------------------------------------------------+
|                                                           |
|  Total Revenue: ₹5.2 Crores                               |
|  Target: ₹5.0 Crores  |  Achievement: 104%                |
|                                                           |
|  Revenue Trend (Bar Chart):                               |
|  Apr  May  Jun  Jul  Aug  Sep  Oct  Nov  Dec  Jan        |
|  ███  ███  ███  ███  ███  ███  ███  ▒▒▒  ▒▒▒  ▒▒▒        |
|  4.0  4.2  6.5  4.5  4.8  5.0  5.2  -    -    -          |
|                                                           |
|  Year-wise Collection:                                    |
|  1st Year: ₹2.1 Cr (40%)                                  |
|  2nd Year: ₹1.6 Cr (31%)                                  |
|  3rd Year: ₹1.0 Cr (19%)                                  |
|  4th Year: ₹0.5 Cr (10%)                                  |
|                                                           |
|  Outstanding: ₹45.2 Lakhs (8.7% of total)                 |
|                                                           |
|  [Download Report]  [Schedule Auto-Email]                |
|                                                           |
+----------------------------------------------------------+
```

---

## Settings

### Purpose
Portal configuration and user management.

### Page: Settings
```
+----------------------------------------------------------+
|  College Fee Admin Settings                               |
+----------------------------------------------------------+
|                                                           |
|  Tabs: [General] [Payment Gateway] [Receipts] [Notifications]|
|                                                           |
|  General Settings:                                        |
|  College Name: [St. Xavier's College of Engineering]      |
|  Academic Year: [2024-25 ▼]                               |
|  Late Fee After: [7 days]                                 |
|  Late Fee Amount: [₹500]                                  |
|                                                           |
|  Payment Gateway Settings:                                |
|  Primary Gateway: [Razorpay ▼]                            |
|  API Key: [rzp_live_***************]  [Update]           |
|  Backup Gateway: [PayU ▼]                                 |
|  Gateway Charges: [2% ▼]                                  |
|                                                           |
|  Receipt Settings:                                        |
|  Receipt Prefix: [RCP-2024-]                              |
|  Receipt Footer: [For queries: fees@stxaviers.edu.in]    |
|  Digital Signature: [Enable ☑]                            |
|                                                           |
|  Notification Settings:                                   |
|  SMS Gateway: [MSG91 ▼]                                   |
|  Email Service: [AWS SES ▼]                               |
|  Auto-Reminders: [Enable ☑]                               |
|  Reminder Schedule:                                       |
|    - 7 days before due date                               |
|    - On due date                                          |
|    - 3 days after due date                                |
|    - 7 days after due date                                |
|                                                           |
|  [Save Settings]                                          |
|                                                           |
+----------------------------------------------------------+
```

---

## Responsive Design Notes

### Mobile View (320px - 768px)
- Collapsible sidebar menu
- Stacked cards on Dashboard
- Simplified table views (show essential columns only)
- Swipe gestures for actions

### Tablet View (768px - 1024px)
- Partial sidebar (icons only)
- 2-column card layout
- Full table views

### Desktop View (>1024px)
- Full sidebar
- 3-4 column card layouts
- Multi-panel views (split-screen for review flows)

---

## Accessibility (WCAG 2.1 AA)
- **Keyboard Navigation**: Full tab support
- **Screen Reader**: ARIA labels on all interactive elements
- **Color Contrast**: Minimum 4.5:1 ratio
- **Focus Indicators**: Visible focus states
- **Alternative Text**: All images/charts have alt text

---

## Performance Targets
- **First Contentful Paint**: < 1.5s
- **Time to Interactive**: < 3s
- **Lighthouse Score**: > 90
- **Bundle Size**: < 500 KB (gzipped)

---

**End of Pages Specification**
