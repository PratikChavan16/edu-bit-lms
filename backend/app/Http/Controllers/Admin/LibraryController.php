<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\College;
use App\Models\LibraryBook;
use App\Models\AuditLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class LibraryController extends Controller
{
    /**
     * Get all library resources for a college
     */
    public function index(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            AuditLog::log(
                action: 'view_library_resources',
                resourceType: 'Library',
                resourceId: $collegeId,
                description: "God Mode: Viewed library resources for {$college->name}"
            );

            $query = LibraryBook::where('college_id', $collegeId);

            // Filters
            if ($request->has('resource_type')) {
                $query->where('resource_type', $request->resource_type);
            }

            if ($request->has('category')) {
                $query->where('category', $request->category);
            }

            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                        ->orWhere('author', 'like', "%{$search}%")
                        ->orWhere('isbn', 'like', "%{$search}%");
                });
            }

            $perPage = $request->get('per_page', 20);
            $books = $query->with(['department'])->orderBy('title')->paginate($perPage);

            return response()->json([
                'success' => true,
                'data' => $books->items(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'pagination' => [
                        'current_page' => $books->currentPage(),
                        'last_page' => $books->lastPage(),
                        'per_page' => $books->perPage(),
                        'total' => $books->total(),
                    ],
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching library resources', [
                'college_id' => $collegeId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to fetch library resources',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Store a new library resource
     */
    public function store(Request $request, string $universityId, string $collegeId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            // Disable global scope for Bitflow Admin
            $college = College::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->where('university_id', $universityId)
                ->where('id', $collegeId)
                ->firstOrFail();

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'author' => 'required|string|max:255',
                'isbn' => 'nullable|string|max:20|unique:library_books,isbn',
                'publisher' => 'nullable|string|max:255',
                'publication_year' => 'nullable|integer|min:1900|max:' . date('Y'),
                'edition' => 'nullable|string|max:50',
                'resource_type' => 'required|in:book,journal,magazine,ebook,reference,thesis',
                'category' => 'nullable|string|max:100',
                'language' => 'nullable|string|max:50',
                'total_copies' => 'required|integer|min:1',
                'available_copies' => 'required|integer|min:0',
                'price' => 'nullable|numeric|min:0',
                'purchase_date' => 'nullable|date',
                'shelf_location' => 'nullable|string|max:100',
                'description' => 'nullable|string',
                'department_id' => 'nullable|exists:departments,id',
                'status' => 'required|in:available,issued,damaged,lost,maintenance',
            ]);

            $validated['college_id'] = $collegeId;
            $validated['university_id'] = $universityId;
            $validated['issued_copies'] = 0;

            $book = LibraryBook::create($validated);

            AuditLog::log(
                action: 'create_library_book',
                resourceType: 'LibraryBook',
                resourceId: $book->id,
                changes: ['new' => $validated],
                description: "God Mode: Added library book {$book->title}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Library resource added successfully',
                'data' => $book,
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 201);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_VALIDATION_FAILED',
                    'message' => 'Validation failed',
                    'field_errors' => collect($e->errors())->map(fn($errors, $field) => [
                        'field' => $field,
                        'message' => $errors[0],
                    ])->values(),
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error creating library book', [
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to add library resource',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Show a specific library book
     */
    public function show(Request $request, string $universityId, string $collegeId, string $bookId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $book = LibraryBook::where('college_id', $collegeId)
                ->where('id', $bookId)
                ->with(['department', 'issues'])
                ->firstOrFail();

            AuditLog::log(
                action: 'view_library_book',
                resourceType: 'LibraryBook',
                resourceId: $bookId,
                description: "God Mode: Viewed library book {$book->title}"
            );

            return response()->json([
                'success' => true,
                'data' => $book,
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_RESOURCE_NOT_FOUND',
                    'message' => 'Library book not found',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 404);
        }
    }

    /**
     * Update a library book
     */
    public function update(Request $request, string $universityId, string $collegeId, string $bookId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $book = LibraryBook::where('college_id', $collegeId)
                ->where('id', $bookId)
                ->firstOrFail();

            $validated = $request->validate([
                'title' => 'sometimes|string|max:255',
                'author' => 'sometimes|string|max:255',
                'isbn' => 'sometimes|string|max:20|unique:library_books,isbn,' . $bookId,
                'publisher' => 'nullable|string|max:255',
                'total_copies' => 'sometimes|integer|min:1',
                'available_copies' => 'sometimes|integer|min:0',
                'price' => 'nullable|numeric|min:0',
                'shelf_location' => 'nullable|string|max:100',
                'status' => 'sometimes|in:available,issued,damaged,lost,maintenance',
            ]);

            $oldValues = $book->only(array_keys($validated));
            $book->update($validated);

            AuditLog::log(
                action: 'update_library_book',
                resourceType: 'LibraryBook',
                resourceId: $bookId,
                changes: [
                    'old' => $oldValues,
                    'new' => $validated,
                ],
                description: "God Mode: Updated library book {$book->title}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Library book updated successfully',
                'data' => $book->fresh(),
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (ValidationException $e) {
            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_VALIDATION_FAILED',
                    'message' => 'Validation failed',
                    'field_errors' => collect($e->errors())->map(fn($errors, $field) => [
                        'field' => $field,
                        'message' => $errors[0],
                    ])->values(),
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 422);

        } catch (\Exception $e) {
            Log::error('Error updating library book', [
                'book_id' => $bookId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to update library book',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }

    /**
     * Delete a library book (soft delete)
     */
    public function destroy(Request $request, string $universityId, string $collegeId, string $bookId): JsonResponse
    {
        $requestId = $request->header('X-Request-ID', 'req_' . Str::random(16));

        try {
            $book = LibraryBook::where('college_id', $collegeId)
                ->where('id', $bookId)
                ->firstOrFail();

            $bookTitle = $book->title;
            $book->delete();

            AuditLog::log(
                action: 'delete_library_book',
                resourceType: 'LibraryBook',
                resourceId: $bookId,
                description: "God Mode: Deleted library book {$bookTitle}"
            );

            return response()->json([
                'success' => true,
                'message' => 'Library book deleted successfully',
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                    'portal' => 'bitflow-admin',
                    'god_mode_context' => [
                        'is_god_mode' => true,
                        'viewing_tenant_id' => $universityId,
                        'hierarchy_level' => 'platform',
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error deleting library book', [
                'book_id' => $bookId,
                'error' => $e->getMessage(),
                'request_id' => $requestId,
            ]);

            return response()->json([
                'success' => false,
                'error' => [
                    'code' => 'ERR_INTERNAL_SERVER',
                    'message' => 'Failed to delete library book',
                ],
                'metadata' => [
                    'timestamp' => now()->toIso8601String(),
                    'request_id' => $requestId,
                ],
            ], 500);
        }
    }
}
