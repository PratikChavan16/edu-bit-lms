<?php

namespace App\Http\Controllers\Faculty;

use App\Http\Controllers\Controller;
use App\Models\Faculty;
use App\Models\LibraryResource;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class ResourceManagementController extends Controller
{
    /**
     * Get faculty's resources
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();

        $filters = [
            'type' => $request->query('type'),
            'subject_id' => $request->query('subject_id'),
            'status' => $request->query('status'),
            'search' => $request->query('search'),
        ];

        $query = LibraryResource::where('uploaded_by', $userId)
            ->with(['subject', 'course', 'year']);

        if ($filters['type']) {
            $query->where('type', $filters['type']);
        }

        if ($filters['subject_id']) {
            $query->where('subject_id', $filters['subject_id']);
        }

        if ($filters['status']) {
            $query->where('status', $filters['status']);
        }

        if ($filters['search']) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                  ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        $resources = $query->orderBy('created_at', 'desc')->paginate(20);

        return response()->json([
            'success' => true,
            'data' => $resources,
        ]);
    }

    /**
     * Upload a new resource
     */
    public function store(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $faculty = Faculty::where('user_id', $userId)->firstOrFail();
        $collegeId = $request->header('X-College-ID');

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'type' => 'required|in:notes,video,ebook,other',
            'subject_id' => 'required|exists:subjects,id',
            'course_id' => 'required|exists:courses,id',
            'year_id' => 'required|exists:years,id',
            'file' => 'required_if:type,notes,ebook|file|max:51200', // 50MB
            'file_url' => 'required_if:type,video|url',
            'thumbnail' => 'nullable|file|image|max:2048', // 2MB
            'is_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['college_id'] = $collegeId;
        $data['uploaded_by'] = $userId;
        $data['status'] = 'pending'; // Requires admin approval

        // Handle file upload
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('library-resources', 'public');
            $data['file_path'] = $path;
            $data['file_size'] = $file->getSize();
        }

        // Handle file URL for videos
        if ($request->input('file_url')) {
            $data['file_url'] = $request->input('file_url');
        }

        // Handle thumbnail
        if ($request->hasFile('thumbnail')) {
            $thumbnail = $request->file('thumbnail');
            $thumbnailPath = $thumbnail->store('thumbnails', 'public');
            $data['thumbnail_path'] = $thumbnailPath;
        }

        $resource = LibraryResource::create($data);

        return response()->json([
            'success' => true,
            'data' => $resource->load(['subject', 'course', 'year']),
            'message' => 'Resource uploaded successfully. Pending admin approval.',
        ], 201);
    }

    /**
     * Update a resource
     */
    public function update(Request $request, string $resourceId): JsonResponse
    {
        $userId = $request->user()->id;

        $resource = LibraryResource::where('id', $resourceId)
            ->where('uploaded_by', $userId)
            ->firstOrFail();

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'is_public' => 'boolean',
            'thumbnail' => 'nullable|file|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Handle thumbnail update
        if ($request->hasFile('thumbnail')) {
            // Delete old thumbnail
            if ($resource->thumbnail_path) {
                Storage::disk('public')->delete($resource->thumbnail_path);
            }

            $thumbnail = $request->file('thumbnail');
            $thumbnailPath = $thumbnail->store('thumbnails', 'public');
            $data['thumbnail_path'] = $thumbnailPath;
        }

        $resource->update($data);

        return response()->json([
            'success' => true,
            'data' => $resource->load(['subject', 'course', 'year']),
            'message' => 'Resource updated successfully',
        ]);
    }

    /**
     * Delete a resource
     */
    public function destroy(string $resourceId): JsonResponse
    {
        $userId = request()->user()->id;

        $resource = LibraryResource::where('id', $resourceId)
            ->where('uploaded_by', $userId)
            ->firstOrFail();

        // Delete files from storage
        if ($resource->file_path) {
            Storage::disk('public')->delete($resource->file_path);
        }

        if ($resource->thumbnail_path) {
            Storage::disk('public')->delete($resource->thumbnail_path);
        }

        $resource->delete();

        return response()->json([
            'success' => true,
            'message' => 'Resource deleted successfully',
        ]);
    }

    /**
     * Get upload statistics
     */
    public function statistics(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $totalResources = LibraryResource::where('uploaded_by', $userId)->count();
        $approvedResources = LibraryResource::where('uploaded_by', $userId)
            ->where('status', 'approved')
            ->count();
        $pendingResources = LibraryResource::where('uploaded_by', $userId)
            ->where('status', 'pending')
            ->count();
        $rejectedResources = LibraryResource::where('uploaded_by', $userId)
            ->where('status', 'rejected')
            ->count();

        $resourcesByType = LibraryResource::where('uploaded_by', $userId)
            ->selectRaw('type, COUNT(*) as count')
            ->groupBy('type')
            ->pluck('count', 'type')
            ->toArray();

        $totalSize = LibraryResource::where('uploaded_by', $userId)
            ->sum('file_size');

        return response()->json([
            'success' => true,
            'data' => [
                'total_resources' => $totalResources,
                'approved' => $approvedResources,
                'pending' => $pendingResources,
                'rejected' => $rejectedResources,
                'by_type' => $resourcesByType,
                'total_storage_used' => $totalSize,
                'total_storage_formatted' => $this->formatBytes($totalSize),
            ],
        ]);
    }

    /**
     * Helper: Format bytes to human readable
     */
    private function formatBytes(int $bytes, int $precision = 2): string
    {
        $units = ['B', 'KB', 'MB', 'GB', 'TB'];

        for ($i = 0; $bytes > 1024 && $i < count($units) - 1; $i++) {
            $bytes /= 1024;
        }

        return round($bytes, $precision) . ' ' . $units[$i];
    }
}
