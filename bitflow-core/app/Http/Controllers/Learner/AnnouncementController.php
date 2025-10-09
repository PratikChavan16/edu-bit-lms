<?php

namespace App\Http\Controllers\Learner;

use App\Services\AnnouncementService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnnouncementController
{
    public function __construct(private AnnouncementService $service)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $student = $request->user()->student;
        
        $announcements = \App\Models\Announcement::where('college_id', $student->college_id)
            ->where('status', 'published')
            ->where('scheduled_at', '<=', now())
            ->where(function ($query) {
                $query->whereNull('expires_at')
                    ->orWhere('expires_at', '>=', now());
            })
            ->where(function ($query) use ($student) {
                $query->whereJsonContains('target_audience', 'all')
                    ->orWhereJsonContains('target_audience', 'students');
                
                if ($student->course) {
                    $query->where(function ($q) use ($student) {
                        $q->whereNull('course')
                          ->orWhere('course', $student->course);
                    });
                }
                
                if ($student->year) {
                    $query->where(function ($q) use ($student) {
                        $q->whereNull('year')
                          ->orWhere('year', $student->year);
                    });
                }
            })
            ->with('creator')
            ->orderBy('priority', 'desc')
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $announcements,
        ]);
    }

    public function show(string $id, Request $request): JsonResponse
    {
        $announcement = \App\Models\Announcement::with('creator')->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $announcement,
        ]);
    }

    public function markAsRead(string $id, Request $request): JsonResponse
    {
        $this->service->markAsRead($id, $request->user()->id);

        return response()->json([
            'success' => true,
            'message' => 'Announcement marked as read',
        ]);
    }
}
