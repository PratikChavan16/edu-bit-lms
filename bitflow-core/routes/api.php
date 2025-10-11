<?php

use App\Http\Controllers\Admin\AssessmentsController as AdminAssessmentsController;
use App\Http\Controllers\Admin\DashboardController as AdminDashboardController;
use App\Http\Controllers\Admin\DocumentFoldersController;
use App\Http\Controllers\Admin\DocumentsController as AdminDocumentsController;
use App\Http\Controllers\Admin\FeatureTogglesController;
use App\Http\Controllers\Admin\FeesController as AdminFeesController;
use App\Http\Controllers\Admin\LibraryResourcesController;
use App\Http\Controllers\Admin\AttendanceCorrectionsController;
use App\Http\Controllers\Admin\TimetableController as AdminTimetableController;
use App\Http\Controllers\Admin\OperationsAlertsController;
use App\Http\Controllers\Admin\StudentsController;
use App\Http\Controllers\Admin\UniversitiesController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Learner\AssessmentsController as LearnerAssessmentsController;
use App\Http\Controllers\Learner\DashboardController as LearnerDashboardController;
use App\Http\Controllers\Learner\DocumentsController as LearnerDocumentsController;
use App\Http\Controllers\Learner\FeesController as LearnerFeesController;
use App\Http\Controllers\Learner\LibraryController as LearnerLibraryController;
use App\Http\Controllers\Faculty\AttendanceController as FacultyAttendanceController;
use App\Http\Controllers\Faculty\TimetableController as FacultyTimetableController;
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

// Authentication Routes (Public)
Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/logout-all', [AuthController::class, 'logoutAll']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/change-password', [AuthController::class, 'changePassword']);
    });
});

// Admin Portal Routes
Route::prefix('admin')->middleware('auth:sanctum')->group(function () {
    // Dashboard & Operations
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    Route::get('/operations/alerts', [OperationsAlertsController::class, 'index']);
    
    // Universities Management
    Route::get('/universities', [UniversitiesController::class, 'index']);
    Route::get('/universities/{universityId}', [UniversitiesController::class, 'show']);
    
    // Feature Toggles
    Route::get('/feature-toggles', [FeatureTogglesController::class, 'index']);
    Route::post('/feature-toggles', [FeatureTogglesController::class, 'store']);
    Route::patch('/feature-toggles/{code}', [FeatureTogglesController::class, 'update']);
    
    // Students Management (College Admin)
    Route::get('/students', [StudentsController::class, 'index']);
    Route::get('/students/{id}', [StudentsController::class, 'show']);

    // Library Resources Management
    Route::get('/library/resources', [LibraryResourcesController::class, 'index']);
    Route::post('/library/resources', [LibraryResourcesController::class, 'store']);
    Route::get('/library/resources/{resourceId}', [LibraryResourcesController::class, 'show']);
    Route::match(['put', 'patch'], '/library/resources/{resourceId}', [LibraryResourcesController::class, 'update']);
    Route::delete('/library/resources/{resourceId}', [LibraryResourcesController::class, 'destroy']);
    Route::post('/library/resources/{resourceId}/approve', [LibraryResourcesController::class, 'approve']);

    // Assessments Management
    Route::get('/assessments', [AdminAssessmentsController::class, 'index']);
    Route::post('/assessments', [AdminAssessmentsController::class, 'store']);
    Route::get('/assessments/{assessmentId}', [AdminAssessmentsController::class, 'show']);
    Route::match(['put', 'patch'], '/assessments/{assessmentId}', [AdminAssessmentsController::class, 'update']);
    Route::delete('/assessments/{assessmentId}', [AdminAssessmentsController::class, 'destroy']);
    Route::get('/assessments/{assessmentId}/submissions', [AdminAssessmentsController::class, 'submissions']);

    // Document Workflows
    Route::get('/document-folders', [DocumentFoldersController::class, 'index']);
    Route::post('/document-folders', [DocumentFoldersController::class, 'store']);
    Route::get('/document-folders/{folderId}', [DocumentFoldersController::class, 'show']);
    Route::match(['put', 'patch'], '/document-folders/{folderId}', [DocumentFoldersController::class, 'update']);
    Route::delete('/document-folders/{folderId}', [DocumentFoldersController::class, 'destroy']);
    Route::get('/document-folders/{folderId}/documents', [DocumentFoldersController::class, 'documents']);

    Route::get('/documents', [AdminDocumentsController::class, 'index']);
    Route::post('/documents', [AdminDocumentsController::class, 'store']);
    Route::match(['put', 'patch'], '/documents/{documentId}', [AdminDocumentsController::class, 'update']);
    Route::delete('/documents/{documentId}', [AdminDocumentsController::class, 'destroy']);
    Route::post('/documents/{documentId}/verify', [AdminDocumentsController::class, 'verify']);
    Route::post('/documents/folders', [DocumentFoldersController::class, 'store']);

    // Fee Management
    Route::get('/fees/structures', [AdminFeesController::class, 'structures']);
    Route::post('/fees/structures', [AdminFeesController::class, 'storeStructure']);
    Route::match(['put', 'patch'], '/fees/structures/{structureId}', [AdminFeesController::class, 'updateStructure']);
    Route::delete('/fees/structures/{structureId}', [AdminFeesController::class, 'deleteStructure']);

    Route::get('/fees/invoices', [AdminFeesController::class, 'invoices']);
    Route::post('/fees/invoices', [AdminFeesController::class, 'storeInvoice']);
    Route::get('/fees/invoices/{invoiceId}', [AdminFeesController::class, 'showInvoice']);
    Route::match(['put', 'patch'], '/fees/invoices/{invoiceId}', [AdminFeesController::class, 'updateInvoice']);
    Route::delete('/fees/invoices/{invoiceId}', [AdminFeesController::class, 'deleteInvoice']);
    Route::post('/fees/invoices/{invoiceId}/payments', [AdminFeesController::class, 'recordPayment']);

    // Timetable Management
    Route::get('/timetable', [AdminTimetableController::class, 'index']);
    Route::post('/timetable', [AdminTimetableController::class, 'store']);
    Route::get('/timetable/{blockId}', [AdminTimetableController::class, 'show']);
    Route::match(['put', 'patch'], '/timetable/{blockId}', [AdminTimetableController::class, 'update']);
    Route::delete('/timetable/{blockId}', [AdminTimetableController::class, 'destroy']);
    Route::post('/timetable/{blockId}/exceptions', [AdminTimetableController::class, 'storeException']);
    Route::delete('/timetable/exceptions/{exceptionId}', [AdminTimetableController::class, 'destroyException']);

    // Attendance corrections
    Route::get('/attendance/corrections', [AttendanceCorrectionsController::class, 'index']);
    Route::get('/attendance/corrections/{correctionId}', [AttendanceCorrectionsController::class, 'show']);
    Route::patch('/attendance/corrections/{correctionId}', [AttendanceCorrectionsController::class, 'update']);

    // Announcements (Communication System)
    Route::get('/announcements', [\App\Http\Controllers\Admin\AnnouncementController::class, 'index']);
    Route::post('/announcements', [\App\Http\Controllers\Admin\AnnouncementController::class, 'store']);
    Route::get('/announcements/{id}', [\App\Http\Controllers\Admin\AnnouncementController::class, 'show']);
    Route::patch('/announcements/{id}', [\App\Http\Controllers\Admin\AnnouncementController::class, 'update']);
    Route::delete('/announcements/{id}', [\App\Http\Controllers\Admin\AnnouncementController::class, 'destroy']);
    Route::post('/announcements/{id}/publish', [\App\Http\Controllers\Admin\AnnouncementController::class, 'publish']);
    Route::post('/announcements/{id}/archive', [\App\Http\Controllers\Admin\AnnouncementController::class, 'archive']);

    // Analytics & Reports
    Route::get('/analytics/dashboard', [\App\Http\Controllers\Admin\AnalyticsController::class, 'dashboard']);
    Route::get('/analytics/student-performance', [\App\Http\Controllers\Admin\AnalyticsController::class, 'studentPerformance']);
    Route::get('/analytics/attendance', [\App\Http\Controllers\Admin\AnalyticsController::class, 'attendance']);
    Route::get('/analytics/fee-collection', [\App\Http\Controllers\Admin\AnalyticsController::class, 'feeCollection']);
    Route::get('/analytics/library-usage', [\App\Http\Controllers\Admin\AnalyticsController::class, 'libraryUsage']);
    Route::get('/analytics/assessments', [\App\Http\Controllers\Admin\AnalyticsController::class, 'assessments']);
    Route::post('/analytics/export-pdf', [\App\Http\Controllers\Admin\AnalyticsController::class, 'exportPdf']);
    Route::post('/analytics/export-excel', [\App\Http\Controllers\Admin\AnalyticsController::class, 'exportExcel']);
});

// Learner Portal Routes
Route::prefix('learner')->middleware('auth:sanctum')->group(function () {
    // Student Dashboard
    Route::get('/dashboard', [LearnerDashboardController::class, 'index']);

    // Library
    Route::get('/library/resources', [LearnerLibraryController::class, 'index']);
    Route::get('/library/resources/{resourceId}', [LearnerLibraryController::class, 'show']);
    Route::post('/library/resources/{resourceId}/bookmark', [LearnerLibraryController::class, 'toggleBookmark']);
    Route::get('/library/bookmarks', [LearnerLibraryController::class, 'bookmarks']);

    // Assessments
    Route::get('/assessments', [LearnerAssessmentsController::class, 'index']);
    Route::get('/assessments/{assessmentId}', [LearnerAssessmentsController::class, 'show']);
    Route::post('/assessments/{assessmentId}/submit', [LearnerAssessmentsController::class, 'submit']);

    // Fees
    Route::get('/fees/summary', [\App\Http\Controllers\Learner\FeesController::class, 'summary']);

    // Documents
    Route::get('/documents', [LearnerDocumentsController::class, 'index']);
    Route::get('/documents/folders', [LearnerDocumentsController::class, 'folders']);
    Route::post('/documents/folders/{folderId}/upload', [LearnerDocumentsController::class, 'upload']);

    // Fees
    Route::get('/fees/invoices', [LearnerFeesController::class, 'invoices']);
    Route::get('/fees/invoices/{invoiceId}', [LearnerFeesController::class, 'show']);

    // Announcements & Notifications (Communication System)
    Route::get('/announcements', [\App\Http\Controllers\Learner\AnnouncementController::class, 'index']);
    Route::get('/announcements/{id}', [\App\Http\Controllers\Learner\AnnouncementController::class, 'show']);
    Route::post('/announcements/{id}/read', [\App\Http\Controllers\Learner\AnnouncementController::class, 'markAsRead']);
    Route::get('/notifications', [\App\Http\Controllers\Learner\NotificationController::class, 'index']);
    Route::get('/notifications/unread-count', [\App\Http\Controllers\Learner\NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [\App\Http\Controllers\Learner\NotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [\App\Http\Controllers\Learner\NotificationController::class, 'markAllAsRead']);

    // Learner Profile
    Route::get('/profile', [\App\Http\Controllers\Learner\ProfileController::class, 'show']);
    Route::patch('/profile', [\App\Http\Controllers\Learner\ProfileController::class, 'update']);
    Route::post('/profile/picture', [\App\Http\Controllers\Learner\ProfileController::class, 'uploadProfilePicture']);
    Route::get('/profile/attendance', [\App\Http\Controllers\Learner\ProfileController::class, 'attendance']);
    Route::get('/profile/fees', [\App\Http\Controllers\Learner\ProfileController::class, 'feeStatus']);
    Route::get('/profile/performance', [\App\Http\Controllers\Learner\ProfileController::class, 'performance']);
    Route::get('/profile/timetable', [\App\Http\Controllers\Learner\ProfileController::class, 'timetable']);
    Route::get('/profile/library', [\App\Http\Controllers\Learner\ProfileController::class, 'libraryResources']);
});

// Faculty Portal Routes
Route::prefix('faculty')->middleware('auth:sanctum')->group(function () {
    Route::get('/timetable', [FacultyTimetableController::class, 'index']);
    Route::get('/timetable/{blockId}', [FacultyTimetableController::class, 'show']);
    Route::get('/timetable/{blockId}/attendance', [FacultyAttendanceController::class, 'index']);
    Route::post('/timetable/{blockId}/attendance', [FacultyAttendanceController::class, 'store']);
    Route::post('/attendance/{attendanceId}/corrections', [FacultyAttendanceController::class, 'requestCorrection']);
    
    // Faculty Assessments
    Route::get('/assessments', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'index']);
    Route::post('/assessments', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'store']);
    Route::get('/assessments/{assessmentId}', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'show']);
    Route::patch('/assessments/{assessmentId}', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'update']);
    Route::delete('/assessments/{assessmentId}', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'destroy']);
    Route::get('/assessments/{assessmentId}/submissions', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'submissions']);
    Route::post('/assessments/{assessmentId}/submissions/{submissionId}/grade', [\App\Http\Controllers\Faculty\AssessmentsController::class, 'gradeSubmission']);
});

// File Upload Routes (Protected)
Route::prefix('files')->middleware('auth:sanctum')->group(function () {
    Route::post('/upload', [\App\Http\Controllers\FileUploadController::class, 'upload']);
    Route::post('/upload-multiple', [\App\Http\Controllers\FileUploadController::class, 'uploadMultiple']);
    Route::get('/{fileId}', [\App\Http\Controllers\FileUploadController::class, 'show']);
    Route::get('/{fileId}/download', [\App\Http\Controllers\FileUploadController::class, 'download']);
    Route::delete('/{fileId}', [\App\Http\Controllers\FileUploadController::class, 'destroy']);
    Route::get('/storage/usage', [\App\Http\Controllers\FileUploadController::class, 'storageUsage']);
});
