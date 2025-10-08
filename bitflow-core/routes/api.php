<?php

use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\OperationsAlertsController;
use App\Http\Controllers\Admin\UniversitiesController;
use App\Http\Controllers\Admin\FeatureTogglesController;
use App\Http\Controllers\Learner\DashboardController as LearnerDashboardController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Admin Portal Routes
Route::prefix('admin')->group(function () {
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/operations/alerts', [OperationsAlertsController::class, 'index']);
    
    Route::get('/universities', [UniversitiesController::class, 'index']);
    Route::get('/universities/{universityId}', [UniversitiesController::class, 'show']);
    
    Route::get('/feature-toggles', [FeatureTogglesController::class, 'index']);
    Route::post('/feature-toggles', [FeatureTogglesController::class, 'store']);
    Route::patch('/feature-toggles/{code}', [FeatureTogglesController::class, 'update']);
});

// Learner Portal Routes
Route::prefix('learner')->group(function () {
    Route::get('/dashboard', [LearnerDashboardController::class, 'index']);
});
