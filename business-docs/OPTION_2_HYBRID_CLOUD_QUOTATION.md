# OPTION 2: HYBRID CLOUD ⭐ (RECOMMENDED)

**BITFLOW LMS - Hybrid Cloud Deployment**  
**Data on MVP's Servers | Application on Bitflow Cloud**

---

## QUOTATION DETAILS

**Quotation No:** BITFLOW-MVP-HYBRID-2025-002  
**Date of Issue:** October 30, 2025  
**Valid Until:** November 29, 2025 (30 Days)  
**Deployment Model:** Hybrid Cloud (Database on-premise, App in cloud)  
**⭐ RECOMMENDED FOR MVP:** Best balance of data ownership + code protection

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
│  ✓ Next.js Frontend (AWS/Vercel)        │
│  ✓ Node.js API (AWS ECS)                │
│  ✓ Redis Cache (AWS ElastiCache)        │
│  ✓ Application Logic (Bitflow IP)       │
│  ✓ CDN (CloudFront)                     │
│  ✓ Load Balancer (AWS ALB)              │
└─────────────────────────────────────────┘
           ↕️ Secure VPN Tunnel (Encrypted)
┌─────────────────────────────────────────┐
│      MVP ON-PREMISE DATA CENTER         │
├─────────────────────────────────────────┤
│  ✓ PostgreSQL Database (MVP owns data)  │
│  ✓ File Storage Server (MVP owns files) │
│  ✓ Encrypted Backups (MVP controls)     │
│  ⚠️ Data NEVER leaves MVP's premises     │
└─────────────────────────────────────────┘
           ↕️ HTTPS (Internal Network)
┌─────────────────────────────────────────┐
│      MVP USERS (504 Institutions)       │
│  213,576 Students + 11,161 Employees    │
│  ~436,313 Total Users (incl. parents)   │
│  Access via web browser (any device)    │
└─────────────────────────────────────────┘
```

**Key Architecture Benefits:**
- ✅ **Data stays at MVP** (database + files on MVP's servers)
- ✅ **Code stays with Bitflow** (application on our cloud)
- ✅ **Secure VPN tunnel** (encrypted connection between cloud and MVP)
- ✅ **Best of both worlds** (compliance + innovation)

---

## WHY HYBRID CLOUD? (RECOMMENDED FOR MVP)

### ✅ Data Ownership & Compliance
- **100% Data Control:** All student/faculty data stored on MVP's servers
- **NAAC/NBA Friendly:** Data on-premise for audits
- **UGC Compliance:** No data residency issues
- **Data Sovereignty:** MVP owns and controls all data
- **Independent Backups:** MVP can backup data independently

### ✅ Code Protection (Bitflow's IP)
- **Application Code Protected:** Code remains on Bitflow's cloud
- **No Code Access:** MVP cannot reverse-engineer or copy
- **Sustainable Partnership:** MVP can't "steal and leave"
- **Automatic Updates:** Bitflow deploys updates remotely
- **License Verification:** System validates license daily

### ✅ Cost-Effective
- **Lower Hardware Cost:** Only ₹9.8L (vs ₹17.7L full on-premise)
- **No Large IT Team:** 1-2 staff sufficient (vs 4+ for self-managed)
- **Shared Infrastructure:** MVP pays for DB hosting, Bitflow for app hosting
- **Predictable Costs:** Clear separation of responsibilities

### ✅ Best Security
- **Data Behind Firewall:** Protected by MVP's network security
- **Enterprise Cloud:** Application on ISO 27001 certified cloud
- **Encrypted Tunnel:** VPN with AES-256 encryption
- **Dual Protection:** Best of cloud security + on-premise control

### ✅ Easier Management
- **Bitflow Manages App:** We handle application updates
- **MVP Manages Data:** Simple database administration
- **Automatic Scaling:** Cloud side scales automatically
- **Split Responsibilities:** Clear division of duties

---

## WHAT'S INCLUDED

### Bitflow Cloud Infrastructure (Managed by Us)

| Component | Specification | Included |
|-----------|---------------|----------|
| Application Hosting | AWS ECS/EC2 auto-scaling | ✅ Yes |
| Frontend Hosting | Next.js on Vercel/AWS | ✅ Yes |
| Redis Cache | AWS ElastiCache (8 GB) | ✅ Yes |
| Load Balancer | AWS ALB (high availability) | ✅ Yes |
| CDN | CloudFront global delivery | ✅ Yes |
| SSL Certificate | Wildcard SSL (auto-renewal) | ✅ Yes |
| Monitoring | CloudWatch + alerts | ✅ Yes |
| VPN Tunnel | Site-to-site VPN (secure) | ✅ Yes |

### MVP On-Premise Infrastructure (MVP Purchases)

| Component | Specification | MVP Buys |
|-----------|---------------|----------|
| Database Server | 64 vCores, 512 GB RAM, 10 TB SSD | ⚠️ Yes |
| File Storage Server | 16 vCores, 64 GB RAM, 50 TB HDD | ⚠️ Yes |
| VPN Router/Firewall | Cisco ASA 5555-X or FortiGate 200F | ⚠️ Yes |
| Network Switch | 10 Gbps, 48-port managed | ⚠️ Yes |
| UPS | 15 KVA online UPS | ⚠️ Yes |
| Rack Cabinet | 42U server rack | ⚠️ Yes |

**Total Hardware Cost (MVP):** ₹35,00,000 (one-time)

### Software Features

| Feature | Details | Included |
|---------|---------|----------|
| **All 22 Portals** | Complete system access | ✅ Yes |
| **Unlimited Users** | No per-user fees | ✅ Yes |
| **Mobile Access** | Responsive web app | ✅ Yes |
| **API Access** | Full REST API | ✅ Yes |
| **Custom Branding** | MVP logo, colors | ✅ Yes |
| **Data Ownership** | ✅ MVP owns 100% | ✅ Yes |
| **Code Ownership** | ✅ Bitflow owns (protected) | ✅ Yes |

### Support & Maintenance

| Service | Details | Included |
|---------|---------|----------|
| Support Hours | 9 AM - 9 PM (Mon-Sat) | ✅ Yes |
| Support Channels | Email + Phone + Chat | ✅ Yes |
| Response Time (Critical) | <4 hours | ✅ Yes |
| Dedicated Account Manager | Yes | ✅ Yes |
| Software Updates | Automatic (Bitflow deploys) | ✅ Yes |
| VPN Maintenance | Managed by Bitflow | ✅ Yes |
| Database Support | Consulting included | ✅ Yes |

---

## MVP HARDWARE REQUIREMENTS

### Detailed Server Specifications

#### 1. Database Server (₹18,00,000)

**Model:** Dell PowerEdge R750 or HP ProLiant DL380 Gen10 Plus

| Component | Specification |
|-----------|---------------|
| **CPU** | 2× Intel Xeon Platinum 8360Y (64 cores total, 2.4 GHz) |
| **RAM** | 512 GB DDR4 ECC (16 × 32GB) - expandable to 768GB |
| **Storage** | 10 TB NVMe SSD (RAID 10 - 8 × 1.28TB drives) |
| | Usable: ~10 TB after RAID overhead |
| **Network** | Dual 25 Gbps Ethernet (bonded for 50 Gbps) |
| **RAID Controller** | Hardware RAID controller with 4GB cache + BBU |
| **Power Supply** | Dual redundant 1600W PSU |
| **OS License** | Ubuntu 22.04 LTS Server (free) |

**Purpose:**
- Host PostgreSQL database with 504 tenant schemas
- Store all student, faculty, academic, financial data (213K students + 11K employees)
- Handle 5,000+ concurrent queries at peak
- RAID 10 for data protection (can lose 4 disks without data loss)

---

#### 2. File Storage Server (₹8,00,000)

**Model:** Dell PowerEdge R750xs + Storage Expansion

| Component | Specification |
|-----------|---------------|
| **CPU** | Intel Xeon Gold 5320 (16 cores, 2.2 GHz) |
| **RAM** | 64 GB DDR4 ECC (4 × 16GB) |
| **Storage (SSD)** | 1 TB NVMe SSD (OS + cache) |
| **Storage (HDD)** | 50 TB HDD (RAID 6 - 12 × 5TB drives) |
| | Usable: ~45 TB after RAID overhead |
| **Network** | Dual 10 Gbps Ethernet |
| **RAID Controller** | Hardware RAID with 8GB cache + BBU |
| **Power Supply** | Dual redundant 750W PSU |
| **OS License** | Ubuntu 22.04 LTS + MinIO (free) |

**Purpose:**
- Store user-uploaded files (documents, images, videos, PDFs)
- S3-compatible storage (MinIO)
- RAID 6 for redundancy (can lose 2 disks without data loss)
- 45 TB usable space (~90 GB per institution average)

---

#### 3. VPN Router/Firewall (₹5,00,000)

**Model:** Cisco ASA 5555-X or Fortinet FortiGate 200F

| Component | Specification |
|-----------|---------------|
| **Throughput** | 10 Gbps firewall, 2 Gbps VPN |
| **Concurrent Sessions** | 500,000+ |
| **VPN Tunnels** | Up to 750 site-to-site tunnels |
| **Ports** | 12 × 1 Gbps Ethernet + 4 × 10 Gbps SFP+ |
| **Features** | Next-gen firewall, IPS, malware protection, DDoS |
| **Redundancy** | Dual power supply, HA failover support |
| **Management** | Web GUI + CLI + cloud management |
| **License** | 3-year security subscription included |

**Purpose:**
- Secure VPN tunnel to Bitflow cloud (encrypted site-to-site)
- Enterprise firewall protection for database + storage servers
- Traffic inspection and logging (504 institutions = high traffic)
- DDoS protection and intrusion prevention

---

#### 4. Network Switch (₹1,50,000)

**Model:** Cisco Catalyst 9300 or HP Aruba 3810M

| Component | Specification |
|-----------|---------------|
| **Ports** | 48 × 1 Gbps + 4 × 10 Gbps SFP+ uplinks |
| **Switching Capacity** | 336 Gbps |
| **Features** | Layer 3, VLAN, QoS, LACP, stacking |
| **Management** | Web-managed + CLI + SNMP |
| **Rack Mount** | 1U 19-inch rackmount |
| **Power** | Dual redundant PSU |

---

#### 5. UPS (₹1,50,000)

**Model:** APC Smart-UPS SRT or Emerson Liebert

| Component | Specification |
|-----------|---------------|
| **Capacity** | 15 KVA / 12,000W |
| **Backup Time** | 45-60 minutes at 80% load |
| **Output** | Pure sine wave, 230V |
| **Battery** | Hot-swappable, sealed lead-acid |
| **Ports** | 12 output sockets (C13/C19) |
| **Monitoring** | Network management card, LCD display |
| **Efficiency** | 95%+ (online double-conversion) |

---

#### 6. Server Rack Cabinet (₹50,000)

**Model:** APC NetShelter SX or Tripp Lite

| Component | Specification |
|-----------|---------------|
| **Size** | 42U (2 meters height) |
| **Width** | 19-inch standard |
| **Depth** | 1200mm (deep servers) |
| **Features** | Lockable perforated doors, cable management |
| **Cooling** | Roof-mounted fan tray (4 fans) |
| **Load Capacity** | 1500 kg static load |

---

#### 7. Cabling & Accessories (₹50,000)

| Item | Quantity | Purpose |
|------|----------|---------|
| Cat6a Ethernet Cables (5m) | 15 | Server connections |
| Cat6a Ethernet Cables (10m) | 10 | Long runs |
| Fiber Optic Cables (10G SFP+) | 4 | High-speed uplinks |
| Power Cables (C13-C14) | 20 | Server power |
| Cable Management Trays | 2 | Organize cables |
| Patch Panel (48-port) | 2 | Network organization |
| Keyboard/Monitor/Mouse | 1 | Server management |

---

### HARDWARE COST SUMMARY

| Component | Model | Unit Cost (₹) | Qty | Total (₹) |
|-----------|-------|---------------|-----|-----------|
| Database Server | Dell R750 (64 cores, 512GB RAM) | 18,00,000 | 1 | 18,00,000 |
| File Storage Server | Dell R750xs (50TB RAID 6) | 8,00,000 | 1 | 8,00,000 |
| VPN Router/Firewall | Cisco ASA 5555-X / FortiGate 200F | 5,00,000 | 1 | 5,00,000 |
| Network Switch | Cisco Catalyst 9300 (48-port) | 1,50,000 | 1 | 1,50,000 |
| UPS | APC 15 KVA | 1,50,000 | 1 | 1,50,000 |
| Rack Cabinet | APC NetShelter 42U | 50,000 | 1 | 50,000 |
| Cabling & Accessories | Various | 50,000 | 1 | 50,000 |
| **TOTAL HARDWARE** | | | | **₹35,00,000** |

**Hardware Vendor Options:**
- MVP can purchase from Dell/HP directly (vendor quote required)
- Bitflow can coordinate purchase (same price + 5% coordination fee)
- MVP can choose equivalent brands (Lenovo, HPE, Supermicro, etc.)

---

## PRICING BREAKDOWN

### Year 1 Costs (Setup + Hardware + Subscription)

#### A. ONE-TIME SETUP COSTS

| Item | Description | Amount (₹) |
|------|-------------|------------|
| **Platform Setup** |
| Hybrid architecture setup | Cloud + on-premise integration | 15,00,000 |
| VPN tunnel configuration | Secure connection setup | 5,00,000 |
| Database server setup | PostgreSQL installation & config (504 schemas) | 8,00,000 |
| File storage setup | MinIO S3-compatible storage (50TB) | 3,00,000 |
| Network configuration | Firewall rules, routing, security | 2,00,000 |
| **Subtotal - Platform Setup** | | **33,00,000** |
| **Data Migration** |
| Data audit & mapping | Analyze existing systems (504 institutions) | 2,00,000 |
| Database migration | 213,576 students + 11,161 employees | 7,50,000 |
| Historical data | 5 years academic records (504 institutions) | 15,00,000 |
| File migration | Upload existing files to storage (50TB capacity) | 3,00,000 |
| **Subtotal - Data Migration** | | **27,50,000** |
| **Training** |
| Admin training (MVP IT team) | Database management, backups (40 hours) | 3,00,000 |
| Admin training (College admins) | System usage (504 institutions, video-based) | 15,00,000 |
| Faculty training | Included in subscription | 0 |
| Student orientation | Online videos | 0 |
| **Subtotal - Training** | | **18,00,000** |
| **Customization** |
| MVP branding | Logo, colors, domain (504 institutions) | 5,00,000 |
| Custom workflows | 10 workflows (diverse institution types) | 2,50,000 |
| Custom reports | 30 reports (various institution types) | 4,50,000 |
| **Subtotal - Customization** | | **12,00,000** |
| **Integration** |
| Payment gateway | Razorpay integration | 1,00,000 |
| SMS/Email gateway | Communication services | 1,50,000 |
| Video conferencing | Zoom/Google Meet | 75,000 |
| Biometric integration (future) | Phased rollout Year 2-3 | 0 |
| **Subtotal - Integration** | | **3,25,000** |
| **Code Protection** |
| License verification system | Daily phone-home to Bitflow cloud | 2,00,000 |
| Code obfuscation | Protect intellectual property | 1,50,000 |
| Security hardening | VPN encryption, access control | 1,00,000 |
| **Subtotal - Code Protection** | | **4,50,000** |
| **TOTAL ONE-TIME SETUP** | | **₹1,00,25,000** |

#### B. HARDWARE (MVP PURCHASES)

| Item | Amount (₹) |
|------|------------|
| Database + Storage + Network Infrastructure | 35,00,000 |
| **TOTAL HARDWARE** | **₹35,00,000** |

#### C. ANNUAL SUBSCRIPTION (YEAR 1)

| Item | Description | Amount (₹) |
|------|-------------|------------|
| Software License (Enterprise) | 504 institutions | 1,25,00,000 |
| Cloud Hosting (Application) | AWS ECS + Redis + CDN (6-20 instances) | 30,00,000 |
| VPN Maintenance | Tunnel management, monitoring | 5,00,000 |
| **TOTAL ANNUAL SUBSCRIPTION** | | **₹1,60,00,000** |

#### YEAR 1 TOTAL

| Description | Amount (₹) |
|-------------|------------|
| One-Time Setup (A) | 1,00,25,000 |
| Hardware (B) | 35,00,000 |
| Annual Subscription (C) | 1,60,00,000 |
| **Subtotal** | **2,95,25,000** |
| **GST @ 18%** | **53,14,500** |
| **GRAND TOTAL YEAR 1** | **₹3,48,39,500** |

---

### Year 2 Onwards (Recurring)

#### Bitflow Subscription

| Item | Amount (₹) |
|------|------------|
| Software License | 1,25,00,000 |
| Cloud Hosting (Application) | 30,00,000 |
| VPN Maintenance | 5,00,000 |
| Support & Maintenance | Included |
| **Subtotal** | **1,60,00,000** |
| **GST @ 18%** | **28,80,000** |
| **TOTAL BITFLOW (YEAR 2+)** | **₹1,88,80,000** |

#### MVP Infrastructure Costs (Annual)

| Item | Annual Cost (₹) |
|------|----------------|
| Electricity (servers 24x7, ~8 KW) | 3,50,000 |
| Internet (1 Gbps dedicated fiber) | 7,20,000 |
| Server room cooling | 2,00,000 |
| Hardware AMC | 3,50,000 |
| **TOTAL MVP INFRASTRUCTURE** | **₹16,20,000** |

#### Total Cost of Ownership (Year 2+)

| Item | Amount (₹) |
|------|------------|
| Bitflow Subscription | 1,88,80,000 |
| MVP Infrastructure | 16,20,000 |
| **TOTAL YEAR 2+** | **₹2,05,00,000** |

**Price Lock:** Years 1-3 (no increase)  
**Year 4+:** Maximum 5% annual increase on Bitflow subscription only

---

## PAYMENT SCHEDULE

### Year 1 Milestone-Based Payments

| Milestone | Deliverable | % | Amount (₹) | Timeline |
|-----------|-------------|---|------------|----------|
| **1. Contract Signing** | Contract + hardware order | 25% | 87,09,875 | Day 1 |
| **2. Infrastructure Ready** | Servers installed, VPN configured | 20% | 69,67,900 | Month 3 |
| **3. Pilot Go-Live** | 50 institutions live | 30% | 1,04,51,850 | Month 6 |
| **4. Full Go-Live** | All 504 institutions live | 25% | 87,09,875 | Month 18 |
| **TOTAL YEAR 1** | | **100%** | **₹3,48,39,500** | |

### Year 2+ Payment Options

**Option A: Annual Prepayment (5% Discount)**
- Pay ₹1,94,75,000 once/year
- Save ₹10,25,000 annually

**Option B: Quarterly Payment**
- Pay ₹51,25,000 per quarter

**Option C: Monthly Payment**
- Pay ₹17,08,333 per month

---

## IMPLEMENTATION TIMELINE

### Phase 1: Infrastructure Setup (Months 1-2)

**Month 1: Hardware Procurement**
- Week 1-2: MVP purchases servers (Dell/HP quote)
- Week 3-4: Hardware delivery and installation
- Deliverable: Servers physically installed at MVP

**Month 2: Network & VPN Setup**
- Week 1-2: Configure VPN tunnel (MVP ↔ Bitflow cloud)
- Week 3-4: Database installation and security hardening
- Deliverable: Secure connectivity established

### Phase 2: Software Deployment (Months 3-4)

**Month 3: Database Migration**
- Week 1-2: Migrate data to MVP's database
- Week 3-4: Deploy application to Bitflow cloud
- Deliverable: System integrated and ready for pilot

**Month 4: Pilot Launch**
- Week 1-2: Launch 5 colleges
- Week 3-4: Train users, gather feedback
- Deliverable: Successful pilot with 5,000+ users

### Phase 3: Rollout (Months 5-9)

**Month 5-7: Phased Expansion**
- Deploy to 10 more colleges (15 total)
- Continue training and onboarding

**Month 8-9: Full Deployment**
- Deploy to remaining 22 colleges
- All 37 colleges live

### Phase 4: Go-Live (Months 10-12)

**Month 10-12: Optimization**
- Performance tuning
- Advanced features activation
- Final acceptance testing

**Total Implementation:** 12 months

---

## 5-YEAR COST PROJECTION

| Year | Bitflow (₹) | MVP Infra (₹) | Total (₹) | Cumulative (₹) |
|------|-------------|---------------|-----------|----------------|
| **Year 1** | 91,80,400 | 0 | 91,80,400 | 91,80,400 |
| **Year 2** | 56,64,000 | 3,80,000 | 60,44,000 | 1,52,24,400 |
| **Year 3** | 56,64,000 | 3,80,000 | 60,44,000 | 2,12,68,400 |
| **Year 4** | 59,47,200 | 3,80,000 | 63,27,200 | 2,75,95,600 |
| **Year 5** | 62,44,560 | 3,80,000 | 66,24,560 | 3,42,20,160 |
| **5-YEAR TOTAL** | | | | **₹3,42,20,160** |

**Average Annual Cost (Years 2-5):** ₹62,60,940

---

## COST COMPARISON: HYBRID vs. OTHER OPTIONS

| Deployment Model | Year 1 (₹) | Year 2+ (₹) | 5-Year Total (₹) |
|------------------|------------|-------------|-------------------|
| **Cloud SaaS** | 63,13,000 | 45,43,000 | 2,51,77,808 |
| **Hybrid Cloud** ⭐ | **91,80,400** | **60,44,000** | **3,42,20,160** |
| **Managed On-Premise** | 1,13,51,600 | 75,13,000 | 4,25,49,333 |
| **Self-Managed On-Premise** | 1,79,70,600 | 1,18,70,000 | 6,72,60,775 |

**Analysis:**
- ₹28.7L more than Cloud SaaS in Year 1
- ₹90.4L less than Managed On-Premise over 5 years
- ₹3.3 Cr less than Self-Managed over 5 years

---

## ADVANTAGES OF HYBRID CLOUD

### ✅ Data Ownership & Compliance
- **100% Data Control:** All data on MVP's servers (NAAC/NBA friendly)
- **Audit-Ready:** Data on-premise for compliance checks
- **Data Sovereignty:** No data residency issues
- **Independent Backups:** MVP can backup anytime
- **Privacy:** Student data never leaves MVP's network

### ✅ Code Protection (Win-Win Partnership)
- **IP Protection:** Bitflow's code stays on cloud (cannot be copied)
- **Sustainable:** MVP can't "steal and run" after Year 1
- **Automatic Updates:** Bitflow deploys updates remotely
- **License Verification:** Daily check ensures compliance
- **Partnership Trust:** Both parties benefit long-term

### ✅ Cost-Effective
- **Lower Hardware:** Only ₹9.8L (vs ₹17.7L full on-premise)
- **No Large IT Team:** 1-2 staff sufficient
- **Shared Costs:** MVP pays data hosting, Bitflow pays app hosting
- **Predictable:** Clear cost structure

### ✅ Security
- **Best of Both:** Cloud security + on-premise data control
- **Encrypted VPN:** AES-256 tunnel between cloud and MVP
- **Firewall Protection:** MVP's firewall protects database
- **ISO 27001 Cloud:** Application runs on certified infrastructure
- **Dual Monitoring:** Bitflow monitors app, MVP monitors data

### ✅ Easier Management
- **Bitflow Manages App:** We handle updates, scaling, monitoring
- **MVP Manages Data:** Simple database administration
- **Clear Separation:** No confusion about responsibilities
- **Expert Support:** Both teams focus on their strengths

### ✅ Performance
- **Low Latency:** Cloud app optimized for speed
- **Fast Database:** Local database for MVP users (no internet latency)
- **Auto-Scaling:** Cloud side scales automatically during peak usage
- **CDN:** Global content delivery for fast page loads

---

## DISADVANTAGES TO CONSIDER

### ⚠️ Potential Concerns

**1. Higher Year 1 Cost**
- ₹91.8L vs ₹63.1L for Cloud SaaS
- *Mitigation:* Hardware is one-time; saves ₹90L+ over 5 years vs managed on-premise

**2. VPN Dependency**
- Requires stable VPN connection between MVP and Bitflow cloud
- *Mitigation:* Redundant internet; fallback to mobile hotspot; 7-day grace period

**3. Hardware Maintenance**
- MVP responsible for database server uptime
- *Mitigation:* Simple hardware; AMC included; Bitflow provides DB support

**4. Split Infrastructure**
- More complex than full cloud or full on-premise
- *Mitigation:* Clear documentation; dedicated support; automated monitoring

---

## IDEAL FOR MVP

This deployment option is **PERFECT for MVP** if you:

✅ Need **data ownership** for compliance/audits (NAAC/NBA)  
✅ Want to protect **Bitflow's intellectual property** (good faith partnership)  
✅ Have **1-2 IT staff** who can manage database servers  
✅ Want **balanced cost** (₹90L less than managed on-premise over 5 years)  
✅ Prefer **best security** (data behind your firewall + cloud innovation)  
✅ Value **long-term partnership** (sustainable for both parties)  
✅ Want **automatic updates** without giving up data control  

**This is our #1 recommendation for MVP!**

---

## RESPONSIBILITIES MATRIX

### Bitflow's Responsibilities

| Task | Details |
|------|---------|
| **Application Hosting** | Host frontend + API on AWS cloud |
| **Software Updates** | Deploy all updates and new features |
| **VPN Management** | Maintain VPN tunnel, monitoring |
| **Cloud Monitoring** | 24x7 monitoring of application layer |
| **License Management** | License verification, renewals |
| **Support** | Email + phone support for users |
| **Training** | Initial and refresher training |
| **Security Patches** | Application-level security updates |

### MVP's Responsibilities

| Task | Details |
|------|---------|
| **Hardware Purchase** | Buy database + storage servers (₹9.8L) |
| **Data Center Space** | Provide temperature-controlled room |
| **Database Hosting** | Run PostgreSQL on MVP's server |
| **Database Backups** | Daily backups (automated scripts provided) |
| **Internet Connectivity** | 100 Mbps minimum (for VPN) |
| **Power** | UPS backup for servers |
| **Physical Security** | Secure server room access |
| **Hardware Maintenance** | Server AMC (₹1L/year) |
| **IT Staff** | 1-2 admins for database management |

---

## TERMS & CONDITIONS

### 1. Service Level Agreement
- **Uptime:** 99.9% for application layer
- **Response Time:** <4 hours for critical issues
- **Maintenance Windows:** 2 hours/month (7-day notice)
- **Database Uptime:** MVP's responsibility

### 2. Data Ownership & Security
- **Data Ownership:** 100% MVP (database on MVP's servers)
- **Code Ownership:** 100% Bitflow (app on our cloud)
- **Data Access:** Bitflow accesses MVP's DB via VPN (read/write for app only)
- **Data Export:** MVP can export anytime
- **VPN Security:** AES-256 encryption

### 3. Intellectual Property Protection
- **Code Location:** Bitflow's cloud (MVP cannot access)
- **License Verification:** System checks license every 24 hours
- **Updates:** Deployed by Bitflow only
- **Reverse Engineering:** Prohibited (₹5 Cr penalty)
- **Code Copying:** Prohibited (₹10 Cr penalty)

### 4. Hardware & Infrastructure
- **Hardware Ownership:** MVP owns all hardware
- **Warranty:** 3-year manufacturer warranty
- **Replacement:** MVP responsible for hardware failures
- **Bitflow Support:** We provide DB consulting (included)

### 5. Payment Terms
- **Payment Method:** Bank transfer (NEFT/RTGS)
- **Payment Due:** 15 days from invoice
- **Hardware:** MVP pays vendor directly (not to Bitflow)
- **Late Payment:** 1.5% interest/month

### 6. Contract Duration
- **Initial Term:** 3 years minimum
- **Renewal:** Auto-renewal unless 90-day notice
- **Price Lock:** Years 1-3 (no increase)
- **Year 4+:** Max 5% annual increase

### 7. Termination
- **Termination Notice:** 90 days required
- **Data:** MVP keeps all data (on their servers)
- **Code:** Bitflow stops cloud services after 90 days
- **No Refund:** Annual subscription non-refundable

---

## ACCEPTANCE

**I/We select Option 2: Hybrid Cloud deployment and agree to the terms outlined above.**

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

**Reference:** BITFLOW-MVP-HYBRID-2025-002  
**⭐ RECOMMENDED OPTION FOR MVP**  
**Date:** October 30, 2025
