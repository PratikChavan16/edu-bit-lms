<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\FileUpload;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class FileUploadService
{
    private const DEFAULT_DISK = 'local';
    private const ALLOWED_MIME_TYPES = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'image/jpeg',
        'image/png',
        'image/gif',
        'image/webp',
        'video/mp4',
        'video/mpeg',
        'video/quicktime',
        'video/x-msvideo',
        'audio/mpeg',
        'audio/wav',
        'text/plain',
        'text/csv',
    ];

    /**
     * Upload a file and store metadata
     *
     * @param UploadedFile $file
     * @param string $folder
     * @param string $userId
     * @param string $visibility
     * @return array
     * @throws \Exception
     */
    public function uploadFile(
        UploadedFile $file,
        string $folder,
        string $userId,
        string $visibility = 'private'
    ): array {
        // Validate file
        $this->validateFile($file);

        // Check storage quota
        $this->checkStorageQuota($userId, $file->getSize());

        $disk = config('filesystems.default', self::DEFAULT_DISK);
        $originalName = $file->getClientOriginalName();
        $extension = $file->getClientOriginalExtension();
        $mimeType = $file->getMimeType();
        $size = $file->getSize();

        // Generate unique filename
        $filename = Str::uuid() . '.' . $extension;
        $path = $folder . '/' . $filename;

        // Upload file
        $uploadedPath = $file->storeAs($folder, $filename, [
            'disk' => $disk,
            'visibility' => $visibility,
        ]);

        if (!$uploadedPath) {
            throw new \Exception('File upload failed');
        }

        // Store metadata in database
        $metadata = [
            'id' => Str::uuid()->toString(),
            'user_id' => $userId,
            'disk' => $disk,
            'path' => $uploadedPath,
            'original_name' => $originalName,
            'filename' => $filename,
            'mime_type' => $mimeType,
            'size' => $size,
            'folder' => $folder,
            'visibility' => $visibility,
            'url' => $visibility === 'public' ? Storage::disk($disk)->url($uploadedPath) : null,
        ];

        // Store in cache or database (for now, we'll use a simple JSON file)
        $this->storeMetadata($metadata);

        return $metadata;
    }

    /**
     * Validate uploaded file
     */
    private function validateFile(UploadedFile $file): void
    {
        if (!$file->isValid()) {
            throw new \Exception('Invalid file upload');
        }

        $mimeType = $file->getMimeType();
        if (!in_array($mimeType, self::ALLOWED_MIME_TYPES)) {
            throw new \Exception('File type not allowed: ' . $mimeType);
        }

        // Additional size validation (100MB max)
        if ($file->getSize() > 104857600) {
            throw new \Exception('File size exceeds maximum allowed (100MB)');
        }
    }

    /**
     * Check if user has enough storage quota
     */
    private function checkStorageQuota(string $userId, int $fileSize): void
    {
        $currentUsage = $this->getUserStorageUsage($userId);
        $quotaBytes = $currentUsage['quota_bytes'];
        
        if (($currentUsage['used_bytes'] + $fileSize) > $quotaBytes) {
            throw new \Exception('Storage quota exceeded');
        }
    }

    /**
     * Get user's storage usage
     */
    public function getUserStorageUsage(string $userId): array
    {
        // Get user's student or faculty record for quota
        $user = \App\Models\User::with(['student.college', 'faculty.college'])->findOrFail($userId);
        
        $quotaMb = 1024; // Default 1GB
        
        if ($user->student) {
            $quotaMb = $user->student->college->student_storage_quota_mb ?? 1024;
        } elseif ($user->faculty) {
            $quotaMb = 2048; // 2GB for faculty
        }

        // Calculate used storage
        $metadata = $this->getAllUserMetadata($userId);
        $usedBytes = array_sum(array_column($metadata, 'size'));

        return [
            'user_id' => $userId,
            'used_bytes' => $usedBytes,
            'used_mb' => round($usedBytes / 1048576, 2),
            'quota_bytes' => $quotaMb * 1048576,
            'quota_mb' => $quotaMb,
            'available_bytes' => ($quotaMb * 1048576) - $usedBytes,
            'percentage_used' => $quotaMb > 0 ? round(($usedBytes / ($quotaMb * 1048576)) * 100, 2) : 0,
            'file_count' => count($metadata),
        ];
    }

    /**
     * Get file metadata
     */
    public function getFileMetadata(string $fileId): array
    {
        $metadataPath = storage_path('app/metadata/' . $fileId . '.json');
        
        if (!file_exists($metadataPath)) {
            throw new \Exception('File metadata not found');
        }

        return json_decode(file_get_contents($metadataPath), true);
    }

    /**
     * Store file metadata
     */
    private function storeMetadata(array $metadata): void
    {
        $metadataDir = storage_path('app/metadata');
        if (!is_dir($metadataDir)) {
            mkdir($metadataDir, 0755, true);
        }

        $metadataPath = $metadataDir . '/' . $metadata['id'] . '.json';
        file_put_contents($metadataPath, json_encode($metadata, JSON_PRETTY_PRINT));
    }

    /**
     * Get all metadata for a user
     */
    private function getAllUserMetadata(string $userId): array
    {
        $metadataDir = storage_path('app/metadata');
        if (!is_dir($metadataDir)) {
            return [];
        }

        $files = glob($metadataDir . '/*.json');
        $userFiles = [];

        foreach ($files as $file) {
            $metadata = json_decode(file_get_contents($file), true);
            if ($metadata['user_id'] === $userId) {
                $userFiles[] = $metadata;
            }
        }

        return $userFiles;
    }

    /**
     * Delete file
     */
    public function deleteFile(string $fileId): void
    {
        $metadata = $this->getFileMetadata($fileId);
        
        // Delete from storage
        Storage::disk($metadata['disk'])->delete($metadata['path']);
        
        // Delete metadata
        $metadataPath = storage_path('app/metadata/' . $fileId . '.json');
        if (file_exists($metadataPath)) {
            unlink($metadataPath);
        }
    }

    /**
     * Check if user can access file
     */
    public function canAccessFile(string $fileId, string $userId): bool
    {
        try {
            $metadata = $this->getFileMetadata($fileId);
            
            // Owner can always access
            if ($metadata['user_id'] === $userId) {
                return true;
            }

            // Public files can be accessed by anyone
            if ($metadata['visibility'] === 'public') {
                return true;
            }

            // TODO: Add more complex permission logic here
            // e.g., shared files, admin access, etc.

            return false;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Check if user can delete file
     */
    public function canDeleteFile(string $fileId, string $userId): bool
    {
        try {
            $metadata = $this->getFileMetadata($fileId);
            
            // Only owner can delete
            return $metadata['user_id'] === $userId;
        } catch (\Exception $e) {
            return false;
        }
    }

    /**
     * Get public URL for file
     */
    public function getFileUrl(string $fileId): ?string
    {
        $metadata = $this->getFileMetadata($fileId);
        
        if ($metadata['visibility'] === 'public') {
            return Storage::disk($metadata['disk'])->url($metadata['path']);
        }

        return null;
    }

    /**
     * Generate temporary URL for private file (expires in 1 hour)
     */
    public function getTemporaryUrl(string $fileId, int $expirationMinutes = 60): string
    {
        $metadata = $this->getFileMetadata($fileId);
        
        if (method_exists(Storage::disk($metadata['disk']), 'temporaryUrl')) {
            return Storage::disk($metadata['disk'])->temporaryUrl(
                $metadata['path'],
                now()->addMinutes($expirationMinutes)
            );
        }

        throw new \Exception('Temporary URLs not supported for this storage disk');
    }
}
