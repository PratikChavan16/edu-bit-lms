<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class CollegeController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    /**
     * Display a listing of colleges
     */
    public function index(Request $request)
    {
        $query = College::query()
            ->with(['university', 'createdBy'])
            ->withCount(['students', 'faculty', 'departments']);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('code', 'like', "%{$search}%");
            });
        }

        // Filter by university
        if ($request->has('university_id')) {
            $query->where('university_id', $request->university_id);
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by type
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $colleges = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $colleges,
        ]);
    }

    /**
     * Display the specified college
     */
    public function show($id)
    {
        $college = College::with([
            'university',
            'departments.courses',
            'students',
            'faculty',
            'createdBy'
        ])
            ->withCount(['students', 'faculty', 'departments', 'courses'])
            ->findOrFail($id);

        return response()->json([
            'success' => true,
            'data' => $college,
        ]);
    }

    /**
     * Store a newly created college
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'university_id' => 'required|exists:universities,id',
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:colleges',
            'type' => 'required|in:engineering,arts,science,commerce,medical,law,management,other',
            'status' => 'sometimes|in:pending,active,inactive',
            'motto' => 'nullable|string|max:500',
            'storage_quota_gb' => 'nullable|integer|min:1|max:10000',
            'student_storage_quota_mb' => 'nullable|integer|min:1|max:10000',
            'branding' => 'nullable|array',
            'branding.logo_url' => 'nullable|url',
            'branding.primary_color' => 'nullable|string|max:7',
            'branding.secondary_color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $data['slug'] = Str::slug($data['name']);
        $data['created_by'] = $request->user()->id;
        $data['status'] = $data['status'] ?? 'pending'; // Default to pending

        $college = College::create($data);

        // Load relationships
        $college->load(['university', 'createdBy']);

        return response()->json([
            'success' => true,
            'data' => $college,
            'message' => 'College created successfully',
        ], 201);
    }

    /**
     * Update the specified college
     */
    public function update(Request $request, $id)
    {
        $college = College::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'university_id' => 'sometimes|exists:universities,id',
            'name' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:colleges,code,' . $id,
            'type' => 'sometimes|in:engineering,arts,science,commerce,medical,law,management,other',
            'status' => 'sometimes|in:pending,active,inactive',
            'motto' => 'nullable|string|max:500',
            'storage_quota_gb' => 'nullable|integer|min:1|max:10000',
            'student_storage_quota_mb' => 'nullable|integer|min:1|max:10000',
            'branding' => 'nullable|array',
            'branding.logo_url' => 'nullable|url',
            'branding.primary_color' => 'nullable|string|max:7',
            'branding.secondary_color' => 'nullable|string|max:7',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Update slug if name changed
        if (isset($data['name'])) {
            $data['slug'] = Str::slug($data['name']);
        }

        $college->update($data);

        // Reload relationships
        $college->load(['university', 'createdBy']);

        return response()->json([
            'success' => true,
            'data' => $college,
            'message' => 'College updated successfully',
        ]);
    }

    /**
     * Approve a pending college
     */
    public function approve($id)
    {
        $college = College::findOrFail($id);

        if ($college->status !== 'pending') {
            return response()->json([
                'success' => false,
                'error' => 'Only pending colleges can be approved',
            ], 400);
        }

        $college->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'data' => $college,
            'message' => 'College approved successfully',
        ]);
    }

    /**
     * Remove the specified college
     */
    public function destroy($id)
    {
        $college = College::findOrFail($id);

        // Check if college has students or faculty
        if ($college->students()->count() > 0 || $college->faculty()->count() > 0) {
            return response()->json([
                'success' => false,
                'error' => 'Cannot delete college with active students or faculty. Please transfer them first.',
            ], 400);
        }

        $college->delete();

        return response()->json([
            'success' => true,
            'message' => 'College deleted successfully',
        ]);
    }

    /**
     * Get college statistics
     */
    public function statistics($id)
    {
        $college = College::withCount([
            'students',
            'faculty',
            'departments',
            'courses'
        ])->findOrFail($id);

        $stats = [
            'total_students' => $college->students_count,
            'total_faculty' => $college->faculty_count,
            'total_departments' => $college->departments_count,
            'total_courses' => $college->courses_count,
            'storage_used_gb' => $college->storage_used_gb ?? 0,
            'storage_quota_gb' => $college->storage_quota_gb,
            'storage_percentage' => $college->storage_quota_gb > 0
                ? round(($college->storage_used_gb ?? 0) / $college->storage_quota_gb * 100, 2)
                : 0,
        ];

        return response()->json([
            'success' => true,
            'data' => $stats,
        ]);
    }
}
