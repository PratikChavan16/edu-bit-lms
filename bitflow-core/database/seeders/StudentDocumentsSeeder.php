<?php

namespace Database\Seeders;

use App\Models\College;
use App\Models\Document;
use App\Models\DocumentFolder;
use App\Models\Student;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

/**
 * Student Documents Seeder
 * Creates sample document folders and student documents
 */
class StudentDocumentsSeeder extends Seeder
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
            $this->command->info("Creating document folders for {$college->name}...");
            
            // Create standard document folders
            $folders = $this->createDocumentFolders($college);
            
            // Get students for this college
            $students = Student::where('college_id', $college->id)->get();
            
            if ($students->isEmpty()) {
                $this->command->warn("⚠️  No students found for {$college->name}. Skipping.");
                continue;
            }

            // Create documents for students
            $this->createStudentDocuments($students, $folders);
        }

        $this->command->info('✅ Student documents created successfully!');
    }

    private function createDocumentFolders($college): array
    {
        $folderTypes = [
            ['name' => 'Academic Records', 'description' => 'Transcripts, mark sheets, and certificates'],
            ['name' => 'Assignments', 'description' => 'Submitted assignments and projects'],
            ['name' => 'Certificates', 'description' => 'Course completion and achievement certificates'],
            ['name' => 'ID Documents', 'description' => 'Identity proofs and college IDs'],
            ['name' => 'Fee Receipts', 'description' => 'Payment receipts and invoices'],
            ['name' => 'Medical Records', 'description' => 'Health certificates and medical documents'],
            ['name' => 'Miscellaneous', 'description' => 'Other important documents'],
        ];

        $folders = [];

        foreach ($folderTypes as $folderData) {
            $folder = DocumentFolder::create([
                'college_id' => $college->id,
                'name' => $folderData['name'],
                'description' => $folderData['description'],
                'owner_type' => 'admin',
                'is_required' => false,
            ]);

            $folders[] = $folder;
        }

        return $folders;
    }

    private function createStudentDocuments($students, $folders): void
    {
        $documentTemplates = [
            ['name' => 'Transcript Semester {semester}', 'folder' => 'Academic Records', 'type' => 'transcript'],
            ['name' => 'Assignment Submission - {subject}', 'folder' => 'Assignments', 'type' => 'assignment'],
            ['name' => 'Course Completion Certificate', 'folder' => 'Certificates', 'type' => 'certificate'],
            ['name' => 'Student ID Card', 'folder' => 'ID Documents', 'type' => 'id'],
            ['name' => 'Fee Receipt {month}', 'folder' => 'Fee Receipts', 'type' => 'receipt'],
            ['name' => 'Medical Certificate', 'folder' => 'Medical Records', 'type' => 'medical'],
        ];

        $subjects = ['Mathematics', 'Physics', 'Chemistry', 'Computer Science', 'English'];
        $months = ['January', 'February', 'March', 'April', 'May', 'June'];

        foreach ($students as $student) {
            // Each student has 8-15 documents
            $documentCount = rand(8, 15);
            
            for ($i = 0; $i < $documentCount; $i++) {
                $template = $documentTemplates[array_rand($documentTemplates)];
                
                // Find the folder
                $folder = collect($folders)->firstWhere('name', $template['folder']);
                
                if (!$folder) continue;

                // Generate document name
                $documentName = $template['name'];
                if (str_contains($documentName, '{semester}')) {
                    $documentName = str_replace('{semester}', rand(1, 8), $documentName);
                }
                if (str_contains($documentName, '{subject}')) {
                    $documentName = str_replace('{subject}', $subjects[array_rand($subjects)], $documentName);
                }
                if (str_contains($documentName, '{month}')) {
                    $documentName = str_replace('{month}', $months[array_rand($months)], $documentName);
                }

                Document::create([
                    'college_id' => $student->college_id,
                    'student_id' => $student->id,
                    'folder_id' => $folder->id,
                    'name' => $documentName,
                    'description' => "Student uploaded document: {$documentName}",
                    'file_path' => '/storage/student-documents/' . Str::slug($documentName) . '-' . Str::random(8) . '.pdf',
                    'file_url' => 'https://example.com/documents/' . Str::slug($documentName) . '.pdf',
                    'file_size_bytes' => rand(100000, 5000000),
                    'mime_type' => 'application/pdf',
                    'uploaded_by' => $student->user_id,
                    'verification_status' => rand(1, 10) > 8 ? 'pending' : 'verified',
                    'verified_by' => rand(1, 10) > 8 ? null : $student->user_id,
                    'verified_at' => rand(1, 10) > 8 ? null : now()->subDays(rand(1, 30)),
                ]);
            }
        }
    }
}
