<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ReportHistory;
use App\Models\ReportTemplate;
use App\Services\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ReportHistoryController extends Controller
{
    protected ReportService $reportService;

    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Display a listing of report history
     */
    public function index(Request $request)
    {
        $query = ReportHistory::with(['generator:id,name,email', 'template:id,name'])
            ->orderBy('generated_at', 'desc');

        // Filter by report type
        if ($request->filled('report_type')) {
            $query->reportType($request->report_type);
        }

        // Filter by template
        if ($request->filled('template_id')) {
            $query->fromTemplate($request->template_id);
        }

        // Filter by date range
        if ($request->filled('from_date')) {
            $query->where('generated_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->where('generated_at', '<=', $request->to_date);
        }

        // Recent reports
        if ($request->filled('recent_days')) {
            $query->recent((int) $request->recent_days);
        }

        // God Mode support
        $user = auth()->user();
        if ($user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            // God Mode - can see all reports or filter by university
            if ($request->filled('university_id')) {
                $query->where('university_id', $request->university_id);
            }
        } else {
            // Regular users - only see their university's reports
            $query->where('university_id', $user->university_id);
        }

        $reports = $query->paginate($request->input('per_page', 20));

        return response()->json($reports);
    }

    /**
     * Display the specified report
     */
    public function show(string $id)
    {
        $report = ReportHistory::with(['generator', 'template'])->findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($report->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($report);
    }

    /**
     * Download a report from history
     */
    public function download(string $id)
    {
        $report = ReportHistory::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($report->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Check if file exists
        if (!$report->fileExists()) {
            return response()->json([
                'message' => 'File not found. The report may have been deleted.',
            ], 404);
        }

        // Increment download count
        $report->incrementDownloads();

        // Return file for download
        return Storage::disk('local')->download($report->file_path, $report->file_name);
    }

    /**
     * Delete a report from history
     */
    public function destroy(string $id)
    {
        $report = ReportHistory::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($report->generated_by !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Delete the file
        $report->deleteFile();

        // Delete the record
        $report->forceDelete();

        return response()->json([
            'message' => 'Report deleted successfully',
        ]);
    }

    /**
     * Bulk delete reports
     */
    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array',
            'ids.*' => 'required|uuid|exists:report_history,id',
        ]);

        $user = auth()->user();
        $deleted = 0;

        foreach ($request->ids as $id) {
            $report = ReportHistory::find($id);

            if (!$report) continue;

            // Check access
            if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
                if ($report->generated_by !== $user->id) {
                    continue; // Skip unauthorized reports
                }
            }

            $report->deleteFile();
            $report->forceDelete();
            $deleted++;
        }

        return response()->json([
            'message' => "{$deleted} report(s) deleted successfully",
            'deleted_count' => $deleted,
        ]);
    }

    /**
     * Generate and save report from template
     */
    public function generateFromTemplate(Request $request, string $templateId)
    {
        $template = ReportTemplate::findOrFail($templateId);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($template->university_id !== $user->university_id 
                && !$template->is_public 
                && !$template->is_system) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // Merge template filters with request overrides
        $filters = array_merge($template->filters ?? [], $request->input('filters', []));
        $options = array_merge($template->options ?? [], [
            'save' => true,
            'download' => $request->boolean('download', false),
        ]);

        try {
            // Generate the report
            $filePath = match ($template->report_type) {
                'universities' => $this->reportService->generateUniversityReport($filters, $options),
                'colleges' => $this->reportService->generateCollegeReport($filters, $options),
                'users' => $this->reportService->generateUsersReport($filters, $options),
                default => throw new \Exception("Unknown report type: {$template->report_type}"),
            };

            // Save to history
            $fileName = basename($filePath);
            $fileSize = Storage::size($filePath) / 1024; // KB

            $history = ReportHistory::create([
                'university_id' => $user->university_id,
                'generated_by' => $user->id,
                'template_id' => $template->id,
                'name' => $template->name,
                'report_type' => $template->report_type,
                'filters' => $filters,
                'options' => $options,
                'file_path' => $filePath,
                'file_name' => $fileName,
                'file_size_kb' => (int) $fileSize,
                'paper_size' => $options['paper'] ?? 'a4',
                'orientation' => $options['orientation'] ?? 'portrait',
                'generated_at' => now(),
            ]);

            // Increment template usage
            $template->incrementUsage();

            if ($options['download']) {
                return Storage::disk('local')->download($filePath, $fileName);
            }

            return response()->json([
                'message' => 'Report generated successfully',
                'history' => $history->load(['generator', 'template']),
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to generate report',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Get storage statistics
     */
    public function stats(Request $request)
    {
        $user = auth()->user();

        $query = ReportHistory::query();

        // Apply university filter for non-God Mode users
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            $query->where('university_id', $user->university_id);
        } elseif ($request->filled('university_id')) {
            $query->where('university_id', $request->university_id);
        }

        $stats = [
            'total_reports' => $query->count(),
            'total_size_mb' => round($query->sum('file_size_kb') / 1024, 2),
            'total_downloads' => $query->sum('download_count'),
            'reports_this_month' => (clone $query)->where('generated_at', '>=', now()->startOfMonth())->count(),
            'reports_by_type' => [
                'universities' => (clone $query)->reportType('universities')->count(),
                'colleges' => (clone $query)->reportType('colleges')->count(),
                'users' => (clone $query)->reportType('users')->count(),
            ],
            'most_generated_template' => $query->whereNotNull('template_id')
                ->selectRaw('template_id, COUNT(*) as count')
                ->groupBy('template_id')
                ->orderBy('count', 'desc')
                ->first(),
        ];

        return response()->json($stats);
    }
}
