<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ScheduledReport;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Cron\CronExpression;

class ScheduledReportController extends Controller
{
    /**
     * Display a listing of scheduled reports
     */
    public function index(Request $request)
    {
        $query = ScheduledReport::with(['creator:id,name,email', 'latestExecution'])
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($request->has('is_active')) {
            $query->where('is_active', $request->boolean('is_active'));
        }

        // Filter by report type
        if ($request->filled('report_type')) {
            $query->where('report_type', $request->report_type);
        }

        // Filter by university (God Mode support)
        $user = auth()->user();
        if ($user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            // God Mode - can see all schedules or filter by university
            if ($request->filled('university_id')) {
                $query->where('university_id', $request->university_id);
            }
        } else {
            // Regular users - only see their university's schedules
            $query->where('university_id', $user->university_id);
        }

        $schedules = $query->paginate($request->input('per_page', 15));

        return response()->json($schedules);
    }

    /**
     * Store a newly created scheduled report
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'report_type' => 'required|in:universities,colleges,users',
            'filters' => 'nullable|array',
            'options' => 'nullable|array',
            'options.paper' => 'nullable|in:a4,letter,legal',
            'options.orientation' => 'nullable|in:portrait,landscape',
            'cron_expression' => 'required|string',
            'frequency_label' => 'nullable|string|max:255',
            'recipients' => 'required|array|min:1',
            'recipients.*' => 'required|email',
            'email_subject' => 'nullable|string|max:255',
            'email_message' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Validate cron expression
        try {
            $cron = new CronExpression($request->cron_expression);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Invalid cron expression',
                'errors' => ['cron_expression' => ['The cron expression is invalid.']],
            ], 422);
        }

        $user = auth()->user();

        // Create scheduled report
        $schedule = ScheduledReport::create([
            'university_id' => $request->input('university_id', $user->university_id),
            'created_by' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'report_type' => $request->report_type,
            'filters' => $request->filters ?? [],
            'options' => $request->options ?? [],
            'cron_expression' => $request->cron_expression,
            'frequency_label' => $request->frequency_label,
            'recipients' => $request->recipients,
            'email_subject' => $request->email_subject,
            'email_message' => $request->email_message,
            'is_active' => $request->input('is_active', true),
        ]);

        // Calculate first run
        $schedule->calculateNextRun();

        return response()->json([
            'message' => 'Scheduled report created successfully',
            'schedule' => $schedule->load('creator'),
        ], 201);
    }

    /**
     * Display the specified scheduled report
     */
    public function show(string $id)
    {
        $schedule = ScheduledReport::with(['creator', 'executions' => function ($query) {
            $query->orderBy('started_at', 'desc')->limit(10);
        }])->findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($schedule->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($schedule);
    }

    /**
     * Update the specified scheduled report
     */
    public function update(Request $request, string $id)
    {
        $schedule = ScheduledReport::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($schedule->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'report_type' => 'in:universities,colleges,users',
            'filters' => 'nullable|array',
            'options' => 'nullable|array',
            'cron_expression' => 'string',
            'frequency_label' => 'nullable|string|max:255',
            'recipients' => 'array|min:1',
            'recipients.*' => 'email',
            'email_subject' => 'nullable|string|max:255',
            'email_message' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        // Validate cron expression if provided
        if ($request->has('cron_expression')) {
            try {
                new CronExpression($request->cron_expression);
            } catch (\Exception $e) {
                return response()->json([
                    'message' => 'Invalid cron expression',
                    'errors' => ['cron_expression' => ['The cron expression is invalid.']],
                ], 422);
            }
        }

        $schedule->update($request->only([
            'name',
            'description',
            'report_type',
            'filters',
            'options',
            'cron_expression',
            'frequency_label',
            'recipients',
            'email_subject',
            'email_message',
            'is_active',
        ]));

        // Recalculate next run if cron changed
        if ($request->has('cron_expression')) {
            $schedule->calculateNextRun();
        }

        return response()->json([
            'message' => 'Scheduled report updated successfully',
            'schedule' => $schedule->fresh(['creator']),
        ]);
    }

    /**
     * Remove the specified scheduled report
     */
    public function destroy(string $id)
    {
        $schedule = ScheduledReport::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($schedule->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $schedule->delete();

        return response()->json([
            'message' => 'Scheduled report deleted successfully',
        ]);
    }

    /**
     * Toggle schedule active status
     */
    public function toggle(string $id)
    {
        $schedule = ScheduledReport::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($schedule->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $schedule->update([
            'is_active' => !$schedule->is_active,
        ]);

        return response()->json([
            'message' => $schedule->is_active ? 'Schedule activated' : 'Schedule deactivated',
            'schedule' => $schedule,
        ]);
    }

    /**
     * Get executions for a schedule
     */
    public function executions(Request $request, string $id)
    {
        $schedule = ScheduledReport::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($schedule->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $executions = $schedule->executions()
            ->orderBy('started_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($executions);
    }

    /**
     * Run a schedule immediately (manual trigger)
     */
    public function runNow(string $id)
    {
        $schedule = ScheduledReport::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($schedule->university_id !== $user->university_id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        try {
            // Queue the command to run in background
            \Artisan::queue('reports:generate-scheduled', [
                '--schedule-id' => $id,
                '--force' => true,
            ]);

            return response()->json([
                'message' => 'Report generation queued. You will receive the report via email shortly.',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to queue report generation',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
