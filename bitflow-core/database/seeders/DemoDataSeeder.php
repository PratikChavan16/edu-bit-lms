<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\{
    University,
    College,
    User,
    Role,
    Student,
    Faculty,
    Notice,
    TimetableBlock,
    Department,
    LibraryResource,
    Assessment,
    AssessmentQuestion,
    AssessmentSubmission,
    DocumentFolder,
    Document,
    FeeStructure,
    FeeInvoice,
    FeePayment,
    ParentStudent
};
use Carbon\Carbon;

class DemoDataSeeder extends Seeder
{
    /**
     * Seed demo data for MVP (Maratha Vidya Prasarak Samaj).
     */
    public function run(): void
    {
        // Create MVP University
        $university = University::create([
            'name' => 'Maratha Vidya Prasarak Samaj',
            'slug' => 'mvp',
            'domain' => 'mvp.bitflow.local',
            'status' => 'live',
            'timezone' => 'Asia/Kolkata',
            'branding' => [
                'primary_color' => '#1A56DB',
                'logo_url' => 'https://cdn.bitflow.dev/mvp/logo.svg',
            ],
            'storage_quota_gb' => 500,
        ]);

        // Create MVP Engineering College
        $college = College::create([
            'university_id' => $university->id,
            'name' => 'MVP Engineering College',
            'slug' => 'mvp-engg',
            'type' => 'college',
            'code' => 'college_123',
            'status' => 'active',
            'motto' => 'Excellence in Engineering Education',
            'storage_quota_gb' => 200,
            'student_storage_quota_mb' => 1024,
        ]);

        // Create Departments
        $csDept = Department::create([
            'college_id' => $college->id,
            'name' => 'Computer Science',
            'code' => 'CS',
            'type' => 'academic',
            'status' => 'active',
        ]);

        // Create Bitflow Owner
        $bitflowOwner = User::create([
            'username' => 'bitflow_admin',
            'email' => 'admin@bitflow.nova',
            'password' => Hash::make('gMAP@2025?'),
            'first_name' => 'Bitflow',
            'last_name' => 'Admin',
            'phone' => '+91 9876543210',
            'status' => 'active',
        ]);

        $bitflowOwnerRole = Role::where('slug', 'bitflow_owner')->first();
        $bitflowOwner->roles()->attach($bitflowOwnerRole->id);

        // Create College Owner
        $collegeOwner = User::create([
            'username' => 'college_123',
            'email' => 'owner@mvp.edu',
            'password' => Hash::make('cOLLEGE@123?'),
            'first_name' => 'MVP',
            'last_name' => 'Owner',
            'phone' => '+91 9876543211',
            'status' => 'active',
        ]);

        $universityOwnerRole = Role::where('slug', 'university_owner')->first();
        $collegeOwner->roles()->attach($universityOwnerRole->id, [
            'university_id' => $university->id,
        ]);

        // Create Principal
        $principal = User::create([
            'username' => 'principal_mvp',
            'email' => 'principal@mvp.edu',
            'password' => Hash::make('Principal@123'),
            'first_name' => 'Dr. Rajesh',
            'last_name' => 'Kumar',
            'phone' => '+91 9876543212',
            'status' => 'active',
        ]);

        $collegeAdminRole = Role::where('slug', 'college_admin')->first();
        $principal->roles()->attach($collegeAdminRole->id, [
            'university_id' => $university->id,
            'college_id' => $college->id,
        ]);

        // Create Faculty
        $facultyUser = User::create([
            'username' => 'prof_sharma',
            'email' => 'sharma@mvp.edu',
            'password' => Hash::make('Faculty@123'),
            'first_name' => 'Prof. Suresh',
            'last_name' => 'Sharma',
            'phone' => '+91 9876543213',
            'status' => 'active',
        ]);

        $faculty = Faculty::create([
            'user_id' => $facultyUser->id,
            'college_id' => $college->id,
            'department_id' => $csDept->id,
            'employee_id' => 'FAC001',
            'employment_type' => 'permanent',
            'joining_date' => Carbon::now()->subYears(5),
            'teaching_load_hours' => 18.0,
            'status' => 'active',
        ]);

        $facultyRole = Role::where('slug', 'faculty')->first();
        $facultyUser->roles()->attach($facultyRole->id, [
            'university_id' => $university->id,
            'college_id' => $college->id,
        ]);

        // Create Students and Parents
        $students = [];
        $parents = [];
        
        for ($i = 1; $i <= 5; $i++) {
            $studentUser = User::create([
                'username' => "student_mvp_{$i}",
                'email' => "student{$i}@mvp.edu",
                'password' => Hash::make('Student@123'),
                'first_name' => "Student{$i}",
                'last_name' => 'Kumar',
                'phone' => "+91 987654321{$i}",
                'date_of_birth' => Carbon::now()->subYears(20),
                'status' => 'active',
            ]);

            $student = Student::create([
                'user_id' => $studentUser->id,
                'college_id' => $college->id,
                'roll_number' => "MVP2024CS{$i}",
                'admission_number' => "ADM2024{$i}",
                'course' => 'B.Tech Computer Science',
                'year' => 2,
                'section' => 'A',
                'admission_date' => Carbon::now()->subYears(2),
                'status' => 'active',
                'emergency_contact' => [
                    'name' => "Parent {$i}",
                    'phone' => "+91 8876543210",
                    'relation' => 'Father',
                ],
                'storage_used_mb' => 0,
            ]);

            $studentRole = Role::where('slug', 'student')->first();
            $studentUser->roles()->attach($studentRole->id, [
                'university_id' => $university->id,
                'college_id' => $college->id,
            ]);

            $students[] = $student;

            // Create parent for each student
            $parentUser = User::create([
                'username' => "parent_mvp_{$i}",
                'email' => "parent{$i}@gmail.com",
                'password' => Hash::make('Parent@123'),
                'first_name' => "Mr. Rajesh",
                'last_name' => "Kumar {$i}",
                'phone' => "+91 887654321{$i}",
                'status' => 'active',
            ]);

            $parentRole = Role::where('slug', 'parent')->first();
            $parentUser->roles()->attach($parentRole->id, [
                'university_id' => $university->id,
                'college_id' => $college->id,
            ]);

            $parents[] = $parentUser;

            // Create parent-student relationship
            ParentStudent::create([
                'parent_id' => $parentUser->id,
                'student_id' => $student->id,
                'relationship_type' => 'father',
                'is_primary' => true,
                'can_view_grades' => true,
                'can_view_attendance' => true,
                'can_view_fees' => true,
                'receive_notifications' => true,
            ]);
        }

        // Create a parent with multiple children (parent 1 has student 1 and 2)
        if (count($students) >= 2 && count($parents) >= 1) {
            ParentStudent::create([
                'parent_id' => $parents[0]->id,
                'student_id' => $students[1]->id,
                'relationship_type' => 'guardian',
                'is_primary' => false,
                'can_view_grades' => true,
                'can_view_attendance' => true,
                'can_view_fees' => false,
                'receive_notifications' => true,
            ]);
        }

        // Create Important Notices
        Notice::create([
            'college_id' => $college->id,
            'title' => 'Welcome to Academic Year 2024-25',
            'content' => 'All students are requested to attend the orientation program on October 15th at 10 AM in the main auditorium.',
            'priority' => 'high',
            'audience' => 'students',
            'created_by' => $principal->id,
            'published_at' => Carbon::now(),
            'is_important' => true,
        ]);

        Notice::create([
            'college_id' => $college->id,
            'title' => 'Mid-Term Examinations Schedule',
            'content' => 'Mid-term examinations will be conducted from November 1st to November 10th. Check the detailed timetable on the portal.',
            'priority' => 'high',
            'audience' => 'students',
            'created_by' => $principal->id,
            'published_at' => Carbon::now(),
            'is_important' => true,
        ]);

        Notice::create([
            'college_id' => $college->id,
            'title' => 'Library Timings Extended',
            'content' => 'The central library will remain open till 10 PM during exam season.',
            'priority' => 'normal',
            'audience' => 'all',
            'created_by' => $principal->id,
            'published_at' => Carbon::now(),
            'is_important' => false,
        ]);

        // Create Timetable Blocks
        $subjects = [
            ['subject' => 'Data Structures', 'time' => '09:00:00'],
            ['subject' => 'Database Management Systems', 'time' => '11:00:00'],
            ['subject' => 'Computer Networks', 'time' => '14:00:00'],
        ];

        foreach ($subjects as $sub) {
            TimetableBlock::create([
                'college_id' => $college->id,
                'subject' => $sub['subject'],
                'course' => 'B.Tech Computer Science',
                'year' => 2,
                'section' => 'A',
                'faculty_id' => $faculty->id,
                'day_of_week' => 'monday',
                'start_time' => $sub['time'],
                'end_time' => Carbon::parse($sub['time'])->addHours(1)->format('H:i:s'),
                'location' => 'Room 301',
                'type' => 'lecture',
                'effective_from' => Carbon::now()->subMonth(),
            ]);
        }

        // Library Resources
        $libraryResource = LibraryResource::create([
            'college_id' => $college->id,
            'title' => 'Data Structures Quick Revision Notes',
            'description' => 'Concise revision notes covering all key DS topics with diagrams.',
            'type' => 'notes',
            'subject' => 'Data Structures',
            'course' => 'B.Tech Computer Science',
            'year' => 2,
            'file_url' => 'https://cdn.bitflow.dev/resources/ds-revision.pdf',
            'file_size_bytes' => 5242880,
            'mime_type' => 'application/pdf',
            'tags' => ['data structures', 'revision'],
            'uploaded_by' => $facultyUser->id,
            'approval_status' => 'approved',
            'approved_by' => $principal->id,
            'approved_at' => Carbon::now()->subDay(),
        ]);

        // Assessments with questions and submission
        $assessment = Assessment::create([
            'college_id' => $college->id,
            'faculty_id' => $faculty->id,
            'title' => 'Data Structures Midterm',
            'description' => 'Objective assessment for DS fundamentals.',
            'type' => 'mcq',
            'subject' => 'Data Structures',
            'course' => 'B.Tech Computer Science',
            'year' => 2,
            'total_marks' => 30,
            'passing_marks' => 12,
            'duration_minutes' => 45,
            'starts_at' => Carbon::now()->addDays(7),
            'ends_at' => Carbon::now()->addDays(7)->addHours(2),
            'submission_type' => 'typed',
            'status' => 'scheduled',
        ]);

        $questions = [
            [
                'question_number' => 1,
                'question_text' => 'Which data structure uses FIFO ordering?',
                'options' => ['Stack', 'Queue', 'Tree', 'Graph'],
                'correct_answer' => 'Queue',
                'marks' => 5,
            ],
            [
                'question_number' => 2,
                'question_text' => 'What is the time complexity of binary search?',
                'options' => ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
                'correct_answer' => 'O(log n)',
                'marks' => 5,
            ],
            [
                'question_number' => 3,
                'question_text' => 'Which traversal yields sorted order in BST?',
                'options' => ['Pre-order', 'In-order', 'Post-order', 'Level-order'],
                'correct_answer' => 'In-order',
                'marks' => 5,
            ],
        ];

        foreach ($questions as $question) {
            AssessmentQuestion::create(array_merge($question, [
                'assessment_id' => $assessment->id,
            ]));
        }

        $firstStudent = Student::with('user')->where('college_id', $college->id)->first();

        if ($firstStudent) {
            AssessmentSubmission::create([
                'assessment_id' => $assessment->id,
                'student_id' => $firstStudent->id,
                'answers' => [
                    '1' => 'Queue',
                    '2' => 'O(log n)',
                    '3' => 'In-order',
                ],
                'marks_obtained' => 15,
                'status' => 'graded',
                'submitted_at' => Carbon::now()->subDay(),
                'graded_at' => Carbon::now()->subDay(),
                'graded_by' => $facultyUser->id,
                'feedback' => 'Excellent work!'
            ]);
        }

        // Document Workflows
        $admissionFolder = DocumentFolder::create([
            'college_id' => $college->id,
            'name' => 'Admission Documents',
            'description' => 'Mandatory admission-related documents for verification.',
            'owner_type' => 'admin',
            'owner_id' => $principal->id,
            'required_file_types' => ['pdf', 'jpg'],
            'due_date' => Carbon::now()->addDays(10),
            'is_required' => true,
        ]);

        if ($firstStudent) {
            Document::create([
                'folder_id' => $admissionFolder->id,
                'college_id' => $college->id,
                'student_id' => $firstStudent->id,
                'name' => 'Student1 Transfer Certificate',
                'file_path' => 'documents/tc_student1.pdf',
                'file_url' => 'https://cdn.bitflow.dev/documents/tc_student1.pdf',
                'file_size_bytes' => 2097152,
                'mime_type' => 'application/pdf',
                'uploaded_by' => $firstStudent->user_id,
                'verification_status' => 'verified',
                'verified_by' => $principal->id,
                'verified_at' => Carbon::now()->subDay(),
            ]);

            $totalStorageBytes = Document::where('student_id', $firstStudent->id)->sum('file_size_bytes');
            $firstStudent->update([
                'storage_used_mb' => (int) ceil($totalStorageBytes / 1024 / 1024),
            ]);
        }

        // Fee structures, invoices and payments
        $feeStructure = FeeStructure::create([
            'college_id' => $college->id,
            'course' => 'B.Tech Computer Science',
            'year' => 2,
            'component_name' => 'Tuition Fee',
            'amount' => 85000,
            'frequency' => 'annual',
            'effective_from' => Carbon::now()->subMonths(3),
            'effective_to' => null,
        ]);

        if ($firstStudent) {
            $invoice = FeeInvoice::create([
                'invoice_number' => 'INV-2024-0001',
                'student_id' => $firstStudent->id,
                'college_id' => $college->id,
                'academic_year' => '2024-2025',
                'term' => 'annual',
                'total_amount' => 90000,
                'paid_amount' => 45000,
                'discount' => 5000,
                'due_date' => Carbon::now()->addMonths(1),
                'status' => 'partial',
                'components' => [
                    ['name' => 'Tuition Fee', 'amount' => 85000],
                    ['name' => 'Lab Fee', 'amount' => 10000],
                ],
            ]);

            FeePayment::create([
                'receipt_number' => 'RCPT-2024-0001',
                'invoice_id' => $invoice->id,
                'amount' => 45000,
                'payment_method' => 'bank_transfer',
                'reference_number' => 'NEFT123456',
                'payment_date' => Carbon::now()->subDays(3),
                'proof_url' => 'https://cdn.bitflow.dev/payments/receipt_rcpt-2024-0001.pdf',
                'recorded_by' => $principal->id,
            ]);
        }

        $this->command->info('✓ Demo data seeded for MVP Engineering College');
        $this->command->info('  - Bitflow Owner: bitflow_admin / gMAP@2025?');
        $this->command->info('  - College Owner: college_123 / cOLLEGE@123?');
        $this->command->info('  - Principal: principal_mvp / Principal@123');
        $this->command->info('  - Faculty: prof_sharma / Faculty@123');
        $this->command->info('  - Students: student_mvp_1 to student_mvp_5 / Student@123');
        $this->command->info('  - Parents: parent_mvp_1 to parent_mvp_5 / Parent@123');
    }
}
