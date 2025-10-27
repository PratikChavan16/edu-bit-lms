<?php

return [

    /*
    |--------------------------------------------------------------------------
    | JWT Configuration
    |--------------------------------------------------------------------------
    */

    'private_key_path' => env('JWT_PRIVATE_KEY_PATH', 'keys/private.pem'),
    
    'public_key_path' => env('JWT_PUBLIC_KEY_PATH', 'keys/public.pem'),
    
    'algorithm' => env('JWT_ALGORITHM', 'RS256'),
    
    'ttl' => env('JWT_TTL', 900), // 15 minutes in seconds
    
    'refresh_ttl' => env('JWT_REFRESH_TTL', 604800), // 7 days in seconds
    
    'leeway' => env('JWT_LEEWAY', 60), // Clock skew tolerance
    
    'blacklist_enabled' => env('JWT_BLACKLIST_ENABLED', true),
    
    'blacklist_grace_period' => env('JWT_BLACKLIST_GRACE_PERIOD', 0),

];
