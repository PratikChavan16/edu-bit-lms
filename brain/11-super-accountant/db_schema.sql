-- ============================================================================
-- Super Accountant Portal - Database Schema
-- ============================================================================
-- Database: PostgreSQL 16
-- Purpose: Complete schema for financial management system
-- Manages: ₹150 Cr/year budget across 15 colleges
-- Last Updated: October 25, 2025
-- ============================================================================

-- Drop existing tables if needed (for fresh install)
-- DROP SCHEMA IF EXISTS public CASCADE;
-- CREATE SCHEMA public;

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search

-- ============================================================================
-- 1. USERS & AUTHENTICATION
-- ============================================================================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN (
        'super_accountant',
        'college_accounts_admin',
        'accounts_assistant',
        'auditor'
    )),
    college_id BIGINT REFERENCES colleges(id) ON DELETE SET NULL,
    mfa_secret VARCHAR(255),
    mfa_enabled BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE mfa_backup_codes (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    code_hash VARCHAR(255) NOT NULL,
    used_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE sessions (
    id VARCHAR(255) PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    ip_address INET,
    user_agent TEXT,
    payload TEXT,
    last_activity INTEGER NOT NULL
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_last_activity ON sessions(last_activity);

-- ============================================================================
-- 2. COLLEGES & DEPARTMENTS
-- ============================================================================

CREATE TABLE colleges (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) UNIQUE NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    phone VARCHAR(20),
    email VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(20) NOT NULL,
    head_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, code)
);

-- Indexes
CREATE INDEX idx_colleges_code ON colleges(code);
CREATE INDEX idx_departments_college_id ON departments(college_id);

-- ============================================================================
-- 3. PAYROLL SYSTEM
-- ============================================================================

CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    department_id BIGINT REFERENCES departments(id),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    designation VARCHAR(100),
    employee_type VARCHAR(50) CHECK (employee_type IN ('teaching', 'non_teaching')),
    date_of_joining DATE NOT NULL,
    salary_basic DECIMAL(12, 2) NOT NULL,
    bank_account_number VARCHAR(255),  -- Encrypted
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    pan_number VARCHAR(255),  -- Encrypted
    aadhar_number VARCHAR(255),  -- Encrypted
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payrolls (
    id BIGSERIAL PRIMARY KEY,
    payroll_id VARCHAR(50) UNIQUE NOT NULL,
    month VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    payment_date DATE NOT NULL,
    total_employees INTEGER NOT NULL DEFAULT 0,
    gross_salary DECIMAL(15, 2) NOT NULL DEFAULT 0,
    total_deductions DECIMAL(15, 2) NOT NULL DEFAULT 0,
    net_salary DECIMAL(15, 2) NOT NULL DEFAULT 0,
    status VARCHAR(50) NOT NULL DEFAULT 'draft' CHECK (status IN (
        'draft', 'processing', 'processed', 'paid', 'failed'
    )),
    processed_by BIGINT REFERENCES users(id),
    processed_at TIMESTAMP,
    bank_file_path TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(month, year)
);

CREATE TABLE payroll_colleges (
    payroll_id BIGINT NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    PRIMARY KEY (payroll_id, college_id)
);

CREATE TABLE payslips (
    id BIGSERIAL PRIMARY KEY,
    payroll_id BIGINT NOT NULL REFERENCES payrolls(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    basic_salary DECIMAL(12, 2) NOT NULL,
    hra DECIMAL(12, 2) NOT NULL DEFAULT 0,
    da DECIMAL(12, 2) NOT NULL DEFAULT 0,
    ta DECIMAL(12, 2) NOT NULL DEFAULT 0,
    medical_allowance DECIMAL(12, 2) NOT NULL DEFAULT 0,
    special_allowances JSONB,
    gross_salary DECIMAL(12, 2) NOT NULL,
    pf_deduction DECIMAL(12, 2) NOT NULL DEFAULT 0,
    professional_tax DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tds DECIMAL(12, 2) NOT NULL DEFAULT 0,
    loan_deduction DECIMAL(12, 2) NOT NULL DEFAULT 0,
    other_deductions JSONB,
    total_deductions DECIMAL(12, 2) NOT NULL,
    net_salary DECIMAL(12, 2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN (
        'pending', 'paid', 'failed'
    )),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(payroll_id, employee_id)
);

-- Indexes
CREATE INDEX idx_employees_college_id ON employees(college_id);
CREATE INDEX idx_employees_employee_id ON employees(employee_id);
CREATE INDEX idx_payrolls_month_year ON payrolls(month, year);
CREATE INDEX idx_payrolls_status ON payrolls(status);
CREATE INDEX idx_payslips_payroll_id ON payslips(payroll_id);
CREATE INDEX idx_payslips_employee_id ON payslips(employee_id);

-- ============================================================================
-- 4. EXPENSE MANAGEMENT
-- ============================================================================

CREATE TABLE expenses (
    id BIGSERIAL PRIMARY KEY,
    expense_id VARCHAR(50) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    department_id BIGINT REFERENCES departments(id),
    amount DECIMAL(12, 2) NOT NULL CHECK (amount > 0),
    category VARCHAR(50) NOT NULL CHECK (category IN (
        'equipment', 'maintenance', 'supplies', 'utilities', 'salaries', 'other'
    )),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending_principal' CHECK (status IN (
        'pending_principal',
        'pending_super_accountant',
        'pending_university_owner',
        'dual_auth_pending',
        'approved',
        'rejected',
        'cancelled'
    )),
    created_by BIGINT NOT NULL REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    approved_at TIMESTAMP,
    approval_comments TEXT,
    rejection_reason TEXT,
    budget_id BIGINT REFERENCES budgets(id),
    reference_number VARCHAR(100),
    invoice_number VARCHAR(100),
    vendor_id BIGINT REFERENCES vendors(id),
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN (
        'unpaid', 'pending', 'paid', 'failed'
    )),
    paid_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP
);

CREATE TABLE expense_approvals (
    id BIGSERIAL PRIMARY KEY,
    expense_id BIGINT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id),
    role VARCHAR(50) NOT NULL,
    approved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    comments TEXT,
    UNIQUE(expense_id, user_id)
);

CREATE TABLE expense_documents (
    id BIGSERIAL PRIMARY KEY,
    expense_id BIGINT NOT NULL REFERENCES expenses(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_type VARCHAR(50),
    file_size INTEGER,
    uploaded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_expenses_college_id ON expenses(college_id);
CREATE INDEX idx_expenses_status ON expenses(status);
CREATE INDEX idx_expenses_created_by ON expenses(created_by);
CREATE INDEX idx_expenses_created_at ON expenses(created_at);
CREATE INDEX idx_expense_documents_expense_id ON expense_documents(expense_id);

-- ============================================================================
-- 5. BUDGET MANAGEMENT
-- ============================================================================

CREATE TABLE budgets (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL REFERENCES colleges(id),
    department_id BIGINT REFERENCES departments(id),
    category VARCHAR(50) NOT NULL,
    fiscal_year VARCHAR(20) NOT NULL,
    allocated_amount DECIMAL(15, 2) NOT NULL CHECK (allocated_amount > 0),
    revised_amount DECIMAL(15, 2),
    revision_reason TEXT,
    revised_at TIMESTAMP,
    revised_by BIGINT REFERENCES users(id),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(college_id, department_id, category, fiscal_year)
);

CREATE TABLE budget_revisions (
    id BIGSERIAL PRIMARY KEY,
    budget_id BIGINT NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    previous_amount DECIMAL(15, 2) NOT NULL,
    new_amount DECIMAL(15, 2) NOT NULL,
    reason TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_by BIGINT NOT NULL REFERENCES users(id),
    approved_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_budgets_college_id ON budgets(college_id);
CREATE INDEX idx_budgets_fiscal_year ON budgets(fiscal_year);
CREATE INDEX idx_budget_revisions_budget_id ON budget_revisions(budget_id);

-- ============================================================================
-- 6. VENDOR MANAGEMENT
-- ============================================================================

CREATE TABLE vendors (
    id BIGSERIAL PRIMARY KEY,
    vendor_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    gstin VARCHAR(20),
    pan VARCHAR(20),
    category VARCHAR(100),
    contact_person VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    bank_account_number VARCHAR(255),  -- Encrypted
    bank_name VARCHAR(100),
    ifsc_code VARCHAR(20),
    payment_terms VARCHAR(50),
    rating DECIMAL(3, 2),
    is_verified BOOLEAN DEFAULT FALSE,
    is_blacklisted BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vendor_payments (
    id BIGSERIAL PRIMARY KEY,
    payment_id VARCHAR(50) UNIQUE NOT NULL,
    vendor_id BIGINT NOT NULL REFERENCES vendors(id),
    expense_id BIGINT REFERENCES expenses(id),
    amount DECIMAL(12, 2) NOT NULL,
    payment_date DATE NOT NULL,
    payment_method VARCHAR(50),
    reference_number VARCHAR(100),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN (
        'pending', 'processing', 'paid', 'failed'
    )),
    processed_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_vendors_gstin ON vendors(gstin);
CREATE INDEX idx_vendors_category ON vendors(category);
CREATE INDEX idx_vendor_payments_vendor_id ON vendor_payments(vendor_id);
CREATE INDEX idx_vendor_payments_status ON vendor_payments(status);

-- ============================================================================
-- 7. BANK RECONCILIATION
-- ============================================================================

CREATE TABLE bank_accounts (
    id BIGSERIAL PRIMARY KEY,
    account_number VARCHAR(255) NOT NULL,  -- Encrypted
    account_name VARCHAR(255) NOT NULL,
    bank_name VARCHAR(100) NOT NULL,
    ifsc_code VARCHAR(20) NOT NULL,
    branch VARCHAR(100),
    account_type VARCHAR(50),
    current_balance DECIMAL(15, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bank_transactions (
    id BIGSERIAL PRIMARY KEY,
    bank_account_id BIGINT NOT NULL REFERENCES bank_accounts(id),
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('credit', 'debit')),
    amount DECIMAL(12, 2) NOT NULL,
    reference_number VARCHAR(100),
    description TEXT,
    balance_after DECIMAL(15, 2),
    is_matched BOOLEAN DEFAULT FALSE,
    matched_with_type VARCHAR(50),  -- 'expense', 'vendor_payment', 'payroll'
    matched_with_id BIGINT,
    matched_at TIMESTAMP,
    matched_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE bank_reconciliations (
    id BIGSERIAL PRIMARY KEY,
    bank_account_id BIGINT NOT NULL REFERENCES bank_accounts(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    total_transactions INTEGER NOT NULL,
    matched_transactions INTEGER NOT NULL,
    unmatched_transactions INTEGER NOT NULL,
    reconciled_by BIGINT REFERENCES users(id),
    reconciled_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX idx_bank_transactions_bank_account_id ON bank_transactions(bank_account_id);
CREATE INDEX idx_bank_transactions_date ON bank_transactions(transaction_date);
CREATE INDEX idx_bank_transactions_is_matched ON bank_transactions(is_matched);

-- ============================================================================
-- 8. AUDIT TRAIL
-- ============================================================================

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50) NOT NULL,
    resource_id BIGINT,
    before_state JSONB,
    after_state JSONB,
    ip_address INET NOT NULL,
    user_agent TEXT,
    metadata JSONB,
    previous_log_hash VARCHAR(64),
    current_log_hash VARCHAR(64),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);

-- ============================================================================
-- 9. NOTIFICATIONS
-- ============================================================================

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type VARCHAR(255) NOT NULL,
    notifiable_type VARCHAR(255) NOT NULL,
    notifiable_id BIGINT NOT NULL,
    data JSONB NOT NULL,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_notifiable ON notifications(notifiable_type, notifiable_id);

-- ============================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on sensitive tables
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE payrolls ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Create database roles
CREATE ROLE super_accountant;
CREATE ROLE college_accounts_admin;
CREATE ROLE accounts_assistant;
CREATE ROLE auditor;

-- Policy for Super Accountant (full access)
CREATE POLICY super_accountant_all_expenses ON expenses
    FOR ALL
    TO super_accountant
    USING (true)
    WITH CHECK (true);

-- Policy for College Accounts Admin (own college only)
CREATE POLICY college_admin_expenses ON expenses
    FOR ALL
    TO college_accounts_admin
    USING (
        college_id IN (
            SELECT college_id FROM users 
            WHERE id = current_setting('app.user_id')::bigint
        )
    )
    WITH CHECK (
        college_id IN (
            SELECT college_id FROM users 
            WHERE id = current_setting('app.user_id')::bigint
        )
    );

-- Policy for Auditor (read-only all)
CREATE POLICY auditor_expenses ON expenses
    FOR SELECT
    TO auditor
    USING (true);

-- Similar policies for other tables...

-- ============================================================================
-- 11. FUNCTIONS & TRIGGERS
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate budget utilization
CREATE OR REPLACE FUNCTION calculate_budget_utilization(budget_id_param BIGINT)
RETURNS TABLE (
    spent DECIMAL,
    committed DECIMAL,
    available DECIMAL,
    utilization_percentage DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN e.status = 'approved' THEN e.amount ELSE 0 END), 0) as spent,
        COALESCE(SUM(CASE WHEN e.status LIKE 'pending%' THEN e.amount ELSE 0 END), 0) as committed,
        b.allocated_amount - COALESCE(SUM(e.amount), 0) as available,
        (COALESCE(SUM(e.amount), 0) / b.allocated_amount * 100) as utilization_percentage
    FROM budgets b
    LEFT JOIN expenses e ON e.budget_id = b.id
    WHERE b.id = budget_id_param
    GROUP BY b.id, b.allocated_amount;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- 12. VIEWS FOR REPORTING
-- ============================================================================

-- Budget utilization view
CREATE VIEW budget_utilization_view AS
SELECT 
    b.id as budget_id,
    c.name as college_name,
    d.name as department_name,
    b.category,
    b.fiscal_year,
    b.allocated_amount,
    COALESCE(SUM(CASE WHEN e.status = 'approved' THEN e.amount ELSE 0 END), 0) as spent,
    COALESCE(SUM(CASE WHEN e.status LIKE 'pending%' THEN e.amount ELSE 0 END), 0) as committed,
    b.allocated_amount - COALESCE(SUM(e.amount), 0) as available,
    ROUND((COALESCE(SUM(e.amount), 0) / b.allocated_amount * 100)::numeric, 2) as utilization_percentage
FROM budgets b
JOIN colleges c ON b.college_id = c.id
LEFT JOIN departments d ON b.department_id = d.id
LEFT JOIN expenses e ON e.budget_id = b.id
WHERE b.is_active = true
GROUP BY b.id, c.name, d.name, b.category, b.fiscal_year, b.allocated_amount;

-- Monthly expense summary view
CREATE VIEW monthly_expense_summary AS
SELECT 
    c.name as college_name,
    DATE_TRUNC('month', e.created_at) as month,
    e.category,
    COUNT(*) as transaction_count,
    SUM(e.amount) as total_amount,
    AVG(e.amount) as average_amount
FROM expenses e
JOIN colleges c ON e.college_id = c.id
WHERE e.status = 'approved'
GROUP BY c.name, DATE_TRUNC('month', e.created_at), e.category;

-- ============================================================================
-- 13. SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample colleges
INSERT INTO colleges (name, code, city, state, email, phone) VALUES
('ABC Engineering College', 'ABC', 'Mumbai', 'Maharashtra', 'info@abc.edu', '022-12345678'),
('XYZ Medical College', 'XYZ', 'Pune', 'Maharashtra', 'info@xyz.edu', '020-87654321'),
('LMN Arts College', 'LMN', 'Nagpur', 'Maharashtra', 'info@lmn.edu', '0712-345678');

-- Insert super accountant user
INSERT INTO users (name, email, password, role, mfa_enabled) VALUES
('Rajesh Sharma', 'rajesh.sharma@edubit.com', '$2y$12$hashedpassword', 'super_accountant', true);

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO super_accountant;
GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO college_accounts_admin;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO auditor;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO super_accountant, college_accounts_admin;

-- Performance optimization
ANALYZE;
VACUUM ANALYZE;
