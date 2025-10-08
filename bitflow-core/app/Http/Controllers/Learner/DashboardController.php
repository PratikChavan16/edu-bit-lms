<?php

declare(strict_types=1);

namespace App\Http\Controllers\Learner;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

/**
 * Learner dashboard controller.
 */
final class DashboardController
{
    /**
     * GET /learner/dashboard
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function index(Request $request): JsonResponse
    {
        // TODO: load authenticated learner context
        $data = [
            'date' => now()->toDateString(),
            'greeting' => 'Hi Riya, welcome back!',
            'stats' => [
                ['label' => 'Attendance', 'value' => '92%', 'trend' => 'On track'],
                ['label' => 'Assignments', 'value' => '1 due', 'trend' => 'Submit by 8 PM'],
                ['label' => 'Library storage', 'value' => '240MB / 300MB', 'trend' => '80% used'],
                ['label' => 'Fee status', 'value' => 'Paid', 'trend' => 'Next due Jan 2026'],
            ],
            'upcomingLectures' => [
                [
                    'subject' => 'Advanced Mathematics',
                    'faculty' => 'Dr. Mehta',
                    'venue' => 'Room A104',
                    'startAt' => now()->setTime(9, 30)->toIso8601String(),
                    'endAt' => now()->setTime(10, 30)->toIso8601String(),
                ],
                [
                    'subject' => 'Thermodynamics',
                    'faculty' => 'Prof. Salvi',
                    'venue' => 'Lab 203',
                    'startAt' => now()->setTime(11, 15)->toIso8601String(),
                    'endAt' => now()->setTime(12, 15)->toIso8601String(),
                ],
            ],
            'libraryQuickLinks' => [
                [
                    'id' => 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
                    'title' => 'Thermodynamics notes',
                    'type' => 'note',
                    'subject' => 'Mechanical',
                    'tags' => ['lecture', 'chapter-3'],
                    'updatedAt' => now()->subDays(2)->toIso8601String(),
                    'bookmarked' => true,
                ],
            ],
            'notices' => [
                [
                    'id' => 'notice-001',
                    'text' => 'Project showcase submissions due Friday.',
                    'priority' => 'high',
                    'category' => 'academic',
                    'createdAt' => now()->subDay()->toIso8601String(),
                ],
            ],
            'recentResults' => [
                [
                    'id' => 'result-001',
                    'assessmentTitle' => 'Mid-term Mechanics',
                    'assessmentType' => 'mcq',
                    'subject' => 'Mechanical',
                    'score' => '82%',
                    'status' => 'pass',
                    'publishedAt' => now()->subDays(3)->toIso8601String(),
                ],
            ],
        ];

        return response()->json($data);
    }
}
