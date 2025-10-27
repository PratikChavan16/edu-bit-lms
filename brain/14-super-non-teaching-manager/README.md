# Super Non-Teaching Manager Portal - Complete Documentation

**Role:** Super Non-Teaching Manager (University HR Manager - Non-Teaching Staff)  
**Port:** 3014  
**System:** BitFlow Nova LMS  
**Version:** 1.0.0  
**Status:** Production-Ready Documentation  
**Last Updated:** October 25, 2025

---

## 📋 Executive Summary

### Purpose

The **Super Non-Teaching Manager Portal** is the **HR management system** for non-teaching staff across the university, covering recruitment, attendance, leave management, performance evaluation, training, and employee services for 2,000+ non-teaching employees across 15 colleges.

### Business Value

| Metric | Value | Impact |
|--------|-------|--------|
| **Non-Teaching Staff** | 2,000+ employees | Clerks, lab assistants, peons, maintenance, security, admin |
| **Colleges Covered** | 15 colleges | University-wide HR operations |
| **Recruitment** | 150 positions/year | Hiring, onboarding, probation tracking |
| **Attendance Tracking** | 2,000 daily punch-ins | Biometric integration, shift management |
| **Leave Management** | 5,000+ leave requests/year | CL, SL, EL, LOP tracking |
| **Performance Reviews** | 2,000 appraisals/year | Annual performance evaluation |
| **Training Programs** | 80+ programs/year | Skill development, compliance training |

### Critical Success Factors

✅ **Recruitment Management**: Job posting, application tracking, interview scheduling, offer letter generation  
✅ **Attendance & Leave**: Biometric attendance, leave approvals, shift rosters  
✅ **Performance Management**: Annual appraisals, goal setting, feedback, promotions  
✅ **Training & Development**: Skill training, compliance training, certification tracking  
✅ **Employee Services**: Grievances, transfers, separations, service records  
✅ **HR Analytics**: Attrition rates, attendance patterns, performance trends  

---

## Core Features

### Feature 1: Recruitment Management
- Job requisition creation
- Job posting to portal and external sites
- Application tracking system (ATS)
- Interview scheduling and feedback
- Offer letter generation
- Onboarding checklist
- Probation period tracking

### Feature 2: Attendance Management
- Biometric integration (punch-in/out)
- Shift roster management (morning, evening, night)
- Late-mark tracking and penalties
- Overtime calculation
- Muster roll generation
- Attendance regularization requests

### Feature 3: Leave Management
- Leave balance tracking (CL: 12, SL: 12, EL: 15 days/year)
- Leave application workflow
- Leave approval hierarchy
- Comp-off management
- Leave encashment calculation
- Leave reports

### Feature 4: Performance Management
- Annual performance appraisal cycle
- Goal setting and tracking (KPIs)
- 360-degree feedback
- Performance ratings (Outstanding, Excellent, Good, Average, Poor)
- Promotion recommendations
- Performance improvement plans (PIP)

### Feature 5: Training & Development
- Training needs assessment
- Training calendar
- Training registration and attendance
- Training effectiveness evaluation
- Certification tracking
- Skill matrix maintenance

### Feature 6: Employee Services
- Grievance management
- Transfer requests (inter-college)
- Separation processing (resignation, retirement, termination)
- Service certificate generation
- Employee self-service portal
- Document repository (contracts, agreements)

### Feature 7: Compensation & Benefits (View-Only)
- Salary structure view (no edit, managed by Super Accountant)
- Payslip distribution
- Bonus/incentive tracking
- Benefits administration (PF, ESI, insurance)

### Feature 8: HR Analytics & Reporting
- Headcount reports (college-wise, department-wise)
- Attrition analysis
- Attendance patterns
- Leave utilization
- Performance distribution
- Training effectiveness

---

## Technical Architecture

**Frontend**: Next.js 15, React 18, TypeScript, TailwindCSS  
**Backend**: Laravel 11, PHP 8.2, PostgreSQL 16, Redis 7.2  
**Infrastructure**: AWS EC2, S3 (document storage)  
**Integrations**: Biometric devices (ZKTeco), Email (AWS SES), SMS (MSG91)

---

## Key Workflows

### Workflow 1: Recruitment Process
1. College submits job requisition (position, qualifications, count)
2. Super NT Manager approves requisition
3. Job posted on portal + external sites (Naukri, LinkedIn)
4. Applications received and screened
5. Shortlisted candidates invited for interview
6. Interview conducted, feedback recorded
7. Selected candidates receive offer letter
8. Candidate accepts, onboarding initiated
9. Joining formalities completed
10. Probation period tracked (6 months)

### Workflow 2: Leave Application
1. Employee applies for leave via self-service portal
2. System checks leave balance
3. Auto-route to immediate supervisor
4. Supervisor approves/rejects
5. If approved, leave balance deducted
6. Email + SMS confirmation sent
7. Leave reflected in muster roll

### Workflow 3: Annual Performance Appraisal
1. HR initiates appraisal cycle (March-April)
2. Employees submit self-appraisal
3. Supervisors rate employees and provide feedback
4. Rating review by HOD and Principal
5. Final rating consolidated by Super NT Manager
6. Promotion/increment recommendations sent to management
7. Appraisal letters issued

---

## Success Criteria

**Must-Have**:
✅ Recruitment application tracking system  
✅ Biometric attendance integration  
✅ Leave management workflow  
✅ Performance appraisal module  
✅ Employee self-service portal  

**Should-Have**:
⚡ Training management system  
⚡ Grievance tracking  
⚡ HR analytics dashboard  

**Nice-to-Have**:
💡 AI-powered resume screening  
💡 Predictive attrition analysis  
💡 Chatbot for HR queries  

---

**Portal Status**: ✅ Documentation Complete  
**Employees Managed**: 2,000+ non-teaching staff across 15 colleges
