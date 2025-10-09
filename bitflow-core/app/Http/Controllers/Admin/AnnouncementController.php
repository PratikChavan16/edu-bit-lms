<?php

namespace App\Http\Controllers\Admin;

use App\Models\Announcement;
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
        $collegeId = $request->query('college_id');
        $filters = $request->only(['type', 'priority', 'status']);
        
        $announcements = $this->service->listAnnouncements($collegeId, $filters);

        return response()->json([
            'success' => true,
            'data' => $announcements,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'type' => 'required|in:general,urgent,event,academic,administrative',
            'priority' => 'required|in:low,medium,high',
            'target_audience' => 'required|array',
            'target_audience.*' => 'in:all,students,faculty,parents,staff',
            'course' => 'nullable|string',
            'year' => 'nullable|integer',
            'scheduled_at' => 'nullable|date',
            'expires_at' => 'nullable|date|after:scheduled_at',
        ]);

        $collegeId = $request->query('college_id');
        $userId = $request->user()->id;

        $announcement = $this->service->createAnnouncement($collegeId, $userId, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Announcement created successfully',
            'data' => $announcement->load('creator'),
        ], 201);
    }

    public function show(string $id, Request $request): JsonResponse
    {
        $announcement = $this->service->getAnnouncement($id);

        return response()->json([
            'success' => true,
            'data' => $announcement->load(['creator', 'reads']),
        ]);
    }

    public function update(string $id, Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'type' => 'sometimes|in:general,urgent,event,academic,administrative',
            'priority' => 'sometimes|in:low,medium,high',
            'target_audience' => 'sometimes|array',
            'scheduled_at' => 'nullable|date',
            'expires_at' => 'nullable|date',
        ]);

        $announcement = $this->service->updateAnnouncement($id, $validated);

        return response()->json([
            'success' => true,
            'message' => 'Announcement updated successfully',
            'data' => $announcement,
        ]);
    }

    public function destroy(string $id, Request $request): JsonResponse
    {
        $this->service->deleteAnnouncement($id);

        return response()->json([
            'success' => true,
            'message' => 'Announcement deleted successfully',
        ]);
    }

    public function publish(string $id, Request $request): JsonResponse
    {
        $announcement = $this->service->publishAnnouncement($id);

        return response()->json([
            'success' => true,
            'message' => 'Announcement published successfully',
            'data' => $announcement,
        ]);
    }

    public function archive(string $id, Request $request): JsonResponse
    {
        $announcement = $this->service->archiveAnnouncement($id);

        return response()->json([
            'success' => true,
            'message' => 'Announcement archived successfully',
            'data' => $announcement,
        ]);
    }
}
