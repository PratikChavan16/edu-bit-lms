# Student Portal - Database Schema

**Version**: 2.0  
**Last Updated**: October 25, 2025

---

## Student-Related Tables

This document contains the database tables specifically used by the Student Portal.

---

### 1. students

```sql
CREATE TABLE students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    roll_number VARCHAR(50) NOT NULL,
    enrollment_year INTEGER NOT NULL,
    current_semester INTEGER NOT NULL DEFAULT 1,
    status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'on_leave', 'graduated', 'suspended', 'dropped_out')),
    
    -- Personal Information
    dob DATE NOT NULL,
    gender VARCHAR(10) CHECK (gender IN ('male', 'female', 'other')),
    blood_group VARCHAR(5),
    address TEXT,
    
    -- Guardian Information
    guardian_name VARCHAR(255),
    guardian_phone VARCHAR(20),
    guardian_relationship VARCHAR(50),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(college_id, roll_number)
);

CREATE INDEX idx_students_user_id ON students(user_id);
CREATE INDEX idx_students_college_id ON students(college_id);
CREATE INDEX idx_students_department_id ON students(department_id);
CREATE INDEX idx_students_university_id ON students(university_id);
CREATE INDEX idx_students_status ON students(status);
CREATE INDEX idx_students_enrollment_year ON students(enrollment_year);
```

---

### 2. enrollments

```sql
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'dropped', 'completed', 'failed')),
    
    final_grade VARCHAR(5),
    final_marks NUMERIC(5, 2),
    grade_points NUMERIC(3, 2),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, course_id, academic_year_id)
);

CREATE INDEX idx_enrollments_student_id ON enrollments(student_id);
CREATE INDEX idx_enrollments_course_id ON enrollments(course_id);
CREATE INDEX idx_enrollments_academic_year_id ON enrollments(academic_year_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
```

---

### 3. attendance

```sql
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    date DATE NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('present', 'absent', 'late', 'excused')),
    
    marked_by UUID NOT NULL REFERENCES users(id),
    marked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(student_id, course_id, date)
);

CREATE INDEX idx_attendance_student_id ON attendance(student_id);
CREATE INDEX idx_attendance_course_id ON attendance(course_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_attendance_status ON attendance(status);
CREATE INDEX idx_attendance_student_course ON attendance(student_id, course_id);
```

---

### 4. grades

```sql
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    exam_type VARCHAR(20) NOT NULL CHECK (exam_type IN ('assignment', 'quiz', 'mid_term', 'end_term', 'project', 'practical')),
    component_name VARCHAR(255) NOT NULL,
    
    marks_obtained NUMERIC(6, 2) NOT NULL CHECK (marks_obtained >= 0),
    max_marks NUMERIC(6, 2) NOT NULL CHECK (max_marks > 0),
    weightage NUMERIC(5, 2) NOT NULL CHECK (weightage >= 0 AND weightage <= 100),
    
    grade VARCHAR(5),
    grade_points NUMERIC(3, 2),
    
    graded_by UUID NOT NULL REFERENCES users(id),
    graded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    feedback TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CHECK (marks_obtained <= max_marks)
);

CREATE INDEX idx_grades_student_id ON grades(student_id);
CREATE INDEX idx_grades_course_id ON grades(course_id);
CREATE INDEX idx_grades_exam_type ON grades(exam_type);
CREATE INDEX idx_grades_graded_at ON grades(graded_at);
```

---

### 5. assignments

```sql
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    instructions TEXT,
    max_marks NUMERIC(6, 2) NOT NULL CHECK (max_marks > 0),
    
    due_date TIMESTAMPTZ NOT NULL,
    posted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    attachment_url TEXT,
    attachment_file_name VARCHAR(255),
    
    allow_late_submission BOOLEAN DEFAULT false,
    late_penalty_percentage NUMERIC(5, 2) DEFAULT 0,
    
    created_by UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_assignments_course_id ON assignments(course_id);
CREATE INDEX idx_assignments_due_date ON assignments(due_date);
CREATE INDEX idx_assignments_posted_at ON assignments(posted_at);
```

---

### 6. submissions

```sql
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    file_url TEXT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_late BOOLEAN DEFAULT false,
    
    status VARCHAR(20) NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'graded', 'returned', 'resubmit_required')),
    
    marks_obtained NUMERIC(6, 2) CHECK (marks_obtained >= 0),
    grade VARCHAR(5),
    grade_points NUMERIC(3, 2),
    feedback TEXT,
    
    graded_by UUID REFERENCES users(id),
    graded_at TIMESTAMPTZ,
    
    comments TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(assignment_id, student_id)
);

CREATE INDEX idx_submissions_assignment_id ON submissions(assignment_id);
CREATE INDEX idx_submissions_student_id ON submissions(student_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at);
```

---

### 7. fee_structures

```sql
CREATE TABLE fee_structures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    college_id UUID NOT NULL REFERENCES colleges(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    fee_type VARCHAR(50) NOT NULL CHECK (fee_type IN ('tuition', 'lab', 'library', 'exam', 'sports', 'hostel', 'transport', 'other')),
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    
    semester INTEGER,
    due_date DATE NOT NULL,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_structures_college_id ON fee_structures(college_id);
CREATE INDEX idx_fee_structures_academic_year_id ON fee_structures(academic_year_id);
CREATE INDEX idx_fee_structures_due_date ON fee_structures(due_date);
```

---

### 8. invoices

```sql
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    invoice_number VARCHAR(50) NOT NULL UNIQUE,
    
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (paid_amount >= 0),
    balance NUMERIC(10, 2) NOT NULL GENERATED ALWAYS AS (total_amount - paid_amount) STORED,
    
    due_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'partial', 'paid', 'overdue', 'cancelled')),
    
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CHECK (paid_amount <= total_amount)
);

CREATE INDEX idx_invoices_student_id ON invoices(student_id);
CREATE INDEX idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_invoices_due_date ON invoices(due_date);
```

---

### 9. fee_payments

```sql
CREATE TABLE fee_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payment_method VARCHAR(50) NOT NULL CHECK (payment_method IN ('online', 'cash', 'cheque', 'bank_transfer', 'upi', 'card')),
    
    transaction_id VARCHAR(255),
    transaction_reference VARCHAR(255),
    
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    
    receipt_number VARCHAR(50) UNIQUE,
    receipt_url TEXT,
    
    paid_at TIMESTAMPTZ,
    
    remarks TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_fee_payments_student_id ON fee_payments(student_id);
CREATE INDEX idx_fee_payments_invoice_id ON fee_payments(invoice_id);
CREATE INDEX idx_fee_payments_transaction_id ON fee_payments(transaction_id);
CREATE INDEX idx_fee_payments_status ON fee_payments(status);
CREATE INDEX idx_fee_payments_paid_at ON fee_payments(paid_at);
```

---

### 10. timetables

```sql
CREATE TABLE timetables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_year_id UUID NOT NULL REFERENCES academic_years(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    name VARCHAR(255) NOT NULL,
    effective_from DATE NOT NULL,
    effective_to DATE,
    
    is_active BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CHECK (effective_to IS NULL OR effective_to > effective_from)
);

CREATE INDEX idx_timetables_course_id ON timetables(course_id);
CREATE INDEX idx_timetables_academic_year_id ON timetables(academic_year_id);
CREATE INDEX idx_timetables_effective_from ON timetables(effective_from);
```

---

### 11. class_schedules

```sql
CREATE TABLE class_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    timetable_id UUID NOT NULL REFERENCES timetables(id) ON DELETE CASCADE,
    faculty_id UUID REFERENCES faculty(id) ON DELETE SET NULL,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0 = Sunday, 6 = Saturday
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    
    room_number VARCHAR(50),
    building VARCHAR(100),
    class_type VARCHAR(20) CHECK (class_type IN ('lecture', 'tutorial', 'lab', 'practical')),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CHECK (end_time > start_time)
);

CREATE INDEX idx_class_schedules_timetable_id ON class_schedules(timetable_id);
CREATE INDEX idx_class_schedules_faculty_id ON class_schedules(faculty_id);
CREATE INDEX idx_class_schedules_day_of_week ON class_schedules(day_of_week);
```

---

### 12. notifications

```sql
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    type VARCHAR(50) NOT NULL CHECK (type IN ('academic', 'financial', 'administrative', 'system', 'announcement')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    
    link TEXT,
    
    read_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read_at ON notifications(read_at);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_unread ON notifications(user_id, read_at) WHERE read_at IS NULL;
```

---

### 13. parent_links

```sql
CREATE TABLE parent_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    university_id UUID NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    
    relationship VARCHAR(50) NOT NULL CHECK (relationship IN ('father', 'mother', 'guardian', 'other')),
    is_primary BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    UNIQUE(parent_user_id, student_id)
);

CREATE INDEX idx_parent_links_parent_user_id ON parent_links(parent_user_id);
CREATE INDEX idx_parent_links_student_id ON parent_links(student_id);
```

---

## Sample Queries

### Get Student Dashboard Data

```sql
-- Get student with stats
SELECT 
    s.*,
    u.name,
    u.email,
    u.avatar_url,
    c.name AS college_name,
    d.name AS department_name,
    (SELECT ROUND(AVG(CASE WHEN a.status = 'present' THEN 100.0 ELSE 0.0 END), 2)
     FROM attendance a
     WHERE a.student_id = s.id) AS attendance_percentage,
    (SELECT COUNT(*)
     FROM submissions sub
     JOIN assignments asn ON sub.assignment_id = asn.id
     WHERE sub.student_id = s.id 
       AND sub.status = 'submitted'
       AND sub.graded_at IS NULL) AS pending_grading,
    (SELECT SUM(i.balance)
     FROM invoices i
     WHERE i.student_id = s.id 
       AND i.status IN ('pending', 'partial', 'overdue')) AS outstanding_fees
FROM students s
JOIN users u ON s.user_id = u.id
JOIN colleges c ON s.college_id = c.id
JOIN departments d ON s.department_id = d.id
WHERE s.id = $1;
```

### Get Course Attendance

```sql
-- Attendance for a specific course
SELECT 
    a.*,
    c.code AS course_code,
    c.name AS course_name,
    u.name AS marked_by_name
FROM attendance a
JOIN courses c ON a.course_id = c.id
JOIN users u ON a.marked_by = u.id
WHERE a.student_id = $1 
  AND a.course_id = $2
ORDER BY a.date DESC;

-- Attendance summary
SELECT 
    c.id,
    c.code,
    c.name,
    COUNT(*) AS total_classes,
    SUM(CASE WHEN a.status = 'present' THEN 1 ELSE 0 END) AS present,
    SUM(CASE WHEN a.status = 'absent' THEN 1 ELSE 0 END) AS absent,
    ROUND(AVG(CASE WHEN a.status = 'present' THEN 100.0 ELSE 0.0 END), 2) AS percentage
FROM enrollments e
JOIN courses c ON e.course_id = c.id
LEFT JOIN attendance a ON a.student_id = e.student_id AND a.course_id = e.course_id
WHERE e.student_id = $1 
  AND e.status = 'enrolled'
GROUP BY c.id, c.code, c.name;
```

### Calculate CGPA

```sql
-- Semester-wise GPA
SELECT 
    ay.year,
    e.semester,
    SUM(c.credits * e.grade_points) / NULLIF(SUM(c.credits), 0) AS gpa,
    SUM(c.credits) AS total_credits
FROM enrollments e
JOIN courses c ON e.course_id = c.id
JOIN academic_years ay ON e.academic_year_id = ay.id
WHERE e.student_id = $1 
  AND e.status = 'completed'
  AND e.grade_points IS NOT NULL
GROUP BY ay.year, e.semester
ORDER BY ay.year, e.semester;

-- Overall CGPA
SELECT 
    ROUND(SUM(c.credits * e.grade_points) / NULLIF(SUM(c.credits), 0), 2) AS cgpa,
    SUM(c.credits) AS total_credits
FROM enrollments e
JOIN courses c ON e.course_id = c.id
WHERE e.student_id = $1 
  AND e.status = 'completed'
  AND e.grade_points IS NOT NULL;
```

---

**🗄️ This schema supports all Student Portal features with optimal performance through strategic indexing.**
