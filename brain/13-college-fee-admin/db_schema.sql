-- ============================================
-- College Fee Admin Portal - Database Schema
-- ============================================
-- Database: PostgreSQL 16
-- Purpose: Fee management, payments, receipts, refunds (₹60 Cr/year)
-- Author: BitFlow Backend Team
-- Version: 1.0.0
-- ============================================

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLE: fee_components
-- Purpose: Master list of fee components (tuition, library, sports, etc.)
-- ============================================
CREATE TABLE fee_components (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    base_amount DECIMAL(12, 2) NOT NULL CHECK (base_amount >= 0),
    gst_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (gst_percentage >= 0 AND gst_percentage <= 100),
    category VARCHAR(50) NOT NULL, -- tuition, library, sports, development, lab, hostel
    is_mandatory BOOLEAN DEFAULT true,
    is_refundable BOOLEAN DEFAULT false,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL,
    
    CONSTRAINT fk_fee_components_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE INDEX idx_fee_components_college ON fee_components(college_id);
CREATE INDEX idx_fee_components_category ON fee_components(category);
CREATE INDEX idx_fee_components_deleted ON fee_components(deleted_at) WHERE deleted_at IS NULL;

-- ============================================
-- TABLE: fee_structures
-- Purpose: Program-wise fee structures per academic year
-- ============================================
CREATE TABLE fee_structures (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    program_id BIGINT NOT NULL,
    academic_year VARCHAR(10) NOT NULL, -- 2024-25
    year_of_study INT NOT NULL CHECK (year_of_study BETWEEN 1 AND 5),
    total_fee DECIMAL(12, 2) NOT NULL CHECK (total_fee >= 0),
    is_active BOOLEAN DEFAULT true,
    effective_from DATE NOT NULL,
    effective_to DATE NULL,
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_fee_structures_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_fee_structures_program FOREIGN KEY (program_id) REFERENCES programs(id) ON DELETE CASCADE,
    CONSTRAINT fk_fee_structures_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
    
    UNIQUE (college_id, program_id, academic_year, year_of_study)
);

CREATE INDEX idx_fee_structures_college ON fee_structures(college_id);
CREATE INDEX idx_fee_structures_program ON fee_structures(program_id);
CREATE INDEX idx_fee_structures_year ON fee_structures(academic_year);
CREATE INDEX idx_fee_structures_active ON fee_structures(is_active) WHERE is_active = true;

-- ============================================
-- TABLE: fee_structure_components
-- Purpose: Junction table linking fee structures to components
-- ============================================
CREATE TABLE fee_structure_components (
    id BIGSERIAL PRIMARY KEY,
    fee_structure_id BIGINT NOT NULL,
    fee_component_id BIGINT NOT NULL,
    customized_amount DECIMAL(12, 2) NOT NULL, -- Can differ from base_amount
    waiver_percentage DECIMAL(5, 2) DEFAULT 0 CHECK (waiver_percentage >= 0 AND waiver_percentage <= 100),
    final_amount DECIMAL(12, 2) GENERATED ALWAYS AS (customized_amount * (1 - waiver_percentage / 100)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_fee_structure_components_structure FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
    CONSTRAINT fk_fee_structure_components_component FOREIGN KEY (fee_component_id) REFERENCES fee_components(id) ON DELETE CASCADE,
    
    UNIQUE (fee_structure_id, fee_component_id)
);

CREATE INDEX idx_fee_structure_components_structure ON fee_structure_components(fee_structure_id);
CREATE INDEX idx_fee_structure_components_component ON fee_structure_components(fee_component_id);

-- ============================================
-- TABLE: payments
-- Purpose: All payment transactions (₹60 Cr/year, 15,000+ transactions)
-- ============================================
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    payment_mode VARCHAR(50) NOT NULL, -- online, cash, cheque, dd, neft, upi
    payment_type VARCHAR(50) NOT NULL, -- full_fee, installment, partial
    installment_number INT NULL CHECK (installment_number > 0),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    gateway_charges DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(12, 2) NOT NULL,
    
    -- Razorpay fields
    razorpay_order_id VARCHAR(255) NULL,
    razorpay_payment_id VARCHAR(255) NULL,
    razorpay_signature TEXT NULL,
    
    -- Transaction details
    transaction_id VARCHAR(255) NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, success, failed, refunded
    payment_date TIMESTAMP NULL,
    
    -- Cash/Cheque specific
    received_by BIGINT NULL, -- User who collected payment
    cheque_number VARCHAR(100) NULL,
    cheque_date DATE NULL,
    bank_name VARCHAR(255) NULL,
    bank_branch VARCHAR(255) NULL,
    cheque_photo_url TEXT NULL,
    cheque_status VARCHAR(50) NULL, -- deposited, realized, bounced
    cash_denominations JSONB NULL, -- {"2000": 10, "500": 20, "100": 10}
    
    remarks TEXT NULL,
    metadata JSONB NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_payments_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_payments_receiver FOREIGN KEY (received_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_payments_college ON payments(college_id);
CREATE INDEX idx_payments_student ON payments(student_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_mode ON payments(payment_mode);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_payments_razorpay_order ON payments(razorpay_order_id);
CREATE INDEX idx_payments_transaction ON payments(transaction_id);

-- ============================================
-- TABLE: receipts
-- Purpose: Official fee receipts (30,000+ receipts/year)
-- ============================================
CREATE TABLE receipts (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    payment_id BIGINT NOT NULL,
    receipt_number VARCHAR(50) NOT NULL UNIQUE, -- RCP-2024-001234
    student_id BIGINT NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    payment_mode VARCHAR(50) NOT NULL,
    
    -- Receipt metadata
    issued_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    issued_by BIGINT NOT NULL,
    pdf_url TEXT NULL,
    qr_code_url TEXT NULL,
    digital_signature TEXT NULL,
    
    -- Duplicate handling
    is_duplicate BOOLEAN DEFAULT false,
    original_receipt_id BIGINT NULL,
    duplicate_reason TEXT NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_receipts_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_receipts_payment FOREIGN KEY (payment_id) REFERENCES payments(id) ON DELETE CASCADE,
    CONSTRAINT fk_receipts_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_receipts_issuer FOREIGN KEY (issued_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_receipts_original FOREIGN KEY (original_receipt_id) REFERENCES receipts(id) ON DELETE SET NULL
);

CREATE INDEX idx_receipts_college ON receipts(college_id);
CREATE INDEX idx_receipts_payment ON receipts(payment_id);
CREATE INDEX idx_receipts_student ON receipts(student_id);
CREATE INDEX idx_receipts_number ON receipts(receipt_number);
CREATE INDEX idx_receipts_issued_date ON receipts(issued_date);

-- ============================================
-- TABLE: installment_plans
-- Purpose: Predefined installment plans (Standard 3-installment, etc.)
-- ============================================
CREATE TABLE installment_plans (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    name VARCHAR(255) NOT NULL, -- Standard 3-Installment Plan
    description TEXT,
    academic_year VARCHAR(10) NOT NULL,
    number_of_installments INT NOT NULL CHECK (number_of_installments BETWEEN 1 AND 10),
    is_active BOOLEAN DEFAULT true,
    
    -- Late fee policy
    late_fee_7_days DECIMAL(10, 2) DEFAULT 500,
    late_fee_15_days DECIMAL(10, 2) DEFAULT 1000,
    late_fee_30_days DECIMAL(10, 2) DEFAULT 2000,
    
    created_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_installment_plans_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_installment_plans_creator FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_installment_plans_college ON installment_plans(college_id);
CREATE INDEX idx_installment_plans_year ON installment_plans(academic_year);
CREATE INDEX idx_installment_plans_active ON installment_plans(is_active) WHERE is_active = true;

-- ============================================
-- TABLE: installment_plan_details
-- Purpose: Individual installments within a plan
-- ============================================
CREATE TABLE installment_plan_details (
    id BIGSERIAL PRIMARY KEY,
    installment_plan_id BIGINT NOT NULL,
    sequence INT NOT NULL CHECK (sequence > 0),
    percentage DECIMAL(5, 2) NOT NULL CHECK (percentage > 0 AND percentage <= 100),
    due_day INT NOT NULL, -- Day of the month
    due_month INT NOT NULL CHECK (due_month BETWEEN 1 AND 12),
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_installment_plan_details_plan FOREIGN KEY (installment_plan_id) REFERENCES installment_plans(id) ON DELETE CASCADE,
    UNIQUE (installment_plan_id, sequence)
);

CREATE INDEX idx_installment_plan_details_plan ON installment_plan_details(installment_plan_id);

-- ============================================
-- TABLE: student_installments
-- Purpose: Student-specific installment schedules
-- ============================================
CREATE TABLE student_installments (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    installment_plan_id BIGINT NOT NULL,
    sequence INT NOT NULL,
    due_date DATE NOT NULL,
    amount DECIMAL(12, 2) NOT NULL CHECK (amount >= 0),
    paid_amount DECIMAL(12, 2) DEFAULT 0 CHECK (paid_amount >= 0),
    late_fee DECIMAL(10, 2) DEFAULT 0 CHECK (late_fee >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, partial, paid, overdue
    payment_ids JSONB DEFAULT '[]', -- Array of payment IDs
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_student_installments_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_installments_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_student_installments_plan FOREIGN KEY (installment_plan_id) REFERENCES installment_plans(id) ON DELETE RESTRICT,
    
    UNIQUE (student_id, installment_plan_id, sequence)
);

CREATE INDEX idx_student_installments_college ON student_installments(college_id);
CREATE INDEX idx_student_installments_student ON student_installments(student_id);
CREATE INDEX idx_student_installments_due_date ON student_installments(due_date);
CREATE INDEX idx_student_installments_status ON student_installments(status);

-- ============================================
-- TABLE: defaulters
-- Purpose: Track students with overdue payments (145 defaulters avg)
-- ============================================
CREATE TABLE defaulters (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    pending_amount DECIMAL(12, 2) NOT NULL CHECK (pending_amount > 0),
    days_overdue INT NOT NULL CHECK (days_overdue >= 0),
    last_payment_date DATE NULL,
    
    -- Aging bucket
    aging_bucket VARCHAR(20) NOT NULL, -- 0-30, 31-60, 61-90, >90
    
    -- Actions taken
    reminders_sent INT DEFAULT 0,
    last_reminder_sent_at TIMESTAMP NULL,
    hall_ticket_blocked BOOLEAN DEFAULT false,
    blocked_at TIMESTAMP NULL,
    
    -- Resolution
    is_resolved BOOLEAN DEFAULT false,
    resolved_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_defaulters_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_defaulters_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    
    UNIQUE (student_id) WHERE is_resolved = false
);

CREATE INDEX idx_defaulters_college ON defaulters(college_id);
CREATE INDEX idx_defaulters_student ON defaulters(student_id);
CREATE INDEX idx_defaulters_aging ON defaulters(aging_bucket);
CREATE INDEX idx_defaulters_resolved ON defaulters(is_resolved) WHERE is_resolved = false;

-- ============================================
-- TABLE: refunds
-- Purpose: Refund requests and processing (500+ refunds/year)
-- ============================================
CREATE TABLE refunds (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    refund_type VARCHAR(50) NOT NULL, -- dropout, overpayment, scholarship, correction
    reason TEXT NOT NULL,
    
    -- Amount calculation
    expected_amount DECIMAL(12, 2) NOT NULL,
    calculated_amount DECIMAL(12, 2) NULL,
    processing_charges DECIMAL(10, 2) DEFAULT 0,
    net_refund_amount DECIMAL(12, 2) NULL,
    
    -- Status workflow
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, disbursed
    
    -- Bank details
    bank_account_number VARCHAR(50) NULL,
    ifsc_code VARCHAR(20) NULL,
    account_holder_name VARCHAR(255) NULL,
    utr_number VARCHAR(50) NULL, -- NEFT reference
    
    -- Approval workflow
    requested_by BIGINT NOT NULL,
    requested_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    approved_by BIGINT NULL,
    approved_at TIMESTAMP NULL,
    disbursed_at TIMESTAMP NULL,
    
    remarks TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_refunds_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_refunds_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_refunds_requester FOREIGN KEY (requested_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_refunds_approver FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_refunds_college ON refunds(college_id);
CREATE INDEX idx_refunds_student ON refunds(student_id);
CREATE INDEX idx_refunds_status ON refunds(status);
CREATE INDEX idx_refunds_type ON refunds(refund_type);

-- ============================================
-- TABLE: scholarships
-- Purpose: Scholarship management (₹1.2 Cr/year)
-- ============================================
CREATE TABLE scholarships (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    scholarship_type VARCHAR(50) NOT NULL, -- merit, financial, sports, government
    academic_year VARCHAR(10) NOT NULL,
    
    -- Amount
    applied_amount DECIMAL(12, 2) NULL,
    approved_amount DECIMAL(12, 2) NULL,
    
    -- Status
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, approved, rejected, disbursed
    
    -- Documents
    documents JSONB NULL, -- Array of S3 URLs
    
    -- Approval workflow
    applied_by BIGINT NOT NULL,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_by BIGINT NULL,
    reviewed_at TIMESTAMP NULL,
    remarks TEXT NULL,
    
    -- Fee adjustment
    fee_adjusted BOOLEAN DEFAULT false,
    adjusted_at TIMESTAMP NULL,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_scholarships_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_scholarships_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_scholarships_applicant FOREIGN KEY (applied_by) REFERENCES users(id) ON DELETE RESTRICT,
    CONSTRAINT fk_scholarships_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_scholarships_college ON scholarships(college_id);
CREATE INDEX idx_scholarships_student ON scholarships(student_id);
CREATE INDEX idx_scholarships_status ON scholarships(status);
CREATE INDEX idx_scholarships_type ON scholarships(scholarship_type);
CREATE INDEX idx_scholarships_year ON scholarships(academic_year);

-- ============================================
-- TABLE: payment_reminders
-- Purpose: Log of all payment reminders sent
-- ============================================
CREATE TABLE payment_reminders (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    installment_id BIGINT NULL,
    reminder_type VARCHAR(50) NOT NULL, -- 7_days_before, due_date, 3_days_after, 7_days_after
    channel VARCHAR(20) NOT NULL, -- sms, email, whatsapp
    message TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL, -- sent, delivered, failed
    
    CONSTRAINT fk_payment_reminders_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_reminders_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_payment_reminders_installment FOREIGN KEY (installment_id) REFERENCES student_installments(id) ON DELETE SET NULL
);

CREATE INDEX idx_payment_reminders_college ON payment_reminders(college_id);
CREATE INDEX idx_payment_reminders_student ON payment_reminders(student_id);
CREATE INDEX idx_payment_reminders_sent ON payment_reminders(sent_at);

-- ============================================
-- TABLE: daily_collections
-- Purpose: Daily collection summary for quick reporting
-- ============================================
CREATE TABLE daily_collections (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    collection_date DATE NOT NULL,
    total_amount DECIMAL(12, 2) NOT NULL DEFAULT 0,
    transaction_count INT NOT NULL DEFAULT 0,
    online_amount DECIMAL(12, 2) DEFAULT 0,
    cash_amount DECIMAL(12, 2) DEFAULT 0,
    cheque_amount DECIMAL(12, 2) DEFAULT 0,
    neft_amount DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_daily_collections_college FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    UNIQUE (college_id, collection_date)
);

CREATE INDEX idx_daily_collections_college ON daily_collections(college_id);
CREATE INDEX idx_daily_collections_date ON daily_collections(collection_date);

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

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_receipts_updated_at BEFORE UPDATE ON receipts
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_installments_updated_at BEFORE UPDATE ON student_installments
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update daily_collections on successful payment
CREATE OR REPLACE FUNCTION update_daily_collection()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'success' AND (OLD.status IS NULL OR OLD.status != 'success') THEN
        INSERT INTO daily_collections (college_id, collection_date, total_amount, transaction_count, 
                                       online_amount, cash_amount, cheque_amount)
        VALUES (NEW.college_id, DATE(NEW.payment_date), NEW.net_amount, 1,
                CASE WHEN NEW.payment_mode = 'online' THEN NEW.net_amount ELSE 0 END,
                CASE WHEN NEW.payment_mode = 'cash' THEN NEW.net_amount ELSE 0 END,
                CASE WHEN NEW.payment_mode IN ('cheque', 'dd') THEN NEW.net_amount ELSE 0 END)
        ON CONFLICT (college_id, collection_date) DO UPDATE
        SET total_amount = daily_collections.total_amount + NEW.net_amount,
            transaction_count = daily_collections.transaction_count + 1,
            online_amount = daily_collections.online_amount + CASE WHEN NEW.payment_mode = 'online' THEN NEW.net_amount ELSE 0 END,
            cash_amount = daily_collections.cash_amount + CASE WHEN NEW.payment_mode = 'cash' THEN NEW.net_amount ELSE 0 END,
            cheque_amount = daily_collections.cheque_amount + CASE WHEN NEW.payment_mode IN ('cheque', 'dd') THEN NEW.net_amount ELSE 0 END;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_daily_collection
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION update_daily_collection();

-- ============================================
-- ROW-LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE refunds ENABLE ROW LEVEL SECURITY;
ALTER TABLE scholarships ENABLE ROW LEVEL SECURITY;

-- Policy: Fee Admins can only access their college's data
CREATE POLICY payments_college_isolation ON payments
FOR ALL
USING (college_id = current_setting('app.current_college_id')::BIGINT);

CREATE POLICY receipts_college_isolation ON receipts
FOR ALL
USING (college_id = current_setting('app.current_college_id')::BIGINT);

CREATE POLICY refunds_college_isolation ON refunds
FOR ALL
USING (college_id = current_setting('app.current_college_id')::BIGINT);

CREATE POLICY scholarships_college_isolation ON scholarships
FOR ALL
USING (college_id = current_setting('app.current_college_id')::BIGINT);

-- ============================================
-- SAMPLE DATA (For Development)
-- ============================================

-- Sample Fee Components
INSERT INTO fee_components (college_id, name, description, base_amount, gst_percentage, category, is_mandatory, is_refundable) VALUES
(1, 'Tuition Fee', 'Annual tuition fee', 120000.00, 0, 'tuition', true, false),
(1, 'Library Fee', 'Access to library resources', 10000.00, 18, 'library', true, true),
(1, 'Development Fee', 'Infrastructure development', 25000.00, 0, 'development', true, true),
(1, 'Sports Fee', 'Sports facilities access', 5000.00, 18, 'sports', false, true),
(1, 'Lab Fee', 'Laboratory equipment usage', 15000.00, 18, 'lab', true, true);

-- Sample Installment Plan
INSERT INTO installment_plans (college_id, name, description, academic_year, number_of_installments, is_active) VALUES
(1, 'Standard 3-Installment Plan', 'Pay in 3 equal installments', '2024-25', 3, true);

INSERT INTO installment_plan_details (installment_plan_id, sequence, percentage, due_day, due_month, description) VALUES
(1, 1, 40.00, 15, 6, 'First Installment (40%)'),
(1, 2, 40.00, 15, 10, 'Second Installment (40%)'),
(1, 3, 20.00, 15, 1, 'Third Installment (20%)');

-- ============================================
-- VIEWS
-- ============================================

-- View: Outstanding payments by student
CREATE OR REPLACE VIEW student_outstanding_payments AS
SELECT 
    s.id AS student_id,
    s.first_name || ' ' || s.last_name AS student_name,
    s.roll_number,
    p.name AS program_name,
    fs.total_fee,
    COALESCE(SUM(pay.net_amount), 0) AS paid_amount,
    fs.total_fee - COALESCE(SUM(pay.net_amount), 0) AS pending_amount,
    COUNT(pay.id) AS payment_count
FROM students s
JOIN programs p ON s.program_id = p.id
JOIN fee_structures fs ON p.id = fs.program_id AND s.current_year = fs.year_of_study
LEFT JOIN payments pay ON s.id = pay.student_id AND pay.status = 'success'
GROUP BY s.id, s.first_name, s.last_name, s.roll_number, p.name, fs.total_fee;

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_payments_college_student_status ON payments(college_id, student_id, status);
CREATE INDEX idx_payments_college_date_mode ON payments(college_id, payment_date, payment_mode);
CREATE INDEX idx_receipts_college_issued_date ON receipts(college_id, issued_date);
CREATE INDEX idx_student_installments_college_status_due ON student_installments(college_id, status, due_date);

-- Partial indexes for performance
CREATE INDEX idx_payments_pending ON payments(id) WHERE status = 'pending';
CREATE INDEX idx_payments_failed ON payments(id) WHERE status = 'failed';
CREATE INDEX idx_cheques_deposited ON payments(id) WHERE payment_mode = 'cheque' AND cheque_status = 'deposited';

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function: Calculate total outstanding for a college
CREATE OR REPLACE FUNCTION get_college_outstanding(p_college_id BIGINT)
RETURNS DECIMAL(12, 2) AS $$
DECLARE
    v_outstanding DECIMAL(12, 2);
BEGIN
    SELECT SUM(pending_amount) INTO v_outstanding
    FROM student_outstanding_payments
    WHERE student_id IN (SELECT id FROM students WHERE college_id = p_college_id);
    
    RETURN COALESCE(v_outstanding, 0);
END;
$$ LANGUAGE plpgsql;

-- Function: Get aging bucket for defaulters
CREATE OR REPLACE FUNCTION get_aging_bucket(days_overdue INT)
RETURNS VARCHAR(20) AS $$
BEGIN
    IF days_overdue <= 30 THEN
        RETURN '0-30';
    ELSIF days_overdue <= 60 THEN
        RETURN '31-60';
    ELSIF days_overdue <= 90 THEN
        RETURN '61-90';
    ELSE
        RETURN '>90';
    END IF;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- END OF SCHEMA
-- ============================================
