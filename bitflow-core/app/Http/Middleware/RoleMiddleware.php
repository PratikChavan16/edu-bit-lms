<?php

declare(strict_types=1);

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Role-based access control middleware.
 *
 * Checks if authenticated user has required role(s).
 */
final class RoleMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param Request $request
     * @param Closure $next
     * @param string ...$roles
     * @return Response
     */
    public function handle(Request $request, Closure $next, string ...$roles): Response
    {
        if (!$request->user()) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthenticated.',
            ], 401);
        }

        $user = $request->user();

        // Check if user has any of the required roles
        $hasRole = false;
        foreach ($roles as $role) {
            if ($this->userHasRole($user, $role)) {
                $hasRole = true;
                break;
            }
        }

        if (!$hasRole) {
            return response()->json([
                'success' => false,
                'error' => 'Unauthorized. Required role: ' . implode(' or ', $roles),
            ], 403);
        }

        return $next($request);
    }

    /**
     * Check if user has a specific role.
     *
     * @param mixed $user
     * @param string $role
     * @return bool
     */
    private function userHasRole($user, string $role): bool
    {
        // Direct role check (simple)
        if (property_exists($user, 'role') && $user->role === $role) {
            return true;
        }

        // Spatie permission check (if using roles relationship)
        if (method_exists($user, 'hasRole') && $user->hasRole($role)) {
            return true;
        }

        // Check roles relationship
        if (method_exists($user, 'roles')) {
            return $user->roles()->where('slug', $role)->exists();
        }

        return false;
    }
}
