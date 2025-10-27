-- ============================================================================
-- BITFLOW LMS - MASTER DATABASE SCHEMA
-- ============================================================================
-- Version: 2.0
-- Database: PostgreSQL 16+
-- Encoding: UTF8
-- Timezone: UTC
-- Multi-Tenancy: Row-level with university_id
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For full-text search

-- ============================================================================
-- SECTION 1: IDENTITY & ACCESS MANAGEMENT (6 TABLES)
-- ============================================================================

-- 1.1 Users (Master table for all user types)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,  -- Multi-tenant key
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,  -- Bcrypt, cost 12
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED,
    phone VARCHAR(20),
    photo_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended', 'deleted')),
    email_verified_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    password_changed_at TIMESTAMPTZ,
    two_factor_secret VARCHAR(255),
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,  -- Soft delete
    CONSTRAINT users_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_users_university ON users(university_id, id);
CREATE INDEX idx_users_email ON users(email) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_username ON users(username) WHERE deleted_at IS NULL;
CREATE INDEX idx_users_status ON users(status) WHERE status = 'active';

-- 1.2 Roles
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    level INTEGER NOT NULL,  -- Hierarchy level (1=highest)
    scope VARCHAR(20) NOT NULL CHECK (scope IN ('global', 'university', 'college', 'department', 'individual')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_roles_slug ON roles(slug);
CREATE INDEX idx_roles_level ON roles(level);

-- Insert default roles
INSERT INTO roles (name, slug, level, scope) VALUES
('Bitflow Owner', 'bitflow_owner', 1, 'global'),
('University Owner', 'university_owner', 2, 'university'),
('Super Admin', 'super_admin', 3, 'university'),
('Principal', 'principal', 4, 'college'),
('College Admin', 'college_admin', 4, 'college'),
('Super Academics', 'super_academics', 3, 'university'),
('Faculty', 'faculty', 5, 'department'),
('Student', 'student', 6, 'college'),
('Parent', 'parent', 7, 'individual'),
('Admission Admin', 'admission_admin', 4, 'college'),
('Super Accountant', 'super_accountant', 3, 'university'),
('College Accounts Admin', 'college_accounts_admin', 4, 'college'),
('College Fee Admin', 'college_fee_admin', 5, 'college'),
('Super Non-Teaching Manager', 'super_nt_manager', 3, 'university');

-- 1.3 Permissions
CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    resource VARCHAR(100) NOT NULL,  -- e.g., 'students', 'grades', 'fees'
    action VARCHAR(50) NOT NULL,  -- e.g., 'create', 'read', 'update', 'delete'
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_permissions_slug ON permissions(slug);
CREATE INDEX idx_permissions_resource ON permissions(resource);

-- 1.4 Role-User Mapping (Many-to-Many)
CREATE TABLE role_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    role_id UUID NOT NULL,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    assigned_by UUID,  -- User who assigned the role
    expires_at TIMESTAMPTZ,  -- Optional: temporary role assignment
    CONSTRAINT ru_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ru_role_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT ru_assigned_by_fk FOREIGN KEY (assigned_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(user_id, role_id)
);

CREATE INDEX idx_role_user_user ON role_user(user_id);
CREATE INDEX idx_role_user_role ON role_user(role_id);

-- 1.5 Role-Permission Mapping (Many-to-Many)
CREATE TABLE role_permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL,
    permission_id UUID NOT NULL,
    granted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT rp_role_fk FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT rp_permission_fk FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE,
    UNIQUE(role_id, permission_id)
);

CREATE INDEX idx_role_permissions_role ON role_permissions(role_id);
CREATE INDEX idx_role_permissions_permission ON role_permissions(permission_id);

-- 1.6 Sessions (For refresh tokens)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL,
    refresh_token UUID UNIQUE NOT NULL DEFAULT uuid_generate_v4(),
    access_token_jti VARCHAR(255),  -- JWT ID for blacklisting
    ip_address INET,
    user_agent TEXT,
    last_activity_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT sessions_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_refresh_token ON sessions(refresh_token);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);

-- ============================================================================
-- SECTION 2: UNIVERSITY & ORGANIZATIONAL STRUCTURE (5 TABLES)
-- ============================================================================

-- 2.1 Universities (Single row per deployment in this architecture)
CREATE TABLE universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    domain VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    address TEXT,
    established_year INTEGER,
    timezone VARCHAR(50) DEFAULT 'UTC',
    status VARCHAR(20) NOT NULL DEFAULT 'live' CHECK (status IN ('setup', 'live', 'suspended', 'archived')),
    storage_quota_gb INTEGER NOT NULL DEFAULT 1000,
    storage_used_mb BIGINT NOT NULL DEFAULT 0,
    branding JSONB,  -- {primary_color, logo_url, favicon_url}
    settings JSONB,  -- Feature flags, configurations
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_universities_slug ON universities(slug);
CREATE INDEX idx_universities_status ON universities(status);

-- 2.2 Colleges (Multiple per university)
CREATE TABLE colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,  -- e.g., 'ENG' for Engineering
    type VARCHAR(50),  -- e.g., 'Engineering', 'Medical', 'Arts'
    email VARCHAR(255),
    phone VARCHAR(20),
    address TEXT,
    established_year INTEGER,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    capacity INTEGER,  -- Max student capacity
    current_enrollment INTEGER DEFAULT 0,
    accreditation JSONB,  -- {body, valid_until, certificate_url}
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT colleges_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    UNIQUE(university_id, code)
);

CREATE INDEX idx_colleges_university ON colleges(university_id, id);
CREATE INDEX idx_colleges_status ON colleges(university_id, status);

-- 2.3 Departments (Multiple per college)
CREATE TABLE departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,  -- e.g., 'CSE' for Computer Science
    head_faculty_id UUID,  -- Department head (nullable initially)
    email VARCHAR(255),
    phone VARCHAR(20),
    floor_location VARCHAR(100),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT departments_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT departments_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    UNIQUE(college_id, code)
);

CREATE INDEX idx_departments_university ON departments(university_id, id);
CREATE INDEX idx_departments_college ON departments(college_id);

-- 2.4 Courses (Master course catalog)
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    department_id UUID NOT NULL,
    code VARCHAR(50) NOT NULL,  -- e.g., 'CS101'
    name VARCHAR(255) NOT NULL,
    description TEXT,
    credits INTEGER NOT NULL,
    level VARCHAR(50),  -- e.g., 'undergraduate', 'postgraduate'
    semester VARCHAR(20),  -- e.g., 'Fall', 'Spring', 'Both'
    prerequisites JSONB,  -- Array of course IDs
    syllabus_url TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT courses_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT courses_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT courses_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    UNIQUE(department_id, code)
);

CREATE INDEX idx_courses_university ON courses(university_id, id);
CREATE INDEX idx_courses_college ON courses(college_id);
CREATE INDEX idx_courses_department ON courses(department_id);
CREATE INDEX idx_courses_code ON courses(code);

-- 2.5 Academic Years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,  -- e.g., '2025-2026'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    is_current BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT academic_years_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    UNIQUE(university_id, name)
);

CREATE INDEX idx_academic_years_university ON academic_years(university_id, id);
CREATE INDEX idx_academic_years_current ON academic_years(university_id, is_current) WHERE is_current = TRUE;

-- ============================================================================
-- SECTION 3: ACADEMIC MANAGEMENT (8 TABLES)
-- ============================================================================

-- 3.1 Students (Inherits from users)
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    department_id UUID,
    admission_number VARCHAR(50) UNIQUE NOT NULL,
    admission_date DATE NOT NULL,
    course VARCHAR(100),  -- e.g., 'B.Tech Computer Science'
    year INTEGER CHECK (year BETWEEN 1 AND 6),
    section VARCHAR(10),
    roll_number VARCHAR(50),
    blood_group VARCHAR(5),
    date_of_birth DATE,
    gender VARCHAR(20),
    nationality VARCHAR(100),
    emergency_contact JSONB,  -- {name, relation, phone}
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_email VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'graduated', 'dropped')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT students_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT students_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT students_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT students_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE INDEX idx_students_university ON students(university_id, id);
CREATE INDEX idx_students_college ON students(college_id);
CREATE INDEX idx_students_admission_number ON students(admission_number);
CREATE INDEX idx_students_status ON students(university_id, status);

-- 3.2 Enrollments (Student-Course Many-to-Many)
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped', 'failed')),
    grade VARCHAR(5),  -- Final grade: A+, A, B+, etc.
    grade_points NUMERIC(4,2),  -- GPA contribution
    credits_earned INTEGER DEFAULT 0,
    completion_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT enrollments_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT enrollments_student_fk FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT enrollments_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT enrollments_academic_year_fk FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id, academic_year_id)
);

CREATE INDEX idx_enrollments_university ON enrollments(university_id, id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

-- 3.3 Attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    class_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    remarks TEXT,
    marked_by UUID NOT NULL,  -- Faculty who marked attendance
    marked_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT attendance_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT attendance_student_fk FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT attendance_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT attendance_marked_by_fk FOREIGN KEY (marked_by) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id, class_date)
);

CREATE INDEX idx_attendance_university ON attendance(university_id, id);
CREATE INDEX idx_attendance_student ON attendance(student_id, class_date);
CREATE INDEX idx_attendance_course ON attendance(course_id, class_date);

-- 3.4 Grades
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    enrollment_id UUID NOT NULL,
    assessment_type VARCHAR(50) NOT NULL,  -- 'midterm', 'final', 'assignment', 'quiz'
    assessment_name VARCHAR(255),
    max_marks NUMERIC(6,2) NOT NULL,
    obtained_marks NUMERIC(6,2) NOT NULL,
    weightage NUMERIC(5,2),  -- Percentage contribution to final grade
    graded_by UUID NOT NULL,  -- Faculty who graded
    graded_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    remarks TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT grades_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT grades_enrollment_fk FOREIGN KEY (enrollment_id) REFERENCES enrollments(id) ON DELETE CASCADE,
    CONSTRAINT grades_graded_by_fk FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT grades_marks_check CHECK (obtained_marks <= max_marks)
);

CREATE INDEX idx_grades_university ON grades(university_id, id);
CREATE INDEX idx_grades_enrollment ON grades(enrollment_id);

-- 3.5 Assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    course_id UUID NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    attachment_urls JSONB,  -- Array of file URLs
    max_marks NUMERIC(6,2) NOT NULL,
    due_date TIMESTAMPTZ NOT NULL,
    published_at TIMESTAMPTZ,
    created_by UUID NOT NULL,  -- Faculty
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT assignments_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT assignments_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT assignments_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_assignments_university ON assignments(university_id, id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);

-- 3.6 Submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    assignment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    submission_text TEXT,
    attachment_urls JSONB,  -- Array of file URLs
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    obtained_marks NUMERIC(6,2),
    feedback TEXT,
    graded_by UUID,
    graded_at TIMESTAMPTZ,
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'resubmitted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT submissions_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT submissions_assignment_fk FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    CONSTRAINT submissions_student_fk FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT submissions_graded_by_fk FOREIGN KEY (graded_by) REFERENCES users(id) ON DELETE SET NULL,
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_university ON submissions(university_id, id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);

-- 3.7 Timetables
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    department_id UUID,
    course_id UUID,
    academic_year_id UUID NOT NULL,
    year INTEGER,
    section VARCHAR(10),
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),  -- 0=Sunday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    faculty_id UUID,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'rescheduled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT timetables_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT timetables_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT timetables_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE CASCADE,
    CONSTRAINT timetables_course_fk FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT timetables_academic_year_fk FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

CREATE INDEX idx_timetables_university ON timetables(university_id, id);
CREATE INDEX idx_timetables_college ON timetables(college_id);
CREATE INDEX idx_timetables_course ON timetables(course_id);

-- 3.8 Class Schedules (Specific class sessions)
CREATE TABLE class_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    timetable_id UUID NOT NULL,
    class_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    topic VARCHAR(255),
    faculty_id UUID,
    room_number VARCHAR(50),
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT class_schedules_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT class_schedules_timetable_fk FOREIGN KEY (timetable_id) REFERENCES timetables(id) ON DELETE CASCADE
);

CREATE INDEX idx_class_schedules_university ON class_schedules(university_id, id);
CREATE INDEX idx_class_schedules_timetable ON class_schedules(timetable_id);
CREATE INDEX idx_class_schedules_date ON class_schedules(class_date);

-- ============================================================================
-- SECTION 4: FACULTY & STAFF (4 TABLES)
-- ============================================================================

-- 4.1 Faculty (Inherits from users)
CREATE TABLE faculty (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    department_id UUID,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100),  -- e.g., 'Professor', 'Assistant Professor'
    qualification VARCHAR(255),  -- e.g., 'Ph.D. in Computer Science'
    specialization TEXT,
    experience_years INTEGER,
    employment_type VARCHAR(50),  -- 'full-time', 'part-time', 'visiting'
    joining_date DATE NOT NULL,
    salary NUMERIC(12,2),  -- Encrypted in practice
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on-leave', 'terminated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT faculty_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT faculty_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT faculty_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT faculty_department_fk FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE SET NULL
);

CREATE INDEX idx_faculty_university ON faculty(university_id, id);
CREATE INDEX idx_faculty_college ON faculty(college_id);
CREATE INDEX idx_faculty_employee_id ON faculty(employee_id);

-- 4.2 Staff (Non-teaching)
CREATE TABLE staff (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE NOT NULL,
    university_id UUID NOT NULL,
    college_id UUID,  -- Null for university-level staff
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    designation VARCHAR(100),
    department_name VARCHAR(100),  -- e.g., 'Administration', 'IT Support'
    employment_type VARCHAR(50),
    joining_date DATE NOT NULL,
    salary NUMERIC(12,2),
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on-leave', 'terminated')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT staff_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT staff_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT staff_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE INDEX idx_staff_university ON staff(university_id, id);
CREATE INDEX idx_staff_college ON staff(college_id);
CREATE INDEX idx_staff_employee_id ON staff(employee_id);

-- 4.3 Leaves
CREATE TABLE leaves (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    user_id UUID NOT NULL,  -- Faculty or staff
    leave_type VARCHAR(50) NOT NULL,  -- 'sick', 'casual', 'earned', 'maternity'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    rejection_reason TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT leaves_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT leaves_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT leaves_approved_by_fk FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_leaves_university ON leaves(university_id, id);
CREATE INDEX idx_leaves_user ON leaves(user_id);
CREATE INDEX idx_leaves_status ON leaves(status);

-- 4.4 Payroll Records
CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    user_id UUID NOT NULL,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    year INTEGER NOT NULL,
    basic_salary NUMERIC(12,2) NOT NULL,
    allowances NUMERIC(12,2) DEFAULT 0,
    deductions NUMERIC(12,2) DEFAULT 0,
    gross_salary NUMERIC(12,2) GENERATED ALWAYS AS (basic_salary + allowances) STORED,
    net_salary NUMERIC(12,2) GENERATED ALWAYS AS (basic_salary + allowances - deductions) STORED,
    payment_date DATE,
    payment_method VARCHAR(50),  -- 'bank_transfer', 'cheque', 'cash'
    transaction_id VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'on-hold')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payroll_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT payroll_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(user_id, month, year)
);

CREATE INDEX idx_payroll_university ON payroll_records(university_id, id);
CREATE INDEX idx_payroll_user ON payroll_records(user_id);
CREATE INDEX idx_payroll_month_year ON payroll_records(year, month);

-- ============================================================================
-- SECTION 5: FINANCIAL MANAGEMENT (7 TABLES)
-- ============================================================================

-- 5.1 Fee Structures
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID NOT NULL,
    academic_year_id UUID NOT NULL,
    name VARCHAR(255) NOT NULL,  -- e.g., 'B.Tech First Year Fees'
    course VARCHAR(100),
    year INTEGER,
    amount NUMERIC(12,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    installments INTEGER DEFAULT 1,
    due_dates JSONB,  -- Array of dates for installments
    late_fee_per_day NUMERIC(8,2) DEFAULT 0,
    components JSONB,  -- {tuition: 10000, library: 500, lab: 1500}
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fee_structures_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT fee_structures_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT fee_structures_academic_year_fk FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE CASCADE
);

CREATE INDEX idx_fee_structures_university ON fee_structures(university_id, id);
CREATE INDEX idx_fee_structures_college ON fee_structures(college_id);

-- 5.2 Fee Payments
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    student_id UUID NOT NULL,
    fee_structure_id UUID NOT NULL,
    amount_paid NUMERIC(12,2) NOT NULL,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_method VARCHAR(50),  -- 'online', 'cash', 'cheque', 'card'
    transaction_id VARCHAR(255) UNIQUE,
    receipt_number VARCHAR(100) UNIQUE,
    installment_number INTEGER,
    late_fee NUMERIC(8,2) DEFAULT 0,
    remarks TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    recorded_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fee_payments_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT fee_payments_student_fk FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fee_payments_fee_structure_fk FOREIGN KEY (fee_structure_id) REFERENCES fee_structures(id) ON DELETE CASCADE,
    CONSTRAINT fee_payments_recorded_by_fk FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_fee_payments_university ON fee_payments(university_id, id);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_date ON fee_payments(payment_date);
CREATE INDEX idx_fee_payments_transaction ON fee_payments(transaction_id);

-- 5.3 Invoices
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    entity_type VARCHAR(50) NOT NULL,  -- 'student', 'vendor', 'other'
    entity_id UUID NOT NULL,  -- Student ID or vendor ID
    issue_date DATE NOT NULL,
    due_date DATE,
    total_amount NUMERIC(12,2) NOT NULL,
    tax_amount NUMERIC(12,2) DEFAULT 0,
    discount_amount NUMERIC(12,2) DEFAULT 0,
    paid_amount NUMERIC(12,2) DEFAULT 0,
    balance_amount NUMERIC(12,2) GENERATED ALWAYS AS (total_amount + tax_amount - discount_amount - paid_amount) STORED,
    line_items JSONB NOT NULL,  -- Array of {description, quantity, unit_price, amount}
    status VARCHAR(20) NOT NULL DEFAULT 'unpaid' CHECK (status IN ('unpaid', 'partially_paid', 'paid', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT invoices_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_invoices_university ON invoices(university_id, id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_entity ON invoices(entity_type, entity_id);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);

-- 5.4 Ledger Entries (Double-entry bookkeeping)
CREATE TABLE ledger_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID,  -- Null for university-level
    transaction_date DATE NOT NULL,
    account_type VARCHAR(50) NOT NULL,  -- 'income', 'expense', 'asset', 'liability'
    category VARCHAR(100) NOT NULL,  -- 'tuition_fees', 'salary', 'infrastructure', etc.
    debit_amount NUMERIC(12,2) DEFAULT 0,
    credit_amount NUMERIC(12,2) DEFAULT 0,
    description TEXT,
    reference_type VARCHAR(50),  -- 'fee_payment', 'expense', 'payroll'
    reference_id UUID,  -- ID of related record
    created_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT ledger_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT ledger_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT ledger_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT ledger_balance_check CHECK ((debit_amount > 0 AND credit_amount = 0) OR (credit_amount > 0 AND debit_amount = 0))
);

CREATE INDEX idx_ledger_university ON ledger_entries(university_id, id);
CREATE INDEX idx_ledger_college ON ledger_entries(college_id);
CREATE INDEX idx_ledger_date ON ledger_entries(transaction_date);
CREATE INDEX idx_ledger_account ON ledger_entries(account_type, category);

-- 5.5 Expense Categories
CREATE TABLE expense_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(50) NOT NULL,
    parent_id UUID,  -- For hierarchical categories
    description TEXT,
    budget_limit NUMERIC(12,2),  -- Optional budget limit
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expense_categories_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT expense_categories_parent_fk FOREIGN KEY (parent_id) REFERENCES expense_categories(id) ON DELETE CASCADE,
    UNIQUE(university_id, code)
);

CREATE INDEX idx_expense_categories_university ON expense_categories(university_id, id);
CREATE INDEX idx_expense_categories_parent ON expense_categories(parent_id);

-- 5.6 Expenses
CREATE TABLE expenses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID,
    category_id UUID NOT NULL,
    expense_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    vendor_name VARCHAR(255),
    invoice_number VARCHAR(100),
    description TEXT,
    attachment_urls JSONB,  -- Array of receipt/bill URLs
    payment_method VARCHAR(50),
    payment_status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'cancelled')),
    approved_by UUID,
    approved_at TIMESTAMPTZ,
    recorded_by UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT expenses_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT expenses_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT expenses_category_fk FOREIGN KEY (category_id) REFERENCES expense_categories(id) ON DELETE CASCADE,
    CONSTRAINT expenses_approved_by_fk FOREIGN KEY (approved_by) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT expenses_recorded_by_fk FOREIGN KEY (recorded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_expenses_university ON expenses(university_id, id);
CREATE INDEX idx_expenses_college ON expenses(college_id);
CREATE INDEX idx_expenses_date ON expenses(expense_date);
CREATE INDEX idx_expenses_category ON expenses(category_id);

-- 5.7 Payment Gateways
CREATE TABLE payment_gateways (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    name VARCHAR(100) NOT NULL,  -- 'Stripe', 'Razorpay', 'PayPal'
    credentials JSONB NOT NULL,  -- Encrypted API keys
    is_active BOOLEAN DEFAULT TRUE,
    is_test_mode BOOLEAN DEFAULT TRUE,
    supported_methods JSONB,  -- ['card', 'upi', 'netbanking', 'wallet']
    transaction_fee_percentage NUMERIC(5,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT payment_gateways_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE
);

CREATE INDEX idx_payment_gateways_university ON payment_gateways(university_id, id);

-- ============================================================================
-- SECTION 6: OPERATIONS & SYSTEM (4 TABLES)
-- ============================================================================

-- 6.1 Notifications
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    user_id UUID NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'grade_updated', 'assignment_due', 'fee_reminder'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    icon VARCHAR(50),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    channels JSONB,  -- ['in-app', 'email', 'sms', 'push']
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT notifications_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT notifications_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_notifications_university ON notifications(university_id, id);
CREATE INDEX idx_notifications_user ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_created ON notifications(created_at);

-- 6.2 Audit Logs
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(50) NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'LOGIN'
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    changes JSONB,  -- {old: {...}, new: {...}}
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT audit_logs_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT audit_logs_user_fk FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_university ON audit_logs(university_id, id);
CREATE INDEX idx_audit_logs_user ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at);

-- 6.3 File Uploads
CREATE TABLE file_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    uploaded_by UUID NOT NULL,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,  -- S3 key or local path
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100),
    category VARCHAR(50),  -- 'assignment', 'profile_photo', 'document'
    entity_type VARCHAR(100),  -- Related entity type
    entity_id UUID,  -- Related entity ID
    is_public BOOLEAN DEFAULT FALSE,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMPTZ,
    CONSTRAINT file_uploads_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT file_uploads_uploaded_by_fk FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_file_uploads_university ON file_uploads(university_id, id);
CREATE INDEX idx_file_uploads_uploaded_by ON file_uploads(uploaded_by);
CREATE INDEX idx_file_uploads_entity ON file_uploads(entity_type, entity_id);

-- 6.4 Settings (System configurations)
CREATE TABLE settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID,  -- Null for global settings
    key VARCHAR(100) NOT NULL,
    value JSONB NOT NULL,
    data_type VARCHAR(50) NOT NULL,  -- 'string', 'integer', 'boolean', 'json'
    category VARCHAR(100),
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,  -- Can be accessed without auth
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(university_id, key)
);

CREATE INDEX idx_settings_university ON settings(university_id);
CREATE INDEX idx_settings_key ON settings(key);

-- ============================================================================
-- SECTION 7: COMMUNICATIONS (4 TABLES)
-- ============================================================================

-- 7.1 Announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    college_id UUID,  -- Null for university-wide
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    target_audience VARCHAR(50),  -- 'all', 'students', 'faculty', 'parents'
    attachment_urls JSONB,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high')),
    published_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_by UUID NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'expired')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT announcements_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT announcements_college_fk FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT announcements_created_by_fk FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_announcements_university ON announcements(university_id, id);
CREATE INDEX idx_announcements_college ON announcements(college_id);
CREATE INDEX idx_announcements_status ON announcements(status, published_at);

-- 7.2 Messages (Internal messaging)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    sender_id UUID NOT NULL,
    recipient_id UUID NOT NULL,
    subject VARCHAR(255),
    body TEXT NOT NULL,
    attachment_urls JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    parent_message_id UUID,  -- For threading
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    deleted_by_sender BOOLEAN DEFAULT FALSE,
    deleted_by_recipient BOOLEAN DEFAULT FALSE,
    CONSTRAINT messages_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT messages_sender_fk FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT messages_recipient_fk FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT messages_parent_fk FOREIGN KEY (parent_message_id) REFERENCES messages(id) ON DELETE CASCADE
);

CREATE INDEX idx_messages_university ON messages(university_id, id);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, is_read);
CREATE INDEX idx_messages_thread ON messages(parent_message_id);

-- 7.3 Parent Links (Student-Parent relationships)
CREATE TABLE parent_links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    student_id UUID NOT NULL,
    parent_user_id UUID NOT NULL,
    relationship VARCHAR(50) NOT NULL,  -- 'father', 'mother', 'guardian'
    is_primary BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50) DEFAULT 'full' CHECK (access_level IN ('full', 'view-only', 'restricted')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT parent_links_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT parent_links_student_fk FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT parent_links_parent_fk FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(student_id, parent_user_id)
);

CREATE INDEX idx_parent_links_university ON parent_links(university_id, id);
CREATE INDEX idx_parent_links_student ON parent_links(student_id);
CREATE INDEX idx_parent_links_parent ON parent_links(parent_user_id);

-- 7.4 Complaint/Support Tickets
CREATE TABLE complaint_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL,
    ticket_number VARCHAR(50) UNIQUE NOT NULL,
    raised_by UUID NOT NULL,
    category VARCHAR(100) NOT NULL,  -- 'academic', 'infrastructure', 'harassment', 'other'
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
    assigned_to UUID,
    resolution TEXT,
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT tickets_university_fk FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    CONSTRAINT tickets_raised_by_fk FOREIGN KEY (raised_by) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT tickets_assigned_to_fk FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE INDEX idx_tickets_university ON complaint_tickets(university_id, id);
CREATE INDEX idx_tickets_raised_by ON complaint_tickets(raised_by);
CREATE INDEX idx_tickets_status ON complaint_tickets(status);
CREATE INDEX idx_tickets_ticket_number ON complaint_tickets(ticket_number);

-- ============================================================================
-- TRIGGERS & FUNCTIONS
-- ============================================================================

-- Update updated_at timestamp automatically
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
DO $$
DECLARE
    t text;
BEGIN
    FOR t IN
        SELECT table_name FROM information_schema.columns
        WHERE column_name = 'updated_at'
        AND table_schema = 'public'
    LOOP
        EXECUTE format('CREATE TRIGGER trigger_update_%I_updated_at
                       BEFORE UPDATE ON %I
                       FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- SAMPLE DATA (For Development/Testing)
-- ============================================================================

-- Sample University
INSERT INTO universities (id, name, slug, domain, email, phone, status)
VALUES (uuid_generate_v4(), 'Demo University', 'demo-university', 'demo.edu', 'admin@demo.edu', '+1234567890', 'live');

-- ============================================================================
-- PERFORMANCE OPTIMIZATION
-- ============================================================================

-- Analyze tables for query planner
ANALYZE;

-- Vacuum to reclaim storage
VACUUM ANALYZE;

-- ============================================================================
-- BACKUP & MAINTENANCE NOTES
-- ============================================================================

-- Backup command:
-- pg_dump -h localhost -U postgres -d bitflow_lms -F c -b -v -f backup_$(date +%Y%m%d).dump

-- Restore command:
-- pg_restore -h localhost -U postgres -d bitflow_lms -v backup_20251025.dump

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================
