-- ============================================================================
-- Faculty/Teacher Portal - Database Schema
-- ============================================================================
-- Database: PostgreSQL 16
-- Purpose: Complete schema for faculty teaching operations
-- Portal: #07 Faculty/Teacher (Port 3007)
-- Last Updated: October 25, 2025
-- ============================================================================

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- For fuzzy text search
CREATE EXTENSION IF NOT EXISTS "pg_stat_statements";  -- For query performance monitoring

-- ============================================================================
-- 1. CORE TABLES
-- ============================================================================

-- Faculties Table
CREATE TABLE faculties (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    employee_code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    department_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    designation VARCHAR(100),
    specialization TEXT[],
    qualification VARCHAR(255),
    joining_date DATE NOT NULL,
    profile_photo VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    email_verified_at TIMESTAMP,
    remember_token VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_faculty_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_faculty_college FOREIGN KEY (college_id) 
        REFERENCES colleges(id) ON DELETE RESTRICT
);

CREATE INDEX idx_faculties_employee_code ON faculties(employee_code);
CREATE INDEX idx_faculties_email ON faculties(email);
CREATE INDEX idx_faculties_department_id ON faculties(department_id);
CREATE INDEX idx_faculties_college_id ON faculties(college_id);
CREATE INDEX idx_faculties_active ON faculties(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE faculties IS 'Faculty/teacher master data';
COMMENT ON COLUMN faculties.specialization IS 'Array of specialization areas';

-- ============================================================================
-- 2. COURSE MANAGEMENT
-- ============================================================================

-- Courses Table
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_code VARCHAR(50) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    section VARCHAR(10),
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    faculty_id BIGINT NOT NULL,
    department_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    credits INTEGER DEFAULT 3,
    total_classes INTEGER DEFAULT 45,
    min_attendance_percentage DECIMAL(5,2) DEFAULT 75.00,
    syllabus_url VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_course_faculty FOREIGN KEY (faculty_id) 
        REFERENCES faculties(id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_department FOREIGN KEY (department_id) 
        REFERENCES departments(id) ON DELETE RESTRICT,
    CONSTRAINT fk_course_college FOREIGN KEY (college_id) 
        REFERENCES colleges(id) ON DELETE RESTRICT,
    CONSTRAINT chk_credits CHECK (credits > 0 AND credits <= 10),
    CONSTRAINT chk_attendance_percentage CHECK (
        min_attendance_percentage >= 0 AND min_attendance_percentage <= 100
    )
);

CREATE INDEX idx_courses_faculty_id ON courses(faculty_id);
CREATE INDEX idx_courses_semester ON courses(semester, academic_year);
CREATE INDEX idx_courses_code ON courses(course_code);
CREATE INDEX idx_courses_active ON courses(is_active) WHERE is_active = TRUE;

COMMENT ON TABLE courses IS 'Course assignments for faculty';
COMMENT ON COLUMN courses.total_classes IS 'Expected total classes in semester';

-- Course Enrollments Table
CREATE TABLE enrollments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    dropped_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_enrollment_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_enrollment_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT chk_enrollment_status CHECK (status IN ('active', 'dropped', 'completed')),
    CONSTRAINT uk_enrollment UNIQUE (course_id, student_id)
);

CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);

COMMENT ON TABLE enrollments IS 'Student enrollment in courses';

-- ============================================================================
-- 3. ATTENDANCE MANAGEMENT
-- ============================================================================

-- Attendance Records Table
CREATE TABLE attendances (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    status VARCHAR(20) NOT NULL,
    marked_by BIGINT NOT NULL,
    marked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    note TEXT,
    is_offline_sync BOOLEAN DEFAULT FALSE,
    device_timestamp TIMESTAMP,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_attendance_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendance_faculty FOREIGN KEY (marked_by) 
        REFERENCES faculties(id) ON DELETE RESTRICT,
    CONSTRAINT chk_attendance_status CHECK (
        status IN ('present', 'absent', 'late', 'excused')
    ),
    CONSTRAINT uk_attendance UNIQUE (course_id, student_id, date, time_slot)
);

CREATE INDEX idx_attendances_course_id ON attendances(course_id);
CREATE INDEX idx_attendances_student_id ON attendances(student_id);
CREATE INDEX idx_attendances_date ON attendances(date);
CREATE INDEX idx_attendances_marked_by ON attendances(marked_by);
CREATE INDEX idx_attendances_status ON attendances(status);
CREATE INDEX idx_attendances_offline_sync ON attendances(is_offline_sync) 
    WHERE is_offline_sync = TRUE;

COMMENT ON TABLE attendances IS 'Daily attendance records';
COMMENT ON COLUMN attendances.is_offline_sync IS 'TRUE if synced from offline mode';
COMMENT ON COLUMN attendances.device_timestamp IS 'Original timestamp from mobile device';

-- Attendance Summary View (for quick queries)
CREATE MATERIALIZED VIEW attendance_summary AS
SELECT 
    course_id,
    student_id,
    COUNT(*) FILTER (WHERE status = 'present') as present_count,
    COUNT(*) FILTER (WHERE status = 'absent') as absent_count,
    COUNT(*) FILTER (WHERE status = 'late') as late_count,
    COUNT(*) FILTER (WHERE status = 'excused') as excused_count,
    COUNT(*) as total_classes,
    ROUND(
        (COUNT(*) FILTER (WHERE status = 'present')::DECIMAL / 
         NULLIF(COUNT(*), 0)) * 100, 
        2
    ) as attendance_percentage
FROM attendances
GROUP BY course_id, student_id;

CREATE UNIQUE INDEX idx_attendance_summary_course_student 
    ON attendance_summary(course_id, student_id);

COMMENT ON MATERIALIZED VIEW attendance_summary IS 'Precomputed attendance statistics';

-- ============================================================================
-- 4. ASSESSMENT & GRADING
-- ============================================================================

-- Assessments Table
CREATE TABLE assessments (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    max_marks DECIMAL(6,2) NOT NULL,
    weightage DECIMAL(5,2) NOT NULL,
    due_date TIMESTAMP,
    rubric JSONB,
    is_published BOOLEAN DEFAULT FALSE,
    allows_late_submission BOOLEAN DEFAULT FALSE,
    late_penalty_percentage DECIMAL(5,2) DEFAULT 0.00,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_assessment_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_assessment_faculty FOREIGN KEY (created_by) 
        REFERENCES faculties(id) ON DELETE RESTRICT,
    CONSTRAINT chk_assessment_type CHECK (
        type IN ('quiz', 'assignment', 'midterm', 'final', 'project', 'presentation')
    ),
    CONSTRAINT chk_max_marks CHECK (max_marks > 0),
    CONSTRAINT chk_weightage CHECK (weightage >= 0 AND weightage <= 100)
);

CREATE INDEX idx_assessments_course_id ON assessments(course_id);
CREATE INDEX idx_assessments_type ON assessments(type);
CREATE INDEX idx_assessments_due_date ON assessments(due_date);
CREATE INDEX idx_assessments_published ON assessments(is_published);

COMMENT ON TABLE assessments IS 'Quizzes, assignments, exams, projects';
COMMENT ON COLUMN assessments.rubric IS 'JSON grading rubric/criteria';

-- Submissions Table
CREATE TABLE submissions (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    assessment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    submission_url VARCHAR(255),
    submission_text TEXT,
    attachments JSONB,
    is_late BOOLEAN DEFAULT FALSE,
    late_penalty_applied DECIMAL(5,2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_submission_assessment FOREIGN KEY (assessment_id) 
        REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_submission_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT uk_submission UNIQUE (assessment_id, student_id)
);

CREATE INDEX idx_submissions_assessment_id ON submissions(assessment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_late ON submissions(is_late) WHERE is_late = TRUE;

COMMENT ON TABLE submissions IS 'Student assignment submissions';
COMMENT ON COLUMN submissions.attachments IS 'Array of file URLs';

-- Grades Table
CREATE TABLE grades (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    assessment_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    marks_obtained DECIMAL(6,2),
    max_marks DECIMAL(6,2) NOT NULL,
    percentage DECIMAL(5,2),
    letter_grade VARCHAR(5),
    feedback TEXT,
    graded_by BIGINT NOT NULL,
    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_grade_assessment FOREIGN KEY (assessment_id) 
        REFERENCES assessments(id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_student FOREIGN KEY (student_id) 
        REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_grade_faculty FOREIGN KEY (graded_by) 
        REFERENCES faculties(id) ON DELETE RESTRICT,
    CONSTRAINT chk_marks_obtained CHECK (
        marks_obtained IS NULL OR 
        (marks_obtained >= 0 AND marks_obtained <= max_marks)
    ),
    CONSTRAINT chk_percentage CHECK (
        percentage IS NULL OR 
        (percentage >= 0 AND percentage <= 100)
    ),
    CONSTRAINT uk_grade UNIQUE (assessment_id, student_id)
);

CREATE INDEX idx_grades_assessment_id ON grades(assessment_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_published ON grades(is_published);
CREATE INDEX idx_grades_letter_grade ON grades(letter_grade);

COMMENT ON TABLE grades IS 'Student grades for assessments';

-- ============================================================================
-- 5. MATERIALS & RESOURCES
-- ============================================================================

-- Course Materials Table
CREATE TABLE materials (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    course_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL,
    file_url VARCHAR(500),
    file_size_kb INTEGER,
    topic VARCHAR(255),
    week_number INTEGER,
    is_visible BOOLEAN DEFAULT TRUE,
    uploaded_by BIGINT NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    download_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT fk_material_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT fk_material_faculty FOREIGN KEY (uploaded_by) 
        REFERENCES faculties(id) ON DELETE RESTRICT,
    CONSTRAINT chk_material_type CHECK (
        type IN ('pdf', 'video', 'audio', 'link', 'document', 'slides', 'code')
    )
);

CREATE INDEX idx_materials_course_id ON materials(course_id);
CREATE INDEX idx_materials_type ON materials(type);
CREATE INDEX idx_materials_visible ON materials(is_visible) WHERE is_visible = TRUE;
CREATE INDEX idx_materials_week ON materials(week_number);

COMMENT ON TABLE materials IS 'Course lecture notes, videos, resources';

-- ============================================================================
-- 6. COMMUNICATION
-- ============================================================================

-- Messages Table (Faculty-Student Communication)
CREATE TABLE messages (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    sender_id BIGINT NOT NULL,
    sender_type VARCHAR(20) NOT NULL,
    recipient_id BIGINT,
    recipient_type VARCHAR(20),
    course_id BIGINT,
    subject VARCHAR(500),
    body TEXT NOT NULL,
    is_announcement BOOLEAN DEFAULT FALSE,
    priority VARCHAR(20) DEFAULT 'normal',
    read_at TIMESTAMP,
    replied_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT chk_sender_type CHECK (sender_type IN ('faculty', 'student', 'admin')),
    CONSTRAINT chk_recipient_type CHECK (recipient_type IN ('faculty', 'student', 'class')),
    CONSTRAINT chk_priority CHECK (priority IN ('low', 'normal', 'high', 'urgent'))
);

CREATE INDEX idx_messages_sender ON messages(sender_id, sender_type);
CREATE INDEX idx_messages_recipient ON messages(recipient_id, recipient_type);
CREATE INDEX idx_messages_course_id ON messages(course_id);
CREATE INDEX idx_messages_announcement ON messages(is_announcement) 
    WHERE is_announcement = TRUE;
CREATE INDEX idx_messages_unread ON messages(read_at) WHERE read_at IS NULL;

COMMENT ON TABLE messages IS 'Faculty-student communication';
COMMENT ON COLUMN messages.recipient_type IS 'NULL for class announcements';

-- ============================================================================
-- 7. TIMETABLE & SCHEDULE
-- ============================================================================

-- Faculty Timetable Table
CREATE TABLE faculty_timetable (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    room_number VARCHAR(50),
    semester VARCHAR(20) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_timetable_faculty FOREIGN KEY (faculty_id) 
        REFERENCES faculties(id) ON DELETE CASCADE,
    CONSTRAINT fk_timetable_course FOREIGN KEY (course_id) 
        REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_day_of_week CHECK (
        day_of_week IN ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')
    ),
    CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

CREATE INDEX idx_timetable_faculty_id ON faculty_timetable(faculty_id);
CREATE INDEX idx_timetable_day ON faculty_timetable(day_of_week);
CREATE INDEX idx_timetable_semester ON faculty_timetable(semester, academic_year);

COMMENT ON TABLE faculty_timetable IS 'Weekly teaching schedule';

-- Leave Requests Table
CREATE TABLE leave_requests (
    id BIGSERIAL PRIMARY KEY,
    uuid UUID DEFAULT uuid_generate_v4() UNIQUE NOT NULL,
    faculty_id BIGINT NOT NULL,
    leave_type VARCHAR(50) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_days INTEGER NOT NULL,
    reason TEXT NOT NULL,
    substitute_faculty_id BIGINT,
    status VARCHAR(20) DEFAULT 'pending',
    approved_by BIGINT,
    approved_at TIMESTAMP,
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_leave_faculty FOREIGN KEY (faculty_id) 
        REFERENCES faculties(id) ON DELETE CASCADE,
    CONSTRAINT fk_leave_substitute FOREIGN KEY (substitute_faculty_id) 
        REFERENCES faculties(id) ON DELETE SET NULL,
    CONSTRAINT chk_leave_type CHECK (
        leave_type IN ('sick', 'casual', 'earned', 'maternity', 'paternity', 'study', 'unpaid')
    ),
    CONSTRAINT chk_leave_status CHECK (
        status IN ('pending', 'approved', 'rejected', 'cancelled')
    ),
    CONSTRAINT chk_date_order CHECK (end_date >= start_date)
);

CREATE INDEX idx_leave_faculty_id ON leave_requests(faculty_id);
CREATE INDEX idx_leave_status ON leave_requests(status);
CREATE INDEX idx_leave_dates ON leave_requests(start_date, end_date);

COMMENT ON TABLE leave_requests IS 'Faculty leave applications';

-- ============================================================================
-- 8. EXAM DUTIES & INVIGILATION
-- ============================================================================

-- Exam Duties Table
CREATE TABLE exam_duties (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL,
    exam_id BIGINT NOT NULL,
    exam_date DATE NOT NULL,
    exam_time TIME NOT NULL,
    room_number VARCHAR(50) NOT NULL,
    duty_type VARCHAR(50) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    incident_report TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_exam_duty_faculty FOREIGN KEY (faculty_id) 
        REFERENCES faculties(id) ON DELETE CASCADE,
    CONSTRAINT chk_duty_type CHECK (
        duty_type IN ('invigilator', 'flying_squad', 'hall_supervisor', 'external_examiner')
    )
);

CREATE INDEX idx_exam_duties_faculty_id ON exam_duties(faculty_id);
CREATE INDEX idx_exam_duties_exam_date ON exam_duties(exam_date);
CREATE INDEX idx_exam_duties_completed ON exam_duties(is_completed);

COMMENT ON TABLE exam_duties IS 'Exam invigilation and supervision duties';

-- ============================================================================
-- 9. ANALYTICS & REPORTING
-- ============================================================================

-- Course Analytics Summary (Materialized View)
CREATE MATERIALIZED VIEW course_analytics AS
SELECT 
    c.id as course_id,
    c.course_code,
    c.course_name,
    c.faculty_id,
    COUNT(DISTINCT e.student_id) as enrolled_students,
    COUNT(DISTINCT a.id) as total_classes_held,
    ROUND(AVG(asummary.attendance_percentage), 2) as avg_attendance_percentage,
    COUNT(DISTINCT ass.id) as total_assessments,
    ROUND(AVG(g.percentage), 2) as avg_grade_percentage,
    COUNT(DISTINCT m.id) as total_materials,
    SUM(m.download_count) as total_downloads
FROM courses c
LEFT JOIN enrollments e ON c.id = e.course_id AND e.status = 'active'
LEFT JOIN attendances a ON c.id = a.course_id
LEFT JOIN attendance_summary asummary ON c.id = asummary.course_id
LEFT JOIN assessments ass ON c.id = ass.course_id
LEFT JOIN grades g ON ass.id = g.assessment_id AND g.is_published = TRUE
LEFT JOIN materials m ON c.id = m.course_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.course_code, c.course_name, c.faculty_id;

CREATE UNIQUE INDEX idx_course_analytics_course_id 
    ON course_analytics(course_id);

COMMENT ON MATERIALIZED VIEW course_analytics IS 'Precomputed course statistics';

-- ============================================================================
-- 10. TRIGGERS & FUNCTIONS
-- ============================================================================

-- Function: Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables
CREATE TRIGGER update_faculties_updated_at BEFORE UPDATE ON faculties
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_grades_updated_at BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_materials_updated_at BEFORE UPDATE ON materials
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function: Calculate grade percentage and letter grade automatically
CREATE OR REPLACE FUNCTION calculate_grade_metrics()
RETURNS TRIGGER AS $$
BEGIN
    -- Calculate percentage
    IF NEW.marks_obtained IS NOT NULL AND NEW.max_marks > 0 THEN
        NEW.percentage = (NEW.marks_obtained / NEW.max_marks) * 100;
        
        -- Calculate letter grade
        NEW.letter_grade = CASE
            WHEN NEW.percentage >= 90 THEN 'A+'
            WHEN NEW.percentage >= 85 THEN 'A'
            WHEN NEW.percentage >= 80 THEN 'A-'
            WHEN NEW.percentage >= 75 THEN 'B+'
            WHEN NEW.percentage >= 70 THEN 'B'
            WHEN NEW.percentage >= 65 THEN 'B-'
            WHEN NEW.percentage >= 60 THEN 'C+'
            WHEN NEW.percentage >= 55 THEN 'C'
            WHEN NEW.percentage >= 50 THEN 'C-'
            WHEN NEW.percentage >= 45 THEN 'D'
            ELSE 'F'
        END;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER calculate_grade_before_insert BEFORE INSERT ON grades
    FOR EACH ROW EXECUTE FUNCTION calculate_grade_metrics();

CREATE TRIGGER calculate_grade_before_update BEFORE UPDATE ON grades
    FOR EACH ROW EXECUTE FUNCTION calculate_grade_metrics();

-- Function: Refresh materialized views
CREATE OR REPLACE FUNCTION refresh_faculty_analytics()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY attendance_summary;
    REFRESH MATERIALIZED VIEW CONCURRENTLY course_analytics;
END;
$$ language 'plpgsql';

-- ============================================================================
-- 11. SAMPLE DATA (for testing)
-- ============================================================================

-- Insert sample faculty (password: 'password' hashed with bcrypt)
INSERT INTO faculties (
    employee_code, name, email, password, phone, 
    department_id, college_id, designation, qualification, joining_date
) VALUES 
('FAC001', 'Dr. John Smith', 'john.smith@college.edu', 
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '+1234567890', 1, 1, 'Associate Professor', 'PhD in Computer Science', '2020-01-15'),
('FAC002', 'Prof. Sarah Johnson', 'sarah.johnson@college.edu',
 '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
 '+1234567891', 1, 1, 'Professor', 'PhD in Mathematics', '2018-08-20');

-- Note: Additional sample data should be added during testing phase

-- ============================================================================
-- 12. INDEXES FOR PERFORMANCE
-- ============================================================================

-- Composite indexes for common queries
CREATE INDEX idx_attendance_course_date 
    ON attendances(course_id, date);

CREATE INDEX idx_grades_assessment_published 
    ON grades(assessment_id, is_published);

CREATE INDEX idx_materials_course_visible 
    ON materials(course_id, is_visible);

-- Full-text search indexes
CREATE INDEX idx_materials_search ON materials USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));
CREATE INDEX idx_assessments_search ON assessments USING gin(to_tsvector('english', title || ' ' || COALESCE(description, '')));

-- ============================================================================
-- END OF SCHEMA
-- ============================================================================

-- Grant permissions (adjust as needed for your environment)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO faculty_app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO faculty_app_user;
-- Faculty/Teacher Portal Schema (PostgreSQL 16)
-- Tenancy: college_id scoped; many tables also scoped by faculty_id

create table if not exists courses (
	id uuid primary key,
	college_id uuid not null,
	code text not null,
	title text not null,
	section text not null,
	term text not null,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists faculty_courses (
	id uuid primary key,
	college_id uuid not null,
	faculty_id uuid not null,
	course_id uuid not null references courses(id) on delete cascade,
	created_at timestamptz not null default now(),
	unique (faculty_id, course_id)
);

create table if not exists attendance_records (
	id uuid primary key,
	college_id uuid not null,
	course_id uuid not null references courses(id) on delete cascade,
	faculty_id uuid not null,
	student_id uuid not null,
	date date not null,
	status text not null check (status in ('PRESENT','ABSENT','LATE','EXCUSED')),
	note text,
	device_ts timestamptz,
	source text not null check (source in ('ONLINE','OFFLINE','IMPORTED')),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (course_id, student_id, date)
);

create index if not exists idx_att_course_date on attendance_records(course_id, date);
create index if not exists idx_att_course_student on attendance_records(course_id, student_id);

create table if not exists assessments (
	id uuid primary key,
	college_id uuid not null,
	course_id uuid not null references courses(id) on delete cascade,
	faculty_id uuid not null,
	title text not null,
	type text not null check (type in ('QUIZ','ASSIGNMENT','LAB','PROJECT','MIDTERM','ENDSEM','VIVA')),
	weight numeric(5,2) not null check (weight >= 0 and weight <= 100),
	due_at timestamptz,
	status text not null check (status in ('DRAFT','PUBLISHED')) default 'DRAFT',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create index if not exists idx_ass_course on assessments(course_id);

create table if not exists grade_entries (
	id uuid primary key,
	college_id uuid not null,
	course_id uuid not null references courses(id) on delete cascade,
	assessment_id uuid not null references assessments(id) on delete cascade,
	faculty_id uuid not null,
	student_id uuid not null,
	marks numeric(7,2) not null,
	status text not null check (status in ('DRAFT','PUBLISHED','REVISED')) default 'DRAFT',
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	unique (assessment_id, student_id)
);
create index if not exists idx_grade_course_ass on grade_entries(course_id, assessment_id);

create table if not exists grade_audits (
	id uuid primary key,
	college_id uuid not null,
	assessment_id uuid not null references assessments(id) on delete cascade,
	student_id uuid not null,
	actor_id uuid not null,
	action text not null,
	reason text,
	before jsonb,
	after jsonb,
	created_at timestamptz not null default now()
);

create table if not exists materials (
	id uuid primary key,
	college_id uuid not null,
	course_id uuid not null references courses(id) on delete cascade,
	faculty_id uuid not null,
	title text not null,
	kind text not null check (kind in ('FILE','LINK','NOTE')),
	url text,
	current_version int not null default 1,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);
create table if not exists material_versions (
	id uuid primary key,
	material_id uuid not null references materials(id) on delete cascade,
	version int not null,
	change_note text,
	metadata jsonb,
	created_at timestamptz not null default now(),
	unique(material_id, version)
);

create table if not exists timetable_slots (
	id uuid primary key,
	college_id uuid not null,
	faculty_id uuid not null,
	course_id uuid not null references courses(id) on delete cascade,
	day_of_week smallint not null check (day_of_week between 0 and 6),
	start_time time not null,
	end_time time not null,
	room text,
	created_at timestamptz not null default now()
);

create table if not exists substitution_requests (
	id uuid primary key,
	college_id uuid not null,
	slot_id uuid not null references timetable_slots(id) on delete cascade,
	requester_id uuid not null,
	substitute_id uuid,
	status text not null check (status in ('PENDING','APPROVED','REJECTED','CANCELLED')) default 'PENDING',
	reason text,
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now()
);

create table if not exists exam_duties (
	id uuid primary key,
	college_id uuid not null,
	faculty_id uuid not null,
	course_id uuid,
	duty_at timestamptz not null,
	room text,
	status text not null check (status in ('ASSIGNED','ACKNOWLEDGED','DECLINED','COMPLETED')) default 'ASSIGNED',
	created_at timestamptz not null default now()
);

create table if not exists incident_reports (
	id uuid primary key,
	duty_id uuid not null references exam_duties(id) on delete cascade,
	reporter_id uuid not null,
	type text not null,
	notes text,
	created_at timestamptz not null default now()
);

-- RLS
alter table courses enable row level security;
alter table faculty_courses enable row level security;
alter table attendance_records enable row level security;
alter table assessments enable row level security;
alter table grade_entries enable row level security;
alter table grade_audits enable row level security;
alter table materials enable row level security;
alter table material_versions enable row level security;
alter table timetable_slots enable row level security;
alter table substitution_requests enable row level security;
alter table exam_duties enable row level security;
alter table incident_reports enable row level security;

-- Example policies (simplified)
-- Assume current_setting('app.college_id') and current_setting('app.faculty_id') are set per request
create policy if not exists p_courses_college on courses using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_fac_courses_college on faculty_courses using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_att_own_college on attendance_records using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_ass_own_college on assessments using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_grd_own_college on grade_entries using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_mat_own_college on materials using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_mver_own_college on material_versions using (exists (select 1 from materials m where m.id = material_id and m.college_id::text = current_setting('app.college_id', true)));
create policy if not exists p_ttbl_own_college on timetable_slots using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_subst_own_college on substitution_requests using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_exam_own_college on exam_duties using (college_id::text = current_setting('app.college_id', true));
create policy if not exists p_inci_own_duty on incident_reports using (exists (select 1 from exam_duties d where d.id = duty_id and d.college_id::text = current_setting('app.college_id', true)));

-- Additional fine-grained policies limiting by faculty_id should be added in app migrations per table
