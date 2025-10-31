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
use App\Http\Controllers\Api\V1\FilterPresetController;
use App\Http\Controllers\Api\V1\ReportController;
use App\Http\Controllers\Admin\UniversityHubController;
use App\Http\Controllers\Admin\CollegeHubController;
use App\Http\Controllers\Admin\LeadershipController;
use App\Http\Controllers\Admin\DepartmentController;
use App\Http\Controllers\Admin\FacultyController;
use App\Http\Controllers\Admin\AdministrativeStaffController;
use App\Http\Controllers\Admin\NonTeachingStaffController;
use App\Http\Controllers\Admin\StudentController;
use App\Http\Controllers\Admin\CourseController;
use App\Http\Controllers\Admin\ExamController;
use App\Http\Controllers\Admin\LibraryController;
use App\Http\Controllers\Admin\TransportController;
use App\Http\Controllers\Admin\HostelController;
use App\Http\Controllers\Admin\FeeController;
use App\Http\Controllers\Admin\CollegeSettingsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    
    // Public routes (no authentication required) - relaxed rate limiting for development
    // TODO: Change to 'throttle:10,1' in production
    Route::prefix('auth')->middleware('throttle:100,1')->group(function () {
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

        // Notifications (all authenticated users)
        Route::prefix('notifications')->group(function () {
            Route::get('/', [App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
            Route::get('/unread-count', [App\Http\Controllers\Api\V1\NotificationController::class, 'unreadCount']);
            Route::get('/recent', [App\Http\Controllers\Api\V1\NotificationController::class, 'recent']);
            Route::post('/mark-all-read', [App\Http\Controllers\Api\V1\NotificationController::class, 'markAllAsRead']);
            Route::delete('/delete-all-read', [App\Http\Controllers\Api\V1\NotificationController::class, 'deleteAllRead']);
            Route::post('/{id}/mark-read', [App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);
            Route::post('/{id}/mark-unread', [App\Http\Controllers\Api\V1\NotificationController::class, 'markAsUnread']);
            Route::delete('/{id}', [App\Http\Controllers\Api\V1\NotificationController::class, 'destroy']);
            
            // Admin-only notification creation
            Route::middleware(['role:bitflow_owner'])->group(function () {
                Route::post('/', [App\Http\Controllers\Api\V1\NotificationController::class, 'store']);
                Route::post('/broadcast/university/{universityId}', [App\Http\Controllers\Api\V1\NotificationController::class, 'broadcastToUniversity']);
                Route::post('/broadcast/college/{collegeId}', [App\Http\Controllers\Api\V1\NotificationController::class, 'broadcastToCollege']);
            });
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
            Route::post('universities/search', [UniversityController::class, 'search']); // Advanced search
            Route::post('universities/{id}/restore', [UniversityController::class, 'restore']);
            Route::get('universities/export/data', [UniversityController::class, 'export']); // Export endpoint
            Route::post('universities/import/data', [UniversityController::class, 'import']); // Import endpoint
            Route::patch('universities/bulk/status', [UniversityController::class, 'bulkUpdateStatus']); // Bulk status update
            Route::delete('universities/bulk/delete', [UniversityController::class, 'bulkDelete']); // Bulk delete

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

            // Filter Presets
            Route::prefix('filter-presets')->group(function () {
                Route::get('/', [FilterPresetController::class, 'index']);
                Route::post('/', [FilterPresetController::class, 'store']);
                Route::put('/{id}', [FilterPresetController::class, 'update']);
                Route::delete('/{id}', [FilterPresetController::class, 'destroy']);
                Route::post('/{id}/set-default', [FilterPresetController::class, 'setDefault']);
                Route::post('/reorder', [FilterPresetController::class, 'reorder']);
            });

            // Reports - PDF Generation
            Route::prefix('reports')->group(function () {
                Route::post('/universities', [ReportController::class, 'generateUniversityReport']);
                Route::post('/colleges', [ReportController::class, 'generateCollegeReport']);
                Route::post('/users', [ReportController::class, 'generateUsersReport']);
                Route::post('/custom', [ReportController::class, 'generateCustomReport']);
            });

            // Scheduled Reports
            Route::prefix('scheduled-reports')->group(function () {
                Route::get('/', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'index']);
                Route::post('/', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'store']);
                Route::get('/{id}', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'show']);
                Route::put('/{id}', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'update']);
                Route::delete('/{id}', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'destroy']);
                Route::post('/{id}/toggle', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'toggle']);
                Route::get('/{id}/executions', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'executions']);
                Route::post('/{id}/run-now', [App\Http\Controllers\Api\V1\ScheduledReportController::class, 'runNow']);
            });

            // Report Templates
            Route::prefix('report-templates')->group(function () {
                Route::get('/', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'index']);
                Route::post('/', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'store']);
                Route::get('/popular', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'popular']);
                Route::get('/recent', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'recent']);
                Route::get('/{id}', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'show']);
                Route::put('/{id}', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'update']);
                Route::delete('/{id}', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'destroy']);
                Route::post('/{id}/duplicate', [App\Http\Controllers\Api\V1\ReportTemplateController::class, 'duplicate']);
            });

            // Report History
            Route::prefix('report-history')->group(function () {
                Route::get('/', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'index']);
                Route::get('/stats', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'stats']);
                Route::get('/{id}', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'show']);
                Route::get('/{id}/download', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'download']);
                Route::delete('/{id}', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'destroy']);
                Route::post('/bulk-delete', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'bulkDelete']);
                Route::post('/templates/{templateId}/generate', [App\Http\Controllers\Api\V1\ReportHistoryController::class, 'generateFromTemplate']);
            });

            // God Mode Analytics (Bitflow Owner/Admin only)
            Route::prefix('god-mode')->group(function () {
                Route::get('/dashboard', [App\Http\Controllers\Api\V1\GodModeAnalyticsController::class, 'getDashboardStats']);
                Route::get('/universities/comparison', [App\Http\Controllers\Api\V1\GodModeAnalyticsController::class, 'getUniversityComparison']);
                Route::post('/cache/clear', [App\Http\Controllers\Api\V1\GodModeAnalyticsController::class, 'clearCache']);
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
                    
                    // 1. College Leadership (Principal, College Admin)
                    Route::get('/leadership', [LeadershipController::class, 'index']);
                    Route::post('/leadership', [LeadershipController::class, 'store']);
                    Route::get('/leadership/{userId}', [LeadershipController::class, 'show']);
                    Route::put('/leadership/{userId}', [LeadershipController::class, 'update']);
                    Route::delete('/leadership/{userId}', [LeadershipController::class, 'destroy']);
                    
                    // 2. College Departments
                    Route::get('/departments', [DepartmentController::class, 'index']);
                    Route::post('/departments', [DepartmentController::class, 'store']);
                    Route::get('/departments/{departmentId}', [DepartmentController::class, 'show']);
                    Route::put('/departments/{departmentId}', [DepartmentController::class, 'update']);
                    Route::delete('/departments/{departmentId}', [DepartmentController::class, 'destroy']);
                    
                    // HOD Assignment (solves circular dependency)
                    Route::post('/departments/{departmentId}/assign-hod', [DepartmentController::class, 'assignHod']);
                    Route::delete('/departments/{departmentId}/remove-hod', [DepartmentController::class, 'removeHod']);
                    
                    // 3. Academic Staff (Faculty/Teachers)
                    Route::get('/academic-staff', [FacultyController::class, 'index']);
                    Route::post('/academic-staff', [FacultyController::class, 'store']);
                    Route::get('/academic-staff/{facultyId}', [FacultyController::class, 'show']);
                    Route::put('/academic-staff/{facultyId}', [FacultyController::class, 'update']);
                    Route::delete('/academic-staff/{facultyId}', [FacultyController::class, 'destroy']);
                    
                    // 4. Administrative Staff
                    Route::get('/administrative-staff', [AdministrativeStaffController::class, 'index']);
                    Route::post('/administrative-staff', [AdministrativeStaffController::class, 'store']);
                    Route::get('/administrative-staff/{staffId}', [AdministrativeStaffController::class, 'show']);
                    Route::put('/administrative-staff/{staffId}', [AdministrativeStaffController::class, 'update']);
                    Route::delete('/administrative-staff/{staffId}', [AdministrativeStaffController::class, 'destroy']);
                    
                    // 5. Non-Teaching Staff
                    Route::get('/non-teaching-staff', [NonTeachingStaffController::class, 'index']);
                    Route::post('/non-teaching-staff', [NonTeachingStaffController::class, 'store']);
                    Route::get('/non-teaching-staff/{staffId}', [NonTeachingStaffController::class, 'show']);
                    Route::put('/non-teaching-staff/{staffId}', [NonTeachingStaffController::class, 'update']);
                    Route::delete('/non-teaching-staff/{staffId}', [NonTeachingStaffController::class, 'destroy']);
                    
                    // 6. Students
                    Route::get('/students', [StudentController::class, 'index']);
                    Route::post('/students', [StudentController::class, 'store']);
                    Route::get('/students/{studentId}', [StudentController::class, 'show']);
                    Route::put('/students/{studentId}', [StudentController::class, 'update']);
                    Route::delete('/students/{studentId}', [StudentController::class, 'destroy']);
                    
                    // 7. Curriculum & Courses
                    Route::get('/courses', [CourseController::class, 'index']);
                    Route::post('/courses', [CourseController::class, 'store']);
                    Route::get('/courses/{courseId}', [CourseController::class, 'show']);
                    Route::put('/courses/{courseId}', [CourseController::class, 'update']);
                    Route::delete('/courses/{courseId}', [CourseController::class, 'destroy']);
                    
                    // 8. Examinations
                    Route::get('/exams', [ExamController::class, 'index']);
                    Route::post('/exams', [ExamController::class, 'store']);
                    Route::get('/exams/{examId}', [ExamController::class, 'show']);
                    Route::put('/exams/{examId}', [ExamController::class, 'update']);
                    Route::delete('/exams/{examId}', [ExamController::class, 'destroy']);
                    
                    // 9. Library
                    Route::get('/library', [LibraryController::class, 'index']);
                    Route::post('/library', [LibraryController::class, 'store']);
                    Route::get('/library/{resourceId}', [LibraryController::class, 'show']);
                    Route::put('/library/{resourceId}', [LibraryController::class, 'update']);
                    Route::delete('/library/{resourceId}', [LibraryController::class, 'destroy']);
                    
                    // 10. Transport
                    Route::get('/transport', [TransportController::class, 'index']);
                    Route::post('/transport', [TransportController::class, 'store']);
                    Route::get('/transport/{routeId}', [TransportController::class, 'show']);
                    Route::put('/transport/{routeId}', [TransportController::class, 'update']);
                    Route::delete('/transport/{routeId}', [TransportController::class, 'destroy']);
                    
                    // 11. Hostel
                    Route::get('/hostel', [HostelController::class, 'index']);
                    Route::post('/hostel', [HostelController::class, 'store']);
                    Route::get('/hostel/{hostelId}', [HostelController::class, 'show']);
                    Route::put('/hostel/{hostelId}', [HostelController::class, 'update']);
                    Route::delete('/hostel/{hostelId}', [HostelController::class, 'destroy']);
                    
                    // 12. Fee Management
                    Route::get('/fees', [FeeController::class, 'index']);
                    Route::post('/fees', [FeeController::class, 'store']);
                    Route::get('/fees/{feeId}', [FeeController::class, 'show']);
                    Route::put('/fees/{feeId}', [FeeController::class, 'update']);
                    Route::delete('/fees/{feeId}', [FeeController::class, 'destroy']);
                    
                    // 13. College Settings
                    Route::get('/settings', [CollegeSettingsController::class, 'show']);
                    Route::put('/settings', [CollegeSettingsController::class, 'update']);
                });
            });
        });
    });

    // Other protected routes (with tenant scope)
    Route::middleware(['jwt', 'tenant'])->group(function () {

        // University Owner Dashboard
        Route::middleware(['role:university_owner'])->group(function () {
            Route::get('university-owner/dashboard', [DashboardController::class, 'universityOwnerDashboard']);
        });

        // College Management (Bitflow Admin, University Owner, Super Admin, Principal)
        Route::middleware(['role:bitflow_owner,university_owner,super_admin,principal'])->group(function () {
            Route::apiResource('colleges', CollegeController::class);
            Route::post('colleges/search', [CollegeController::class, 'search']); // Advanced search
            Route::get('colleges/export/data', [CollegeController::class, 'export']); // Export endpoint
            Route::post('colleges/import/data', [CollegeController::class, 'import']); // Import endpoint
            Route::patch('colleges/bulk/status', [CollegeController::class, 'bulkUpdateStatus']); // Bulk status update
            Route::delete('colleges/bulk/delete', [CollegeController::class, 'bulkDelete']); // Bulk delete
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
