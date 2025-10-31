<?php

namespace App\Exceptions;

use Exception;
use Illuminate\Http\JsonResponse;

/**
 * Custom API Exception
 * 
 * Provides standardized error responses across the API
 * with consistent format and error codes
 */
class ApiException extends Exception
{
    protected int $statusCode;
    protected string $errorCode;
    protected array $errors;
    protected array $meta;

    public function __construct(
        string $message,
        int $statusCode = 500,
        string $errorCode = 'INTERNAL_ERROR',
        array $errors = [],
        array $meta = []
    ) {
        parent::__construct($message);
        
        $this->statusCode = $statusCode;
        $this->errorCode = $errorCode;
        $this->errors = $errors;
        $this->meta = $meta;
    }

    /**
     * Render the exception as an HTTP response
     */
    public function render(): JsonResponse
    {
        $response = [
            'success' => false,
            'error' => [
                'code' => $this->errorCode,
                'message' => $this->message,
            ],
        ];

        if (!empty($this->errors)) {
            $response['error']['details'] = $this->errors;
        }

        if (!empty($this->meta)) {
            $response['meta'] = $this->meta;
        }

        // Add debug info in development
        if (config('app.debug')) {
            $response['debug'] = [
                'exception' => get_class($this),
                'file' => $this->getFile(),
                'line' => $this->getLine(),
                'trace' => collect($this->getTrace())->take(5)->toArray(),
            ];
        }

        return response()->json($response, $this->statusCode);
    }

    /**
     * Factory methods for common errors
     */

    public static function notFound(string $resource = 'Resource'): self
    {
        return new self(
            message: "{$resource} not found",
            statusCode: 404,
            errorCode: 'NOT_FOUND'
        );
    }

    public static function unauthorized(string $message = 'Unauthorized access'): self
    {
        return new self(
            message: $message,
            statusCode: 401,
            errorCode: 'UNAUTHORIZED'
        );
    }

    public static function forbidden(string $message = 'Forbidden'): self
    {
        return new self(
            message: $message,
            statusCode: 403,
            errorCode: 'FORBIDDEN'
        );
    }

    public static function validation(array $errors, string $message = 'Validation failed'): self
    {
        return new self(
            message: $message,
            statusCode: 422,
            errorCode: 'VALIDATION_ERROR',
            errors: $errors
        );
    }

    public static function conflict(string $message = 'Resource conflict'): self
    {
        return new self(
            message: $message,
            statusCode: 409,
            errorCode: 'CONFLICT'
        );
    }

    public static function badRequest(string $message = 'Bad request'): self
    {
        return new self(
            message: $message,
            statusCode: 400,
            errorCode: 'BAD_REQUEST'
        );
    }

    public static function serverError(string $message = 'Internal server error'): self
    {
        return new self(
            message: $message,
            statusCode: 500,
            errorCode: 'INTERNAL_ERROR'
        );
    }

    public static function serviceUnavailable(string $message = 'Service temporarily unavailable'): self
    {
        return new self(
            message: $message,
            statusCode: 503,
            errorCode: 'SERVICE_UNAVAILABLE'
        );
    }

    public static function tooManyRequests(string $message = 'Too many requests', array $meta = []): self
    {
        return new self(
            message: $message,
            statusCode: 429,
            errorCode: 'RATE_LIMIT_EXCEEDED',
            meta: $meta
        );
    }

    public static function custom(
        string $message,
        int $statusCode,
        string $errorCode,
        array $errors = [],
        array $meta = []
    ): self {
        return new self($message, $statusCode, $errorCode, $errors, $meta);
    }
}
