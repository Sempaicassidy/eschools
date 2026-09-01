<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\FinanceController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\UserManagementController;
use App\Http\Controllers\Api\AcademicSetupController;
use Illuminate\Support\Facades\Route;

// API Root Information Endpoint
Route::get('/', function () {
    return response()->json([
        'name' => 'E-Schools Standalone REST API Engine',
        'version' => '1.0.0',
        'mode' => 'single-tenant',
        'status' => 'online',
        'timestamp' => now()->toIso8601String(),
    ]);
});

// Public Auth Endpoints
Route::get('/school/public-profile', [SchoolController::class, 'publicProfile']);
Route::post('/auth/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // The installation has one school profile; creating or switching schools is unsupported.
    Route::get('/school/profile', [SchoolController::class, 'show']);
    Route::put('/school/profile', [SchoolController::class, 'update'])->middleware('ability:manage users');
    Route::get('/admin/dashboard', [AdminController::class, 'dashboard'])->middleware('ability:manage users');
    Route::apiResource('admin/users', UserManagementController::class)->only(['index', 'store', 'update'])->middleware('ability:manage users');
    Route::get('/admin/academic-setup', [AcademicSetupController::class, 'index'])->middleware('ability:manage users');
    Route::post('/admin/academic-years', [AcademicSetupController::class, 'storeYear'])->middleware('ability:manage users');
    Route::put('/admin/academic-years/{academicYear}', [AcademicSetupController::class, 'updateYear'])->middleware('ability:manage users');
    Route::delete('/admin/academic-years/{academicYear}', [AcademicSetupController::class, 'destroyYear'])->middleware('ability:manage users');
    Route::post('/admin/terms', [AcademicSetupController::class, 'storeTerm'])->middleware('ability:manage users');
    Route::put('/admin/terms/{term}', [AcademicSetupController::class, 'updateTerm'])->middleware('ability:manage users');
    Route::delete('/admin/terms/{term}', [AcademicSetupController::class, 'destroyTerm'])->middleware('ability:manage users');
    Route::post('/admin/classes', [AcademicSetupController::class, 'storeClass'])->middleware('ability:manage users');
    Route::put('/admin/classes/{classRoom}', [AcademicSetupController::class, 'updateClass'])->middleware('ability:manage users');
    Route::delete('/admin/classes/{classRoom}', [AcademicSetupController::class, 'destroyClass'])->middleware('ability:manage users');
    Route::post('/admin/streams', [AcademicSetupController::class, 'storeStream'])->middleware('ability:manage users');
    Route::put('/admin/streams/{stream}', [AcademicSetupController::class, 'updateStream'])->middleware('ability:manage users');
    Route::delete('/admin/streams/{stream}', [AcademicSetupController::class, 'destroyStream'])->middleware('ability:manage users');
    Route::post('/admin/subjects', [AcademicSetupController::class, 'storeSubject'])->middleware('ability:manage users');
    Route::put('/admin/subjects/{subject}', [AcademicSetupController::class, 'updateSubject'])->middleware('ability:manage users');
    Route::delete('/admin/subjects/{subject}', [AcademicSetupController::class, 'destroySubject'])->middleware('ability:manage users');

    // Students
    Route::apiResource('students', StudentController::class)->middleware('ability:manage students');

    // Attendance
    Route::prefix('attendance')->middleware('ability:manage attendance')->group(function () {
        Route::post('/sessions', [AttendanceController::class, 'createSession']);
        Route::post('/bulk', [AttendanceController::class, 'markBulk']);
        Route::get('/daily-report', [AttendanceController::class, 'dailyReport']);
    });

    // Exams & Marks
    Route::apiResource('exams', ExamController::class)->middleware('ability:manage exams');
    Route::post('/exams/{exam}/marks', [ExamController::class, 'submitMarks'])->middleware('ability:enter marks');

    // Finance
    Route::prefix('finance')->middleware('ability:manage fees')->group(function () {
        Route::post('/payments', [FinanceController::class, 'recordPayment']);
        Route::get('/invoices', [FinanceController::class, 'invoices']);
    });
});
