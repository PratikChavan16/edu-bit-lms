<?php

namespace App\Http\Responses;

use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Http\Resources\Json\ResourceCollection;

class ApiResponse
{
    /**
     * Return a success response
     *
     * @param mixed $data
     * @param string|null $message
     * @param array $meta
     * @param int $status
     * @return JsonResponse
     */
    public static function success(
        mixed $data = null,
        ?string $message = null,
        array $meta = [],
        int $status = 200
    ): JsonResponse {
        $response = [];
        
        if ($data !== null) {
            // Handle Laravel Resources
            if ($data instanceof JsonResource || $data instanceof ResourceCollection) {
                $response['data'] = $data;
            } else {
                $response['data'] = $data;
            }
        }
        
        if ($message) {
            $response['message'] = $message;
        }
        
        if (!empty($meta)) {
            $response['meta'] = $meta;
        }
        
        return response()->json($response, $status);
    }
    
    /**
     * Return a created response
     *
     * @param mixed $data
     * @param string|null $message
     * @return JsonResponse
     */
    public static function created(
        mixed $data = null,
        ?string $message = 'Resource created successfully'
    ): JsonResponse {
        return self::success($data, $message, [], 201);
    }
    
    /**
     * Return an updated response
     *
     * @param mixed $data
     * @param string|null $message
     * @return JsonResponse
     */
    public static function updated(
        mixed $data = null,
        ?string $message = 'Resource updated successfully'
    ): JsonResponse {
        return self::success($data, $message);
    }
    
    /**
     * Return a deleted response
     *
     * @param string|null $message
     * @return JsonResponse
     */
    public static function deleted(?string $message = 'Resource deleted successfully'): JsonResponse
    {
        return self::success(null, $message);
    }
    
    /**
     * Return an error response
     *
     * @param string $message
     * @param array $errors
     * @param int $status
     * @param string|null $code
     * @return JsonResponse
     */
    public static function error(
        string $message,
        array $errors = [],
        int $status = 400,
        ?string $code = null
    ): JsonResponse {
        $response = [
            'error' => [
                'message' => $message,
            ]
        ];
        
        if ($code) {
            $response['error']['code'] = $code;
        }
        
        if (!empty($errors)) {
            $response['error']['errors'] = $errors;
        }
        
        return response()->json($response, $status);
    }
    
    /**
     * Return a validation error response
     *
     * @param array $errors
     * @param string $message
     * @return JsonResponse
     */
    public static function validationError(
        array $errors,
        string $message = 'Validation failed'
    ): JsonResponse {
        return self::error($message, $errors, 422, 'VALIDATION_ERROR');
    }
    
    /**
     * Return a not found response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function notFound(string $message = 'Resource not found'): JsonResponse
    {
        return self::error($message, [], 404, 'NOT_FOUND');
    }
    
    /**
     * Return an unauthorized response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function unauthorized(string $message = 'Unauthorized'): JsonResponse
    {
        return self::error($message, [], 401, 'UNAUTHORIZED');
    }
    
    /**
     * Return a forbidden response
     *
     * @param string $message
     * @return JsonResponse
     */
    public static function forbidden(string $message = 'Forbidden'): JsonResponse
    {
        return self::error($message, [], 403, 'FORBIDDEN');
    }
    
    /**
     * Return a server error response
     *
     * @param string $message
     * @param array $errors
     * @return JsonResponse
     */
    public static function serverError(
        string $message = 'Internal server error',
        array $errors = []
    ): JsonResponse {
        return self::error($message, $errors, 500, 'SERVER_ERROR');
    }
}
