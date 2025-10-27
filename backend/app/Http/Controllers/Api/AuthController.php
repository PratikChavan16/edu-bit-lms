<?php

namespace App\Http\Controllers\Api;

use App\Http\Requests\LoginRequest;
use App\Services\AuthService;
use App\Services\JWTService;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    private AuthService $authService;
    private JWTService $jwtService;

    public function __construct(AuthService $authService, JWTService $jwtService)
    {
        $this->authService = $authService;
        $this->jwtService = $jwtService;
    }

    /**
     * Handle user login.
     */
    public function login(LoginRequest $request): JsonResponse
    {
        try {
            $credentials = $request->validated();
            
            $result = $this->authService->login(
                $credentials['email'],
                $credentials['password'],
                $request->ip(),
                $request->userAgent()
            );

            return $this->success($result, 'Login successful');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 401);
        }
    }

    /**
     * Handle user logout.
     */
    public function logout(Request $request): JsonResponse
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return $this->error('Token not provided', 401);
            }

            $decoded = $this->jwtService->verifyToken($token);
            $this->authService->logout($decoded->sub, $decoded->jti);

            return $this->success(null, 'Logged out successfully');
        } catch (\Exception $e) {
            return $this->error('Logout failed: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Refresh access token.
     */
    public function refresh(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'refresh_token' => 'required|string',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $result = $this->authService->refresh(
                $request->refresh_token,
                $request->ip(),
                $request->userAgent()
            );

            return $this->success($result, 'Token refreshed successfully');
        } catch (\Exception $e) {
            return $this->error($e->getMessage(), 401);
        }
    }

    /**
     * Get authenticated user.
     */
    public function me(Request $request): JsonResponse
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return $this->unauthorized('Token not provided');
            }

            $user = $this->authService->getUserFromToken($token);
            if (!$user) {
                return $this->unauthorized('Invalid token');
            }

            // Load relationships
            $user->load(['roles', 'university', 'student']);

            // Get permissions
            $permissions = $user->roles->flatMap(function ($role) {
                return $role->permissions->pluck('slug');
            })->unique()->values();

            return $this->success([
                'id' => $user->id,
                'email' => $user->email,
                'username' => $user->username,
                'full_name' => $user->full_name,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'phone' => $user->phone,
                'photo_url' => $user->photo_url,
                'status' => $user->status,
                'university_id' => $user->university_id,
                'university' => $user->university ? [
                    'id' => $user->university->id,
                    'name' => $user->university->name,
                    'domain' => $user->university->domain,
                ] : null,
                'roles' => $user->roles->map(function ($role) {
                    return [
                        'id' => $role->id,
                        'name' => $role->name,
                        'slug' => $role->slug,
                        'level' => $role->level,
                        'scope' => $role->scope,
                    ];
                }),
                'permissions' => $permissions,
                'student' => $user->student,
                'email_verified_at' => $user->email_verified_at,
                'last_login_at' => $user->last_login_at,
            ], 'User retrieved successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to retrieve user: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Register new user.
     */
    public function register(Request $request): JsonResponse
    {
        // TODO: Implement registration (requires admin/super-admin permissions)
        return $this->error('Registration endpoint not yet implemented', 501);
    }

    /**
     * Forgot password.
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        // TODO: Implement forgot password
        return $this->error('Forgot password not yet implemented', 501);
    }

    /**
     * Reset password.
     */
    public function resetPassword(Request $request): JsonResponse
    {
        // TODO: Implement reset password
        return $this->error('Reset password not yet implemented', 501);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return $this->unauthorized('Token not provided');
            }

            $user = $this->authService->getUserFromToken($token);
            if (!$user) {
                return $this->unauthorized('Invalid token');
            }

            $validator = Validator::make($request->all(), [
                'first_name' => 'sometimes|string|max:100',
                'last_name' => 'sometimes|string|max:100',
                'phone' => 'sometimes|string|max:20',
                'photo_url' => 'sometimes|url|max:500',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            $user->update($validator->validated());

            return $this->success([
                'id' => $user->id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'phone' => $user->phone,
                'photo_url' => $user->photo_url,
            ], 'Profile updated successfully');
        } catch (\Exception $e) {
            return $this->error('Failed to update profile: ' . $e->getMessage(), 400);
        }
    }

    /**
     * Change password.
     */
    public function changePassword(Request $request): JsonResponse
    {
        try {
            $token = $request->bearerToken();
            if (!$token) {
                return $this->unauthorized('Token not provided');
            }

            $user = $this->authService->getUserFromToken($token);
            if (!$user) {
                return $this->unauthorized('Invalid token');
            }

            $validator = Validator::make($request->all(), [
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return $this->validationError($validator->errors());
            }

            // Verify current password
            if (!Hash::check($request->current_password, $user->password)) {
                return $this->error('Current password is incorrect', 400);
            }

            // Update password
            $user->update([
                'password' => Hash::make($request->new_password),
                'password_changed_at' => now(),
            ]);

            // Logout all other sessions
            $this->authService->logoutAllDevices($user->id);

            return $this->success(null, 'Password changed successfully. Please login again.');
        } catch (\Exception $e) {
            return $this->error('Failed to change password: ' . $e->getMessage(), 400);
        }
    }
}
