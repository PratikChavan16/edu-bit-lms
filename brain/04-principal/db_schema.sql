-- Principal Portal - Database Schema (PostgreSQL 16)
-- Version: 2.0 | Updated: 2025-10-25
-- Note: All tables are college-scoped (university_id, college_id). Enable RLS on each.

BEGIN;

-- Helper: audit table (generic)
CREATE TABLE IF NOT EXISTS audits (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	actor_id BIGINT,
	subject_type TEXT NOT NULL,
	subject_id BIGINT,
	action TEXT NOT NULL,
	reason TEXT,
	meta JSONB DEFAULT '{}'::jsonb,
	ip INET,
	user_agent TEXT,
	created_at TIMESTAMPTZ DEFAULT now()
);

-- Departments
CREATE TABLE IF NOT EXISTS departments (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	name TEXT NOT NULL,
	hod_id BIGINT,
	faculty_count INT DEFAULT 0,
	student_count INT DEFAULT 0,
	budget_allocated NUMERIC(14,2) DEFAULT 0,
	score NUMERIC(5,2) DEFAULT 0,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_departments_scope ON departments(university_id, college_id);

-- Programs
CREATE TABLE IF NOT EXISTS programs (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	name TEXT NOT NULL,
	seats INT NOT NULL,
	curriculum_version TEXT,
	status TEXT NOT NULL DEFAULT 'active',
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_programs_scope ON programs(university_id, college_id);

-- Faculty
CREATE TABLE IF NOT EXISTS faculty (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
	name TEXT NOT NULL,
	email TEXT UNIQUE,
	designation TEXT,
	workload_hours_per_week NUMERIC(5,2) DEFAULT 0,
	status TEXT NOT NULL DEFAULT 'active', -- active|on_leave|resigned
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_faculty_scope ON faculty(university_id, college_id);
CREATE INDEX IF NOT EXISTS idx_faculty_dept ON faculty(department_id);

CREATE TABLE IF NOT EXISTS faculty_leaves (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	faculty_id BIGINT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
	type TEXT NOT NULL CHECK (type IN ('annual','medical','emergency','sabbatical')),
	from_date DATE NOT NULL,
	to_date DATE NOT NULL,
	days NUMERIC(5,2) NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending',
	remarks TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_faculty_leaves_scope ON faculty_leaves(university_id, college_id);
CREATE INDEX IF NOT EXISTS idx_faculty_leaves_faculty ON faculty_leaves(faculty_id);

CREATE TABLE IF NOT EXISTS faculty_evaluations (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	faculty_id BIGINT NOT NULL REFERENCES faculty(id) ON DELETE CASCADE,
	cycle TEXT NOT NULL,
	teaching NUMERIC(3,2) DEFAULT 0,
	research NUMERIC(3,2) DEFAULT 0,
	service NUMERIC(3,2) DEFAULT 0,
	innovation NUMERIC(3,2) DEFAULT 0,
	leadership NUMERIC(3,2) DEFAULT 0,
	avg NUMERIC(3,2) GENERATED ALWAYS AS ((teaching+research+service+innovation+leadership)/5) STORED,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_faculty_eval_scope ON faculty_evaluations(university_id, college_id);

-- Students (view only in Principal portal): create a college-scoped view
-- Assumes a core table students exists managed by Super Admin portal.
CREATE OR REPLACE VIEW students_college_view AS
	SELECT id, university_id, college_id, program_id, roll_no, name, email, year, section, cgpa, attendance_pct
	FROM students -- core table
	WHERE university_id = current_setting('app.university_id', true)::int
		AND college_id = current_setting('app.college_id', true)::int;

-- Admissions
CREATE TABLE IF NOT EXISTS admission_applications (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
	applicant_name TEXT NOT NULL,
	score NUMERIC(6,2) DEFAULT 0,
	docs_verified BOOLEAN DEFAULT false,
	status TEXT NOT NULL DEFAULT 'applied', -- applied|verified|shortlisted|admitted|enrolled|rejected
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_admissions_scope ON admission_applications(university_id, college_id);
CREATE INDEX IF NOT EXISTS idx_admissions_program ON admission_applications(program_id);

CREATE TABLE IF NOT EXISTS merit_list_entries (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
	application_id BIGINT NOT NULL REFERENCES admission_applications(id) ON DELETE CASCADE,
	rank INT NOT NULL,
	weighted_score NUMERIC(6,2) NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS counseling_sessions (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	program_id BIGINT NOT NULL REFERENCES programs(id) ON DELETE CASCADE,
	round INT NOT NULL,
	date DATE NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS seat_allocations (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	application_id BIGINT NOT NULL REFERENCES admission_applications(id) ON DELETE CASCADE,
	seat_no TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'allocated', -- allocated|waitlisted|canceled
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);

-- Infrastructure
CREATE TABLE IF NOT EXISTS rooms (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	name TEXT NOT NULL,
	type TEXT NOT NULL CHECK (type IN ('classroom','lab','seminar','auditorium')),
	capacity INT NOT NULL,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_rooms_scope ON rooms(university_id, college_id);

CREATE TABLE IF NOT EXISTS maintenance_requests (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	title TEXT NOT NULL,
	category TEXT,
	priority TEXT NOT NULL CHECK (priority IN ('low','medium','high')),
	status TEXT NOT NULL DEFAULT 'open', -- open|assigned|completed|approved
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_maint_scope ON maintenance_requests(university_id, college_id);

-- Finance
CREATE TABLE IF NOT EXISTS expense_requests (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
	amount NUMERIC(14,2) NOT NULL,
	category TEXT NOT NULL,
	status TEXT NOT NULL DEFAULT 'pending', -- pending|approved|escalated|rejected
	remarks TEXT,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_expense_scope ON expense_requests(university_id, college_id);
CREATE INDEX IF NOT EXISTS idx_expense_status ON expense_requests(status);

-- Communication
CREATE TABLE IF NOT EXISTS announcements (
	id BIGSERIAL PRIMARY KEY,
	university_id INT NOT NULL,
	college_id INT NOT NULL,
	audience TEXT NOT NULL CHECK (audience IN ('college','department','program','targeted')),
	title TEXT NOT NULL,
	message TEXT NOT NULL,
	sent_at TIMESTAMPTZ,
	created_at TIMESTAMPTZ DEFAULT now(),
	updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_ann_scope ON announcements(university_id, college_id);

-- Row Level Security (RLS): Example policies (repeat for all college-scoped tables)
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_departments_isolated ON departments
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_programs_isolated ON programs
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE faculty ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_faculty_isolated ON faculty
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE faculty_leaves ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_faculty_leaves_isolated ON faculty_leaves
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE faculty_evaluations ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_faculty_eval_isolated ON faculty_evaluations
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE admission_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_admissions_isolated ON admission_applications
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE expense_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_expense_isolated ON expense_requests
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
CREATE POLICY IF NOT EXISTS pol_ann_isolated ON announcements
	USING (university_id = current_setting('app.university_id', true)::int
		 AND college_id = current_setting('app.college_id', true)::int);

COMMIT;
