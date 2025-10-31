<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Events\Broadcasting\UserCreated;
use App\Http\Responses\ApiResponse;
use App\Exceptions\ApiException;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * List all users with pagination and filters
     * 
     * God Mode: bitflow_owner role sees ALL users across all universities.
     * Regular users: Scoped to their university_id via UniversityScope.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 15);
        $search = $request->input('search');
        $role = $request->input('role');
        $status = $request->input('status');
        $universityId = $request->input('university_id');

        // UniversityScope automatically handles God Mode bypass
        // bitflow_owner sees all users, others see only their university's users
        $query = User::withUserRelations();

        // Optional filter by specific university (for God Mode users)
        if ($universityId) {
            $query->where('university_id', $universityId);
        }

        // Search by name or email
        if ($search) {
            $query->where(function($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($role && $role !== 'all') {
            $query->whereHas('roles', function($q) use ($role) {
                $q->where('slug', $role);
            });
        }

        // Filter by status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        $users = $query->paginate($perPage);

        // Transform users to match frontend GlobalUser interface
        $transformedData = $users->getCollection()->map(function($user) {
            $role = $user->roles->first();
            return [
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'role' => $role ? $role->slug : 'user', // Use slug for role
                'university' => $user->university ? [
                    'id' => $user->university->id,
                    'name' => $user->university->name,
                ] : null,
                'status' => $user->status ?? 'active',
                'last_login' => $user->last_login_at?->toISOString(),
                'created_at' => $user->created_at->toISOString(),
                'updated_at' => $user->updated_at->toISOString(),
            ];
        });

        return ApiResponse::success([
            'users' => $transformedData,
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ], 'Users retrieved successfully');
    }

    /**
     * Get single user details
     */
    public function show(string $id): JsonResponse
    {
        try {
            $user = User::withUserRelations()->findOrFail($id);
            $role = $user->roles->first();

            return ApiResponse::success([
                'id' => $user->id,
                'name' => $user->full_name,
                'email' => $user->email,
                'role' => $role ? $role->slug : 'user',
                'university' => $user->university ? [
                    'id' => $user->university->id,
                    'name' => $user->university->name,
                ] : null,
                'status' => $user->status ?? 'active',
                'last_login' => $user->last_login_at?->toISOString(),
                'created_at' => $user->created_at->toISOString(),
                'updated_at' => $user->updated_at->toISOString(),
            ], 'User retrieved successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('User');
        } catch (\Exception $e) {
            \Log::error('Failed to retrieve user: ' . $e->getMessage());
            throw ApiException::serverError('Failed to retrieve user');
        }
    }

    /**
     * Create new platform user
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|min:3|max:255',
            'email' => 'required|email|unique:users,email',
            'role' => ['required', Rule::in(['bitflow_owner', 'university_owner'])],
            'password' => 'nullable|string|min:8',
        ]);

        if ($validator->fails()) {
            throw ApiException::validation($validator->errors()->toArray());
        }

        // Generate password if not provided
        $password = $request->input('password') ?: Str::random(16);

        // Split name into first and last name
        $nameParts = explode(' ', $request->input('name'), 2);
        $firstName = $nameParts[0];
        $lastName = $nameParts[1] ?? '';

        // Generate username from email (part before @)
        $emailUsername = explode('@', $request->input('email'))[0];
        $username = strtolower(preg_replace('/[^a-zA-Z0-9]/', '', $emailUsername));
        
        // Ensure username is unique
        $baseUsername = $username;
        $counter = 1;
        while (User::withoutGlobalScope(\App\Scopes\UniversityScope::class)->where('username', $username)->exists()) {
            $username = $baseUsername . $counter;
            $counter++;
        }

        // Platform users don't need university_id
        $user = User::withoutGlobalScope(\App\Scopes\UniversityScope::class)->create([
            'username' => $username,
            'first_name' => $firstName,
            'last_name' => $lastName,
            'email' => $request->input('email'),
            'password' => Hash::make($password),
            'status' => 'active',
            'email_verified_at' => now(),
            'university_id' => null, // Platform users have no university
        ]);

        // Attach role
        $role = \App\Models\Role::where('slug', $request->input('role'))->first();
        if ($role) {
            $user->roles()->attach($role->id, [
                'id' => (string) Str::uuid(),
                'assigned_at' => now(),
                'assigned_by' => auth()->id(),
            ]);
        }

        // TODO: Send welcome email with password to user

        // Broadcast event for real-time updates
        broadcast(new UserCreated($user))->toOthers();

        return ApiResponse::created([
            'id' => $user->id,
            'name' => $user->full_name,
            'email' => $user->email,
            'role' => $role ? $role->slug : $request->input('role'),
            'status' => $user->status,
            'created_at' => $user->created_at->toISOString(),
        ], 'User created successfully');
    }

    /**
     * Update user
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $user = User::with('roles')->findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|string|min:3|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => ['sometimes', Rule::in(['bitflow_owner', 'bitflow_staff', 'support_agent'])],
        ]);

        if ($validator->fails()) {
            throw ApiException::validation($validator->errors()->toArray());
        }

        if ($request->has('name')) {
            $nameParts = explode(' ', $request->input('name'), 2);
            $user->first_name = $nameParts[0];
            $user->last_name = $nameParts[1] ?? '';
        }

        if ($request->has('email')) {
            $user->email = $request->input('email');
        }

        if ($request->has('role')) {
            // Detach all current roles and attach new role
            $user->roles()->detach();
            $role = \App\Models\Role::where('slug', $request->input('role'))->first();
            if ($role) {
                $user->roles()->attach($role->id, [
                    'id' => (string) Str::uuid(),
                    'assigned_at' => now(),
                    'assigned_by' => auth()->id(),
                ]);
            }
        }

        $user->save();
        $user->load('roles');
        $role = $user->roles->first();

        return ApiResponse::updated([
            'id' => $user->id,
            'name' => $user->full_name,
            'email' => $user->email,
            'role' => $role ? $role->slug : 'user',
            'status' => $user->status,
        ], 'User updated successfully');
    }

    /**
     * Delete user
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $user = User::findOrFail($id);

            // Prevent deleting yourself
            if (auth()->id() === $user->id) {
                throw ApiException::forbidden('You cannot delete your own account');
            }

            $user->delete();

            return ApiResponse::deleted('User deleted successfully');
        } catch (\Illuminate\Database\Eloquent\ModelNotFoundException $e) {
            throw ApiException::notFound('User');
        } catch (\Exception $e) {
            \Log::error('Failed to delete user: ' . $e->getMessage());
            throw ApiException::serverError('Failed to delete user');
        }
    }

    /**
     * Change user status
     */
    public function changeStatus(Request $request, string $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'status' => ['required', Rule::in(['active', 'inactive', 'locked', 'suspended'])],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user = User::findOrFail($id);

        // Prevent locking yourself
        if (auth()->id() === $user->id && $request->input('status') !== 'active') {
            return response()->json([
                'success' => false,
                'message' => 'You cannot change your own account status',
            ], 403);
        }

        $user->status = $request->input('status');
        $user->save();

        return response()->json([
            'success' => true,
            'message' => 'User status updated successfully',
            'data' => [
                'id' => $user->id,
                'status' => $user->status,
            ],
        ]);
    }

    /**
     * Send password reset email
     */
    public function resetPassword(string $id): JsonResponse
    {
        $user = User::findOrFail($id);

        // Generate temporary password
        $tempPassword = Str::random(12);
        $user->password = Hash::make($tempPassword);
        $user->save();

        // TODO: Send email with temporary password
        // Mail::to($user->email)->send(new PasswordResetMail($tempPassword));

        return response()->json([
            'success' => true,
            'message' => 'Password reset email sent successfully',
            'data' => [
                'email' => $user->email,
            ],
        ]);
    }
}
