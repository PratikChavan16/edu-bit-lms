<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\SystemLog;

class SystemLogController extends Controller
{
    /**
     * Get system logs with pagination and filters
     * 
     * GET /api/admin/system-logs
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 50);
        $level = $request->input('level');
        $source = $request->input('source');
        $search = $request->input('search');
        $hours = $request->input('hours');

        $query = SystemLog::query()->orderBy('timestamp', 'desc');

        // Filter by level
        if ($level && $level !== 'all') {
            $query->where('level', $level);
        }

        // Filter by source
        if ($source && $source !== 'all') {
            $query->where('source', $source);
        }

        // Filter by search (message)
        if ($search) {
            $query->where('message', 'like', "%{$search}%");
        }

        // Filter by time range
        if ($hours && $hours !== 'all') {
            $query->where('timestamp', '>=', now()->subHours((int)$hours));
        }

        $logs = $query->paginate($perPage);

        // Get distinct sources for filter dropdown
        $sources = SystemLog::distinct()
            ->pluck('source')
            ->toArray();

        $transformedData = $logs->getCollection()->map(function ($log) {
            return [
                'id' => $log->id,
                'timestamp' => $log->timestamp->toISOString(),
                'level' => $log->level,
                'source' => $log->source,
                'message' => $log->message,
                'details' => $log->details ? json_decode($log->details, true) : null,
                'trace' => $log->trace,
            ];
        });

        return response()->json([
            'logs' => $transformedData,
            'sources' => $sources,
            'meta' => [
                'current_page' => $logs->currentPage(),
                'last_page' => $logs->lastPage(),
                'per_page' => $logs->perPage(),
                'total' => $logs->total(),
            ],
        ]);
    }

    /**
     * Export system logs as CSV
     * 
     * GET /api/admin/system-logs/export
     */
    public function export(): Response
    {
        $logs = SystemLog::orderBy('timestamp', 'desc')
            ->limit(10000)
            ->get();

        $csvData = "Timestamp,Level,Source,Message\n";
        
        foreach ($logs as $log) {
            $csvData .= sprintf(
                "%s,%s,%s,%s\n",
                $log->timestamp->toDateTimeString(),
                $log->level,
                $log->source,
                str_replace('"', '""', $log->message) // Escape quotes
            );
        }

        return response($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="system-logs-export.csv"',
        ]);
    }

    /**
     * Log a system event (helper method)
     * 
     * POST /api/admin/system-logs
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'level' => 'required|in:error,warning,info,debug',
            'source' => 'required|string|max:100',
            'message' => 'required|string',
            'details' => 'nullable|array',
            'trace' => 'nullable|string',
        ]);

        $log = SystemLog::create([
            'timestamp' => now(),
            'level' => $validated['level'],
            'source' => $validated['source'],
            'message' => $validated['message'],
            'details' => isset($validated['details']) ? json_encode($validated['details']) : null,
            'trace' => $validated['trace'] ?? null,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'System log created successfully',
            'log' => [
                'id' => $log->id,
                'timestamp' => $log->timestamp->toISOString(),
                'level' => $log->level,
                'source' => $log->source,
                'message' => $log->message,
            ],
        ], 201);
    }
}
