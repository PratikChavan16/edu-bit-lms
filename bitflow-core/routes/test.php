<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Student;
use App\Models\College;
use App\Services\{LibraryService, AssessmentService, DocumentService, FeeService};

/*
|--------------------------------------------------------------------------
| Test Routes (Remove in production)
|--------------------------------------------------------------------------
*/

Route::get('/test/health', function () {
    return response()->json([
        'status' => 'ok',
        'timestamp' => now(),
        'database' => DB::connection()->getDatabaseName(),
    ]);
});

Route::get('/test/users', function () {
    return response()->json([
        'total_users' => User::count(),
        'users' => User::with('roles')->limit(5)->get(),
    ]);
});

Route::get('/test/students', function () {
    return response()->json([
        'total_students' => Student::count(),
        'students' => Student::with(['user', 'college'])->limit(5)->get(),
    ]);
});

// Test student dashboard with first student
Route::get('/test/student-dashboard', function () {
    $student = Student::with(['user', 'college.university'])->first();
    
    if (!$student) {
        return response()->json(['error' => 'No students found'], 404);
    }
    
    // Set tenant context
    app()->instance('tenant.university', $student->college->university);
    app()->instance('tenant.college', $student->college);

    // Simulate authenticated user without persisting session
    auth()->onceUsingId($student->user_id);
    
    $dashboardService = app(\App\Services\StudentDashboardService::class);
    $data = $dashboardService->getDashboardData();
    
    return response()->json([
        'student' => [
            'name' => $student->user->first_name . ' ' . $student->user->last_name,
            'roll_number' => $student->roll_number,
            'college' => $student->college->name,
        ],
        'dashboard' => $data,
    ]);
});

// Test admin students list
Route::get('/test/admin-students', function () {
    $college = College::with('university')->first();
    
    if (!$college) {
        return response()->json(['error' => 'No colleges found'], 404);
    }
    
    // Set tenant context
    app()->instance('tenant.university', $college->university);
    app()->instance('tenant.college', $college);
    
    $adminService = app(\App\Services\CollegeAdminService::class);
    $students = $adminService->getStudentsList($college->id);
    
    return response()->json([
        'college' => $college->name,
        'total' => $students['total'],
        'students' => $students['students'],
    ]);
});

Route::get('/test/library-resources', function () {
    $student = Student::with(['user', 'college.university'])->first();

    if (!$student) {
        return response()->json(['error' => 'No students found'], 404);
    }

    app()->instance('tenant.university', $student->college->university);
    app()->instance('tenant.college', $student->college);

    $libraryService = app(LibraryService::class);
    $resources = $libraryService->listLearnerResources($student, [], 5);

    return response()->json([
        'student' => $student->user->full_name,
        'resources' => $resources->items(),
    ]);
});

Route::get('/test/assessments', function () {
    $student = Student::with(['user', 'college.university'])->first();

    if (!$student) {
        return response()->json(['error' => 'No students found'], 404);
    }

    app()->instance('tenant.university', $student->college->university);
    app()->instance('tenant.college', $student->college);
    auth()->onceUsingId($student->user_id);

    $assessmentService = app(AssessmentService::class);
    $assessments = $assessmentService->listAssessmentsForStudent($student, [], 5);

    return response()->json([
        'student' => $student->user->full_name,
        'available_assessments' => $assessments->items(),
    ]);
});

Route::get('/test/documents', function () {
    $student = Student::with(['user', 'college.university'])->first();

    if (!$student) {
        return response()->json(['error' => 'No students found'], 404);
    }

    app()->instance('tenant.university', $student->college->university);
    app()->instance('tenant.college', $student->college);
    auth()->onceUsingId($student->user_id);

    $documentService = app(DocumentService::class);
    $folders = $documentService->listLearnerFolderSummary($student);

    return response()->json([
        'student' => [
            'id' => $student->id,
            'name' => $student->user->first_name . ' ' . $student->user->last_name,
            'roll_number' => $student->roll_number,
        ],
        'folders' => $folders,
    ]);
});

Route::get('/test/fees', function (Request $request, FeeService $feeService) {
    $query = Student::with(['user', 'college.university']);
    $student = $request->query('student_id')
        ? $query->find($request->query('student_id'))
        : $query->first();

    if (!$student) {
        return response()->json(['error' => 'No students found'], 404);
    }

    app()->instance('tenant.university', $student->college->university);
    app()->instance('tenant.college', $student->college);
    auth()->onceUsingId($student->user_id);

    $summary = $feeService->getLearnerFeeSummary($student);

    return response()->json([
        'student' => [
            'id' => $student->id,
            'name' => $student->user->first_name . ' ' . $student->user->last_name,
            'roll_number' => $student->roll_number,
        ],
        'items' => $summary['items'],
        'meta' => $summary['meta'],
    ]);
});
