<?php

namespace Database\Seeders;

use App\Models\College;
use App\Models\LibraryResource;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Library Resources Seeder
 * Creates sample library resources for testing
 */
class LibraryResourcesSeeder extends Seeder
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

        // Get a faculty user to be the uploader
        $uploader = User::whereHas('roles', function ($query) {
            $query->where('slug', 'faculty');
        })->first();

        if (!$uploader) {
            // Create a sample faculty user if none exists
            $uploader = User::create([
                'username' => 'faculty_uploader',
                'email' => 'faculty@bitflow.test',
                'password' => bcrypt('password'),
                'first_name' => 'Faculty',
                'last_name' => 'Uploader',
            ]);
        }

        foreach ($colleges as $college) {
            // Create Notes
            $this->createNotes($college, $uploader);
            
            // Create Video Lectures
            $this->createVideos($college, $uploader);
            
            // Create E-books
            $this->createEbooks($college, $uploader);
            
            // Create Assessment Materials
            $this->createAssessments($college, $uploader);
        }

        $this->command->info('✅ Library resources created successfully!');
    }

    private function createNotes($college, $uploader): void
    {
        $subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
        $years = [1, 2, 3, 4];

        foreach ($subjects as $subject) {
            foreach ($years as $year) {
                LibraryResource::create([
                    'college_id' => $college->id,
                    'title' => "{$subject} Notes - Year {$year}",
                    'description' => "Comprehensive notes for {$subject} covering all topics for Year {$year}",
                    'type' => 'notes',
                    'subject' => $subject,
                    'course' => 'Bachelor of Technology',
                    'year' => $year,
                    'file_path' => "/storage/notes/{$subject}-year{$year}.pdf",
                    'file_url' => "https://example.com/notes/{$subject}-year{$year}.pdf",
                    'file_size_bytes' => rand(500000, 5000000),
                    'mime_type' => 'application/pdf',
                    'tags' => [strtolower($subject), "year{$year}", 'notes', 'study-material'],
                    'uploaded_by' => $uploader->id,
                    'approval_status' => 'approved',
                    'approved_by' => $uploader->id,
                    'approved_at' => now(),
                ]);
            }
        }
    }

    private function createVideos($college, $uploader): void
    {
        $topics = [
            ['subject' => 'Mathematics', 'title' => 'Calculus Fundamentals', 'year' => 1],
            ['subject' => 'Mathematics', 'title' => 'Linear Algebra Basics', 'year' => 2],
            ['subject' => 'Physics', 'title' => 'Quantum Mechanics Introduction', 'year' => 3],
            ['subject' => 'Physics', 'title' => 'Thermodynamics', 'year' => 2],
            ['subject' => 'Chemistry', 'title' => 'Organic Chemistry Reactions', 'year' => 2],
            ['subject' => 'Chemistry', 'title' => 'Chemical Bonding', 'year' => 1],
            ['subject' => 'Computer Science', 'title' => 'Data Structures and Algorithms', 'year' => 2],
            ['subject' => 'Computer Science', 'title' => 'Object-Oriented Programming', 'year' => 1],
            ['subject' => 'Computer Science', 'title' => 'Database Management Systems', 'year' => 3],
            ['subject' => 'English', 'title' => 'Academic Writing Skills', 'year' => 1],
        ];

        foreach ($topics as $topic) {
            LibraryResource::create([
                'college_id' => $college->id,
                'title' => $topic['title'],
                'description' => "Video lecture on {$topic['title']} - {$topic['subject']}",
                'type' => 'video',
                'subject' => $topic['subject'],
                'course' => 'Bachelor of Technology',
                'year' => $topic['year'],
                'file_path' => "/storage/videos/" . Str::slug($topic['title']) . ".mp4",
                'file_url' => "https://example.com/videos/" . Str::slug($topic['title']) . ".mp4",
                'file_size_bytes' => rand(50000000, 500000000),
                'mime_type' => 'video/mp4',
                'tags' => [strtolower($topic['subject']), "year{$topic['year']}", 'video', 'lecture'],
                'uploaded_by' => $uploader->id,
                'approval_status' => 'approved',
                'approved_by' => $uploader->id,
                'approved_at' => now(),
            ]);
        }
    }

    private function createEbooks($college, $uploader): void
    {
        $books = [
            ['title' => 'Introduction to Algorithms', 'subject' => 'Computer Science', 'year' => 2],
            ['title' => 'Calculus: Early Transcendentals', 'subject' => 'Mathematics', 'year' => 1],
            ['title' => 'Physics for Scientists and Engineers', 'subject' => 'Physics', 'year' => 1],
            ['title' => 'Organic Chemistry', 'subject' => 'Chemistry', 'year' => 2],
            ['title' => 'Database System Concepts', 'subject' => 'Computer Science', 'year' => 3],
            ['title' => 'Engineering Mathematics', 'subject' => 'Mathematics', 'year' => 1],
            ['title' => 'Quantum Physics', 'subject' => 'Physics', 'year' => 3],
            ['title' => 'The Elements of Style', 'subject' => 'English', 'year' => 1],
        ];

        foreach ($books as $book) {
            LibraryResource::create([
                'college_id' => $college->id,
                'title' => $book['title'],
                'description' => "E-book: {$book['title']}",
                'type' => 'ebook',
                'subject' => $book['subject'],
                'course' => 'Bachelor of Technology',
                'year' => $book['year'],
                'file_path' => "/storage/ebooks/" . Str::slug($book['title']) . ".pdf",
                'file_url' => "https://example.com/ebooks/" . Str::slug($book['title']) . ".pdf",
                'file_size_bytes' => rand(5000000, 50000000),
                'mime_type' => 'application/pdf',
                'tags' => [strtolower($book['subject']), "year{$book['year']}", 'ebook', 'textbook'],
                'uploaded_by' => $uploader->id,
                'approval_status' => 'approved',
                'approved_by' => $uploader->id,
                'approved_at' => now(),
            ]);
        }
    }

    private function createAssessments($college, $uploader): void
    {
        $assessments = [
            ['title' => 'Midterm Exam - Mathematics', 'subject' => 'Mathematics', 'year' => 1],
            ['title' => 'Final Exam - Physics', 'subject' => 'Physics', 'year' => 2],
            ['title' => 'Quiz - Chemistry', 'subject' => 'Chemistry', 'year' => 1],
            ['title' => 'Assignment - Computer Science', 'subject' => 'Computer Science', 'year' => 2],
            ['title' => 'Practice Problems - Mathematics', 'subject' => 'Mathematics', 'year' => 2],
            ['title' => 'Lab Report Guidelines - Chemistry', 'subject' => 'Chemistry', 'year' => 2],
        ];

        foreach ($assessments as $assessment) {
            LibraryResource::create([
                'college_id' => $college->id,
                'title' => $assessment['title'],
                'description' => "Assessment material: {$assessment['title']}",
                'type' => 'other',
                'subject' => $assessment['subject'],
                'course' => 'Bachelor of Technology',
                'year' => $assessment['year'],
                'file_path' => "/storage/assessments/" . Str::slug($assessment['title']) . ".pdf",
                'file_url' => "https://example.com/assessments/" . Str::slug($assessment['title']) . ".pdf",
                'file_size_bytes' => rand(100000, 2000000),
                'mime_type' => 'application/pdf',
                'tags' => [strtolower($assessment['subject']), "year{$assessment['year']}", 'assessment', 'exam'],
                'uploaded_by' => $uploader->id,
                'approval_status' => 'approved',
                'approved_by' => $uploader->id,
                'approved_at' => now(),
            ]);
        }
    }
}
