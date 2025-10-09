<?php

namespace App\Repositories;

use App\Models\{DocumentFolder, Document};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class DocumentRepository
{
    public function listFolders(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = DocumentFolder::query()
            ->where('college_id', $collegeId)
            ->withCount(['documents as pending_documents_count' => function ($q) {
                $q->where('verification_status', 'pending');
            }])
            ->orderBy('name');

        if (!empty($filters['owner_type'])) {
            $query->where('owner_type', $filters['owner_type']);
        }

        return $query->paginate($perPage);
    }

    public function listFoldersForStudent(string $collegeId, string $studentId): Collection
    {
        return DocumentFolder::query()
            ->where('college_id', $collegeId)
            ->with(['documents' => function ($q) use ($studentId) {
                $q->where('student_id', $studentId);
            }])
            ->orderBy('name')
            ->get();
    }

    public function getFolder(string $folderId): DocumentFolder
    {
        $folder = DocumentFolder::with(['documents.student.user'])->find($folderId);

        if (!$folder) {
            throw new ModelNotFoundException('Document folder not found');
        }

        return $folder;
    }

    public function createFolder(array $data): DocumentFolder
    {
        return DocumentFolder::create($data);
    }

    public function updateFolder(DocumentFolder $folder, array $data): DocumentFolder
    {
        $folder->fill($data);
        $folder->save();

        return $folder->refresh();
    }

    public function deleteFolder(DocumentFolder $folder): void
    {
        $folder->delete();
    }

    public function createDocument(array $data): Document
    {
        return Document::create($data);
    }

    public function updateDocument(Document $document, array $data): Document
    {
        $document->fill($data);
        $document->save();

        return $document->refresh();
    }

    public function deleteDocument(Document $document): void
    {
        $document->delete();
    }

    public function getDocument(string $documentId): Document
    {
        $document = Document::with(['student.user', 'folder'])->find($documentId);

        if (!$document) {
            throw new ModelNotFoundException('Document not found');
        }

        return $document;
    }

    public function listDocumentsForCollege(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Document::query()
            ->where('college_id', $collegeId)
            ->with(['folder', 'student.user', 'uploader', 'verifier'])
            ->orderByDesc('created_at');

        if (!empty($filters['folder_id'])) {
            $query->where('folder_id', $filters['folder_id']);
        }

        if (!empty($filters['status'])) {
            $query->where('verification_status', $filters['status']);
        }

        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        return $query->paginate($perPage);
    }

    public function listDocumentsForFolder(string $folderId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = Document::query()
            ->where('folder_id', $folderId)
            ->with(['student.user', 'uploader', 'verifier'])
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('verification_status', $filters['status']);
        }

        return $query->paginate($perPage);
    }
}
