<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\University;
use App\Events\Broadcasting\UniversityCreated;
use App\Events\Broadcasting\UniversityUpdated;
use App\Services\ExportService;
use App\Services\ImportService;
use App\Http\Responses\ApiResponse;
use App\Exceptions\ApiException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class UniversityController extends Controller
{
    /**
     * Display a listing of universities.
     * 
     * God Mode: bitflow_owner role sees ALL universities across all tenants.
     * Regular users: Scoped to their university_id via UniversityScope.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $query = University::withUniversityRelations();
            // Note: UniversityScope automatically handles God Mode bypass
            // bitflow_owner sees all, others see only their university

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search by name or domain
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('domain', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Pagination
            $perPage = $request->get('per_page', 15);
            $universities = $query->paginate($perPage);

            return ApiResponse::paginated($universities, 'Universities retrieved successfully');
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve universities: ' . $e->getMessage());
            throw ApiException::serverError('Failed to retrieve universities');
        }
    }

    /**
     * Advanced search with multi-field filtering and sorting.
     * 
     * Supported filters:
     * - name: string (partial match)
     * - domain: string (partial match)
     * - email: string (partial match)
     * - status: array|string (exact match)
     * - established_year: object {min, max}
     * - storage_quota_gb: object {min, max}
     * - created_at: object {from, to}
     * - timezone: string (exact match)
     * 
     * Sorting:
     * - sort: array of {field, direction} objects
     * 
     * Example request:
     * POST /universities/search
     * {
     *   "filters": {
     *     "name": "university",
     *     "status": ["active", "inactive"],
     *     "established_year": {"min": 2000, "max": 2020},
     *     "created_at": {"from": "2023-01-01", "to": "2023-12-31"}
     *   },
     *   "sort": [
     *     {"field": "created_at", "direction": "desc"},
     *     {"field": "name", "direction": "asc"}
     *   ],
     *   "page": 1,
     *   "per_page": 20
     * }
     */
    public function search(Request $request): JsonResponse
    {
        try {
            $query = University::withUniversityRelations();

            // Apply filters
            if ($request->has('filters') && is_array($request->filters)) {
                $filters = $request->filters;

                // Name filter (partial match)
                if (!empty($filters['name'])) {
                    $query->where('name', 'like', "%{$filters['name']}%");
                }

                // Domain filter (partial match)
                if (!empty($filters['domain'])) {
                    $query->where('domain', 'like', "%{$filters['domain']}%");
                }

                // Email filter (partial match)
                if (!empty($filters['email'])) {
                    $query->where('email', 'like', "%{$filters['email']}%");
                }

                // Status filter (exact match, supports multiple values)
                if (!empty($filters['status'])) {
                    $statuses = is_array($filters['status']) ? $filters['status'] : [$filters['status']];
                    $query->whereIn('status', $statuses);
                }

                // Timezone filter (exact match)
                if (!empty($filters['timezone'])) {
                    $query->where('timezone', $filters['timezone']);
                }

                // Established year range filter
                if (!empty($filters['established_year'])) {
                    if (!empty($filters['established_year']['min'])) {
                        $query->where('established_year', '>=', $filters['established_year']['min']);
                    }
                    if (!empty($filters['established_year']['max'])) {
                        $query->where('established_year', '<=', $filters['established_year']['max']);
                    }
                }

                // Storage quota range filter
                if (!empty($filters['storage_quota_gb'])) {
                    if (!empty($filters['storage_quota_gb']['min'])) {
                        $query->where('storage_quota_gb', '>=', $filters['storage_quota_gb']['min']);
                    }
                    if (!empty($filters['storage_quota_gb']['max'])) {
                        $query->where('storage_quota_gb', '<=', $filters['storage_quota_gb']['max']);
                    }
                }

                // Created date range filter
                if (!empty($filters['created_at'])) {
                    if (!empty($filters['created_at']['from'])) {
                        $query->where('created_at', '>=', $filters['created_at']['from']);
                    }
                    if (!empty($filters['created_at']['to'])) {
                        $query->where('created_at', '<=', $filters['created_at']['to']);
                    }
                }
            }

            // Apply sorting (supports multiple sort fields)
            if ($request->has('sort') && is_array($request->sort)) {
                foreach ($request->sort as $sortItem) {
                    if (is_array($sortItem) && !empty($sortItem['field'])) {
                        $direction = !empty($sortItem['direction']) ? $sortItem['direction'] : 'asc';
                        $query->orderBy($sortItem['field'], $direction);
                    }
                }
            } else {
                // Default sorting
                $query->orderBy('created_at', 'desc');
            }

            // Pagination
            $perPage = $request->get('per_page', 20);
            $universities = $query->paginate($perPage);

            return ApiResponse::success([
                'universities' => $universities->items(),
                'meta' => [
                    'current_page' => $universities->currentPage(),
                    'last_page' => $universities->lastPage(),
                    'per_page' => $universities->perPage(),
                    'total' => $universities->total(),
                    'filters_applied' => $request->filters ?? [],
                    'sort_applied' => $request->sort ?? [],
                ]
            ], 'Search completed successfully');
        } catch (\Exception $e) {
            \Log::error('University search failed: ' . $e->getMessage());
            throw ApiException::serverError('Search failed');
        }
    }

    /**
     * Store a newly created university.
     * Creates university + auto-generates University Owner user
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'slug' => 'nullable|string|max:255|unique:universities,slug',
                'domain' => 'required|string|max:255|unique:universities,domain',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                'timezone' => 'nullable|string|max:50',
                'status' => 'nullable|in:active,inactive,suspended',
                'storage_quota_gb' => 'nullable|integer|min:1',
                'branding' => 'nullable|array',
                'settings' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                throw ApiException::validation($validator->errors()->toArray());
            }

            $data = $validator->validated();

            // Auto-generate slug if not provided
            if (empty($data['slug'])) {
                $data['slug'] = Str::slug($data['name']);
            }

            // Set defaults
            $data['status'] = $data['status'] ?? 'active';
            $data['storage_quota_gb'] = $data['storage_quota_gb'] ?? 100;
            $data['storage_used_mb'] = 0;

            // Use transaction to create university + owner
            $result = \DB::transaction(function () use ($data) {
                // 1. Create university
                $university = University::create($data);

                // 2. Generate temporary password for University Owner
                $tempPassword = Str::random(16);

                // 3. Generate username from email
                $emailUsername = explode('@', $data['email'])[0];
                $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emailUsername));
                
                // Ensure username is unique
                $baseUsername = $username;
                $counter = 1;
                while (\App\Models\User::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                    ->where('username', $username)->exists()) {
                    $username = $baseUsername . $counter;
                    $counter++;
                }

                // 4. Create University Owner user
                $owner = \App\Models\User::withoutGlobalScope(\App\Scopes\UniversityScope::class)->create([
                    'username' => $username,
                    'first_name' => 'University',
                    'last_name' => 'Owner',
                    'email' => $data['email'],
                    'password' => \Hash::make($tempPassword),
                    'university_id' => $university->id,
                    'status' => 'active',
                    'email_verified_at' => now(),
                ]);

                // 5. Attach University Owner role
                $ownerRole = \App\Models\Role::where('slug', 'university_owner')->first();
                if ($ownerRole) {
                    $owner->roles()->attach($ownerRole->id, [
                        'id' => (string) Str::uuid(),
                        'assigned_at' => now(),
                        'assigned_by' => auth()->id(),
                    ]);
                }

                return [
                    'university' => $university,
                    'owner' => [
                        'id' => $owner->id,
                        'name' => $owner->full_name,
                        'email' => $owner->email,
                        'username' => $owner->username,
                        'password' => $tempPassword, // Return plain password only once
                        'role' => 'university_owner',
                    ]
                ];
            });

            // Broadcast event for real-time updates
            broadcast(new UniversityCreated($result['university']))->toOthers();

            return ApiResponse::created($result, 'University and owner account created successfully', [
                'note' => 'Please save the owner credentials. Password will not be shown again.'
            ]);
        } catch (\Exception $e) {
            \Log::error('Failed to create university: ' . $e->getMessage());
            throw ApiException::serverError('Failed to create university');
        }
    }

    /**
     * Display the specified university.
     */
    public function show(string $id): JsonResponse
    {
        try {
            $university = University::withUniversityRelations()->findOrFail($id);

            // Get statistics with cached counts
            $stats = [
                'total_colleges' => $university->colleges_count ?? 0,
                'total_users' => $university->users_count ?? 0,
                'storage_usage_percentage' => $university->storage_quota_gb > 0 
                    ? round(($university->storage_used_mb / ($university->storage_quota_gb * 1024)) * 100, 2)
                    : 0,
            ];

            return ApiResponse::success(
                array_merge($university->toArray(), ['stats' => $stats]),
                'University retrieved successfully'
            );
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('University');
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve university: ' . $e->getMessage());
            throw ApiException::serverError('Failed to retrieve university');
        }
    }

    /**
     * Update the specified university.
     */
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'slug' => 'sometimes|required|string|max:255|unique:universities,slug,' . $id,
                'domain' => 'sometimes|required|string|max:255|unique:universities,domain,' . $id,
                'email' => 'sometimes|required|email|max:255',
                'phone' => 'nullable|string|max:20',
                'address' => 'nullable|string',
                'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                'timezone' => 'nullable|string|max:50',
                'status' => 'nullable|in:active,inactive,suspended',
                'storage_quota_gb' => 'nullable|integer|min:1',
                'branding' => 'nullable|array',
                'settings' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                throw ApiException::validation($validator->errors()->toArray());
            }

            $university->update($validator->validated());

            // Refresh to get updated data
            $university->refresh();

            // Broadcast event for real-time updates
            broadcast(new UniversityUpdated($university))->toOthers();

            return ApiResponse::updated($university, 'University updated successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('University');
        } catch (\Exception $e) {
            \Log::error('Failed to update university: ' . $e->getMessage());
            throw ApiException::serverError('Failed to update university');
        }
    }

    /**
     * Remove the specified university (soft delete).
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $university = University::findOrFail($id);

            // Prevent deletion if university has active colleges
            $activeCollegesCount = $university->colleges()->where('status', 'active')->count();
            if ($activeCollegesCount > 0) {
                throw ApiException::conflict(
                    "Cannot delete university with {$activeCollegesCount} active college(s). Please deactivate colleges first."
                );
            }

            $university->delete();

            return ApiResponse::deleted('University deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('University');
        } catch (\Exception $e) {
            \Log::error('Failed to delete university: ' . $e->getMessage());
            throw ApiException::serverError('Failed to delete university');
        }
    }

    /**
     * Export universities to CSV or Excel format.
     * Supports filtering by status, search, and field selection.
     * God Mode: exports all universities or filtered by university_id parameter
     */
    public function export(Request $request, ExportService $exportService)
    {
        try {
            $query = University::query();
            // UniversityScope automatically applies God Mode logic

            // Apply same filters as index method
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('domain', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $query->orderBy($sortBy, $sortOrder);

            // Get all matching records (no pagination for export)
            $universities = $query->get();

            // Define headers and fields
            $headers = [
                'University Name',
                'Code',
                'Domain',
                'Email',
                'Phone',
                'Address',
                'Established Year',
                'Status',
                'Storage Quota (GB)',
                'Storage Used (MB)',
                'Created At',
            ];

            // Prepare data for export
            $preparedData = $universities->map(function ($university) {
                return [
                    'name' => $university->name,
                    'code' => $university->code ?? 'N/A',
                    'domain' => $university->domain,
                    'email' => $university->email,
                    'phone' => $university->phone ?? 'N/A',
                    'address' => $university->address ?? 'N/A',
                    'established_year' => $university->established_year ?? 'N/A',
                    'status' => ucfirst($university->status),
                    'storage_quota_gb' => $university->storage_quota_gb,
                    'storage_used_mb' => $university->storage_used_mb,
                    'created_at' => $university->created_at ? $university->created_at->format('Y-m-d H:i:s') : 'N/A',
                ];
            });

            // Determine export format
            $format = $request->get('format', 'csv'); // csv or excel
            $filename = 'universities_' . date('Y-m-d_His') . '.' . ($format === 'excel' ? 'xlsx' : 'csv');

            if ($format === 'excel') {
                return $exportService->exportToExcel($preparedData, $headers, $filename);
            } else {
                return $exportService->exportToCsv($preparedData, $headers, $filename);
            }
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to export universities',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a soft-deleted university.
     */
    public function restore(string $id): JsonResponse
    {
        try {
            $university = University::withTrashed()->findOrFail($id);
            $university->restore();

            return response()->json([
                'success' => true,
                'message' => 'University restored successfully',
                'data' => $university
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to restore university',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Import universities from CSV/Excel file
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
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $file = $request->file('file');

            // Expected CSV headers
            $expectedHeaders = [
                'University Name',
                'Domain',
                'Email Address',
            ];

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

                    // Prepare data for validation
                    $universityData = [
                        'name' => $row['University Name'] ?? null,
                        'code' => $row['University Code'] ?? null,
                        'domain' => $row['Domain'] ?? null,
                        'email' => $row['Email Address'] ?? null,
                        'phone' => $row['Phone Number'] ?? null,
                        'address' => $row['Address'] ?? null,
                        'established_year' => $row['Established Year'] ?? null,
                        'status' => $importService->normalizeStatus($row['Status'] ?? null),
                        'storage_quota_gb' => $row['Storage Quota (GB)'] ?? 100,
                        'storage_used_mb' => $row['Storage Used (MB)'] ?? 0,
                    ];

                    // Remove null values except those that should be nullable
                    $universityData = array_filter($universityData, function($value) {
                        return $value !== null;
                    });

                    // Validate row data
                    $validationRules = [
                        'name' => 'required|string|max:255',
                        'code' => 'nullable|string|max:50|unique:universities,code',
                        'domain' => 'required|string|max:255|unique:universities,domain',
                        'email' => 'required|email|max:255|unique:universities,email',
                        'phone' => 'nullable|string|max:20',
                        'address' => 'nullable|string|max:500',
                        'established_year' => 'nullable|integer|min:1800|max:' . date('Y'),
                        'status' => 'in:active,inactive,suspended',
                        'storage_quota_gb' => 'integer|min:1|max:10000',
                        'storage_used_mb' => 'integer|min:0',
                    ];

                    $validation = $importService->validateRow($universityData, $validationRules, $rowNumber);

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

                    // Create university
                    $university = University::create($validation['data']);

                    // Fire event
                    broadcast(new UniversityCreated($university))->toOthers();

                    $importedCount++;
                    $results[] = [
                        'row' => $rowNumber,
                        'success' => true,
                        'id' => $university->id,
                        'name' => $university->name
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
                    'message' => "Successfully imported {$importedCount} universities",
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
     * Bulk update status for multiple universities
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
                'ids.*' => 'uuid|exists:universities,id',
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
                    $university = University::find($id);

                    if (!$university) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'University not found'
                        ];
                        continue;
                    }

                    // Check God Mode - regular users can only update their own university
                    $user = auth()->user();
                    if (!$user->hasRole('bitflow_owner') && $university->id !== $user->university_id) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'Permission denied'
                        ];
                        continue;
                    }

                    // Update status
                    $oldStatus = $university->status;
                    $university->status = $status;
                    $university->save();

                    // Fire event
                    broadcast(new UniversityUpdated($university))->toOthers();

                    $updatedCount++;
                    $results[] = [
                        'id' => $id,
                        'success' => true,
                        'name' => $university->name,
                        'old_status' => $oldStatus,
                        'new_status' => $status
                    ];
                }

                // Commit transaction
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully updated {$updatedCount} universities",
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
     * Bulk delete (soft delete) multiple universities
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
                'ids.*' => 'uuid|exists:universities,id',
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
                    $university = University::find($id);

                    if (!$university) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'University not found'
                        ];
                        continue;
                    }

                    // Check God Mode - only bitflow_owner can delete universities
                    $user = auth()->user();
                    if (!$user->hasRole('bitflow_owner')) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => 'Permission denied - only Bitflow Owner can delete universities'
                        ];
                        continue;
                    }

                    // Check if university has active colleges
                    $activeColleges = $university->colleges()->where('status', 'active')->count();
                    if ($activeColleges > 0) {
                        $failedCount++;
                        $results[] = [
                            'id' => $id,
                            'success' => false,
                            'message' => "Cannot delete university with {$activeColleges} active colleges"
                        ];
                        continue;
                    }

                    $universityName = $university->name;

                    // Delete (soft delete or permanent)
                    if ($permanent) {
                        $university->forceDelete();
                        $deleteType = 'permanently deleted';
                    } else {
                        $university->delete(); // Soft delete
                        $deleteType = 'deleted (soft delete)';
                    }

                    $deletedCount++;
                    $results[] = [
                        'id' => $id,
                        'success' => true,
                        'name' => $universityName,
                        'delete_type' => $deleteType
                    ];
                }

                // Commit transaction
                DB::commit();

                return response()->json([
                    'success' => true,
                    'message' => "Successfully deleted {$deletedCount} universities",
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
