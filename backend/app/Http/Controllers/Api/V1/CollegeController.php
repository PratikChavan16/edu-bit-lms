<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\University;
use App\Events\Broadcasting\CollegeCreated;
use App\Events\Broadcasting\CollegeUpdated;
use App\Services\ExportService;
use App\Services\ImportService;
use App\Http\Responses\ApiResponse;
use App\Exceptions\ApiException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class CollegeController extends Controller
{
    /**
     * Display a listing of colleges.
     * 
     * God Mode: bitflow_owner role sees ALL colleges across all universities.
     * Regular users: Scoped to their university_id via UniversityScope.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            // UniversityScope automatically handles God Mode bypass
            // bitflow_owner sees all colleges, others see only their university's colleges
            $query = College::withCollegeRelations();

            // Optional filter by specific university (for God Mode users)
            if ($request->has('university_id')) {
                \Log::info('✅ Filtering colleges by university_id: ' . $request->university_id);
                $query->where('university_id', $request->university_id);
            }

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

            // Stats are already loaded via withCollegeRelations()
            $collegesWithStats = $colleges->getCollection()->map(function ($college) {
                $collegeArray = $college->toArray();
                $collegeArray['stats'] = [
                    'departments_count' => $college->departments_count ?? 0,
                    'students_count' => $college->students_count ?? 0,
                    'faculty_count' => 0, // TODO: Add faculty relationship
                    'courses_count' => 0, // TODO: Add courses relationship
                ];
                return $collegeArray;
            });

            return ApiResponse::success([
                'colleges' => $collegesWithStats,
                'meta' => [
                    'current_page' => $colleges->currentPage(),
                    'last_page' => $colleges->lastPage(),
                    'per_page' => $colleges->perPage(),
                    'total' => $colleges->total(),
                ]
            ], 'Colleges retrieved successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve colleges: ' . $e->getMessage());
            throw ApiException::serverError('Failed to retrieve colleges');
        }
    }

    /**
     * Advanced search with multi-field filtering and sorting.
     * 
     * Supported filters:
     * - name: string (partial match)
     * - code: string (partial match)
     * - email: string (partial match)
     * - status: array|string (exact match)
     * - type: array|string (exact match)
     * - university_id: array|string (exact match)
     * - established_year: object {min, max}
     * - student_capacity: object {min, max}
     * - created_at: object {from, to}
     * 
     * Sorting:
     * - sort: array of {field, direction} objects
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = College::withCollegeRelations();

            // Apply filters (same logic as before but with eager loading)
            if ($request->has('filters') && is_array($request->filters)) {
                $filters = $request->filters;

                if (!empty($filters['name'])) {
                    $query->where('name', 'like', "%{$filters['name']}%");
                }
                if (!empty($filters['code'])) {
                    $query->where('code', 'like', "%{$filters['code']}%");
                }
                if (!empty($filters['email'])) {
                    $query->where('email', 'like', "%{$filters['email']}%");
                }
                if (!empty($filters['status'])) {
                    $statuses = is_array($filters['status']) ? $filters['status'] : [$filters['status']];
                    $query->whereIn('status', $statuses);
                }
                if (!empty($filters['type'])) {
                    $types = is_array($filters['type']) ? $filters['type'] : [$filters['type']];
                    $query->whereIn('type', $types);
                }
                if (!empty($filters['university_id'])) {
                    $universityIds = is_array($filters['university_id']) ? $filters['university_id'] : [$filters['university_id']];
                    $query->whereIn('university_id', $universityIds);
                }
                if (!empty($filters['established_year'])) {
                    if (!empty($filters['established_year']['min'])) {
                        $query->where('established_year', '>=', $filters['established_year']['min']);
                    }
                    if (!empty($filters['established_year']['max'])) {
                        $query->where('established_year', '<=', $filters['established_year']['max']);
                    }
                }
                if (!empty($filters['student_capacity'])) {
                    if (!empty($filters['student_capacity']['min'])) {
                        $query->where('student_capacity', '>=', $filters['student_capacity']['min']);
                    }
                    if (!empty($filters['student_capacity']['max'])) {
                        $query->where('student_capacity', '<=', $filters['student_capacity']['max']);
                    }
                }
                if (!empty($filters['created_at'])) {
                    if (!empty($filters['created_at']['from'])) {
                        $query->where('created_at', '>=', $filters['created_at']['from']);
                    }
                    if (!empty($filters['created_at']['to'])) {
                        $query->where('created_at', '<=', $filters['created_at']['to']);
                    }
                }
            }

            // Apply sorting
            if ($request->has('sort') && is_array($request->sort)) {
                foreach ($request->sort as $sortItem) {
                    if (is_array($sortItem) && !empty($sortItem['field'])) {
                        $direction = !empty($sortItem['direction']) ? $sortItem['direction'] : 'asc';
                        $query->orderBy($sortItem['field'], $direction);
                    }
                }
            } else {
                $query->orderBy('created_at', 'desc');
            }

            $perPage = $request->get('per_page', 20);
            $colleges = $query->paginate($perPage);

            // Stats are already loaded via withCollegeRelations()
            $collegesWithStats = $colleges->getCollection()->map(function ($college) {
                $collegeArray = $college->toArray();
                $collegeArray['stats'] = [
                    'departments_count' => $college->departments_count ?? 0,
                    'students_count' => $college->students_count ?? 0,
                    'faculty_count' => 0,
                    'courses_count' => 0,
                ];
                return $collegeArray;
            });

            return ApiResponse::success([
                'colleges' => $collegesWithStats,
                'meta' => [
                    'current_page' => $colleges->currentPage(),
                    'last_page' => $colleges->lastPage(),
                    'per_page' => $colleges->perPage(),
                    'total' => $colleges->total(),
                    'filters_applied' => $request->filters ?? [],
                    'sort_applied' => $request->sort ?? [],
                ]
            ], 'Search completed successfully');
        } catch (\Exception $e) {
            \Log::error('College search failed: ' . $e->getMessage());
            throw ApiException::serverError('Search failed');
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
                throw ApiException::validation($validator->errors()->toArray());
            }

            $data = $validator->validated();

            // Set defaults
            $data['status'] = $data['status'] ?? 'active';
            $data['current_enrollment'] = $data['current_enrollment'] ?? 0;

            $college = College::create($data);
            $college->load(['university']);

            // Broadcast event for real-time updates
            broadcast(new CollegeCreated($college))->toOthers();

            return ApiResponse::created($college, 'College created successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to create college: ' . $e->getMessage());
            throw ApiException::serverError('Failed to create college');
        }
    }

    /**
     * Display the specified college.
     */
    public function show(string $id): JsonResponse
    {
        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->withCollegeRelations()
                ->findOrFail($id);

            // Get statistics using cached counts
            $stats = [
                'departments_count' => $college->departments_count ?? 0,
                'students_count' => $college->students_count ?? 0,
                'faculty_count' => 0, // TODO: Add faculty relationship
                'courses_count' => 0, // TODO: Add courses relationship
                'enrollment_percentage' => $college->capacity > 0 
                    ? round(($college->current_enrollment / $college->capacity) * 100, 2)
                    : 0,
                'available_seats' => max(0, ($college->capacity ?? 0) - ($college->current_enrollment ?? 0)),
            ];

            return ApiResponse::success(
                array_merge($college->toArray(), ['stats' => $stats]),
                'College retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('College');
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve college: ' . $e->getMessage());
            throw ApiException::serverError('Failed to retrieve college');
        }
    }

    /**
     * Update the specified college.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->findOrFail($id);

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
                throw ApiException::validation($validator->errors()->toArray());
            }

            $college->update($validator->validated());
            $college->load(['university']);

            // Refresh to get updated data
            $college->refresh();

            // Broadcast event for real-time updates
            broadcast(new CollegeUpdated($college))->toOthers();

            return ApiResponse::updated($college, 'College updated successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('College');
        } catch (\Exception $e) {
            \Log::error('Failed to update college: ' . $e->getMessage());
            throw ApiException::serverError('Failed to update college');
        }
    }

    /**
     * Remove the specified college.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->findOrFail($id);

            // Prevent deletion if college has active departments
            $activeDepartmentsCount = $college->departments()->where('status', 'active')->count();
            if ($activeDepartmentsCount > 0) {
                throw ApiException::conflict(
                    "Cannot delete college with {$activeDepartmentsCount} active department(s). Please deactivate departments first."
                );
            }

            // Prevent deletion if college has active students
            $activeStudentsCount = $college->students()->where('status', 'active')->count();
            if ($activeStudentsCount > 0) {
                throw ApiException::conflict(
                    "Cannot delete college with {$activeStudentsCount} active student(s)."
                );
            }

            $college->delete();

            return ApiResponse::deleted('College deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('College');
        } catch (\Exception $e) {
            \Log::error('Failed to delete college: ' . $e->getMessage());
            throw ApiException::serverError('Failed to delete college');
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

    /**
     * Export colleges to CSV or Excel format.
     * Supports filtering by university, status, type, and search.
     * God Mode: exports all colleges or filtered by university_id parameter
     */
    public function export(Request $request, ExportService $exportService)
    {
        try {
            $query = College::with(['university']);

            // Apply same filters as index method
            if ($request->has('university_id')) {
                $query->where('university_id', $request->university_id);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

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

            // Get all matching records (no pagination for export)
            $colleges = $query->get();

            // Define headers and fields
            $headers = [
                'College Name',
                'Code',
                'University',
                'Type',
                'Email',
                'Phone',
                'Address',
                'Accreditation',
                'Capacity',
                'Current Enrollment',
                'Status',
                'Created At',
            ];

            // Prepare data for export
            $preparedData = $colleges->map(function ($college) {
                return [
                    'name' => $college->name,
                    'code' => $college->code ?? 'N/A',
                    'university' => $college->university ? $college->university->name : 'N/A',
                    'type' => ucfirst($college->type ?? 'N/A'),
                    'email' => $college->email ?? 'N/A',
                    'phone' => $college->phone ?? 'N/A',
                    'address' => $college->address ?? 'N/A',
                    'accreditation' => $college->accreditation ?? 'N/A',
                    'capacity' => $college->capacity ?? 0,
                    'current_enrollment' => $college->current_enrollment ?? 0,
                    'status' => ucfirst($college->status),
                    'created_at' => $college->created_at ? $college->created_at->format('Y-m-d H:i:s') : 'N/A',
                ];
            });

            // Determine export format
            $format = $request->get('format', 'csv'); // csv or excel
            $filename = 'colleges_' . date('Y-m-d_His') . '.' . ($format === 'excel' ? 'xlsx' : 'csv');

            if ($format === 'excel') {
                return $exportService->exportToExcel($preparedData, $headers, $filename);
            } else {
                return $exportService->exportToCsv($preparedData, $headers, $filename);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export colleges',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import colleges from CSV/Excel file
     *
     * @param Request $request
     * @param ImportService $importService
     * @return JsonResponse
     */
    public function import(Request $request, ImportService $importService): JsonResponse
    {
        try {
            // Validate file upload
            $validator = Validator::make($request->all(), [
                'file' => 'required|file|mimes:csv,txt,xlsx|max:10240', // Max 10MB
                'university_id' => 'nullable|uuid|exists:universities,id', // Optional: import for specific university
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');
            $universityId = $request->input('university_id');

            // Expected CSV headers
            $expectedHeaders = [
                'College Name',
                'Domain',
                'Email',
            ];

            // If university_id not provided, expect University column
            if (!$universityId) {
                $expectedHeaders[] = 'University';
            }

            // Parse CSV
            $parseResult = $importService->parseCsv($file, $expectedHeaders);

            if (!$parseResult['success']) {
                return response()->json([
                    'success' => false,
                    'message' => 'Failed to parse CSV file',
                    'errors' => $parseResult['errors']
                ], 400);
            }

            $rows = $parseResult['data'];
            $results = [];
            $importedCount = 0;
            $errorCount = 0;
            $allErrors = [];

            // Begin transaction
            DB::beginTransaction();

            try {
                foreach ($rows as $rowData) {
                    $row = $rowData['data'];
                    $rowNumber = $rowData['row_number'];

                    // Determine university_id
                    $collegeUniversityId = $universityId;
                    
                    if (!$collegeUniversityId && isset($row['University'])) {
                        // Look up university by name
                        $university = University::where('name', $row['University'])->first();
                        if (!$university) {
                            $errorCount++;
                            $error = "Row {$rowNumber}: University '{$row['University']}' not found";
                            $allErrors[] = $error;
                            $results[] = [
                                'row' => $rowNumber,
                                'success' => false,
                                'errors' => [$error]
                            ];
                            continue;
                        }
                        $collegeUniversityId = $university->id;
                    }

                    if (!$collegeUniversityId) {
                        $errorCount++;
                        $error = "Row {$rowNumber}: University not specified";
                        $allErrors[] = $error;
                        $results[] = [
                            'row' => $rowNumber,
                            'success' => false,
                            'errors' => [$error]
                        ];
                        continue;
                    }

                    // Prepare data for validation
                    $collegeData = [
                        'university_id' => $collegeUniversityId,
                        'name' => $row['College Name'] ?? null,
                        'code' => $row['College Code'] ?? null,
                        'domain' => $row['Domain'] ?? null,
                        'email' => $row['Email'] ?? null,
                        'phone' => $row['Phone'] ?? null,
                        'address' => $row['Address'] ?? null,
                        'type' => $importService->normalizeType($row['Type'] ?? null),
                        'accreditation' => $row['Accreditation'] ?? null,
                        'capacity' => $row['Capacity'] ?? null,
                        'current_enrollment' => $row['Current Enrollment'] ?? 0,
                        'status' => $importService->normalizeStatus($row['Status'] ?? null),
                    ];

                    // Remove null values except those that should be nullable
                    $collegeData = array_filter($collegeData, function($value, $key) {
                        // Keep these fields even if null
                        $nullableFields = ['code', 'phone', 'address', 'type', 'accreditation', 'capacity'];
                        if (in_array($key, $nullableFields)) {
                            return true;
                        }
                        return $value !== null;
                    }, ARRAY_FILTER_USE_BOTH);

                    // Validate row data
                    $validationRules = [
                        'university_id' => 'required|uuid|exists:universities,id',
                        'name' => 'required|string|max:255',
                        'code' => 'nullable|string|max:50',
                        'domain' => 'required|string|max:255|unique:colleges,domain',
                        'email' => 'required|email|max:255|unique:colleges,email',
                        'phone' => 'nullable|string|max:20',
                        'address' => 'nullable|string|max:500',
                        'type' => 'nullable|in:engineering,medical,arts,commerce,science,law,management',
                        'accreditation' => 'nullable|string|max:100',
                        'capacity' => 'nullable|integer|min:0',
                        'current_enrollment' => 'integer|min:0',
                        'status' => 'in:active,inactive,suspended',
                    ];

                    $validation = $importService->validateRow($collegeData, $validationRules, $rowNumber);

                    if (!$validation['valid']) {
                        $errorCount++;
                        $allErrors = array_merge($allErrors, $validation['errors']);
                        $results[] = [
                            'row' => $rowNumber,
                            'success' => false,
                            'errors' => $validation['errors']
                        ];
                        continue;
                    }

                    // Create college
                    $college = College::create($validation['data']);

                    // Fire event
                    broadcast(new CollegeCreated($college))->toOthers();

                    $importedCount++;
                    $results[] = [
                        'row' => $rowNumber,
                        'success' => true,
                        'id' => $college->id,
                        'name' => $college->name
                    ];
                }

                // If there are any errors, rollback
                if ($errorCount > 0) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Import failed due to validation errors',
                        'stats' => [
                            'total_rows' => count($rows),
                            'imported' => 0,
                            'failed' => $errorCount,
                            'skipped' => $parseResult['stats']['skipped'] ?? 0
                        ],
                        'errors' => $allErrors,
                        'results' => $results
                    ], 400);
                }

                // Commit transaction
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully imported {$importedCount} colleges",
                    'stats' => [
                        'total_rows' => count($rows),
                        'imported' => $importedCount,
                        'failed' => $errorCount,
                        'skipped' => $parseResult['stats']['skipped'] ?? 0
                    ],
                    'results' => $results
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Import failed',
                    'error' => $e->getMessage()
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process import',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk update status for multiple colleges
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function bulkUpdateStatus(Request $request): JsonResponse
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array|min:1',
                'ids.*' => 'uuid|exists:colleges,id',
                'status' => 'required|in:active,inactive,suspended',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ids = $request->input('ids');
            $status = $request->input('status');
            $updatedCount = 0;
            $failedCount = 0;
            $results = [];

            // Begin transaction
            DB::beginTransaction();

            try {
                foreach ($ids as $id) {
                    $college = College::find($id);

                    if (!$college) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'College not found'
                        ];
                        continue;
                    }

                    // Check permissions
                    $user = auth()->user();
                    if (!$user->hasRole('bitflow_owner') && 
                        !$user->hasRole('university_owner') && 
                        $college->university_id !== $user->university_id) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'Permission denied'
                        ];
                        continue;
                    }

                    // Update status
                    $oldStatus = $college->status;
                    $college->status = $status;
                    $college->save();

                    // Fire event
                    broadcast(new CollegeUpdated($college))->toOthers();

                    $updatedCount++;
                    $results[] = [
                        'id' => $id,
                        'success' => true,
                        'name' => $college->name,
                        'old_status' => $oldStatus,
                        'new_status' => $status
                    ];
                }

                // Commit transaction
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully updated {$updatedCount} colleges",
                    'stats' => [
                        'total' => count($ids),
                        'updated' => $updatedCount,
                        'failed' => $failedCount
                    ],
                    'results' => $results
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Bulk update failed',
                    'error' => $e->getMessage()
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process bulk update',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Bulk delete (soft delete) multiple colleges
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function bulkDelete(Request $request): JsonResponse
    {
        try {
            // Validate request
            $validator = Validator::make($request->all(), [
                'ids' => 'required|array|min:1',
                'ids.*' => 'uuid|exists:colleges,id',
                'permanent' => 'boolean', // Optional: true for permanent delete
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $ids = $request->input('ids');
            $permanent = $request->input('permanent', false);
            $deletedCount = 0;
            $failedCount = 0;
            $results = [];

            // Begin transaction
            DB::beginTransaction();

            try {
                foreach ($ids as $id) {
                    $college = College::find($id);

                    if (!$college) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'College not found'
                        ];
                        continue;
                    }

                    // Check permissions - bitflow_owner and university_owner can delete
                    $user = auth()->user();
                    if (!$user->hasRole('bitflow_owner') && !$user->hasRole('university_owner')) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'Permission denied'
                        ];
                        continue;
                    }

                    // Additional check for university_owner - can only delete colleges in their university
                    if ($user->hasRole('university_owner') && $college->university_id !== $user->university_id) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'Permission denied - college belongs to different university'
                        ];
                        continue;
                    }

                    // Check if college has active departments
                    $activeDepartments = $college->departments()->where('status', 'active')->count();
                    if ($activeDepartments > 0) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => "Cannot delete college with {$activeDepartments} active departments"
                        ];
                        continue;
                    }

                    $collegeName = $college->name;

                    // Delete (soft delete or permanent)
                    if ($permanent) {
                        $college->forceDelete();
                        $deleteType = 'permanently deleted';
                    } else {
                        $college->delete(); // Soft delete
                        $deleteType = 'deleted (soft delete)';
                    }

                    $deletedCount++;
                    $results[] = [
                        'id' => $id,
                        'success' => true,
                        'name' => $collegeName,
                        'delete_type' => $deleteType
                    ];
                }

                // Commit transaction
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully deleted {$deletedCount} colleges",
                    'stats' => [
                        'total' => count($ids),
                        'deleted' => $deletedCount,
                        'failed' => $failedCount
                    ],
                    'results' => $results
                ], 200);

            } catch (\Exception $e) {
                DB::rollBack();
                return response()->json([
                    'success' => false,
                    'message' => 'Bulk delete failed',
                    'error' => $e->getMessage()
                ], 500);
            }

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to process bulk delete',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}

