<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RoleMiddleware
{
    /**
     * Handle an incoming request.
     * 
     * Usage: Route::middleware(['jwt', 'role:super_admin,university_owner'])
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$roles  Comma-separated role slugs
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
                'error' => 'UNAUTHENTICATED'
            ], 401);
        }

        // If no roles specified, just check if user is authenticated
        if (empty($roles)) {
            return $next($request);
        }

        // Get user's role slugs
        $userRoles = $user->roles->pluck('slug')->toArray();

        // Check if user has any of the required roles
        $hasRole = !empty(array_intersect($roles, $userRoles));

        if (!$hasRole) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Required role: ' . implode(' or ', $roles),
                'error' => 'INSUFFICIENT_ROLE',
                'required_roles' => $roles,
                'user_roles' => $userRoles
            ], 403);
        }

        return $next($request);
    }
}
