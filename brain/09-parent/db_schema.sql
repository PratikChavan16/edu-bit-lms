-- Parent Portal - Database Schema
-- PostgreSQL 16 with Row-Level Security (RLS)
-- Last Updated: October 25, 2025

-- ============================================
-- SCHEMA SETUP
-- ============================================

CREATE SCHEMA IF NOT EXISTS parent_portal;
SET search_path TO parent_portal, public;

-- ============================================
-- EXTENSIONS
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- TABLES
-- ============================================

-- Parents table
CREATE TABLE parents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100),
    mobile VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(255),
    notification_preferences JSONB DEFAULT '{
        "attendance": {"enabled": true, "mode": "realtime"},
        "grades": {"enabled": true, "mode": "digest", "digest_time": "18:00"},
        "fees": {"enabled": true, "days_before_due": 7},
        "messages": {"enabled": true, "mode": "realtime"},
        "quiet_hours": {"enabled": true, "start": "22:00", "end": "07:00"}
    }'::jsonb,
    fcm_tokens JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Linking codes (school-generated)
CREATE TABLE linking_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(7) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    relationship VARCHAR(20) DEFAULT 'guardian',
    generated_by UUID NOT NULL, -- Admin/Staff who generated
    status VARCHAR(20) DEFAULT 'active', -- active, used, expired
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Parent-Child Links
CREATE TABLE parent_children (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id) ON DELETE CASCADE,
    student_id VARCHAR(50) NOT NULL,
    relationship VARCHAR(20) DEFAULT 'guardian', -- father, mother, guardian, other
    permissions JSONB DEFAULT '{
        "view_attendance": true,
        "view_grades": true,
        "view_fees": true,
        "make_payments": true,
        "message_teachers": true
    }'::jsonb,
    status VARCHAR(20) DEFAULT 'pending_activation', -- pending_activation, active, inactive
    linked_via VARCHAR(20) DEFAULT 'code', -- code, admin_approval, bulk_upload
    activates_at TIMESTAMPTZ,
    linked_at TIMESTAMPTZ DEFAULT NOW(),
    unlinked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    CONSTRAINT max_4_parents_per_student CHECK (
        (SELECT COUNT(*) FROM parent_children 
         WHERE student_id = parent_children.student_id 
         AND status = 'active') <= 4
    )
);

-- Attendance records (read-only from Student Portal)
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL, -- present, absent, late, half_day
    marked_at TIMESTAMPTZ NOT NULL,
    marked_by VARCHAR(50), -- Faculty ID
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(student_id, date)
);

-- Grades (read-only from Student Portal)
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    subject_id VARCHAR(50) NOT NULL,
    subject_name VARCHAR(100) NOT NULL,
    semester INTEGER NOT NULL,
    year INTEGER NOT NULL,
    assessment_type VARCHAR(50) NOT NULL, -- unit_test, mid_term, final_exam, assignment
    assessment_name VARCHAR(100) NOT NULL,
    max_marks DECIMAL(5,2) NOT NULL,
    obtained_marks DECIMAL(5,2) NOT NULL,
    percentage DECIMAL(5,2) GENERATED ALWAYS AS ((obtained_marks / max_marks) * 100) STORED,
    conducted_on DATE,
    published_on DATE,
    published_by VARCHAR(50), -- Faculty ID
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Fees
CREATE TABLE fees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fee_id VARCHAR(50) UNIQUE NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    fee_type VARCHAR(50) NOT NULL, -- tuition, transport, library, lab, hostel, exam
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    late_fee DECIMAL(10,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', -- pending, overdue, paid, waived
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Payments
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    payment_id VARCHAR(50) UNIQUE NOT NULL,
    parent_id UUID NOT NULL REFERENCES parents(id),
    fee_ids JSONB NOT NULL, -- Array of fee_ids
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_method VARCHAR(50), -- razorpay, phonepe, upi
    razorpay_order_id VARCHAR(100),
    razorpay_payment_id VARCHAR(100),
    status VARCHAR(20) DEFAULT 'initiated', -- initiated, processing, completed, failed, refunded
    completed_at TIMESTAMPTZ,
    refunded_at TIMESTAMPTZ,
    refund_amount DECIMAL(10,2),
    receipt_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages between parents and teachers
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id VARCHAR(50) UNIQUE NOT NULL,
    from_id VARCHAR(50) NOT NULL, -- Parent or Faculty ID
    from_type VARCHAR(20) NOT NULL, -- parent, faculty
    to_id VARCHAR(50) NOT NULL,
    to_type VARCHAR(20) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    body TEXT NOT NULL,
    child_id VARCHAR(50), -- Student ID (context)
    priority VARCHAR(20) DEFAULT 'normal', -- low, normal, high
    attachments JSONB DEFAULT '[]'::jsonb,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    replied_to UUID REFERENCES messages(id), -- Thread reference
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit logs (FERPA compliance)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    parent_id UUID NOT NULL REFERENCES parents(id),
    action VARCHAR(50) NOT NULL, -- login, view_attendance, view_grades, pay_fees, etc.
    resource_type VARCHAR(50), -- attendance, grades, fees, payment
    resource_id VARCHAR(50),
    student_id VARCHAR(50),
    ip_address INET,
    user_agent TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Link audit (custody disputes, legal compliance)
CREATE TABLE parent_link_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(50) NOT NULL,
    parent_id UUID NOT NULL REFERENCES parents(id),
    action VARCHAR(20) NOT NULL, -- linked, unlinked, permission_changed
    approved_by VARCHAR(50), -- Admin ID
    documents JSONB, -- Court orders, ID proofs
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Performance indexes
CREATE INDEX idx_parents_mobile ON parents(mobile);
CREATE INDEX idx_parents_parent_id ON parents(parent_id);

CREATE INDEX idx_linking_codes_code ON linking_codes(code);
CREATE INDEX idx_linking_codes_student ON linking_codes(student_id);

CREATE INDEX idx_parent_children_parent ON parent_children(parent_id);
CREATE INDEX idx_parent_children_student ON parent_children(student_id);
CREATE INDEX idx_parent_children_status ON parent_children(status);
CREATE INDEX idx_parent_children_active ON parent_children(parent_id, student_id) WHERE status = 'active';

CREATE INDEX idx_attendance_student_date ON attendance(student_id, date DESC);
CREATE INDEX idx_attendance_date ON attendance(date DESC);

CREATE INDEX idx_grades_student_semester ON grades(student_id, semester, year);
CREATE INDEX idx_grades_published ON grades(is_published, published_on DESC);

CREATE INDEX idx_fees_student_status ON fees(student_id, status);
CREATE INDEX idx_fees_due_date ON fees(due_date) WHERE status IN ('pending', 'overdue');

CREATE INDEX idx_payments_parent ON payments(parent_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_razorpay ON payments(razorpay_order_id);

CREATE INDEX idx_messages_from ON messages(from_id, from_type);
CREATE INDEX idx_messages_to ON messages(to_id, to_type);
CREATE INDEX idx_messages_child ON messages(child_id);
CREATE INDEX idx_messages_unread ON messages(to_id) WHERE is_read = false;

CREATE INDEX idx_audit_logs_parent ON audit_logs(parent_id, created_at DESC);
CREATE INDEX idx_audit_logs_student ON audit_logs(student_id, created_at DESC);

-- ============================================
-- ROW-LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on sensitive tables
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE fees ENABLE ROW LEVEL SECURITY;

-- Attendance: Parents can only view their linked children's attendance
CREATE POLICY parent_attendance_access ON attendance
    FOR SELECT
    USING (
        student_id IN (
            SELECT student_id 
            FROM parent_children 
            WHERE parent_id = current_setting('app.current_parent_id', true)::uuid
            AND permissions @> '{"view_attendance": true}'
            AND status = 'active'
        )
    );

-- Grades: Parents can only view their linked children's grades
CREATE POLICY parent_grades_access ON grades
    FOR SELECT
    USING (
        is_published = true
        AND student_id IN (
            SELECT student_id 
            FROM parent_children 
            WHERE parent_id = current_setting('app.current_parent_id', true)::uuid
            AND permissions @> '{"view_grades": true}'
            AND status = 'active'
        )
    );

-- Fees: Parents can only view their linked children's fees
CREATE POLICY parent_fees_access ON fees
    FOR SELECT
    USING (
        student_id IN (
            SELECT student_id 
            FROM parent_children 
            WHERE parent_id = current_setting('app.current_parent_id', true)::uuid
            AND permissions @> '{"view_fees": true}'
            AND status = 'active'
        )
    );

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to activate pending links (runs hourly via cron job)
CREATE OR REPLACE FUNCTION activate_pending_links()
RETURNS INTEGER AS $$
DECLARE
    activated_count INTEGER;
BEGIN
    UPDATE parent_children
    SET status = 'active'
    WHERE status = 'pending_activation'
    AND activates_at <= NOW();
    
    GET DIAGNOSTICS activated_count = ROW_COUNT;
    RETURN activated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate late fees (runs daily)
CREATE OR REPLACE FUNCTION calculate_late_fees()
RETURNS INTEGER AS $$
DECLARE
    updated_count INTEGER;
BEGIN
    UPDATE fees
    SET 
        status = 'overdue',
        late_fee = CASE 
            WHEN EXTRACT(DAY FROM (NOW() - due_date)) <= 7 THEN amount * 0.01 -- 1% for first week
            WHEN EXTRACT(DAY FROM (NOW() - due_date)) <= 30 THEN amount * 0.05 -- 5% up to 1 month
            ELSE amount * 0.10 -- 10% after 1 month
        END
    WHERE status = 'pending'
    AND due_date < CURRENT_DATE;
    
    GET DIAGNOSTICS updated_count = ROW_COUNT;
    RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Function to log audit events
CREATE OR REPLACE FUNCTION log_audit_event(
    p_parent_id UUID,
    p_action VARCHAR,
    p_resource_type VARCHAR DEFAULT NULL,
    p_resource_id VARCHAR DEFAULT NULL,
    p_student_id VARCHAR DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        parent_id, action, resource_type, resource_id, student_id,
        ip_address, user_agent, metadata
    ) VALUES (
        p_parent_id, p_action, p_resource_type, p_resource_id, p_student_id,
        p_ip_address, p_user_agent, p_metadata
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER parents_updated_at
    BEFORE UPDATE ON parents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER parent_children_updated_at
    BEFORE UPDATE ON parent_children
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER fees_updated_at
    BEFORE UPDATE ON fees
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- VIEWS
-- ============================================

-- View: Parent Dashboard Summary
CREATE OR REPLACE VIEW parent_dashboard_summary AS
SELECT 
    p.parent_id,
    p.name AS parent_name,
    COUNT(DISTINCT pc.student_id) AS total_children,
    COUNT(DISTINCT CASE WHEN f.status = 'pending' THEN f.id END) AS pending_fees_count,
    COALESCE(SUM(CASE WHEN f.status = 'pending' THEN f.amount + f.late_fee END), 0) AS total_pending_amount,
    COUNT(DISTINCT CASE WHEN m.is_read = false AND m.to_id = p.parent_id THEN m.id END) AS unread_messages
FROM parents p
LEFT JOIN parent_children pc ON p.id = pc.parent_id AND pc.status = 'active'
LEFT JOIN fees f ON pc.student_id = f.student_id
LEFT JOIN messages m ON m.to_id = p.parent_id AND m.to_type = 'parent'
GROUP BY p.id, p.parent_id, p.name;

-- ============================================
-- SEED DATA (Development/Testing)
-- ============================================

-- Sample parent
INSERT INTO parents (parent_id, name, mobile, email) VALUES
('PAR-2024-00567', 'Rajesh Kumar', '+91-9876543210', 'rajesh@example.com'),
('PAR-2024-00568', 'Priya Sharma', '+91-9876543211', 'priya@example.com');

-- Sample linking code
INSERT INTO linking_codes (code, student_id, relationship, generated_by, expires_at) VALUES
('ABC1234', 'STU-2024-00123', 'father', (SELECT id FROM parents LIMIT 1), NOW() + INTERVAL '7 days');

-- ============================================
-- GRANTS (Application user permissions)
-- ============================================

-- Create app user role
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parent_portal_app') THEN
        CREATE ROLE parent_portal_app WITH LOGIN PASSWORD 'secure_password_here';
    END IF;
END$$;

-- Grant permissions
GRANT USAGE ON SCHEMA parent_portal TO parent_portal_app;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA parent_portal TO parent_portal_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA parent_portal TO parent_portal_app;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA parent_portal TO parent_portal_app;

-- ============================================
-- COMMENTS (Documentation)
-- ============================================

COMMENT ON TABLE parents IS 'Parent/guardian accounts with notification preferences';
COMMENT ON TABLE parent_children IS 'Parent-child relationships with granular permissions';
COMMENT ON TABLE linking_codes IS 'School-generated codes for secure parent-child linking';
COMMENT ON TABLE attendance IS 'Student attendance records (synced from Student Portal)';
COMMENT ON TABLE grades IS 'Student grades and assessments (synced from Faculty Portal)';
COMMENT ON TABLE fees IS 'Fee records for students';
COMMENT ON TABLE payments IS 'Payment transactions via Razorpay/PhonePe';
COMMENT ON TABLE messages IS 'Communication between parents and teachers';
COMMENT ON TABLE audit_logs IS 'FERPA compliance audit trail';
COMMENT ON TABLE parent_link_audit IS 'Parent-child linking history for legal compliance';

-- ============================================
-- DATABASE MAINTENANCE
-- ============================================

-- Vacuum and analyze for performance
VACUUM ANALYZE parents;
VACUUM ANALYZE parent_children;
VACUUM ANALYZE attendance;
VACUUM ANALYZE grades;
VACUUM ANALYZE fees;
VACUUM ANALYZE payments;

-- End of schema
