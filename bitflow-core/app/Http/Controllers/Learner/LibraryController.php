<?php

declare(strict_types=1);

namespace App\Http\Controllers\Learner;

use App\Models\Student;
use App\Services\LibraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

final class LibraryController
{
    public function __construct(private LibraryService $libraryService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => false,
                'error' => 'Student profile not found',
            ], 404);
        }

        $filters = $request->only(['type', 'subject', 'search']);
        $perPage = (int) $request->query('per_page', 15);

        $resources = $this->libraryService->listLearnerResources($student, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $resources->items(),
            'meta' => [
                'current_page' => $resources->currentPage(),
                'per_page' => $resources->perPage(),
                'total' => $resources->total(),
            ],
        ]);
    }

    public function show(string $resourceId): JsonResponse
    {
        $resource = $this->libraryService->getResource($resourceId);

        return response()->json([
            'success' => true,
            'data' => $resource,
        ]);
    }

    public function toggleBookmark(string $resourceId): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not authenticated',
            ], 401);
        }

        $bookmarked = $this->libraryService->toggleBookmark($user->id, $resourceId);

        return response()->json([
            'success' => true,
            'data' => ['bookmarked' => $bookmarked],
        ]);
    }

    public function bookmarks(): JsonResponse
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not authenticated',
            ], 401);
        }

        $bookmarks = $this->libraryService->listBookmarks($user->id);

        return response()->json([
            'success' => true,
            'data' => $bookmarks,
        ]);
    }

    private function resolveStudent(): ?Student
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        return Student::with('college')->where('user_id', $user->id)->first();
    }
}
