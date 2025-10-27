-- Bitflow Admin Portal - Database Schema
-- Version: 2.0
-- Last Updated: October 25, 2025
-- Scope: Platform-level tables (cross-tenant)

-- ============================================================
-- PLATFORM TABLES
-- ============================================================

-- 1. universities (tenants)
-- Stores all university/institution records managed by Bitflow Owner
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Basic Information
    name VARCHAR(200) NOT NULL UNIQUE,
    domain VARCHAR(255) NOT NULL UNIQUE,
    slug VARCHAR(255) NOT NULL UNIQUE,
    primary_email VARCHAR(255) NOT NULL UNIQUE,
    primary_phone VARCHAR(20) NOT NULL,
    logo_url TEXT,
    
    -- Status & Configuration
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'limited')),
    storage_quota_gb INTEGER NOT NULL DEFAULT 500,
    storage_used_gb NUMERIC(10, 2) NOT NULL DEFAULT 0,
    api_rate_limit INTEGER NOT NULL DEFAULT 10000,
    
    -- Subscription
    subscription_plan VARCHAR(20) NOT NULL DEFAULT 'basic' CHECK (subscription_plan IN ('basic', 'pro', 'enterprise')),
    subscription_status VARCHAR(20) NOT NULL DEFAULT 'trial' CHECK (subscription_status IN ('active', 'past_due', 'canceled', 'trial')),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_activity_at TIMESTAMPTZ
);

CREATE INDEX idx_universities_status ON universities(status);
CREATE INDEX idx_universities_subscription_status ON universities(subscription_status);
CREATE INDEX idx_universities_domain ON universities(domain);
CREATE INDEX idx_universities_slug ON universities(slug);

-- Trigger to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_universities_updated_at BEFORE UPDATE ON universities
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 2. subscriptions
-- Tracks subscription details for each university
CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL UNIQUE REFERENCES universities(id) ON DELETE CASCADE,
    
    plan VARCHAR(20) NOT NULL CHECK (plan IN ('basic', 'pro', 'enterprise')),
    status VARCHAR(20) NOT NULL CHECK (status IN ('active', 'past_due', 'canceled', 'trial')),
    
    -- Pricing
    mrr NUMERIC(10, 2) NOT NULL DEFAULT 0, -- Monthly Recurring Revenue
    
    -- Trial
    trial_ends_at TIMESTAMPTZ,
    
    -- Billing dates
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    next_billing_date DATE,
    
    -- Stripe integration
    stripe_subscription_id VARCHAR(255),
    stripe_customer_id VARCHAR(255),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_university_id ON subscriptions(university_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
CREATE INDEX idx_subscriptions_next_billing_date ON subscriptions(next_billing_date);

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 3. invoices
-- Billing invoices for universities
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    
    -- Amounts
    subtotal NUMERIC(10, 2) NOT NULL,
    tax NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0,
    amount_due NUMERIC(10, 2) NOT NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL CHECK (status IN ('draft', 'open', 'paid', 'void', 'uncollectible')),
    
    -- Dates
    billing_date DATE NOT NULL,
    due_date DATE NOT NULL,
    paid_at TIMESTAMPTZ,
    
    -- Stripe
    stripe_invoice_id VARCHAR(255),
    
    -- Files
    pdf_url TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_invoices_university_id ON invoices(university_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_billing_date ON invoices(billing_date);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 4. payments
-- Payment transactions
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    amount NUMERIC(10, 2) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    
    status VARCHAR(20) NOT NULL CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    
    -- Payment method
    payment_method VARCHAR(50),
    payment_method_type VARCHAR(20), -- card, bank_transfer, etc
    
    -- Stripe
    stripe_payment_intent_id VARCHAR(255),
    stripe_charge_id VARCHAR(255),
    
    -- Failure details
    failure_code VARCHAR(50),
    failure_message TEXT,
    
    -- Refund
    refunded BOOLEAN NOT NULL DEFAULT FALSE,
    refund_reason TEXT,
    refunded_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_payments_invoice_id ON payments(invoice_id);
CREATE INDEX idx_payments_university_id ON payments(university_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_created_at ON payments(created_at);

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 5. global_settings
-- Platform-wide configuration settings
CREATE TABLE global_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    category VARCHAR(50) NOT NULL, -- general, email, sms, payment, storage, security, api
    key VARCHAR(100) NOT NULL,
    value TEXT,
    data_type VARCHAR(20) NOT NULL DEFAULT 'string', -- string, integer, boolean, json
    
    description TEXT,
    is_encrypted BOOLEAN NOT NULL DEFAULT FALSE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(category, key)
);

CREATE INDEX idx_global_settings_category ON global_settings(category);
CREATE INDEX idx_global_settings_key ON global_settings(key);

CREATE TRIGGER update_global_settings_updated_at BEFORE UPDATE ON global_settings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 6. audit_logs
-- Platform-wide audit trail
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- User who performed the action
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    user_email VARCHAR(255),
    user_role VARCHAR(50),
    
    -- Action details
    action VARCHAR(20) NOT NULL CHECK (action IN ('CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT')),
    resource_type VARCHAR(100) NOT NULL, -- University, User, Settings, etc
    resource_id UUID,
    
    -- Changes (JSON)
    changes JSONB,
    
    -- Additional context
    description TEXT,
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource_type ON audit_logs(resource_type);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);
CREATE INDEX idx_audit_logs_ip_address ON audit_logs(ip_address);

-- GIN index for JSONB changes column
CREATE INDEX idx_audit_logs_changes ON audit_logs USING gin(changes);

-- ============================================================

-- 7. support_tickets
-- Support requests from universities
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    ticket_number VARCHAR(50) NOT NULL UNIQUE,
    
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    
    priority VARCHAR(20) NOT NULL CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
    
    -- User tracking
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Dates
    resolved_at TIMESTAMPTZ,
    closed_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_university_id ON support_tickets(university_id);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX idx_support_tickets_created_by ON support_tickets(created_by);
CREATE INDEX idx_support_tickets_assigned_to ON support_tickets(assigned_to);
CREATE INDEX idx_support_tickets_ticket_number ON support_tickets(ticket_number);

CREATE TRIGGER update_support_tickets_updated_at BEFORE UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 8. support_ticket_messages
-- Conversation thread for support tickets
CREATE TABLE support_ticket_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    
    message TEXT NOT NULL,
    
    -- Sender (can be university user or bitflow admin)
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    sender_name VARCHAR(255) NOT NULL,
    sender_role VARCHAR(50) NOT NULL,
    
    -- Attachments
    attachments JSONB, -- [{filename, url, size}]
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_support_ticket_messages_ticket_id ON support_ticket_messages(ticket_id);
CREATE INDEX idx_support_ticket_messages_sender_id ON support_ticket_messages(sender_id);
CREATE INDEX idx_support_ticket_messages_created_at ON support_ticket_messages(created_at);

-- ============================================================

-- 9. system_logs
-- System-level error and debug logs
CREATE TABLE system_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    level VARCHAR(20) NOT NULL CHECK (level IN ('error', 'warning', 'info', 'debug')),
    source VARCHAR(100) NOT NULL, -- api_gateway, database, redis, storage, etc
    
    message TEXT NOT NULL,
    stack_trace TEXT,
    
    -- Context (JSON)
    context JSONB,
    
    -- Request tracking
    request_id UUID,
    university_id UUID REFERENCES universities(id) ON DELETE SET NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_system_logs_level ON system_logs(level);
CREATE INDEX idx_system_logs_source ON system_logs(source);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);
CREATE INDEX idx_system_logs_university_id ON system_logs(university_id);

-- GIN index for context JSONB
CREATE INDEX idx_system_logs_context ON system_logs USING gin(context);

-- Partition by month for performance (optional but recommended)
-- ALTER TABLE system_logs PARTITION BY RANGE (created_at);

-- ============================================================

-- 10. alerts
-- Platform-wide system alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    severity VARCHAR(20) NOT NULL CHECK (severity IN ('info', 'warning', 'error', 'critical')),
    
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    -- Alert type
    alert_type VARCHAR(50) NOT NULL, -- storage_limit, payment_failed, high_error_rate, etc
    
    -- Related resources
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    resource_type VARCHAR(100),
    resource_id UUID,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'acknowledged', 'resolved')),
    
    -- Resolution
    acknowledged_by UUID REFERENCES users(id) ON DELETE SET NULL,
    acknowledged_at TIMESTAMPTZ,
    resolved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    resolved_at TIMESTAMPTZ,
    resolution_notes TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_university_id ON alerts(university_id);
CREATE INDEX idx_alerts_alert_type ON alerts(alert_type);
CREATE INDEX idx_alerts_created_at ON alerts(created_at DESC);

CREATE TRIGGER update_alerts_updated_at BEFORE UPDATE ON alerts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- 11. university_activities
-- Activity feed for universities (for dashboard display)
CREATE TABLE university_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    activity_type VARCHAR(50) NOT NULL, -- enrollment, payment, upgrade, downgrade, issue
    description TEXT NOT NULL,
    
    -- Context
    metadata JSONB,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_university_activities_university_id ON university_activities(university_id);
CREATE INDEX idx_university_activities_activity_type ON university_activities(activity_type);
CREATE INDEX idx_university_activities_created_at ON university_activities(created_at DESC);

-- ============================================================

-- 12. api_logs
-- API request logs for rate limiting and analytics
CREATE TABLE api_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    university_id UUID REFERENCES universities(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Request details
    method VARCHAR(10) NOT NULL,
    path TEXT NOT NULL,
    query_params TEXT,
    
    -- Response
    status_code INTEGER NOT NULL,
    response_time_ms INTEGER NOT NULL,
    
    -- Tracking
    ip_address INET,
    user_agent TEXT,
    request_id UUID,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_api_logs_university_id ON api_logs(university_id);
CREATE INDEX idx_api_logs_created_at ON api_logs(created_at DESC);
CREATE INDEX idx_api_logs_status_code ON api_logs(status_code);
CREATE INDEX idx_api_logs_path ON api_logs(path);

-- Partition by date for performance
-- ALTER TABLE api_logs PARTITION BY RANGE (created_at);

-- ============================================================
-- SAMPLE DATA (for development)
-- ============================================================

-- Insert default global settings
INSERT INTO global_settings (category, key, value, data_type, description) VALUES
('general', 'platform_name', 'Bitflow LMS', 'string', 'Platform display name'),
('general', 'support_email', 'support@bitflow.edu', 'string', 'Support contact email'),
('general', 'support_phone', '+1-800-BITFLOW', 'string', 'Support contact phone'),
('general', 'timezone', 'UTC', 'string', 'Default timezone'),
('general', 'maintenance_mode', 'false', 'boolean', 'Enable maintenance mode'),
('general', 'default_storage_quota_gb', '500', 'integer', 'Default storage quota for new universities'),
('general', 'default_api_rate_limit', '10000', 'integer', 'Default API rate limit (requests/hour)'),
('general', 'trial_period_days', '30', 'integer', 'Trial period duration in days'),

('security', 'password_min_length', '8', 'integer', 'Minimum password length'),
('security', 'password_require_uppercase', 'true', 'boolean', 'Require uppercase letters'),
('security', 'password_require_numbers', 'true', 'boolean', 'Require numbers'),
('security', 'password_require_special', 'true', 'boolean', 'Require special characters'),
('security', 'session_timeout_minutes', '30', 'integer', 'Session inactivity timeout'),
('security', 'max_failed_login_attempts', '5', 'integer', 'Max failed login attempts before lockout'),

('api', 'global_rate_limit', '1000000', 'integer', 'Platform-wide API rate limit'),
('api', 'require_api_key', 'false', 'boolean', 'Require API key for all requests');

-- ============================================================
-- VIEWS (for common queries)
-- ============================================================

-- Active universities summary
CREATE OR REPLACE VIEW v_active_universities AS
SELECT 
    u.id,
    u.name,
    u.domain,
    u.status,
    u.subscription_plan,
    u.storage_used_gb,
    u.storage_quota_gb,
    ROUND((u.storage_used_gb / u.storage_quota_gb * 100)::numeric, 2) as storage_percentage,
    COUNT(DISTINCT us.id) as total_users,
    u.last_activity_at
FROM universities u
LEFT JOIN users us ON us.university_id = u.id
WHERE u.status = 'active'
GROUP BY u.id;

-- Revenue summary
CREATE OR REPLACE VIEW v_revenue_summary AS
SELECT 
    COUNT(*) as total_subscriptions,
    COUNT(*) FILTER (WHERE status = 'active') as active_subscriptions,
    COUNT(*) FILTER (WHERE status = 'past_due') as past_due_subscriptions,
    SUM(mrr) as total_mrr,
    SUM(mrr) FILTER (WHERE plan = 'basic') as basic_mrr,
    SUM(mrr) FILTER (WHERE plan = 'pro') as pro_mrr,
    SUM(mrr) FILTER (WHERE plan = 'enterprise') as enterprise_mrr
FROM subscriptions;

-- ============================================================
-- END OF SCHEMA
-- ============================================================
