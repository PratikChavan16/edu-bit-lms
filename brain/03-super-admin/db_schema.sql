-- Super Admin Portal - Database Schema
-- Version: 2.0
-- Last Updated: October 25, 2025
-- Scope: Academic calendar, courses, timetables, exams, user management

-- ============================================================
-- ACADEMIC CALENDAR TABLES
-- ============================================================

-- 1. academic_years
CREATE TABLE academic_years (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    name VARCHAR(20) NOT NULL, -- e.g., "2025-26"
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    published_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (university_id, name)
);

CREATE INDEX idx_academic_years_university_id ON academic_years(university_id);
CREATE INDEX idx_academic_years_status ON academic_years(status);

-- 2. semesters
CREATE TABLE semesters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    
    name VARCHAR(50) NOT NULL, -- e.g., "Odd Semester", "Even Semester"
    type VARCHAR(20) NOT NULL CHECK (type IN ('odd', 'even', 'summer')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    registration_start DATE NOT NULL,
    registration_end DATE NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_semesters_university_id ON semesters(university_id);
CREATE INDEX idx_semesters_academic_year_id ON semesters(academic_year_id);

-- 3. holidays
CREATE TABLE holidays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    name VARCHAR(200) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('national', 'regional', 'university')),
    applies_to_college_id UUID REFERENCES colleges(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_holidays_university_id ON holidays(university_id);
CREATE INDEX idx_holidays_date ON holidays(date);

-- ============================================================
-- COURSE MANAGEMENT TABLES
-- ============================================================

-- 4. courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    
    code VARCHAR(20) NOT NULL,
    name VARCHAR(255) NOT NULL,
    credits INTEGER NOT NULL CHECK (credits BETWEEN 1 AND 6),
    type VARCHAR(20) NOT NULL CHECK (type IN ('theory', 'lab', 'practical', 'project')),
    description TEXT,
    syllabus TEXT,
    
    hours_per_week INTEGER NOT NULL DEFAULT 4,
    
    -- Enrollment limits
    min_students INTEGER NOT NULL DEFAULT 20,
    max_students INTEGER NOT NULL DEFAULT 60,
    waitlist_size INTEGER NOT NULL DEFAULT 10,
    
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (university_id, code)
);

CREATE INDEX idx_courses_university_id ON courses(university_id);
CREATE INDEX idx_courses_college_id ON courses(college_id);
CREATE INDEX idx_courses_department_id ON courses(department_id);
CREATE INDEX idx_courses_code ON courses(code);
CREATE INDEX idx_courses_status ON courses(status);

-- 5. course_prerequisites
CREATE TABLE course_prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    prerequisite_course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (course_id, prerequisite_course_id)
);

CREATE INDEX idx_course_prerequisites_course_id ON course_prerequisites(course_id);
CREATE INDEX idx_course_prerequisites_prereq_id ON course_prerequisites(prerequisite_course_id);

-- 6. course_curriculum
-- Maps courses to programs, years, and semesters
CREATE TABLE course_curriculum (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    year INTEGER NOT NULL CHECK (year BETWEEN 1 AND 4), -- 1st, 2nd, 3rd, 4th year
    is_elective BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (program_id, semester_id, course_id, year)
);

CREATE INDEX idx_course_curriculum_university_id ON course_curriculum(university_id);
CREATE INDEX idx_course_curriculum_program_id ON course_curriculum(program_id);
CREATE INDEX idx_course_curriculum_semester_id ON course_curriculum(semester_id);
CREATE INDEX idx_course_curriculum_course_id ON course_curriculum(course_id);

-- 7. course_faculty
-- Faculty assigned to teach courses
CREATE TABLE course_faculty (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    
    section VARCHAR(10), -- e.g., "A", "B"
    role VARCHAR(20) NOT NULL DEFAULT 'coordinator' CHECK (role IN ('coordinator', 'co-instructor')),
    hours_per_week INTEGER NOT NULL DEFAULT 4,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (course_id, faculty_id, semester_id, section)
);

CREATE INDEX idx_course_faculty_university_id ON course_faculty(university_id);
CREATE INDEX idx_course_faculty_course_id ON course_faculty(course_id);
CREATE INDEX idx_course_faculty_faculty_id ON course_faculty(faculty_id);
CREATE INDEX idx_course_faculty_semester_id ON course_faculty(semester_id);

-- ============================================================
-- TIMETABLE MANAGEMENT TABLES
-- ============================================================

-- 8. rooms
CREATE TABLE rooms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    
    name VARCHAR(50) NOT NULL, -- e.g., "Room 201", "Lab 305"
    building VARCHAR(100),
    floor INTEGER,
    capacity INTEGER NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('classroom', 'lab', 'auditorium', 'seminar')),
    
    -- Facilities
    has_projector BOOLEAN NOT NULL DEFAULT false,
    has_ac BOOLEAN NOT NULL DEFAULT false,
    has_computers BOOLEAN NOT NULL DEFAULT false,
    
    status VARCHAR(20) NOT NULL DEFAULT 'available' CHECK (status IN ('available', 'maintenance', 'unavailable')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_rooms_university_id ON rooms(university_id);
CREATE INDEX idx_rooms_college_id ON rooms(college_id);
CREATE INDEX idx_rooms_type ON rooms(type);

-- 9. timetables
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
    
    year VARCHAR(20) NOT NULL, -- "First Year", "Second Year", etc.
    section VARCHAR(10) NOT NULL, -- "A", "B", "C"
    
    status VARCHAR(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    conflicts JSONB, -- Array of detected conflicts
    
    generated_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (college_id, semester_id, program_id, year, section)
);

CREATE INDEX idx_timetables_university_id ON timetables(university_id);
CREATE INDEX idx_timetables_college_id ON timetables(college_id);
CREATE INDEX idx_timetables_semester_id ON timetables(semester_id);
CREATE INDEX idx_timetables_status ON timetables(status);

-- 10. timetable_slots
CREATE TABLE timetable_slots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    
    day VARCHAR(10) NOT NULL CHECK (day IN ('monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    room_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    
    has_conflict BOOLEAN NOT NULL DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timetable_slots_timetable_id ON timetable_slots(timetable_id);
CREATE INDEX idx_timetable_slots_course_id ON timetable_slots(course_id);
CREATE INDEX idx_timetable_slots_faculty_id ON timetable_slots(faculty_id);
CREATE INDEX idx_timetable_slots_room_id ON timetable_slots(room_id);
CREATE INDEX idx_timetable_slots_day_time ON timetable_slots(day, start_time);

-- ============================================================
-- EXAMINATION MANAGEMENT TABLES
-- ============================================================

-- 11. exams
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    semester_id UUID NOT NULL REFERENCES semesters(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    
    exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('mid-term', 'end-term', 'supplementary', 're-evaluation')),
    
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    duration_minutes INTEGER NOT NULL,
    
    max_marks INTEGER NOT NULL DEFAULT 100,
    passing_marks INTEGER NOT NULL DEFAULT 40,
    
    status VARCHAR(20) NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'published', 'completed', 'cancelled')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exams_university_id ON exams(university_id);
CREATE INDEX idx_exams_semester_id ON exams(semester_id);
CREATE INDEX idx_exams_course_id ON exams(course_id);
CREATE INDEX idx_exams_date ON exams(date);
CREATE INDEX idx_exams_status ON exams(status);

-- 12. exam_hall_allocations
CREATE TABLE exam_hall_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    hall_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    
    capacity INTEGER NOT NULL, -- Effective capacity with spacing
    allocated_students INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_exam_hall_allocations_exam_id ON exam_hall_allocations(exam_id);
CREATE INDEX idx_exam_hall_allocations_hall_id ON exam_hall_allocations(hall_id);

-- 13. invigilators
CREATE TABLE invigilators (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    faculty_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hall_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
    
    duty_type VARCHAR(20) NOT NULL DEFAULT 'invigilator' CHECK (duty_type IN ('invigilator', 'chief-invigilator')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (exam_id, faculty_id)
);

CREATE INDEX idx_invigilators_exam_id ON invigilators(exam_id);
CREATE INDEX idx_invigilators_faculty_id ON invigilators(faculty_id);

-- 14. seating_arrangements
CREATE TABLE seating_arrangements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hall_id UUID NOT NULL REFERENCES rooms(id) ON DELETE CASCADE,
    
    seat_number INTEGER NOT NULL,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (exam_id, student_id)
);

CREATE INDEX idx_seating_arrangements_exam_id ON seating_arrangements(exam_id);
CREATE INDEX idx_seating_arrangements_student_id ON seating_arrangements(student_id);
CREATE INDEX idx_seating_arrangements_hall_id ON seating_arrangements(hall_id);

-- 15. grades
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    exam_id UUID NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    marks_obtained DECIMAL(5,2),
    grade VARCHAR(2), -- A+, A, B+, B, C, D, F
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'verified', 'published')),
    
    submitted_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Faculty who submitted
    verified_by UUID REFERENCES users(id) ON DELETE SET NULL, -- Super Admin who verified
    
    submitted_at TIMESTAMPTZ,
    verified_at TIMESTAMPTZ,
    published_at TIMESTAMPTZ,
    
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE (exam_id, student_id)
);

CREATE INDEX idx_grades_university_id ON grades(university_id);
CREATE INDEX idx_grades_exam_id ON grades(exam_id);
CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_status ON grades(status);

-- ============================================================
-- ACTIVITY LOGGING
-- ============================================================

-- 16. activity_logs
CREATE TABLE activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    action VARCHAR(100) NOT NULL, -- e.g., "courses.create", "timetable.publish"
    resource_type VARCHAR(50), -- e.g., "Course", "Timetable"
    resource_id UUID,
    
    changes JSONB, -- Before/after data
    
    ip_address VARCHAR(45),
    user_agent TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activity_logs_university_id ON activity_logs(university_id);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_action ON activity_logs(action);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at);

-- Auto-delete logs older than 90 days
CREATE OR REPLACE FUNCTION delete_old_activity_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM activity_logs WHERE created_at < NOW() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- ROW-LEVEL SECURITY POLICIES
-- ============================================================

ALTER TABLE academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE semesters ENABLE ROW LEVEL SECURITY;
ALTER TABLE holidays ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_curriculum ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Policies: Users can only access data from their university
CREATE POLICY academic_years_isolation ON academic_years
    FOR ALL USING (university_id = current_setting('app.current_university_id')::UUID);

CREATE POLICY semesters_isolation ON semesters
    FOR ALL USING (university_id = current_setting('app.current_university_id')::UUID);

CREATE POLICY courses_isolation ON courses
    FOR ALL USING (university_id = current_setting('app.current_university_id')::UUID);

CREATE POLICY timetables_isolation ON timetables
    FOR ALL USING (university_id = current_setting('app.current_university_id')::UUID);

CREATE POLICY exams_isolation ON exams
    FOR ALL USING (university_id = current_setting('app.current_university_id')::UUID);

-- ============================================================
-- SAMPLE DATA (FOR TESTING)
-- ============================================================

-- Insert sample academic year
INSERT INTO academic_years (university_id, name, start_date, end_date, status)
VALUES (
    (SELECT id FROM universities WHERE slug = 'prestigious-university' LIMIT 1),
    '2025-26',
    '2025-08-01',
    '2026-07-31',
    'active'
);

-- Insert sample semesters
INSERT INTO semesters (university_id, academic_year_id, name, type, start_date, end_date, registration_start, registration_end)
VALUES 
(
    (SELECT id FROM universities WHERE slug = 'prestigious-university' LIMIT 1),
    (SELECT id FROM academic_years WHERE name = '2025-26' LIMIT 1),
    'Odd Semester',
    'odd',
    '2025-08-01',
    '2025-12-20',
    '2025-07-15',
    '2025-07-31'
),
(
    (SELECT id FROM universities WHERE slug = 'prestigious-university' LIMIT 1),
    (SELECT id FROM academic_years WHERE name = '2025-26' LIMIT 1),
    'Even Semester',
    'even',
    '2026-01-01',
    '2026-05-20',
    '2025-12-20',
    '2025-12-31'
);

-- ============================================================
-- END OF SCHEMA
-- ============================================================
