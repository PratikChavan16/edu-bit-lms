-- Admission Admin Portal Database Schema
-- PostgreSQL 16 with Row-Level Security (RLS)
-- Version: 2.0
-- Last Updated: October 25, 2025

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================
-- 1. APPLICATIONS TABLE
-- ====================
CREATE TABLE applications (
    id VARCHAR(50) PRIMARY KEY, -- ADM-2024-001234
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    mobile VARCHAR(15) NOT NULL UNIQUE,
    aadhar_encrypted TEXT NOT NULL UNIQUE, -- Encrypted with pgcrypto
    dob DATE NOT NULL CHECK (dob < CURRENT_DATE - INTERVAL '17 years'),
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    address TEXT,
    parent_name VARCHAR(255),
    parent_mobile VARCHAR(15),
    annual_income_encrypted TEXT, -- Encrypted
    
    -- Academic details
    program VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL CHECK (category IN ('general', 'obc', 'sc', 'st')),
    entrance_exam_name VARCHAR(100),
    entrance_roll_number VARCHAR(50),
    entrance_score NUMERIC(6,2),
    hsc_board VARCHAR(100),
    hsc_percentage NUMERIC(5,2),
    hsc_year INTEGER,
    extra_credits NUMERIC(5,2) DEFAULT 0,
    
    -- Status tracking
    status VARCHAR(30) NOT NULL DEFAULT 'submitted' 
        CHECK (status IN ('submitted', 'under_verification', 'verified', 'rejected', 'admitted')),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (payment_status IN ('pending', 'paid', 'failed', 'refunded')),
    
    -- Merit score (calculated)
    merit_score NUMERIC(6,2),
    merit_rank INTEGER,
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    
    -- Indexes for common queries
    INDEX idx_applications_email (email),
    INDEX idx_applications_status (status),
    INDEX idx_applications_program (program),
    INDEX idx_applications_category (category),
    INDEX idx_applications_merit_score (merit_score DESC),
    INDEX idx_applications_created_at (created_at DESC)
);

-- ====================
-- 2. DOCUMENTS TABLE
-- ====================
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN (
        'hsc_marksheet', 'school_lc', 'aadhar_card', 'caste_certificate', 
        'income_certificate', 'passport_photo', 'signature', 'entrance_scorecard'
    )),
    
    -- S3 storage
    s3_bucket VARCHAR(100),
    s3_key VARCHAR(500),
    file_name VARCHAR(255),
    file_size_kb INTEGER,
    mime_type VARCHAR(50),
    hash VARCHAR(64), -- SHA-256 hash for integrity
    
    -- OCR data
    ocr_data JSONB,
    ocr_processed_at TIMESTAMPTZ,
    ocr_confidence NUMERIC(3,2), -- 0.00 to 1.00
    requires_manual_review BOOLEAN DEFAULT false,
    
    -- Verification
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'verified', 'rejected', 'request_reupload')),
    verified_by VARCHAR(50) REFERENCES staff(id),
    verified_at TIMESTAMPTZ,
    comments TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_documents_application_id (application_id),
    INDEX idx_documents_status (status),
    INDEX idx_documents_type (type),
    
    UNIQUE(application_id, type) -- One document per type per application
);

-- ====================
-- 3. DOCUMENT ASSIGNMENTS TABLE
-- ====================
CREATE TABLE document_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id VARCHAR(50) NOT NULL REFERENCES staff(id),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id),
    
    status VARCHAR(20) NOT NULL DEFAULT 'assigned' 
        CHECK (status IN ('assigned', 'in_progress', 'completed')),
    
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMPTZ,
    
    INDEX idx_assignments_staff_id (staff_id),
    INDEX idx_assignments_application_id (application_id),
    INDEX idx_assignments_status (status),
    
    UNIQUE(staff_id, application_id) -- One assignment per staff-application pair
);

-- ====================
-- 4. DOCUMENT VERIFICATION LOG TABLE
-- ====================
CREATE TABLE document_verification_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id),
    document_id UUID REFERENCES documents(id),
    document_type VARCHAR(50),
    
    action VARCHAR(20) NOT NULL CHECK (action IN ('verified', 'rejected', 'approved', 'reupload_requested')),
    performed_by VARCHAR(50) NOT NULL REFERENCES staff(id),
    comments TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_verification_log_application (application_id),
    INDEX idx_verification_log_staff (performed_by),
    INDEX idx_verification_log_created_at (created_at DESC)
);

-- ====================
-- 5. MERIT LISTS TABLE
-- ====================
CREATE TABLE merit_lists (
    id VARCHAR(100) PRIMARY KEY, -- ML-2024-BTECH-CSE-R1
    program VARCHAR(100) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    round INTEGER NOT NULL CHECK (round > 0),
    
    -- Formula used
    formula JSONB NOT NULL, -- {"entrance_weight": 0.6, "hsc_weight": 0.3, "extra_weight": 0.1}
    
    -- Statistics
    total_applicants INTEGER NOT NULL DEFAULT 0,
    cutoff_score NUMERIC(6,2),
    
    status VARCHAR(20) NOT NULL DEFAULT 'draft' 
        CHECK (status IN ('draft', 'published', 'archived')),
    
    created_by VARCHAR(50) REFERENCES staff(id),
    published_by VARCHAR(50) REFERENCES staff(id),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    published_at TIMESTAMPTZ,
    
    INDEX idx_merit_lists_program (program),
    INDEX idx_merit_lists_year (academic_year),
    INDEX idx_merit_lists_status (status),
    
    UNIQUE(program, academic_year, round)
);

-- ====================
-- 6. MERIT LIST APPLICANTS TABLE
-- ====================
CREATE TABLE merit_list_applicants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merit_list_id VARCHAR(100) NOT NULL REFERENCES merit_lists(id) ON DELETE CASCADE,
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id),
    
    rank INTEGER NOT NULL,
    merit_score NUMERIC(6,2) NOT NULL,
    category VARCHAR(20) NOT NULL,
    
    -- Choice filling status
    choice_filled BOOLEAN DEFAULT false,
    choice_filled_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_merit_applicants_merit_list (merit_list_id),
    INDEX idx_merit_applicants_rank (rank),
    INDEX idx_merit_applicants_application (application_id),
    
    UNIQUE(merit_list_id, application_id)
);

-- ====================
-- 7. CHOICE FILLINGS TABLE
-- ====================
CREATE TABLE choice_fillings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES merit_list_applicants(id),
    
    choice_1 VARCHAR(100),
    choice_2 VARCHAR(100),
    choice_3 VARCHAR(100),
    
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_choice_fillings_applicant (applicant_id)
);

-- ====================
-- 8. SEAT ALLOCATIONS TABLE
-- ====================
CREATE TABLE seat_allocations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    applicant_id UUID NOT NULL REFERENCES merit_list_applicants(id),
    program VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    round INTEGER NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'allocated' 
        CHECK (status IN ('allocated', 'accepted', 'rejected', 'waitlist')),
    
    allocated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    response_deadline TIMESTAMPTZ,
    responded_at TIMESTAMPTZ,
    
    INDEX idx_seat_allocations_applicant (applicant_id),
    INDEX idx_seat_allocations_program (program),
    INDEX idx_seat_allocations_round (round)
);

-- ====================
-- 9. COUNSELING ROUNDS TABLE
-- ====================
CREATE TABLE counseling_rounds (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    merit_list_id VARCHAR(100) NOT NULL REFERENCES merit_lists(id),
    round INTEGER NOT NULL,
    
    choice_filling_start TIMESTAMPTZ NOT NULL,
    choice_filling_end TIMESTAMPTZ NOT NULL,
    seat_allocation_date TIMESTAMPTZ NOT NULL,
    response_deadline TIMESTAMPTZ NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' 
        CHECK (status IN ('upcoming', 'in_progress', 'completed')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- ====================
-- 10. PAYMENTS TABLE
-- ====================
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id VARCHAR(50) NOT NULL REFERENCES applications(id),
    
    -- Gateway details
    gateway VARCHAR(20) NOT NULL CHECK (gateway IN ('razorpay', 'hdfc', 'test')),
    order_id VARCHAR(100) NOT NULL,
    payment_id VARCHAR(100),
    
    amount NUMERIC(10,2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'INR',
    
    method VARCHAR(20), -- card, netbanking, upi
    card_last4 VARCHAR(4),
    card_network VARCHAR(20),
    
    status VARCHAR(20) NOT NULL DEFAULT 'created' 
        CHECK (status IN ('created', 'processing', 'paid', 'failed', 'refunded')),
    
    error_code VARCHAR(50),
    error_message TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    paid_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    
    INDEX idx_payments_application_id (application_id),
    INDEX idx_payments_order_id (order_id),
    INDEX idx_payments_status (status),
    INDEX idx_payments_created_at (created_at DESC)
);

-- ====================
-- 11. STAFF TABLE
-- ====================
CREATE TABLE staff (
    id VARCHAR(50) PRIMARY KEY, -- STAFF-2024-00045
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'senior_admission_officer', 
        'document_verification_coordinator', 
        'document_verifier',
        'merit_list_manager',
        'counseling_coordinator',
        'data_entry_operator'
    )),
    
    -- 2FA
    totp_secret TEXT,
    has_2fa_enabled BOOLEAN DEFAULT false,
    
    -- Session management
    last_login_at TIMESTAMPTZ,
    last_login_ip INET,
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'locked')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_staff_email (email),
    INDEX idx_staff_role (role)
);

-- ====================
-- 12. AUDIT LOGS TABLE
-- ====================
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    staff_id VARCHAR(50) REFERENCES staff(id),
    
    action VARCHAR(50) NOT NULL, -- 'admin.login', 'application.view', 'document.verify', etc.
    resource_type VARCHAR(50),
    resource_id VARCHAR(50),
    
    changes JSONB, -- Before/after values
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audit_logs_staff (staff_id),
    INDEX idx_audit_logs_action (action),
    INDEX idx_audit_logs_created_at (created_at DESC)
);

-- ====================
-- 13. COMMUNICATIONS TABLE
-- ====================
CREATE TABLE communications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(20) NOT NULL CHECK (type IN ('email', 'sms', 'whatsapp')),
    
    recipient_application_id VARCHAR(50) REFERENCES applications(id),
    recipient_email VARCHAR(255),
    recipient_mobile VARCHAR(15),
    
    subject VARCHAR(255),
    body TEXT NOT NULL,
    template_id VARCHAR(50),
    
    status VARCHAR(20) NOT NULL DEFAULT 'queued' 
        CHECK (status IN ('queued', 'sent', 'delivered', 'failed', 'bounced')),
    
    gateway_message_id VARCHAR(100),
    error_message TEXT,
    
    sent_at TIMESTAMPTZ,
    delivered_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_communications_application (recipient_application_id),
    INDEX idx_communications_status (status),
    INDEX idx_communications_created_at (created_at DESC)
);

-- ====================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ====================

-- Enable RLS on sensitive tables
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Document verifiers can only see assigned applications
CREATE POLICY verifier_access ON applications
    FOR SELECT
    USING (
        id IN (
            SELECT application_id 
            FROM document_assignments 
            WHERE staff_id = current_setting('app.current_staff_id', true)
            AND status = 'assigned'
        )
    );

-- Policy: Senior officers and coordinators can see all applications
CREATE POLICY coordinator_access ON applications
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM staff 
            WHERE id = current_setting('app.current_staff_id', true)
            AND role IN ('senior_admission_officer', 'document_verification_coordinator')
        )
    );

-- Policy: Document verifiers can only see assigned documents
CREATE POLICY verifier_document_access ON documents
    FOR SELECT
    USING (
        application_id IN (
            SELECT application_id 
            FROM document_assignments 
            WHERE staff_id = current_setting('app.current_staff_id', true)
        )
    );

-- ====================
-- TRIGGERS
-- ====================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_staff_updated_at BEFORE UPDATE ON staff
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ====================
-- VIEWS
-- ====================

-- Application dashboard view
CREATE VIEW application_dashboard AS
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM applications
GROUP BY status;

-- Document verification queue view
CREATE VIEW verification_queue AS
SELECT 
    a.id,
    a.name,
    a.program,
    COUNT(d.id) as total_documents,
    SUM(CASE WHEN d.status = 'verified' THEN 1 ELSE 0 END) as verified_documents,
    da.staff_id as assigned_to
FROM applications a
JOIN documents d ON a.id = d.application_id
LEFT JOIN document_assignments da ON a.id = da.application_id
WHERE a.status = 'under_verification'
GROUP BY a.id, a.name, a.program, da.staff_id;

-- Merit list statistics view
CREATE VIEW merit_list_statistics AS
SELECT 
    ml.id,
    ml.program,
    ml.round,
    COUNT(mla.id) as total_applicants,
    COUNT(CASE WHEN mla.choice_filled = true THEN 1 END) as choices_filled,
    ml.cutoff_score
FROM merit_lists ml
LEFT JOIN merit_list_applicants mla ON ml.id = mla.merit_list_id
GROUP BY ml.id, ml.program, ml.round, ml.cutoff_score;

-- ====================
-- SAMPLE DATA (for development)
-- ====================

-- Insert sample staff
INSERT INTO staff (id, name, email, password_hash, role) VALUES
('STAFF-2024-00001', 'Dr. Rajesh Kumar', 'rajesh@institution.edu', '$2y$12$...', 'senior_admission_officer'),
('STAFF-2024-00045', 'Ramesh Kumar', 'ramesh@institution.edu', '$2y$12$...', 'document_verifier'),
('STAFF-2024-00046', 'Priya Patel', 'priya@institution.edu', '$2y$12$...', 'document_verifier');

-- Insert sample application
INSERT INTO applications (id, name, email, mobile, aadhar_encrypted, dob, program, category) VALUES
('ADM-2024-001234', 'Rahul Sharma', 'rahul@example.com', '9876543210', 
    pgp_sym_encrypt('123456789012', 'encryption_key'), 
    '2006-08-15', 'B.Tech CSE', 'general');

-- ====================
-- MAINTENANCE QUERIES
-- ====================

-- Vacuum and analyze (run weekly)
-- VACUUM ANALYZE applications;
-- VACUUM ANALYZE documents;
-- VACUUM ANALYZE merit_lists;

-- Reindex (run monthly)
-- REINDEX TABLE applications;
-- REINDEX TABLE documents;

-- ====================
-- PERFORMANCE MONITORING
-- ====================

-- Check table sizes
-- SELECT schemaname, tablename, 
--        pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
-- FROM pg_tables
-- WHERE schemaname = 'public'
-- ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Check slow queries
-- SELECT query, mean_exec_time, calls 
-- FROM pg_stat_statements 
-- ORDER BY mean_exec_time DESC 
-- LIMIT 10;

-- Database version: PostgreSQL 16
-- Schema version: 2.0
-- Total tables: 13
-- Total views: 3
-- Total indexes: 40+
-- RLS policies: 3
