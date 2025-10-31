<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ReportTemplate;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ReportTemplateController extends Controller
{
    /**
     * Display a listing of templates
     */
    public function index(Request $request)
    {
        $query = ReportTemplate::with(['creator:id,name,email'])
            ->orderBy('created_at', 'desc');

        // Filter by category
        if ($request->filled('category')) {
            $query->category($request->category);
        }

        // Filter by report type
        if ($request->filled('report_type')) {
            $query->reportType($request->report_type);
        }

        // Filter by system/custom
        if ($request->has('is_system')) {
            $query->where('is_system', $request->boolean('is_system'));
        }

        // Filter by public/private
        if ($request->has('is_public')) {
            $query->where('is_public', $request->boolean('is_public'));
        }

        // God Mode support
        $user = auth()->user();
        if ($user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            // God Mode - can see all templates or filter by university
            if ($request->filled('university_id')) {
                $query->where('university_id', $request->university_id);
            }
        } else {
            // Regular users - only see their university's templates + public/system templates
            $query->where(function ($q) use ($user) {
                $q->where('university_id', $user->university_id)
                  ->orWhere('is_public', true)
                  ->orWhere('is_system', true);
            });
        }

        // Popular or recent
        if ($request->input('sort') === 'popular') {
            $query->orderBy('usage_count', 'desc');
        } elseif ($request->input('sort') === 'recent') {
            $query->whereNotNull('last_used_at')->orderBy('last_used_at', 'desc');
        }

        $templates = $query->paginate($request->input('per_page', 20));

        return response()->json($templates);
    }

    /**
     * Store a newly created template
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'report_type' => 'required|in:universities,colleges,users',
            'filters' => 'nullable|array',
            'options' => 'nullable|array',
            'options.paper' => 'nullable|in:a4,letter,legal',
            'options.orientation' => 'nullable|in:portrait,landscape',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'is_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = auth()->user();

        $template = ReportTemplate::create([
            'university_id' => $request->input('university_id', $user->university_id),
            'created_by' => $user->id,
            'name' => $request->name,
            'description' => $request->description,
            'category' => $request->input('category', 'custom'),
            'report_type' => $request->report_type,
            'filters' => $request->filters ?? [],
            'options' => $request->options ?? [],
            'icon' => $request->icon,
            'color' => $request->color,
            'is_public' => $request->input('is_public', false),
            'is_system' => false, // Only admin can create system templates
        ]);

        return response()->json([
            'message' => 'Template created successfully',
            'template' => $template->load('creator'),
        ], 201);
    }

    /**
     * Display the specified template
     */
    public function show(string $id)
    {
        $template = ReportTemplate::with(['creator'])->findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($template->university_id !== $user->university_id 
                && !$template->is_public 
                && !$template->is_system) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        return response()->json($template);
    }

    /**
     * Update the specified template
     */
    public function update(Request $request, string $id)
    {
        $template = ReportTemplate::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($template->created_by !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // System templates can only be edited by admins
        if ($template->is_system && !$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            return response()->json(['message' => 'Cannot edit system templates'], 403);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'string|max:255',
            'description' => 'nullable|string',
            'category' => 'nullable|string|max:50',
            'report_type' => 'in:universities,colleges,users',
            'filters' => 'nullable|array',
            'options' => 'nullable|array',
            'icon' => 'nullable|string|max:50',
            'color' => 'nullable|string|max:50',
            'is_public' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $template->update($request->only([
            'name',
            'description',
            'category',
            'report_type',
            'filters',
            'options',
            'icon',
            'color',
            'is_public',
        ]));

        return response()->json([
            'message' => 'Template updated successfully',
            'template' => $template->fresh(['creator']),
        ]);
    }

    /**
     * Remove the specified template
     */
    public function destroy(string $id)
    {
        $template = ReportTemplate::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($template->created_by !== $user->id) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        // System templates can only be deleted by admins
        if ($template->is_system && !$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            return response()->json(['message' => 'Cannot delete system templates'], 403);
        }

        $template->delete();

        return response()->json([
            'message' => 'Template deleted successfully',
        ]);
    }

    /**
     * Duplicate a template
     */
    public function duplicate(string $id)
    {
        $template = ReportTemplate::findOrFail($id);

        // Check access
        $user = auth()->user();
        if (!$user->hasRole(['super_admin', 'bitflow_owner', 'bitflow_admin'])) {
            if ($template->university_id !== $user->university_id 
                && !$template->is_public 
                && !$template->is_system) {
                return response()->json(['message' => 'Unauthorized'], 403);
            }
        }

        $newTemplate = $template->replicate();
        $newTemplate->name = $template->name . ' (Copy)';
        $newTemplate->created_by = $user->id;
        $newTemplate->university_id = $user->university_id;
        $newTemplate->is_system = false;
        $newTemplate->is_public = false;
        $newTemplate->usage_count = 0;
        $newTemplate->last_used_at = null;
        $newTemplate->save();

        return response()->json([
            'message' => 'Template duplicated successfully',
            'template' => $newTemplate->load('creator'),
        ], 201);
    }

    /**
     * Get popular templates
     */
    public function popular(Request $request)
    {
        $limit = $request->input('limit', 10);
        
        $templates = ReportTemplate::with(['creator:id,name,email'])
            ->where(function ($q) {
                $q->where('is_public', true)->orWhere('is_system', true);
            })
            ->popular($limit)
            ->get();

        return response()->json($templates);
    }

    /**
     * Get recently used templates
     */
    public function recent(Request $request)
    {
        $limit = $request->input('limit', 10);
        $user = auth()->user();
        
        $templates = ReportTemplate::with(['creator:id,name,email'])
            ->where(function ($q) use ($user) {
                $q->where('university_id', $user->university_id)
                  ->orWhere('is_public', true)
                  ->orWhere('is_system', true);
            })
            ->recentlyUsed($limit)
            ->get();

        return response()->json($templates);
    }
}
