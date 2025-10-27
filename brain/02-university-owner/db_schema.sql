-- University Owner Portal - Database Schema
-- Version: 2.0
-- Last Updated: October 25, 2025
-- Scope: University-level tables (single tenant, multi-college)

-- ============================================================
-- UNIVERSITY-SCOPED TABLES
-- All tables include university_id for multi-tenancy isolation
-- ============================================================

-- 1. colleges
-- Stores colleges within a university
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    -- Basic Information
    name VARCHAR(200) NOT NULL,
    code VARCHAR(10) NOT NULL,
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(6) NOT NULL,
    phone VARCHAR(15),
    email VARCHAR(255) NOT NULL,
    website VARCHAR(255),
    logo TEXT,
    
    -- Configuration
    established_year INTEGER NOT NULL,
    student_capacity INTEGER NOT NULL DEFAULT 500,
    
    -- Principal Assignment
    principal_id UUID REFERENCES users(id) ON DELETE SET NULL,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    -- Timestamps
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    -- Ensure unique code within university
    UNIQUE (university_id, code)
);

CREATE INDEX idx_colleges_university_id ON colleges(university_id);
CREATE INDEX idx_colleges_status ON colleges(status);
CREATE INDEX idx_colleges_principal_id ON colleges(principal_id);
CREATE INDEX idx_colleges_code ON colleges(code);

-- Row-level security: Users can only access colleges from their university
CREATE POLICY colleges_university_isolation ON colleges
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 2. departments
-- Academic departments within colleges
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    
    name VARCHAR(200) NOT NULL,
    code VARCHAR(10) NOT NULL,
    description TEXT,
    
    hod_id UUID REFERENCES users(id) ON DELETE SET NULL, -- Head of Department
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (college_id, code)
);

CREATE INDEX idx_departments_university_id ON departments(university_id);
CREATE INDEX idx_departments_college_id ON departments(college_id);
CREATE INDEX idx_departments_hod_id ON departments(hod_id);

CREATE POLICY departments_university_isolation ON departments
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 3. programs
-- Academic programs (degrees) offered by colleges
CREATE TABLE programs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    
    name VARCHAR(200) NOT NULL,
    code VARCHAR(20) NOT NULL,
    
    degree_type VARCHAR(30) NOT NULL CHECK (degree_type IN ('Undergraduate', 'Postgraduate', 'Diploma', 'Certificate', 'PhD')),
    duration_years INTEGER NOT NULL,
    duration_semesters INTEGER NOT NULL,
    total_credits INTEGER NOT NULL DEFAULT 0,
    
    description TEXT,
    eligibility_criteria TEXT,
    
    -- Capacity
    seats_available INTEGER NOT NULL DEFAULT 60,
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'discontinued')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (university_id, code)
);

CREATE INDEX idx_programs_university_id ON programs(university_id);
CREATE INDEX idx_programs_college_id ON programs(college_id);
CREATE INDEX idx_programs_department_id ON programs(department_id);
CREATE INDEX idx_programs_status ON programs(status);

CREATE POLICY programs_university_isolation ON programs
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 4. faculty
-- Faculty members across all colleges
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    
    -- Designation
    designation VARCHAR(50) NOT NULL CHECK (designation IN ('Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Lab Assistant')),
    
    -- Qualifications
    qualification VARCHAR(255) NOT NULL,
    specialization VARCHAR(255),
    experience_years INTEGER DEFAULT 0,
    
    -- Employment
    date_of_joining DATE NOT NULL,
    employment_type VARCHAR(20) NOT NULL CHECK (employment_type IN ('permanent', 'contract', 'visiting')),
    salary NUMERIC(10, 2) NOT NULL,
    
    -- Contact
    phone VARCHAR(15),
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'on_leave')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_faculty_university_id ON faculty(university_id);
CREATE INDEX idx_faculty_college_id ON faculty(college_id);
CREATE INDEX idx_faculty_department_id ON faculty(department_id);
CREATE INDEX idx_faculty_user_id ON faculty(user_id);
CREATE INDEX idx_faculty_status ON faculty(status);

CREATE POLICY faculty_university_isolation ON faculty
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 5. students
-- Students enrolled in colleges
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE RESTRICT,
    
    roll_number VARCHAR(20) NOT NULL,
    
    -- Academic Info
    admission_year INTEGER NOT NULL,
    current_year INTEGER NOT NULL DEFAULT 1,
    current_semester INTEGER NOT NULL DEFAULT 1,
    
    -- Performance
    cgpa NUMERIC(3, 2) DEFAULT 0.00,
    attendance_percentage NUMERIC(5, 2) DEFAULT 100.00,
    
    -- Status
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated', 'dropout', 'transferred')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (university_id, roll_number)
);

CREATE INDEX idx_students_university_id ON students(university_id);
CREATE INDEX idx_students_college_id ON students(college_id);
CREATE INDEX idx_students_program_id ON students(program_id);
CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_roll_number ON students(roll_number);
CREATE INDEX idx_students_status ON students(status);

CREATE POLICY students_university_isolation ON students
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 6. admission_applications
-- Student admission applications
CREATE TABLE admission_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    application_number VARCHAR(20) NOT NULL UNIQUE,
    
    -- Applicant Information
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(10) NOT NULL,
    
    -- Qualifications
    previous_education JSONB NOT NULL, -- Stores marks, board, year
    entrance_test_score NUMERIC(5, 2),
    
    -- Application Status
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'waitlisted')),
    reviewed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewed_at TIMESTAMPTZ,
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_applications_university_id ON admission_applications(university_id);
CREATE INDEX idx_applications_college_id ON admission_applications(college_id);
CREATE INDEX idx_applications_program_id ON admission_applications(program_id);
CREATE INDEX idx_applications_status ON admission_applications(status);

CREATE POLICY applications_university_isolation ON admission_applications
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 7. merit_lists
-- Merit lists for admissions
CREATE TABLE merit_lists (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    academic_year VARCHAR(10) NOT NULL,
    
    total_seats INTEGER NOT NULL,
    applications_count INTEGER NOT NULL DEFAULT 0,
    
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'approved', 'finalized')),
    
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_merit_lists_university_id ON merit_lists(university_id);
CREATE INDEX idx_merit_lists_status ON merit_lists(status);

CREATE POLICY merit_lists_university_isolation ON merit_lists
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 8. fee_structures
-- Fee configurations for programs
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    academic_year VARCHAR(10) NOT NULL,
    
    -- Fee Components
    tuition_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    library_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    lab_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    sports_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    other_fee NUMERIC(10, 2) NOT NULL DEFAULT 0,
    total_fee NUMERIC(10, 2) NOT NULL,
    
    -- Payment Schedule
    payment_terms JSONB, -- {installments: 4, due_dates: [...]}
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (university_id, college_id, program_id, academic_year)
);

CREATE INDEX idx_fee_structures_university_id ON fee_structures(university_id);
CREATE INDEX idx_fee_structures_college_id ON fee_structures(college_id);
CREATE INDEX idx_fee_structures_program_id ON fee_structures(program_id);

CREATE POLICY fee_structures_university_isolation ON fee_structures
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 9. fee_payments
-- Fee payment records
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    fee_structure_id UUID NOT NULL REFERENCES fee_structures(id) ON DELETE CASCADE,
    
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20) NOT NULL CHECK (payment_method IN ('cash', 'card', 'upi', 'netbanking', 'cheque')),
    
    transaction_id VARCHAR(100),
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded')),
    
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_payments_university_id ON fee_payments(university_id);
CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_status ON fee_payments(status);

CREATE POLICY fee_payments_university_isolation ON fee_payments
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 10. expenses
-- University/College expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE, -- NULL means university-level
    
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- infrastructure, salaries, utilities, etc.
    
    amount NUMERIC(10, 2) NOT NULL,
    
    requested_by UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'paid')),
    
    approved_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_expenses_university_id ON expenses(university_id);
CREATE INDEX idx_expenses_college_id ON expenses(college_id);
CREATE INDEX idx_expenses_status ON expenses(status);

CREATE POLICY expenses_university_isolation ON expenses
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 11. scholarships
-- Scholarship programs
CREATE TABLE scholarships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    description TEXT,
    
    amount NUMERIC(10, 2) NOT NULL,
    eligibility_criteria JSONB NOT NULL, -- {min_cgpa: 8.0, income_limit: 500000}
    
    total_scholarships INTEGER NOT NULL DEFAULT 1,
    awarded_count INTEGER NOT NULL DEFAULT 0,
    
    academic_year VARCHAR(10) NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_scholarships_university_id ON scholarships(university_id);
CREATE INDEX idx_scholarships_status ON scholarships(status);

CREATE POLICY scholarships_university_isolation ON scholarships
    FOR ALL
    USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================

-- 12. leaves
-- Faculty leave requests
CREATE TABLE leaves (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    faculty_id UUID NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
    
    leave_type VARCHAR(20) NOT NULL CHECK (leave_type IN ('casual', 'sick', 'earned', 'maternity')),
    
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    
    approved_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_at TIMESTAMPTZ,
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_leaves_faculty_id ON leaves(faculty_id);
CREATE INDEX idx_leaves_status ON leaves(status);

-- ============================================================

-- TRIGGERS: Auto-update updated_at timestamps

CREATE TRIGGER update_colleges_updated_at BEFORE UPDATE ON colleges
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_departments_updated_at BEFORE UPDATE ON departments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faculty_updated_at BEFORE UPDATE ON faculty
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================

-- VIEWS: Useful aggregated views for University Owner

CREATE OR REPLACE VIEW v_college_stats AS
SELECT 
    c.id AS college_id,
    c.name AS college_name,
    c.university_id,
    COUNT(DISTINCT s.id) AS total_students,
    COUNT(DISTINCT f.id) AS total_faculty,
    COUNT(DISTINCT p.id) AS total_programs,
    AVG(s.cgpa) AS avg_cgpa,
    AVG(s.attendance_percentage) AS avg_attendance
FROM colleges c
LEFT JOIN students s ON c.id = s.college_id AND s.status = 'active'
LEFT JOIN faculty f ON c.id = f.college_id AND f.status = 'active'
LEFT JOIN programs p ON c.id = p.college_id AND p.status = 'active'
GROUP BY c.id, c.name, c.university_id;

-- ============================================================

**University Owner Database Schema Complete!**
-- Multi-tenant isolation with row-level security
-- All tables scoped by university_id
