<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'message' => 'Bitflow LMS API',
        'version' => '2.0',
        'docs' => url('/api/documentation'),
    ]);
});
