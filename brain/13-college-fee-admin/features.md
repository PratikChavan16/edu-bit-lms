# College Fee Admin Portal - Feature Specifications

**Version**: 1.0.0  
**Last Updated**: October 25, 2025  
**Total Features**: 8 Core Features

---

## Feature 1: Fee Structure Management

### Overview
Define college-level fee structures with components, program-wise fees, category-based discounts, and year-wise variations.

### Business Requirements
- **Annual Fee Range**: ₹80,000 - ₹2,50,000 per student
- **Programs**: 10 programs (BE Computer, Mechanical, Civil, MBA, etc.)
- **Categories**: Open, OBC (10% discount), SC/ST (50% discount), EWS (20% discount)
- **Components**: Tuition, Library, Exam, Lab, Sports, Misc

### User Stories

**US-1.1**: Define Fee Components  
**As a** Fee Admin  
**I want to** define fee components (Tuition ₹1,20,000, Library ₹5,000, Exam ₹8,000)  
**So that** students see itemized fee structure

**Acceptance Criteria**:
- Component creation form with name, amount, GST applicability
- Reorder components via drag-drop
- Mark components as mandatory/optional
- Set component-level discounts (e.g., Library fee waived for scholarship students)

**US-1.2**: Program-Wise Fee Configuration  
**As a** Fee Admin  
**I want to** set different fees for BE Computer (₹1.5L) vs BE Civil (₹1.3L)  
**So that** each program has correct fee structure

**Acceptance Criteria**:
- Program selection dropdown
- Copy fee from another program (quick setup)
- Year-wise fee variation (First Year ₹1.5L, Second Year ₹1.4L)
- Bulk update across all years of a program

### Technical Specifications
**API Endpoints**:
```
GET /api/v1/fee-structure
POST /api/v1/fee-structure/components
PUT /api/v1/fee-structure/programs/{program_id}
```

**Database Tables**:
- `fee_components` (id, name, amount, gst_percent, is_mandatory)
- `program_fee_structure` (id, program_id, year, components_json, total_amount)

### Success Metrics
- Fee structure setup time: <2 hours for all programs
- Fee calculation accuracy: 100%
- Student fee preview: 100% match with defined structure

---

## Feature 2: Multi-Mode Payment Collection

### Overview
Accept payments via online (UPI/Cards/NetBanking), cash, cheque, DD, and NEFT with real-time confirmation.

### Business Requirements
- **Transaction Volume**: 15,000 payments/year
- **Online Payments**: 70% (10,500 transactions)
- **Offline Payments**: 30% (4,500 transactions)
- **Payment Success Rate**: 96% target

### User Stories

**US-2.1**: Online Payment (UPI/Cards/NetBanking)  
**As a** Student  
**I want to** pay fees using UPI/PhonePe  
**So that** payment is instant and receipt is immediate

**Acceptance Criteria**:
- Payment gateway integration (Razorpay/PayU)
- Support UPI, Credit/Debit cards, NetBanking, Wallets
- Payment amount pre-filled (₹75,000)
- Payment status: Success/Failed/Pending
- Auto-retry for failed payments
- Payment timeout: 15 minutes
- Receipt emailed within 30 seconds of success

**US-2.2**: Cash Payment at Counter  
**As a** Counter Staff  
**I want to** accept cash payment and print receipt immediately  
**So that** student doesn't wait

**Acceptance Criteria**:
- Enter payment amount, verify student ID
- Cash denomination breakdown (optional)
- Receipt printed via thermal printer <10 seconds
- Cash box running balance updated
- End-of-day cash deposit slip generation

**US-2.3**: Cheque/DD Payment  
**As a** Counter Staff  
**I want to** record cheque details (bank, cheque number, date)  
**So that** I can track realization

**Acceptance Criteria**:
- Cheque form: Bank name, Cheque/DD number, Date, Amount
- Photo capture of cheque (front + back)
- Status tracking: Submitted → Deposited → Realized → Bounced
- Bounce handling: Add ₹500 penalty, send notice to student
- PDC (Post-Dated Cheque) support with future date

### Technical Specifications
**API Endpoints**:
```
POST /api/v1/payments/online/initiate
POST /api/v1/payments/online/callback
POST /api/v1/payments/cash
POST /api/v1/payments/cheque
PUT /api/v1/payments/cheque/{id}/status
```

**Payment Gateway Integration**:
- Razorpay: Webhook for payment status
- Callback URL: /api/v1/payments/razorpay/callback
- Signature verification (SHA-256 HMAC)

### Success Metrics
- Online payment success rate: 96%
- Cash payment processing: <5 minutes
- Cheque realization rate: 95%
- Payment gateway uptime: 99.5%

---

## Feature 3: Receipt Generation & Verification

### Overview
Auto-generate digital receipts with QR code, email delivery, print support, and public verification portal.

### Business Requirements
- **Receipt Volume**: 30,000 receipts/year
- **Digital Receipts**: 85% (25,500)
- **Printed Receipts**: 15% (4,500)

### User Stories

**US-3.1**: Digital Receipt with QR Code  
**As a** Student  
**I want to** receive receipt PDF via email with QR code  
**So that** I can submit to scholarship office

**Acceptance Criteria**:
- Receipt format: SPCE/FEE/2025/12345
- Receipt details: Student name, Roll number, Program, Year, Payment date, Amount, Mode, Transaction ID
- QR code encodes: Receipt number + Amount + Date + Hash (SHA-256)
- College logo and letterhead
- Receipt emailed within 30 seconds
- Receipt downloadable from Student Portal

**US-3.2**: Receipt Verification (Public Portal)  
**As a** Bank Officer  
**I want to** verify receipt authenticity using receipt number  
**So that** I confirm student paid fees

**Acceptance Criteria**:
- Public page: /verify-receipt (no login required)
- Input: Receipt number (SPCE/FEE/2025/12345)
- Output: Valid/Invalid, Student name, Amount, Date
- QR code scan via mobile redirects to verification page
- Verification log (track who verified and when)

### Technical Specifications
**API Endpoints**:
```
GET /api/v1/receipts/{id}/download
GET /api/v1/receipts/verify/{receipt_number}
POST /api/v1/receipts/duplicate-request
```

**PDF Generation**:
- Library: `barryvdh/laravel-dompdf`
- Template: HTML with CSS (college branding)
- QR code: `simplesoftwareio/simple-qrcode`

### Success Metrics
- Receipt generation time: <30 seconds
- Email delivery rate: 100%
- Duplicate receipt requests: <2%
- Verification requests: Track adoption

---

## Feature 4: Installment Management

### Overview
Flexible payment plans with installments, due date tracking, late fee calculation, and part-payment support.

### Business Requirements
- **Standard Plan**: 50% (July), 30% (October), 20% (December)
- **Late Fee**: ₹50/day (max ₹2,000)
- **Students on Installments**: 60% (2,300 students)

### User Stories

**US-4.1**: Define Installment Plan  
**As a** Fee Admin  
**I want to** define 3-installment plan (50%-30%-20%)  
**So that** students can pay in parts

**Acceptance Criteria**:
- Installment plan: Number of installments, Percentage split, Due dates
- Custom plan for hardship cases (with Principal approval)
- Plan assignment: All students or specific program/year
- Plan change allowed before first installment due

**US-4.2**: Late Fee Calculation  
**As a** System  
**I want to** auto-calculate late fee after due date  
**So that** students are charged penalty

**Acceptance Criteria**:
- Late fee: ₹50/day starting day after due date
- Maximum late fee cap: ₹2,000
- Grace period: 3 days (no late fee for first 3 days)
- Late fee waiver: Fee Admin can waive with reason

**US-4.3**: Part-Payment Acceptance  
**As a** Student  
**I want to** pay ₹20,000 against ₹30,000 installment  
**So that** I reduce outstanding amount

**Acceptance Criteria**:
- Accept any amount >₹1,000
- Update pending amount (₹30,000 - ₹20,000 = ₹10,000 pending)
- Show partial payment in payment history
- Next installment not blocked if previous partially paid

### Technical Specifications
**API Endpoints**:
```
GET /api/v1/installments/plans
POST /api/v1/installments/plans/create
GET /api/v1/installments/student/{student_id}
POST /api/v1/installments/pay-partial
```

**Late Fee Calculation**:
- Cron job runs daily at 12:01 AM
- Checks all installments with due_date < today
- Calculates days_overdue = today - due_date
- Adds late_fee = min(days_overdue * 50, 2000)

### Success Metrics
- Installment compliance: 85% paid by due date
- Late fee collection: ₹15 Lakhs/year
- Part-payment usage: 20% students

---

## Feature 5: Defaulter Management & Reminders

### Overview
Identify defaulters, send automated reminders, calculate penalties, and block exam hall tickets.

### Business Requirements
- **Defaulter Rate**: <2% target at semester end
- **Reminder System**: Email + SMS automation
- **Hall Ticket Blocking**: Auto-block 10 days before exam

### User Stories

**US-5.1**: Defaulter List with Aging  
**As a** Fee Admin  
**I want to** see defaulter list with 30/60/90 day buckets  
**So that** I prioritize follow-ups

**Acceptance Criteria**:
- Defaulter definition: Pending amount >₹1,000
- Aging buckets: 0-30 days (Yellow), 31-60 days (Orange), 61-90 days (Red), >90 days (Critical)
- Filters: Program, Year, Amount range
- Export to Excel with student contact details
- Click to call student phone number (CRM integration)

**US-5.2**: Automated Reminder System  
**As a** System  
**I want to** send reminders 7 days before due date  
**So that** students don't miss payment

**Acceptance Criteria**:
- Reminder schedule:
  - 7 days before: "Your fee installment is due on {date}"
  - On due date: "Today is the last day to pay fees without late fee"
  - 3 days after: "Your fee payment is overdue. Late fee applicable"
  - 7 days after: "Final notice - Pay ₹{amount} immediately. Parent notified"
- Channels: Email + SMS
- Parent notification: CC parent on 7-day overdue notice
- Unsubscribe option (but mandatory reminders continue)

**US-5.3**: Exam Hall Ticket Blocking  
**As a** Principal  
**I want to** auto-block hall tickets for defaulters  
**So that** students clear dues before exams

**Acceptance Criteria**:
- Blocking trigger: 10 days before exam start date
- Blocked students cannot download hall ticket
- Message: "Your hall ticket is blocked due to pending fees of ₹{amount}. Pay immediately"
- Unblock: Automatic within 15 minutes of payment confirmation
- Exception: Fee Admin can manually unblock with Principal approval

### Technical Specifications
**API Endpoints**:
```
GET /api/v1/defaulters
GET /api/v1/defaulters/aging-report
POST /api/v1/reminders/send
POST /api/v1/hall-tickets/block
PUT /api/v1/hall-tickets/{student_id}/unblock
```

**Reminder Job**:
- Laravel Queue job runs daily at 8:00 AM
- Fetch students with upcoming due dates or overdue amounts
- Send batch emails via AWS SES
- Send batch SMS via MSG91

### Success Metrics
- Defaulter rate: <2% at semester end
- Reminder effectiveness: 60% pay within 3 days
- Hall ticket blocking: 100% automation
- Parent notification rate: 95%

---

## Feature 6: Refund Processing

### Overview
Handle refund requests with approval workflow, refund calculation, bank verification, and NEFT disbursement.

### Business Requirements
- **Refund Volume**: 500 refunds/year
- **Refund Types**: Dropout (60%), Overpayment (25%), Scholarship (15%)
- **Processing Time**: <7 days target

### User Stories

**US-6.1**: Refund Request Submission  
**As a** Student  
**I want to** apply for dropout refund  
**So that** I get back unused semester fee

**Acceptance Criteria**:
- Refund form: Reason (Dropout/Overpayment/Scholarship/Other), Bank account details, Amount expected, Supporting documents
- Refund calculation shown: Total paid ₹1,50,000 - Admission fee ₹10,000 (non-refundable) - Pro-rata deduction ₹30,000 = Refund ₹1,10,000
- Bank account verification: Name on account matches student name
- Submit button triggers workflow

**US-6.2**: Refund Approval Workflow  
**As a** Fee Admin  
**I want to** review refund request and forward to Principal  
**So that** refunds are verified

**Acceptance Criteria**:
- Workflow: Student → Fee Admin → Principal → Accountant → Disbursement
- Fee Admin: Verify refund calculation, check eligibility
- Principal: Approve if amount >₹50,000
- Accountant: Verify bank account details, initiate NEFT
- Auto-approve if amount <₹5,000 (Fee Admin approval sufficient)

**US-6.3**: NEFT Disbursement & Tracking  
**As a** Accountant  
**I want to** initiate NEFT refund and record UTR number  
**So that** refund is tracked

**Acceptance Criteria**:
- NEFT initiation via bank portal (manual)
- Record UTR number in system
- Status: Initiated → In Transit → Credited → Failed
- Bank confirmation (2-3 days): Mark as "Disbursed"
- Refund receipt emailed to student
- Failed refund: Re-initiate with corrected details

### Technical Specifications
**API Endpoints**:
```
POST /api/v1/refunds/request
GET /api/v1/refunds/pending-approvals
PUT /api/v1/refunds/{id}/approve
POST /api/v1/refunds/{id}/disburse
PUT /api/v1/refunds/{id}/utr
```

**Refund Calculation Logic**:
```php
// Dropout refund (pro-rata)
$total_paid = $student->payments->sum('amount');
$non_refundable = $fee_structure->admission_fee;
$days_attended = $dropout_date->diffInDays($admission_date);
$total_days_in_semester = 180;
$pro_rata_deduction = ($total_paid - $non_refundable) * ($days_attended / $total_days_in_semester);
$refund_amount = $total_paid - $non_refundable - $pro_rata_deduction;
```

### Success Metrics
- Refund processing time: <7 days
- Refund approval rate: 92%
- NEFT success rate: 98%
- Student satisfaction: >4.0/5.0

---

## Feature 7: Scholarship Management

### Overview
Integrate scholarship applications, verify eligibility, approve awards, and auto-adjust fees.

### Business Requirements
- **Scholarship Volume**: 800 applications/year (20% of students)
- **Scholarship Types**: Government (EBC, Post-Matric), Merit, Sports, Financial hardship
- **Total Scholarship Amount**: ₹1.2 Crores/year

### User Stories

**US-7.1**: Scholarship Application  
**As a** Student  
**I want to** apply for merit scholarship (First Class: 25% waiver)  
**So that** my fee is reduced

**Acceptance Criteria**:
- Scholarship form: Type (Merit/Financial/Sports), Academic year, Previous year percentage/CGPA, Documents (caste certificate, income certificate, marksheet)
- Eligibility check: Merit scholarship requires ≥60%, Financial hardship requires family income <₹2 Lakhs/year
- Application status: Submitted → Under Review → Approved/Rejected
- Email notification on status change

**US-7.2**: Scholarship Verification & Approval  
**As a** Fee Admin  
**I want to** verify scholarship documents and approve  
**So that** only eligible students get scholarship

**Acceptance Criteria**:
- Scholarship queue: Pending applications sorted by submission date
- Document viewer: Open uploaded documents inline
- Verification checklist: Caste certificate valid, Income certificate recent, Marksheet verified
- Approve/Reject with remarks
- Principal approval for scholarships >₹50,000

**US-7.3**: Fee Adjustment  
**As a** System  
**I want to** auto-adjust fee after scholarship approval  
**So that** student sees reduced amount

**Acceptance Criteria**:
- Original fee: ₹1,50,000
- Scholarship: 25% (₹37,500)
- Adjusted fee: ₹1,12,500
- Fee receipt shows: Tuition ₹1,50,000 - Scholarship ₹37,500 = Net ₹1,12,500
- Scholarship adjustment reversible if scholarship cancelled

### Technical Specifications
**API Endpoints**:
```
POST /api/v1/scholarships/apply
GET /api/v1/scholarships/pending
PUT /api/v1/scholarships/{id}/approve
POST /api/v1/scholarships/{id}/adjust-fee
```

**Scholarship Types Config**:
```json
{
  "merit": {
    "first_class": { "criteria": "60-75%", "waiver": "25%" },
    "distinction": { "criteria": ">75%", "waiver": "50%" }
  },
  "financial": {
    "criteria": "Family income < ₹2 Lakhs/year",
    "waiver": "Case-by-case (up to 100%)"
  }
}
```

### Success Metrics
- Scholarship application processing: <3 days
- Scholarship approval rate: 75%
- Fee adjustment accuracy: 100%
- Government scholarship reconciliation: 95%

---

## Feature 8: Financial Reporting & Analytics

### Overview
Real-time dashboards, daily/monthly reports, payment analytics, and revenue insights.

### Business Requirements
- **Reporting Frequency**: Daily collection report, Monthly revenue summary
- **Users**: Fee Admin (daily), Principal (weekly), Super Accountant (monthly)

### User Stories

**US-8.1**: Daily Collection Dashboard  
**As a** Fee Admin  
**I want to** see today's collection in real-time  
**So that** I track daily target

**Acceptance Criteria**:
- Dashboard metrics: Today's collection ₹18 Lakhs (80 transactions), This month ₹4.2 Crores (1,200 transactions), Outstanding ₹8 Crores (1,500 students)
- Collection trend chart: Last 30 days daily collection
- Payment mode breakdown: Online 70%, Cash 20%, Cheque 10%
- Auto-refresh every 60 seconds
- Target indicator: ₹20 Lakhs target, ₹18 Lakhs collected (90%)

**US-8.2**: Monthly Revenue Report  
**As a** Principal  
**I want to** generate monthly revenue report  
**So that** I review financial performance

**Acceptance Criteria**:
- Report sections: 
  - Collection summary (Total ₹4.2 Crores)
  - Program-wise collection (BE Computer ₹1.2 Cr, MBA ₹80 Lakhs)
  - Year-wise collection (First Year ₹1.5 Cr, Second Year ₹1.2 Cr)
  - Payment mode analysis
  - Defaulter summary (300 students, ₹2 Crores pending)
  - Refund summary (50 refunds, ₹50 Lakhs)
- Export: PDF (formatted report) + Excel (raw data)
- Scheduled email: 1st of every month to Principal + Super Accountant

**US-8.3**: Payment Analytics  
**As a** Super Accountant  
**I want to** analyze payment trends over 12 months  
**So that** I forecast next year revenue

**Acceptance Criteria**:
- Year-over-year comparison: 2025 vs 2024
- Growth rate: +12% this year
- Online payment adoption trend: 70% now (vs 50% last year)
- Average days to full payment: 45 days
- Defaulter recovery rate: 95%
- Peak collection months: July (45%), December (30%), March (25%)

### Technical Specifications
**API Endpoints**:
```
GET /api/v1/reports/daily-collection
GET /api/v1/reports/monthly-revenue
GET /api/v1/reports/payment-analytics
GET /api/v1/reports/defaulter-aging
POST /api/v1/reports/schedule-email
```

**Dashboard Queries** (Optimized):
```sql
-- Today's collection
SELECT SUM(amount) as total, COUNT(*) as count
FROM payments
WHERE DATE(created_at) = CURDATE() AND status = 'success';

-- Payment mode breakdown
SELECT payment_mode, SUM(amount) as total
FROM payments
WHERE MONTH(created_at) = MONTH(CURDATE())
GROUP BY payment_mode;
```

### Success Metrics
- Report generation time: <5 seconds
- Dashboard load time: <2 seconds
- Scheduled report delivery: 100%
- Data accuracy: 100%

---

## 🎯 Implementation Priority

| Feature | Priority | Complexity | Business Value | Implementation Order |
|---------|----------|------------|----------------|---------------------|
| Multi-Mode Payment Collection | P0 | High | Critical | 1 |
| Receipt Generation | P0 | Medium | Critical | 2 |
| Fee Structure Management | P0 | Medium | High | 3 |
| Installment Management | P0 | Medium | High | 4 |
| Defaulter Management | P0 | Medium | High | 5 |
| Financial Reporting | P0 | Medium | High | 6 |
| Refund Processing | P1 | Medium | Medium | 7 |
| Scholarship Management | P1 | Medium | Medium | 8 |

---

**Feature Specifications Complete** ✅  
**Total User Stories**: 24  
**Total API Endpoints**: 50+  
**Annual Revenue Impact**: ₹60 Crores
