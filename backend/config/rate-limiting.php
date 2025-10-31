<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Rate Limiting Configuration
    |--------------------------------------------------------------------------
    |
    | Configure tiered rate limiting for different user types and operations.
    | This helps prevent abuse and ensures fair resource allocation.
    |
    */

    'limiters' => [
        
        /*
        |--------------------------------------------------------------------------
        | Authentication Rate Limits
        |--------------------------------------------------------------------------
        */
        
        'login' => [
            'attempts_per_minute' => env('RATE_LIMIT_LOGIN_PER_MINUTE', 5),
            'attempts_per_hour' => env('RATE_LIMIT_LOGIN_PER_HOUR', 20),
            'decay_minutes' => 1,
        ],

        'register' => [
            'attempts_per_hour' => env('RATE_LIMIT_REGISTER_PER_HOUR', 10),
            'decay_minutes' => 60,
        ],

        'password_reset' => [
            'attempts_per_hour' => env('RATE_LIMIT_PASSWORD_RESET_PER_HOUR', 5),
            'decay_minutes' => 60,
        ],

        /*
        |--------------------------------------------------------------------------
        | API Rate Limits by User Role
        |--------------------------------------------------------------------------
        */
        
        'api_guest' => [
            'requests_per_minute' => env('RATE_LIMIT_API_GUEST_PER_MINUTE', 10),
            'decay_minutes' => 1,
        ],

        'api_user' => [
            'requests_per_minute' => env('RATE_LIMIT_API_USER_PER_MINUTE', 60),
            'requests_per_hour' => env('RATE_LIMIT_API_USER_PER_HOUR', 1000),
            'decay_minutes' => 1,
        ],

        'api_admin' => [
            'requests_per_minute' => env('RATE_LIMIT_API_ADMIN_PER_MINUTE', 300),
            'requests_per_hour' => env('RATE_LIMIT_API_ADMIN_PER_HOUR', 10000),
            'decay_minutes' => 1,
        ],

        'api_owner' => [
            'requests_per_minute' => env('RATE_LIMIT_API_OWNER_PER_MINUTE', 500),
            'requests_per_hour' => env('RATE_LIMIT_API_OWNER_PER_HOUR', 20000),
            'decay_minutes' => 1,
        ],

        /*
        |--------------------------------------------------------------------------
        | Resource-Specific Rate Limits
        |--------------------------------------------------------------------------
        */
        
        'reports' => [
            'generation_per_hour' => env('RATE_LIMIT_REPORTS_PER_HOUR', 10),
            'download_per_hour' => env('RATE_LIMIT_DOWNLOADS_PER_HOUR', 50),
            'decay_minutes' => 60,
        ],

        'uploads' => [
            'files_per_hour' => env('RATE_LIMIT_UPLOADS_PER_HOUR', 20),
            'decay_minutes' => 60,
        ],

        'notifications' => [
            'broadcast_per_hour' => env('RATE_LIMIT_NOTIFICATIONS_PER_HOUR', 100),
            'decay_minutes' => 60,
        ],

        'search' => [
            'requests_per_minute' => env('RATE_LIMIT_SEARCH_PER_MINUTE', 30),
            'decay_minutes' => 1,
        ],

        'export' => [
            'exports_per_hour' => env('RATE_LIMIT_EXPORTS_PER_HOUR', 20),
            'decay_minutes' => 60,
        ],

    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limit Headers
    |--------------------------------------------------------------------------
    |
    | Include rate limit information in response headers.
    |
    */

    'include_headers' => env('RATE_LIMIT_INCLUDE_HEADERS', true),

    'headers' => [
        'limit' => 'X-RateLimit-Limit',
        'remaining' => 'X-RateLimit-Remaining',
        'reset' => 'X-RateLimit-Reset',
        'retry_after' => 'Retry-After',
    ],

    /*
    |--------------------------------------------------------------------------
    | Rate Limit Bypass
    |--------------------------------------------------------------------------
    |
    | IP addresses or user IDs that bypass rate limiting.
    | Use with caution and only for trusted sources.
    |
    */

    'bypass' => [
        'ips' => explode(',', env('RATE_LIMIT_BYPASS_IPS', '')),
        'user_ids' => explode(',', env('RATE_LIMIT_BYPASS_USER_IDS', '')),
    ],

];
