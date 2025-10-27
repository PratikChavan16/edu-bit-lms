# College Admin Portal - Feature Specifications

**Version**: 1.0.0  
**Last Updated**: October 25, 2025  
**Total Features**: 8 Core + 15 Sub-features

---

## Table of Contents

1. [Feature 1: Staff Management System](#feature-1-staff-management-system)
2. [Feature 2: Infrastructure & Asset Management](#feature-2-infrastructure--asset-management)
3. [Feature 3: Transport Management](#feature-3-transport-management)
4. [Feature 4: Hostel Management](#feature-4-hostel-management)
5. [Feature 5: Document Services](#feature-5-document-services)
6. [Feature 6: Vendor Management](#feature-6-vendor-management)
7. [Feature 7: Grievance Management](#feature-7-grievance-management)
8. [Feature 8: Library Operations Support](#feature-8-library-operations-support)

---

## Feature 1: Staff Management System

### Overview

Complete attendance, leave, and roster management for 150+ non-teaching staff including clerks, peons, lab assistants, maintenance workers, and support staff.

### Business Requirements

**Priority**: P0 (Critical)  
**Complexity**: High  
**Users Impacted**: 150+ staff, College Admin, HR team  
**Business Value**: ₹50 Lakhs/year in manual tracking cost savings

**Business Rules**:
- Staff can only punch attendance during working hours (8:00 AM - 6:00 PM)
- Late punch after 9:00 AM is marked as late
- Half-day if punch after 11:00 AM
- Leave balance: Casual (12 days/year), Sick (12 days/year), Earned (15 days/year)
- Leave approval hierarchy: Supervisor → College Admin
- Monthly attendance report sent to HR on 1st of every month

### User Stories

**US-1.1**: Real-Time Attendance Dashboard  
**As a** College Admin  
**I want to** view real-time attendance of all non-teaching staff on a dashboard  
**So that** I can immediately identify absentees and late arrivals

**Acceptance Criteria**:
- Dashboard shows Present/Absent/Late/On Leave status for all 150 staff
- Color-coded indicators: Green (Present), Red (Absent), Yellow (Late), Blue (On Leave)
- Auto-refresh every 30 seconds
- Filters: Department, Location, Shift
- Export to Excel functionality
- Real-time punch notifications
- Absentee alert sent to College Admin at 9:15 AM

---

**US-1.2**: Leave Request Workflow  
**As a** Support Staff member  
**I want to** apply for leave via mobile app with reason  
**So that** I don't need to submit paper forms

**Acceptance Criteria**:
- Mobile app form with fields: Leave type, From date, To date, Reason, Attachment (medical certificate)
- Validation: Check leave balance before submission
- Auto-route to supervisor for approval
- Email + SMS notification to supervisor
- Supervisor can approve/reject with remarks
- Leave balance auto-updated after approval
- Leave history visible to staff

---

**US-1.3**: Duty Roster Generation  
**As a** College Admin  
**I want to** generate duty rosters for next week with shift rotation  
**So that** I can ensure fair distribution of shifts

**Acceptance Criteria**:
- Auto-generate roster based on shift patterns (Morning: 8 AM-2 PM, Afternoon: 2 PM-8 PM)
- Holiday rotation algorithm
- Staff preferences consideration (night shift exemptions for women staff)
- Drag-and-drop interface for manual adjustments
- Publish roster to staff mobile app
- SMS notification when roster is published
- Weekly roster report emailed to all staff

---

### Technical Specifications

**API Endpoints**:
```
GET /api/v1/staff/attendance/dashboard
POST /api/v1/staff/attendance/punch
GET /api/v1/staff/leave/balance
POST /api/v1/staff/leave/apply
PUT /api/v1/staff/leave/{id}/approve
POST /api/v1/staff/roster/generate
```

**Database Tables**:
- `staff_members` (id, employee_code, name, department, designation, biometric_id)
- `staff_attendance` (id, staff_id, date, punch_in, punch_out, status, location)
- `staff_leaves` (id, staff_id, leave_type, from_date, to_date, reason, status, approver_id)
- `staff_rosters` (id, staff_id, date, shift, location)

**Biometric Integration**:
- Device: Realtime T502 (SDK: ZKTeco)
- Protocol: TCP/IP
- Data format: JSON payload with employee_id, timestamp, device_id
- Endpoint: POST /api/v1/staff/attendance/biometric-webhook

**Performance Requirements**:
- Dashboard load time: <2 seconds for 150 staff
- Punch-to-dashboard delay: <5 seconds
- Leave approval notification: <30 seconds

### Success Metrics

- Staff attendance accuracy: 95%
- Leave approval time: <30 minutes (from submission to approval)
- Roster generation time: <2 minutes for 150 staff
- Paper-based leave forms eliminated: 100%
- Staff satisfaction with mobile app: >4.0/5.0

---

## Feature 2: Infrastructure & Asset Management

### Overview

Track all college assets (classrooms, labs, furniture, equipment), manage maintenance work orders, and coordinate preventive maintenance schedules.

### Business Requirements

**Priority**: P0 (Critical)  
**Complexity**: High  
**Users Impacted**: College Admin, Maintenance team (20 members), Faculty, Students  
**Business Value**: ₹1.2 Crore/year asset tracking efficiency, 40% reduction in repair costs

**Asset Inventory**:
- Classrooms: 45
- Labs: 18 (Computer, Chemistry, Physics, Mechanical, Electrical)
- Furniture: 2,500 items (desks, chairs, benches)
- Equipment: 1,200 devices (projectors, ACs, computers, lab instruments)

**Business Rules**:
- All assets tagged with unique QR code
- Preventive maintenance schedule: ACs (quarterly), Projectors (half-yearly), Lab equipment (monthly)
- Work order SLA: Critical (4 hours), High (24 hours), Normal (72 hours)
- Auto-escalation if work order overdue by 50%
- Vendor assignment based on contract (AMC vendors get priority)

### User Stories

**US-2.1**: Asset Registry with QR Code Tracking  
**As a** College Admin  
**I want to** scan QR codes to view asset details and history  
**So that** I can quickly audit assets during inspections

**Acceptance Criteria**:
- QR code generation for all 3,700+ assets
- QR code format: BITFLOW-SPCE-[CATEGORY]-[ID] (e.g., BITFLOW-SPCE-CHAIR-00234)
- Mobile app with QR scanner
- Asset details page: Purchase date, Warranty, Maintenance history, Location, Condition
- Location update via QR scan
- Bulk QR code printing (100 codes per sheet)
- Asset transfer workflow (from one department to another)

---

**US-2.2**: Work Order Management  
**As a** College Admin  
**I want to** create work orders for maintenance requests with priority and photo attachments  
**So that** maintenance team knows exact issue and urgency

**Acceptance Criteria**:
- Work order form: Title, Description, Priority (Critical/High/Normal), Category (Electrical/Plumbing/Civil/IT), Location, Photo (up to 5 images)
- Auto-assign to maintenance supervisor based on category
- Mobile notification to supervisor within 1 minute
- Supervisor assigns to technician from team
- Technician receives notification with work order details
- Technician marks status: Assigned → In Progress → Completed
- Completion requires photo proof
- SLA timer starts on creation, pauses if "Waiting for Parts"
- Auto-escalation email if overdue
- College Admin dashboard shows all overdue work orders

---

**US-2.3**: Preventive Maintenance Scheduling  
**As a** College Admin  
**I want to** schedule preventive maintenance for all ACs before summer  
**So that** I can avoid breakdown during peak season

**Acceptance Criteria**:
- Preventive maintenance calendar view
- Schedule creation: Asset category, Frequency (Monthly/Quarterly/Half-yearly/Yearly), Start date
- Auto-generate work orders 1 week before due date
- Checklist templates (AC: Clean filters, Check gas, Test thermostat)
- Technician completes checklist during maintenance
- Compliance report: % assets covered vs. scheduled
- Email alerts for upcoming preventive maintenance
- Budget estimation for next quarter based on schedule

---

### Technical Specifications

**API Endpoints**:
```
GET /api/v1/assets
POST /api/v1/assets/register
GET /api/v1/assets/{qr_code}/details
PUT /api/v1/assets/{id}/location
POST /api/v1/work-orders/create
GET /api/v1/work-orders/overdue
PUT /api/v1/work-orders/{id}/assign
PUT /api/v1/work-orders/{id}/status
POST /api/v1/preventive-maintenance/schedule
GET /api/v1/preventive-maintenance/compliance-report
```

**Database Tables**:
- `assets` (id, qr_code, category, name, purchase_date, warranty_expiry, location, condition, college_id)
- `work_orders` (id, title, description, priority, category, asset_id, status, created_by, assigned_to, sla_due_date, completed_at)
- `work_order_photos` (id, work_order_id, photo_url, type: before/after)
- `preventive_maintenance_schedules` (id, asset_category, frequency, start_date, last_run_date)
- `maintenance_checklists` (id, schedule_id, work_order_id, items, completed_items)

**QR Code Generation**:
- Library: `chillerlan/php-qrcode`
- Format: SVG (scalable), PNG (print)
- Data encoded: Asset ID + College ID

**Performance Requirements**:
- Asset search by QR scan: <1 second
- Work order creation: <3 seconds
- Dashboard load (500 active work orders): <2 seconds

### Success Metrics

- Asset tracking accuracy: 98%
- Work order SLA compliance: 85%
- Preventive maintenance completion: 85% (scheduled vs. completed)
- Average work order resolution time: <48 hours
- Maintenance cost reduction: 40% year-over-year

---

## Feature 3: Transport Management

### Overview

Manage college bus operations including routes, schedules, real-time GPS tracking, driver management, and student transport allocation.

### Business Requirements

**Priority**: P0 (Critical)  
**Complexity**: High  
**Users Impacted**: 1,200 students using transport, 15 drivers, Transport Coordinator, Parents  
**Business Value**: ₹80 Lakhs/year transport operations, 95% parent satisfaction

**Transport Statistics**:
- Buses: 15 (capacity: 40 students each)
- Routes: 25 (covering 50 km radius)
- Students using transport: 1,200 (31% of total students)
- Daily trips: 60 (30 morning + 30 evening)
- Monthly fuel cost: ₹4 Lakhs

**Business Rules**:
- Each student assigned to one route and one pickup/drop point
- Bus capacity: Max 40 students (safety regulation)
- Driver duty hours: Max 8 hours/day
- GPS tracking mandatory for all buses
- Parent notification: Bus arrived at pickup point, Student boarded, Bus reached college, Bus departed for drop
- Late bus alert if delay >15 minutes
- Monthly trip reports for fuel reconciliation

### User Stories

**US-3.1**: Real-Time Bus Tracking  
**As a** College Admin  
**I want to** see real-time location of all 15 buses on a map  
**So that** I can respond to parent queries about bus delays

**Acceptance Criteria**:
- Map view with bus icons (color-coded by route)
- Click on bus icon shows: Route number, Driver name, Current location, Speed, ETA to next stop
- Live refresh every 10 seconds
- Filter by route number
- Bus history playback (replay entire trip)
- Geofence alerts: Bus entered/exited college campus
- Speed alert: Bus speeding >60 km/h
- Stop detection: Bus stopped for >5 minutes (possible breakdown)

---

**US-3.2**: Student Transport Allocation  
**As a** Transport Coordinator  
**I want to** allocate students to buses based on their home address  
**So that** I can optimize routes and reduce travel time

**Acceptance Criteria**:
- Bulk import student transport requests (CSV upload: Student ID, Address, Landmark)
- Auto-suggest route based on address proximity
- Route capacity indicator (35/40 allocated)
- Drag-and-drop student reallocation
- Print bus-wise student list (with photos for driver verification)
- Generate bus passes with QR code
- Parent notification via SMS when allocation is confirmed
- Route map PDF export (with all pickup/drop points marked)

---

**US-3.3**: Trip Logs & Fuel Tracking  
**As a** College Admin  
**I want to** generate daily trip logs with distance and fuel consumption  
**So that** I can reconcile fuel expenses and detect anomalies

**Acceptance Criteria**:
- Auto-log trip start/end from GPS data
- Trip record: Date, Bus number, Driver, Start time, End time, Distance (km), Start odometer, End odometer
- Fuel log: Date, Bus number, Fuel quantity (liters), Cost, Fuel station, Receipt upload
- Fuel efficiency calculation: km/liter (target: 6 km/l)
- Alert if fuel efficiency drops below 5 km/l (possible fuel theft)
- Monthly fuel report: Total fuel cost, Average efficiency, Top 3 buses by efficiency
- Driver performance metrics: On-time trips, Fuel efficiency, Safety incidents

---

### Technical Specifications

**API Endpoints**:
```
GET /api/v1/transport/buses/live-tracking
GET /api/v1/transport/routes
POST /api/v1/transport/students/allocate
GET /api/v1/transport/students/allocation-report
POST /api/v1/transport/trips/log
GET /api/v1/transport/trips/daily-report
POST /api/v1/transport/fuel/log
GET /api/v1/transport/fuel/monthly-report
```

**Database Tables**:
- `buses` (id, bus_number, registration, capacity, gps_device_id, driver_id, status)
- `routes` (id, route_number, route_name, start_point, end_point, distance_km, pickup_points)
- `student_transport_allocation` (id, student_id, route_id, pickup_point, bus_id, bus_pass_number)
- `trip_logs` (id, bus_id, date, start_time, end_time, start_odometer, end_odometer, distance_km, driver_id)
- `fuel_logs` (id, bus_id, date, fuel_quantity_liters, cost, fuel_station, receipt_url)

**GPS Integration**:
- Device: Teltonika FMB920
- Protocol: MQTT
- Data: Latitude, Longitude, Speed, Timestamp, Device ID
- API: POST /api/v1/transport/gps-webhook (receives GPS pings every 10 seconds)

**Parent Notifications**:
- SMS via MSG91 API
- Notification triggers: Bus at pickup point, Student boarded (driver confirms), Bus reached college, Bus departed for drop

**Performance Requirements**:
- Map load time: <2 seconds
- GPS location update delay: <10 seconds
- Student allocation bulk import: 1,200 students in <1 minute

### Success Metrics

- On-time bus arrivals: 95% (±5 minutes tolerance)
- GPS tracking uptime: 99%
- Parent satisfaction with tracking: >4.5/5.0
- Fuel efficiency: 6 km/liter average
- Zero double-allocations

---

## Feature 4: Hostel Management

### Overview

Manage hostel operations including room allocation, bed inventory, mess menu, warden coordination, and visitor management for 350 students across 2 hostels.

### Business Requirements

**Priority**: P1 (High)  
**Complexity**: Medium  
**Users Impacted**: 350 hostel students, 4 wardens, Mess staff  
**Business Value**: ₹60 Lakhs/year hostel operations, 90% occupancy target

**Hostel Statistics**:
- Boys Hostel: 200 beds (100 rooms, 2 beds/room)
- Girls Hostel: 150 beds (75 rooms, 2 beds/room)
- Total capacity: 350 beds
- Current occupancy: 315 students (90%)
- Mess capacity: 400 students
- Wardens: 2 per hostel (4 total)

**Business Rules**:
- Gender-based segregation (strict)
- Room allocation priority: Final year > Third year > Second year > First year
- Roommate preference allowed (if both students agree)
- Mess menu: Veg/Non-veg options, Jain food available
- Visitor hours: 10 AM - 6 PM (weekdays), 10 AM - 8 PM (weekends)
- Parent visitors: No time restriction (24/7 access with prior intimation)
- Evening roll call: 8:30 PM daily (attendance mandatory)
- Night out request: Min 24 hours advance notice, parent approval required

### User Stories

**US-4.1**: Room Allocation with Preferences  
**As a** College Admin  
**I want to** allocate hostel rooms based on year, gender, and roommate preferences  
**So that** I can maximize occupancy and student satisfaction

**Acceptance Criteria**:
- Room allocation form: Student ID, Gender, Year, Roommate preference (optional)
- Validation: Gender match, Room capacity check, Duplicate allocation check
- Auto-suggest available rooms filtered by gender and year
- Room preview: Room number, Floor, Bed positions, Current occupants (if shared)
- Roommate confirmation workflow (both students must approve)
- Print room allocation list (building-wise, floor-wise)
- Generate hostel ID cards with QR code (room number encoded)
- Email + SMS notification to student with room details

---

**US-4.2**: Mess Menu Management  
**As a** Warden  
**I want to** publish weekly mess menu with veg/non-veg/Jain options  
**So that** students know meal schedule in advance

**Acceptance Criteria**:
- Weekly menu calendar view
- Meal slots: Breakfast (8 AM-9:30 AM), Lunch (1 PM-2:30 PM), Snacks (5 PM-6 PM), Dinner (8 PM-9:30 PM)
- Food categories: Veg, Non-veg, Jain
- Menu entry form: Day, Meal slot, Category, Items (comma-separated: Roti, Dal, Rice, Sabzi, Salad)
- Photo upload for reference
- Duplicate menu from previous week (quick setup)
- Publish to student mobile app
- Student feedback form: Rating (1-5), Comments
- Weekly feedback report: Average rating per meal slot, Top liked items, Top disliked items

---

**US-4.3**: Visitor Management  
**As a** Security Guard  
**I want to** log visitor entry with photo and ID proof  
**So that** I can maintain security and track visitor history

**Acceptance Criteria**:
- Visitor registration form: Visitor name, Relation to student, ID proof type (Aadhar/PAN/Driving License), ID number, Student to meet
- Photo capture via webcam/mobile
- Student notification: SMS sent when visitor arrives
- Visitor pass printout with QR code
- Check-out scan when visitor leaves
- Visitor history report: Student-wise, Date-wise
- Auto-alert if visitor overstays beyond hostel hours
- Parent visitor exemption (no time limit)

---

### Technical Specifications

**API Endpoints**:
```
GET /api/v1/hostel/rooms/available
POST /api/v1/hostel/rooms/allocate
GET /api/v1/hostel/allocation-report
POST /api/v1/hostel/mess/menu/publish
GET /api/v1/hostel/mess/menu/weekly
POST /api/v1/hostel/mess/feedback
POST /api/v1/hostel/visitors/register
PUT /api/v1/hostel/visitors/{id}/checkout
GET /api/v1/hostel/attendance/roll-call
```

**Database Tables**:
- `hostel_buildings` (id, name, gender, total_floors, total_rooms, total_beds)
- `hostel_rooms` (id, building_id, room_number, floor, capacity, occupied_beds)
- `hostel_allocations` (id, student_id, building_id, room_id, bed_number, allocation_date, checkout_date)
- `mess_menu` (id, date, meal_slot, category, items, photo_url)
- `mess_feedback` (id, student_id, date, meal_slot, rating, comments)
- `hostel_visitors` (id, visitor_name, relation, id_proof_type, id_proof_number, photo_url, student_id, check_in_time, check_out_time)

**Performance Requirements**:
- Room allocation search: <1 second
- Menu publish time: <2 seconds
- Visitor registration: <30 seconds

### Success Metrics

- Hostel occupancy: 95%
- Zero double-allocations
- Mess satisfaction rating: >4.0/5.0
- Visitor check-in time: <2 minutes
- Evening roll call completion: <10 minutes

---

## Feature 5: Document Services

### Overview

Generate official certificates (Bonafide, Transfer Certificate, NOC, Character Certificate) with digital signatures, student verification, and template management.

### Business Requirements

**Priority**: P0 (Critical)  
**Complexity**: Medium  
**Users Impacted**: 3,850 students, Clerical staff, College Admin  
**Business Value**: 500+ certificates/month, <1 hour turnaround time (vs. 3-5 days manual)

**Certificate Types**:
1. Bonafide Certificate (for bank loans, scholarships, visa applications) - 300/month
2. Transfer Certificate (when student leaves college) - 50/month
3. No Objection Certificate (for internships, competitions) - 100/month
4. Character Certificate - 30/month
5. Course Completion Certificate - 20/month

**Business Rules**:
- Student must be enrolled (active status) for bonafide/NOC
- Transfer certificate only after fee clearance (no dues)
- Digital signature mandatory for legal validity
- Sequential certificate numbering: BITFLOW/SPCE/BON/2025/00123
- Certificate valid for 6 months from issue date
- Duplicate certificate requires ₹100 fee
- College Admin approval required for all certificates
- Template supports Hindi + English languages

### User Stories

**US-5.1**: Bonafide Certificate Generation  
**As a** Student  
**I want to** request bonafide certificate with purpose (bank loan/scholarship/visa)  
**So that** I can get certificate within 1 hour

**Acceptance Criteria**:
- Online form: Purpose (dropdown: Bank Loan, Scholarship, Visa, Internship, Other), Language (English/Hindi), Delivery (Email/Print)
- Validation: Student enrollment status check, Fee dues check
- Auto-fill student data: Name, Roll number, Course, Year, DOB, Admission date
- Preview certificate before submission
- Clerical staff reviews request queue
- Approve/Reject with remarks
- On approval, auto-generate PDF from template
- College Admin applies digital signature (DSC)
- Email PDF to student immediately
- SMS notification with download link
- Print queue for hardcopy pickup

---

**US-5.2**: Template Management  
**As a** College Admin  
**I want to** update certificate templates with college letterhead and format  
**So that** all certificates have consistent branding

**Acceptance Criteria**:
- Template editor for each certificate type
- Template variables: {{student_name}}, {{roll_number}}, {{course}}, {{year}}, {{date}}, {{certificate_number}}
- Rich text editor with formatting options
- Letterhead upload (header image)
- College seal upload (footer image)
- Digital signature placeholder
- Preview mode with sample data
- Version control (track template changes)
- Hindi + English templates
- Export template as PDF for printing

---

**US-5.3**: Certificate Verification Portal  
**As a** External Verifier (bank officer, HR recruiter)  
**I want to** verify certificate authenticity using certificate number  
**So that** I can confirm it's genuine

**Acceptance Criteria**:
- Public verification page: /verify-certificate
- Input: Certificate number (BITFLOW/SPCE/BON/2025/00123)
- Output: Certificate valid/invalid, Issue date, Student name, Certificate type
- QR code on certificate links to verification page
- Verification log: Track who verified and when
- Download verified certificate PDF
- No authentication required for public access

---

### Technical Specifications

**API Endpoints**:
```
POST /api/v1/documents/certificates/request
GET /api/v1/documents/certificates/pending-approvals
PUT /api/v1/documents/certificates/{id}/approve
POST /api/v1/documents/certificates/{id}/sign
GET /api/v1/documents/certificates/{id}/download
POST /api/v1/documents/templates/update
GET /api/v1/documents/verify/{certificate_number}
```

**Database Tables**:
- `certificate_requests` (id, student_id, certificate_type, purpose, language, status, requested_at, approved_by, signed_at)
- `certificates` (id, certificate_number, certificate_type, student_id, issue_date, valid_until, pdf_url, signature_hash)
- `certificate_templates` (id, certificate_type, language, template_html, letterhead_url, seal_url, version)

**Digital Signature Integration**:
- Provider: eMudhra DSC (Digital Signature Certificate)
- API: REST API
- Signature format: PDF/A-3 (long-term archival)
- Hashing algorithm: SHA-256
- Certificate includes: Signer name, Organization, Timestamp

**PDF Generation**:
- Library: `barryvdh/laravel-dompdf`
- Fonts: DejaVu Sans (supports Hindi Unicode)
- Paper size: A4
- QR code: Embedded with verification URL

**Performance Requirements**:
- Certificate generation: <30 seconds
- Digital signature application: <10 seconds
- PDF download: <3 seconds
- Bulk certificate generation: 50 certificates in <5 minutes

### Success Metrics

- Certificate generation time: <1 hour (request to delivery)
- Digital signature success rate: 99%
- Student satisfaction: 95% (no delays)
- Verification requests: Track adoption
- Paper certificate requests reduced: 80%

---

## Feature 6: Vendor Management

### Overview

Manage vendor contracts, purchase orders, invoice tracking, and vendor performance ratings for 80+ active vendors providing services and supplies to the college.

### Business Requirements

**Priority**: P1 (High)  
**Complexity**: Medium  
**Users Impacted**: College Admin, Procurement team, Finance team, 80+ vendors  
**Business Value**: ₹8 Crores/year procurement, 30% efficiency gain

**Vendor Categories**:
- Maintenance (AMC for ACs, elevators, generators) - 15 vendors
- IT (hardware, software, networking) - 10 vendors
- Lab supplies (chemicals, equipment) - 12 vendors
- Stationery & office supplies - 8 vendors
- Housekeeping & cleaning - 5 vendors
- Catering (events) - 6 vendors
- Security services - 3 vendors
- Transport (bus maintenance, fuel) - 5 vendors
- Miscellaneous - 16 vendors

**Business Rules**:
- Vendor registration requires: Company name, GSTIN, PAN, Bank account, Contact person
- Annual contract renewal review
- Purchase order (PO) mandatory for all purchases >₹10,000
- PO approval: College Admin (<₹1 Lakh), Principal (₹1-5 Lakhs), Super Accountant (>₹5 Lakhs)
- Invoice payment terms: Net 30 days
- Vendor rating: 1-5 stars based on Quality, Timeliness, Communication
- Blacklist vendor if rating <2.0 for 3 consecutive orders

### User Stories

**US-6.1**: Vendor Registration & Onboarding  
**As a** College Admin  
**I want to** register new vendor with company details and documents  
**So that** I can create purchase orders

**Acceptance Criteria**:
- Vendor registration form: Company name, GSTIN, PAN, Address, Contact person (name, phone, email), Bank account details, Category
- Document uploads: GSTIN certificate, PAN card, Cancelled cheque, Company registration
- GSTIN validation via GST portal API (auto-fetch company name and address)
- Vendor ID auto-generated: VEN-2025-00123
- Email welcome email with vendor portal login credentials
- Vendor directory with search and filters
- Export vendor list to Excel

---

**US-6.2**: Purchase Order Creation  
**As a** College Admin  
**I want to** create purchase order with line items and approval workflow  
**So that** vendor knows approved items and quantities

**Acceptance Criteria**:
- PO creation form: Vendor (dropdown), PO date, Delivery date, Department, Items table (S.No, Description, Quantity, Unit price, Total)
- Auto-calculate PO total with GST (18%)
- Attach supporting documents (quotation, approval email)
- Approval workflow: Auto-route based on PO amount
- Email notification to approver
- Approver can Approve/Reject/Send back for revision
- On approval, PO PDF generated with sequential number: PO/SPCE/2025/00456
- Email PO PDF to vendor
- Track PO status: Draft → Pending Approval → Approved → Goods Received → Invoice Submitted → Payment Completed

---

**US-6.3**: Invoice Tracking & Payment Status  
**As a** Vendor  
**I want to** upload invoice and track payment status  
**So that** I know when to expect payment

**Acceptance Criteria**:
- Vendor portal login (separate interface)
- Upload invoice: PO number, Invoice number, Invoice date, Invoice amount, Invoice PDF
- Validation: PO number must exist, Invoice amount ≤ PO amount (10% tolerance)
- Invoice approval: College Admin verifies goods received
- Forward to Finance team for payment processing
- Payment status: Invoice Submitted → Verified → Sent to Finance → Payment Processed
- Vendor can view payment history
- Email notification when payment is processed
- Aging report: Invoices pending >30 days

---

### Technical Specifications

**API Endpoints**:
```
POST /api/v1/vendors/register
GET /api/v1/vendors
POST /api/v1/vendors/{id}/documents/upload
POST /api/v1/purchase-orders/create
PUT /api/v1/purchase-orders/{id}/approve
GET /api/v1/purchase-orders/{id}/pdf
POST /api/v1/invoices/upload
PUT /api/v1/invoices/{id}/verify
GET /api/v1/invoices/aging-report
POST /api/v1/vendors/{id}/rate
```

**Database Tables**:
- `vendors` (id, vendor_id, company_name, gstin, pan, category, contact_person, phone, email, bank_account, status, rating)
- `vendor_documents` (id, vendor_id, document_type, document_url)
- `purchase_orders` (id, po_number, vendor_id, po_date, delivery_date, total_amount, gst_amount, grand_total, status, created_by, approved_by)
- `purchase_order_items` (id, po_id, description, quantity, unit_price, total)
- `invoices` (id, po_id, vendor_id, invoice_number, invoice_date, invoice_amount, invoice_pdf_url, status, payment_date)

**GST Validation API**:
- Endpoint: https://gst.api.gov.in/taxpayersearch
- Method: POST
- Request: { "gstin": "27AABCU9603R1ZX" }
- Response: Company name, Address, Status (Active/Cancelled)

**Performance Requirements**:
- Vendor search: <1 second
- PO generation: <3 seconds
- Invoice upload: <5 seconds

### Success Metrics

- PO approval time: <2 hours
- Invoice payment time: 30 days (from submission)
- Vendor satisfaction: >4.0/5.0
- Purchase order accuracy: 98% (no errors)
- Digital invoices: 100% (no paper)

---

## Feature 7: Grievance Management

### Overview

Handle infrastructure and service complaints from students, faculty, and staff with SLA tracking, auto-escalation, and satisfaction surveys.

### Business Requirements

**Priority**: P0 (Critical)  
**Complexity**: Medium  
**Users Impacted**: 3,850 students, 245 faculty, 150 staff, College Admin, Support teams  
**Business Value**: 100+ complaints/month, 85% SLA compliance target

**Complaint Categories**:
- Infrastructure (45%): AC not working, Broken furniture, Leaking pipes, Power outage
- Transport (20%): Bus delays, Route issues, Driver complaints
- Hostel (15%): Room issues, Mess quality, Cleanliness
- Library (10%): Book unavailability, System issues
- Cafeteria (5%): Food quality, Hygiene
- Other (5%): Miscellaneous

**Business Rules**:
- SLA by priority: Critical (4 hours), High (24 hours), Normal (72 hours)
- Auto-escalation: If not resolved by SLA, escalate to College Admin
- After resolution, satisfaction survey sent to complainant
- Anonymous complaints allowed (but discouraged)
- Duplicate complaint detection (same issue from multiple users)
- Monthly grievance report to Principal

### User Stories

**US-7.1**: Complaint Submission with Photo  
**As a** Student  
**I want to** report broken furniture with photo and location  
**So that** it gets fixed quickly

**Acceptance Criteria**:
- Complaint form: Category (dropdown), Priority (Critical/High/Normal), Title, Description, Location (dropdown: Building, Floor, Room), Photo upload (up to 3 images)
- Anonymous option (checkbox)
- Submit button generates complaint ID: CMP-2025-00789
- Email + SMS confirmation with complaint ID
- Auto-assign to relevant team based on category
- Team receives notification
- Complainant can track status via complaint ID
- Status updates: Submitted → Assigned → In Progress → Resolved → Closed

---

**US-7.2**: SLA Tracking & Auto-Escalation  
**As a** College Admin  
**I want to** see all overdue complaints with SLA countdown  
**So that** I can escalate them

**Acceptance Criteria**:
- Dashboard with SLA timer for each complaint (e.g., "2 hours remaining")
- Color coding: Green (within SLA), Yellow (80% SLA consumed), Red (overdue)
- Filter: Category, Priority, Status, Assigned team
- Sort by: SLA remaining (ascending)
- Auto-escalation email sent to College Admin when complaint becomes overdue
- Escalation log: Track all escalations with timestamps
- Weekly SLA compliance report: % complaints resolved within SLA

---

**US-7.3**: Satisfaction Survey & Feedback  
**As a** College Admin  
**I want to** send satisfaction survey after complaint resolution  
**So that** I can measure service quality

**Acceptance Criteria**:
- Survey sent via email + SMS when complaint status = Resolved
- Survey questions: 
  1. How satisfied are you with the resolution? (1-5 stars)
  2. Was the issue resolved within expected time? (Yes/No)
  3. How would you rate the communication? (1-5 stars)
  4. Any additional comments? (text area)
- Survey response rate target: >60%
- Satisfaction dashboard: Average rating per category, Trend chart (monthly)
- Low rating alert (<3 stars) → Email to College Admin
- Monthly satisfaction report

---

### Technical Specifications

**API Endpoints**:
```
POST /api/v1/grievances/submit
GET /api/v1/grievances/{complaint_id}/status
GET /api/v1/grievances/overdue
PUT /api/v1/grievances/{id}/assign
PUT /api/v1/grievances/{id}/update-status
POST /api/v1/grievances/{id}/survey-response
GET /api/v1/grievances/satisfaction-report
```

**Database Tables**:
- `grievances` (id, complaint_id, category, priority, title, description, location, submitted_by, submitted_at, assigned_to, status, sla_due_at, resolved_at, closed_at)
- `grievance_photos` (id, grievance_id, photo_url)
- `grievance_escalations` (id, grievance_id, escalated_at, escalated_to, reason)
- `satisfaction_surveys` (id, grievance_id, rating, resolution_time_satisfied, communication_rating, comments, submitted_at)

**SLA Calculation**:
- Created_at + SLA hours = SLA_due_at
- Job runs every 15 minutes to check overdue complaints
- Auto-escalation email sent when SLA breached

**Performance Requirements**:
- Complaint submission: <3 seconds
- Dashboard load (500 active complaints): <2 seconds
- Photo upload: <5 seconds (max 3 MB per image)

### Success Metrics

- SLA compliance: 85%
- Average resolution time: <36 hours
- Satisfaction rating: >4.2/5.0
- Response rate to surveys: >60%
- Duplicate complaint rate: <5%

---

## Feature 8: Library Operations Support

### Overview

Support library staff with book cataloging, circulation management (issue/return), fine calculation, reservation system, and inventory audits.

### Business Requirements

**Priority**: P2 (Medium)  
**Complexity**: Medium  
**Users Impacted**: 3,850 students, 245 faculty, 5 library staff  
**Business Value**: 15,000+ books, 200+ daily transactions

**Library Statistics**:
- Total books: 15,000
- Daily book issues: 150
- Daily book returns: 140
- Average books per student: 3-5 borrowed at a time
- Fine collection: ₹50,000/year (late returns)
- New book purchases: 500 books/year

**Business Rules**:
- Students can borrow max 5 books at a time
- Faculty can borrow max 10 books at a time
- Loan period: Students (14 days), Faculty (30 days)
- Fine: ₹5/day for students, ₹10/day for faculty (max ₹500)
- Reservation: Max 2 books reserved at a time
- No new issues if outstanding fines >₹100

### User Stories

**US-8.1**: Book Cataloging with ISBN Scanner  
**As a** Librarian  
**I want to** catalog new books using ISBN barcode scanner  
**So that** I can process 50 books per day

**Acceptance Criteria**:
- ISBN scanner integration (USB barcode scanner)
- Scan ISBN → Auto-fetch book details from Google Books API (Title, Author, Publisher, Year, Pages, Cover image)
- Manual entry option if API fails
- Book details form: ISBN, Title, Author, Publisher, Year, Category, Subcategory, Language, Pages, Price, Vendor
- Generate accession number: LIB/2025/00123
- Print book label with accession number + QR code
- Bulk cataloging: Import 100+ books from Excel (ISBN list)
- Book details editable after cataloging

---

**US-8.2**: Circulation Management (Issue/Return)  
**As a** Librarian  
**I want to** issue and return books with barcode scanning  
**So that** transactions are fast and error-free

**Acceptance Criteria**:
- Issue flow: Scan student ID card → Scan book barcode → System checks: Book available?, Student loan limit (5 books)?, Outstanding fines? → Issue book → Receipt printed/emailed
- Return flow: Scan book barcode → System calculates fine (if late) → Collect fine (if applicable) → Mark book as returned → Receipt printed/emailed
- Due date reminder: Email sent 2 days before due date
- Overdue notice: Email sent if book not returned on due date
- Bulk issue: Issue multiple books to same student in one transaction
- Renewal: Student can renew book for additional 7 days (if no reservations)

---

**US-8.3**: Book Reservation System  
**As a** Student  
**I want to** reserve a book that's currently issued  
**So that** I get notified when it's available

**Acceptance Criteria**:
- Search book by Title/Author/ISBN
- Book status: Available (green), Issued (red), Reserved (yellow)
- Reserve button (only if book status = Issued)
- Reservation queue (FIFO - First In First Out)
- Notification when book is returned: Email + SMS sent within 15 minutes
- Reserved book held for 24 hours (if not collected, next in queue gets it)
- Student can view their reservations and cancel if needed

---

### Technical Specifications

**API Endpoints**:
```
POST /api/v1/library/books/catalog
GET /api/v1/library/books/search
POST /api/v1/library/circulation/issue
POST /api/v1/library/circulation/return
POST /api/v1/library/books/{id}/reserve
GET /api/v1/library/reservations/queue
POST /api/v1/library/fines/pay
GET /api/v1/library/reports/circulation
```

**Database Tables**:
- `library_books` (id, accession_number, isbn, title, author, publisher, year, category, language, price, status)
- `library_circulation` (id, book_id, borrower_id, borrower_type, issue_date, due_date, return_date, fine_amount, fine_paid)
- `library_reservations` (id, book_id, student_id, reserved_at, notified_at, collected_at, expired_at)
- `library_fines` (id, circulation_id, student_id, amount, paid_at, payment_mode)

**ISBN API Integration**:
- Provider: Google Books API
- Endpoint: https://www.googleapis.com/books/v1/volumes?q=isbn:{isbn}
- Response: Book details (title, authors, publisher, publishedDate, pageCount, imageLinks)

**Barcode Scanner**:
- Type: USB HID (Human Interface Device)
- Format: EAN-13 (for ISBN), Code 128 (for accession number)
- Software: No special driver needed (acts as keyboard input)

**Performance Requirements**:
- Book cataloging: <30 seconds per book
- Issue/Return transaction: <10 seconds
- Book search: <1 second

### Success Metrics

- Cataloging speed: 50 books/hour
- Circulation accuracy: 99%
- Fine collection rate: 90%
- Book reservation fulfillment: 85% (within 24 hours)
- Student satisfaction: >4.0/5.0

---

## 🎯 Implementation Priority Matrix

| Feature | Priority | Complexity | Users Impacted | Business Value | Implementation Order |
|---------|----------|------------|----------------|----------------|---------------------|
| Staff Management | P0 | High | 150 staff | High | 1 |
| Document Services | P0 | Medium | 3,850 students | Very High | 2 |
| Infrastructure & Asset Management | P0 | High | All users | High | 3 |
| Grievance Management | P0 | Medium | All users | High | 4 |
| Transport Management | P0 | High | 1,200 students | High | 5 |
| Hostel Management | P1 | Medium | 350 students | Medium | 6 |
| Vendor Management | P1 | Medium | 80 vendors | Medium | 7 |
| Library Operations | P2 | Medium | All users | Medium | 8 |

---

**Feature Specifications Complete** ✅  
**Total User Stories**: 24  
**Total API Endpoints**: 60+  
**Ready For**: API development, Frontend implementation, Testing
