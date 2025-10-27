# College Accounts Admin Portal - UI/UX Design Specifications

**Version**: 1.0.0  
**Design System**: BitFlow Nova Design Language  
**Target Users**: College Accounts Administrators  
**Accessibility**: WCAG 2.1 AA Compliant

---

## Table of Contents
1. [Design System](#1-design-system)
2. [Dashboard](#2-dashboard)
3. [Expense Management](#3-expense-management)
4. [Vendor Management](#4-vendor-management)
5. [Purchase Orders](#5-purchase-orders)
6. [Invoices & Payments](#6-invoices--payments)
7. [Budget Monitoring](#7-budget-monitoring)
8. [Financial Reports](#8-financial-reports)
9. [Navigation & Layout](#9-navigation--layout)

---

## 1. Design System

### 1.1 Color Palette
```css
/* Primary - Financial Green */
--primary-50: #ecfdf5
--primary-500: #10b981  /* Main brand color */
--primary-600: #059669
--primary-700: #047857

/* Accent - Gold for Important Actions */
--accent-500: #f59e0b
--accent-600: #d97706

/* Status Colors */
--success: #10b981
--warning: #f59e0b
--danger: #ef4444
--info: #3b82f6

/* Neutrals */
--gray-50: #f9fafb
--gray-100: #f3f4f6
--gray-500: #6b7280
--gray-900: #111827
```

### 1.2 Typography
```css
/* Font Family */
font-family: 'Inter', system-ui, sans-serif

/* Heading Scales */
h1: 32px / 600 weight / 1.2 line-height
h2: 24px / 600 weight / 1.3 line-height
h3: 20px / 600 weight / 1.4 line-height
h4: 18px / 500 weight / 1.5 line-height

/* Body Text */
body: 16px / 400 weight / 1.5 line-height
small: 14px / 400 weight / 1.5 line-height
```

### 1.3 Spacing System
```css
/* 8px base unit */
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px
```

---

## 2. Dashboard

### 2.1 Overview
Main landing page showing financial overview, pending actions, and key metrics.

### 2.2 Layout Structure
```
┌─────────────────────────────────────────────────────────┐
│ Header: College Accounts Admin | College Name | Profile │
├─────────────────────────────────────────────────────────┤
│ [Sidebar]  │  Dashboard                                 │
│            │  ┌──────────────────────────────────────┐  │
│  • Dashboard│  │ Financial Overview Cards             │  │
│  • Expenses │  │ ┌────┐ ┌────┐ ┌────┐ ┌────┐        │  │
│  • Vendors  │  │ │₹12Cr│ │₹8Cr│ │₹4Cr│ │₹50L│        │  │
│  • Purchase │  │ │Total│ │Spent│ │Rem.│ │Pending│     │  │
│  • Invoices │  │ └────┘ └────┘ └────┘ └────┘        │  │
│  • Payments │  └──────────────────────────────────────┘  │
│  • Budgets  │  ┌──────────────────────────────────────┐  │
│  • Reports  │  │ Pending Approvals (23)               │  │
│             │  │ • 12 Expenses awaiting approval      │  │
│             │  │ • 8 Purchase Orders pending          │  │
│             │  │ • 3 Invoices to be approved          │  │
│             │  └──────────────────────────────────────┘  │
│             │  ┌──────────────────────────────────────┐  │
│             │  │ Monthly Expense Trend (Chart)        │  │
│             │  │ [Bar Chart showing expenses]         │  │
│             │  └──────────────────────────────────────┘  │
│             │  ┌──────────────────────────────────────┐  │
│             │  │ Budget Utilization by Category       │  │
│             │  │ Salaries: ████████░░ 80%             │  │
│             │  │ Utilities: ██████░░░░ 60%            │  │
│             │  │ Supplies: █████░░░░░ 50%             │  │
│             │  └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 2.3 Financial Overview Cards
**Component**: MetricCard

| Metric | Value | Sub-text | Icon | Color |
|--------|-------|----------|------|-------|
| Total Budget | ₹12 Crores | FY 2025-26 | 💰 | Green |
| Spent to Date | ₹8 Crores | 67% utilized | 📊 | Blue |
| Remaining | ₹4 Crores | 33% available | 💵 | Green |
| Pending Payments | ₹50 Lakhs | 45 invoices | ⏳ | Orange |

**Visual Treatment**:
- White background
- Subtle shadow: `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- Hover effect: slight scale and shadow increase
- Number: 28px bold
- Label: 14px gray-600

### 2.4 Pending Approvals Section
**Component**: ActionList

- **Expenses Pending** (12)
  - Click → Navigate to Expenses with filter: `status=pending_approval`
  - Badge showing count in orange

- **Purchase Orders Pending** (8)
  - Click → Navigate to PO list filtered
  - Badge in orange

- **Invoices to Approve** (3)
  - Click → Navigate to Invoices
  - Badge in orange

**Design**:
```html
<div class="bg-white rounded-lg shadow p-6">
  <h3 class="text-lg font-semibold mb-4">Pending Approvals (23)</h3>
  <ul class="space-y-3">
    <li class="flex justify-between items-center p-3 hover:bg-gray-50 rounded cursor-pointer">
      <span>📄 Expenses awaiting approval</span>
      <span class="bg-orange-100 text-orange-600 px-3 py-1 rounded-full">12</span>
    </li>
    <!-- More items -->
  </ul>
</div>
```

### 2.5 Monthly Expense Trend Chart
**Component**: BarChart (Recharts)

- **X-axis**: Last 12 months
- **Y-axis**: Amount in Lakhs
- **Bars**: Green for each month
- **Tooltip**: Shows exact amount
- **Height**: 300px

---

## 3. Expense Management

### 3.1 Expense List Page

**URL**: `/expenses`

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ Expenses                          [+ New Expense]    │
├─────────────────────────────────────────────────────┤
│ Filters:                                            │
│ [Category ▾] [Status ▾] [Date Range] [Search...]  │
├─────────────────────────────────────────────────────┤
│ ╔═══════╦═══════════╦════════╦═══════╦══════════╗  │
│ ║ Date  ║ Category  ║ Amount ║ Vendor║ Status   ║  │
│ ╠═══════╬═══════════╬════════╬═══════╬══════════╣  │
│ ║10/20  ║Utilities  ║₹25,000 ║ABC Ltd║🟢Approved║  │
│ ║10/19  ║Supplies   ║₹15,000 ║XYZ Co ║🟡Pending ║  │
│ ║10/18  ║Maintenance║₹50,000 ║DEF Inc║🟢Approved║  │
│ ╚═══════╩═══════════╩════════╩═══════╩══════════╝  │
│ [← 1 2 3 4 5 →]                                    │
└─────────────────────────────────────────────────────┘
```

**Filters**:
- **Category Dropdown**: All / Salaries / Utilities / Supplies / Maintenance / Transport / Infrastructure / Miscellaneous
- **Status Dropdown**: All / Draft / Pending Approval / Approved / Rejected / Paid
- **Date Range Picker**: From - To dates
- **Search**: By description, expense number, vendor name

**Table Columns**:
1. **Date** (sortable)
2. **Expense #** (clickable → detail page)
3. **Category** (badge with icon)
4. **Description**
5. **Amount** (₹ formatted, right-aligned)
6. **Vendor** (if applicable)
7. **GL Code**
8. **Status** (badge with color coding)
9. **Actions** (Edit / Delete / Submit for draft expenses)

**Status Badge Colors**:
- Draft: Gray
- Pending Approval: Orange
- Approved: Green
- Rejected: Red
- Paid: Blue

### 3.2 Create/Edit Expense Form

**URL**: `/expenses/create` or `/expenses/{id}/edit`

**Form Layout**:
```html
<form class="max-w-4xl mx-auto bg-white rounded-lg shadow p-6">
  <h2 class="text-2xl font-semibold mb-6">Record New Expense</h2>
  
  <div class="grid grid-cols-2 gap-6">
    <!-- Column 1 -->
    <div>
      <label>Category *</label>
      <select required>
        <option>Salaries</option>
        <option>Utilities</option>
        <option>Supplies</option>
        <option>Maintenance</option>
        <option>Transport</option>
        <option>Infrastructure</option>
        <option>Miscellaneous</option>
      </select>
    </div>
    
    <div>
      <label>Amount (₹) *</label>
      <input type="number" step="0.01" required />
    </div>
    
    <div>
      <label>Expense Date *</label>
      <input type="date" required />
    </div>
    
    <div>
      <label>GL Code *</label>
      <select required>
        <option>EXP-SAL-001 - Faculty Salaries</option>
        <option>EXP-UTL-001 - Electricity</option>
        <!-- More options -->
      </select>
    </div>
    
    <div class="col-span-2">
      <label>Description *</label>
      <textarea rows="3" required></textarea>
    </div>
    
    <div>
      <label>Vendor (optional)</label>
      <select>
        <option>-- Select Vendor --</option>
        <option>ABC Supplies Pvt Ltd</option>
        <option>XYZ Services Co</option>
      </select>
    </div>
    
    <div>
      <label>Payment Mode</label>
      <select>
        <option>Cash</option>
        <option>Cheque</option>
        <option>NEFT</option>
        <option>RTGS</option>
        <option>UPI</option>
      </select>
    </div>
    
    <div>
      <label>Invoice Number (optional)</label>
      <input type="text" />
    </div>
    
    <div>
      <label>Attach Receipt/Bill *</label>
      <input type="file" accept="image/*,application/pdf" />
      <p class="text-sm text-gray-500">Required for expenses > ₹5,000</p>
    </div>
    
    <div class="col-span-2">
      <label>Notes (optional)</label>
      <textarea rows="2"></textarea>
    </div>
  </div>
  
  <div class="mt-6 flex gap-4">
    <button type="submit" name="action" value="save_draft" class="btn-secondary">
      Save as Draft
    </button>
    <button type="submit" name="action" value="submit" class="btn-primary">
      Save & Submit for Approval
    </button>
    <button type="button" class="btn-ghost" onclick="history.back()">
      Cancel
    </button>
  </div>
</form>
```

**Validation Rules**:
- Amount must be > 0
- Receipt/bill mandatory if amount > ₹5,000
- All required fields must be filled
- Date cannot be in future

### 3.3 Expense Detail Page

**URL**: `/expenses/{id}`

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ Expense Details                      [Edit] [Delete] │
├─────────────────────────────────────────────────────┤
│ Expense #: EXP-2025-001234            Status: 🟢     │
│                                                      │
│ Basic Information                                    │
│ ┌──────────────────────────────────────────────────┐│
│ │ Category: Utilities                              ││
│ │ Amount: ₹25,000.00                               ││
│ │ Date: October 20, 2025                           ││
│ │ GL Code: EXP-UTL-001 (Electricity Expense)       ││
│ │ Description: Monthly electricity bill for campus ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ Vendor Information                                   │
│ ┌──────────────────────────────────────────────────┐│
│ │ Vendor: ABC Electricity Services Ltd             ││
│ │ Invoice #: INV-2025-1234                         ││
│ │ Payment Mode: NEFT                               ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ Attachments                                          │
│ ┌──────────────────────────────────────────────────┐│
│ │ 📎 electricity_bill_oct_2025.pdf (1.2 MB)       ││
│ │    [View] [Download]                             ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ Approval Workflow                                    │
│ ┌──────────────────────────────────────────────────┐│
│ │ ✓ Submitted by: Accounts Admin (Oct 20, 10:30)  ││
│ │ ✓ Approved by: Principal (Oct 20, 14:15)        ││
│ │ ⏳ Pending payment processing                    ││
│ └──────────────────────────────────────────────────┘│
│                                                      │
│ Audit Trail                                          │
│ ┌──────────────────────────────────────────────────┐│
│ │ • Oct 20, 14:15 - Approved by Dr. Principal      ││
│ │ • Oct 20, 10:30 - Submitted by Accounts Admin    ││
│ │ • Oct 20, 10:25 - Created by Accounts Admin      ││
│ └──────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────┘
```

---

## 4. Vendor Management

### 4.1 Vendor List Page

**URL**: `/vendors`

**Table Columns**:
1. Vendor Code
2. Vendor Name (clickable)
3. Contact Person
4. Phone
5. Email
6. Category
7. Payment Terms
8. Total Transactions
9. Total Paid
10. Outstanding Amount
11. Status (Active/Inactive badge)
12. Actions (Edit / View)

### 4.2 Vendor Form

**Fields**:
- Vendor Name *
- Contact Person *
- Phone *
- Email *
- Category * (Dropdown: Office Supplies, Maintenance, Utilities, Professional Services, etc.)
- GST Number
- PAN Number
- Bank Account Number
- Bank Name
- IFSC Code
- Branch
- Address (Textarea)
- Payment Terms (e.g., "Net 30 days")

---

## 5. Purchase Orders

### 5.1 PO List Page

**URL**: `/purchase-orders`

**Table Columns**:
1. PO Number
2. PO Date
3. Vendor Name
4. Total Amount (₹)
5. Status (Draft/Pending/Approved/Partially Received/Fully Received)
6. Delivery Date
7. Actions (View / Edit / Approve / GRN)

### 5.2 Create PO Form

**Multi-step form**:

**Step 1: Basic Details**
- Vendor * (Searchable dropdown)
- PO Date *
- Expected Delivery Date *
- Reference Number (optional)

**Step 2: Line Items**
- Item Name *
- Description
- Quantity *
- Unit (pcs, kg, liters, etc.)
- Unit Price *
- GST Rate (0%, 5%, 12%, 18%, 28%)
- Total (auto-calculated)

[+ Add Item] button to add more rows

**Step 3: Terms & Conditions**
- Terms textarea (pre-filled with default terms)
- Notes (optional)

**Summary Section** (sticky on right):
```
Subtotal: ₹50,000
GST: ₹9,000
Grand Total: ₹59,000

[Save as Draft]
[Submit for Approval]
```

### 5.3 Goods Receipt Note (GRN) Form

**URL**: `/purchase-orders/{id}/grn`

**Layout**:
```
Record Goods Receipt for PO-2025-001234

PO Items:
┌─────────────────────────────────────────────────┐
│ Item         Ordered  Received  Pending  Receive│
├─────────────────────────────────────────────────┤
│ Laptops        10       8         2      [5]    │
│ Mice           20      20         0      [0]    │
│ Keyboards      20      15         5      [5]    │
└─────────────────────────────────────────────────┘

Receipt Date: [Date Picker] *
Notes: [Textarea]

[Record Receipt]
```

---

## 6. Invoices & Payments

### 6.1 Invoice List

**Table Columns**:
1. Invoice Number
2. Vendor Name
3. PO Number (if linked)
4. Invoice Date
5. Due Date
6. Amount (₹)
7. Paid Amount
8. Outstanding
9. Status (Pending/Approved/Scheduled/Paid/Overdue)
10. Actions (Approve / Schedule Payment / View)

**Overdue Invoices** - Highlighted in red background

### 6.2 Payment Processing

**Batch Payment Screen**:
```
┌─────────────────────────────────────────────────┐
│ Batch Payment Processing                        │
├─────────────────────────────────────────────────┤
│ Select Payments to Process:                     │
│ ☐ Select All                                    │
│                                                  │
│ ☑ INV-001 | ABC Ltd | ₹25,000 | Due: Oct 25   │
│ ☑ INV-002 | XYZ Co  | ₹15,000 | Due: Oct 25   │
│ ☐ INV-003 | DEF Inc | ₹50,000 | Due: Oct 30   │
│                                                  │
│ Payment Date: [Oct 25, 2025]                    │
│ Bank Account: [SBI - Acc ending 1234]           │
│ Payment Mode: [NEFT ▾]                          │
│                                                  │
│ Total Selected: ₹40,000                         │
│                                                  │
│ [Process Batch Payment]                         │
└─────────────────────────────────────────────────┘
```

---

## 7. Budget Monitoring

### 7.1 Budget Overview Page

**URL**: `/budgets`

**Layout**:
```
┌─────────────────────────────────────────────────────┐
│ Budget Monitoring - FY 2025-26                      │
├─────────────────────────────────────────────────────┤
│ Overall Budget Utilization                          │
│ ████████████████████░░ 67% (₹8Cr / ₹12Cr)          │
├─────────────────────────────────────────────────────┤
│ Category-wise Budget                                │
│ ┌─────────────────────────────────────────────────┐│
│ │ Category     Allocated  Spent  Remaining  %    ││
│ ├─────────────────────────────────────────────────┤│
│ │ Salaries     ₹6.0 Cr   ₹4.8Cr ₹1.2Cr    80%   ││
│ │ Utilities    ₹1.5 Cr   ₹0.9Cr ₹0.6Cr    60%   ││
│ │ Supplies     ₹2.0 Cr   ₹1.0Cr ₹1.0Cr    50%   ││
│ │ Maintenance  ₹1.0 Cr   ₹0.7Cr ₹0.3Cr    70%   ││
│ │ Infrastructure₹1.0 Cr  ₹0.5Cr ₹0.5Cr    50%   ││
│ │ Miscellaneous₹0.5 Cr   ₹0.1Cr ₹0.4Cr    20%   ││
│ └─────────────────────────────────────────────────┘│
│                                                      │
│ Budget Alerts                                        │
│ ⚠️ Salaries budget at 80% - Monitor closely          │
│ ⚠️ Utilities budget at 60% - On track                │
└─────────────────────────────────────────────────────┘
```

**Visual Progress Bars**:
- Green: 0-70% utilization
- Orange: 70-90% utilization
- Red: 90-100% utilization

### 7.2 Variance Analysis

**Month-over-Month comparison**:
```
Variance Analysis - October 2025

Budget vs Actual:
┌──────────────────────────────────────────────────┐
│ Category      Budget   Actual  Variance  %Var   │
├──────────────────────────────────────────────────┤
│ Salaries      ₹50L     ₹52L    +₹2L      +4%    │
│ Utilities     ₹12L     ₹10L    -₹2L      -17%   │
│ Supplies      ₹15L     ₹18L    +₹3L      +20%   │
└──────────────────────────────────────────────────┘
```

---

## 8. Financial Reports

### 8.1 Reports Dashboard

**URL**: `/reports`

**Report Categories**:

1. **Profit & Loss Statement**
   - Date Range selector
   - [Generate P&L] button
   - Export: PDF, Excel

2. **Balance Sheet**
   - As of Date selector
   - [Generate Balance Sheet]
   - Export options

3. **Cash Flow Statement**
   - Date Range
   - [Generate Cash Flow]
   
4. **Expense Reports**
   - Category-wise
   - Vendor-wise
   - Monthly trend
   
5. **Vendor Reports**
   - Payment history
   - Outstanding amounts
   - Aging analysis (30/60/90 days)

### 8.2 P&L Report Display

**Layout**:
```
Profit & Loss Statement
For the period: April 1, 2025 to October 31, 2025

REVENUE
  Fee Collections               ₹10,00,00,000
  Other Income                  ₹   50,00,000
  ─────────────────────────────────────────────
  Total Revenue                 ₹10,50,00,000

EXPENSES
  Faculty Salaries              ₹4,80,00,000
  Staff Salaries                ₹1,20,00,000
  Utilities                     ₹   90,00,000
  Maintenance                   ₹   70,00,000
  Supplies                      ₹1,00,00,000
  Miscellaneous                 ₹   40,00,000
  ─────────────────────────────────────────────
  Total Expenses                ₹8,00,00,000

NET PROFIT                      ₹2,50,00,000

[Export to PDF] [Export to Excel] [Print]
```

---

## 9. Navigation & Layout

### 9.1 Header
```html
<header class="bg-white shadow h-16 flex items-center justify-between px-6">
  <div class="flex items-center gap-4">
    <img src="/logo.svg" class="h-10" />
    <span class="text-xl font-semibold">College Accounts Admin</span>
  </div>
  
  <div class="flex items-center gap-4">
    <span class="text-sm text-gray-600">St. Xavier's College</span>
    <button class="relative">
      🔔 <span class="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5">5</span>
    </button>
    <div class="flex items-center gap-2 cursor-pointer">
      <img src="/avatar.jpg" class="w-8 h-8 rounded-full" />
      <span>Rajesh Kumar</span>
      <svg>▾</svg>
    </div>
  </div>
</header>
```

### 9.2 Sidebar Navigation

**Width**: 240px
**Background**: Gray-900 (dark)
**Text**: White

**Menu Items**:
- 🏠 Dashboard
- 💰 Expenses
  - List Expenses
  - Create Expense
  - Expense Reports
- 👥 Vendors
  - Vendor List
  - Add Vendor
  - Payment History
- 📦 Purchase Orders
  - PO List
  - Create PO
  - Goods Receipt
- 📄 Invoices
  - Invoice List
  - Pending Approvals
- 💳 Payments
  - Payment List
  - Batch Payments
  - Bank Accounts
- 📊 Budgets
  - Budget Overview
  - Variance Analysis
- 📈 Reports
  - P&L Statement
  - Balance Sheet
  - Cash Flow
  - Custom Reports

**Active State**: Primary color background, white text

---

## 10. Responsive Design

### 10.1 Breakpoints
```css
/* Mobile */
@media (max-width: 640px) {
  /* Sidebar collapses to hamburger menu */
  /* Tables scroll horizontally */
  /* Forms stack vertically */
}

/* Tablet */
@media (min-width: 641px) and (max-width: 1024px) {
  /* Sidebar remains visible but narrower */
  /* Dashboard cards 2 columns */
}

/* Desktop */
@media (min-width: 1025px) {
  /* Full layout as designed */
  /* Dashboard cards 4 columns */
}
```

### 10.2 Mobile Optimizations
- Hamburger menu for sidebar
- Swipeable cards
- Bottom navigation for key actions
- Simplified tables (show only essential columns)
- Touch-friendly buttons (min 44px height)

---

*This comprehensive UI/UX specification ensures a consistent, intuitive, and efficient user experience for College Accounts Administrators managing college-level financial operations.*
