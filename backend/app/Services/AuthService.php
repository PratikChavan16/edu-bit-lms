<?php

namespace App\Services;

use App\Models\User;
use App\Models\Session;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Exception;

class AuthService
{
    private JWTService $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Authenticate user and generate tokens
     */
    public function login(string $email, string $password, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        // Find user by email
        $user = User::where('email', $email)
            ->with(['roles.permissions'])
            ->first();

        if (!$user) {
            throw new Exception('Invalid credentials');
        }

        // Verify password
        if (!Hash::check($password, $user->password)) {
            throw new Exception('Invalid credentials');
        }

        // Check if user is active
        if ($user->status !== 'active') {
            throw new Exception('Account is not active');
        }

        // Check if email is verified
        if (!$user->email_verified_at) {
            throw new Exception('Email not verified');
        }

        // Get user permissions
        $permissions = $user->roles->flatMap(function ($role) {
            return $role->permissions->pluck('slug');
        })->unique()->values()->toArray();

        // Build JWT payload
        $payload = [
            'sub' => $user->id,
            'email' => $user->email,
            'university_id' => $user->university_id,
            'roles' => $user->roles->pluck('slug')->toArray(),
            'permissions' => $permissions,
        ];

        // Generate tokens
        $accessToken = $this->jwtService->generateAccessToken($payload);
        $refreshData = $this->jwtService->generateRefreshToken($payload);

        // Store refresh token in database
        $session = Session::create([
            'id' => $this->generateUuid(),
            'user_id' => $user->id,
            'refresh_token' => $refreshData['refresh_token'],
            'access_token_jti' => $this->jwtService->getPayload($accessToken)->jti,
            'ip_address' => $ipAddress,
            'user_agent' => $userAgent,
            'last_activity_at' => now(),
            'expires_at' => date('Y-m-d H:i:s', $refreshData['expires_at']),
        ]);

        // Update last login
        $user->update(['last_login_at' => now()]);

        return [
            'access_token' => $accessToken,
            'refresh_token' => $refreshData['refresh_token'],
            'token_type' => 'Bearer',
            'expires_in' => $this->jwtService->getTtl(),
            'user' => [
                'id' => $user->id,
                'email' => $user->email,
                'full_name' => $user->full_name,
                'university_id' => $user->university_id,
                'roles' => $user->roles->pluck('slug'),
                'permissions' => $permissions,
            ],
        ];
    }

    /**
     * Logout user and invalidate tokens
     */
    public function logout(string $userId, string $accessTokenJti): bool
    {
        return Session::where('user_id', $userId)
            ->where('access_token_jti', $accessTokenJti)
            ->delete() > 0;
    }

    /**
     * Refresh access token using refresh token
     */
    public function refresh(string $refreshToken, ?string $ipAddress = null, ?string $userAgent = null): array
    {
        // Find session with refresh token
        $session = Session::where('refresh_token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$session) {
            throw new Exception('Invalid or expired refresh token');
        }

        // Get user with relationships
        $user = User::with(['roles.permissions'])->find($session->user_id);

        if (!$user || $user->status !== 'active') {
            throw new Exception('User account is not active');
        }

        // Get user permissions
        $permissions = $user->roles->flatMap(function ($role) {
            return $role->permissions->pluck('slug');
        })->unique()->values()->toArray();

        // Build new JWT payload
        $payload = [
            'sub' => $user->id,
            'email' => $user->email,
            'university_id' => $user->university_id,
            'roles' => $user->roles->pluck('slug')->toArray(),
            'permissions' => $permissions,
        ];

        // Generate new access token
        $accessToken = $this->jwtService->generateAccessToken($payload);

        // Update session with new access token JTI
        $session->update([
            'access_token_jti' => $this->jwtService->getPayload($accessToken)->jti,
            'last_activity_at' => now(),
            'ip_address' => $ipAddress ?? $session->ip_address,
            'user_agent' => $userAgent ?? $session->user_agent,
        ]);

        return [
            'access_token' => $accessToken,
            'token_type' => 'Bearer',
            'expires_in' => $this->jwtService->getTtl(),
        ];
    }

    /**
     * Get user from JWT token
     */
    public function getUserFromToken(string $token): ?User
    {
        try {
            $decoded = $this->jwtService->verifyToken($token);
            
            return User::with(['roles.permissions'])
                ->find($decoded->sub);
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Verify if token is valid and not blacklisted
     */
    public function verifyToken(string $token): bool
    {
        try {
            $decoded = $this->jwtService->verifyToken($token);
            
            // Check if token is blacklisted (session deleted)
            $session = Session::where('access_token_jti', $decoded->jti)
                ->where('expires_at', '>', now())
                ->exists();
            
            return $session;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Logout from all devices
     */
    public function logoutAllDevices(string $userId): int
    {
        return Session::where('user_id', $userId)->delete();
    }

    /**
     * Get active sessions for user
     */
    public function getActiveSessions(string $userId)
    {
        return Session::where('user_id', $userId)
            ->where('expires_at', '>', now())
            ->orderBy('last_activity_at', 'desc')
            ->get();
    }

    /**
     * Generate UUID v4
     */
    private function generateUuid(): string
    {
        return DB::raw('uuid_generate_v4()')->getValue(DB::connection()->getQueryGrammar());
    }
}
