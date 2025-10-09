<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use App\Models\College;

final class DocumentFoldersController
{
    public function __construct(private DocumentService $documentService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        $college = $this->resolveCollege($request);

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $filters = $request->only(['owner_type']);
        $perPage = (int) $request->query('per_page', 15);

        $folders = $this->documentService->listFolders($college->id, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $folders->items(),
            'meta' => [
                'current_page' => $folders->currentPage(),
                'per_page' => $folders->perPage(),
                'total' => $folders->total(),
            ],
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $college = $this->resolveCollege($request);

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'owner_type' => ['nullable', Rule::in(['admin', 'student'])],
            'owner_id' => ['nullable', 'uuid', 'exists:users,id'],
            'required_file_types' => ['nullable', 'array'],
            'required_file_types.*' => ['string'],
            'due_date' => ['nullable', 'date'],
            'is_required' => ['boolean'],
        ]);

        $payload = array_merge($validated, [
            'owner_type' => $validated['owner_type'] ?? 'admin',
        ]);

        $folder = $this->documentService->createFolder($college->id, $payload);

        return response()->json([
            'success' => true,
            'data' => $folder,
        ], 201);
    }

    public function show(string $folderId): JsonResponse
    {
        $folder = $this->documentService->getFolder($folderId);

        return response()->json([
            'success' => true,
            'data' => $folder,
        ]);
    }

    public function update(Request $request, string $folderId): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:120'],
            'description' => ['nullable', 'string'],
            'owner_type' => ['sometimes', Rule::in(['admin', 'student'])],
            'owner_id' => ['nullable', 'uuid', 'exists:users,id'],
            'required_file_types' => ['nullable', 'array'],
            'required_file_types.*' => ['string'],
            'due_date' => ['nullable', 'date'],
            'is_required' => ['boolean'],
        ]);

        $folder = $this->documentService->updateFolder($folderId, $validated);

        return response()->json([
            'success' => true,
            'data' => $folder,
        ]);
    }

    public function destroy(string $folderId): JsonResponse
    {
        $this->documentService->deleteFolder($folderId);

        return response()->json([
            'success' => true,
            'message' => 'Folder deleted',
        ]);
    }

    public function documents(Request $request, string $folderId): JsonResponse
    {
        $filters = $request->only(['status']);
        $perPage = (int) $request->query('per_page', 15);

        $documents = $this->documentService->listDocumentsForFolder($folderId, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $documents->items(),
            'meta' => [
                'current_page' => $documents->currentPage(),
                'per_page' => $documents->perPage(),
                'total' => $documents->total(),
            ],
        ]);
    }

    private function resolveCollege(Request $request): ?College
    {
        /** @var College|null $college */
        $college = app()->bound('tenant.college') ? app('tenant.college') : null;

        if ($college) {
            return $college;
        }

        $collegeId = $request->query('college_id');

        if (!$collegeId) {
            return null;
        }

        return College::find($collegeId);
    }
}
