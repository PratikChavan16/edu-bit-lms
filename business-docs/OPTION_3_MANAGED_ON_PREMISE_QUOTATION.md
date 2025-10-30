# OPTION 3: MANAGED ON-PREMISE

**BITFLOW LMS - Fully On-Premise Deployment (Managed by Bitflow)**  
**Everything on MVP's Servers | Bitflow Manages Remotely**

---

## QUOTATION DETAILS

**Quotation No:** BITFLOW-MVP-MANAGED-2025-003  
**Date of Issue:** October 30, 2025  
**Valid Until:** November 29, 2025 (30 Days)  
**Deployment Model:** Managed On-Premise (Full infrastructure at MVP, managed by Bitflow)  
**Recommended For:** Strict data residency requirements, unreliable internet, government/defense

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
│      MVP ON-PREMISE DATA CENTER         │
│     (Managed Remotely by Bitflow)       │
├─────────────────────────────────────────┤
│  ✓ Next.js Frontend (MVP Servers)       │
│  ✓ Node.js API (MVP Servers)            │
│  ✓ PostgreSQL Database (MVP Servers)    │
│  ✓ Redis Cache (MVP Servers)            │
│  ✓ File Storage (MVP Servers)           │
│  ✓ Load Balancer (MVP Servers)          │
│  ✓ Backups (MVP Servers)                │
├─────────────────────────────────────────┤
│  ✅ ALL data on MVP's premises           │
│  ⚠️ Bitflow has root access (manages)    │
│  ⚠️ MVP has read-only monitoring access  │
└─────────────────────────────────────────┘
           ↕️ Internal Network (HTTPS)
┌─────────────────────────────────────────┐
│         MVP USERS (37 Colleges)         │
│  Access via internal network            │
│  (No internet required for operation)   │
└─────────────────────────────────────────┘
           ↕️ Remote Management (VPN)
┌─────────────────────────────────────────┐
│      BITFLOW CLOUD (Management Only)    │
│  ✓ Remote access for updates/support    │
│  ✓ License verification server          │
│  ✓ Monitoring & alerts                  │
│  ✓ CI/CD deployment pipeline            │
└─────────────────────────────────────────┘
```

**Access URL:** https://lms.mvp.edu.in (internal domain)

**Key Benefits:**
- ✅ **Complete Data Control:** Everything on MVP's premises
- ✅ **No Internet Dependency:** Works on internal network (internet only for updates)
- ✅ **Professional Management:** Bitflow manages everything remotely
- ✅ **Code Protection:** Bitflow has exclusive server access
- ✅ **Zero IT Overhead:** MVP doesn't need DevOps team

---

## WHAT'S INCLUDED

### On-Premise Infrastructure (MVP Purchases, Bitflow Manages)

| Component | Specification | MVP Buys | Bitflow Manages |
|-----------|---------------|----------|-----------------|
| Application Servers (2) | 16 vCores, 64 GB RAM each | ⚠️ Yes | ✅ Yes |
| Database Server | 32 vCores, 128 GB RAM | ⚠️ Yes | ✅ Yes |
| Redis Server | 8 vCores, 32 GB RAM | ⚠️ Yes | ✅ Yes |
| File Storage Server | 8 vCores, 5 TB storage | ⚠️ Yes | ✅ Yes |
| Load Balancer | 4 vCores, 8 GB RAM | ⚠️ Yes | ✅ Yes |
| Backup Server | 4 vCores, 10 TB storage | ⚠️ Yes | ✅ Yes |
| Network Equipment | Switches, firewall, UPS | ⚠️ Yes | ✅ Yes |

**Total Hardware Cost (MVP):** ₹17,70,000 (one-time)

### Software & Services

| Feature | Details | Included |
|---------|---------|----------|
| **All 22 Portals** | Complete system access | ✅ Yes |
| **Unlimited Users** | No per-user fees | ✅ Yes |
| **Mobile Access** | Responsive web app | ✅ Yes |
| **API Access** | Full REST API | ✅ Yes |
| **Code Obfuscation** | IP protection | ✅ Yes |
| **License Verification** | Daily check to Bitflow cloud | ✅ Yes |
| **Data Ownership** | ✅ 100% MVP | ✅ Yes |
| **Code Ownership** | ✅ Bitflow (protected) | ✅ Yes |
| **Server Management** | ✅ Bitflow (remote) | ✅ Yes |

### Managed Services (Bitflow Handles)

| Service | Details | Included |
|---------|---------|----------|
| **Server Management** | OS updates, security patches | ✅ 24x7 |
| **Application Management** | Deploy updates, monitor performance | ✅ 24x7 |
| **Database Management** | Backups, optimization, tuning | ✅ 24x7 |
| **Security Management** | Firewall, intrusion detection | ✅ 24x7 |
| **Monitoring** | Server health, alerts, logs | ✅ 24x7 |
| **Backup Management** | Daily automated backups | ✅ Yes |
| **Disaster Recovery** | Recovery procedures | ✅ Yes |

### Support

| Service | Details | Included |
|---------|---------|----------|
| Support Hours | 24x7 (Email + Phone) | ✅ Yes |
| Support Channels | Email + Phone + Chat + Remote | ✅ Yes |
| Response Time (Critical) | <2 hours | ✅ Yes |
| Response Time (High) | <4 hours | ✅ Yes |
| On-Site Visits | 4 visits/year | ✅ Yes |
| Dedicated Account Manager | Senior manager | ✅ Yes |
| Remote Access | For updates/troubleshooting | ✅ Yes |

---

## MVP HARDWARE REQUIREMENTS (COMPLETE INFRASTRUCTURE)

### Detailed Server Specifications

#### 1. Application Servers (2 Units) - ₹5,00,000

**Model:** Dell PowerEdge R740 or HP ProLiant DL380 Gen10

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon Gold 6226R (16 cores, 2.9 GHz) |
| **RAM** | 64 GB DDR4 ECC (4 × 16GB) |
| **Storage** | 500 GB NVMe SSD |
| **Network** | Dual 10 Gbps Ethernet (bonded) |
| **Power Supply** | Dual redundant 750W PSU |
| **OS License** | Ubuntu 22.04 LTS Server (free) |
| **Quantity** | 2 servers (for high availability) |
| **Unit Cost** | ₹2,50,000 |
| **Total Cost** | **₹5,00,000** |

**Purpose:**
- Run Next.js frontend and Node.js API
- Load balanced for redundancy (one fails, other takes over)
- Docker/Kubernetes orchestration
- Handle 1,000+ concurrent users

---

#### 2. Database Server - ₹5,00,000

**Model:** Dell PowerEdge R750 or HP ProLiant DL380 Gen10 Plus

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon Gold 6330 (32 cores, 2.0 GHz) |
| **RAM** | 128 GB DDR4 ECC (8 × 16GB) |
| **Storage** | 2 TB NVMe SSD (RAID 10 - 4 × 512GB) |
| **Network** | Dual 10 Gbps Ethernet |
| **RAID Controller** | Hardware RAID with battery backup |
| **Power Supply** | Dual redundant 750W PSU |
| **OS License** | Ubuntu 22.04 LTS Server (free) |
| **Total Cost** | **₹5,00,000** |

**Purpose:**
- PostgreSQL database with 37 tenant schemas
- All student, faculty, academic, financial data
- RAID 10 for performance + redundancy

---

#### 3. Redis Cache Server - ₹1,25,000

**Model:** Dell PowerEdge R350

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon E-2388G (8 cores, 3.2 GHz) |
| **RAM** | 32 GB DDR4 ECC (2 × 16GB) |
| **Storage** | 200 GB NVMe SSD |
| **Network** | 10 Gbps Ethernet |
| **Power Supply** | Dual redundant 350W PSU |
| **Total Cost** | **₹1,25,000** |

**Purpose:**
- Session management
- Application caching
- WebSocket state management
- Real-time chat performance

---

#### 4. File Storage Server - ₹1,75,000

**Model:** Dell PowerEdge R350 + Storage Expansion

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon E-2388G (8 cores, 3.2 GHz) |
| **RAM** | 16 GB DDR4 ECC |
| **Storage (SSD)** | 500 GB NVMe (OS + cache) |
| **Storage (HDD)** | 5 TB HDD (RAID 5 - 4 × 1.5TB drives) |
| **Network** | 10 Gbps Ethernet |
| **RAID Controller** | Hardware RAID with BBU |
| **Total Cost** | **₹1,75,000** |

**Purpose:**
- User-uploaded files (documents, images, videos)
- MinIO S3-compatible storage
- RAID 5 for redundancy

---

#### 5. Load Balancer - ₹80,000

**Model:** Dell PowerEdge R350 (Basic config)

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon E-2314 (4 cores, 2.8 GHz) |
| **RAM** | 8 GB DDR4 ECC |
| **Storage** | 100 GB SSD |
| **Network** | Dual 10 Gbps Ethernet |
| **Software** | NGINX/HAProxy (free) |
| **Total Cost** | **₹80,000** |

**Purpose:**
- Distribute traffic between 2 app servers
- SSL termination
- High availability

---

#### 6. Backup Server - ₹1,75,000

**Model:** Dell PowerEdge R350 + Large Storage

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon E-2314 (4 cores, 2.8 GHz) |
| **RAM** | 16 GB DDR4 ECC |
| **Storage (HDD)** | 10 TB HDD (RAID 6 - 6 × 2TB drives) |
| **Network** | 10 Gbps Ethernet |
| **RAID Controller** | Hardware RAID with BBU |
| **Total Cost** | **₹1,75,000** |

**Purpose:**
- Daily automated backups (database + files)
- 30-day backup retention
- Disaster recovery
- RAID 6 (can lose 2 disks)

---

#### 7. Network Equipment - ₹2,00,000

| Item | Specification | Cost (₹) |
|------|---------------|----------|
| **10 Gbps Switch** | Cisco Catalyst 1000 (24-port) | 50,000 |
| **Firewall** | Cisco ASA 5516-X or FortiGate 60F | 1,50,000 |
| **Total** | | **₹2,00,000** |

**Purpose:**
- Switch: Connect all servers at 10 Gbps
- Firewall: Security, intrusion prevention, VPN for Bitflow remote access

---

#### 8. Power & Rack - ₹2,15,000

| Item | Specification | Cost (₹) |
|------|---------------|----------|
| **UPS** | 10 KVA Online UPS (45 min backup) | 1,50,000 |
| **Rack Cabinet** | 42U server rack with cooling | 40,000 |
| **Cabling & Accessories** | Cat6 cables, power cables, PDU | 25,000 |
| **Total** | | **₹2,15,000** |

---

### HARDWARE COST SUMMARY

| Component | Quantity | Unit Cost (₹) | Total (₹) |
|-----------|----------|---------------|-----------|
| Application Servers (R740) | 2 | 2,50,000 | 5,00,000 |
| Database Server (R750) | 1 | 5,00,000 | 5,00,000 |
| Redis Server (R350) | 1 | 1,25,000 | 1,25,000 |
| File Storage Server (R350) | 1 | 1,75,000 | 1,75,000 |
| Load Balancer (R350) | 1 | 80,000 | 80,000 |
| Backup Server (R350) | 1 | 1,75,000 | 1,75,000 |
| Network Equipment | - | 2,00,000 | 2,00,000 |
| UPS & Rack | - | 2,15,000 | 2,15,000 |
| **TOTAL HARDWARE** | | | **₹17,70,000** |

**Hardware Procurement:**
- MVP purchases directly from Dell/HP/Cisco
- Bitflow can coordinate (5% coordination fee)
- 3-year manufacturer warranty included
- AMC after warranty: ₹2L/year

---

## PRICING BREAKDOWN

### Year 1 Costs (Setup + Hardware + Subscription)

#### A. ONE-TIME SETUP COSTS

| Item | Description | Amount (₹) |
|------|-------------|------------|
| **Platform Setup** |
| On-premise deployment | Full stack installation | 7,00,000 |
| Hardware installation | Server racking, cabling, config | 3,00,000 |
| Network configuration | VLANs, firewall rules, security | 1,00,000 |
| **Subtotal - Platform Setup** | | **11,00,000** |
| **Data Migration** |
| Data audit & mapping | Analyze existing systems | 50,000 |
| Database migration | 50,000 students + 3,000 faculty | 2,00,000 |
| File migration | Historical documents | 50,000 |
| **Subtotal - Data Migration** | | **2,50,000** |
| **Training** |
| MVP admin training | Basic monitoring, not full management | 1,00,000 |
| College admin training | System usage, 120 hours | 3,00,000 |
| Faculty training | Included | 0 |
| **Subtotal - Training** | | **3,00,000** |
| **Customization** |
| MVP branding | Logo, colors, domain | 2,50,000 |
| Custom workflows | 5 workflows | 75,000 |
| Custom reports | 15 reports | 1,50,000 |
| **Subtotal - Customization** | | **2,50,000** |
| **Integration** |
| Payment gateway | Razorpay integration | 50,000 |
| Biometric devices | 37 colleges | 5,55,000 |
| SMS/Email gateway | Communication | 45,000 |
| Video conferencing | Zoom/Google Meet | 30,000 |
| ERP integration (optional) | Tally/SAP connector | 50,000 |
| Reduced (basic) | Exclude advanced integrations Year 1 | -4,30,000 |
| **Subtotal - Integration** | | **2,00,000** |
| **Code Protection** |
| Code obfuscation (maximum) | Protect IP | 3,00,000 |
| License verification system | Daily phone-home | 1,50,000 |
| Binary compilation | TypeScript to native binary | 50,000 |
| **Subtotal - Code Protection** | | **5,00,000** |
| **TOTAL ONE-TIME SETUP** | | **₹25,00,000** |

#### B. HARDWARE (MVP PURCHASES)

| Item | Amount (₹) |
|------|------------|
| Complete Server Infrastructure (as detailed above) | 17,70,000 |
| **TOTAL HARDWARE** | **₹17,70,000** |

#### C. ANNUAL SUBSCRIPTION (YEAR 1)

| Item | Description | Amount (₹) |
|------|-------------|------------|
| Software License (Professional) | 37 colleges | 38,50,000 |
| Managed Services | 24x7 remote management | 15,00,000 |
| Remote Monitoring | CloudWatch, alerts, logs | Included |
| On-Site Visits | 4 visits/year included | Included |
| **TOTAL ANNUAL SUBSCRIPTION** | | **₹53,50,000** |

#### YEAR 1 TOTAL

| Description | Amount (₹) |
|-------------|------------|
| One-Time Setup (A) | 25,00,000 |
| Hardware (B) | 17,70,000 |
| Annual Subscription (C) | 53,50,000 |
| **Subtotal** | **96,20,000** |
| **GST @ 18%** | **17,31,600** |
| **GRAND TOTAL YEAR 1** | **₹1,13,51,600** |

---

### Year 2 Onwards (Recurring)

#### Bitflow Subscription & Managed Services

| Item | Amount (₹) |
|------|------------|
| Software License | 38,50,000 |
| Managed Services (24x7) | 15,00,000 |
| Remote Monitoring | Included |
| On-Site Visits (4/year) | Included |
| Support & Maintenance | Included |
| **Subtotal** | **53,50,000** |
| **GST @ 18%** | **9,63,000** |
| **TOTAL BITFLOW (YEAR 2+)** | **₹63,13,000** |

#### MVP Infrastructure Costs (Annual)

| Item | Annual Cost (₹) |
|------|----------------|
| Electricity (24x7, ~5 KW avg) | 2,00,000 |
| Internet (1 Gbps dedicated fiber) | 6,00,000 |
| Cooling/HVAC (server room) | 1,50,000 |
| Hardware AMC (after warranty) | 2,00,000 |
| Physical Security | 50,000 |
| **TOTAL MVP INFRASTRUCTURE** | **₹12,00,000** |

#### Total Cost of Ownership (Year 2+)

| Item | Amount (₹) |
|------|------------|
| Bitflow Subscription + Managed Services | 63,13,000 |
| MVP Infrastructure Costs | 12,00,000 |
| **TOTAL YEAR 2+** | **₹75,13,000** |

**Price Lock:** Years 1-3 (no increase)  
**Year 4+:** Maximum 5% annual increase on Bitflow subscription

---

## PAYMENT SCHEDULE

### Year 1 Milestone-Based Payments

| Milestone | Deliverable | % | Amount (₹) | Timeline |
|-----------|-------------|---|------------|----------|
| **1. Contract Signing** | Contract + hardware order | 30% | 34,05,480 | Day 1 |
| **2. Hardware Installed** | Servers racked, network configured | 25% | 28,37,900 | Month 2 |
| **3. Pilot Go-Live** | 5 colleges live | 30% | 34,05,480 | Month 4 |
| **4. Full Go-Live** | All 37 colleges live | 15% | 17,02,740 | Month 12 |
| **TOTAL YEAR 1** | | **100%** | **₹1,13,51,600** | |

### Year 2+ Payment Options

**Option A: Annual Prepayment (5% Discount)**
- Pay ₹59,97,350 once/year (Save ₹3,15,650)

**Option B: Quarterly Payment**
- Pay ₹15,78,250 per quarter

**Option C: Monthly Payment**
- Pay ₹5,26,083 per month

---

## IMPLEMENTATION TIMELINE

### Phase 1: Hardware Setup (Months 1-2)

**Month 1: Procurement & Delivery**
- Week 1-2: MVP purchases hardware (Dell/HP/Cisco quotes)
- Week 3-4: Delivery and inspection

**Month 2: Installation**
- Week 1-2: Server racking, cabling, power
- Week 3-4: Network config, firewall setup, OS installation
- Deliverable: All hardware operational

### Phase 2: Software Deployment (Months 3-4)

**Month 3: Application Deployment**
- Week 1-2: Install Docker, Kubernetes, database
- Week 3-4: Deploy Bitflow application stack
- Data migration begins

**Month 4: Pilot Launch**
- Week 1-2: Launch 5 pilot colleges
- Week 3-4: Training, feedback, refinement
- Deliverable: Successful pilot

### Phase 3: Rollout (Months 5-9)

**Month 5-7: Phased Expansion**
- Deploy to 10 more colleges
- Performance tuning

**Month 8-9: Full Deployment**
- Deploy to remaining colleges
- All 37 colleges live

### Phase 4: Optimization (Months 10-12)

**Month 10-12: Go-Live**
- Performance optimization
- Advanced features
- System acceptance

**Total Implementation:** 12 months

---

## 5-YEAR COST PROJECTION

| Year | Bitflow (₹) | MVP Infra (₹) | Total (₹) | Cumulative (₹) |
|------|-------------|---------------|-----------|----------------|
| **Year 1** | 1,13,51,600 | 0 | 1,13,51,600 | 1,13,51,600 |
| **Year 2** | 63,13,000 | 12,00,000 | 75,13,000 | 1,88,64,600 |
| **Year 3** | 63,13,000 | 12,00,000 | 75,13,000 | 2,63,77,600 |
| **Year 4** | 66,28,650 | 12,00,000 | 78,28,650 | 3,42,06,250 |
| **Year 5** | 69,60,083 | 12,00,000 | 81,60,083 | 4,23,66,333 |
| **5-YEAR TOTAL** | | | | **₹4,23,66,333** |

**Average Annual Cost (Years 2-5):** ₹77,50,183

---

## ADVANTAGES OF MANAGED ON-PREMISE

### ✅ Complete Data Control
- **100% On-Premise:** All data stays at MVP's data center
- **Compliance:** Perfect for NAAC/NBA/UGC audits
- **Data Sovereignty:** Zero data residency issues
- **Air-Gap Ready:** Can work without internet (only for updates)
- **Physical Security:** Data behind MVP's physical security

### ✅ Professional Management (No IT Team Needed)
- **Bitflow Manages Everything:** OS, apps, database, backups
- **24x7 Monitoring:** Proactive issue detection
- **Automatic Updates:** We deploy remotely
- **Expert Team:** Experienced DevOps engineers
- **Zero MVP IT Overhead:** No need to hire DevOps staff

### ✅ Code Protection
- **Bitflow Has Root Access:** MVP cannot copy code
- **License Verification:** Daily check to cloud
- **Code Obfuscation:** Maximum protection
- **Remote Updates Only:** MVP cannot modify code

### ✅ High Availability
- **Redundant Servers:** 2 app servers (failover)
- **RAID Protection:** Database and file redundancy
- **Load Balancer:** Traffic distribution
- **Daily Backups:** 30-day retention

### ✅ Performance
- **No Internet Latency:** All on local network
- **Dedicated Hardware:** Not shared with others
- **Optimized:** Tuned for MVP's workload
- **Low Latency:** <10ms response time

---

## DISADVANTAGES TO CONSIDER

### ⚠️ Potential Concerns

**1. Highest Upfront Cost**
- ₹1.13 Cr in Year 1 (vs ₹63L cloud SaaS)
- *Mitigation:* Hardware is one-time; long-term asset

**2. Higher Annual Cost**
- ₹75L/year (vs ₹45L cloud SaaS)
- *Mitigation:* Includes 24x7 managed services (worth ₹30L+ alone)

**3. Infrastructure Costs**
- ₹12L/year (electricity, internet, cooling)
- *Mitigation:* Predictable costs; no surprises

**4. Physical Space Required**
- Needs temperature-controlled server room
- *Mitigation:* Most universities already have IT rooms

**5. Limited MVP Access**
- Bitflow has root access, MVP has read-only
- *Mitigation:* We provide dashboards and reports; MVP can monitor everything

---

## IDEAL FOR

This deployment option is perfect for MVP if you:

✅ Have **strict data residency** requirements (government/compliance)  
✅ Have **unreliable internet** at some colleges  
✅ Want **complete on-premise** control but **lack IT expertise**  
✅ Need **air-gapped** deployment (defense/security sensitive)  
✅ Prefer **professional management** over hiring DevOps team  
✅ Can afford **higher upfront** cost (₹1.13 Cr Year 1)  
✅ Want **zero day-to-day IT work** (we handle everything)  

---

## ACCESS & RESPONSIBILITIES

### Bitflow's Access & Responsibilities

| Task | Access Level | Frequency |
|------|--------------|-----------|
| **Server Management** | Root/sudo access | 24x7 |
| **OS Updates** | Full access | Weekly |
| **Application Deployment** | Full access | As needed |
| **Database Management** | Full access | Daily |
| **Backup Management** | Full access | Daily |
| **Monitoring** | Full access | 24x7 |
| **Remote Access** | VPN (encrypted) | As needed |
| **On-Site Visits** | Physical access | 4/year |

### MVP's Access & Responsibilities

| Task | Access Level | Frequency |
|------|--------------|-----------|
| **Application Usage** | Web UI (admin) | 24x7 |
| **Monitoring Dashboards** | Read-only (Grafana) | 24x7 |
| **Logs & Reports** | Read-only | 24x7 |
| **Data Export** | API access | As needed |
| **Physical Security** | Full (server room) | 24x7 |
| **Power & Cooling** | Full (UPS, HVAC) | 24x7 |
| **Internet Connectivity** | Full (ISP) | 24x7 |
| **Server Access** | ⚠️ None (Bitflow manages) | N/A |

---

## TERMS & CONDITIONS

### 1. Service Level Agreement
- **Uptime:** 99.9% guaranteed
- **Response Time:** <2 hours (critical), <4 hours (high)
- **On-Site Visits:** 4 included/year (additional ₹50K/visit)
- **Maintenance Windows:** 4 hours/month (7-day notice)

### 2. Access & Management
- **Root Access:** Bitflow exclusive (for management)
- **MVP Access:** Read-only monitoring dashboards
- **Remote Access:** Bitflow via encrypted VPN only
- **Physical Access:** MVP controls server room

### 3. Data Ownership & Security
- **Data Ownership:** 100% MVP (on MVP's servers)
- **Code Ownership:** 100% Bitflow (protected)
- **Data Access:** Bitflow for app operation only
- **Data Export:** MVP can export anytime
- **Backups:** Daily, stored on MVP's backup server

### 4. Hardware & Infrastructure
- **Hardware Ownership:** MVP owns all hardware
- **Warranty:** 3-year manufacturer warranty
- **AMC:** ₹2L/year after warranty (Year 4+)
- **Replacement:** MVP responsible for failed hardware
- **Bitflow Support:** We handle software side

### 5. Managed Services
- **24x7 Monitoring:** Included (CloudWatch, Grafana)
- **OS Updates:** Included (Ubuntu patches)
- **Application Updates:** Included (Bitflow deploys)
- **Database Tuning:** Included (query optimization)
- **Security Patches:** Included (same-day critical)

### 6. Payment Terms
- **Payment Method:** Bank transfer (NEFT/RTGS)
- **Payment Due:** 15 days from invoice
- **Hardware:** MVP pays vendor directly
- **Late Payment:** 1.5% interest/month

### 7. Contract Duration
- **Initial Term:** 3 years minimum
- **Renewal:** Auto-renewal unless 90-day notice
- **Price Lock:** Years 1-3 (no increase)
- **Year 4+:** Max 5% annual increase

### 8. Termination
- **Notice:** 90 days required
- **Data:** MVP keeps (on their servers)
- **Access:** Bitflow returns root access to MVP
- **Handover:** 30-day knowledge transfer (₹5L fee)
- **No Refund:** Annual subscription non-refundable

---

## ACCEPTANCE

**I/We select Option 3: Managed On-Premise deployment and agree to the terms outlined above.**

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

**Sales Team:** sales@bitflow.io | +91-98765-43210  
**Technical Support:** support@bitflow.io | +91-98765-43211  
**Managed Services:** ops@bitflow.io | +91-98765-43213  
**Accounts:** accounts@bitflow.io | +91-98765-43212  

**Office:** Tech Park, Phase 1, Hinjewadi, Pune - 411057  
**Website:** www.bitflow.io

## BANK DETAILS

**Account Name:** Bitflow Technologies Pvt. Ltd.  
**Bank:** HDFC Bank, Hinjewadi Branch  
**Account No:** 50200012345678  
**IFSC:** HDFC0001234  
**GST:** 27AABCB1234F1Z5  

---

**END OF QUOTATION**

**Reference:** BITFLOW-MVP-MANAGED-2025-003  
**For:** Government/Compliance-Heavy Organizations  
**Date:** October 30, 2025
