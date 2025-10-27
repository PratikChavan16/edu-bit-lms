-- College Admin Portal - Database Schema
-- Portal: College Admin (#05)
-- Database: PostgreSQL 16
-- Version: 2.0
-- Last Updated: October 25, 2025

-- ============================================
-- EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For geolocation features

-- ============================================
-- STAFF MANAGEMENT
-- ============================================

CREATE TABLE staff (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    designation VARCHAR(100),
    employment_type VARCHAR(50) CHECK (employment_type IN ('permanent', 'contract', 'temporary')),
    joining_date DATE NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'suspended', 'resigned')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_staff_college ON staff(college_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_staff_department ON staff(department_id);
CREATE INDEX idx_staff_active ON staff(is_active, college_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_staff_employee_id ON staff(employee_id);

-- Staff Attendance
CREATE TABLE staff_attendance (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'on_leave', 'half_day')),
    marked_by BIGINT REFERENCES users(id),
    marked_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(staff_id, date)
);

CREATE INDEX idx_staff_attendance_date ON staff_attendance(date);
CREATE INDEX idx_staff_attendance_staff ON staff_attendance(staff_id, date DESC);
CREATE INDEX idx_staff_attendance_status ON staff_attendance(status, date);

-- Staff Leave Requests
CREATE TABLE staff_leave_requests (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL CHECK (leave_type IN ('sick', 'casual', 'earned', 'maternity', 'paternity', 'unpaid')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    approver_comments TEXT,
    rejection_reason TEXT,
    replacement_staff_id BIGINT REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_requests_staff ON staff_leave_requests(staff_id, status);
CREATE INDEX idx_leave_requests_dates ON staff_leave_requests(start_date, end_date);
CREATE INDEX idx_leave_requests_status ON staff_leave_requests(status, created_at DESC);

-- Duty Rosters
CREATE TABLE duty_rosters (
    id BIGSERIAL PRIMARY KEY,
    staff_id BIGINT NOT NULL REFERENCES staff(id) ON DELETE CASCADE,
    duty_type VARCHAR(100) NOT NULL,
    location VARCHAR(255),
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    date DATE NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    completion_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_duty_rosters_staff_date ON duty_rosters(staff_id, date);
CREATE INDEX idx_duty_rosters_date ON duty_rosters(date, is_completed);

-- ============================================
-- INFRASTRUCTURE & ASSETS
-- ============================================

CREATE TABLE asset_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id BIGINT REFERENCES asset_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE assets (
    id BIGSERIAL PRIMARY KEY,
    asset_code VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES asset_categories(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    serial_number VARCHAR(100) UNIQUE,
    purchase_date DATE NOT NULL,
    purchase_cost DECIMAL(12, 2) NOT NULL,
    location VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'operational' CHECK (status IN ('operational', 'under_maintenance', 'condemned', 'lost')),
    warranty_expiry DATE,
    qr_code VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_assets_college ON assets(college_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_assets_category ON assets(category_id);
CREATE INDEX idx_assets_status ON assets(status, college_id);
CREATE INDEX idx_assets_location ON assets(location);
CREATE INDEX idx_assets_code ON assets(asset_code);

-- Maintenance Records
CREATE TABLE maintenance_records (
    id BIGSERIAL PRIMARY KEY,
    asset_id BIGINT NOT NULL REFERENCES assets(id) ON DELETE CASCADE,
    maintenance_type VARCHAR(50) CHECK (maintenance_type IN ('preventive', 'corrective', 'breakdown')),
    description TEXT NOT NULL,
    cost DECIMAL(10, 2),
    performed_by VARCHAR(255),
    performed_date DATE NOT NULL,
    next_maintenance_date DATE,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_maintenance_asset ON maintenance_records(asset_id, performed_date DESC);
CREATE INDEX idx_maintenance_next_date ON maintenance_records(next_maintenance_date) WHERE next_maintenance_date IS NOT NULL;

-- Work Orders
CREATE TABLE work_orders (
    id BIGSERIAL PRIMARY KEY,
    work_order_number VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    asset_id BIGINT REFERENCES assets(id),
    location VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'waiting_for_parts', 'completed', 'cancelled')),
    created_by BIGINT REFERENCES users(id),
    assigned_to BIGINT REFERENCES staff(id),
    estimated_budget DECIMAL(10, 2),
    actual_cost DECIMAL(10, 2),
    photos JSONB,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_work_orders_college ON work_orders(college_id, status);
CREATE INDEX idx_work_orders_status ON work_orders(status, priority, created_at DESC);
CREATE INDEX idx_work_orders_assigned ON work_orders(assigned_to, status);
CREATE INDEX idx_work_orders_number ON work_orders(work_order_number);

-- Work Order Comments
CREATE TABLE work_order_comments (
    id BIGSERIAL PRIMARY KEY,
    work_order_id BIGINT NOT NULL REFERENCES work_orders(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wo_comments_work_order ON work_order_comments(work_order_id, created_at);

-- ============================================
-- TRANSPORT MANAGEMENT
-- ============================================

CREATE TABLE transport_routes (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    route_number VARCHAR(50) NOT NULL,
    route_name VARCHAR(255) NOT NULL,
    start_location VARCHAR(255) NOT NULL,
    end_location VARCHAR(255) NOT NULL,
    total_distance_km DECIMAL(6, 2),
    estimated_duration_mins INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, route_number)
);

CREATE INDEX idx_routes_college ON transport_routes(college_id, is_active);

-- Pickup Points
CREATE TABLE pickup_points (
    id BIGSERIAL PRIMARY KEY,
    route_id BIGINT NOT NULL REFERENCES transport_routes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    location_lat DECIMAL(10, 8),
    location_lng DECIMAL(11, 8),
    sequence_order INTEGER NOT NULL,
    estimated_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_pickup_points_route ON pickup_points(route_id, sequence_order);

-- Buses
CREATE TABLE buses (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    bus_number VARCHAR(50) NOT NULL,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    route_id BIGINT REFERENCES transport_routes(id),
    driver_id BIGINT REFERENCES staff(id),
    capacity INTEGER NOT NULL,
    current_location_lat DECIMAL(10, 8),
    current_location_lng DECIMAL(11, 8),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'on_route', 'stopped', 'delayed', 'breakdown', 'maintenance')),
    last_updated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, bus_number)
);

CREATE INDEX idx_buses_college ON buses(college_id, status);
CREATE INDEX idx_buses_route ON buses(route_id);
CREATE INDEX idx_buses_location ON buses(current_location_lat, current_location_lng) WHERE status = 'on_route';

-- Bus Student Allocation
CREATE TABLE bus_student (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    pickup_point_id BIGINT REFERENCES pickup_points(id),
    boarding_status VARCHAR(20) DEFAULT 'not_boarded' CHECK (boarding_status IN ('not_boarded', 'boarded', 'absent')),
    boarded_at TIMESTAMP,
    allocated_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(bus_id, student_id, allocated_date)
);

CREATE INDEX idx_bus_student_bus ON bus_student(bus_id, allocated_date);
CREATE INDEX idx_bus_student_student ON bus_student(student_id, is_active);

-- Bus Trips
CREATE TABLE bus_trips (
    id BIGSERIAL PRIMARY KEY,
    bus_id BIGINT NOT NULL REFERENCES buses(id) ON DELETE CASCADE,
    trip_date DATE NOT NULL,
    trip_type VARCHAR(20) CHECK (trip_type IN ('morning', 'evening')),
    start_time TIMESTAMP,
    end_time TIMESTAMP,
    total_students INTEGER,
    students_boarded INTEGER,
    status VARCHAR(20) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    delay_minutes INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_bus_trips_bus_date ON bus_trips(bus_id, trip_date DESC);
CREATE INDEX idx_bus_trips_status ON bus_trips(status, trip_date);

-- ============================================
-- HOSTEL MANAGEMENT
-- ============================================

CREATE TABLE hostel_blocks (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    block_name VARCHAR(100) NOT NULL,
    block_type VARCHAR(20) CHECK (block_type IN ('boys', 'girls')),
    total_floors INTEGER NOT NULL,
    warden_id BIGINT REFERENCES staff(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, block_name)
);

CREATE INDEX idx_hostel_blocks_college ON hostel_blocks(college_id, is_active);

CREATE TABLE hostel_rooms (
    id BIGSERIAL PRIMARY KEY,
    block_id BIGINT NOT NULL REFERENCES hostel_blocks(id) ON DELETE CASCADE,
    room_number VARCHAR(20) NOT NULL,
    floor_number INTEGER NOT NULL,
    room_type VARCHAR(50) CHECK (room_type IN ('single', 'double', 'triple', 'quad')),
    capacity INTEGER NOT NULL,
    current_occupancy INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'available' CHECK (status IN ('available', 'occupied', 'partially_occupied', 'under_maintenance', 'reserved')),
    has_ac BOOLEAN DEFAULT FALSE,
    has_attached_bathroom BOOLEAN DEFAULT FALSE,
    rent_amount DECIMAL(8, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(block_id, room_number),
    CHECK (current_occupancy <= capacity)
);

CREATE INDEX idx_hostel_rooms_block ON hostel_rooms(block_id, floor_number);
CREATE INDEX idx_hostel_rooms_status ON hostel_rooms(status);

CREATE TABLE hostel_allocations (
    id BIGSERIAL PRIMARY KEY,
    room_id BIGINT NOT NULL REFERENCES hostel_rooms(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'checked_out', 'terminated')),
    bed_number INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_hostel_allocations_room ON hostel_allocations(room_id, status);
CREATE INDEX idx_hostel_allocations_student ON hostel_allocations(student_id, academic_year);

-- Mess Menu
CREATE TABLE mess_menus (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 6),
    meal_type VARCHAR(20) CHECK (meal_type IN ('breakfast', 'lunch', 'snacks', 'dinner')),
    menu_items TEXT NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_mess_menu_college ON mess_menus(college_id, effective_from);

-- Visitor Management
CREATE TABLE hostel_visitors (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    visitor_name VARCHAR(255) NOT NULL,
    visitor_phone VARCHAR(20) NOT NULL,
    visitor_id_proof_type VARCHAR(50),
    visitor_id_proof_number VARCHAR(100),
    visit_date DATE NOT NULL,
    check_in_time TIMESTAMP NOT NULL,
    check_out_time TIMESTAMP,
    purpose VARCHAR(500),
    approved_by BIGINT REFERENCES staff(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_visitors_student ON hostel_visitors(student_id, visit_date DESC);
CREATE INDEX idx_visitors_date ON hostel_visitors(visit_date, check_in_time);

-- ============================================
-- DOCUMENT MANAGEMENT
-- ============================================

CREATE TABLE document_templates (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    template_name VARCHAR(100) NOT NULL,
    template_type VARCHAR(50) CHECK (template_type IN ('bonafide', 'transfer', 'character', 'noc', 'conduct', 'fee_receipt')),
    template_content TEXT NOT NULL,
    placeholders JSONB,
    requires_signature BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_document_templates_college ON document_templates(college_id, is_active);

CREATE TABLE generated_documents (
    id BIGSERIAL PRIMARY KEY,
    template_id BIGINT NOT NULL REFERENCES document_templates(id),
    student_id BIGINT REFERENCES students(id) ON DELETE SET NULL,
    document_number VARCHAR(100) UNIQUE NOT NULL,
    generated_by BIGINT REFERENCES users(id),
    generated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    purpose TEXT,
    file_path VARCHAR(500),
    verification_code VARCHAR(50) UNIQUE,
    is_verified BOOLEAN DEFAULT FALSE,
    digital_signature TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_generated_docs_student ON generated_documents(student_id, generated_at DESC);
CREATE INDEX idx_generated_docs_number ON generated_documents(document_number);
CREATE INDEX idx_generated_docs_verification ON generated_documents(verification_code);

-- ============================================
-- VENDOR MANAGEMENT
-- ============================================

CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    gst_number VARCHAR(20) UNIQUE,
    pan_number VARCHAR(20),
    category VARCHAR(100),
    rating DECIMAL(3, 2) CHECK (rating BETWEEN 1 AND 5),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_vendors_college ON vendors(college_id, is_active);
CREATE INDEX idx_vendors_code ON vendors(vendor_code);

CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    po_number VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    category VARCHAR(100) NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL,
    gst_amount DECIMAL(12, 2),
    grand_total DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'rejected', 'completed', 'cancelled')),
    delivery_date DATE,
    notes TEXT,
    created_by BIGINT REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_college ON purchase_orders(college_id, status);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id, created_at DESC);
CREATE INDEX idx_po_number ON purchase_orders(po_number);

CREATE TABLE purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_items_po ON purchase_order_items(purchase_order_id);

-- Invoices
CREATE TABLE vendor_invoices (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT REFERENCES purchase_orders(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    paid_amount DECIMAL(12, 2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'partially_paid', 'paid', 'overdue')),
    payment_date DATE,
    file_path VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_invoices_po ON vendor_invoices(purchase_order_id);
CREATE INDEX idx_invoices_vendor ON vendor_invoices(vendor_id, status);
CREATE INDEX idx_invoices_due ON vendor_invoices(due_date, status);

-- ============================================
-- GRIEVANCE MANAGEMENT
-- ============================================

CREATE TABLE grievance_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sla_hours INTEGER NOT NULL, -- Service Level Agreement in hours
    parent_category_id BIGINT REFERENCES grievance_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE grievances (
    id BIGSERIAL PRIMARY KEY,
    grievance_number VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    category_id BIGINT REFERENCES grievance_categories(id),
    subject VARCHAR(500) NOT NULL,
    description TEXT NOT NULL,
    submitted_by BIGINT REFERENCES users(id),
    submitter_type VARCHAR(20) CHECK (submitter_type IN ('student', 'staff', 'parent', 'anonymous')),
    priority VARCHAR(20) DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'assigned', 'in_progress', 'resolved', 'closed', 'escalated')),
    assigned_to BIGINT REFERENCES users(id),
    location VARCHAR(255),
    sla_deadline TIMESTAMP,
    resolved_at TIMESTAMP,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grievances_college ON grievances(college_id, status);
CREATE INDEX idx_grievances_status ON grievances(status, priority, created_at DESC);
CREATE INDEX idx_grievances_assigned ON grievances(assigned_to, status);
CREATE INDEX idx_grievances_number ON grievances(grievance_number);
CREATE INDEX idx_grievances_sla ON grievances(sla_deadline) WHERE status NOT IN ('resolved', 'closed');

-- ============================================
-- LIBRARY MANAGEMENT
-- ============================================

CREATE TABLE book_categories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    parent_category_id BIGINT REFERENCES book_categories(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE books (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    isbn VARCHAR(20) UNIQUE,
    title VARCHAR(500) NOT NULL,
    author VARCHAR(255),
    publisher VARCHAR(255),
    edition VARCHAR(50),
    publication_year INTEGER,
    category_id BIGINT REFERENCES book_categories(id),
    total_copies INTEGER NOT NULL DEFAULT 1,
    available_copies INTEGER NOT NULL DEFAULT 1,
    location VARCHAR(100),
    language VARCHAR(50) DEFAULT 'English',
    cover_image VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (available_copies <= total_copies)
);

CREATE INDEX idx_books_college ON books(college_id);
CREATE INDEX idx_books_isbn ON books(isbn);
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_search ON books USING gin(to_tsvector('english', title || ' ' || author));

CREATE TABLE book_circulation (
    id BIGSERIAL PRIMARY KEY,
    book_id BIGINT NOT NULL REFERENCES books(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    issue_date DATE NOT NULL,
    due_date DATE NOT NULL,
    return_date DATE,
    status VARCHAR(20) DEFAULT 'issued' CHECK (status IN ('issued', 'returned', 'overdue', 'lost')),
    fine_amount DECIMAL(8, 2) DEFAULT 0,
    fine_paid BOOLEAN DEFAULT FALSE,
    issued_by BIGINT REFERENCES users(id),
    returned_to BIGINT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_circulation_book ON book_circulation(book_id, status);
CREATE INDEX idx_circulation_student ON book_circulation(student_id, status);
CREATE INDEX idx_circulation_due ON book_circulation(due_date, status) WHERE status = 'issued';

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assets_updated_at BEFORE UPDATE ON assets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_work_orders_updated_at BEFORE UPDATE ON work_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_buses_updated_at BEFORE UPDATE ON buses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_hostel_rooms_updated_at BEFORE UPDATE ON hostel_rooms
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Auto-update room occupancy
CREATE OR REPLACE FUNCTION update_room_occupancy()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'active' THEN
        UPDATE hostel_rooms
        SET current_occupancy = current_occupancy + 1,
            status = CASE
                WHEN current_occupancy + 1 = capacity THEN 'occupied'
                WHEN current_occupancy + 1 > 0 THEN 'partially_occupied'
                ELSE 'available'
            END
        WHERE id = NEW.room_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'active' AND NEW.status != 'active' THEN
        UPDATE hostel_rooms
        SET current_occupancy = GREATEST(current_occupancy - 1, 0),
            status = CASE
                WHEN current_occupancy - 1 = 0 THEN 'available'
                WHEN current_occupancy - 1 < capacity THEN 'partially_occupied'
                ELSE 'occupied'
            END
        WHERE id = OLD.room_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_room_occupancy
AFTER INSERT OR UPDATE ON hostel_allocations
FOR EACH ROW EXECUTE FUNCTION update_room_occupancy();

-- Auto-update book availability
CREATE OR REPLACE FUNCTION update_book_availability()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' AND NEW.status = 'issued' THEN
        UPDATE books
        SET available_copies = available_copies - 1
        WHERE id = NEW.book_id;
    ELSIF TG_OP = 'UPDATE' AND OLD.status = 'issued' AND NEW.status = 'returned' THEN
        UPDATE books
        SET available_copies = available_copies + 1
        WHERE id = NEW.book_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_book_availability
AFTER INSERT OR UPDATE ON book_circulation
FOR EACH ROW EXECUTE FUNCTION update_book_availability();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Insert sample staff
INSERT INTO staff (employee_id, college_id, name, email, phone, designation, employment_type, joining_date) VALUES
('EMP001', 1, 'Raj Kumar', 'raj.kumar@spce.edu.in', '9876543210', 'Library Assistant', 'permanent', '2020-06-15'),
('EMP002', 1, 'Priya Sharma', 'priya.sharma@spce.edu.in', '9876543211', 'Transport Coordinator', 'permanent', '2021-03-10');

-- Insert sample asset categories
INSERT INTO asset_categories (name, description) VALUES
('IT Equipment', 'Computers, Laptops, Printers'),
('Furniture', 'Tables, Chairs, Cupboards'),
('Lab Equipment', 'Scientific instruments and apparatus');

-- Insert sample document template
INSERT INTO document_templates (college_id, template_name, template_type, template_content, requires_signature) VALUES
(1, 'Bonafide Certificate', 'bonafide', 'This is to certify that {{student_name}}, Roll No. {{roll_number}}, is a bonafide student...', TRUE);

-- Insert sample grievance categories with SLA
INSERT INTO grievance_categories (name, description, sla_hours) VALUES
('Infrastructure', 'Building and facility issues', 24),
('WiFi/Network', 'Internet connectivity problems', 8),
('Hostel', 'Hostel-related complaints', 12),
('Transport', 'Bus and transport issues', 4),
('Library', 'Library services', 24);

-- ============================================
-- VIEWS FOR REPORTING
-- ============================================

CREATE VIEW staff_attendance_summary AS
SELECT
    s.id AS staff_id,
    s.name AS staff_name,
    s.department_id,
    COUNT(sa.id) AS total_days,
    COUNT(CASE WHEN sa.status = 'present' THEN 1 END) AS present_days,
    COUNT(CASE WHEN sa.status = 'absent' THEN 1 END) AS absent_days,
    COUNT(CASE WHEN sa.status = 'on_leave' THEN 1 END) AS leave_days,
    ROUND((COUNT(CASE WHEN sa.status = 'present' THEN 1 END)::DECIMAL / NULLIF(COUNT(sa.id), 0)) * 100, 2) AS attendance_percentage
FROM staff s
LEFT JOIN staff_attendance sa ON s.id = sa.staff_id
WHERE s.deleted_at IS NULL
GROUP BY s.id, s.name, s.department_id;

CREATE VIEW work_order_analytics AS
SELECT
    wo.college_id,
    wo.status,
    wo.priority,
    COUNT(*) AS total_orders,
    AVG(EXTRACT(EPOCH FROM (wo.completed_at - wo.created_at)) / 3600) AS avg_completion_hours,
    SUM(wo.actual_cost) AS total_cost
FROM work_orders wo
WHERE wo.completed_at IS NOT NULL
GROUP BY wo.college_id, wo.status, wo.priority;

CREATE VIEW hostel_occupancy_report AS
SELECT
    hb.id AS block_id,
    hb.block_name,
    hb.block_type,
    COUNT(hr.id) AS total_rooms,
    SUM(hr.capacity) AS total_capacity,
    SUM(hr.current_occupancy) AS current_occupancy,
    ROUND((SUM(hr.current_occupancy)::DECIMAL / NULLIF(SUM(hr.capacity), 0)) * 100, 2) AS occupancy_percentage
FROM hostel_blocks hb
LEFT JOIN hostel_rooms hr ON hb.id = hr.block_id
WHERE hb.is_active = TRUE
GROUP BY hb.id, hb.block_name, hb.block_type;

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE staff IS 'Non-teaching staff members across all colleges';
COMMENT ON TABLE work_orders IS 'Infrastructure maintenance and repair requests';
COMMENT ON TABLE buses IS 'College transport buses with real-time location tracking';
COMMENT ON TABLE hostel_rooms IS 'Hostel room inventory and allocation';
COMMENT ON TABLE grievances IS 'Student and staff complaint management with SLA tracking';
COMMENT ON TABLE books IS 'Library book catalog';
