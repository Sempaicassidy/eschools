<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\SchoolController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\ExamController;
use App\Http\Controllers\Api\FinanceController;
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
Route::post('/auth/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/auth/me', [AuthController::class, 'me']);
    Route::post('/auth/logout', [AuthController::class, 'logout']);

    // Single School Profile
    Route::get('/school/profile', function () {
        return response()->json(\App\Models\School::find(1));
    });
    Route::apiResource('schools', SchoolController::class);

    // Students
    Route::apiResource('students', StudentController::class);

    // Attendance
    Route::prefix('attendance')->group(function () {
        Route::post('/sessions', [AttendanceController::class, 'createSession']);
        Route::post('/bulk', [AttendanceController::class, 'markBulk']);
        Route::get('/daily-report', [AttendanceController::class, 'dailyReport']);
    });

    // Exams & Marks
    Route::apiResource('exams', ExamController::class);
    Route::post('/exams/{exam}/marks', [ExamController::class, 'submitMarks']);

    // Finance
    Route::prefix('finance')->group(function () {
        Route::post('/payments', [FinanceController::class, 'recordPayment']);
        Route::get('/invoices', [FinanceController::class, 'invoices']);
    });
});