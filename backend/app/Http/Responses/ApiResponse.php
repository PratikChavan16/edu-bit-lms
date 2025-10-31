<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;

/**
 * Standardized API Response Builder
 * 
 * Provides consistent response format across all API endpoints
 */
class ApiResponse
{
    /**
     * Success response
     */
    public static function success(
        mixed $data = null,
        string $message = 'Success',
        int $statusCode = 200,
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
        ];

        if ($data !== null) {
            $response['data'] = $data;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Error response
     */
    public static function error(
        string $message,
        int $statusCode = 500,
        string $errorCode = 'ERROR',
        array $errors = [],
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => false,
            'error' => [
                'code' => $errorCode,
                'message' => $message,
            ],
        ];

        if (!empty($errors)) {
            $response['error']['details'] = $errors;
        }

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response, $statusCode);
    }

    /**
     * Paginated response
     */
    public static function paginated(
        LengthAwarePaginator $paginator,
        string $message = 'Success',
        array $meta = []
    ): JsonResponse {
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $paginator->items(),
            'pagination' => [
                'total' => $paginator->total(),
                'count' => $paginator->count(),
                'per_page' => $paginator->perPage(),
                'current_page' => $paginator->currentPage(),
                'total_pages' => $paginator->lastPage(),
                'has_more_pages' => $paginator->hasMorePages(),
            ],
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response);
    }

    /**
     * Collection response with count
     */
    public static function collection(
        Collection|array $items,
        string $message = 'Success',
        array $meta = []
    ): JsonResponse {
        $items = $items instanceof Collection ? $items->all() : $items;
        
        $response = [
            'success' => true,
            'message' => $message,
            'data' => $items,
            'count' => count($items),
        ];

        if (!empty($meta)) {
            $response['meta'] = $meta;
        }

        return response()->json($response);
    }

    /**
     * Created response (201)
     */
    public static function created(
        mixed $data,
        string $message = 'Resource created successfully',
        array $meta = []
    ): JsonResponse {
        return self::success($data, $message, 201, $meta);
    }

    /**
     * Updated response
     */
    public static function updated(
        mixed $data = null,
        string $message = 'Resource updated successfully',
        array $meta = []
    ): JsonResponse {
        return self::success($data, $message, 200, $meta);
    }

    /**
     * Deleted response
     */
    public static function deleted(
        string $message = 'Resource deleted successfully',
        array $meta = []
    ): JsonResponse {
        return self::success(null, $message, 200, $meta);
    }

    /**
     * No content response (204)
     */
    public static function noContent(): JsonResponse
    {
        return response()->json(null, 204);
    }

    /**
     * Validation error response
     */
    public static function validationError(
        array $errors,
        string $message = 'Validation failed'
    ): JsonResponse {
        return self::error($message, 422, 'VALIDATION_ERROR', $errors);
    }

    /**
     * Not found response
     */
    public static function notFound(
        string $message = 'Resource not found'
    ): JsonResponse {
        return self::error($message, 404, 'NOT_FOUND');
    }

    /**
     * Unauthorized response
     */
    public static function unauthorized(
        string $message = 'Unauthorized'
    ): JsonResponse {
        return self::error($message, 401, 'UNAUTHORIZED');
    }

    /**
     * Forbidden response
     */
    public static function forbidden(
        string $message = 'Forbidden'
    ): JsonResponse {
        return self::error($message, 403, 'FORBIDDEN');
    }

    /**
     * Conflict response
     */
    public static function conflict(
        string $message = 'Resource conflict'
    ): JsonResponse {
        return self::error($message, 409, 'CONFLICT');
    }

    /**
     * Server error response
     */
    public static function serverError(
        string $message = 'Internal server error'
    ): JsonResponse {
        return self::error($message, 500, 'INTERNAL_ERROR');
    }

    /**
     * Too many requests response
     */
    public static function tooManyRequests(
        string $message = 'Too many requests',
        array $meta = []
    ): JsonResponse {
        return self::error($message, 429, 'RATE_LIMIT_EXCEEDED', [], $meta);
    }
}
