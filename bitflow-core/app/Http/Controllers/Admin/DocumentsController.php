<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Models\College;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class DocumentsController
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

        $filters = $request->only(['folder_id', 'status', 'student_id']);
        $perPage = (int) $request->query('per_page', 15);

        $documents = $this->documentService->listDocumentsForCollege($college->id, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $documents,
        ]);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not authenticated',
            ], 401);
        }

        $validated = $request->validate([
            'folder_id' => ['required', 'uuid', 'exists:document_folders,id'],
            'student_id' => ['nullable', 'uuid', 'exists:students,id'],
            'name' => ['required', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'file_path' => ['required_without:file_url', 'string', 'max:255'],
            'file_url' => ['required_without:file_path', 'nullable', 'url'],
            'file_size_bytes' => ['nullable', 'integer', 'min:1'],
            'mime_type' => ['nullable', 'string', 'max:120'],
            'visibility' => ['nullable', Rule::in(['public', 'private', 'restricted'])],
        ]);

        $payload = [
            'student_id' => $validated['student_id'] ?? null,
            'name' => $validated['name'],
            'description' => $validated['description'] ?? null,
            'file_path' => $validated['file_path'] ?? $validated['file_url'],
            'file_url' => $validated['file_url'] ?? null,
            'file_size_bytes' => $validated['file_size_bytes'] ?? null,
            'mime_type' => $validated['mime_type'] ?? null,
        ];

        if (array_key_exists('visibility', $validated)) {
            $payload['visibility'] = $validated['visibility'];
        }

        $document = $this->documentService->createDocument(
            $validated['folder_id'],
            $user->id,
            $payload
        );

        return response()->json([
            'success' => true,
            'data' => $document,
        ], 201);
    }

    public function update(Request $request, string $documentId): JsonResponse
    {
        $validated = $request->validate([
            'name' => ['sometimes', 'string', 'max:200'],
            'description' => ['nullable', 'string'],
            'file_path' => ['nullable', 'string', 'max:255'],
            'file_url' => ['nullable', 'url'],
            'file_size_bytes' => ['nullable', 'integer', 'min:1'],
            'mime_type' => ['nullable', 'string', 'max:120'],
            'visibility' => ['nullable', Rule::in(['public', 'private', 'restricted'])],
            'verification_status' => ['nullable', Rule::in(['uploaded', 'pending', 'verified', 'rejected'])],
            'rejection_reason' => ['nullable', 'string'],
        ]);

        $document = $this->documentService->updateDocument($documentId, $validated);

        return response()->json([
            'success' => true,
            'data' => $document,
        ]);
    }

    public function destroy(string $documentId): JsonResponse
    {
        $this->documentService->deleteDocument($documentId);

        return response()->json([
            'success' => true,
            'message' => 'Document deleted',
        ]);
    }

    public function verify(Request $request, string $documentId): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not authenticated',
            ], 401);
        }

        $validated = $request->validate([
            'status' => ['required', Rule::in(['verified', 'rejected'])],
            'feedback' => ['nullable', 'string'],
        ]);

        $document = $this->documentService->verifyDocument(
            $documentId,
            $user,
            $validated['status'],
            $validated['feedback'] ?? null
        );

        return response()->json([
            'success' => true,
            'data' => $document,
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
