<?php

namespace App\Repositories;

use App\Models\{LibraryResource, LibraryBookmark};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;

class LibraryRepository
{
    public function listForCollege(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = LibraryResource::query()
            ->where('college_id', $collegeId)
            ->with(['uploader', 'approver'])
            ->orderByDesc('created_at');

        if (!empty($filters['type'])) {
            $query->where('type', $filters['type']);
        }

        if (!empty($filters['subject'])) {
            $query->where('subject', 'like', "%{$filters['subject']}%");
        }

        if (!empty($filters['course'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereNull('course')
                    ->orWhere('course', $filters['course']);
            });
        }

        if (!empty($filters['year'])) {
            $query->where(function ($q) use ($filters) {
                $q->whereNull('year')
                    ->orWhere('year', (int) $filters['year']);
            });
        }

        if (!empty($filters['approval_status'])) {
            $query->where('approval_status', $filters['approval_status']);
        }

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('title', 'like', "%{$filters['search']}%")
                    ->orWhere('description', 'like', "%{$filters['search']}%");
            });
        }

        return $query->paginate($perPage);
    }

    public function listApprovedForLearner(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $filters['approval_status'] = 'approved';
        return $this->listForCollege($collegeId, $filters, $perPage);
    }

    public function getById(string $id): LibraryResource
    {
        $resource = LibraryResource::with(['uploader', 'approver'])->find($id);

        if (!$resource) {
            throw new ModelNotFoundException('Library resource not found');
        }

        return $resource;
    }

    public function create(array $data): LibraryResource
    {
        return LibraryResource::create($data);
    }

    public function update(LibraryResource $resource, array $data): LibraryResource
    {
        $resource->fill($data);
        $resource->save();
        return $resource->refresh();
    }

    public function delete(LibraryResource $resource): void
    {
        $resource->delete();
    }

    public function approve(LibraryResource $resource, array $approvalData): LibraryResource
    {
        $resource->fill($approvalData);
        $resource->approval_status = $approvalData['approval_status'] ?? 'approved';
        $resource->approved_at = now();
        $resource->save();

        return $resource->refresh();
    }

    public function toggleBookmark(string $userId, string $resourceId): bool
    {
        return DB::transaction(function () use ($userId, $resourceId) {
            $bookmark = LibraryBookmark::where('user_id', $userId)
                ->where('resource_id', $resourceId)
                ->first();

            if ($bookmark) {
                $bookmark->delete();
                return false;
            }

            LibraryBookmark::create([
                'user_id' => $userId,
                'resource_id' => $resourceId,
            ]);

            return true;
        });
    }

    public function listBookmarks(string $userId): Collection
    {
        return LibraryBookmark::with('resource')
            ->where('user_id', $userId)
            ->get();
    }
}
