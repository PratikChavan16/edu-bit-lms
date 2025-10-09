<?php

namespace App\Repositories;

use App\Models\Notice;
use Illuminate\Database\Eloquent\Collection;

class NoticeRepository
{
    public function getImportantNotices(string $collegeId, int $limit = 5): Collection
    {
        return Notice::where('college_id', $collegeId)
            ->active()
            ->important()
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function getRecentNotices(string $collegeId, int $limit = 10): Collection
    {
        return Notice::where('college_id', $collegeId)
            ->active()
            ->latest('published_at')
            ->limit($limit)
            ->get();
    }

    public function getNoticeById(string $id): ?Notice
    {
        return Notice::with(['college', 'author'])->find($id);
    }
}
