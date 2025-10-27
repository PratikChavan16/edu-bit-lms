# Super Accountant Portal - Pages & UI Wireframes

**Portal:** Super Accountant (Global Financial Controller)  
**Port:** 3011  
**Framework:** Next.js 15 + React 18 + TailwindCSS  
**Last Updated:** October 25, 2025

---

## Table of Contents

1. [Page Overview](#page-overview)
2. [P1: Dashboard (Financial Overview)](#p1-dashboard-financial-overview)
3. [P2: Payroll Management](#p2-payroll-management)
4. [P3: Expense Management](#p3-expense-management)
5. [P4: Budget Management](#p4-budget-management)
6. [P5: Vendor Management](#p5-vendor-management)
7. [P6: Bank Reconciliation](#p6-bank-reconciliation)
8. [P7: Financial Reports](#p7-financial-reports)
9. [P8: Audit Trail](#p8-audit-trail)
10. [P9: Settings & Configuration](#p9-settings--configuration)

---

## Page Overview

### Navigation Structure

```
Super Accountant Portal (3011)
│
├─ 📊 Dashboard
│   └─ Financial overview, pending approvals, alerts
│
├─ 💰 Payroll
│   ├─ Payroll List
│   ├─ Process Payroll
│   ├─ Payslips
│   └─ Salary Structures
│
├─ 💳 Expenses
│   ├─ Pending Approvals (Badge: 127)
│   ├─ All Expenses
│   ├─ Create Expense
│   └─ Expense Reports
│
├─ 📊 Budgets
│   ├─ Budget Allocations
│   ├─ Budget Utilization
│   ├─ Budget Revisions
│   └─ Alerts
│
├─ 🏢 Vendors
│   ├─ Vendor List
│   ├─ Add Vendor
│   ├─ Vendor Payments
│   └─ Vendor Analytics
│
├─ 🏦 Bank Reconciliation
│   ├─ Import Statements
│   ├─ Match Transactions
│   └─ Reconciliation Reports
│
├─ 📈 Reports
│   ├─ P&L Statement
│   ├─ Balance Sheet
│   ├─ Cash Flow
│   ├─ Budget vs Actual
│   └─ Tax Reports
│
├─ 🔍 Audit Trail
│   └─ Transaction history, approval logs
│
└─ ⚙️ Settings
    ├─ Profile
    ├─ College Accountants
    └─ System Configuration
```

---

## P1: Dashboard (Financial Overview)

### Purpose
Single-pane financial health snapshot across all 15 colleges with real-time updates and actionable insights.

### Layout (Wireframe)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏦 Super Accountant Portal          [🔔 12] [👤 Rajesh Sharma ▼] [🚪 Logout] │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dashboard | 💰 Payroll | 💳 Expenses | 📊 Budgets | 🏢 Vendors | ...     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  📊 Financial Dashboard                          🔄 Last updated: 2 min ago │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌───────────────┬───────────────┬───────────────┬───────────────────────┐ │
│  │ 💰 Total      │ 💸 Total      │ 💵 Net        │ 📊 Budget            │ │
│  │ Revenue       │ Expenses      │ Cash Flow     │ Utilization          │ │
│  │               │               │               │                       │ │
│  │ ₹12.5 Cr      │ ₹8.2 Cr       │ +₹4.3 Cr      │ 87%                   │ │
│  │ ▲ +8% MTD     │ ▼ -3% MTD     │ +₹50L vs Sep  │ 🟡 Caution           │ │
│  └───────────────┴───────────────┴───────────────┴───────────────────────┘ │
│                                                                              │
│  ┌─────────────────────────────────────┬───────────────────────────────────┐│
│  │ 🔔 Pending Approvals                │ ⚠️ Critical Alerts                ││
│  │ ─────────────────────────────────── │ ───────────────────────────────── ││
│  │                                     │                                   ││
│  │ 💳 Expense Requests: 127            │ 🔴 Budget Exhausted:              ││
│  │    • >₹50,000: 23 items             │    • CS Dept (ABC Engg): 102%    ││
│  │    • ₹10K-50K: 104 items            │    • IT Dept (XYZ College): 98%  ││
│  │    [View All →]                     │                                   ││
│  │                                     │ 🟡 Budget High Utilization:       ││
│  │ 📊 Budget Revisions: 5              │    • 8 departments at 85-95%     ││
│  │    • Engineering: ₹2Cr increase     │    [View Details →]               ││
│  │    • Medicine: ₹1.5Cr reallocation │                                   ││
│  │    [Review →]                       │ ⏰ Upcoming Deadlines:            ││
│  │                                     │    • TDS Return: 7 days           ││
│  │ 🏢 Vendor Payments: 18              │    • GST Filing: 5 days           ││
│  │    • Total: ₹45,00,000              │    • Payroll: Tomorrow            ││
│  │    • Overdue: 3 vendors             │    [View Calendar →]              ││
│  │    [Process →]                      │                                   ││
│  └─────────────────────────────────────┴───────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ 📈 Monthly Expense Trends (Last 12 Months)                              ││
│  │ ──────────────────────────────────────────────────────────────────────  ││
│  │                                                                          ││
│  │   ₹10Cr ┤                                                        ╭──●   ││
│  │         │                                                    ●───╯      ││
│  │    ₹8Cr ┤                                      ╭───●───●───●           ││
│  │         │                          ●───●───●───╯                        ││
│  │    ₹6Cr ┤              ●───●───●───╯                                   ││
│  │         │  ●───●───●───╯                                                ││
│  │    ₹4Cr ┼──────────────────────────────────────────────────────────    ││
│  │         Nov Dec Jan Feb Mar Apr May Jun Jul Aug Sep Oct                ││
│  │                                                                          ││
│  │   [📊 Operational] [💻 Capital] [👥 Payroll] [📚 Academic]             ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────┬────────────────────────────────────────┐│
│  │ 🏦 Top 5 Colleges by Expense    │ 🔝 Recent Activities                  ││
│  │ ───────────────────────────────  │ ────────────────────────────────────  ││
│  │                                 │                                        ││
│  │ 1. ABC Engineering  ₹2.5Cr (31%)│ • Expense #EXP-2847 approved          ││
│  │    ████████████████░░            │   ₹75,000 • Lab Equipment • 5 min ago││
│  │                                 │                                        ││
│  │ 2. XYZ Medical      ₹2.1Cr (26%)│ • Budget revised for CS Dept          ││
│  │    █████████████░░░              │   +₹50,00,000 • 12 min ago           ││
│  │                                 │                                        ││
│  │ 3. LMN Arts         ₹1.8Cr (22%)│ • Payroll processed for Oct           ││
│  │    ████████████░░░░              │   500 employees • 1 hour ago         ││
│  │                                 │                                        ││
│  │ 4. PQR Business     ₹1.2Cr (15%)│ • Vendor payment initiated            ││
│  │    █████████░░░░░░░              │   XYZ Suppliers • ₹2,50,000          ││
│  │                                 │   • 2 hours ago                        ││
│  │ 5. STU Science      ₹0.5Cr (6%) │                                        ││
│  │    ████░░░░░░░░░░░░              │ • Bank reconciliation completed       ││
│  │                                 │   ICICI Main A/c • 3 hours ago        ││
│  └─────────────────────────────────┴────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Components

**1. Stats Cards (4 cards)**
- Total Revenue: ₹12.5 Cr (MTD), trend indicator ▲ +8%
- Total Expenses: ₹8.2 Cr (MTD), trend indicator ▼ -3%
- Net Cash Flow: +₹4.3 Cr, comparison with previous month
- Budget Utilization: 87%, color-coded status (🟢 <70%, 🟡 70-85%, 🔴 >85%)

**2. Pending Approvals Widget**
- Real-time count with badges
- Categorized by value range
- Quick action buttons
- Auto-refresh every 30 seconds

**3. Critical Alerts Widget**
- Budget exhausted/high utilization warnings
- Compliance deadlines
- Payment overdue alerts
- Color-coded severity (🔴 Critical, 🟡 Warning, 🟢 Info)

**4. Expense Trends Chart**
- Line chart showing 12-month trend
- Category breakdown (operational, capital, payroll, academic)
- Interactive tooltips on hover
- Export to Excel/PDF

**5. College-wise Breakdown**
- Top 5 colleges by expense
- Progress bars with percentage
- Drill-down capability (click to see college details)

**6. Recent Activities Feed**
- Last 10 activities
- Real-time updates via WebSocket
- Clickable links to view details

### Interactions

| Element | Click Action | Hover |
|---------|-------------|-------|
| Revenue Card | → Monthly revenue details modal | Show breakdown tooltip |
| Pending Approvals Count | → Expense approval page | Show summary tooltip |
| Budget Alert | → Budget utilization page with filters | Show affected departments |
| Expense Chart | → Detailed expense analytics | Show exact values |
| College Name | → College-specific financial dashboard | Highlight row |
| Activity Item | → Related resource (expense, payroll, etc.) | Show full details |

### Filters

```
┌─────────────────────────────────────────────────────────────────┐
│ Filters: [📅 Oct 2025 ▼] [🏢 All Colleges ▼] [🔄 Refresh]      │
└─────────────────────────────────────────────────────────────────┘
```

### Mobile Responsive

- Stats cards: Stack vertically (1 column)
- Widgets: Full width, collapsible
- Chart: Horizontal scroll
- Activities: Show last 5 only

---

## P2: Payroll Management

### Purpose
Process monthly payroll for 500+ employees across 15 colleges with automated calculations, TDS compliance, and payment disbursement.

### P2.1: Payroll List Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏦 Super Accountant Portal          [🔔 12] [👤 Rajesh Sharma ▼] [🚪 Logout] │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dashboard | 💰 Payroll | 💳 Expenses | 📊 Budgets | 🏢 Vendors | ...     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  💰 Payroll Management                                [➕ Process New Payroll]│
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Filters: [📅 October 2025 ▼] [🏢 All Colleges ▼] [📊 Status: All ▼]       │
│           [🔍 Search by employee name or payroll ID...]                     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ Payroll ID  │ Month    │ Employees │ Total Amount │ Status    │ Actions ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ PAY-2025-10 │ Oct 2025 │ 500       │ ₹5,00,00,000 │ ✅ Paid   │ [View]  ││
│  │             │          │ 15 colleges│              │ 03-Oct-25 │ [📄]    ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ PAY-2025-09 │ Sep 2025 │ 498       │ ₹4,98,00,000 │ ✅ Paid   │ [View]  ││
│  │             │          │ 15 colleges│              │ 03-Sep-25 │ [📄]    ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ PAY-2025-08 │ Aug 2025 │ 495       │ ₹4,95,00,000 │ ✅ Paid   │ [View]  ││
│  │             │          │ 15 colleges│              │ 03-Aug-25 │ [📄]    ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ PAY-2025-07 │ Jul 2025 │ 492       │ ₹4,92,00,000 │ ✅ Paid   │ [View]  ││
│  │             │          │ 15 colleges│              │ 03-Jul-25 │ [📄]    ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Showing 1-10 of 24 payroll records     [◀ Previous] [1] [2] [3] [Next ▶]  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P2.2: Process Payroll Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 💰 Process New Payroll                                    [❌ Cancel] [💾 Save Draft] [✅ Process]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Step 1 of 4: Configuration                                                 │
│  ████████████████░░░░░░░░░░░░░░░░ 50% Complete                              │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 📅 Payroll Period                                                       ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ Month: [November 2025 ▼]                                                ││
│  │ Payment Date: [📅 05-Nov-2025]                                          ││
│  │ Working Days: [22] (Auto-calculated from attendance)                    ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 🏢 College Selection                                                    ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ ☑ Select All (15 colleges, 500 employees)                               ││
│  │                                                                         ││
│  │ ☑ ABC Engineering College        (75 employees, ₹75,00,000)            ││
│  │ ☑ XYZ Medical College            (120 employees, ₹1,20,00,000)         ││
│  │ ☑ LMN Arts & Science College     (45 employees, ₹45,00,000)            ││
│  │ ☑ PQR Business School            (38 employees, ₹38,00,000)            ││
│  │ ... (11 more colleges)           [Expand All ▼]                         ││
│  │                                                                         ││
│  │ Total Selected: 500 employees                                           ││
│  │ Estimated Amount: ₹5,00,00,000                                          ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 📊 Calculation Preview                                                  ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ Total Basic Salary:        ₹3,00,00,000                                 ││
│  │ Total Allowances:          ₹1,50,00,000                                 ││
│  │ ─────────────────────────────────────                                   ││
│  │ Gross Salary:              ₹4,50,00,000                                 ││
│  │                                                                         ││
│  │ Total Deductions:                                                       ││
│  │   • PF (12%):              ₹36,00,000                                   ││
│  │   • Professional Tax:       ₹2,50,000                                   ││
│  │   • TDS:                   ₹11,50,000                                   ││
│  │ ─────────────────────────────────                                       ││
│  │ Net Salary:                ₹4,00,00,000                                 ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [◀ Back]                                                    [Next: Review ▶]│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P2.3: Payroll Detail View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Payroll Details: PAY-2025-10 (October 2025)                    [📄 Export] [📧 Email]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ Overview                                                                ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ Payroll ID: PAY-2025-10                  Status: ✅ Paid                 ││
│  │ Month: October 2025                       Payment Date: 03-Oct-2025     ││
│  │ Total Employees: 500                      Processing Time: 4h 35m       ││
│  │ Total Amount: ₹5,00,00,000                Processed By: Rajesh Sharma   ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 💰 Financial Breakdown                                                  ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ Basic Salary:           ₹3,00,00,000    │  PF Deduction:    ₹36,00,000 ││
│  │ HRA (40%):              ₹1,20,00,000    │  Prof. Tax:        ₹2,50,000 ││
│  │ DA (15%):                 ₹45,00,000    │  TDS:             ₹11,50,000 ││
│  │ TA:                       ₹15,00,000    │  Loans:            ₹5,00,000 ││
│  │ Medical:                  ₹10,00,000    │                              ││
│  │ ─────────────────────────────────────   │  ─────────────────────────── ││
│  │ Gross Salary:           ₹4,90,00,000    │  Total Deduct:    ₹55,00,000 ││
│  │                                         │                              ││
│  │ Net Salary Paid: ₹4,35,00,000                                           ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 🏢 College-wise Breakdown                                               ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ College Name              Employees    Gross Salary    Net Salary       ││
│  │ ─────────────────────────────────────────────────────────────────────  ││
│  │ ABC Engineering              75        ₹73,50,000      ₹65,50,000      ││
│  │ XYZ Medical                 120       ₹1,17,60,000    ₹1,04,80,000      ││
│  │ LMN Arts & Science           45        ₹44,10,000      ₹39,30,000      ││
│  │ PQR Business                 38        ₹37,24,000      ₹33,18,000      ││
│  │ ... (11 more)               222       ₹2,17,56,000    ₹1,92,22,000      ││
│  │                                                                         ││
│  │ Total:                      500       ₹4,90,00,000    ₹4,35,00,000      ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ 📋 Payment Status                                                       ││
│  │ ───────────────────────────────────────────────────────────────────────││
│  │                                                                         ││
│  │ ✅ Bank File Generated:     03-Oct-2025 10:30 AM                        ││
│  │ ✅ Uploaded to ICICI Bank:  03-Oct-2025 11:00 AM                        ││
│  │ ✅ Payment Processed:        03-Oct-2025 02:00 PM                        ││
│  │ ✅ Payslips Emailed:         03-Oct-2025 03:30 PM (500/500 sent)        ││
│  │                                                                         ││
│  │ Failed Payments: 0                                                      ││
│  │ Pending Confirmations: 0                                                ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [📊 View Individual Payslips] [📄 Download Bank File] [🔍 Audit Trail]     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P3: Expense Management

### P3.1: Pending Approvals Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏦 Super Accountant Portal          [🔔 12] [👤 Rajesh Sharma ▼] [🚪 Logout] │
├─────────────────────────────────────────────────────────────────────────────┤
│ 📊 Dashboard | 💰 Payroll | 💳 Expenses | 📊 Budgets | 🏢 Vendors | ...     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  💳 Expense Approvals (127 Pending)                                         │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Filters: [💰 Amount: >₹50,000 ▼] [🏢 All Colleges ▼] [📁 Category: All ▼] │
│           [📅 Date: Last 30 days ▼] [🔍 Search...]                          │
│           [☐ Show only high priority]                                       │
│                                                                              │
│  Bulk Actions: [☑ Select All (23)] [✅ Approve Selected] [❌ Reject Selected]│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ ☐ │ Expense ID │ College      │ Amount   │ Category │ Submitted │ Age  ││
│  ├───┼────────────┼──────────────┼──────────┼──────────┼───────────┼──────┤│
│  │ ☐ │ EXP-2847   │ ABC Engg     │ ₹75,000  │ Lab Equip│ 22-Oct-25 │ 3d  🔴││
│  │   │            │ Priya D.     │          │          │ Principal✅│     ││
│  │   │ 📄 Invoice.pdf (✓) | 📄 PO.pdf (✓) | 📄 Quotations.pdf (✓)         ││
│  │   │ [View Details] [✅ Approve] [❌ Reject] [💬 Comment]                ││
│  ├───┼────────────┼──────────────┼──────────┼──────────┼───────────┼──────┤│
│  │ ☐ │ EXP-2845   │ XYZ Medical  │ ₹2,50,000│ Equipment│ 21-Oct-25 │ 4d  🔴││
│  │   │            │ Amit K.      │          │          │ Principal✅│     ││
│  │   │ 📄 Invoice.pdf (✓) | 📄 PO.pdf (✓) | ⚠️ Delivery Challan missing   ││
│  │   │ [View Details] [✅ Approve] [❌ Reject] [💬 Request Docs]           ││
│  ├───┼────────────┼──────────────┼──────────┼──────────┼───────────┼──────┤│
│  │ ☐ │ EXP-2840   │ LMN Arts     │ ₹1,20,000│ Furniture│ 20-Oct-25 │ 5d  🔴││
│  │   │            │ Sonal M.     │          │          │ Principal✅│     ││
│  │   │ 📄 Invoice.pdf (✓) | 📄 PO.pdf (✓) | 📷 Photos.zip (✓)            ││
│  │   │ [View Details] [✅ Approve] [❌ Reject] [💬 Comment]                ││
│  └───┴────────────┴──────────────┴──────────┴──────────┴───────────┴──────┘│
│                                                                              │
│  Showing 1-10 of 127 expenses       [◀ Previous] [1] [2] ... [13] [Next ▶] │
│                                                                              │
│  ⏱️ Average Approval Time: 28 hours                                         │
│  🎯 Target: <48 hours                                                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P3.2: Expense Detail Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Expense Details: EXP-2847                               [❌ Close] [📄 Print]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Expense Information ───────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Expense ID: EXP-2847                    Status: ⏳ Pending Approval     ││
│  │ College: ABC Engineering College        Category: Lab Equipment         ││
│  │ Amount: ₹75,000                         Submitted: 22-Oct-2025 10:30 AM ││
│  │ Requested By: Priya Deshmukh            Age: 3 days 🔴                  ││
│  │ (College Accounts Admin)                                                ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Description ──────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Purchase of Scientific Calculator for Electronics Lab                   ││
│  │ Quantity: 50 units                                                      ││
│  │ Unit Price: ₹1,500                                                      ││
│  │ Vendor: XYZ Scientific Instruments                                      ││
│  │ Expected Delivery: 30-Oct-2025                                          ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Supporting Documents ─────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ ✅ Invoice.pdf (245 KB)                [View] [Download]                ││
│  │ ✅ Purchase_Order.pdf (182 KB)         [View] [Download]                ││
│  │ ✅ Quotations_3_vendors.pdf (512 KB)   [View] [Download]                ││
│  │                                                                         ││
│  │ All required documents attached ✅                                      ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Budget Check ─────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Budget: Electronics Department - Lab Equipment FY2024-25                ││
│  │                                                                         ││
│  │ Allocated:  ₹12,00,000                                                  ││
│  │ Spent:       ₹8,50,000                                                  ││
│  │ This Expense: ₹75,000                                                   ││
│  │ ─────────────────────────                                               ││
│  │ Remaining:   ₹2,75,000  ✅ Within Budget                                ││
│  │                                                                         ││
│  │ Utilization after approval: 77% 🟢                                      ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Approval Workflow ────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ ✅ College Accounts Admin → Submitted (22-Oct 10:30 AM)                 ││
│  │ ✅ Principal → Approved (22-Oct 02:15 PM)                                ││
│  │    💬 "Critical for lab, budget available, approved"                    ││
│  │                                                                         ││
│  │ ⏳ Super Accountant → Pending                                            ││
│  │    ⏱️ Waiting since: 3 days 🔴                                          ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Your Decision ────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ 💬 Comments (optional):                                                 ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ Approved for Q4 budget. Verify delivery before payment.             │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  │ [❌ Reject] [💬 Request More Info] [✅ Approve & Continue]              ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P4: Budget Management

### P4.1: Budget Allocations Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Budget Management                               [➕ Allocate New Budget]  │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Fiscal Year: [2024-25 ▼]                          Total Budget: ₹150 Cr    │
│  Filters: [🏢 All Colleges ▼] [📁 Category: All ▼] [⚠️ Alerts Only ☐]      │
│                                                                              │
│  ┌─ Overall Budget Summary ────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Total Allocated: ₹150 Crores                                            ││
│  │ Total Spent:     ₹130.5 Crores (87%)                                    ││
│  │ Committed:        ₹15 Crores (10%)                                      ││
│  │ Available:         ₹4.5 Crores (3%)                                     ││
│  │                                                                         ││
│  │ ████████████████████████████████████████████████████████░░░░░░ 87%     ││
│  │ 🟡 High Utilization - Monitor carefully                                 ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ College / Dept │ Allocated │ Spent    │ Committed│ Available│ Status   ││
│  ├───────────────────────────────────────────────────────────────────────────┤│
│  │ ABC Engineering│ ₹25Cr     │ ₹21.8Cr │ ₹2.5Cr  │ ₹0.7Cr   │ 🔴 97%   ││
│  │ ├─ CS Dept     │  ₹5Cr     │  ₹5.1Cr │  ₹0Cr   │ -₹0.1Cr  │ 🔴 102%  ││
│  │ │              │           │         │         │          │ EXCEEDED ││
│  │ ├─ Mech Dept   │  ₹4Cr     │  ₹3.2Cr │  ₹0.5Cr │  ₹0.3Cr  │ 🟡 93%   ││
│  │ ├─ Civil Dept  │  ₹3.5Cr   │  ₹2.8Cr │  ₹0.4Cr │  ₹0.3Cr  │ 🟡 91%   ││
│  │ └─ Other (12)  │  ₹12.5Cr  │  ₹10.7Cr│  ₹1.6Cr │  ₹0.2Cr  │ 🟡 98%   ││
│  ├───────────────────────────────────────────────────────────────────────────┤│
│  │ XYZ Medical    │ ₹30Cr     │ ₹24Cr   │ ₹4Cr    │ ₹2Cr     │ 🟡 93%   ││
│  │ ├─ Surgery     │  ₹8Cr     │  ₹7.2Cr │  ₹0.6Cr │  ₹0.2Cr  │ 🟡 98%   ││
│  │ └─ Other (10)  │  ₹22Cr    │  ₹16.8Cr│  ₹3.4Cr │  ₹1.8Cr  │ 🟢 92%   ││
│  ├───────────────────────────────────────────────────────────────────────────┤│
│  │ LMN Arts       │ ₹15Cr     │ ₹12Cr   │ ₹1.5Cr  │ ₹1.5Cr   │ 🟢 90%   ││
│  │ ... (12 more colleges)                                                  ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ⚠️ Alerts: 9 departments require attention                                 │
│     • 1 budget exceeded (CS Dept - ABC Engg)                                │
│     • 8 departments at 85-95% utilization                                   │
│                                                                              │
│  [📊 Visualize Budgets] [📄 Export Report] [⚙️ Mid-Year Revision]           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P4.2: Allocate New Budget Modal

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Allocate New Budget                                      [❌ Close] [✅ Save]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Budget Details ───────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Fiscal Year: [2025-26 ▼]                                                ││
│  │                                                                         ││
│  │ College: [ABC Engineering College ▼]                                    ││
│  │ Department: [Computer Science ▼]                                        ││
│  │                                                                         ││
│  │ Budget Category: [Operational ▼]                                        ││
│  │                                                                         ││
│  │ Allocated Amount: ₹ [5,00,00,000]                                       ││
│  │                                                                         ││
│  │ Start Date: [01-Apr-2025]        End Date: [31-Mar-2026]                ││
│  │                                                                         ││
│  │ Title: [CS Department Operational Budget 2025-26]                       ││
│  │                                                                         ││
│  │ Description:                                                            ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ Annual operational budget for Computer Science department including │││
│  │ │ lab equipment, software licenses, maintenance, and supplies.        │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Budget Breakdown (Optional) ──────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Sub-Category Allocation:                                                ││
│  │   • Lab Equipment:        ₹2,00,00,000 (40%)                            ││
│  │   • Software Licenses:    ₹1,50,00,000 (30%)                            ││
│  │   • Maintenance:           ₹75,00,000 (15%)                             ││
│  │   • Supplies:              ₹75,00,000 (15%)                             ││
│  │   ─────────────────────────────────────                                 ││
│  │   Total:                  ₹5,00,00,000 (100%)                           ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Approval Workflow ────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ ☑ Require Principal approval before activation                          ││
│  │ ☑ Send notification to College Accounts Admin                           ││
│  │ ☑ Enable budget alerts at 80% utilization                               ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [❌ Cancel]                            [💾 Save Draft] [✅ Allocate Budget] │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P5: Vendor Management

### P5.1: Vendor List Page

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏢 Vendor Management                                       [➕ Add New Vendor]│
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Filters: [📁 Category: All ▼] [📊 Status: Active ▼] [🔍 Search by name...] │
│                                                                              │
│  Total Vendors: 203 | Active: 198 | Inactive: 5                             │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ Vendor Name          │ Category  │ GSTIN        │ Total Txns│ Rating   ││
│  ├───────────────────────────────────────────────────────────────────────────┤│
│  │ XYZ Scientific       │ Equipment │ 27XXXXX1234Z │ 47        │ ⭐⭐⭐⭐⭐ ││
│  │ Instruments          │           │              │ ₹85 Lakhs │ 4.8/5.0 ││
│  │ [View] [Edit] [📋 Transactions] [💰 Pay]                                ││
│  ├───────────────────────────────────────────────────────────────────────────┤│
│  │ ABC Furniture        │ Furniture │ 27YYYYY5678A │ 32        │ ⭐⭐⭐⭐   ││
│  │ Traders              │           │              │ ₹52 Lakhs │ 4.2/5.0 ││
│  │ [View] [Edit] [📋 Transactions] [💰 Pay]                                ││
│  ├───────────────────────────────────────────────────────────────────────────┤│
│  │ LMN IT Solutions     │ Software  │ 27ZZZZZ9012B │ 28        │ ⭐⭐⭐⭐⭐ ││
│  │                      │           │              │ ₹95 Lakhs │ 4.9/5.0 ││
│  │ [View] [Edit] [📋 Transactions] [💰 Pay]                                ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  Showing 1-10 of 203 vendors        [◀ Previous] [1] [2] ... [21] [Next ▶] │
│                                                                              │
│  ┌─ Quick Stats ──────────────────────────────────────────────────────────┐│
│  │ Pending Payments: 18 vendors | Total: ₹45,00,000 | Overdue: 3 vendors  ││
│  │ [View Pending Payments →]                                               ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P6: Bank Reconciliation

### Purpose
Match 5,000+ monthly bank transactions across 15 accounts with automated reconciliation and discrepancy handling.

### P6.1: Bank Reconciliation Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🏦 Bank Reconciliation                          [📤 Import Statement] [📊 Reports]│
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  Period: [October 2025 ▼]                      Total Transactions: 5,247    │
│                                                                              │
│  ┌─ Reconciliation Status ─────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ ✅ Matched:           4,830 (92%)        ₹42,50,00,000                  ││
│  │ ⏳ Pending Review:      285 (5.4%)       ₹2,85,50,000                   ││
│  │ ❌ Unmatched:           132 (2.6%)       ₹1,32,00,000                   ││
│  │                                                                         ││
│  │ ████████████████████████████████████████████████░░░░ 92% Matched       ││
│  │                                                                         ││
│  │ Last Reconciliation: 24-Oct-2025 | Next Due: 07-Nov-2025               ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Bank Accounts Overview ────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Bank Account              Balance        Unmatched  Last Reconciled    ││
│  │ ─────────────────────────────────────────────────────────────────────  ││
│  │ ICICI Main A/c (4567)     ₹15,50,00,000    12 txns  24-Oct-2025 ✅     ││
│  │ HDFC Payroll A/c (8901)   ₹5,00,00,000     3 txns   24-Oct-2025 ✅     ││
│  │ SBI Operations (2345)     ₹8,75,00,000     45 txns  20-Oct-2025 🟡     ││
│  │ Axis Vendor Payments      ₹3,25,00,000     18 txns  22-Oct-2025 🟡     ││
│  │ ... (11 more accounts)    ₹12,50,00,000    54 txns  [View All →]       ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Unmatched Transactions (Requires Action) ──────────────────────────────┐│
│  │                                                                         ││
│  │ Date      │ Bank A/c    │ Type   │ Amount      │ Reference   │ Action  ││
│  │ ──────────┼─────────────┼────────┼─────────────┼─────────────┼─────────┤│
│  │ 24-Oct-25 │ ICICI 4567  │ Credit │ ₹2,50,000   │ NEFT247895  │ [Match] ││
│  │           │             │        │             │ XYZ Supplier│ [Split] ││
│  │ ──────────┼─────────────┼────────┼─────────────┼─────────────┼─────────┤│
│  │ 23-Oct-25 │ SBI 2345    │ Debit  │ ₹1,85,000   │ CHQ123456   │ [Match] ││
│  │           │             │        │             │ Unknown     │ [Create]││
│  │ ──────────┼─────────────┼────────┼─────────────┼─────────────┼─────────┤│
│  │ 22-Oct-25 │ HDFC 8901   │ Credit │ ₹75,000     │ RTGS847562  │ [Match] ││
│  │           │             │        │             │ Student Fee │ [Ignore]││
│  │                                                                         ││
│  │ Showing 1-10 of 132 unmatched       [◀ Previous] [1] [2] [Next ▶]      ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [🤖 Auto-Match All] [📊 Discrepancy Report] [✅ Finalize Reconciliation]   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P6.2: Transaction Matching Interface

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Match Transaction: NEFT247895                            [❌ Close] [✅ Match]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Bank Transaction ──────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Date: 24-Oct-2025                    Amount: ₹2,50,000 (Credit)         ││
│  │ Bank: ICICI Main A/c (4567)          Reference: NEFT247895              ││
│  │ Description: XYZ SUPPLIER PAYMENT RECEIVED                              ││
│  │ Balance After: ₹15,75,00,000                                            ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Suggested Matches (Based on Amount, Date, Reference) ──────────────────┐│
│  │                                                                         ││
│  │ ⭐ Match Score: 95%                                                      ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ ☑ Expense #EXP-2845 - XYZ Scientific Instruments                   │││
│  │ │   Amount: ₹2,50,000 | Date: 21-Oct-2025                            │││
│  │ │   Category: Lab Equipment | Status: Approved                        │││
│  │ │   Vendor: XYZ Scientific Instruments                                │││
│  │ │   [View Expense Details →]                                          │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  │ Match Score: 72%                                                        ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ ☐ Vendor Payment #VPY-1847 - XYZ Traders                           │││
│  │ │   Amount: ₹2,50,000 | Date: 22-Oct-2025                            │││
│  │ │   Status: Pending Confirmation                                      │││
│  │ │   [View Payment Details →]                                          │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  │ [🔍 Search More Transactions]                                           ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Manual Match ──────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Transaction Type: [Expense ▼]                                           ││
│  │ Transaction ID: [EXP-____]                          [🔍 Search]          ││
│  │                                                                         ││
│  │ 💬 Notes (optional):                                                    ││
│  │ ┌─────────────────────────────────────────────────────────────────────┐││
│  │ │ Matched with approved lab equipment purchase                        │││
│  │ └─────────────────────────────────────────────────────────────────────┘││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [❌ Cancel] [⏭️ Skip for Now] [✅ Confirm Match]                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P7: Financial Reports

### Purpose
Generate comprehensive financial reports (P&L, Balance Sheet, Cash Flow) with drill-down capability and export options.

### P7.1: Reports Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📈 Financial Reports                                    [⏰ Scheduled Reports]│
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌─ Generate New Report ────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Report Type: [Profit & Loss ▼]                                          ││
│  │                                                                         ││
│  │ Period: [📅 01-Oct-2025] to [📅 31-Oct-2025]                            ││
│  │         Presets: [MTD] [QTD] [YTD] [Custom]                             ││
│  │                                                                         ││
│  │ Scope: [🏢 All Colleges ▼]                                              ││
│  │        [☐ Include budget comparison] [☐ Include variance analysis]      ││
│  │                                                                         ││
│  │ Format: [📄 PDF] [📊 Excel] [📋 CSV]                                    ││
│  │                                                                         ││
│  │ [🔄 Generate Report]                                                     ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Quick Reports ──────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ ┌──────────────────┬──────────────────┬──────────────────┬────────────┐││
│  │ │ 📊 P&L Statement │ 📈 Balance Sheet │ 💰 Cash Flow    │ 📉 Budget  │││
│  │ │ October 2025     │ As on 31-Oct-25  │ October 2025    │ vs Actual  │││
│  │ │                  │                  │                 │            │││
│  │ │ Revenue: ₹12.5Cr │ Assets: ₹250Cr   │ Inflow: ₹15Cr  │ Variance:  │││
│  │ │ Expenses: ₹8.2Cr │ Liabil.: ₹180Cr  │ Outflow: ₹10Cr │ -3.2%      │││
│  │ │ Net: +₹4.3Cr     │ Equity: ₹70Cr    │ Net: +₹5Cr     │            │││
│  │ │                  │                  │                 │            │││
│  │ │ [View] [Export]  │ [View] [Export]  │ [View] [Export] │ [View]     │││
│  │ └──────────────────┴──────────────────┴──────────────────┴────────────┘││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Recent Reports ─────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Report Name           │ Type        │ Period      │ Generated │ Actions ││
│  │ ──────────────────────┼─────────────┼─────────────┼───────────┼─────────┤│
│  │ Oct 2025 P&L          │ P&L         │ Oct 2025    │ 25-Oct    │ [View]  ││
│  │                       │             │ All Colleges│ 10:30 AM  │ [📄]    ││
│  │ ──────────────────────┼─────────────┼─────────────┼───────────┼─────────┤│
│  │ Q2 FY2025 Cash Flow   │ Cash Flow   │ Jul-Sep 25  │ 05-Oct    │ [View]  ││
│  │                       │             │ All Colleges│ 03:45 PM  │ [📄]    ││
│  │ ──────────────────────┼─────────────┼─────────────┼───────────┼─────────┤│
│  │ Sep 2025 Balance Sheet│ Balance     │ 30-Sep-25   │ 01-Oct    │ [View]  ││
│  │                       │ Sheet       │ All Colleges│ 11:00 AM  │ [📄]    ││
│  │                                                                         ││
│  │ Showing 1-10 of 87 reports          [◀ Previous] [1] [2] [Next ▶]      ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Compliance Reports ─────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ 📋 TDS Returns (Form 24Q)       Q2 FY2025    Due: 31-Oct  [Generate]   ││
│  │ 📋 GST Returns (GSTR-1)         October      Due: 11-Nov  [Generate]   ││
│  │ 📋 PF Monthly Return (ECR)      October      Due: 15-Nov  [Generate]   ││
│  │ 📋 Form 16 (Annual)             FY2024-25    Due: 15-Jun  [Not Due]    ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P7.2: P&L Statement View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 📊 Profit & Loss Statement - October 2025                [📄 Export] [🖨️ Print]│
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  Filters: [🏢 All Colleges] [📅 October 2025] [☑ Compare with Sep 2025]     │
│                                                                              │
│  ┌──────────────────────────────────────────────────────────────────────────┐│
│  │ Account Head                    Oct 2025      Sep 2025      Variance    ││
│  ├──────────────────────────────────────────────────────────────────────────┤│
│  │ INCOME                                                                  ││
│  │ ──────────────────────────────────────────────────────────────────────  ││
│  │ Student Fees                    ₹10,50,00,000  ₹9,80,00,000  +7.1% ▲   ││
│  │ ├─ Tuition Fees                  ₹8,50,00,000  ₹7,90,00,000  +7.6%     ││
│  │ ├─ Exam Fees                     ₹1,20,00,000  ₹1,15,00,000  +4.3%     ││
│  │ └─ Other Fees                      ₹80,00,000    ₹75,00,000  +6.7%     ││
│  │                                                                         ││
│  │ Other Income                     ₹2,00,00,000  ₹1,85,00,000  +8.1% ▲   ││
│  │ ├─ Library Fines                    ₹5,00,000     ₹4,50,000  +11.1%    ││
│  │ ├─ Rental Income                   ₹45,00,000    ₹42,00,000  +7.1%     ││
│  │ ├─ Consultancy                     ₹80,00,000    ₹72,00,000  +11.1%    ││
│  │ └─ Miscellaneous                   ₹70,00,000    ₹66,50,000  +5.3%     ││
│  │ ─────────────────────────────────────────────────────────────────────   ││
│  │ Total Income                    ₹12,50,00,000 ₹11,65,00,000  +7.3% ▲   ││
│  │                                                                         ││
│  │ EXPENSES                                                                ││
│  │ ──────────────────────────────────────────────────────────────────────  ││
│  │ Salaries & Wages                 ₹5,00,00,000  ₹4,98,00,000  +0.4%     ││
│  │ ├─ Faculty Salaries              ₹3,50,00,000  ₹3,50,00,000   0.0%     ││
│  │ ├─ Staff Salaries                ₹1,20,00,000  ₹1,18,00,000  +1.7%     ││
│  │ └─ Temporary Staff                  ₹30,00,000    ₹30,00,000   0.0%     ││
│  │                                                                         ││
│  │ Operational Expenses             ₹2,00,00,000  ₹2,15,00,000  -7.0% ▼   ││
│  │ ├─ Utilities                        ₹45,00,000    ₹52,00,000  -13.5%    ││
│  │ ├─ Maintenance                      ₹65,00,000    ₹68,00,000  -4.4%     ││
│  │ ├─ Supplies                         ₹55,00,000    ₹60,00,000  -8.3%     ││
│  │ └─ Other                            ₹35,00,000    ₹35,00,000   0.0%     ││
│  │                                                                         ││
│  │ Administrative Expenses          ₹1,20,00,000  ₹1,18,00,000  +1.7%     ││
│  │ ─────────────────────────────────────────────────────────────────────   ││
│  │ Total Expenses                   ₹8,20,00,000  ₹8,31,00,000  -1.3% ▼   ││
│  │                                                                         ││
│  │ ═════════════════════════════════════════════════════════════════════   ││
│  │ NET PROFIT                       ₹4,30,00,000  ₹3,34,00,000  +28.7% ▲  ││
│  │ ═════════════════════════════════════════════════════════════════════   ││
│  │                                                                         ││
│  │ Net Profit Margin: 34.4%         Previous: 28.7%         +5.7pp        ││
│  │                                                                         ││
│  └──────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  💡 Click any line item to drill down to transactions                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P8: Audit Trail

### Purpose
Complete transaction history with searchable logs, approval workflows, and document access for 7-year retention compliance.

### P8.1: Audit Trail Search

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🔍 Audit Trail                                              [📄 Export Logs]│
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  🔍 Search Filters                                                           │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Date Range: [📅 01-Oct-2025] to [📅 31-Oct-2025]                        ││
│  │             Presets: [Today] [Last 7 days] [Last 30 days] [Custom]      ││
│  │                                                                         ││
│  │ User: [All Users ▼]                Action: [All Actions ▼]              ││
│  │ Resource: [All ▼]                  College: [All Colleges ▼]            ││
│  │ IP Address: [Any]                  Status: [All ▼]                      ││
│  │                                                                         ││
│  │ Keywords: [____________________________________________] [🔍 Search]     ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Audit Logs ─────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Timestamp        User             Action          Resource       IP     ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ 25-Oct 10:30:15  Rajesh Sharma    Approved        EXP-2847      49.xx  ││
│  │                  Super Accountant Expense         ₹75,000        xxx.xx ││
│  │                  [View Details] [📄 Documents]                          ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ 25-Oct 10:28:42  Rajesh Sharma    Viewed          EXP-2847      49.xx  ││
│  │                  Super Accountant Expense Details               xxx.xx ││
│  │                  [View Details]                                         ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ 25-Oct 10:15:22  Priya Deshmukh   Created         EXP-2847      103.xx ││
│  │                  College Acct     Expense         ₹75,000        xxx.xx ││
│  │                  ABC Engineering                                        ││
│  │                  [View Details] [📄 Documents]                          ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ 25-Oct 09:45:18  Rajesh Sharma    Processed       PAY-2025-10   49.xx  ││
│  │                  Super Accountant Payroll         500 employees xxx.xx ││
│  │                  [View Details]                                         ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ 24-Oct 16:30:45  Rajesh Sharma    Reconciled      ICICI-4567    49.xx  ││
│  │                  Super Accountant Bank Account    4,830 txns    xxx.xx ││
│  │                  [View Details]                                         ││
│  │                                                                         ││
│  │ Showing 1-50 of 2,847 logs          [◀ Previous] [1] [2] ... [Next ▶]  ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Quick Stats ────────────────────────────────────────────────────────────┐│
│  │ Total Activities: 2,847 | Users: 18 | Failed Attempts: 0 | Avg/Day: 92 ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P8.2: Audit Log Detail View

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Audit Log Detail: #LOG-2847-001                               [❌ Close]     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Event Information ──────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Log ID: LOG-2847-001                    Event: Expense Approved         ││
│  │ Timestamp: 25-Oct-2025 10:30:15         Resource: EXP-2847              ││
│  │ User: Rajesh Sharma                     Role: Super Accountant          ││
│  │ IP Address: 49.xxx.xxx.xx               User Agent: Chrome 118 / Win 11 ││
│  │ Session ID: ses_abc123xyz456            Device: Desktop                 ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Action Details ─────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Action: APPROVE_EXPENSE                                                 ││
│  │ Resource Type: Expense                                                  ││
│  │ Resource ID: EXP-2847                                                   ││
│  │ College: ABC Engineering College                                        ││
│  │ Amount: ₹75,000                                                         ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ State Changes ──────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Before:                                  After:                         ││
│  │ {                                        {                              ││
│  │   "status": "pending_super_accountant",   "status": "approved",         ││
│  │   "approved_by": null,                    "approved_by": "U-123",       ││
│  │   "approved_at": null,                    "approved_at": "2025-10-25.."││
│  │   "comments": []                          "comments": ["Approved..."]   ││
│  │ }                                        }                              ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Additional Context ─────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Comments: "Approved for Q4 budget. Verify delivery before payment."     ││
│  │                                                                         ││
│  │ Related Events:                                                         ││
│  │ • LOG-2847-000: Expense Created (22-Oct 10:15 AM)                       ││
│  │ • LOG-2847-001: Expense Approved by Principal (22-Oct 02:15 PM)         ││
│  │ • LOG-2847-002: This event                                              ││
│  │                                                                         ││
│  │ Attached Documents:                                                     ││
│  │ • Invoice.pdf (245 KB)              [View] [Download]                   ││
│  │ • Purchase_Order.pdf (182 KB)       [View] [Download]                   ││
│  │ • Quotations.pdf (512 KB)           [View] [Download]                   ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [📄 Export Full Log] [🔍 View Resource (EXP-2847)] [◀ Back to Search]      │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## P9: Settings & Configuration

### Purpose
System configuration, user management, notification preferences, and college accountant administration.

### P9.1: Settings Dashboard

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ⚙️ Settings & Configuration                                                 │
│  ─────────────────────────────────────────────────────────────────────────  │
│                                                                              │
│  ┌─ Quick Settings ─────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ ┌──────────────────────┬──────────────────────┬──────────────────────┐ ││
│  │ │ 👤 Profile           │ 🏢 Users             │ 🔔 Notifications     │ ││
│  │ │ Manage account       │ College accountants  │ Email & SMS prefs    │ ││
│  │ │ [Configure →]        │ [Manage →]           │ [Configure →]        │ ││
│  │ └──────────────────────┴──────────────────────┴──────────────────────┘ ││
│  │                                                                         ││
│  │ ┌──────────────────────┬──────────────────────┬──────────────────────┐ ││
│  │ │ 💰 Financial         │ 🔐 Security          │ 🏦 Bank Accounts     │ ││
│  │ │ Fiscal year, budgets │ MFA, permissions     │ Account details      │ ││
│  │ │ [Configure →]        │ [Configure →]        │ [Manage →]           │ ││
│  │ └──────────────────────┴──────────────────────┴──────────────────────┘ ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ College Accountants Management ─────────────────────────────────────────┐│
│  │                                                                         ││
│  │ [➕ Add New College Accountant]                    [🔍 Search by name...]││
│  │                                                                         ││
│  │ Name              College           Status    Last Active    Actions   ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ Priya Deshmukh    ABC Engineering   ✅ Active  25-Oct 10:30  [Edit]    ││
│  │ priya.d@abc.edu   Role: College     MFA: Yes   Today         [Disable] ││
│  │                   Accounts Admin                             [View]    ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ Amit Kumar        XYZ Medical       ✅ Active  25-Oct 09:15  [Edit]    ││
│  │ amit.k@xyz.edu    Role: College     MFA: Yes   Today         [Disable] ││
│  │                   Accounts Admin                             [View]    ││
│  │ ────────────────────────────────────────────────────────────────────────┤│
│  │ Sonal Mehta       LMN Arts          ✅ Active  24-Oct 16:45  [Edit]    ││
│  │ sonal.m@lmn.edu   Role: College     MFA: No    Yesterday     [Disable] ││
│  │                   Accounts Admin                             [View]    ││
│  │                                                                         ││
│  │ Showing 1-10 of 15 users            [◀ Previous] [1] [2] [Next ▶]      ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ System Configuration ───────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Fiscal Year                                                             ││
│  │ Current: 2024-25 (01-Apr-2024 to 31-Mar-2025)                           ││
│  │ [Change Fiscal Year]                                                    ││
│  │                                                                         ││
│  │ Approval Thresholds                                                     ││
│  │ • Auto-approve: Up to ₹10,000                                           ││
│  │ • Principal: ₹10,000 - ₹50,000                                          ││
│  │ • Super Accountant: ₹50,000 - ₹1,00,000                                 ││
│  │ • University Owner: Above ₹2,00,000                                     ││
│  │ [Modify Thresholds]                                                     ││
│  │                                                                         ││
│  │ Payment Gateway                                                         ││
│  │ Razorpay (Connected)                          [Configure] [Test]        ││
│  │                                                                         ││
│  │ Bank Reconciliation                                                     ││
│  │ Auto-match enabled | Schedule: Weekly (Monday 9 AM)                     ││
│  │ [Configure Schedule]                                                    ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### P9.2: Profile Settings

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 👤 Profile Settings                                    [💾 Save] [❌ Cancel] │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─ Personal Information ───────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Full Name: [Rajesh Sharma                    ]                          ││
│  │ Email: [rajesh.sharma@edubit.com             ] ✅ Verified               ││
│  │ Phone: [+91 98765 43210                      ] ✅ Verified               ││
│  │ Employee ID: [EMP-001                        ]                          ││
│  │                                                                         ││
│  │ Role: Super Accountant (Cannot be changed)                              ││
│  │ User ID: U-123                                                          ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Security ───────────────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Password                                                                ││
│  │ Last changed: 15-Sep-2025 (40 days ago)                                 ││
│  │ [Change Password]                                                       ││
│  │                                                                         ││
│  │ Two-Factor Authentication (MFA)                                         ││
│  │ Status: ✅ Enabled (TOTP via Google Authenticator)                      ││
│  │ Backup codes: 7/10 remaining                                            ││
│  │ [Regenerate Backup Codes] [Disable MFA]                                 ││
│  │                                                                         ││
│  │ Active Sessions                                                         ││
│  │ • Desktop (Current) - Chrome 118, Windows 11                            ││
│  │   IP: 49.xxx.xxx.xx | Last active: Just now                             ││
│  │ • Mobile - Safari, iOS 17                                               ││
│  │   IP: 103.xxx.xxx.xx | Last active: 2 hours ago                         ││
│  │   [Logout This Device]                                                  ││
│  │                                                                         ││
│  │ [Logout All Other Devices]                                              ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Notification Preferences ───────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Email Notifications:                                                    ││
│  │ ☑ Pending approvals (Daily digest at 9 AM)                              ││
│  │ ☑ Budget alerts (Immediate)                                             ││
│  │ ☑ Payment failures (Immediate)                                          ││
│  │ ☑ Weekly financial summary (Mondays at 9 AM)                            ││
│  │ ☐ All transactions (Not recommended)                                    ││
│  │                                                                         ││
│  │ SMS Notifications:                                                      ││
│  │ ☑ Budget exceeded (Immediate)                                           ││
│  │ ☑ Payment failures (Immediate)                                          ││
│  │ ☑ Security alerts (Immediate)                                           ││
│  │ ☐ Pending approvals (Not enabled)                                       ││
│  │                                                                         ││
│  │ In-App Notifications:                                                   ││
│  │ ☑ Real-time updates for all activities                                  ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─ Display Preferences ────────────────────────────────────────────────────┐│
│  │                                                                         ││
│  │ Language: [English ▼]                                                   ││
│  │ Timezone: [Asia/Kolkata (IST) ▼]                                        ││
│  │ Date Format: [DD-MMM-YYYY ▼] (e.g., 25-Oct-2025)                        ││
│  │ Currency Display: [₹ Symbol ▼]                                          ││
│  │ Theme: [Light ▼] (Auto, Light, Dark)                                    ││
│  │                                                                         ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  [💾 Save Changes] [❌ Cancel]                                               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Component Library

### Reusable Components

**1. StatsCard**
- Props: title, value, trend, icon, color
- Usage: Dashboard metrics, KPI displays
- Responsive: Stack on mobile

**2. DataTable**
- Props: columns, data, pagination, filters, bulkActions
- Features: Sort, filter, search, export
- Customizable: Row actions, expandable rows

**3. ApprovalWorkflow**
- Props: steps, currentStep, approvers
- Visual: Timeline with status indicators
- Interactive: Click to view details

**4. FinancialChart**
- Props: type (line/bar/pie), data, options
- Library: Recharts
- Export: PNG, SVG, data CSV

**5. DocumentViewer**
- Props: fileUrl, fileType
- Supports: PDF, images, Excel preview
- Actions: Download, print, share

**6. FilterPanel**
- Props: filters, onApply, onReset
- Features: Date range, dropdowns, checkboxes
- Persistent: Saves filter state

**7. Modal/Dialog**
- Props: title, content, actions, size
- Types: Confirm, form, info, alert
- Responsive: Full-screen on mobile

**8. NotificationBadge**
- Props: count, color, pulse
- Usage: Pending items indicator
- Real-time: WebSocket updates

### Design System

**Colors:**
- Primary: #3B82F6 (Blue)
- Success: #10B981 (Green)
- Warning: #F59E0B (Amber)
- Error: #EF4444 (Red)
- Neutral: #6B7280 (Gray)

**Typography:**
- Headings: Inter (600-700 weight)
- Body: Inter (400 weight)
- Mono: JetBrains Mono (code, IDs)

**Spacing:**
- Base unit: 4px (0.25rem)
- Common: 8px, 16px, 24px, 32px, 48px

**Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

---

## Interaction Patterns

### 1. Bulk Operations
- Select all/individual items
- Bulk approve/reject/delete
- Progress indicator for batch operations
- Rollback capability on errors

### 2. Real-time Updates
- WebSocket for pending approvals
- Live budget utilization changes
- Payment status updates
- Activity feed auto-refresh

### 3. Drill-down Navigation
- Click stats cards → Detailed view
- Click chart segments → Transaction list
- Click college name → College dashboard
- Breadcrumb navigation for context

### 4. Keyboard Shortcuts
- `Ctrl+S`: Save current form
- `Ctrl+K`: Global search
- `Esc`: Close modal/dialog
- `Ctrl+P`: Print current view
- `Ctrl+E`: Export current view

### 5. Loading States
- Skeleton screens for initial load
- Inline spinners for actions
- Progress bars for long operations
- Toast notifications for completion

### 6. Error Handling
- Inline validation on forms
- Toast for operation failures
- Retry button for network errors
- Fallback UI for missing data

---

## Accessibility Features

**WCAG 2.1 AA Compliance:**

1. **Keyboard Navigation**
   - Tab through all interactive elements
   - Enter/Space for activation
   - Arrow keys for dropdowns/lists
   - Focus indicators visible

2. **Screen Reader Support**
   - ARIA labels on icons
   - Alt text for images
   - Role attributes (button, link, dialog)
   - Live regions for updates

3. **Color Contrast**
   - Text: 4.5:1 minimum ratio
   - Large text: 3:1 ratio
   - Interactive elements: 3:1 ratio
   - Status indicators: Not color-only

4. **Responsive Text**
   - Zoom up to 200% without loss
   - Relative font sizes (rem/em)
   - Line height: 1.5 minimum
   - Paragraph spacing: 2em

5. **Forms**
   - Labels associated with inputs
   - Error messages linked to fields
   - Required fields indicated
   - Help text available

---

## Performance Optimization

**Target Metrics:**
- First Contentful Paint: <1.5s
- Largest Contentful Paint: <2.5s
- Time to Interactive: <3.5s
- Cumulative Layout Shift: <0.1

**Strategies:**

1. **Code Splitting**
   - Route-based lazy loading
   - Component lazy loading
   - Dynamic imports for heavy components

2. **Data Optimization**
   - Pagination (50 items/page)
   - Virtual scrolling for large lists
   - Debounced search (300ms)
   - Cached API responses (TanStack Query)

3. **Image Optimization**
   - Next.js Image component
   - WebP format with fallback
   - Lazy loading below fold
   - Responsive image sizes

4. **Caching**
   - Service worker for offline
   - Redis for API responses
   - Browser cache for static assets
   - CDN for global distribution

---

## Mobile Responsive Design

**Mobile-First Approach:**

**Dashboard (Mobile):**
```
┌─────────────────────┐
│ 🏦 Super Accountant │
│ [🔔] [☰]            │
├─────────────────────┤
│ 💰 Total Revenue    │
│ ₹12.5 Cr            │
│ ▲ +8% MTD           │
├─────────────────────┤
│ 💸 Total Expenses   │
│ ₹8.2 Cr             │
│ ▼ -3% MTD           │
├─────────────────────┤
│ 🔔 Pending (127)    │
│ • Expenses: 127     │
│ • Budgets: 5        │
│ [View All →]        │
├─────────────────────┤
│ ⚠️ Alerts (3)       │
│ • Budget Exceeded   │
│ • TDS Due: 7 days   │
│ [View All →]        │
└─────────────────────┘
```

**Tablet Optimization:**
- Two-column layouts
- Collapsible sidebar
- Touch-friendly 44px targets
- Swipe gestures for navigation

**Progressive Enhancement:**
- Core functionality without JS
- Enhanced experience with JS
- Offline capability where possible

---

## Summary

**Total Pages:** 9 main pages
**Total Sub-pages:** 24+ views
**Total Components:** 50+ reusable
**Total Wireframes:** 20 detailed ASCII layouts
**Coverage:** 100% of core workflows

**Key Features:**
- Real-time financial dashboard
- Multi-level approval workflows
- Automated payroll processing (500+ employees)
- Bank reconciliation (5,000+ transactions)
- Comprehensive financial reports
- Complete audit trail (7-year retention)
- Mobile-responsive design (82% mobile usage)
- WCAG 2.1 AA accessible
- <2s page load performance

**Related Documentation:**
- Frontend implementation → [frontend_guide.md](./frontend_guide.md)
- Backend API endpoints → [api_spec.yaml](./api_spec.yaml)
- Database schema → [db_schema.sql](./db_schema.sql)
- Security measures → [security_checklist.md](./security_checklist.md)
- Testing strategy → [tests.md](./tests.md)
- Integration contracts → [integration_contracts.md](./integration_contracts.md)

---

**Document Version:** 1.0  
**Last Updated:** October 25, 2025  
**Status:** ✅ Complete
