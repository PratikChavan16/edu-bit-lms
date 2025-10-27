# College Accounts Admin Portal - Feature Specifications

**Version**: 1.0.0  
**Last Updated**: October 25, 2025  
**Scope**: College-level accounting operations

---

## Feature 1: Expense Management

### Overview
Record, categorize, approve, and track all college expenses with GL code mapping and multi-level approvals.

### Key Capabilities
- Expense recording with category and GL code
- Document attachment (bills, receipts mandatory for >₹5,000)
- Multi-level approval workflow (amount-based routing)
- Budget availability check before approval
- Expense reports (daily, monthly, category-wise)

### User Stories
**US-1.1**: As College Accounts Admin, I want to record expenses with GL codes so that I maintain proper accounting  
**US-1.2**: As Principal, I want to approve expenses >₹50,000 so that large expenditures are verified  
**US-1.3**: As College Accounts Admin, I want to view budget utilization before approving expense so that I don't exceed budget

### Success Metrics
- Expense recording time: <3 minutes
- Approval turnaround: <24 hours
- Budget overrun: 0% (system prevents)
- Document attachment compliance: 100% for expenses >₹5,000

---

## Feature 2: Vendor Payment Processing

### Overview
Manage vendor invoices, approval workflow, payment scheduling, and NEFT/RTGS disbursement.

### Key Capabilities
- Vendor master data (GSTIN, PAN, bank details)
- Invoice recording with PO matching
- Payment approval workflow
- Payment scheduling based on due dates
- NEFT/RTGS initiation with UTR tracking
- Aging reports (30/60/90 days overdue)

### User Stories
**US-2.1**: As College Accounts Admin, I want to record vendor invoice so that payment is scheduled  
**US-2.2**: As College Accounts Admin, I want to initiate NEFT payment so that vendor receives payment on time  
**US-2.3**: As Vendor, I want to check payment status so that I know when to expect payment

### Success Metrics
- Invoice processing time: <2 days
- Payment on-time rate: >90%
- NEFT success rate: 98%
- Vendor satisfaction: >4.0/5.0

---

## Feature 3: Purchase Order Management

### Overview
Create, approve, and track purchase orders with goods receipt and invoice reconciliation.

### Key Capabilities
- PO creation with line items
- Amount-based approval routing (<₹50K: Principal, >₹50K: Super Accountant)
- PO status tracking (Draft → Approved → GRN → Invoice → Paid)
- Goods Receipt Note (GRN) recording
- PO vs. Invoice matching (3-way match: PO + GRN + Invoice)

### User Stories
**US-3.1**: As College Accounts Admin, I want to create PO for lab equipment so that vendor knows approved items  
**US-3.2**: As Store Manager, I want to record goods receipt so that inventory is updated  
**US-3.3**: As College Accounts Admin, I want to match invoice with PO so that I verify quantities and amounts

### Success Metrics
- PO approval time: <1 day
- 3-way match accuracy: 98%
- Open PO tracking: 100%
- PO fulfillment rate: 95%

---

## Feature 4: Budget Monitoring

### Overview
Track budget allocation, utilization, and variance analysis at department and category levels.

### Key Capabilities
- Department-wise budget allocation
- Category-wise budget (Salaries, Utilities, Maintenance, etc.)
- Real-time utilization tracking
- Variance analysis (budget vs. actual)
- Budget alerts at 80% and 100% utilization
- Budget reallocation requests

### User Stories
**US-4.1**: As Principal, I want to allocate ₹2 Crores to Engineering department so that budget is distributed  
**US-4.2**: As College Accounts Admin, I want to see real-time budget utilization so that I track spending  
**US-4.3**: As HOD, I want to request budget reallocation so that I can handle unexpected expenses

### Success Metrics
- Budget allocation time: <1 day
- Utilization tracking accuracy: 100%
- Budget overrun prevention: 100%
- Reallocation approval time: <3 days

---

## Feature 5: Petty Cash Management

### Overview
Manage petty cash register, reimbursements, replenishment, and reconciliation.

### Key Capabilities
- Petty cash register (opening balance, receipts, payments, closing balance)
- Reimbursement requests (faculty, staff for travel, supplies)
- Approval workflow for reimbursements
- Cash replenishment from bank
- Expense voucher generation
- Monthly cash book reconciliation

### User Stories
**US-5.1**: As Faculty, I want to submit reimbursement request for travel so that I get reimbursed  
**US-5.2**: As College Accounts Admin, I want to approve reimbursements so that cash is paid  
**US-5.3**: As College Accounts Admin, I want to reconcile petty cash so that no discrepancies exist

### Success Metrics
- Reimbursement approval time: <2 days
- Cash book accuracy: 100%
- Replenishment frequency: Bi-weekly
- Discrepancy rate: <1%

---

## Feature 6: Asset Accounting

### Overview
Maintain fixed asset register, calculate depreciation, track asset lifecycle, and generate NBV reports.

### Key Capabilities
- Fixed asset registration (purchase, category, cost, useful life)
- Depreciation calculation (Straight Line Method, Written Down Value)
- Asset disposal accounting (sale, scrap, write-off)
- Asset transfer between departments
- Net Book Value (NBV) tracking
- Asset verification audits

### User Stories
**US-6.1**: As College Accounts Admin, I want to register new asset so that depreciation is calculated  
**US-6.2**: As College Accounts Admin, I want to calculate annual depreciation so that books are updated  
**US-6.3**: As College Admin, I want to transfer asset to another department so that location is updated

### Success Metrics
- Asset registration time: <10 minutes
- Depreciation accuracy: 100%
- Asset tracking accuracy: 98%
- Audit compliance: 100%

---

## Feature 7: Financial Reporting

### Overview
Generate monthly, quarterly, and annual financial reports including P&L, Balance Sheet, and Cash Flow.

### Key Capabilities
- Profit & Loss statement (revenue, expenses, net profit)
- Balance Sheet (assets, liabilities, equity)
- Cash Flow statement (operating, investing, financing activities)
- Budget variance reports
- Department-wise expense reports
- Scheduled report generation and email

### User Stories
**US-7.1**: As Principal, I want to view monthly P&L so that I track financial performance  
**US-7.2**: As Super Accountant, I want to consolidate all college reports so that I generate university-level reports  
**US-7.3**: As Auditor, I want to download annual financial statements so that I conduct audit

### Success Metrics
- Report generation time: <1 minute
- Report accuracy: 100%
- Scheduled report delivery: 100%
- Audit compliance: 100%

---

## Feature 8: Bank Reconciliation

### Overview
Reconcile bank statements with recorded payments, identify discrepancies, and generate BRS.

### Key Capabilities
- Bank statement import (Excel, CSV, PDF with OCR)
- Auto-matching payments with bank transactions
- Manual reconciliation for unmatched items
- Unreconciled items aging report
- Monthly Bank Reconciliation Statement (BRS)
- Reconciliation variance tracking

### User Stories
**US-8.1**: As College Accounts Admin, I want to import bank statement so that reconciliation is automated  
**US-8.2**: As College Accounts Admin, I want to match payments with bank transactions so that I confirm clearance  
**US-8.3**: As Principal, I want to see unreconciled items so that I investigate discrepancies

### Success Metrics
- Auto-match rate: 90%
- Manual reconciliation time: <2 hours/month
- Unreconciled items: <5%
- BRS completion: Within 7 days of month-end

---

## Implementation Priority

| Feature | Priority | Complexity | Implementation Order |
|---------|----------|------------|---------------------|
| Expense Management | P0 | Medium | 1 |
| Vendor Payment Processing | P0 | High | 2 |
| Budget Monitoring | P0 | Medium | 3 |
| Purchase Order Management | P0 | High | 4 |
| Financial Reporting | P0 | High | 5 |
| Bank Reconciliation | P1 | Medium | 6 |
| Petty Cash Management | P1 | Low | 7 |
| Asset Accounting | P1 | Medium | 8 |

---

**Feature Specifications Complete** ✅  
**Budget Managed**: ₹12 Crores/year (college-level)
