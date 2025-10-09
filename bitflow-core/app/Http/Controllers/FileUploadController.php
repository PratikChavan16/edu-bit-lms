<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Services\FileUploadService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

final class FileUploadController
{
    public function __construct(private FileUploadService $fileUploadService)
    {
    }

    /**
     * Upload a single file
     */
    public function upload(Request $request): JsonResponse
    {
        $data = $request->validate([
            'file' => ['required', 'file', 'max:102400'], // 100MB max
            'folder' => ['nullable', 'string', 'max:255'],
            'visibility' => ['nullable', 'in:public,private'],
        ]);

        $user = $request->user();
        $file = $request->file('file');
        $folder = $data['folder'] ?? 'uploads';
        $visibility = $data['visibility'] ?? 'private';

        try {
            $result = $this->fileUploadService->uploadFile(
                $file,
                $folder,
                $user->id,
                $visibility
            );

            return response()->json([
                'success' => true,
                'data' => $result,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'File upload failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Upload multiple files
     */
    public function uploadMultiple(Request $request): JsonResponse
    {
        $data = $request->validate([
            'files' => ['required', 'array', 'max:10'],
            'files.*' => ['required', 'file', 'max:102400'],
            'folder' => ['nullable', 'string', 'max:255'],
            'visibility' => ['nullable', 'in:public,private'],
        ]);

        $user = $request->user();
        $folder = $data['folder'] ?? 'uploads';
        $visibility = $data['visibility'] ?? 'private';

        $results = [];
        $errors = [];

        foreach ($request->file('files') as $index => $file) {
            try {
                $results[] = $this->fileUploadService->uploadFile(
                    $file,
                    $folder,
                    $user->id,
                    $visibility
                );
            } catch (\Exception $e) {
                $errors[] = [
                    'index' => $index,
                    'filename' => $file->getClientOriginalName(),
                    'error' => $e->getMessage(),
                ];
            }
        }

        return response()->json([
            'success' => count($errors) === 0,
            'data' => $results,
            'errors' => $errors,
        ], count($errors) > 0 ? 207 : 201); // 207 Multi-Status
    }

    /**
     * Get file info
     */
    public function show(Request $request, string $fileId): JsonResponse
    {
        try {
            $metadata = $this->fileUploadService->getFileMetadata($fileId);

            return response()->json([
                'success' => true,
                'data' => $metadata,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'File not found.',
            ], 404);
        }
    }

    /**
     * Download file
     */
    public function download(Request $request, string $fileId)
    {
        try {
            $metadata = $this->fileUploadService->getFileMetadata($fileId);

            // Check if user has access
            if (!$this->fileUploadService->canAccessFile($fileId, $request->user()->id)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Access denied.',
                ], 403);
            }

            $disk = $metadata['disk'] ?? config('filesystems.default');
            $path = $metadata['path'];

            if (!Storage::disk($disk)->exists($path)) {
                return response()->json([
                    'success' => false,
                    'error' => 'File not found.',
                ], 404);
            }

            return Storage::disk($disk)->download($path, $metadata['original_name']);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Download failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Delete file
     */
    public function destroy(Request $request, string $fileId): JsonResponse
    {
        try {
            // Check if user has permission
            if (!$this->fileUploadService->canDeleteFile($fileId, $request->user()->id)) {
                return response()->json([
                    'success' => false,
                    'error' => 'Access denied.',
                ], 403);
            }

            $this->fileUploadService->deleteFile($fileId);

            return response()->json([
                'success' => true,
                'message' => 'File deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => 'Delete failed: ' . $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get user's storage usage
     */
    public function storageUsage(Request $request): JsonResponse
    {
        $user = $request->user();
        $usage = $this->fileUploadService->getUserStorageUsage($user->id);

        return response()->json([
            'success' => true,
            'data' => $usage,
        ]);
    }
}
