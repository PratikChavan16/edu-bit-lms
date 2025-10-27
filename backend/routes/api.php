<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\V1\UniversityController;
use App\Http\Controllers\Api\V1\CollegeController;
use App\Http\Controllers\Api\V1\DashboardController;
use App\Http\Controllers\Api\V1\UserController;
use App\Http\Controllers\Api\V1\BillingController;
use App\Http\Controllers\Api\V1\SystemLogController;
use App\Http\Controllers\Api\V1\SupportTicketController;
use App\Http\Controllers\Api\V1\SettingsController;
use App\Http\Controllers\Api\V1\AuditLogController;
use App\Http\Controllers\Admin\UniversityHubController;
use App\Http\Controllers\Admin\CollegeHubController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Public routes (no authentication required) - strict rate limiting
    Route::prefix('auth')->middleware('throttle:10,1')->group(function () {
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
        Route::post('/reset-password', [AuthController::class, 'resetPassword']);
    });

    // Protected routes (authentication required) - moderate rate limiting
    Route::middleware(['jwt', 'tenant', 'throttle:60,1'])->group(function () {
        
        // Authentication routes
        Route::prefix('auth')->group(function () {
            Route::post('/logout', [AuthController::class, 'logout']);
            Route::get('/me', [AuthController::class, 'me']);
            Route::put('/profile', [AuthController::class, 'updateProfile']);
            Route::put('/password', [AuthController::class, 'changePassword']);
        });

        // University Management (Bitflow Admin only - no tenant scope)
        Route::middleware(['role:bitflow_owner'])->group(function () {
            // Dashboard endpoints
            Route::prefix('admin')->group(function () {
                Route::get('dashboard', [DashboardController::class, 'index']);
                Route::get('system/health', [DashboardController::class, 'health']);
                Route::get('alerts', [DashboardController::class, 'alerts']);
                Route::get('activity', [DashboardController::class, 'activity']);
                Route::get('revenue', [DashboardController::class, 'revenue']);

                // Users Management endpoints
                Route::get('users', [UserController::class, 'index']);
                Route::post('users', [UserController::class, 'store']);
                Route::get('users/{id}', [UserController::class, 'show']);
                Route::put('users/{id}', [UserController::class, 'update']);
                Route::delete('users/{id}', [UserController::class, 'destroy']);
                Route::patch('users/{id}/status', [UserController::class, 'changeStatus']);
                Route::post('users/{id}/reset-password', [UserController::class, 'resetPassword']);
            });

            // Universities CRUD
            Route::apiResource('universities', UniversityController::class);
            Route::post('universities/{id}/restore', [UniversityController::class, 'restore']);

            // Billing & Subscriptions
            Route::prefix('billing')->group(function () {
                Route::get('/', [BillingController::class, 'index']);
                Route::get('/invoices', [BillingController::class, 'invoices']);
                Route::get('/invoices/export', [BillingController::class, 'exportInvoices']);
                Route::get('/invoices/{id}/download', [BillingController::class, 'downloadInvoice']);
                Route::post('/invoices/{id}/retry', [BillingController::class, 'retryPayment']);
                Route::get('/subscriptions', [BillingController::class, 'subscriptions']);
                Route::patch('/subscriptions/{id}', [BillingController::class, 'updateSubscription']);
            });

            // System Logs
            Route::prefix('system-logs')->group(function () {
                Route::get('/', [SystemLogController::class, 'index']);
                Route::get('/export', [SystemLogController::class, 'export']);
                Route::post('/', [SystemLogController::class, 'store']);
            });

            // Support Tickets
            Route::prefix('support')->group(function () {
                Route::get('/', [SupportTicketController::class, 'index']);
                Route::post('/', [SupportTicketController::class, 'store']);
                Route::get('/{id}', [SupportTicketController::class, 'show']);
                Route::post('/{id}/reply', [SupportTicketController::class, 'reply']);
                Route::patch('/{id}', [SupportTicketController::class, 'update']);
            });

            // Settings
            Route::prefix('settings')->group(function () {
                Route::get('/', [SettingsController::class, 'index']);
                Route::patch('/general', [SettingsController::class, 'updateGeneral']);
                Route::patch('/email', [SettingsController::class, 'updateEmail']);
                Route::patch('/sms', [SettingsController::class, 'updateSms']);
                Route::patch('/payment', [SettingsController::class, 'updatePayment']);
                Route::patch('/storage', [SettingsController::class, 'updateStorage']);
                Route::patch('/security', [SettingsController::class, 'updateSecurity']);
                Route::patch('/api', [SettingsController::class, 'updateApi']);
                Route::post('/email/test', [SettingsController::class, 'testEmail']);
            });

            // Audit Logs
            Route::prefix('audit-logs')->group(function () {
                Route::get('/', [AuditLogController::class, 'index']);
                Route::get('/export', [AuditLogController::class, 'export']);
            });

            // Hierarchical Navigation - University Hub Routes
            Route::prefix('admin/universities/{universityId}')->group(function () {
                // University Hub Overview
                Route::get('/', [UniversityHubController::class, 'show']);
                
                // University Management Team
                Route::get('/management', [UniversityHubController::class, 'getManagementTeam']);
                
                // University Colleges (filtered by university)
                Route::get('/colleges', [UniversityHubController::class, 'getColleges']);
                
                // University Settings
                Route::get('/settings', [UniversityHubController::class, 'getSettings']);
                Route::put('/settings', [UniversityHubController::class, 'updateSettings']);
                
                // College Hub Routes (nested under university)
                Route::prefix('colleges/{collegeId}')->group(function () {
                    // College Hub Overview
                    Route::get('/', [CollegeHubController::class, 'show']);
                    
                    // College Leadership (Principal, College Admin)
                    Route::get('/leadership', [CollegeHubController::class, 'getLeadership']);
                    
                    // College Departments
                    Route::get('/departments', [CollegeHubController::class, 'getDepartments']);
                    Route::post('/departments', [CollegeHubController::class, 'createDepartment']);
                    Route::get('/departments/{departmentId}', [CollegeHubController::class, 'getDepartment']);
                    Route::put('/departments/{departmentId}', [CollegeHubController::class, 'updateDepartment']);
                    Route::delete('/departments/{departmentId}', [CollegeHubController::class, 'deleteDepartment']);
                    
                    // College Academic Staff (Faculty)
                    Route::get('/academic-staff', [CollegeHubController::class, 'getAcademicStaff']);
                    Route::post('/academic-staff', [CollegeHubController::class, 'createFaculty']);
                    Route::get('/academic-staff/{staffId}', [CollegeHubController::class, 'getFaculty']);
                    Route::put('/academic-staff/{staffId}', [CollegeHubController::class, 'updateFaculty']);
                    Route::delete('/academic-staff/{staffId}', [CollegeHubController::class, 'deleteFaculty']);
                    
                    // College Students
                    Route::get('/students', [CollegeHubController::class, 'getStudents']);
                    Route::post('/students', [CollegeHubController::class, 'enrollStudent']);
                    Route::get('/students/{studentId}', [CollegeHubController::class, 'getStudent']);
                    Route::put('/students/{studentId}', [CollegeHubController::class, 'updateStudent']);
                    Route::delete('/students/{studentId}', [CollegeHubController::class, 'deleteStudent']);
                    
                    // College Settings
                    Route::get('/settings', [CollegeHubController::class, 'getSettings']);
                    Route::put('/settings', [CollegeHubController::class, 'updateSettings']);
                });
            });
        });
    });

    // Other protected routes (with tenant scope)
    Route::middleware(['jwt', 'tenant'])->group(function () {

        // College Management (Bitflow Admin, University Owner, Super Admin, Principal)
        Route::middleware(['role:bitflow_owner,university_owner,super_admin,principal'])->group(function () {
            Route::apiResource('colleges', CollegeController::class);
            Route::get('colleges/{id}/statistics', [CollegeController::class, 'statistics']);
        });

        // Portal-specific routes will be added here as we build each portal
        // Example structure:
        // Route::apiResource('universities', UniversityController::class);
        // Route::apiResource('colleges', CollegeController::class);
        // Route::apiResource('users', UserController::class);
        // Route::apiResource('students', StudentController::class);
        // Route::apiResource('faculty', FacultyController::class);
        
    });
});

// Health check endpoint
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'timestamp' => now()->toIso8601String(),
        'service' => 'Bitflow LMS API',
        'version' => '2.0',
    ]);
});
