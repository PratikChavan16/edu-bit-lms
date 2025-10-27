<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class PermissionMiddleware
{
    /**
     * Handle an incoming request.
     * 
     * Usage: Route::middleware(['jwt', 'permission:users.create,users.update'])
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @param  string  ...$permissions  Comma-separated permission slugs
     */
    public function handle(Request $request, Closure $next, string ...$permissions): Response
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'Authentication required',
                'error' => 'UNAUTHENTICATED'
            ], 401);
        }

        // If no permissions specified, just check if user is authenticated
        if (empty($permissions)) {
            return $next($request);
        }

        // Get all permissions from user's roles
        $userPermissions = $user->roles
            ->flatMap(fn($role) => $role->permissions)
            ->pluck('slug')
            ->unique()
            ->toArray();

        // Check if user has any of the required permissions
        $hasPermission = !empty(array_intersect($permissions, $userPermissions));

        if (!$hasPermission) {
            return response()->json([
                'success' => false,
                'message' => 'Insufficient permissions. Required permission: ' . implode(' or ', $permissions),
                'error' => 'INSUFFICIENT_PERMISSION',
                'required_permissions' => $permissions,
                'user_permissions' => config('app.debug') ? $userPermissions : []
            ], 403);
        }

        return $next($request);
    }
}
