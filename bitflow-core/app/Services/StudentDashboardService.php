<?php

namespace App\Services;

use App\Models\AssessmentSubmission;
use App\Repositories\{NoticeRepository, TimetableRepository, StudentRepository};
use App\Services\LibraryService;
use Illuminate\Support\Facades\Auth;

class StudentDashboardService
{
    public function __construct(
        private NoticeRepository $noticeRepository,
        private TimetableRepository $timetableRepository,
        private StudentRepository $studentRepository,
        private LibraryService $libraryService
    ) {}

    public function getDashboardData(): array
    {
        $user = Auth::user();
        $student = $this->studentRepository->findByUserId($user->id);

        if (!$student) {
            throw new \Exception('Student profile not found');
        }

        $college = app('tenant.college') ?? $student->college;

        // Get important notices
        $importantNotices = $this->noticeRepository->getImportantNotices($college->id, 3);

        // Get upcoming lectures for today
        $upcomingLectures = $this->timetableRepository->getUpcomingLectures(
            $college->id,
            $student->course,
            $student->year,
            $student->section,
            3
        );

        $libraryResources = $this->libraryService
            ->listLearnerResources($student, [], 3);

        $libraryQuickLinks = collect($libraryResources->items())->map(function ($resource) {
            return [
                'id' => $resource['id'] ?? $resource->id,
                'title' => $resource['title'] ?? null,
                'type' => $resource['type'] ?? null,
                'subject' => $resource['subject'] ?? null,
                'file_url' => $resource['file_url'] ?? null,
                'approval_status' => $resource['approval_status'] ?? null,
            ];
        });

        $recentSubmissions = AssessmentSubmission::with('assessment')
            ->where('student_id', $student->id)
            ->orderByDesc('submitted_at')
            ->limit(3)
            ->get();

        $recentResults = $recentSubmissions->map(function ($submission) {
            return [
                'assessment_id' => $submission->assessment_id,
                'assessment_title' => $submission->assessment->title ?? null,
                'status' => $submission->status,
                'marks_obtained' => $submission->marks_obtained,
                'submitted_at' => $submission->submitted_at?->toIso8601String(),
            ];
        });

        return [
            'student' => [
                'id' => $student->id,
                'name' => $user->full_name,
                'roll_number' => $student->roll_number,
                'course' => $student->course,
                'year' => $student->year,
                'section' => $student->section,
                'photo_url' => $user->photo_url,
                'email' => $user->email,
            ],
            'college' => [
                'id' => $college->id,
                'name' => $college->name,
                'logo_url' => $college->branding['logo_url'] ?? null,
            ],
            'important_notices' => $importantNotices->map(function ($notice) {
                return [
                    'id' => $notice->id,
                    'title' => $notice->title,
                    'content' => $notice->content,
                    'priority' => $notice->priority,
                    'published_at' => $notice->published_at->toIso8601String(),
                    'author' => $notice->author->full_name,
                ];
            }),
            'upcoming_lectures' => $upcomingLectures->map(function ($lecture) {
                return [
                    'id' => $lecture->id,
                    'subject' => $lecture->subject,
                    'start_time' => $lecture->start_time,
                    'end_time' => $lecture->end_time,
                    'location' => $lecture->location,
                    'faculty_name' => $lecture->faculty->user->full_name ?? 'TBA',
                    'type' => $lecture->type,
                ];
            }),
            'library_quick_links' => $libraryQuickLinks,
            'recent_results' => $recentResults,
        ];
    }
}
