<?php

namespace Database\Seeders;

use App\Models\Assessment;
use App\Models\AssessmentSubmission;
use App\Models\College;
use App\Models\Faculty;
use App\Models\Student;
use Illuminate\Database\Seeder;

/**
 * Assessments and Results Seeder
 * Creates sample assessments and student submissions with grades
 */
class AssessmentsAndResultsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $colleges = College::all();
        
        if ($colleges->isEmpty()) {
            $this->command->warn('⚠️  No colleges found. Please create colleges first.');
            return;
        }

        foreach ($colleges as $college) {
            $this->command->info("Creating assessments for {$college->name}...");
            
            // Get faculty members for this college
            $faculties = Faculty::where('college_id', $college->id)->get();
            
            if ($faculties->isEmpty()) {
                $this->command->warn("⚠️  No faculty found for {$college->name}. Skipping.");
                continue;
            }

            // Get students for this college
            $students = Student::where('college_id', $college->id)->get();
            
            if ($students->isEmpty()) {
                $this->command->warn("⚠️  No students found for {$college->name}. Skipping.");
                continue;
            }

            // Create assessments
            $assessments = $this->createAssessments($college, $faculties->first());
            
            // Create submissions and grades for students
            $this->createSubmissionsAndGrades($assessments, $students);
        }

        $this->command->info('✅ Assessments and results created successfully!');
    }

    private function createAssessments($college, $faculty): array
    {
        $assessmentTypes = [
            ['type' => 'mcq', 'title' => 'Midterm Exam (MCQ)', 'total_marks' => 50, 'passing_marks' => 20],
            ['type' => 'laq', 'title' => 'Final Exam (Long Answer)', 'total_marks' => 100, 'passing_marks' => 40],
            ['type' => 'saq', 'title' => 'Weekly Quiz (Short Answer)', 'total_marks' => 20, 'passing_marks' => 8],
            ['type' => 'project', 'title' => 'Course Project', 'total_marks' => 30, 'passing_marks' => 12],
        ];

        $subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
        $years = [1, 2, 3, 4];

        $assessments = [];

        foreach ($subjects as $subject) {
            foreach ($years as $year) {
                foreach ($assessmentTypes as $assessmentType) {
                    $assessment = Assessment::create([
                        'college_id' => $college->id,
                        'faculty_id' => $faculty->id,
                        'title' => "{$subject} - {$assessmentType['title']} - Year {$year}",
                        'description' => "{$assessmentType['title']} for {$subject} Year {$year}",
                        'type' => $assessmentType['type'],
                        'subject' => $subject,
                        'course' => 'Bachelor of Technology',
                        'year' => $year,
                        'total_marks' => $assessmentType['total_marks'],
                        'passing_marks' => $assessmentType['passing_marks'],
                        'duration_minutes' => $assessmentType['type'] === 'saq' ? 30 : ($assessmentType['type'] === 'mcq' ? 90 : 180),
                        'starts_at' => now()->subDays(rand(30, 90)),
                        'ends_at' => now()->subDays(rand(15, 29)),
                        'submission_type' => $assessmentType['type'] === 'project' ? 'upload' : 'typed',
                        'status' => 'completed',
                    ]);

                    $assessments[] = $assessment;
                }
            }
        }

        return $assessments;
    }

    private function createSubmissionsAndGrades($assessments, $students): void
    {
        foreach ($students as $student) {
            // Each student completes 70-90% of assessments
            $completionRate = rand(70, 90) / 100;
            $assessmentsToComplete = (int) (count($assessments) * $completionRate);
            
            $selectedAssessments = collect($assessments)
                ->random(min($assessmentsToComplete, count($assessments)));

            foreach ($selectedAssessments as $assessment) {
                // Generate realistic grades
                $totalMarks = $assessment->total_marks;
                $passingMarks = $assessment->passing_marks;
                
                // 85% students pass, 15% fail
                $willPass = rand(1, 100) <= 85;
                
                if ($willPass) {
                    // Passing grade: between passing_marks and total_marks
                    // Most students score between 60-90% of total marks
                    $minScore = max($passingMarks, (int)($totalMarks * 0.60));
                    $maxScore = (int)($totalMarks * 0.95);
                    $marksObtained = rand($minScore, $maxScore);
                } else {
                    // Failing grade: below passing_marks
                    $marksObtained = rand((int)($passingMarks * 0.5), $passingMarks - 1);
                }

                $percentage = ($marksObtained / $totalMarks) * 100;

                // Calculate grade based on percentage
                $grade = $this->calculateGrade($percentage);

                $faculty = Faculty::find($assessment->faculty_id);
                
                AssessmentSubmission::create([
                    'assessment_id' => $assessment->id,
                    'student_id' => $student->id,
                    'submitted_at' => $assessment->ends_at->subHours(rand(1, 24)),
                    'status' => 'graded',
                    'marks_obtained' => $marksObtained,
                    'feedback' => $this->generateRemarks($grade),
                    'graded_by' => $faculty ? $faculty->user_id : null,
                    'graded_at' => $assessment->ends_at->addDays(rand(1, 7)),
                ]);
            }
        }
    }

    private function calculateGrade(float $percentage): string
    {
        if ($percentage >= 90) return 'A+';
        if ($percentage >= 80) return 'A';
        if ($percentage >= 70) return 'B+';
        if ($percentage >= 60) return 'B';
        if ($percentage >= 50) return 'C+';
        if ($percentage >= 40) return 'C';
        if ($percentage >= 35) return 'D';
        return 'F';
    }

    private function generateRemarks(string $grade): string
    {
        $remarks = [
            'A+' => 'Outstanding performance! Keep up the excellent work.',
            'A' => 'Excellent work! Very well done.',
            'B+' => 'Very good performance. Keep it up!',
            'B' => 'Good work. You can do even better.',
            'C+' => 'Satisfactory performance. Work harder.',
            'C' => 'Average performance. More effort needed.',
            'D' => 'Below average. Need significant improvement.',
            'F' => 'Failed. Please study harder and seek help.',
        ];

        return $remarks[$grade] ?? 'Graded';
    }
}
