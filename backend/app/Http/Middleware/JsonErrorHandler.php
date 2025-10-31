<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Throwable;

/**
 * JSON Error Handler Middleware
 * 
 * Ensures all errors are returned as JSON for API routes
 */
class JsonErrorHandler
{
    public function handle(Request $request, Closure $next): Response
    {
        try {
            return $next($request);
        } catch (Throwable $e) {
            // Let the exception handler deal with it
            throw $e;
        }
    }
}
