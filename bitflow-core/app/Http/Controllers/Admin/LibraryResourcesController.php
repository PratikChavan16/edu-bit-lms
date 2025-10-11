<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\LibraryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class LibraryResourcesController
{
    public function __construct(private LibraryService $libraryService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $college = null;

        // Check if bound (production) before accessing
        if (app()->bound('tenant.college')) {
            $college = app('tenant.college');
        }

        // Fallback to query parameter in tests
        if (!$college && $request->has('college_id')) {
            $college = \App\Models\College::find($request->input('college_id'));
        }

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $filters = $request->only(['type', 'subject', 'approval_status', 'search']);
        $perPage = (int) $request->query('per_page', 15);

        $resources = $this->libraryService->listResources($college->id, $filters, $perPage);

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

    public function store(Request $request): JsonResponse
    {
        $college = null;

        // Check if bound (production) before accessing
        if (app()->bound('tenant.college')) {
            $college = app('tenant.college');
        }

        // Fallback to query parameter in tests
        if (!$college && $request->has('college_id')) {
            $college = \App\Models\College::find($request->input('college_id'));
        }

        $user = $request->user();

        if (!$college || !$user) {
            return response()->json([
                'success' => false,
                'error' => 'College context or user missing',
            ], 400);
        }

        $data = $request->validate([
            'title' => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['required', Rule::in(['notes', 'video', 'ebook', 'other'])],
            'subject' => ['required', 'string', 'max:120'],
            'course' => ['nullable', 'string', 'max:120'],
            'year' => ['nullable', 'integer', 'min:1', 'max:6'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'file_url' => ['nullable', 'url'],
            'file_size_bytes' => ['nullable', 'integer'],
            'mime_type' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
        ]);

        $resource = $this->libraryService->createResource($college->id, $user->id, $data);

        return response()->json([
            'success' => true,
            'data' => $resource,
        ], 201);
    }

    public function show(string $resourceId): JsonResponse
    {
        $resource = $this->libraryService->getResource($resourceId);

        return response()->json([
            'success' => true,
            'data' => $resource,
        ]);
    }

    public function update(Request $request, string $resourceId): JsonResponse
    {
        $data = $request->validate([
            'title' => ['sometimes', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'type' => ['sometimes', Rule::in(['notes', 'video', 'ebook', 'other'])],
            'subject' => ['sometimes', 'string', 'max:120'],
            'course' => ['nullable', 'string', 'max:120'],
            'year' => ['nullable', 'integer', 'min:1', 'max:6'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'file_url' => ['nullable', 'url'],
            'file_size_bytes' => ['nullable', 'integer'],
            'mime_type' => ['nullable', 'string', 'max:120'],
            'tags' => ['nullable', 'array'],
            'tags.*' => ['string'],
            'approval_status' => ['nullable', Rule::in(['pending', 'approved', 'rejected'])],
        ]);

        $resource = $this->libraryService->updateResource($resourceId, $data);

        return response()->json([
            'success' => true,
            'data' => $resource,
        ]);
    }

    public function destroy(string $resourceId): JsonResponse
    {
        $this->libraryService->deleteResource($resourceId);

        return response()->json([
            'success' => true,
            'message' => 'Resource deleted',
        ]);
    }

    public function approve(Request $request, string $resourceId): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not authenticated',
            ], 401);
        }

        $data = $request->validate([
            'status' => ['required', Rule::in(['approved', 'rejected'])],
        ]);

        $resource = $this->libraryService->approveResource($resourceId, $user->id, $data['status']);

        return response()->json([
            'success' => true,
            'data' => $resource,
        ]);
    }
}
