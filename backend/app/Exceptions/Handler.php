<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Illuminate\Validation\ValidationException;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Auth\AuthenticationException;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Http\Responses\ApiResponse;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Render an exception into an HTTP response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function render($request, Throwable $e)
    {
        // Only return JSON for API requests
        if ($request->expectsJson() || $request->is('api/*')) {
            return $this->handleApiException($request, $e);
        }

        return parent::render($request, $e);
    }

    /**
     * Handle API exceptions with consistent JSON format.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Throwable  $e
     * @return \Illuminate\Http\JsonResponse
     */
    protected function handleApiException($request, Throwable $e)
    {
        // Custom API Exception
        if ($e instanceof ApiException) {
            return $e->render();
        }

        // Validation Exception
        if ($e instanceof ValidationException) {
            return ApiResponse::validationError($e->errors());
        }

        // Model Not Found Exception
        if ($e instanceof ModelNotFoundException) {
            $model = class_basename($e->getModel());
            return ApiResponse::notFound("{$model} not found");
        }

        // Not Found Exception (Route not found)
        if ($e instanceof NotFoundHttpException) {
            return ApiResponse::notFound('The requested endpoint does not exist');
        }

        // Authentication Exception
        if ($e instanceof AuthenticationException) {
            return ApiResponse::unauthorized('You must be authenticated to access this resource');
        }

        // HTTP Exception (Custom status codes)
        if ($e instanceof HttpException) {
            $message = $e->getMessage() ?: 'An error occurred';
            $statusCode = $e->getStatusCode();
            
            return ApiResponse::error(
                $message,
                $statusCode,
                'HTTP_ERROR'
            );
        }

        // Database Exception
        if ($e instanceof \Illuminate\Database\QueryException) {
            // Don't expose database errors in production
            $message = config('app.debug')
                ? $e->getMessage()
                : 'A database error occurred';

            return ApiResponse::error(
                'Database error',
                500,
                'DATABASE_ERROR',
                config('app.debug') ? ['details' => $message] : []
            );
        }

        // Generic Exception
        $statusCode = method_exists($e, 'getStatusCode') ? $e->getStatusCode() : 500;
        $message = config('app.debug') ? $e->getMessage() : 'An unexpected error occurred';

        $meta = [];
        if (config('app.debug')) {
            $meta['debug'] = [
                'exception' => get_class($e),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => collect($e->getTrace())->take(5)->toArray(),
            ];
        }

        return ApiResponse::error(
            $message,
            $statusCode,
            'SERVER_ERROR',
            [],
            $meta
        );
    }

    /**
     * Convert an authentication exception into a response.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Auth\AuthenticationException  $exception
     * @return \Symfony\Component\HttpFoundation\Response
     */
    protected function unauthenticated($request, AuthenticationException $exception)
    {
        if ($request->expectsJson() || $request->is('api/*')) {
            return ApiResponse::unauthorized('You must be authenticated to access this resource');
        }

        return redirect()->guest(route('login'));
    }
}
