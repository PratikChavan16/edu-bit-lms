# College Accounts Admin Portal - Complete Documentation

**Role:** College Accounts Admin (College-Level Accountant)  
**Port:** 3012  
**System:** BitFlow Nova LMS  
**Version:** 1.0.0  
**Status:** Production-Ready Documentation  
**Last Updated:** October 25, 2025

---

## 📋 Executive Summary

### Purpose

The **College Accounts Admin Portal** is the **college-level accounting system** for expense tracking, vendor payments, budget monitoring, financial reporting, and day-to-day financial operations for a single college. This portal serves the College Accounts Admin role - the college accountant who manages all financial transactions excluding student fee collection.

### Business Value

| Metric | Value | Impact |
|--------|-------|--------|
| **Annual College Budget** | ₹12 Crores | Single college operational budget |
| **Expense Transactions** | 3,000+ transactions/year | Vendor payments, utilities, supplies |
| **Vendors Managed** | 80+ active vendors | AMCs, supplies, services |
| **Purchase Orders** | 500+ POs/year | Procurement management |
| **Invoice Processing** | 2,500+ invoices/year | Payment processing |
| **Financial Reports** | 100+ reports/year | Monthly, quarterly, annual reports |

### Critical Success Factors

✅ **Expense Tracking**: Categorized expense recording with GL codes  
✅ **Vendor Payment Management**: Invoice approval, payment scheduling, NEFT processing  
✅ **Budget Monitoring**: Real-time budget utilization vs. allocated  
✅ **Purchase Order Management**: PO creation, approval, goods receipt  
✅ **Financial Reporting**: P&L, Balance Sheet, Cash Flow, Variance analysis  
✅ **Audit Trail**: Complete transaction history with document attachments  

---

## Core Features

### Feature 1: Expense Management
- Expense recording with GL code mapping
- Category-wise expense tracking (Salaries, Utilities, Supplies, Maintenance, etc.)
- Multi-level approval workflow (College Accounts Admin → Principal → Super Accountant)
- Receipt/bill attachment (mandatory for expenses >₹5,000)
- Expense reports (daily, monthly, annual)

### Feature 2: Vendor Payment Processing
- Vendor master data management
- Invoice recording and approval
- Payment scheduling (due date tracking)
- NEFT/RTGS payment initiation
- Payment status tracking (Pending → Approved → Paid → Reconciled)

### Feature 3: Purchase Order Management
- PO creation with line items
- Approval workflow (amount-based)
- Goods receipt recording
- PO vs. Invoice reconciliation
- Open PO tracking

### Feature 4: Budget Monitoring
- Department-wise budget allocation
- Real-time budget utilization tracking
- Budget vs. actual variance analysis
- Budget alerts (80% utilization warning)
- Budget reallocation requests

### Feature 5: Petty Cash Management
- Petty cash register
- Reimbursement requests (faculty, staff)
- Petty cash replenishment
- Cash book reconciliation
- Expense voucher generation

### Feature 6: Asset Accounting
- Fixed asset register
- Depreciation calculation (SLM, WDV)
- Asset disposal accounting
- Asset transfer between departments
- Net book value tracking

### Feature 7: Financial Reporting
- Profit & Loss statement (monthly, annual)
- Balance Sheet
- Cash Flow statement
- Budget variance reports
- Department-wise expense reports

### Feature 8: Bank Reconciliation
- Bank statement import (Excel/CSV)
- Auto-matching with payments
- Manual reconciliation for mismatches
- Unreconciled items aging
- Monthly BRS (Bank Reconciliation Statement)

---

## Technical Architecture

**Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS  
**Backend**: Laravel 11, PHP 8.2, PostgreSQL 16, Redis 7.2  
**Infrastructure**: AWS EC2, S3 (document storage)  
**Integrations**: Bank APIs (NEFT/RTGS), Super Accountant portal, College Admin portal

---

## Key Workflows

### Workflow 1: Expense Recording & Approval
1. College Accounts Admin records expense with bill attachment
2. System validates budget availability
3. Auto-route to Principal for approval (if >₹50,000)
4. Principal approves/rejects
5. If approved, Super Accountant receives for payment processing
6. Payment scheduled based on due date
7. NEFT/RTGS initiated
8. Payment confirmation updates status

### Workflow 2: Purchase Order Processing
1. Department requests purchase (via College Admin)
2. College Accounts Admin creates PO
3. Approval workflow based on amount
4. PO emailed to vendor
5. Goods received, GRN (Goods Receipt Note) created
6. Vendor submits invoice
7. Invoice matched with PO and GRN
8. Payment processed

### Workflow 3: Monthly Financial Reporting
1. Close month-end transactions
2. Generate P&L statement
3. Generate Balance Sheet
4. Calculate variances (budget vs. actual)
5. Review by College Accounts Admin
6. Submit to Principal and Super Accountant
7. Archive reports for audit

---

## Success Criteria

**Must-Have**:
✅ Expense recording with GL code mapping  
✅ Vendor payment tracking with approval workflow  
✅ Budget monitoring with utilization alerts  
✅ Purchase order management  
✅ Monthly financial reports (P&L, Balance Sheet)  

**Should-Have**:
⚡ Bank reconciliation automation  
⚡ Petty cash management  
⚡ Asset accounting with depreciation  

**Nice-to-Have**:
💡 AI-powered expense categorization  
💡 Predictive budget forecasting  
💡 Automated invoice data extraction (OCR)  

---

**Portal Status**: ✅ Documentation Complete  
**Budget Managed**: ₹12 Crores/year (single college)
