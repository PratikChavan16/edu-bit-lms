<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\JWTService;
use App\Models\User;

class JwtMiddleware
{
    protected JWTService $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Get token from Authorization header
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication token not provided',
                'error' => 'MISSING_TOKEN'
            ], 401);
        }

        try {
            // Validate and decode token
            $payload = $this->jwtService->validateAccessToken($token);

            if (!$payload) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid or expired token',
                    'error' => 'INVALID_TOKEN'
                ], 401);
            }

            // Load user from database (without global scope for platform admins)
            $user = User::withoutGlobalScope(\App\Scopes\UniversityScope::class)
                ->with(['roles', 'roles.permissions'])
                ->find($payload['sub']);

            if (!$user) {
                return response()->json([
                    'success' => false,
                    'message' => 'User not found',
                    'error' => 'USER_NOT_FOUND'
                ], 401);
            }

            // Check if user is active
            if ($user->status !== 'active') {
                return response()->json([
                    'success' => false,
                    'message' => 'User account is not active',
                    'error' => 'INACTIVE_USER'
                ], 403);
            }

            // Attach user to request
            $request->setUserResolver(function () use ($user) {
                return $user;
            });

            // Store token payload in request for quick access
            $request->merge(['token_payload' => $payload]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Token validation failed',
                'error' => 'TOKEN_VALIDATION_FAILED',
                'details' => config('app.debug') ? $e->getMessage() : null
            ], 401);
        }

        return $next($request);
    }
}
