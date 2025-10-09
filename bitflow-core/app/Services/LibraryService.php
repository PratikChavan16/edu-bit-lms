<?php

namespace App\Services;

use App\Models\{LibraryResource, Student};
use App\Repositories\LibraryRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;

class LibraryService
{
    public function __construct(private LibraryRepository $repository)
    {
    }

    public function listResources(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listForCollege($collegeId, $filters, $perPage);
    }

    public function listLearnerResources(Student $student, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['course'] = $filters['course'] ?? $student->course;
        $filters['year'] = $filters['year'] ?? $student->year;

        return $this->repository->listApprovedForLearner($student->college_id, $filters, $perPage);
    }

    public function createResource(string $collegeId, string $userId, array $data): LibraryResource
    {
        $payload = array_merge($data, [
            'college_id' => $collegeId,
            'uploaded_by' => $userId,
        ]);

        return $this->repository->create($payload);
    }

    public function updateResource(string $resourceId, array $data): LibraryResource
    {
        $resource = $this->repository->getById($resourceId);

        return $this->repository->update($resource, $data);
    }

    public function deleteResource(string $resourceId): void
    {
        $resource = $this->repository->getById($resourceId);
        $this->repository->delete($resource);
    }

    public function approveResource(string $resourceId, string $approverId, string $status = 'approved'): LibraryResource
    {
        $resource = $this->repository->getById($resourceId);

        return $this->repository->approve($resource, [
            'approval_status' => $status,
            'approved_by' => $approverId,
        ]);
    }

    public function toggleBookmark(string $userId, string $resourceId): bool
    {
        return $this->repository->toggleBookmark($userId, $resourceId);
    }

    public function listBookmarks(string $userId): Collection
    {
        return $this->repository->listBookmarks($userId);
    }

    public function getResource(string $resourceId): LibraryResource
    {
        return $this->repository->getById($resourceId);
    }
}
