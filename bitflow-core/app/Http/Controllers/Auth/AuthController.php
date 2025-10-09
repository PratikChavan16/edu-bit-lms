<?php

declare(strict_types=1);

namespace App\Http\Controllers\Auth;

use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

final class AuthController
{
    /**
     * Login with username/email and password
     */
    public function login(Request $request): JsonResponse
    {
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required', 'string'],
            'device_name' => ['nullable', 'string', 'max:255'],
        ]);

        $rateLimitKey = Str::lower($credentials['username']) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($rateLimitKey, 5)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);

            return response()->json([
                'success' => false,
                'error' => 'Too many login attempts. Please try again in ' . $seconds . ' seconds.',
            ], 429);
        }

        // Check if input is email or username
        $field = filter_var($credentials['username'], FILTER_VALIDATE_EMAIL) ? 'email' : 'username';

        $user = User::where($field, $credentials['username'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            RateLimiter::hit($rateLimitKey, 60);

            return response()->json([
                'success' => false,
                'error' => 'The provided credentials are incorrect.',
            ], 401);
        }

        if ($user->status !== 'active') {
            return response()->json([
                'success' => false,
                'error' => 'Your account is not active. Please contact administrator.',
            ], 403);
        }

        RateLimiter::clear($rateLimitKey);

        // Update last login timestamp
        $user->update(['last_login_at' => now()]);

        // Create token
        $deviceName = $credentials['device_name'] ?? ($request->userAgent() ?? 'unknown');
        $token = $user->createToken($deviceName)->plainTextToken;

        // Load user relationships
        $user->load(['roles', 'student', 'faculty']);

        return response()->json([
            'success' => true,
            'data' => [
                'user' => [
                    'id' => $user->id,
                    'username' => $user->username,
                    'email' => $user->email,
                    'first_name' => $user->first_name,
                    'last_name' => $user->last_name,
                    'full_name' => $user->full_name,
                    'photo_url' => $user->photo_url,
                    'status' => $user->status,
                    'roles' => $user->roles->map(fn($role) => [
                        'id' => $role->id,
                        'name' => $role->name,
                        'slug' => $role->slug,
                    ]),
                    'student' => $user->student?->only(['id', 'roll_no', 'course', 'year', 'section']),
                    'faculty' => $user->faculty?->only(['id', 'employee_id', 'department_id']),
                ],
                'token' => $token,
            ],
        ]);
    }

    /**
     * Logout (revoke current token)
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully.',
        ]);
    }

    /**
     * Logout from all devices (revoke all tokens)
     */
    public function logoutAll(Request $request): JsonResponse
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'success' => true,
            'message' => 'Logged out from all devices successfully.',
        ]);
    }

    /**
     * Get authenticated user profile
     */
    public function me(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load(['roles', 'student.college', 'faculty.college']);

        return response()->json([
            'success' => true,
            'data' => [
                'id' => $user->id,
                'username' => $user->username,
                'email' => $user->email,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'full_name' => $user->full_name,
                'phone' => $user->phone,
                'date_of_birth' => $user->date_of_birth?->toDateString(),
                'photo_url' => $user->photo_url,
                'status' => $user->status,
                'last_login_at' => $user->last_login_at?->toIso8601String(),
                'roles' => $user->roles->map(fn($role) => [
                    'id' => $role->id,
                    'name' => $role->name,
                    'slug' => $role->slug,
                    'college_id' => $role->pivot->college_id,
                    'university_id' => $role->pivot->university_id,
                ]),
                'student' => $user->student ? [
                    'id' => $user->student->id,
                    'college_id' => $user->student->college_id,
                    'college_name' => $user->student->college?->name,
                    'roll_no' => $user->student->roll_no,
                    'course' => $user->student->course,
                    'year' => $user->student->year,
                    'section' => $user->student->section,
                    'admission_date' => $user->student->admission_date?->toDateString(),
                    'status' => $user->student->status,
                ] : null,
                'faculty' => $user->faculty ? [
                    'id' => $user->faculty->id,
                    'college_id' => $user->faculty->college_id,
                    'college_name' => $user->faculty->college?->name,
                    'employee_id' => $user->faculty->employee_id,
                    'department_id' => $user->faculty->department_id,
                    'employment_type' => $user->faculty->employment_type,
                    'status' => $user->faculty->status,
                ] : null,
            ],
        ]);
    }

    /**
     * Refresh token (create new token, revoke old one)
     */
    public function refresh(Request $request): JsonResponse
    {
        $user = $request->user();
        $oldToken = $request->user()->currentAccessToken();

        // Create new token
        $deviceName = $oldToken->name ?? ($request->userAgent() ?? 'unknown');
        $newToken = $user->createToken($deviceName)->plainTextToken;

        // Revoke old token
        $oldToken->delete();

        return response()->json([
            'success' => true,
            'data' => [
                'token' => $newToken,
            ],
        ]);
    }

    /**
     * Request password reset link
     */
    public function forgotPassword(Request $request): JsonResponse
    {
        $request->validate([
            'email' => ['required', 'email'],
        ]);

        $rateLimitKey = 'forgot-password:' . $request->ip();

        if (RateLimiter::tooManyAttempts($rateLimitKey, 3)) {
            $seconds = RateLimiter::availableIn($rateLimitKey);

            return response()->json([
                'success' => false,
                'error' => 'Too many password reset requests. Please try again in ' . ceil($seconds / 60) . ' minutes.',
            ], 429);
        }

        RateLimiter::hit($rateLimitKey, 600); // 10 minutes

        $status = Password::sendResetLink(
            $request->only('email')
        );

        if ($status === Password::RESET_LINK_SENT) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset link sent to your email.',
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'Unable to send password reset link. Please check your email address.',
        ], 400);
    }

    /**
     * Reset password with token
     */
    public function resetPassword(Request $request): JsonResponse
    {
        $request->validate([
            'token' => ['required', 'string'],
            'email' => ['required', 'email'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $status = Password::reset(
            $request->only('email', 'password', 'password_confirmation', 'token'),
            function ($user, $password) {
                $user->forceFill([
                    'password' => Hash::make($password),
                ])->save();

                // Revoke all existing tokens
                $user->tokens()->delete();
            }
        );

        if ($status === Password::PASSWORD_RESET) {
            return response()->json([
                'success' => true,
                'message' => 'Password reset successfully.',
            ]);
        }

        return response()->json([
            'success' => false,
            'error' => 'Invalid or expired password reset token.',
        ], 400);
    }

    /**
     * Change password (authenticated user)
     */
    public function changePassword(Request $request): JsonResponse
    {
        $data = $request->validate([
            'current_password' => ['required', 'string'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        $user = $request->user();

        if (!Hash::check($data['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Current password is incorrect.'],
            ]);
        }

        $user->update([
            'password' => Hash::make($data['password']),
        ]);

        // Optionally revoke all other tokens except current
        // $user->tokens()->where('id', '!=', $request->user()->currentAccessToken()->id)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password changed successfully.',
        ]);
    }
}
