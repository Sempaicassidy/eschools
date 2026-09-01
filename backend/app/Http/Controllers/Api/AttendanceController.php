<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSession;
use App\Models\StudentAttendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AttendanceController extends Controller
{
    public function createSession(Request $request)
    {
        $data = $request->validate([
            'class_room_id' => ['required', 'exists:class_rooms,id'],
            'stream_id' => ['nullable', 'exists:streams,id'],
            'subject_id' => ['nullable', 'exists:subjects,id'],
            'attendance_date' => ['required', 'date'],
            'session_type' => ['required', 'in:morning,afternoon,evening,prep,period'],
        ]);

        $data['school_id'] = $request->user()->school_id;
        $data['taken_by'] = $request->user()->id;

        $session = AttendanceSession::firstOrCreate(
            [
                'school_id' => $data['school_id'],
                'class_room_id' => $data['class_room_id'],
                'stream_id' => $data['stream_id'] ?? null,
                'attendance_date' => $data['attendance_date'],
                'session_type' => $data['session_type'],
            ],
            $data
        );

        return response()->json([
            'success' => true,
            'message' => 'Attendance session created',
            'data' => $session,
        ], 201);
    }

    public function markBulk(Request $request)
    {
        $data = $request->validate([
            'attendance_session_id' => ['required', 'exists:attendance_sessions,id'],
            'records' => ['required', 'array'],
            'records.*.student_id' => ['required', 'exists:students,id'],
            'records.*.status' => ['required', 'in:present,absent,late,excused,sick,permission'],
            'records.*.remarks' => ['nullable', 'string'],
        ]);

        $schoolId = $request->user()->school_id;

        DB::transaction(function () use ($data, $schoolId) {
            foreach ($data['records'] as $record) {
                StudentAttendance::updateOrCreate(
                    [
                        'attendance_session_id' => $data['attendance_session_id'],
                        'student_id' => $record['student_id'],
                    ],
                    [
                        'school_id' => $schoolId,
                        'status' => $record['status'],
                        'remarks' => $record['remarks'] ?? null,
                        'method' => 'manual',
                    ]
                );
            }
        });

        return response()->json([
            'success' => true,
            'message' => 'Attendance saved successfully',
        ]);
    }

    public function dailyReport(Request $request)
    {
        $data = $request->validate([
            'date' => ['required', 'date'],
            'class_room_id' => ['nullable', 'exists:class_rooms,id'],
            'stream_id' => ['nullable', 'exists:streams,id'],
        ]);

        $query = StudentAttendance::query()
            ->with(['student', 'session'])
            ->whereDate('created_at', $data['date']);

        if (!empty($data['class_room_id'])) {
            $query->whereHas('student', function ($q) use ($data) {
                $q->where('class_room_id', $data['class_room_id']);
            });
        }

        return response()->json([
            'success' => true,
            'data' => $query->get(),
        ]);
    }
}
