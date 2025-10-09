<?php

declare(strict_types=1);

namespace App\Http\Controllers\Learner;

use App\Models\Student;
use App\Services\DocumentService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class DocumentsController
{
    public function __construct(private DocumentService $documentService)
    {
    }

    public function index(): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => true,
                'data' => [],
            ]);
        }

        $summary = $this->documentService->listLearnerFolderSummary($student);

        return response()->json([
            'success' => true,
            'data' => $summary,
        ]);
    }

    public function folders(): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => false,
                'error' => 'Student profile not found',
            ], 404);
        }

        $folders = $this->documentService->listFoldersForStudent($student);

        return response()->json([
            'success' => true,
            'data' => $folders,
        ]);
    }

    public function upload(Request $request, string $folderId): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => false,
                'error' => 'Student profile not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:200'],
            'file_path' => ['required_without:file_url', 'string', 'max:255'],
            'file_url' => ['required_without:file_path', 'nullable', 'url'],
            'file_size_bytes' => ['nullable', 'integer', 'min:1'],
            'mime_type' => ['nullable', 'string', 'max:120'],
        ]);

        $document = $this->documentService->createDocument($folderId, $student->user_id, [
            'student_id' => $student->id,
            'name' => $validated['name'],
            'file_path' => $validated['file_path'] ?? $validated['file_url'],
            'file_url' => $validated['file_url'] ?? null,
            'file_size_bytes' => $validated['file_size_bytes'] ?? null,
            'mime_type' => $validated['mime_type'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'data' => $document,
        ], 201);
    }

    private function resolveStudent(): ?Student
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        return Student::where('user_id', $user->id)->first();
    }
}
