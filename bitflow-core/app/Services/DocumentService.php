<?php

namespace App\Services;

use App\Models\{Document, DocumentFolder, Student, User};
use App\Repositories\DocumentRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Support\Carbon;

class DocumentService
{
    public function __construct(private DocumentRepository $repository)
    {
    }

    public function listFolders(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listFolders($collegeId, $filters, $perPage);
    }

    public function listFoldersForStudent(Student $student): Collection
    {
        return $this->repository->listFoldersForStudent($student->college_id, $student->id);
    }

    public function listLearnerFolderSummary(Student $student): array
    {
        return $this->repository
            ->listFoldersForStudent($student->college_id, $student->id)
            ->map(function (DocumentFolder $folder) use ($student): array {
                $documents = $folder->documents
                    ->where('student_id', $student->id)
                    ->map(function (Document $document): array {
                        return [
                            'id' => $document->id,
                            'name' => $document->name,
                            'verification_status' => $document->verification_status,
                            'uploaded_at' => $document->created_at?->toDateTimeString(),
                            'rejection_reason' => $document->rejection_reason,
                        ];
                    })
                    ->values();

                return [
                    'id' => $folder->id,
                    'name' => $folder->name,
                    'description' => $folder->description,
                    'required' => (bool) $folder->is_required,
                    'due_date' => $folder->due_date?->toDateString(),
                    'required_file_types' => $folder->required_file_types ?? [],
                    'documents' => $documents,
                ];
            })
            ->values()
            ->all();
    }

    public function createFolder(string $collegeId, array $data): DocumentFolder
    {
        $payload = array_merge($data, [
            'college_id' => $collegeId,
        ]);

        return $this->repository->createFolder($payload);
    }

    public function getFolder(string $folderId): DocumentFolder
    {
        return $this->repository->getFolder($folderId);
    }

    public function updateFolder(string $folderId, array $data): DocumentFolder
    {
        $folder = $this->repository->getFolder($folderId);

        return $this->repository->updateFolder($folder, $data);
    }

    public function deleteFolder(string $folderId): void
    {
        $folder = $this->repository->getFolder($folderId);
        $this->repository->deleteFolder($folder);
    }

    public function createDocument(string $folderId, string $uploaderId, array $data): Document
    {
        $folder = $this->repository->getFolder($folderId);

        $payload = array_merge($data, [
            'college_id' => $folder->college_id,
            'folder_id' => $folderId,
            'uploaded_by' => $uploaderId,
        ]);

        if (!isset($payload['verification_status'])) {
            $payload['verification_status'] = 'pending';
        }

    return $this->repository->createDocument($payload)->load(['folder', 'student.user', 'uploader']);
    }

    public function updateDocument(string $documentId, array $data): Document
    {
        $document = $this->repository->getDocument($documentId);

        return $this->repository->updateDocument($document, $data);
    }

    public function deleteDocument(string $documentId): void
    {
        $document = $this->repository->getDocument($documentId);
        $this->repository->deleteDocument($document);
    }

    public function verifyDocument(string $documentId, User $verifier, string $status, ?string $feedback = null): Document
    {
        $document = $this->repository->getDocument($documentId);

        return $this->repository->updateDocument($document, [
            'verification_status' => $status,
            'verified_by' => $verifier->id,
            'verified_at' => Carbon::now(),
            'rejection_reason' => $status === 'rejected' ? $feedback : null,
        ]);
    }

    public function listDocumentsForFolder(string $folderId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listDocumentsForFolder($folderId, $filters, $perPage);
    }

    public function getDocument(string $documentId): Document
    {
        return $this->repository->getDocument($documentId);
    }

    public function listDocumentsForCollege(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listDocumentsForCollege($collegeId, $filters, $perPage);
    }
}
