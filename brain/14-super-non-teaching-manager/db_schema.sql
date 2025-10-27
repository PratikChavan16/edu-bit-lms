# Super Non-Teaching Manager Portal - Database Schema

**Database**: PostgreSQL 16  
**Extensions**: uuid-ossp, pg_trgm (fuzzy search)

---

## Custom ENUMs

```sql
-- Employee status types
CREATE TYPE employee_status AS ENUM (
    'active',
    'probation',
    'suspended',
    'resigned',
    'terminated'
);

-- Leave types
CREATE TYPE leave_type AS ENUM (
    'casual',
    'sick',
    'earned',
    'loss_of_pay',
    'maternity',
    'paternity',
    'compensatory'
);

-- Separation types
CREATE TYPE separation_type AS ENUM (
    'resignation',
    'termination',
    'retirement',
    'absconding',
    'contract_end'
);

-- Appraisal rating scale
CREATE TYPE appraisal_rating AS ENUM (
    'outstanding',
    'exceeds_expectations',
    'meets_expectations',
    'needs_improvement',
    'unsatisfactory'
);

-- Training types
CREATE TYPE training_type AS ENUM (
    'technical',
    'soft_skills',
    'compliance',
    'safety',
    'leadership'
);

-- Interview types
CREATE TYPE interview_type AS ENUM (
    'phone_screening',
    'technical',
    'hr',
    'final'
);
```

---

## Core Tables

### 1. Employees Table

```sql
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    employee_code VARCHAR(20) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    
    -- Employment details
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE RESTRICT,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    date_of_birth DATE NOT NULL,
    status employee_status DEFAULT 'probation' NOT NULL,
    reporting_to BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    
    -- Compensation (encrypted)
    salary DECIMAL(12, 2) NOT NULL,
    basic_salary DECIMAL(12, 2),
    hra DECIMAL(10, 2),
    da DECIMAL(10, 2),
    other_allowances JSONB DEFAULT '{}',
    
    -- Probation tracking
    probation_end_date DATE,
    permanent_date DATE,
    
    -- Personal details
    gender VARCHAR(20),
    blood_group VARCHAR(5),
    marital_status VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(10),
    
    -- Emergency contact
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relation VARCHAR(50),
    
    -- Bank details (encrypted)
    bank_account_number VARCHAR(50),
    bank_ifsc VARCHAR(20),
    bank_name VARCHAR(100),
    bank_branch VARCHAR(100),
    
    -- Documents
    aadhar_number VARCHAR(12),
    pan_number VARCHAR(10),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT valid_email CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT valid_phone CHECK (phone ~* '^\+?[0-9]{10,15}$'),
    CONSTRAINT positive_salary CHECK (salary > 0),
    CONSTRAINT valid_doj CHECK (date_of_joining <= CURRENT_DATE)
);

-- Indexes for employees
CREATE INDEX idx_employees_college ON employees(college_id);
CREATE INDEX idx_employees_status ON employees(status);
CREATE INDEX idx_employees_designation ON employees(designation);
CREATE INDEX idx_employees_reporting ON employees(reporting_to);
CREATE INDEX idx_employees_email ON employees(email);
CREATE INDEX idx_employees_employee_code ON employees(employee_code);
CREATE INDEX idx_employees_name ON employees(first_name, last_name);
CREATE INDEX idx_employees_active_college ON employees(college_id, status) WHERE status = 'active';

-- Full-text search index
CREATE INDEX idx_employees_search ON employees USING gin(
    to_tsvector('english', first_name || ' ' || last_name || ' ' || employee_code)
);

-- Auto-increment employee_code trigger
CREATE OR REPLACE FUNCTION generate_employee_code()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.employee_code IS NULL THEN
        NEW.employee_code := 'EMP-' || LPAD(nextval('employee_code_seq')::TEXT, 5, '0');
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE employee_code_seq START 1;

CREATE TRIGGER trg_generate_employee_code
BEFORE INSERT ON employees
FOR EACH ROW
EXECUTE FUNCTION generate_employee_code();
```

### 2. Job Requisitions Table

```sql
CREATE TABLE job_requisitions (
    id BIGSERIAL PRIMARY KEY,
    requisition_number VARCHAR(30) UNIQUE NOT NULL,
    college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    
    -- Position details
    position_title VARCHAR(200) NOT NULL,
    department VARCHAR(100) NOT NULL,
    number_of_positions INTEGER NOT NULL DEFAULT 1,
    job_description TEXT NOT NULL,
    required_qualifications TEXT NOT NULL,
    preferred_qualifications TEXT,
    
    -- Compensation
    salary_min DECIMAL(12, 2) NOT NULL,
    salary_max DECIMAL(12, 2) NOT NULL,
    
    -- Workflow
    urgency VARCHAR(20) DEFAULT 'normal' CHECK (urgency IN ('normal', 'urgent', 'critical')),
    status VARCHAR(30) DEFAULT 'draft' CHECK (status IN (
        'draft', 'pending_approval', 'approved', 'rejected', 'filled', 'cancelled'
    )),
    
    -- Approval tracking
    requested_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    approved_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Posting details
    posted_date DATE,
    closing_date DATE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_salary_range CHECK (salary_max >= salary_min),
    CONSTRAINT positive_positions CHECK (number_of_positions > 0),
    CONSTRAINT valid_closing_date CHECK (closing_date IS NULL OR closing_date >= posted_date)
);

CREATE INDEX idx_requisitions_college ON job_requisitions(college_id);
CREATE INDEX idx_requisitions_status ON job_requisitions(status);
CREATE INDEX idx_requisitions_urgency ON job_requisitions(urgency);
CREATE INDEX idx_requisitions_posted_date ON job_requisitions(posted_date);
```

### 3. Job Applications Table

```sql
CREATE TABLE job_applications (
    id BIGSERIAL PRIMARY KEY,
    requisition_id BIGINT NOT NULL REFERENCES job_requisitions(id) ON DELETE CASCADE,
    
    -- Candidate details
    candidate_name VARCHAR(200) NOT NULL,
    candidate_email VARCHAR(255) NOT NULL,
    candidate_phone VARCHAR(20) NOT NULL,
    resume_url TEXT NOT NULL,
    cover_letter TEXT,
    
    -- Application tracking
    application_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(30) DEFAULT 'received' CHECK (status IN (
        'received', 'screening', 'shortlisted', 'interview_scheduled',
        'interviewed', 'selected', 'rejected', 'offer_sent', 'offer_accepted', 'joined'
    )),
    
    -- Screening
    screening_score INTEGER CHECK (screening_score BETWEEN 0 AND 100),
    screening_notes TEXT,
    screened_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    screened_at TIMESTAMP,
    
    -- Interview
    interview_scheduled_at TIMESTAMP,
    interview_feedback TEXT,
    interviewed_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    
    -- Offer
    offer_sent_at TIMESTAMP,
    offer_accepted_at TIMESTAMP,
    offered_salary DECIMAL(12, 2),
    joining_date DATE,
    
    -- Rejection
    rejection_reason TEXT,
    rejected_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_requisition ON job_applications(requisition_id);
CREATE INDEX idx_applications_status ON job_applications(status);
CREATE INDEX idx_applications_email ON job_applications(candidate_email);
CREATE INDEX idx_applications_date ON job_applications(application_date);
```

### 4. Attendance Records Table

```sql
CREATE TABLE attendance_records (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    
    -- Punch times
    punch_in TIMESTAMP,
    punch_out TIMESTAMP,
    
    -- Calculated fields
    work_hours DECIMAL(5, 2) GENERATED ALWAYS AS (
        CASE 
            WHEN punch_in IS NOT NULL AND punch_out IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (punch_out - punch_in)) / 3600
            ELSE NULL 
        END
    ) STORED,
    late_minutes INTEGER DEFAULT 0,
    overtime_hours DECIMAL(5, 2) DEFAULT 0,
    
    -- Status
    status VARCHAR(20) DEFAULT 'present' CHECK (status IN (
        'present', 'absent', 'late', 'half_day', 'on_leave', 'holiday', 'week_off'
    )),
    
    -- Biometric integration
    device_id VARCHAR(50),
    biometric_data BYTEA, -- Encrypted fingerprint/face template
    
    -- Regularization
    regularized BOOLEAN DEFAULT FALSE,
    regularization_reason TEXT,
    regularization_approved_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    regularization_approved_at TIMESTAMP,
    
    -- Shift details
    shift_start TIME DEFAULT '09:00:00',
    shift_end TIME DEFAULT '18:00:00',
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_employee_date UNIQUE (employee_id, attendance_date),
    CONSTRAINT valid_punch_sequence CHECK (punch_out IS NULL OR punch_out > punch_in),
    CONSTRAINT valid_attendance_date CHECK (attendance_date <= CURRENT_DATE)
);

CREATE INDEX idx_attendance_employee ON attendance_records(employee_id);
CREATE INDEX idx_attendance_date ON attendance_records(attendance_date);
CREATE INDEX idx_attendance_status ON attendance_records(status);
CREATE INDEX idx_attendance_employee_date ON attendance_records(employee_id, attendance_date);
CREATE INDEX idx_attendance_late ON attendance_records(late_minutes) WHERE late_minutes > 15;
CREATE INDEX idx_attendance_device ON attendance_records(device_id);

-- Trigger to calculate late minutes
CREATE OR REPLACE FUNCTION calculate_late_minutes()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.punch_in IS NOT NULL THEN
        NEW.late_minutes := GREATEST(
            0,
            EXTRACT(EPOCH FROM (NEW.punch_in::TIME - NEW.shift_start)) / 60
        )::INTEGER;
        
        IF NEW.late_minutes > 15 THEN
            NEW.status := 'late';
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_late_minutes
BEFORE INSERT OR UPDATE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION calculate_late_minutes();

-- Trigger to calculate overtime
CREATE OR REPLACE FUNCTION calculate_overtime()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.work_hours IS NOT NULL AND NEW.work_hours > 9 THEN
        NEW.overtime_hours := NEW.work_hours - 9;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_calculate_overtime
BEFORE INSERT OR UPDATE ON attendance_records
FOR EACH ROW
EXECUTE FUNCTION calculate_overtime();
```

### 5. Leave Applications Table

```sql
CREATE TABLE leave_applications (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Leave details
    leave_type leave_type NOT NULL,
    from_date DATE NOT NULL,
    to_date DATE NOT NULL,
    number_of_days DECIMAL(3, 1) NOT NULL,
    reason TEXT NOT NULL,
    supporting_document_url TEXT,
    
    -- Workflow
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'cancelled'
    )),
    
    -- Approval chain
    approved_by BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    
    -- Application tracking
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP,
    cancellation_reason TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_date_range CHECK (to_date >= from_date),
    CONSTRAINT positive_days CHECK (number_of_days > 0),
    CONSTRAINT valid_number_of_days CHECK (
        number_of_days = (to_date - from_date + 1)
    )
);

CREATE INDEX idx_leave_employee ON leave_applications(employee_id);
CREATE INDEX idx_leave_status ON leave_applications(status);
CREATE INDEX idx_leave_date_range ON leave_applications(from_date, to_date);
CREATE INDEX idx_leave_type ON leave_applications(leave_type);
CREATE INDEX idx_leave_pending ON leave_applications(status) WHERE status = 'pending';
```

### 6. Leave Balances Table

```sql
CREATE TABLE leave_balances (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    financial_year INTEGER NOT NULL,
    
    -- Leave quotas
    casual_leave DECIMAL(4, 1) DEFAULT 12.0,
    sick_leave DECIMAL(4, 1) DEFAULT 10.0,
    earned_leave DECIMAL(4, 1) DEFAULT 20.0,
    loss_of_pay DECIMAL(4, 1) DEFAULT 0.0,
    
    -- Carry forward
    casual_leave_cf DECIMAL(4, 1) DEFAULT 0.0,
    sick_leave_cf DECIMAL(4, 1) DEFAULT 0.0,
    earned_leave_cf DECIMAL(4, 1) DEFAULT 0.0,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_employee_year UNIQUE (employee_id, financial_year),
    CONSTRAINT non_negative_leave CHECK (
        casual_leave >= 0 AND sick_leave >= 0 AND 
        earned_leave >= 0 AND loss_of_pay >= 0
    )
);

CREATE INDEX idx_leave_balance_employee ON leave_balances(employee_id);
CREATE INDEX idx_leave_balance_year ON leave_balances(financial_year);

-- Trigger to deduct leave balance on approval
CREATE OR REPLACE FUNCTION deduct_leave_balance()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'approved' AND OLD.status != 'approved' THEN
        UPDATE leave_balances
        SET
            casual_leave = CASE WHEN NEW.leave_type = 'casual' 
                THEN casual_leave - NEW.number_of_days ELSE casual_leave END,
            sick_leave = CASE WHEN NEW.leave_type = 'sick' 
                THEN sick_leave - NEW.number_of_days ELSE sick_leave END,
            earned_leave = CASE WHEN NEW.leave_type = 'earned' 
                THEN earned_leave - NEW.number_of_days ELSE earned_leave END,
            loss_of_pay = CASE WHEN NEW.leave_type = 'loss_of_pay' 
                THEN loss_of_pay + NEW.number_of_days ELSE loss_of_pay END
        WHERE employee_id = NEW.employee_id 
        AND financial_year = EXTRACT(YEAR FROM NEW.from_date);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_deduct_leave_balance
AFTER UPDATE ON leave_applications
FOR EACH ROW
EXECUTE FUNCTION deduct_leave_balance();
```

### 7. Appraisals Table

```sql
CREATE TABLE appraisals (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    appraisal_year INTEGER NOT NULL,
    
    -- Self-assessment
    goals JSONB DEFAULT '[]',
    self_rating DECIMAL(2, 1) CHECK (self_rating BETWEEN 1 AND 5),
    self_comments TEXT,
    
    -- Manager evaluation
    manager_rating DECIMAL(2, 1) CHECK (manager_rating BETWEEN 1 AND 5),
    manager_comments TEXT,
    
    -- Final rating
    overall_rating appraisal_rating,
    normalized_score DECIMAL(3, 1), -- 0-100 scale
    
    -- Status
    status VARCHAR(30) DEFAULT 'not_started' CHECK (status IN (
        'not_started', 'self_assessment_pending', 'pending_manager_review',
        'completed', 'acknowledged'
    )),
    
    -- Timestamps
    self_submitted_at TIMESTAMP,
    manager_submitted_at TIMESTAMP,
    acknowledged_at TIMESTAMP,
    
    -- Recommendations
    promotion_recommended BOOLEAN DEFAULT FALSE,
    training_recommendations TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_employee_year UNIQUE (employee_id, appraisal_year)
);

CREATE INDEX idx_appraisals_employee ON appraisals(employee_id);
CREATE INDEX idx_appraisals_year ON appraisals(appraisal_year);
CREATE INDEX idx_appraisals_status ON appraisals(status);
CREATE INDEX idx_appraisals_rating ON appraisals(overall_rating);
```

### 8. Training Programs Table

```sql
CREATE TABLE training_programs (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    
    -- Trainer details
    trainer_name VARCHAR(100) NOT NULL,
    trainer_organization VARCHAR(200),
    
    -- Schedule
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    venue VARCHAR(200),
    
    -- Capacity
    capacity INTEGER NOT NULL,
    enrolled_count INTEGER DEFAULT 0,
    
    -- Type
    training_type training_type NOT NULL,
    
    -- Target audience
    target_designations TEXT[], -- Array of designations
    target_colleges BIGINT[], -- Array of college IDs
    
    -- Materials
    materials_url TEXT,
    certificate_template_url TEXT,
    
    -- Status
    status VARCHAR(30) DEFAULT 'planned' CHECK (status IN (
        'planned', 'registration_open', 'in_progress', 'completed', 'cancelled'
    )),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_date_range CHECK (end_date >= start_date),
    CONSTRAINT positive_capacity CHECK (capacity > 0),
    CONSTRAINT enrolled_within_capacity CHECK (enrolled_count <= capacity)
);

CREATE INDEX idx_training_dates ON training_programs(start_date, end_date);
CREATE INDEX idx_training_type ON training_programs(training_type);
CREATE INDEX idx_training_status ON training_programs(status);
```

### 9. Training Enrollments Table

```sql
CREATE TABLE training_enrollments (
    id BIGSERIAL PRIMARY KEY,
    training_program_id BIGINT NOT NULL REFERENCES training_programs(id) ON DELETE CASCADE,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Enrollment
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    enrollment_status VARCHAR(30) DEFAULT 'enrolled' CHECK (enrollment_status IN (
        'enrolled', 'attended', 'completed', 'cancelled', 'no_show'
    )),
    
    -- Attendance
    attendance_percentage DECIMAL(5, 2),
    
    -- Completion
    completion_status VARCHAR(30) CHECK (completion_status IN (
        'in_progress', 'completed', 'failed'
    )),
    completed_at TIMESTAMP,
    certificate_issued BOOLEAN DEFAULT FALSE,
    certificate_url TEXT,
    
    -- Feedback
    feedback_rating DECIMAL(2, 1) CHECK (feedback_rating BETWEEN 1 AND 5),
    feedback_comments TEXT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT unique_enrollment UNIQUE (training_program_id, employee_id)
);

CREATE INDEX idx_enrollments_program ON training_enrollments(training_program_id);
CREATE INDEX idx_enrollments_employee ON training_enrollments(employee_id);
CREATE INDEX idx_enrollments_status ON training_enrollments(enrollment_status);

-- Trigger to update enrolled_count
CREATE OR REPLACE FUNCTION update_enrollment_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE training_programs
        SET enrolled_count = enrolled_count + 1
        WHERE id = NEW.training_program_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE training_programs
        SET enrolled_count = enrolled_count - 1
        WHERE id = OLD.training_program_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_enrollment_count
AFTER INSERT OR DELETE ON training_enrollments
FOR EACH ROW
EXECUTE FUNCTION update_enrollment_count();
```

### 10. Transfers Table

```sql
CREATE TABLE transfers (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Transfer details
    from_college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE RESTRICT,
    to_college_id BIGINT NOT NULL REFERENCES colleges(id) ON DELETE RESTRICT,
    transfer_date DATE NOT NULL,
    effective_date DATE NOT NULL,
    reason TEXT NOT NULL,
    
    -- Workflow
    status VARCHAR(30) DEFAULT 'pending' CHECK (status IN (
        'pending', 'approved', 'rejected', 'completed', 'cancelled'
    )),
    
    -- Approvals
    from_college_approved BOOLEAN DEFAULT FALSE,
    to_college_approved BOOLEAN DEFAULT FALSE,
    hr_approved BOOLEAN DEFAULT FALSE,
    approved_at TIMESTAMP,
    
    -- Rejection
    rejection_reason TEXT,
    rejected_at TIMESTAMP,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT different_colleges CHECK (from_college_id != to_college_id),
    CONSTRAINT valid_effective_date CHECK (effective_date >= transfer_date)
);

CREATE INDEX idx_transfers_employee ON transfers(employee_id);
CREATE INDEX idx_transfers_from_college ON transfers(from_college_id);
CREATE INDEX idx_transfers_to_college ON transfers(to_college_id);
CREATE INDEX idx_transfers_status ON transfers(status);
CREATE INDEX idx_transfers_effective_date ON transfers(effective_date);
```

### 11. Separations Table

```sql
CREATE TABLE separations (
    id BIGSERIAL PRIMARY KEY,
    employee_id BIGINT NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
    
    -- Separation details
    separation_type separation_type NOT NULL,
    resignation_date DATE,
    last_working_day DATE NOT NULL,
    reason TEXT NOT NULL,
    
    -- Notice period
    notice_period_days INTEGER,
    notice_waived BOOLEAN DEFAULT FALSE,
    
    -- Exit process
    exit_interview_completed BOOLEAN DEFAULT FALSE,
    exit_interview_notes TEXT,
    handover_completed BOOLEAN DEFAULT FALSE,
    
    -- Clearance (JSONB for multiple departments)
    clearance_status JSONB DEFAULT '{}', -- {dept: approved/pending}
    clearance_completed BOOLEAN DEFAULT FALSE,
    
    -- Final settlement
    full_and_final_amount DECIMAL(12, 2),
    full_and_final_paid BOOLEAN DEFAULT FALSE,
    full_and_final_paid_at TIMESTAMP,
    
    -- Documents
    clearance_certificate_issued BOOLEAN DEFAULT FALSE,
    experience_letter_issued BOOLEAN DEFAULT FALSE,
    
    -- Status
    status VARCHAR(30) DEFAULT 'initiated' CHECK (status IN (
        'initiated', 'in_progress', 'completed', 'cancelled'
    )),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_lwdCHECK (last_working_day >= resignation_date),
    CONSTRAINT positive_notice CHECK (notice_period_days IS NULL OR notice_period_days >= 0)
);

CREATE INDEX idx_separations_employee ON separations(employee_id);
CREATE INDEX idx_separations_type ON separations(separation_type);
CREATE INDEX idx_separations_lwd ON separations(last_working_day);
CREATE INDEX idx_separations_status ON separations(status);
```

---

## Materialized Views

### 1. Attendance Summary View

```sql
CREATE MATERIALIZED VIEW vw_attendance_summary AS
SELECT 
    e.id AS employee_id,
    e.employee_code,
    e.first_name || ' ' || e.last_name AS employee_name,
    e.college_id,
    DATE_TRUNC('month', ar.attendance_date) AS month,
    COUNT(*) FILTER (WHERE ar.status = 'present') AS present_days,
    COUNT(*) FILTER (WHERE ar.status = 'absent') AS absent_days,
    COUNT(*) FILTER (WHERE ar.status = 'late') AS late_days,
    COUNT(*) FILTER (WHERE ar.status = 'half_day') AS half_days,
    COUNT(*) FILTER (WHERE ar.status = 'on_leave') AS leave_days,
    ROUND(
        (COUNT(*) FILTER (WHERE ar.status IN ('present', 'late'))::DECIMAL / 
        NULLIF(COUNT(*) FILTER (WHERE ar.status NOT IN ('holiday', 'week_off')), 0)) * 100,
        2
    ) AS attendance_percentage,
    SUM(ar.overtime_hours) AS total_overtime_hours
FROM employees e
JOIN attendance_records ar ON e.id = ar.employee_id
WHERE e.deleted_at IS NULL
GROUP BY e.id, e.employee_code, e.first_name, e.last_name, e.college_id, DATE_TRUNC('month', ar.attendance_date);

CREATE INDEX idx_vw_attendance_employee ON vw_attendance_summary(employee_id);
CREATE INDEX idx_vw_attendance_month ON vw_attendance_summary(month);
CREATE INDEX idx_vw_attendance_college ON vw_attendance_summary(college_id);

-- Refresh daily
CREATE OR REPLACE FUNCTION refresh_attendance_summary()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY vw_attendance_summary;
END;
$$ LANGUAGE plpgsql;
```

### 2. Attrition Metrics View

```sql
CREATE MATERIALIZED VIEW vw_attrition_metrics AS
SELECT 
    DATE_TRUNC('month', s.last_working_day) AS month,
    e.college_id,
    e.designation,
    COUNT(*) AS separations_count,
    s.separation_type,
    ROUND(
        (COUNT(*)::DECIMAL / 
        (SELECT COUNT(*) FROM employees WHERE college_id = e.college_id AND status = 'active')) * 100,
        2
    ) AS attrition_rate
FROM separations s
JOIN employees e ON s.employee_id = e.id
WHERE s.status = 'completed'
GROUP BY DATE_TRUNC('month', s.last_working_day), e.college_id, e.designation, s.separation_type;

CREATE INDEX idx_vw_attrition_month ON vw_attrition_metrics(month);
CREATE INDEX idx_vw_attrition_college ON vw_attrition_metrics(college_id);
```

---

## Custom Functions

### Calculate Years of Service

```sql
CREATE OR REPLACE FUNCTION calculate_years_of_service(emp_id BIGINT)
RETURNS DECIMAL AS $$
DECLARE
    doj DATE;
    years_service DECIMAL;
BEGIN
    SELECT date_of_joining INTO doj FROM employees WHERE id = emp_id;
    years_service := EXTRACT(YEAR FROM AGE(CURRENT_DATE, doj)) +
                     (EXTRACT(MONTH FROM AGE(CURRENT_DATE, doj)) / 12.0);
    RETURN ROUND(years_service, 2);
END;
$$ LANGUAGE plpgsql;
```

---

*Complete PostgreSQL 16 schema for Super Non-Teaching Manager Portal with 11 core tables, ENUMs, triggers, materialized views, and functions.*
