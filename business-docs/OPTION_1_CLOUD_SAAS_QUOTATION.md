# OPTION 1: CLOUD SaaS (FULLY HOSTED)

**BITFLOW LMS - Cloud Software-as-a-Service Deployment**

---

## QUOTATION DETAILS

**Quotation No:** BITFLOW-MVP-CLOUD-2025-001  
**Date of Issue:** October 30, 2025  
**Valid Until:** November 29, 2025 (30 Days)  
**Deployment Model:** Fully Cloud-Hosted SaaS  
**Recommended For:** Quick deployment, lowest cost, minimal IT overhead

---

## CLIENT INFORMATION

**Organization Name:** Maratha Vidya Prasarak Samaj (MVP)  
**Scope:** 504 Educational Institutions | 213,576 Students | 11,161 Employees  
**Institution Types:** Pre-primary, Primary, High Schools, Junior Colleges, Senior Colleges, Professional Institutes, Medical, Nursing, Pharmacy, Engineering, Architecture, Polytechnic, Agriculture, ITI, Management Institutes  
**Address:** 1302-A, Shukrawar Peth, Pune - 411002, Maharashtra, India  

---

## VENDOR INFORMATION

**Company Name:** Bitflow Technologies Pvt. Ltd.  
**Registered Office:** Tech Park, Phase 1, Hinjewadi, Pune - 411057, Maharashtra, India  
**GSTIN:** 27AABCB1234F1Z5  
**PAN:** AABCB1234F  
**Email:** sales@bitflow.io  
**Phone:** +91-98765-43210  

---

## DEPLOYMENT ARCHITECTURE

```
┌─────────────────────────────────────────┐
│     BITFLOW CLOUD (AWS ap-south-1)      │
├─────────────────────────────────────────┤
│  ✓ Next.js Frontend (Vercel/AWS)        │
│  ✓ Node.js API (AWS ECS)                │
│  ✓ PostgreSQL Database (AWS RDS)        │
│  ✓ Redis Cache (AWS ElastiCache)        │
│  ✓ File Storage (AWS S3)                │
│  ✓ Backups (Automated, encrypted)       │
│  ✓ CDN (CloudFront)                     │
│  ✓ Load Balancer (AWS ALB)              │
└─────────────────────────────────────────┘
           ↕️ HTTPS (SSL/TLS)
┌─────────────────────────────────────────┐
│      MVP USERS (504 Institutions)       │
│  213,576 Students + 11,161 Employees    │
│  ~436,313 Total Users (incl. parents)   │
│  Access via web browser (any device)    │
└─────────────────────────────────────────┘
```

**Access URL:** https://mvp.bitflow.io

---

## WHAT'S INCLUDED

### Infrastructure (Fully Managed by Bitflow)

| Component | Specification | Included |
|-----------|---------------|----------|
| **Cloud Hosting** | AWS Mumbai Region (ap-south-1) | ✅ Yes |
| **Application Servers** | Auto-scaling (6-20 instances) | ✅ Yes |
| **Database** | PostgreSQL RDS (db.r6g.4xlarge Multi-AZ) | ✅ Yes |
| **Cache** | Redis (cache.r6g.xlarge) | ✅ Yes |
| **Storage** | 50 TB (AWS S3 - 504 institutions) | ✅ Yes |
| **Bandwidth** | 30 TB/month | ✅ Yes |
| **SSL Certificate** | Wildcard SSL (auto-renewal) | ✅ Yes |
| **CDN** | Global content delivery | ✅ Yes |
| **Load Balancer** | High availability | ✅ Yes |
| **Backups** | Daily automated (30-day retention) | ✅ Yes |
| **Disaster Recovery** | Multi-region backup | ✅ Yes |

### Software Features

| Feature | Details | Included |
|---------|---------|----------|
| **All 22 Portals** | Complete access to all modules | ✅ Yes |
| **Unlimited Users** | No per-user fees | ✅ Yes |
| **Mobile Access** | Responsive web app | ✅ Yes |
| **API Access** | Full REST API access | ✅ Yes |
| **Custom Branding** | MVP logo, colors, domain | ✅ Yes |
| **Email Notifications** | 10,000 emails/month | ✅ Yes |
| **SMS Notifications** | 5,000 SMS/month | ✅ Yes |
| **Chat System** | Internal messaging | ✅ Yes |
| **Video Integration** | Zoom/Google Meet | ✅ Yes |
| **Payment Gateway** | Razorpay integration | ✅ Yes |

### Support & Maintenance

| Service | Details | Included |
|---------|---------|----------|
| **Support Hours** | 9 AM - 9 PM (Mon-Sat) | ✅ Yes |
| **Support Channels** | Email + Phone + Chat | ✅ Yes |
| **Response Time (Critical)** | <4 hours | ✅ Yes |
| **Response Time (High)** | <8 hours | ✅ Yes |
| **Response Time (Medium)** | <24 hours | ✅ Yes |
| **Dedicated Account Manager** | Yes | ✅ Yes |
| **Software Updates** | Automatic (no downtime) | ✅ Yes |
| **Security Patches** | Automatic (same day) | ✅ Yes |
| **Feature Releases** | Quarterly (free) | ✅ Yes |
| **Training** | 120 hours included | ✅ Yes |

### Service Level Agreement (SLA)

| Metric | Guarantee |
|--------|-----------|
| **Uptime** | 99.9% (max 8.76 hours downtime/year) |
| **Data Backup** | Daily (30-day retention) |
| **Recovery Time (RTO)** | <4 hours |
| **Recovery Point (RPO)** | <1 hour (max 1 hour data loss) |
| **Security** | ISO 27001, SOC 2 Type II |

---

## PRICING BREAKDOWN

### Year 1 Costs (Setup + Subscription)

#### A. ONE-TIME SETUP COSTS

| Item | Description | Qty | Rate (₹) | Amount (₹) |
|------|-------------|-----|----------|------------|
| **Platform Setup** |
| Cloud infrastructure setup | AWS account, VPC, security groups | 1 | 5,00,000 | 5,00,000 |
| Multi-tenant configuration | 504 institution instances | 504 | 15,000 | 75,60,000 |
| Domain & SSL setup | mvp.bitflow.io + SSL certificate | 1 | 1,00,000 | 1,00,000 |
| **Subtotal - Platform Setup** | | | | **81,60,000** |
| **Data Migration** |
| Data audit & mapping | Existing systems analysis | 1 | 2,00,000 | 2,00,000 |
| Student data migration | 213,576 student records | 213,576 | 3 | 6,40,728 |
| Employee data migration | 11,161 employee records | 11,161 | 5 | 55,805 |
| Historical data migration | 5 years academic data (504 inst) | 504 | 5,000 | 25,20,000 |
| **Subtotal - Data Migration** | | | | **34,16,533** |
| **Training** |
| Admin training | 504 admins × 8 hours | 4,032 hrs | 2,500 | 1,00,80,000 |
| Faculty/Staff training | 11,161 × 2 hours | 22,322 hrs | 1,000 | 2,23,22,000 |
| Reduced cost (video-based) | Self-paced online training | - | - | -2,00,00,000 |
| Student orientation | Self-service videos | - | - | 0 |
| Training materials | Videos, PDFs, guides, LMS | 1 | 5,00,000 | 5,00,000 |
| **Subtotal - Training** | | | | **29,02,000** |
| **Customization** |
| MVP branding | Logo, colors, theme (504 institutions) | 1 | 3,00,000 | 3,00,000 |
| Custom email templates | 20 templates for diverse institutions | 20 | 7,500 | 1,50,000 |
| Custom report templates | 30 reports (varied institution types) | 30 | 15,000 | 4,50,000 |
| Custom workflows | 10 workflows | 10 | 20,000 | 2,00,000 |
| **Subtotal - Customization** | | | | **11,00,000** |
| **Integration** |
| Payment gateway (Razorpay) | Setup & testing | 1 | 1,00,000 | 1,00,000 |
| SMS gateway | TextLocal/MSG91 (bulk pricing) | 1 | 50,000 | 50,000 |
| Email service | SendGrid enterprise | 1 | 75,000 | 75,000 |
| Zoom/Google Meet | Video conferencing | 1 | 50,000 | 50,000 |
| Biometric devices (optional) | 504 institutions | 504 | 15,000 | 75,60,000 |
| Reduced (phased rollout) | Deploy in Year 2-3 | - | - | -75,00,000 |
| **Subtotal - Integration** | | | | **3,35,000** |
| **TOTAL ONE-TIME SETUP** | | | | **₹1,59,13,533** |

#### B. ANNUAL SUBSCRIPTION (YEAR 1)

| Item | Description | Amount (₹) |
|------|-------------|------------|
| **Software License** | Enterprise Plan - 504 institutions | 1,25,00,000 |
| **Cloud Infrastructure** | AWS hosting (6-20 instances, 50TB storage, 30TB bandwidth) | 45,00,000 |
| **Support & Maintenance** | Email + Phone support (9 AM - 9 PM) | Included |
| **Software Updates** | Automatic updates & new features | Included |
| **Security** | SSL, backups, monitoring, DDoS protection | Included |
| **TOTAL ANNUAL SUBSCRIPTION** | | **₹1,70,00,000** |

#### YEAR 1 TOTAL

| Description | Amount (₹) |
|-------------|------------|
| One-Time Setup Costs (A) | 1,59,13,533 |
| Annual Subscription (B) | 1,70,00,000 |
| **Subtotal** | **3,29,13,533** |
| **GST @ 18%** | **59,24,436** |
| **GRAND TOTAL YEAR 1** | **₹3,88,37,969** |

---

### Year 2 Onwards (Recurring Annual Subscription)

| Item | Amount (₹) |
|------|------------|
| Annual Subscription (Enterprise Plan - 504 institutions) | 1,25,00,000 |
| Cloud Infrastructure (AWS hosting, storage, bandwidth) | 45,00,000 |
| Support & Maintenance | Included |
| **Subtotal** | **1,70,00,000** |
| **GST @ 18%** | **30,60,000** |
| **TOTAL YEAR 2+** | **₹2,00,60,000/year** |

**Price Lock:** Years 1-3 (no increase)  
**Year 4+:** Maximum 5% annual increase

---

## PAYMENT SCHEDULE

### Year 1 Milestone-Based Payments

| Milestone | Deliverable | % | Amount (₹) | Due Date |
|-----------|-------------|---|------------|----------|
| **Milestone 1** | Contract signing | 30% | 1,16,51,391 | Within 7 days of contract |
| **Milestone 2** | Pilot go-live (50 institutions) | 30% | 1,16,51,391 | Month 4 (February 2026) |
| **Milestone 3** | Phase 2 rollout (250 institutions) | 25% | 97,09,492 | Month 8 (June 2026) |
| **Milestone 4** | Full go-live (504 institutions) | 15% | 58,25,695 | Month 18 (April 2027) |
| **TOTAL YEAR 1** | | **100%** | **₹3,88,37,969** | |

### Year 2+ Payment Options

**Option A: Annual Prepayment (5% Discount)**
- Pay ₹1,90,57,000 once/year
- Save ₹10,03,000 annually

**Option B: Quarterly Payment**
- Pay ₹50,15,000 per quarter (4 payments)
- Total: ₹2,00,60,000/year

**Option C: Monthly Payment**
- Pay ₹16,71,667 per month (12 payments)
- Total: ₹2,00,60,000/year

---

## IMPLEMENTATION TIMELINE

### Phase 1: Setup & Configuration (Months 1-2)

**Month 1: Infrastructure Setup**
- Week 1-2: AWS cloud setup, security configuration
- Week 3-4: Multi-tenant setup for 37 colleges
- Deliverable: Platform ready for data migration

**Month 2: Data Migration & Pilot Prep**
- Week 1-2: Migrate data for 50 pilot institutions
- Week 3-4: Admin training for pilot institutions
- Deliverable: 50 institutions ready for testing

### Phase 2: Pilot Deployment (Months 3-4)

**Month 3-4: Pilot Launch**
- Week 1-2: Launch pilot (50 institutions)
- Week 3-6: Faculty and student training (self-paced videos)
- Week 7-8: Gather feedback, fix issues
- Deliverable: Successful pilot with 40,000+ users

### Phase 3: Phased Rollout (Months 5-15)

**Month 5-8: Rollout Phase 1**
- Deploy to 200 more institutions (250 total)
- Train faculty and students (video-based)
- Deliverable: 250 institutions live (~100K users)

**Month 9-12: Rollout Phase 2**
- Deploy to 150 more institutions (400 total)
- Complete training for additional staff
- Deliverable: 400 institutions live (~170K users)

**Month 13-15: Rollout Phase 3**
- Deploy to remaining 104 institutions (504 total)
- Final training and optimization
- Deliverable: All 504 institutions live

### Phase 4: Optimization (Months 16-18)

**Month 16-18: Full Go-Live**
- Performance optimization at scale
- Advanced features activation
- Full acceptance testing
- Deliverable: Production-ready system (436K+ users)

**Total Implementation Time:** 18 months

---

## 5-YEAR COST PROJECTION

| Year | Description | Cost (₹) | Cumulative (₹) |
|------|-------------|----------|----------------|
| **Year 1** | Setup + Subscription | 3,88,37,969 | 3,88,37,969 |
| **Year 2** | Annual Subscription | 2,00,60,000 | 5,88,97,969 |
| **Year 3** | Annual Subscription | 2,00,60,000 | 7,89,57,969 |
| **Year 4** | Annual Subscription (+5%) | 2,10,63,000 | 9,00,20,969 |
| **Year 5** | Annual Subscription (+5%) | 2,21,16,150 | 12,21,37,119 |
| **5-YEAR TOTAL** | | | **₹12,21,37,119** |

**Average Annual Cost (Years 2-5):** ₹2,08,24,788

---

## COST SAVINGS vs. TRADITIONAL SETUP

### Current Multi-System Setup (Annual)

| System | Vendor | Annual Cost (₹) | For 504 Institutions |
|--------|--------|-----------------|---------------------|
| Learning Management System | Moodle/Blackboard | 15,00,000 | ₹75,60,000 |
| Student Information System | Ellucian/PeopleSoft | 30,00,000 | ₹1,51,20,000 |
| HR Management System | Workday/SAP | 25,00,000 | ₹1,26,00,000 |
| Finance & Accounting | Tally ERP | 8,00,000 | ₹40,32,000 |
| Fee Collection System | PayU/Razorpay | 6,00,000 | ₹30,24,000 |
| Examination Management | ExamSoft | 12,00,000 | ₹60,48,000 |
| Library Management | Koha/SOUL | 5,00,000 | ₹25,20,000 |
| Hostel Management | Custom | 3,00,000 | ₹15,12,000 |
| Transport Management | GPS tracking | 4,00,000 | ₹20,16,000 |
| Placement Portal | HirePro | 6,00,000 | ₹30,24,000 |
| Communication (Email/SMS) | Various | 10,00,000 | ₹50,40,000 |
| Attendance System | Biometric | 3,00,000 | ₹15,12,000 |
| Support Ticketing | Zendesk | 4,00,000 | ₹20,16,000 |
| Analytics & Reporting | Tableau | 5,00,000 | ₹25,20,000 |
| **TOTAL CURRENT COST** | | | **₹5,85,44,000** |

### With Bitflow Cloud SaaS (Annual - Year 2+)

| Item | Annual Cost (₹) |
|------|----------------|
| Bitflow LMS (All-in-One - 504 institutions) | 2,00,60,000 |
| **TOTAL BITFLOW COST** | **₹2,00,60,000** |

### **ANNUAL SAVINGS: ₹3,84,84,000 (66% Reduction)**

### **5-YEAR SAVINGS**

| Scenario | 5-Year Cost (₹) |
|----------|-----------------|
| Traditional Multi-System Setup (504 institutions) | 29,27,20,000 |
| Bitflow Cloud SaaS | 12,21,37,119 |
| **TOTAL SAVINGS** | **₹17,05,82,881** |
| **% SAVINGS** | **58%** |

---

## ADVANTAGES OF CLOUD SaaS

### ✅ Cost Benefits
- **Lowest Upfront Investment:** No hardware purchase (₹0 vs ₹10-18L)
- **Predictable Costs:** Fixed monthly/annual pricing
- **No Infrastructure Costs:** No electricity, cooling, maintenance
- **No IT Staff Required:** We manage everything

### ✅ Speed & Efficiency
- **Fastest Deployment:** Go-live in 3 months (vs 6-12 months on-premise)
- **Instant Scalability:** Add colleges without hardware
- **Zero Downtime Updates:** Automatic updates without interruption
- **Global Access:** Access from anywhere with internet

### ✅ Security & Reliability
- **Enterprise Security:** ISO 27001, SOC 2 Type II certified
- **99.9% Uptime:** Industry-leading SLA
- **Automatic Backups:** Daily backups with 30-day retention
- **Disaster Recovery:** Multi-region failover

### ✅ Innovation
- **Continuous Updates:** New features every quarter (free)
- **Latest Technology:** Always on latest version
- **AI/ML Features:** Predictive analytics included
- **Mobile-First:** Responsive design for all devices

### ✅ Support
- **Dedicated Support:** Email + Phone + Chat
- **Fast Response:** <4 hours for critical issues
- **Expert Team:** Experienced support engineers
- **Training Included:** 120 hours comprehensive training

---

## DISADVANTAGES TO CONSIDER

### ⚠️ Potential Concerns

**1. Internet Dependency**
- Requires stable internet connection
- Downtime if internet fails at college
- *Mitigation:* Most colleges have backup internet; mobile hotspot works

**2. Data on Cloud**
- Data stored on our AWS servers (not MVP's premises)
- *Mitigation:* ISO 27001 certified, GDPR compliant, data export available anytime

**3. Less Infrastructure Control**
- MVP cannot access servers directly
- *Mitigation:* We provide dashboards, logs, and reports for monitoring

**4. Subscription Model**
- Ongoing annual cost (no perpetual license)
- *Mitigation:* Total cost still 78% lower than alternatives

---

## IDEAL FOR

This deployment option is perfect for MVP if you:

✅ Want the **fastest time to market** (3 months)  
✅ Have **limited IT staff** (no DevOps needed)  
✅ Prefer **predictable costs** (no hidden infrastructure expenses)  
✅ Want **zero maintenance overhead** (we handle everything)  
✅ Are comfortable with **cloud data storage** (with SOC 2/ISO 27001 compliance)  
✅ Need **automatic updates** and latest features  
✅ Want to **avoid hardware investment** (₹10-18L saved)  

---

## TERMS & CONDITIONS

### 1. Service Level Agreement
- **Uptime:** 99.9% guaranteed (max 8.76 hours downtime/year)
- **Penalties:** 10% monthly credit if <99%, 25% if <95%
- **Maintenance Windows:** 2 hours/month (notified 7 days advance)

### 2. Data Ownership & Security
- **Data Ownership:** All data belongs to MVP
- **Data Export:** Available anytime in CSV/JSON format
- **Data Deletion:** Deleted within 90 days of contract termination
- **Encryption:** AES-256 for data at rest, TLS 1.3 for data in transit

### 3. Payment Terms
- **Payment Method:** Bank transfer (NEFT/RTGS)
- **Payment Due:** 15 days from invoice date
- **Late Payment:** 1.5% interest per month on overdue amounts
- **Currency:** Indian Rupees (₹)

### 4. Contract Duration
- **Initial Term:** 3 years (Year 1 + 2 auto-renewals)
- **Renewal:** Auto-renewal unless 90-day written notice
- **Price Lock:** Years 1-3 locked (no increase)
- **Year 4+ Increase:** Maximum 5% annually

### 5. Termination
- **Termination Notice:** 90 days written notice required
- **Data Export:** MVP can export all data before termination
- **Refund:** No refund of annual subscription if paid
- **Access:** Terminated 30 days after contract end

### 6. Support
- **Support Hours:** 9 AM - 9 PM (Mon-Sat), Email-only Sunday
- **Channels:** Email (support@bitflow.io), Phone (+91-98765-43210), Chat
- **Response Times:** Critical (<4h), High (<8h), Medium (<24h), Low (<72h)

---

## ACCEPTANCE

**I/We accept this Cloud SaaS deployment quotation and agree to the terms outlined above.**

**For Maratha Vidya Prasarak Samaj (MVP):**

Signature: ___________________________  
Name: ___________________________  
Title: ___________________________  
Date: ___________________________  

Organization Stamp:

---

**For Bitflow Technologies Pvt. Ltd.:**

Signature: ___________________________  
Name: Amit Sharma  
Title: Sales Director  
Date: October 30, 2025  

Company Seal:

---

## CONTACT INFORMATION

**Sales Team**  
Email: sales@bitflow.io  
Phone: +91-98765-43210  
WhatsApp: +91-98765-43210  

**Technical Support**  
Email: support@bitflow.io  
Phone: +91-98765-43211  

**Accounts Department**  
Email: accounts@bitflow.io  
Phone: +91-98765-43212  

**Office Address**  
Bitflow Technologies Pvt. Ltd.  
Tech Park, Phase 1, Hinjewadi  
Pune, Maharashtra 411057  
India  

**Website:** www.bitflow.io  
**Support Portal:** support.bitflow.io  

---

## BANK DETAILS

**Account Name:** Bitflow Technologies Pvt. Ltd.  
**Bank:** HDFC Bank  
**Branch:** Hinjewadi, Pune  
**Account No:** 50200012345678  
**IFSC Code:** HDFC0001234  
**Account Type:** Current  

**GST No:** 27AABCB1234F1Z5  
**PAN:** AABCB1234F  
**CIN:** U72900PN2024PTC123456  

---

**END OF QUOTATION**

*This quotation is valid for 30 days from October 30, 2025. Prices subject to change after validity period.*

**Reference:** BITFLOW-MVP-CLOUD-2025-001  
**Version:** 1.0  
**Date:** October 30, 2025
