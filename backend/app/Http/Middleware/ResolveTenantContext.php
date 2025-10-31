<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Services\JWTService;

class ResolveTenantContext
{
    private JWTService $jwtService;

    public function __construct(JWTService $jwtService)
    {
        $this->jwtService = $jwtService;
    }

    /**
     * Handle an incoming request and inject tenant context.
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Extract JWT token from Authorization header
        $token = $request->bearerToken();

        if ($token) {
            try {
                // Decode token to get university_id
                $decoded = $this->jwtService->verifyToken($token);
                
                if (isset($decoded->university_id)) {
                    // Store the user's university_id in a separate key to avoid conflicts
                    // with query parameters used for filtering (e.g., Bitflow Admin filtering by university)
                    $request->merge(['user_university_id' => $decoded->university_id]);
                    
                    // Store in request attributes for easier access
                    $request->attributes->set('user_university_id', $decoded->university_id);
                    $request->attributes->set('university_id', $decoded->university_id); // Keep for backward compatibility
                    $request->attributes->set('user_id', $decoded->sub);
                    $request->attributes->set('user_roles', $decoded->roles ?? []);
                    $request->attributes->set('user_permissions', $decoded->permissions ?? []);
                }
            } catch (\Exception $e) {
                // Token is invalid, but we don't reject here
                // Let auth middleware handle authentication
            }
        }

        return $next($request);
    }
}
