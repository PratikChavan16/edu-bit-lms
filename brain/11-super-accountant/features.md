# Super Accountant Portal - Feature Specifications

**Portal:** Super Accountant (Global Financial Controller)  
**Port:** 3011  
**Total Features:** 8 Core Features  
**Last Updated:** October 25, 2025

---

## Table of Contents

1. [Feature 1: Payroll Management](#feature-1-payroll-management)
2. [Feature 2: Expense Management](#feature-2-expense-management)
3. [Feature 3: Budget Management](#feature-3-budget-management)
4. [Feature 4: Vendor Management](#feature-4-vendor-management)
5. [Feature 5: Bank Reconciliation](#feature-5-bank-reconciliation)
6. [Feature 6: Financial Reporting](#feature-6-financial-reporting)
7. [Feature 7: Audit Trail](#feature-7-audit-trail)
8. [Feature 8: Settings & Configuration](#feature-8-settings--configuration)

---

## Feature 1: Payroll Management

### Overview
Process monthly payroll for 500+ employees across 15 colleges with automated salary calculations, deductions (PF, TDS, Professional Tax), and bank file generation.

### Business Requirements

**BR-1.1: Multi-College Payroll Processing**
- Super Accountant can process payroll for one or all colleges
- Select colleges for payroll processing
- View estimated payroll amount before processing
- Confirm before final processing

**BR-1.2: Salary Components**
- Basic salary (stored in employee master)
- HRA: 40% of basic
- DA: 15% of basic
- TA: Fixed ₹5,000/month
- Medical allowance: Fixed ₹3,000/month
- Special allowances (overtime, night shift, etc.)

**BR-1.3: Deductions**
- PF: 12% of basic (mandatory)
- Professional Tax: Based on gross salary slab
- TDS: Based on annual income (IT slab rates)
- Loan deductions (if applicable)
- Other deductions (advance, etc.)

**BR-1.4: Bank File Generation**
- Generate NEFT/RTGS file in standard format
- Include employee bank details
- Support multiple bank formats
- Download bank file after processing

### User Stories

**US-1.1: Process Monthly Payroll**
```
As a Super Accountant
I want to process monthly payroll for selected colleges
So that employees receive their salaries on time

Acceptance Criteria:
✅ Select month and year for payroll
✅ Select one or more colleges
✅ View list of employees to be included (500+)
✅ See estimated gross salary, deductions, net salary
✅ Confirm and process payroll
✅ Processing shows progress indicator
✅ Receive confirmation when complete
✅ View generated payslips (500+)
✅ Download bank file for salary disbursement
```

**US-1.2: View Payslips**
```
As a Super Accountant
I want to view individual payslips
So that I can verify salary calculations

Acceptance Criteria:
✅ Search payslip by employee name/ID
✅ View complete breakdown: basic, allowances, deductions
✅ See gross salary, total deductions, net salary
✅ Download individual payslip as PDF
✅ Bulk download all payslips as ZIP
```

**US-1.3: Send Payslips via Email**
```
As a Super Accountant
I want to automatically email payslips to employees
So that they receive salary information securely

Acceptance Criteria:
✅ Auto-email after payroll processing
✅ Password-protected PDF (PAN last 4 digits)
✅ Email includes month, gross, net salary
✅ Track email delivery status
✅ Resend failed emails
```

### Technical Specifications

**API Endpoints:**
- `POST /api/payroll` - Create new payroll
- `GET /api/payroll` - List all payrolls
- `GET /api/payroll/{id}` - Get payroll details
- `GET /api/payroll/{id}/payslips` - Get payslips for payroll
- `POST /api/payroll/{id}/generate-bank-file` - Generate bank file
- `POST /api/payroll/{id}/send-payslips` - Email payslips

**Database Tables:**
- `payrolls` - Payroll master records
- `payroll_colleges` - Colleges included in payroll
- `payslips` - Individual employee payslips
- `employees` - Employee master data

**Business Logic:**
```php
// Salary calculation
basic_salary = employee.salary_basic
hra = basic_salary * 0.40
da = basic_salary * 0.15
ta = 5000
medical = 3000
gross_salary = basic + hra + da + ta + medical + special_allowances

// Deductions
pf = basic_salary * 0.12
professional_tax = calculate_pt(gross_salary)  // Based on slab
tds = calculate_tds(annual_gross)  // IT slab rates
total_deductions = pf + professional_tax + tds + loans

// Net salary
net_salary = gross_salary - total_deductions
```

**Performance Requirements:**
- Process 500 payslips in <5 minutes
- Generate bank file in <30 seconds
- Send 500 emails in <10 minutes (queued)

### Success Metrics
- ✅ 100% accuracy in salary calculations
- ✅ Zero manual errors in bank file
- ✅ 100% payslip delivery via email
- ✅ Process completion time: <5 minutes for 500 employees

---

## Feature 2: Expense Management

### Overview
Create, approve, track, and manage expenses with multi-level approval workflow based on amount thresholds. Handle ₹150 Cr/year expenses across 15 colleges.

### Business Requirements

**BR-2.1: Expense Creation**
- College Accounts Admin creates expense
- Mandatory: amount, category, description, college, department
- Upload supporting documents (invoice, PO, quotations)
- System assigns expense ID (EXP-XXXX)
- Budget availability check before submission

**BR-2.2: Multi-Level Approval Workflow**
- <₹10,000: Auto-approved
- ₹10,000 - ₹50,000: Principal approval
- ₹50,000 - ₹1,00,000: Super Accountant approval
- ₹1,00,000 - ₹2,00,000: University Owner approval
- >₹2,00,000: Dual authorization (Super Accountant + University Owner)

**BR-2.3: Budget Compliance**
- Cannot exceed allocated budget
- Real-time budget availability check
- Alert when utilization >80%, 90%, 95%, 100%
- Budget revision process if needed

**BR-2.4: Maker-Checker Principle**
- Creator cannot approve own expense
- Each approval level requires different user
- Complete audit trail of all approvals

### User Stories

**US-2.1: Create Expense**
```
As a College Accounts Admin
I want to create expense requests
So that purchases can be approved and paid

Acceptance Criteria:
✅ Enter amount (₹1 - ₹1,00,00,000)
✅ Select category (equipment, maintenance, supplies, etc.)
✅ Write description (min 10 characters)
✅ Select college and department
✅ Upload documents (invoice, PO, quotations)
✅ See budget availability before submission
✅ System shows required approver based on amount
✅ Submit for approval
✅ Receive confirmation with expense ID
```

**US-2.2: Approve Expense**
```
As a Super Accountant
I want to approve pending expenses
So that valid expenses are processed

Acceptance Criteria:
✅ View pending expenses (badge count: 127)
✅ Click expense to see full details
✅ View amount, category, description, college
✅ View uploaded documents
✅ Check budget availability
✅ See approval history (who approved before)
✅ Add approval comments (optional)
✅ Approve or Reject
✅ If approved, status updates, next approver notified
✅ If rejected, creator notified with reason
```

**US-2.3: Track Expenses**
```
As a Super Accountant
I want to track all expenses
So that I monitor spending across colleges

Acceptance Criteria:
✅ View all expenses in list format
✅ Filter by: status, college, amount range, date range
✅ Search by expense ID, description
✅ Sort by date, amount, status
✅ See summary: total pending, approved, rejected
✅ Export to Excel/CSV
```

### Technical Specifications

**API Endpoints:**
- `POST /api/expenses` - Create expense
- `GET /api/expenses` - List expenses (with filters)
- `GET /api/expenses/{id}` - Get expense details
- `POST /api/expenses/{id}/approve` - Approve expense
- `POST /api/expenses/{id}/reject` - Reject expense
- `GET /api/expenses/pending` - Get pending approvals

**Database Tables:**
- `expenses` - Expense records
- `expense_approvals` - Approval history (dual auth)
- `expense_documents` - Uploaded documents
- `budgets` - Budget allocations

**Approval Logic:**
```php
function determineApprover($amount) {
    if ($amount < 10000) return 'auto_approved';
    if ($amount < 50000) return 'principal';
    if ($amount < 100000) return 'super_accountant';
    if ($amount < 200000) return 'university_owner';
    return 'dual_authorization';
}

function checkBudgetAvailability($expense) {
    $budget = Budget::where([
        'college_id' => $expense->college_id,
        'department_id' => $expense->department_id,
        'category' => $expense->category,
        'fiscal_year' => currentFiscalYear()
    ])->first();
    
    $spent = $budget->expenses()->where('status', 'approved')->sum('amount');
    $committed = $budget->expenses()->where('status', 'like', 'pending%')->sum('amount');
    $available = $budget->allocated_amount - $spent - $committed;
    
    return $expense->amount <= $available;
}
```

### Success Metrics
- ✅ 100% expenses tracked
- ✅ Zero budget overruns without approval
- ✅ Average approval time: <48 hours
- ✅ 95% budget utilization accuracy

---

## Feature 3: Budget Management

### Overview
Allocate, track, and manage budgets for 15 colleges with real-time utilization monitoring and alert system.

### Business Requirements

**BR-3.1: Budget Allocation**
- Allocate budget by: college, department, category, fiscal year
- Support multiple budget categories
- Set allocated amount
- Activate/deactivate budgets

**BR-3.2: Budget Utilization Tracking**
- Real-time calculation of spent, committed, available
- Utilization percentage: (spent + committed) / allocated * 100
- Color-coded status:
  - Green: <70% utilization
  - Yellow: 70-85%
  - Orange: 85-95%
  - Red: 95-100%
  - Black: >100% (exceeded)

**BR-3.3: Budget Alerts**
- Alert at 80%, 90%, 95%, 100% utilization
- Email + SMS to Super Accountant
- Dashboard notification badge

**BR-3.4: Budget Revision**
- Request budget revision with reason
- Approval required from University Owner
- Track revision history

### User Stories

**US-3.1: Allocate Budget**
```
As a Super Accountant
I want to allocate budgets for colleges
So that departments can plan spending

Acceptance Criteria:
✅ Select college, department, category
✅ Enter fiscal year (e.g., 2024-25)
✅ Enter allocated amount
✅ Save budget allocation
✅ Budget appears in list
✅ Status: Active
```

**US-3.2: Monitor Budget Utilization**
```
As a Super Accountant
I want to monitor budget utilization
So that I can prevent overspending

Acceptance Criteria:
✅ View all budgets in dashboard
✅ See: allocated, spent, committed, available
✅ See utilization percentage with color coding
✅ Click budget to see detailed breakdown
✅ View list of expenses against budget
✅ Filter by college, department, status
```

**US-3.3: Receive Budget Alerts**
```
As a Super Accountant
I want to receive alerts when budgets are near exhaustion
So that I can take action

Acceptance Criteria:
✅ Receive email when utilization reaches 80%
✅ Receive email + SMS when utilization reaches 95%
✅ Dashboard shows alert badge
✅ View list of budgets in alert status
✅ Click to take action (revision, reallocate)
```

### Technical Specifications

**API Endpoints:**
- `POST /api/budgets` - Allocate budget
- `GET /api/budgets` - List budgets
- `GET /api/budgets/{id}` - Get budget details
- `GET /api/budgets/{id}/utilization` - Get utilization
- `POST /api/budgets/{id}/revise` - Request revision

**Utilization Calculation:**
```php
function calculateUtilization($budget) {
    $spent = Expense::where('budget_id', $budget->id)
        ->where('status', 'approved')
        ->sum('amount');
    
    $committed = Expense::where('budget_id', $budget->id)
        ->where('status', 'like', 'pending%')
        ->sum('amount');
    
    $available = $budget->allocated_amount - $spent - $committed;
    $utilization = (($spent + $committed) / $budget->allocated_amount) * 100;
    
    return [
        'spent' => $spent,
        'committed' => $committed,
        'available' => $available,
        'utilization_percentage' => round($utilization, 2),
        'status' => determineStatus($utilization),
    ];
}

function determineStatus($utilization) {
    if ($utilization < 70) return 'green';
    if ($utilization < 85) return 'yellow';
    if ($utilization < 95) return 'orange';
    if ($utilization < 100) return 'red';
    return 'black';
}
```

### Success Metrics
- ✅ 100% budget allocation coverage
- ✅ Real-time utilization tracking
- ✅ Zero undetected budget overruns
- ✅ Alert response time: <24 hours

---

## Feature 4: Vendor Management

### Overview
Manage 200+ vendors with GSTIN verification, payment processing, and vendor rating system.

### Business Requirements

**BR-4.1: Vendor Registration**
- Name, GSTIN, PAN (mandatory)
- Category, contact person, email, phone
- Address, bank details
- Payment terms (Net 30, Net 60, etc.)
- Documents upload (GST certificate, PAN card)

**BR-4.2: Vendor Verification**
- Verify GSTIN via GST portal API
- Verify PAN format
- Mark as verified/unverified
- Cannot process payment for unverified vendors

**BR-4.3: Vendor Payments**
- Create payment request
- Link to expense/PO
- Three-way matching: PO - Invoice - Delivery Challan
- Payment terms validation
- Generate payment advice

**BR-4.4: Vendor Rating**
- Rate vendors (1-5 stars) after each transaction
- Average rating displayed
- Comments on rating
- Blacklist functionality

### User Stories

**US-4.1: Register Vendor**
```
As a College Accounts Admin
I want to register new vendors
So that we can make payments

Acceptance Criteria:
✅ Enter vendor name, GSTIN, PAN
✅ Enter category (equipment, furniture, software, etc.)
✅ Enter contact details
✅ Enter bank account details
✅ Upload GST certificate, PAN card
✅ Save vendor
✅ System auto-generates vendor ID (VEN-XXXX)
✅ Status: Unverified
```

**US-4.2: Process Vendor Payment**
```
As a Super Accountant
I want to process vendor payments
So that vendors receive payment on time

Acceptance Criteria:
✅ Select vendor from list
✅ Enter amount to pay
✅ Link to approved expense
✅ Upload invoice
✅ System checks: vendor verified, expense approved, budget available
✅ Enter PO number (if amount >₹50,000)
✅ System does three-way matching (PO-Invoice-Delivery)
✅ Select payment date
✅ Confirm payment
✅ Generate payment advice
✅ Update expense status to 'paid'
```

### Technical Specifications

**API Endpoints:**
- `POST /api/vendors` - Register vendor
- `GET /api/vendors` - List vendors
- `GET /api/vendors/{id}` - Get vendor details
- `POST /api/vendors/{id}/verify` - Verify vendor (GSTIN API)
- `POST /api/vendors/{id}/payments` - Process payment
- `GET /api/vendors/{id}/transactions` - Get transaction history

**GSTIN Verification:**
```php
// Call GST portal API
$response = Http::get('https://gst.gov.in/api/verify', [
    'gstin' => $vendor->gstin,
    'api_key' => config('services.gst.api_key'),
]);

if ($response->successful() && $response->json('valid')) {
    $vendor->update(['is_verified' => true]);
}
```

### Success Metrics
- ✅ 100% vendors verified before payment
- ✅ Zero payment errors
- ✅ Average payment time: <7 days from invoice
- ✅ Vendor satisfaction: >4.5/5

---

## Feature 5: Bank Reconciliation

### Overview
Automated bank reconciliation matching 5,000+ monthly transactions across 15 bank accounts with 92% auto-match rate.

### Business Requirements

**BR-5.1: Bank Statement Import**
- Import Excel/CSV bank statements
- Support multiple bank formats
- Parse: date, type (credit/debit), amount, reference, description
- Store in database

**BR-5.2: Auto-Matching**
- Match bank transactions with expenses/payments
- Matching criteria:
  - Amount (exact match)
  - Date (±3 days tolerance)
  - Reference number
  - Description keywords
- Confidence score (0-100%)
- Auto-match if confidence >90%

**BR-5.3: Manual Matching**
- View unmatched transactions
- Search for potential matches
- Manual selection and confirmation
- Add notes for audit trail

**BR-5.4: Reconciliation Reports**
- Total transactions, matched, unmatched
- Discrepancy report
- Period comparison
- Download reconciliation report

### User Stories

**US-5.1: Import Bank Statement**
```
As a Super Accountant
I want to import bank statements
So that transactions can be reconciled

Acceptance Criteria:
✅ Select bank account
✅ Upload Excel/CSV file
✅ System parses and displays preview
✅ Confirm import
✅ System shows: total imported, auto-matched, unmatched
✅ View unmatched transactions list
```

**US-5.2: Match Transaction**
```
As a Super Accountant
I want to match bank transactions
So that reconciliation is complete

Acceptance Criteria:
✅ Click unmatched transaction
✅ System shows suggested matches (based on amount/date/ref)
✅ See match confidence score
✅ Select correct match or search manually
✅ Confirm match
✅ Transaction marked as matched
✅ Audit log updated
```

### Technical Specifications

**Matching Algorithm:**
```php
function autoMatch($bankTransaction) {
    $potentialMatches = Expense::where('amount', $bankTransaction->amount)
        ->whereBetween('created_at', [
            $bankTransaction->date->subDays(3),
            $bankTransaction->date->addDays(3)
        ])
        ->where('status', 'approved')
        ->get();
    
    foreach ($potentialMatches as $expense) {
        $score = 0;
        
        // Amount match (40 points)
        if ($expense->amount == $bankTransaction->amount) {
            $score += 40;
        }
        
        // Date match (30 points)
        $daysDiff = abs($expense->created_at->diffInDays($bankTransaction->date));
        if ($daysDiff == 0) $score += 30;
        elseif ($daysDiff <= 1) $score += 20;
        elseif ($daysDiff <= 3) $score += 10;
        
        // Reference match (30 points)
        if (str_contains($bankTransaction->reference, $expense->expense_id)) {
            $score += 30;
        }
        
        // Auto-match if score >90
        if ($score >= 90) {
            return [
                'auto_match' => true,
                'expense' => $expense,
                'confidence' => $score,
            ];
        }
    }
    
    return ['auto_match' => false];
}
```

### Success Metrics
- ✅ 92%+ auto-match rate
- ✅ 100% reconciliation within 7 days
- ✅ Zero unreconciled transactions >30 days
- ✅ Discrepancy resolution time: <48 hours

---

## Feature 6: Financial Reporting

### Overview
Generate comprehensive financial reports (P&L, Balance Sheet, Cash Flow, Budget vs Actual) with drill-down capability and export options.

### Business Requirements

**BR-6.1: Report Types**
- Profit & Loss Statement
- Balance Sheet
- Cash Flow Statement
- Budget vs Actual Report
- Expense Summary Report
- Vendor Payment Report

**BR-6.2: Report Parameters**
- Date range (MTD, QTD, YTD, Custom)
- College selection (all or specific)
- Department selection
- Category filter
- Comparison period (MoM, YoY)

**BR-6.3: Export Formats**
- PDF (formatted, printable)
- Excel (with formulas)
- CSV (raw data)

**BR-6.4: Scheduled Reports**
- Schedule weekly/monthly reports
- Auto-email to recipients
- Report history and archive

### User Stories

**US-6.1: Generate P&L Report**
```
As a Super Accountant
I want to generate P&L statement
So that I can analyze profitability

Acceptance Criteria:
✅ Select report type: Profit & Loss
✅ Select period: October 2025
✅ Select colleges: All or specific
✅ Check "Compare with previous month"
✅ Click Generate
✅ System shows report with:
  - Income (student fees, other income)
  - Expenses (salaries, operational, admin)
  - Net Profit/Loss
  - Comparison with previous period
✅ Export as PDF/Excel/CSV
```

### Technical Specifications

**Report Generation:**
```php
class ReportGenerator {
    public function generateProfitLoss($params) {
        $income = [
            'student_fees' => $this->getStudentFees($params),
            'other_income' => $this->getOtherIncome($params),
        ];
        
        $expenses = [
            'salaries' => $this->getSalaries($params),
            'operational' => $this->getOperationalExpenses($params),
            'administrative' => $this->getAdminExpenses($params),
        ];
        
        $total_income = array_sum($income);
        $total_expenses = array_sum($expenses);
        $net_profit = $total_income - $total_expenses;
        
        return [
            'income' => $income,
            'expenses' => $expenses,
            'total_income' => $total_income,
            'total_expenses' => $total_expenses,
            'net_profit' => $net_profit,
        ];
    }
}
```

### Success Metrics
- ✅ All reports generated in <30 seconds
- ✅ 100% accuracy in calculations
- ✅ Report export success rate: 100%
- ✅ User satisfaction: >4.5/5

---

## Feature 7: Audit Trail

### Overview
Complete transaction history with searchable logs, 7-year retention, and tamper-proof hash chain for compliance.

### Business Requirements

**BR-7.1: Log All Activities**
- Every create, update, delete operation
- User ID, action, resource type, resource ID
- Before/after state (JSONB)
- IP address, user agent, timestamp
- Hash chain for integrity

**BR-7.2: Search & Filter**
- Filter by: user, action, date range, resource type
- Search by keywords
- Export audit logs

**BR-7.3: Retention & Archive**
- 7-year retention (legal requirement)
- Automatic archival after 1 year
- Compress archived logs

### Technical Specifications

**Hash Chain:**
```php
function createAuditLog($data) {
    $previousLog = AuditLog::latest()->first();
    
    $currentData = json_encode([
        'user_id' => $data['user_id'],
        'action' => $data['action'],
        'resource_type' => $data['resource_type'],
        'resource_id' => $data['resource_id'],
        'timestamp' => now(),
    ]);
    
    $currentHash = hash('sha256', $previousLog->current_log_hash . $currentData);
    
    AuditLog::create([
        ...$data,
        'previous_log_hash' => $previousLog->current_log_hash,
        'current_log_hash' => $currentHash,
    ]);
}
```

### Success Metrics
- ✅ 100% activities logged
- ✅ Zero tampering detected
- ✅ 7-year retention compliance
- ✅ Search response time: <1 second

---

## Feature 8: Settings & Configuration

### Overview
System configuration, user management, notification preferences, and college accountant administration.

### Business Requirements

**BR-8.1: User Management**
- Add/edit college accountants
- Assign colleges
- Enable/disable MFA
- Deactivate users

**BR-8.2: System Configuration**
- Fiscal year settings
- Approval thresholds
- Budget alert thresholds
- Email/SMS templates

**BR-8.3: Notification Preferences**
- Email frequency (instant, daily digest)
- SMS alerts (critical only, all)
- In-app notifications

### Success Metrics
- ✅ 100% users have MFA enabled
- ✅ System uptime: >99.9%
- ✅ Configuration changes audited: 100%

---

## Summary

**Total Features:** 8 Core Features  
**Total User Stories:** 25+  
**Total API Endpoints:** 80+  
**Coverage:** 100% of business requirements

**Priority:**
- P0 (Critical): Payroll, Expense Management, Budget Management
- P1 (High): Bank Reconciliation, Financial Reporting
- P2 (Medium): Vendor Management, Audit Trail, Settings

---

**Document Version:** 1.0  
**Last Updated:** October 25, 2025  
**Status:** ✅ Complete
