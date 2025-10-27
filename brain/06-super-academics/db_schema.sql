-- ================================================
-- Super Academics Portal - Database Schema
-- Database: PostgreSQL 16
-- Purpose: Centralized Academic Management System
-- ================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For fuzzy search
CREATE EXTENSION IF NOT EXISTS "btree_gin"; -- For composite indexes

-- ================================================
-- TABLE: curricula
-- Purpose: Store curriculum templates/programs
-- ================================================
CREATE TABLE curricula (
    id BIGSERIAL PRIMARY KEY,
    program_name VARCHAR(255) NOT NULL,
    degree_type VARCHAR(50) NOT NULL, -- 'bachelor', 'master', 'diploma'
    duration_years SMALLINT NOT NULL DEFAULT 4,
    total_credits SMALLINT NOT NULL,
    version VARCHAR(20) NOT NULL DEFAULT '1.0',
    effective_from DATE NOT NULL,
    effective_to DATE,
    description TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'active', 'archived'
    created_by BIGINT NOT NULL,
    approved_by BIGINT,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP,
    
    CONSTRAINT chk_curricula_status CHECK (status IN ('draft', 'active', 'archived')),
    CONSTRAINT chk_curricula_degree CHECK (degree_type IN ('bachelor', 'master', 'diploma', 'certificate')),
    CONSTRAINT chk_curricula_duration CHECK (duration_years BETWEEN 1 AND 6),
    CONSTRAINT chk_curricula_credits CHECK (total_credits > 0)
);

CREATE INDEX idx_curricula_status ON curricula(status) WHERE deleted_at IS NULL;
CREATE INDEX idx_curricula_program ON curricula(program_name) WHERE status = 'active';
CREATE INDEX idx_curricula_effective ON curricula(effective_from, effective_to);
CREATE INDEX idx_curricula_degree ON curricula(degree_type);

COMMENT ON TABLE curricula IS 'Master curriculum templates for academic programs';
COMMENT ON COLUMN curricula.version IS 'Semantic version like 1.0, 2.1, etc.';

-- ================================================
-- TABLE: courses
-- Purpose: Individual courses within curricula
-- ================================================
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    curriculum_id BIGINT NOT NULL,
    course_code VARCHAR(20) NOT NULL,
    course_name VARCHAR(255) NOT NULL,
    credits SMALLINT NOT NULL,
    course_type VARCHAR(50) NOT NULL, -- 'theory', 'lab', 'project', 'internship'
    semester SMALLINT NOT NULL,
    prerequisites JSONB DEFAULT '[]'::jsonb, -- Array of course_codes
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    syllabus TEXT,
    is_elective BOOLEAN DEFAULT FALSE,
    elective_group VARCHAR(50), -- 'group_a', 'group_b', etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE,
    CONSTRAINT chk_courses_credits CHECK (credits BETWEEN 1 AND 20),
    CONSTRAINT chk_courses_semester CHECK (semester BETWEEN 1 AND 12),
    CONSTRAINT chk_courses_type CHECK (course_type IN ('theory', 'lab', 'project', 'internship', 'seminar'))
);

CREATE UNIQUE INDEX idx_courses_code_curriculum ON courses(curriculum_id, course_code);
CREATE INDEX idx_courses_semester ON courses(curriculum_id, semester);
CREATE INDEX idx_courses_elective ON courses(curriculum_id, is_elective) WHERE is_elective = TRUE;
CREATE INDEX idx_courses_type ON courses(course_type);
CREATE INDEX idx_courses_prerequisites ON courses USING GIN (prerequisites);

COMMENT ON TABLE courses IS 'Courses belonging to curriculum templates';
COMMENT ON COLUMN courses.prerequisites IS 'JSON array of prerequisite course codes';

-- ================================================
-- TABLE: curriculum_college
-- Purpose: Junction table for curriculum adoption
-- ================================================
CREATE TABLE curriculum_college (
    id BIGSERIAL PRIMARY KEY,
    curriculum_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    adopted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) NOT NULL DEFAULT 'active', -- 'active', 'inactive', 'transitioning'
    customizations JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE,
    CONSTRAINT chk_curriculum_college_status CHECK (status IN ('active', 'inactive', 'transitioning'))
);

CREATE UNIQUE INDEX idx_curriculum_college_unique ON curriculum_college(curriculum_id, college_id, status) 
    WHERE status = 'active';
CREATE INDEX idx_curriculum_college_college ON curriculum_college(college_id, status);

COMMENT ON TABLE curriculum_college IS 'Tracks which colleges have adopted which curricula';

-- ================================================
-- TABLE: curriculum_versions
-- Purpose: Version history for curricula
-- ================================================
CREATE TABLE curriculum_versions (
    id BIGSERIAL PRIMARY KEY,
    curriculum_id BIGINT NOT NULL,
    version VARCHAR(20) NOT NULL,
    changes_summary TEXT,
    change_log JSONB,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (curriculum_id) REFERENCES curricula(id) ON DELETE CASCADE
);

CREATE INDEX idx_curriculum_versions_curriculum ON curriculum_versions(curriculum_id, created_at DESC);

-- ================================================
-- TABLE: exam_schedules
-- Purpose: Master exam schedules
-- ================================================
CREATE TABLE exam_schedules (
    id BIGSERIAL PRIMARY KEY,
    academic_year VARCHAR(20) NOT NULL, -- '2024-2025'
    semester SMALLINT NOT NULL,
    exam_type VARCHAR(50) NOT NULL, -- 'mid_term', 'end_term', 'supplementary'
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'draft', -- 'draft', 'published', 'ongoing', 'completed'
    published_at TIMESTAMP,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_exam_schedules_dates CHECK (end_date >= start_date),
    CONSTRAINT chk_exam_schedules_status CHECK (status IN ('draft', 'published', 'ongoing', 'completed')),
    CONSTRAINT chk_exam_schedules_type CHECK (exam_type IN ('mid_term', 'end_term', 'supplementary', 'improvement'))
);

CREATE INDEX idx_exam_schedules_year ON exam_schedules(academic_year, semester);
CREATE INDEX idx_exam_schedules_status ON exam_schedules(status);
CREATE INDEX idx_exam_schedules_dates ON exam_schedules(start_date, end_date);

COMMENT ON TABLE exam_schedules IS 'Master exam schedules published to colleges';

-- ================================================
-- TABLE: exams
-- Purpose: Individual exam entries
-- ================================================
CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    course_id BIGINT NOT NULL,
    exam_date DATE NOT NULL,
    start_time TIME NOT NULL,
    duration_minutes SMALLINT NOT NULL,
    total_marks SMALLINT NOT NULL,
    passing_marks SMALLINT NOT NULL,
    venue_instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (schedule_id) REFERENCES exam_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id),
    CONSTRAINT chk_exams_duration CHECK (duration_minutes BETWEEN 30 AND 300),
    CONSTRAINT chk_exams_marks CHECK (total_marks > 0 AND passing_marks > 0 AND passing_marks <= total_marks)
);

CREATE INDEX idx_exams_schedule ON exams(schedule_id, exam_date);
CREATE INDEX idx_exams_course ON exams(course_id);
CREATE INDEX idx_exams_date ON exams(exam_date);

-- ================================================
-- TABLE: exam_schedule_college
-- Purpose: Colleges following exam schedules
-- ================================================
CREATE TABLE exam_schedule_college (
    id BIGSERIAL PRIMARY KEY,
    schedule_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (schedule_id) REFERENCES exam_schedules(id) ON DELETE CASCADE,
    FOREIGN KEY (college_id) REFERENCES colleges(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_exam_schedule_college_unique ON exam_schedule_college(schedule_id, college_id);

-- ================================================
-- TABLE: question_bank
-- Purpose: Centralized question repository
-- ================================================
CREATE TABLE question_bank (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'mcq', 'short_answer', 'long_answer', 'coding'
    difficulty_level VARCHAR(20) NOT NULL, -- 'easy', 'medium', 'hard'
    topic VARCHAR(255),
    options JSONB, -- For MCQ: [{"key": "A", "text": "..."}, ...]
    correct_answer TEXT,
    explanation TEXT,
    marks SMALLINT NOT NULL DEFAULT 1,
    usage_count INTEGER DEFAULT 0,
    last_used_at TIMESTAMP,
    created_by BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    CONSTRAINT chk_question_type CHECK (question_type IN ('mcq', 'short_answer', 'long_answer', 'coding', 'true_false')),
    CONSTRAINT chk_question_difficulty CHECK (difficulty_level IN ('easy', 'medium', 'hard'))
);

CREATE INDEX idx_question_bank_course ON question_bank(course_id, difficulty_level);
CREATE INDEX idx_question_bank_topic ON question_bank(topic);
CREATE INDEX idx_question_bank_usage ON question_bank(usage_count, last_used_at);
CREATE INDEX idx_question_bank_search ON question_bank USING GIN (to_tsvector('english', question_text));

COMMENT ON TABLE question_bank IS 'Centralized repository of exam questions';

-- ================================================
-- TABLE: exam_results
-- Purpose: Student exam results (denormalized)
-- ================================================
CREATE TABLE exam_results (
    id BIGSERIAL PRIMARY KEY,
    exam_id BIGINT NOT NULL,
    student_id BIGINT NOT NULL,
    college_id BIGINT NOT NULL,
    program_id BIGINT NOT NULL,
    marks_obtained DECIMAL(5,2),
    passing_marks SMALLINT NOT NULL,
    grade VARCHAR(5),
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'completed', 'absent', 'disqualified'
    academic_year VARCHAR(20) NOT NULL,
    remarks TEXT,
    evaluated_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (exam_id) REFERENCES exams(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    CONSTRAINT chk_exam_results_status CHECK (status IN ('pending', 'completed', 'absent', 'disqualified'))
);

CREATE INDEX idx_exam_results_exam ON exam_results(exam_id);
CREATE INDEX idx_exam_results_student ON exam_results(student_id, academic_year);
CREATE INDEX idx_exam_results_college ON exam_results(college_id, academic_year);
CREATE INDEX idx_exam_results_program ON exam_results(program_id, academic_year);
CREATE INDEX idx_exam_results_performance ON exam_results(marks_obtained, grade) WHERE status = 'completed';

COMMENT ON TABLE exam_results IS 'Denormalized exam results for fast analytics';

-- ================================================
-- TABLE: approvals
-- Purpose: Approval workflows for various entities
-- ================================================
CREATE TABLE approvals (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL, -- 'curriculum', 'faculty', 'program_modification'
    entity_id BIGINT NOT NULL,
    college_id BIGINT,
    submitted_by BIGINT NOT NULL,
    reviewed_by BIGINT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'changes_requested'
    priority VARCHAR(20) NOT NULL DEFAULT 'medium', -- 'low', 'medium', 'high', 'urgent'
    changes_summary JSONB,
    reviewer_comments TEXT,
    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP,
    due_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (submitted_by) REFERENCES users(id),
    FOREIGN KEY (reviewed_by) REFERENCES users(id),
    CONSTRAINT chk_approvals_status CHECK (status IN ('pending', 'approved', 'rejected', 'changes_requested')),
    CONSTRAINT chk_approvals_priority CHECK (priority IN ('low', 'medium', 'high', 'urgent'))
);

CREATE INDEX idx_approvals_status ON approvals(status, priority);
CREATE INDEX idx_approvals_entity ON approvals(entity_type, entity_id);
CREATE INDEX idx_approvals_college ON approvals(college_id, status);
CREATE INDEX idx_approvals_due ON approvals(due_date) WHERE status = 'pending';
CREATE INDEX idx_approvals_submitted_by ON approvals(submitted_by);

COMMENT ON TABLE approvals IS 'Universal approval workflow tracking';

-- ================================================
-- TABLE: audit_logs
-- Purpose: Comprehensive audit trail
-- ================================================
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    action VARCHAR(100) NOT NULL, -- 'curriculum.created', 'exam.published'
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT,
    changes JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE INDEX idx_audit_logs_user ON audit_logs(user_id, created_at DESC);
CREATE INDEX idx_audit_logs_action ON audit_logs(action, created_at DESC);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON audit_logs(created_at DESC);

COMMENT ON TABLE audit_logs IS 'Complete activity audit trail for compliance';

-- ================================================
-- TABLE: compliance_issues
-- Purpose: Track compliance violations
-- ================================================
CREATE TABLE compliance_issues (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    issue_type VARCHAR(100) NOT NULL, -- 'curriculum_not_adopted', 'faculty_shortage', etc.
    severity VARCHAR(20) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT NOT NULL,
    resolution_deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'open', -- 'open', 'in_progress', 'resolved', 'waived'
    resolved_at TIMESTAMP,
    resolved_by BIGINT,
    resolution_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    FOREIGN KEY (resolved_by) REFERENCES users(id),
    CONSTRAINT chk_compliance_severity CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    CONSTRAINT chk_compliance_status CHECK (status IN ('open', 'in_progress', 'resolved', 'waived'))
);

CREATE INDEX idx_compliance_college ON compliance_issues(college_id, status);
CREATE INDEX idx_compliance_severity ON compliance_issues(severity, status);
CREATE INDEX idx_compliance_deadline ON compliance_issues(resolution_deadline) WHERE status IN ('open', 'in_progress');

-- ================================================
-- TABLE: academic_calendar
-- Purpose: Cross-college academic calendar
-- ================================================
CREATE TABLE academic_calendar (
    id BIGSERIAL PRIMARY KEY,
    academic_year VARCHAR(20) NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- 'semester_start', 'exam_week', 'holiday'
    event_name VARCHAR(255) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    color_code VARCHAR(7), -- Hex color for UI
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT chk_calendar_dates CHECK (end_date >= start_date)
);

CREATE INDEX idx_academic_calendar_year ON academic_calendar(academic_year);
CREATE INDEX idx_academic_calendar_dates ON academic_calendar(start_date, end_date);
CREATE INDEX idx_academic_calendar_type ON academic_calendar(event_type);

-- ================================================
-- TABLE: performance_metrics
-- Purpose: Aggregated performance data
-- ================================================
CREATE TABLE performance_metrics (
    id BIGSERIAL PRIMARY KEY,
    college_id BIGINT NOT NULL,
    program_id BIGINT,
    academic_year VARCHAR(20) NOT NULL,
    semester SMALLINT NOT NULL,
    metric_type VARCHAR(50) NOT NULL, -- 'pass_percentage', 'avg_gpa', 'dropout_rate'
    metric_value DECIMAL(10,2) NOT NULL,
    benchmark_value DECIMAL(10,2),
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (college_id) REFERENCES colleges(id),
    CONSTRAINT chk_performance_metrics_type CHECK (metric_type IN (
        'pass_percentage', 'avg_gpa', 'dropout_rate', 'placement_rate', 'research_output'
    ))
);

CREATE UNIQUE INDEX idx_performance_metrics_unique ON performance_metrics(
    college_id, program_id, academic_year, semester, metric_type
);
CREATE INDEX idx_performance_metrics_college ON performance_metrics(college_id, academic_year);
CREATE INDEX idx_performance_metrics_benchmark ON performance_metrics(metric_type, metric_value);

COMMENT ON TABLE performance_metrics IS 'Pre-aggregated metrics for fast analytics';

-- ================================================
-- VIEWS: Analytics Views
-- ================================================

-- Cross-College Performance Comparison
CREATE OR REPLACE VIEW vw_cross_college_performance AS
SELECT 
    c.id AS college_id,
    c.name AS college_name,
    pm.academic_year,
    pm.semester,
    AVG(CASE WHEN pm.metric_type = 'pass_percentage' THEN pm.metric_value END) AS pass_percentage,
    AVG(CASE WHEN pm.metric_type = 'avg_gpa' THEN pm.metric_value END) AS avg_gpa,
    AVG(CASE WHEN pm.metric_type = 'dropout_rate' THEN pm.metric_value END) AS dropout_rate,
    AVG(CASE WHEN pm.metric_type = 'placement_rate' THEN pm.metric_value END) AS placement_rate
FROM colleges c
JOIN performance_metrics pm ON c.id = pm.college_id
GROUP BY c.id, c.name, pm.academic_year, pm.semester;

-- Curriculum Adoption Status
CREATE OR REPLACE VIEW vw_curriculum_adoption AS
SELECT 
    cur.id AS curriculum_id,
    cur.program_name,
    cur.version,
    COUNT(cc.college_id) AS adopting_colleges,
    COUNT(cc.college_id) * 100.0 / (SELECT COUNT(*) FROM colleges) AS adoption_rate,
    cur.status,
    cur.effective_from
FROM curricula cur
LEFT JOIN curriculum_college cc ON cur.id = cc.curriculum_id AND cc.status = 'active'
WHERE cur.deleted_at IS NULL
GROUP BY cur.id, cur.program_name, cur.version, cur.status, cur.effective_from;

-- Pending Approvals Summary
CREATE OR REPLACE VIEW vw_pending_approvals AS
SELECT 
    entity_type,
    priority,
    COUNT(*) AS pending_count,
    AVG(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - submitted_at)) / 86400) AS avg_pending_days,
    COUNT(CASE WHEN due_date < CURRENT_DATE THEN 1 END) AS overdue_count
FROM approvals
WHERE status = 'pending'
GROUP BY entity_type, priority;

-- Compliance Dashboard
CREATE OR REPLACE VIEW vw_compliance_dashboard AS
SELECT 
    c.id AS college_id,
    c.name AS college_name,
    COUNT(CASE WHEN ci.status IN ('open', 'in_progress') THEN 1 END) AS open_issues,
    COUNT(CASE WHEN ci.severity = 'critical' AND ci.status IN ('open', 'in_progress') THEN 1 END) AS critical_issues,
    COUNT(CASE WHEN ci.resolution_deadline < CURRENT_DATE AND ci.status IN ('open', 'in_progress') THEN 1 END) AS overdue_issues
FROM colleges c
LEFT JOIN compliance_issues ci ON c.id = ci.college_id
GROUP BY c.id, c.name;

-- ================================================
-- FUNCTIONS: Helper Functions
-- ================================================

-- Calculate GPA from percentage
CREATE OR REPLACE FUNCTION calculate_gpa(marks_percentage DECIMAL)
RETURNS DECIMAL(3,2) AS $$
BEGIN
    RETURN CASE 
        WHEN marks_percentage >= 90 THEN 10.0
        WHEN marks_percentage >= 80 THEN 9.0
        WHEN marks_percentage >= 70 THEN 8.0
        WHEN marks_percentage >= 60 THEN 7.0
        WHEN marks_percentage >= 50 THEN 6.0
        WHEN marks_percentage >= 40 THEN 5.0
        ELSE 0.0
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Assign grade based on marks
CREATE OR REPLACE FUNCTION assign_grade(marks DECIMAL, total DECIMAL)
RETURNS VARCHAR(5) AS $$
DECLARE
    percentage DECIMAL;
BEGIN
    percentage := (marks / total) * 100;
    RETURN CASE 
        WHEN percentage >= 90 THEN 'A+'
        WHEN percentage >= 80 THEN 'A'
        WHEN percentage >= 70 THEN 'B+'
        WHEN percentage >= 60 THEN 'B'
        WHEN percentage >= 50 THEN 'C+'
        WHEN percentage >= 40 THEN 'C'
        ELSE 'F'
    END;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ================================================
-- TRIGGERS: Auto-update timestamps
-- ================================================

CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_curricula_updated 
    BEFORE UPDATE ON curricula 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_courses_updated 
    BEFORE UPDATE ON courses 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_exam_schedules_updated 
    BEFORE UPDATE ON exam_schedules 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER trg_exams_updated 
    BEFORE UPDATE ON exams 
    FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- ================================================
-- TRIGGER: Auto-assign grade on result update
-- ================================================

CREATE OR REPLACE FUNCTION auto_assign_grade()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.marks_obtained IS NOT NULL AND NEW.status = 'completed' THEN
        NEW.grade := assign_grade(NEW.marks_obtained, (
            SELECT total_marks FROM exams WHERE id = NEW.exam_id
        ));
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_exam_results_grade 
    BEFORE INSERT OR UPDATE ON exam_results 
    FOR EACH ROW EXECUTE FUNCTION auto_assign_grade();

-- ================================================
-- PARTITIONING: Partition audit_logs by year
-- ================================================

-- Convert to partitioned table (example for new setup)
-- CREATE TABLE audit_logs_partitioned (LIKE audit_logs INCLUDING ALL)
-- PARTITION BY RANGE (created_at);

-- CREATE TABLE audit_logs_2024 PARTITION OF audit_logs_partitioned
-- FOR VALUES FROM ('2024-01-01') TO ('2025-01-01');

-- CREATE TABLE audit_logs_2025 PARTITION OF audit_logs_partitioned
-- FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

-- ================================================
-- PERMISSIONS: Role-based access
-- ================================================

-- Super Academics Admin role can read/write all tables
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO super_academics_admin;

-- College principals can read only their college data
-- CREATE ROLE college_principal;
-- GRANT SELECT ON curricula, courses, exam_schedules, exams TO college_principal;

-- ================================================
-- MATERIALIZED VIEWS: For Heavy Analytics
-- ================================================

CREATE MATERIALIZED VIEW mv_college_performance_summary AS
SELECT 
    c.id AS college_id,
    c.name AS college_name,
    er.academic_year,
    COUNT(DISTINCT er.student_id) AS total_students,
    AVG(er.marks_obtained) AS avg_marks,
    COUNT(CASE WHEN er.marks_obtained >= er.passing_marks THEN 1 END) * 100.0 / COUNT(*) AS pass_percentage,
    AVG(calculate_gpa((er.marks_obtained / e.total_marks) * 100)) AS avg_gpa
FROM colleges c
JOIN exam_results er ON c.id = er.college_id
JOIN exams e ON er.exam_id = e.id
WHERE er.status = 'completed'
GROUP BY c.id, c.name, er.academic_year;

CREATE UNIQUE INDEX idx_mv_college_performance ON mv_college_performance_summary(college_id, academic_year);

-- Refresh materialized view daily
-- SELECT cron.schedule('refresh-college-performance', '0 2 * * *', $$REFRESH MATERIALIZED VIEW CONCURRENTLY mv_college_performance_summary$$);

-- ================================================
-- SAMPLE DATA: Initial Setup (Optional)
-- ================================================

-- Insert sample curriculum
INSERT INTO curricula (program_name, degree_type, duration_years, total_credits, version, effective_from, status, created_by, approved_by, approved_at)
VALUES 
    ('Bachelor of Computer Science', 'bachelor', 4, 180, '1.0', '2024-01-01', 'active', 1, 1, CURRENT_TIMESTAMP),
    ('Master of Business Administration', 'master', 2, 90, '1.0', '2024-01-01', 'active', 1, 1, CURRENT_TIMESTAMP);

-- Insert sample courses
INSERT INTO courses (curriculum_id, course_code, course_name, credits, course_type, semester, is_elective)
VALUES 
    (1, 'CS101', 'Introduction to Programming', 4, 'theory', 1, FALSE),
    (1, 'CS102', 'Programming Lab', 2, 'lab', 1, FALSE),
    (1, 'CS201', 'Data Structures', 4, 'theory', 2, FALSE),
    (1, 'CS301', 'Database Systems', 4, 'theory', 3, FALSE),
    (1, 'CS401', 'Machine Learning', 4, 'theory', 4, TRUE);

-- ================================================
-- END OF SCHEMA
-- ================================================
