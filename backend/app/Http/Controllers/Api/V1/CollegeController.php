<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\College;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CollegeController extends Controller
{
    /**
     * Display a listing of colleges.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = College::query()->with(['university']);

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by type (engineering, arts, science, etc.)
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Search by name or code
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('code', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $colleges = $query->paginate($perPage);

            return response()->json([
                'success' => true,
                'message' => 'Colleges retrieved successfully',
                'data' => $colleges->items(),
                'meta' => [
                    'current_page' => $colleges->currentPage(),
                    'last_page' => $colleges->lastPage(),
                    'per_page' => $colleges->perPage(),
                    'total' => $colleges->total(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve colleges',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created college.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'university_id' => 'required|uuid|exists:universities,id',
                'name' => 'required|string|max:255',
                'code' => 'required|string|max:50|unique:colleges,code',
                'type' => 'nullable|string|max:100',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                'status' => 'nullable|in:active,inactive,suspended',
                'capacity' => 'nullable|integer|min:1',
                'current_enrollment' => 'nullable|integer|min:0',
                'accreditation' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $validator->validated();

            // Set defaults
            $data['status'] = $data['status'] ?? 'active';
            $data['current_enrollment'] = $data['current_enrollment'] ?? 0;

            $college = College::create($data);
            $college->load(['university']);

            return response()->json([
                'success' => true,
                'message' => 'College created successfully',
                'data' => $college
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create college',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified college.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $college = College::with(['university', 'departments'])->findOrFail($id);

            // Get statistics
            $stats = [
                'total_departments' => $college->departments()->count(),
                'total_students' => $college->students()->count(),
                'enrollment_percentage' => $college->capacity > 0 
                    ? round(($college->current_enrollment / $college->capacity) * 100, 2)
                    : 0,
                'available_seats' => max(0, ($college->capacity ?? 0) - ($college->current_enrollment ?? 0)),
            ];

            return response()->json([
                'success' => true,
                'message' => 'College retrieved successfully',
                'data' => array_merge($college->toArray(), ['stats' => $stats])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'College not found',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Update the specified college.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $college = College::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'university_id' => 'sometimes|required|uuid|exists:universities,id',
                'name' => 'sometimes|required|string|max:255',
                'code' => 'sometimes|required|string|max:50|unique:colleges,code,' . $id,
                'type' => 'nullable|string|max:100',
                'email' => 'sometimes|required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                'status' => 'nullable|in:active,inactive,suspended',
                'capacity' => 'nullable|integer|min:1',
                'current_enrollment' => 'nullable|integer|min:0',
                'accreditation' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $college->update($validator->validated());
            $college->load(['university']);

            return response()->json([
                'success' => true,
                'message' => 'College updated successfully',
                'data' => $college->fresh(['university'])
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update college',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified college.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $college = College::findOrFail($id);

            // Prevent deletion if college has active departments
            $activeDepartmentsCount = $college->departments()->where('status', 'active')->count();
            if ($activeDepartmentsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete college with {$activeDepartmentsCount} active department(s). Please deactivate departments first."
                ], 422);
            }

            // Prevent deletion if college has active students
            $activeStudentsCount = $college->students()->where('status', 'active')->count();
            if ($activeStudentsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => "Cannot delete college with {$activeStudentsCount} active student(s)."
                ], 422);
            }

            $college->delete();

            return response()->json([
                'success' => true,
                'message' => 'College deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete college',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics for a specific college.
     */
    public function statistics(string $id): JsonResponse
    {
        try {
            $college = College::findOrFail($id);

            $stats = [
                'overview' => [
                    'total_departments' => $college->departments()->count(),
                    'active_departments' => $college->departments()->where('status', 'active')->count(),
                    'total_students' => $college->students()->count(),
                    'active_students' => $college->students()->where('status', 'active')->count(),
                    'capacity' => $college->capacity,
                    'current_enrollment' => $college->current_enrollment,
                    'available_seats' => max(0, ($college->capacity ?? 0) - ($college->current_enrollment ?? 0)),
                    'enrollment_percentage' => $college->capacity > 0 
                        ? round(($college->current_enrollment / $college->capacity) * 100, 2)
                        : 0,
                ],
                'by_department' => $college->departments()
                    ->withCount('students')
                    ->get()
                    ->map(function($dept) {
                        return [
                            'id' => $dept->id,
                            'name' => $dept->name,
                            'code' => $dept->code,
                            'total_students' => $dept->students_count,
                        ];
                    }),
            ];

            return response()->json([
                'success' => true,
                'message' => 'College statistics retrieved successfully',
                'data' => $stats
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve statistics',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
