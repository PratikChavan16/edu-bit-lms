# Super Non-Teaching Manager Portal - Feature Specifications

**Version**: 1.0.0  
**Last Updated**: October 25, 2025  
**Scope**: University-wide non-teaching staff HR management

---

## Feature 1: Recruitment Management

### Overview
End-to-end recruitment process from job requisition to onboarding for non-teaching staff positions.

### Key Capabilities
- Job requisition approval workflow
- Job posting (internal portal + external sites)
- Application tracking system (ATS)
- Resume parsing and shortlisting
- Interview scheduling (calendar integration)
- Offer letter generation with e-signature
- Background verification tracking
- Onboarding checklist automation

### User Stories
**US-1.1**: As College Admin, I want to submit job requisition for 3 clerks so that HR initiates recruitment  
**US-1.2**: As Super NT Manager, I want to screen 200 applications so that I shortlist top 20 candidates  
**US-1.3**: As Candidate, I want to track my application status so that I know interview schedule

### Success Metrics
- Time-to-hire: <45 days
- Offer acceptance rate: 85%
- Onboarding completion: 100% within 7 days
- Recruitment cost: ₹15,000/hire

---

## Feature 2: Attendance Management

### Overview
Biometric attendance tracking, shift management, overtime calculation, and muster roll generation.

### Key Capabilities
- Biometric device integration (ZKTeco SDK)
- Shift roster management (3 shifts: 8 AM-4 PM, 4 PM-12 AM, 12 AM-8 AM)
- Late-mark tracking (>15 minutes = late, deduction: ₹50/day)
- Overtime calculation (hourly rate × 1.5)
- Attendance regularization (for missed punch)
- Muster roll generation (daily, monthly)

### User Stories
**US-2.1**: As Employee, I want to punch biometric attendance so that my presence is recorded  
**US-2.2**: As Super NT Manager, I want to view real-time attendance dashboard so that I identify absentees  
**US-2.3**: As Employee, I want to regularize missed punch so that attendance is corrected

### Success Metrics
- Attendance accuracy: 98%
- Biometric device uptime: 99%
- Late-mark reduction: 30% YoY
- Overtime tracking accuracy: 100%

---

## Feature 3: Leave Management

### Overview
Leave application, approval workflow, balance tracking, and leave encashment for all leave types.

### Key Capabilities
- Leave types: Casual Leave (12 days), Sick Leave (12 days), Earned Leave (15 days), Loss of Pay
- Leave balance tracking (opening, availed, balance)
- Leave application with reason and attachment
- Approval hierarchy (Supervisor → HOD → Principal for >5 days)
- Leave encashment calculation (unused EL × daily wage)
- Comp-off management (extra working day → 1 comp-off)

### User Stories
**US-3.1**: As Employee, I want to apply for 2 days casual leave so that I handle personal work  
**US-3.2**: As Supervisor, I want to approve leave requests so that operations continue smoothly  
**US-3.3**: As Super NT Manager, I want to track leave utilization so that I identify patterns

### Success Metrics
- Leave approval time: <4 hours
- Leave balance accuracy: 100%
- Leave encashment processing: <7 days
- Leave utilization rate: 75%

---

## Feature 4: Performance Management

### Overview
Annual performance appraisal, goal setting, 360-degree feedback, and promotion recommendations.

### Key Capabilities
- Annual appraisal cycle (March-April)
- Self-appraisal form
- Supervisor rating (5-point scale: Outstanding, Excellent, Good, Average, Poor)
- Goal setting and KPI tracking
- 360-degree feedback (peers, subordinates)
- Performance improvement plan (PIP) for low performers
- Promotion recommendations

### User Stories
**US-4.1**: As Employee, I want to submit self-appraisal so that I highlight my achievements  
**US-4.2**: As Supervisor, I want to rate employee performance so that appraisal is completed  
**US-4.3**: As Super NT Manager, I want to identify top performers so that I recommend promotions

### Success Metrics
- Appraisal completion rate: 100%
- Top performer identification: 10% (200 employees)
- Promotion recommendations: 50/year
- PIP effectiveness: 70% improvement

---

## Feature 5: Training & Development

### Overview
Training needs assessment, program scheduling, attendance tracking, and certification management.

### Key Capabilities
- Training needs assessment (annual survey)
- Training calendar (80+ programs/year)
- Training registration portal
- Attendance tracking (sign-in sheet digitization)
- Training feedback surveys
- Certification tracking (soft skills, technical, compliance)
- Skill matrix maintenance

### User Stories
**US-5.1**: As Super NT Manager, I want to schedule fire safety training so that compliance is met  
**US-5.2**: As Employee, I want to register for Excel training so that I upskill  
**US-5.3**: As Trainer, I want to mark attendance so that participation is recorded

### Success Metrics
- Training programs: 80/year
- Employee participation: 1,500 employees (75%)
- Training satisfaction: >4.0/5.0
- Certification rate: 60%

---

## Feature 6: Employee Services

### Overview
Grievance management, transfer requests, separation processing, and document services.

### Key Capabilities
- Grievance submission and tracking
- Transfer requests (inter-college, inter-department)
- Separation processing (resignation, retirement, termination)
- Full & Final settlement calculation
- Service certificate generation
- Employee document repository (contracts, appraisals, certificates)

### User Stories
**US-6.1**: As Employee, I want to submit grievance so that my issue is addressed  
**US-6.2**: As Employee, I want to apply for transfer to another college so that I relocate  
**US-6.3**: As Employee, I want to download service certificate so that I apply for visa

### Success Metrics
- Grievance resolution time: <7 days
- Transfer approval time: <14 days
- Separation processing: <30 days
- Service certificate generation: <24 hours

---

## Feature 7: Compensation & Benefits (View-Only)

### Overview
View-only access to salary structure, payslip distribution, and benefits administration (actual processing by Super Accountant).

### Key Capabilities
- Salary structure view (basic, HRA, allowances, deductions)
- Payslip distribution (PDF via email)
- Bonus/incentive tracking
- PF, ESI, insurance enrollment tracking
- Tax declaration (Form 16)

### User Stories
**US-7.1**: As Employee, I want to download my payslip so that I have salary proof  
**US-7.2**: As Super NT Manager, I want to view salary structure so that I answer employee queries  
**US-7.3**: As Employee, I want to update tax declaration so that TDS is adjusted

### Success Metrics
- Payslip delivery: 100% by 7th of month
- Tax declaration submission: 90%
- PF/ESI accuracy: 100%

---

## Feature 8: HR Analytics & Reporting

### Overview
Dashboards and reports for headcount, attrition, attendance, leave, performance, and training.

### Key Capabilities
- Headcount dashboard (college-wise, department-wise, designation-wise)
- Attrition analysis (monthly exits, YoY trend, reasons)
- Attendance heatmap (identify patterns)
- Leave utilization reports
- Performance distribution (Outstanding: 10%, Excellent: 20%, Good: 50%, Average: 15%, Poor: 5%)
- Training ROI analysis

### User Stories
**US-8.1**: As Super NT Manager, I want to view attrition dashboard so that I identify retention issues  
**US-8.2**: As Principal, I want to see college-level headcount so that I plan workforce  
**US-8.3**: As Super NT Manager, I want to analyze training ROI so that I justify budget

### Success Metrics
- Report generation time: <5 seconds
- Dashboard real-time accuracy: 100%
- Attrition target: <10% annually
- Data-driven decisions: 80% backed by analytics

---

## Implementation Priority

| Feature | Priority | Complexity | Implementation Order |
|---------|----------|------------|---------------------|
| Attendance Management | P0 | High | 1 |
| Leave Management | P0 | Medium | 2 |
| Recruitment Management | P0 | High | 3 |
| Performance Management | P0 | High | 4 |
| Employee Services | P1 | Medium | 5 |
| Training & Development | P1 | Medium | 6 |
| HR Analytics | P1 | Medium | 7 |
| Compensation & Benefits | P2 | Low | 8 |

---

**Feature Specifications Complete** ✅  
**Employees Managed**: 2,000+ non-teaching staff across 15 colleges
