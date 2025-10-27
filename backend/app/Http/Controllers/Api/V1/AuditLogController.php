<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Response;

class AuditLogController extends Controller
{
    /**
     * List audit logs with filters
     */
    public function index(Request $request)
    {
        try {
            $query = AuditLog::with('user:id,name,email')
                ->orderBy('created_at', 'desc');

            // Filter by search (description or user email)
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('user_email', 'like', "%{$search}%")
                      ->orWhere('resource_type', 'like', "%{$search}%");
                });
            }

            // Filter by action
            if ($request->has('action') && $request->action) {
                $query->where('action', $request->action);
            }

            // Filter by user
            if ($request->has('user_id') && $request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            // Filter by resource type
            if ($request->has('resource_type') && $request->resource_type) {
                $query->where('resource_type', $request->resource_type);
            }

            // Filter by date range
            if ($request->has('start_date') && $request->start_date) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->has('end_date') && $request->end_date) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            // Get distinct resource types for filter dropdown
            $resourceTypes = AuditLog::select('resource_type')
                ->distinct()
                ->orderBy('resource_type')
                ->pluck('resource_type');

            // Pagination
            $perPage = $request->input('per_page', 50);
            $logs = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $logs->items(),
                'pagination' => [
                    'total' => $logs->total(),
                    'per_page' => $logs->perPage(),
                    'current_page' => $logs->currentPage(),
                    'last_page' => $logs->lastPage(),
                ],
                'resource_types' => $resourceTypes,
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to fetch audit logs: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch audit logs',
            ], 500);
        }
    }

    /**
     * Export audit logs to CSV
     */
    public function export(Request $request)
    {
        try {
            $query = AuditLog::with('user:id,name,email')
                ->orderBy('created_at', 'desc');

            // Apply same filters as index
            if ($request->has('search') && $request->search) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                      ->orWhere('user_email', 'like', "%{$search}%")
                      ->orWhere('resource_type', 'like', "%{$search}%");
                });
            }

            if ($request->has('action') && $request->action) {
                $query->where('action', $request->action);
            }

            if ($request->has('user_id') && $request->user_id) {
                $query->where('user_id', $request->user_id);
            }

            if ($request->has('resource_type') && $request->resource_type) {
                $query->where('resource_type', $request->resource_type);
            }

            if ($request->has('start_date') && $request->start_date) {
                $query->whereDate('created_at', '>=', $request->start_date);
            }

            if ($request->has('end_date') && $request->end_date) {
                $query->whereDate('created_at', '<=', $request->end_date);
            }

            // Limit to prevent memory issues
            $logs = $query->limit(10000)->get();

            // Generate CSV
            $csv = "Timestamp,User,Email,Role,Action,Resource Type,Resource ID,Description,IP Address\n";
            
            foreach ($logs as $log) {
                $csv .= sprintf(
                    '%s,"%s","%s","%s","%s","%s","%s","%s","%s"' . "\n",
                    $log->created_at->format('Y-m-d H:i:s'),
                    $log->user ? $log->user->name : 'System',
                    $log->user_email ?? 'N/A',
                    $log->user_role ?? 'N/A',
                    $log->action,
                    $log->resource_type,
                    $log->resource_id ?? 'N/A',
                    str_replace('"', '""', $log->description ?? ''),
                    $log->ip_address ?? 'N/A'
                );
            }

            $filename = 'audit-logs-' . now()->format('Y-m-d-His') . '.csv';

            return Response::make($csv, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => "attachment; filename=\"{$filename}\"",
            ]);
        } catch (\Exception $e) {
            Log::error('Failed to export audit logs: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to export audit logs',
            ], 500);
        }
    }
}
