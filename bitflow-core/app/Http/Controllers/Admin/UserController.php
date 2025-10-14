<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Role;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:sanctum');
        $this->middleware('role:admin');
    }

    /**
     * Display a listing of users
     */
    public function index(Request $request)
    {
        $query = User::query()
            ->with(['roles', 'student.college', 'faculty.college']);

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('username', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%")
                    ->orWhere('first_name', 'like', "%{$search}%")
                    ->orWhere('last_name', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('slug', $request->role);
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $users = $query->paginate($perPage);

        // Transform response to include primary role
        $users->getCollection()->transform(function ($user) {
            $user->primary_role = $user->roles->first()?->slug ?? 'none';
            return $user;
        });

        return response()->json([
            'success' => true,
            'data' => $users,
        ]);
    }

    /**
     * Display the specified user
     */
    public function show($id)
    {
        $user = User::with([
            'roles',
            'student.college.university',
            'faculty.college.university',
        ])->findOrFail($id);

        $user->primary_role = $user->roles->first()?->slug ?? 'none';

        return response()->json([
            'success' => true,
            'data' => $user,
        ]);
    }

    /**
     * Store a newly created user
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|max:255|unique:users',
            'email' => 'required|email|max:255|unique:users',
            'password' => ['required', Password::min(8)->letters()->numbers()->symbols()],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'photo_url' => 'nullable|url',
            'status' => 'sometimes|in:active,inactive,suspended',
            'role' => 'required|exists:roles,slug',
            'university_id' => 'nullable|exists:universities,id',
            'college_id' => 'nullable|exists:colleges,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();
        $role = $data['role'];
        unset($data['role']);

        // Create user
        $data['password'] = Hash::make($data['password']);
        $data['status'] = $data['status'] ?? 'active';

        $user = User::create($data);

        // Assign role
        $roleModel = Role::where('slug', $role)->firstOrFail();
        $pivotData = [];
        
        if (isset($data['university_id'])) {
            $pivotData['university_id'] = $data['university_id'];
        }
        if (isset($data['college_id'])) {
            $pivotData['college_id'] = $data['college_id'];
        }

        $user->roles()->attach($roleModel->id, $pivotData);

        // Load relationships
        $user->load(['roles', 'student', 'faculty']);
        $user->primary_role = $role;

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User created successfully',
        ], 201);
    }

    /**
     * Update the specified user
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'username' => 'sometimes|string|max:255|unique:users,username,' . $id,
            'email' => 'sometimes|email|max:255|unique:users,email,' . $id,
            'password' => ['sometimes', Password::min(8)->letters()->numbers()->symbols()],
            'first_name' => 'sometimes|string|max:255',
            'last_name' => 'sometimes|string|max:255',
            'phone' => 'nullable|string|max:20',
            'date_of_birth' => 'nullable|date|before:today',
            'photo_url' => 'nullable|url',
            'status' => 'sometimes|in:active,inactive,suspended',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $data = $validator->validated();

        // Hash password if provided
        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $user->update($data);

        // Reload relationships
        $user->load(['roles', 'student', 'faculty']);
        $user->primary_role = $user->roles->first()?->slug ?? 'none';

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User updated successfully',
        ]);
    }

    /**
     * Update user roles
     */
    public function updateRoles(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'roles' => 'required|array|min:1',
            'roles.*.slug' => 'required|exists:roles,slug',
            'roles.*.university_id' => 'nullable|exists:universities,id',
            'roles.*.college_id' => 'nullable|exists:colleges,id',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $roles = $request->input('roles');

        // Detach all existing roles
        $user->roles()->detach();

        // Attach new roles with pivot data
        foreach ($roles as $roleData) {
            $role = Role::where('slug', $roleData['slug'])->firstOrFail();
            
            $pivotData = [];
            if (isset($roleData['university_id'])) {
                $pivotData['university_id'] = $roleData['university_id'];
            }
            if (isset($roleData['college_id'])) {
                $pivotData['college_id'] = $roleData['college_id'];
            }

            $user->roles()->attach($role->id, $pivotData);
        }

        // Reload relationships
        $user->load(['roles']);
        $user->primary_role = $user->roles->first()?->slug ?? 'none';

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User roles updated successfully',
        ]);
    }

    /**
     * Deactivate user (soft delete)
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting your own account
        if ($user->id === auth()->id()) {
            return response()->json([
                'success' => false,
                'error' => 'Cannot delete your own account',
            ], 400);
        }

        // Soft delete
        $user->update(['status' => 'inactive']);
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deactivated successfully',
        ]);
    }

    /**
     * Restore a soft-deleted user
     */
    public function restore($id)
    {
        $user = User::withTrashed()->findOrFail($id);

        if (!$user->trashed()) {
            return response()->json([
                'success' => false,
                'error' => 'User is not deactivated',
            ], 400);
        }

        $user->restore();
        $user->update(['status' => 'active']);

        return response()->json([
            'success' => true,
            'data' => $user,
            'message' => 'User restored successfully',
        ]);
    }

    /**
     * Reset user password
     */
    public function resetPassword(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'password' => ['required', Password::min(8)->letters()->numbers()->symbols()],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'error' => 'Validation failed',
                'errors' => $validator->errors(),
            ], 422);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully',
        ]);
    }

    /**
     * Get available roles
     */
    public function getRoles()
    {
        $roles = Role::select('id', 'name', 'slug', 'description')->get();

        return response()->json([
            'success' => true,
            'data' => $roles,
        ]);
    }
}
