-- College Accounts Admin Portal - Database Schema
-- PostgreSQL 16
-- Version: 1.0.0
-- Purpose: College-level financial management system

-- ============================================
-- EXTENSIONS
-- ============================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy text search

-- ============================================
-- ENUMS
-- ============================================
CREATE TYPE expense_category AS ENUM ('salaries', 'utilities', 'supplies', 'maintenance', 'transport', 'infrastructure', 'miscellaneous');
CREATE TYPE expense_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'paid');
CREATE TYPE payment_mode AS ENUM ('cash', 'cheque', 'neft', 'rtgs', 'upi');
CREATE TYPE payment_status AS ENUM ('scheduled', 'processing', 'completed', 'failed', 'cancelled');
CREATE TYPE vendor_status AS ENUM ('active', 'inactive', 'blacklisted');
CREATE TYPE po_status AS ENUM ('draft', 'pending_approval', 'approved', 'rejected', 'partially_received', 'fully_received', 'closed');
CREATE TYPE invoice_status AS ENUM ('pending', 'approved', 'scheduled', 'paid', 'overdue');

-- ============================================
-- CORE TABLES
-- ============================================

-- GL Codes (General Ledger Codes)
CREATE TABLE gl_codes (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    category expense_category NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_gl_codes_category ON gl_codes(category);
CREATE INDEX idx_gl_codes_active ON gl_codes(is_active) WHERE is_active = true;

-- Vendors
CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    vendor_code VARCHAR(50) UNIQUE NOT NULL,
    vendor_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(20),
    email VARCHAR(255),
    category VARCHAR(100),
    gst_number VARCHAR(15),
    pan_number VARCHAR(10),
    bank_account_number VARCHAR(50),
    bank_name VARCHAR(255),
    ifsc_code VARCHAR(11),
    branch VARCHAR(255),
    address TEXT,
    payment_terms VARCHAR(255),
    status vendor_status DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_vendors_college ON vendors(college_id);
CREATE INDEX idx_vendors_status ON vendors(status);
CREATE INDEX idx_vendors_name_trgm ON vendors USING gin (vendor_name gin_trgm_ops);

-- Expenses
CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    expense_number VARCHAR(50) UNIQUE NOT NULL,
    category expense_category NOT NULL,
    amount DECIMAL(15, 2) NOT NULL CHECK (amount > 0),
    expense_date DATE NOT NULL,
    description TEXT NOT NULL,
    gl_code_id BIGINT REFERENCES gl_codes(id),
    vendor_id BIGINT REFERENCES vendors(id),
    payment_mode payment_mode,
    invoice_number VARCHAR(100),
    receipt_url VARCHAR(500),
    status expense_status DEFAULT 'draft',
    submitted_by BIGINT REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_expenses_college ON expenses(college_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_vendor ON expenses(vendor_id);
CREATE INDEX idx_expenses_number ON expenses(expense_number);

-- Purchase Orders
CREATE TABLE purchase_orders (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    po_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    po_date DATE NOT NULL,
    delivery_date DATE,
    total_amount DECIMAL(15, 2) NOT NULL,
    gst_amount DECIMAL(15, 2) DEFAULT 0,
    grand_total DECIMAL(15, 2) NOT NULL,
    status po_status DEFAULT 'draft',
    terms_and_conditions TEXT,
    notes TEXT,
    created_by BIGINT REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_po_college ON purchase_orders(college_id);
CREATE INDEX idx_po_vendor ON purchase_orders(vendor_id);
CREATE INDEX idx_po_status ON purchase_orders(status);
CREATE INDEX idx_po_date ON purchase_orders(po_date);

-- Purchase Order Items
CREATE TABLE purchase_order_items (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity DECIMAL(10, 2) NOT NULL,
    unit VARCHAR(50),
    unit_price DECIMAL(15, 2) NOT NULL,
    gst_rate DECIMAL(5, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    received_quantity DECIMAL(10, 2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_po_items_po ON purchase_order_items(purchase_order_id);

-- Goods Receipt Notes
CREATE TABLE goods_receipts (
    id BIGSERIAL PRIMARY KEY,
    purchase_order_id BIGINT NOT NULL REFERENCES purchase_orders(id),
    grn_number VARCHAR(50) UNIQUE NOT NULL,
    receipt_date DATE NOT NULL,
    received_by BIGINT REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grn_po ON goods_receipts(purchase_order_id);

-- GRN Items
CREATE TABLE goods_receipt_items (
    id BIGSERIAL PRIMARY KEY,
    goods_receipt_id BIGINT NOT NULL REFERENCES goods_receipts(id) ON DELETE CASCADE,
    po_item_id BIGINT NOT NULL REFERENCES purchase_order_items(id),
    received_quantity DECIMAL(10, 2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_grn_items_grn ON goods_receipt_items(goods_receipt_id);
CREATE INDEX idx_grn_items_po_item ON goods_receipt_items(po_item_id);

-- Invoices
CREATE TABLE invoices (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    purchase_order_id BIGINT REFERENCES purchase_orders(id),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE,
    amount DECIMAL(15, 2) NOT NULL,
    gst_amount DECIMAL(15, 2) DEFAULT 0,
    total_amount DECIMAL(15, 2) NOT NULL,
    paid_amount DECIMAL(15, 2) DEFAULT 0,
    outstanding_amount DECIMAL(15, 2) NOT NULL,
    status invoice_status DEFAULT 'pending',
    invoice_document_url VARCHAR(500),
    notes TEXT,
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_invoices_college ON invoices(college_id);
CREATE INDEX idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX idx_invoices_po ON invoices(purchase_order_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- Bank Accounts
CREATE TABLE bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    account_name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50) NOT NULL,
    bank_name VARCHAR(255) NOT NULL,
    ifsc_code VARCHAR(11) NOT NULL,
    branch VARCHAR(255),
    account_type VARCHAR(50),
    balance DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_bank_accounts_college ON bank_accounts(college_id);
CREATE INDEX idx_bank_accounts_active ON bank_accounts(is_active) WHERE is_active = true;

-- Payments
CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    payment_number VARCHAR(50) UNIQUE NOT NULL,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    invoice_id BIGINT REFERENCES invoices(id),
    amount DECIMAL(15, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_mode payment_mode NOT NULL,
    bank_account_id BIGINT REFERENCES bank_accounts(id),
    reference_number VARCHAR(100),
    transaction_id VARCHAR(100),
    status payment_status DEFAULT 'scheduled',
    processed_by BIGINT REFERENCES users(id),
    processed_at TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE INDEX idx_payments_college ON payments(college_id);
CREATE INDEX idx_payments_vendor ON payments(vendor_id);
CREATE INDEX idx_payments_invoice ON payments(invoice_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_date ON payments(payment_date);

-- Budgets
CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    financial_year VARCHAR(10) NOT NULL, -- e.g., "2025-2026"
    category expense_category NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL,
    utilized_amount DECIMAL(15, 2) DEFAULT 0,
    remaining_amount DECIMAL(15, 2) GENERATED ALWAYS AS (allocated_amount - utilized_amount) STORED,
    utilization_percentage DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN allocated_amount > 0 THEN (utilized_amount / allocated_amount * 100)
            ELSE 0
        END
    ) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(college_id, financial_year, category)
);

CREATE INDEX idx_budgets_college ON budgets(college_id);
CREATE INDEX idx_budgets_year ON budgets(financial_year);
CREATE INDEX idx_budgets_category ON budgets(category);

-- Approvals (Polymorphic)
CREATE TABLE approvals (
    id BIGSERIAL PRIMARY KEY,
    approvable_type VARCHAR(100) NOT NULL, -- 'expense', 'purchase_order', 'invoice'
    approvable_id BIGINT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    requester_id BIGINT REFERENCES users(id),
    approver_id BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_approvals_polymorphic ON approvals(approvable_type, approvable_id);
CREATE INDEX idx_approvals_status ON approvals(status);
CREATE INDEX idx_approvals_approver ON approvals(approver_id);

-- Audit Logs
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(100) NOT NULL,
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL, -- 'created', 'updated', 'deleted', 'approved', 'rejected'
    user_id BIGINT REFERENCES users(id),
    user_name VARCHAR(255),
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_created ON audit_logs(created_at);
CREATE INDEX idx_audit_changes ON audit_logs USING gin (changes);

-- ============================================
-- VIEWS
-- ============================================

-- Vendor Payment Summary View
CREATE VIEW vw_vendor_payment_summary AS
SELECT 
    v.id AS vendor_id,
    v.vendor_code,
    v.vendor_name,
    COUNT(DISTINCT p.id) AS total_transactions,
    COALESCE(SUM(CASE WHEN p.status = 'completed' THEN p.amount ELSE 0 END), 0) AS total_paid,
    COALESCE(SUM(i.outstanding_amount), 0) AS outstanding_amount,
    MAX(p.payment_date) AS last_payment_date
FROM vendors v
LEFT JOIN payments p ON v.id = p.vendor_id
LEFT JOIN invoices i ON v.id = i.vendor_id AND i.status != 'paid'
WHERE v.deleted_at IS NULL
GROUP BY v.id, v.vendor_code, v.vendor_name;

-- Budget Utilization View
CREATE VIEW vw_budget_utilization AS
SELECT 
    b.college_id,
    b.financial_year,
    b.category,
    b.allocated_amount,
    b.utilized_amount,
    b.remaining_amount,
    b.utilization_percentage,
    CASE 
        WHEN b.utilization_percentage >= 90 THEN 'critical'
        WHEN b.utilization_percentage >= 70 THEN 'warning'
        ELSE 'normal'
    END AS alert_level
FROM budgets b;

-- Expense Summary by Category
CREATE VIEW vw_expense_summary_by_category AS
SELECT 
    e.college_id,
    e.category,
    DATE_TRUNC('month', e.expense_date) AS expense_month,
    COUNT(*) AS transaction_count,
    SUM(e.amount) AS total_amount,
    AVG(e.amount) AS average_amount
FROM expenses e
WHERE e.status IN ('approved', 'paid')
  AND e.deleted_at IS NULL
GROUP BY e.college_id, e.category, DATE_TRUNC('month', e.expense_date);

-- Pending Approvals View
CREATE VIEW vw_pending_approvals AS
SELECT 
    a.id AS approval_id,
    a.approvable_type,
    a.approvable_id,
    CASE 
        WHEN a.approvable_type = 'expense' THEN e.expense_number
        WHEN a.approvable_type = 'purchase_order' THEN po.po_number
        WHEN a.approvable_type = 'invoice' THEN i.invoice_number
    END AS reference_number,
    CASE 
        WHEN a.approvable_type = 'expense' THEN e.amount
        WHEN a.approvable_type = 'purchase_order' THEN po.grand_total
        WHEN a.approvable_type = 'invoice' THEN i.total_amount
    END AS amount,
    a.requester_id,
    u.name AS requester_name,
    a.created_at AS requested_at,
    AGE(CURRENT_TIMESTAMP, a.created_at) AS pending_duration
FROM approvals a
LEFT JOIN users u ON a.requester_id = u.id
LEFT JOIN expenses e ON a.approvable_type = 'expense' AND a.approvable_id = e.id
LEFT JOIN purchase_orders po ON a.approvable_type = 'purchase_order' AND a.approvable_id = po.id
LEFT JOIN invoices i ON a.approvable_type = 'invoice' AND a.approvable_id = i.id
WHERE a.status = 'pending';

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to calculate financial year
CREATE OR REPLACE FUNCTION get_financial_year(input_date DATE)
RETURNS VARCHAR AS $$
DECLARE
    year INT;
    month INT;
BEGIN
    year := EXTRACT(YEAR FROM input_date);
    month := EXTRACT(MONTH FROM input_date);
    
    IF month >= 4 THEN
        RETURN year || '-' || (year + 1);
    ELSE
        RETURN (year - 1) || '-' || year;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Function to update invoice outstanding amount
CREATE OR REPLACE FUNCTION update_invoice_outstanding()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE invoices
        SET 
            paid_amount = COALESCE((
                SELECT SUM(amount)
                FROM payments
                WHERE invoice_id = NEW.invoice_id
                  AND status = 'completed'
            ), 0),
            outstanding_amount = total_amount - COALESCE((
                SELECT SUM(amount)
                FROM payments
                WHERE invoice_id = NEW.invoice_id
                  AND status = 'completed'
            ), 0),
            status = CASE
                WHEN total_amount <= COALESCE((
                    SELECT SUM(amount)
                    FROM payments
                    WHERE invoice_id = NEW.invoice_id
                      AND status = 'completed'
                ), 0) THEN 'paid'::invoice_status
                ELSE status
            END
        WHERE id = NEW.invoice_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

-- Auto-update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vendors_updated_at BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Invoice outstanding amount trigger
CREATE TRIGGER update_invoice_on_payment
AFTER INSERT OR UPDATE ON payments
FOR EACH ROW
WHEN (NEW.invoice_id IS NOT NULL)
EXECUTE FUNCTION update_invoice_outstanding();

-- Audit log trigger
CREATE OR REPLACE FUNCTION log_audit_trail()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, user_id, changes)
        VALUES (TG_TABLE_NAME, NEW.id, 'created', CURRENT_USER_ID(), to_jsonb(NEW));
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, user_id, changes)
        VALUES (TG_TABLE_NAME, NEW.id, 'updated', CURRENT_USER_ID(), 
                jsonb_build_object('old', to_jsonb(OLD), 'new', to_jsonb(NEW)));
    ELSIF TG_OP = 'DELETE' THEN
        INSERT INTO audit_logs (entity_type, entity_id, action, user_id, changes)
        VALUES (TG_TABLE_NAME, OLD.id, 'deleted', CURRENT_USER_ID(), to_jsonb(OLD));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers
CREATE TRIGGER audit_expenses AFTER INSERT OR UPDATE OR DELETE ON expenses
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

CREATE TRIGGER audit_payments AFTER INSERT OR UPDATE OR DELETE ON payments
    FOR EACH ROW EXECUTE FUNCTION log_audit_trail();

-- ============================================
-- SAMPLE DATA
-- ============================================

-- GL Codes
INSERT INTO gl_codes (code, name, category, description) VALUES
('EXP-SAL-001', 'Faculty Salaries', 'salaries', 'Permanent faculty monthly salaries'),
('EXP-SAL-002', 'Staff Salaries', 'salaries', 'Non-teaching staff salaries'),
('EXP-UTL-001', 'Electricity', 'utilities', 'Monthly electricity bills'),
('EXP-UTL-002', 'Water', 'utilities', 'Monthly water bills'),
('EXP-SUP-001', 'Office Supplies', 'supplies', 'Stationery and office materials'),
('EXP-SUP-002', 'Lab Equipment', 'supplies', 'Laboratory supplies and equipment'),
('EXP-MNT-001', 'Building Maintenance', 'maintenance', 'Building repairs and maintenance'),
('EXP-MNT-002', 'Equipment Maintenance', 'maintenance', 'Equipment servicing and repairs'),
('EXP-TRN-001', 'Staff Transport', 'transport', 'Staff transportation costs'),
('EXP-INF-001', 'Infrastructure Development', 'infrastructure', 'Building and infrastructure projects');

-- Sample Vendor
INSERT INTO vendors (college_id, vendor_code, vendor_name, contact_person, phone, email, category, gst_number, pan_number, status)
VALUES 
(1, 'VEN-00001', 'ABC Supplies Pvt Ltd', 'Rajesh Kumar', '+919876543210', 'rajesh@abcsupplies.com', 'Office Supplies', '29ABCDE1234F1Z5', 'ABCDE1234F', 'active'),
(1, 'VEN-00002', 'XYZ Electricity Services', 'Priya Sharma', '+919876543211', 'priya@xyzelectric.com', 'Utilities', '29XYZAB5678G2W6', 'XYZAB5678G', 'active');

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Composite indexes for common queries
CREATE INDEX idx_expenses_college_status_date ON expenses(college_id, status, expense_date DESC);
CREATE INDEX idx_payments_vendor_status ON payments(vendor_id, status, payment_date DESC);
CREATE INDEX idx_invoices_vendor_status ON invoices(vendor_id, status, due_date);

-- Partial indexes for active records
CREATE INDEX idx_vendors_active_college ON vendors(college_id) WHERE status = 'active' AND deleted_at IS NULL;
CREATE INDEX idx_invoices_unpaid ON invoices(vendor_id, due_date) WHERE status != 'paid';

-- ============================================
-- COMMENTS
-- ============================================
COMMENT ON TABLE expenses IS 'College expense transactions with GL code mapping';
COMMENT ON TABLE vendors IS 'Vendor master data for payment processing';
COMMENT ON TABLE payments IS 'Payment transactions to vendors';
COMMENT ON TABLE budgets IS 'Budget allocation and utilization tracking';
COMMENT ON COLUMN budgets.remaining_amount IS 'Auto-calculated remaining budget';
COMMENT ON COLUMN budgets.utilization_percentage IS 'Auto-calculated utilization percentage';

-- End of schema
