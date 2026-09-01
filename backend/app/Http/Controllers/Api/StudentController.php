<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    public function index(Request $request)
    {
        $students = Student::query()
            ->with(['classRoom', 'stream', 'guardians'])
            ->when($request->search, function ($query, $search) {
                $query->where(function ($q) use ($search) {
                    $q->where('first_name', 'like', "%{$search}%")
                        ->orWhere('middle_name', 'like', "%{$search}%")
                        ->orWhere('last_name', 'like', "%{$search}%")
                        ->orWhere('admission_number', 'like', "%{$search}%");
                });
            })
            ->when($request->class_room_id, function ($query, $classRoomId) {
                $query->where('class_room_id', $classRoomId);
            })
            ->when($request->stream_id, function ($query, $streamId) {
                $query->where('stream_id', $streamId);
            })
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $students,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'class_room_id' => ['nullable', 'exists:class_rooms,id'],
            'stream_id' => ['nullable', 'exists:streams,id'],
            'admission_number' => ['required', 'string', 'max:50'],
            'first_name' => ['required', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['required', 'string', 'max:100'],
            'gender' => ['required', 'in:male,female'],
            'date_of_birth' => ['nullable', 'date'],
            'admission_date' => ['nullable', 'date'],
            'boarding_status' => ['required', 'in:day,boarding'],
            'nationality' => ['nullable', 'string'],
            'religion' => ['nullable', 'string'],
            'previous_school' => ['nullable', 'string'],
            'class_teacher_name' => ['nullable', 'string'],
            'class_monitor_name' => ['nullable', 'string'],
            'hostel_name' => ['nullable', 'string'],
            'hostel_master_name' => ['nullable', 'string'],
            'blood_group' => ['nullable', 'string'],
            'medical_notes' => ['nullable', 'string'],
        ]);

        $data['school_id'] = config('school.id');

        $student = Student::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Student created successfully',
            'data' => $student->load(['classRoom', 'stream']),
        ], 201);
    }

    public function show(Student $student)
    {
        return response()->json([
            'success' => true,
            'data' => $student->load([
                'classRoom',
                'stream',
                'guardians',
                'attendances',
                'marks',
                'invoices',
            ]),
        ]);
    }

    public function update(Request $request, Student $student)
    {
        $data = $request->validate([
            'class_room_id' => ['nullable', 'exists:class_rooms,id'],
            'stream_id' => ['nullable', 'exists:streams,id'],
            'first_name' => ['sometimes', 'string', 'max:100'],
            'middle_name' => ['nullable', 'string', 'max:100'],
            'last_name' => ['sometimes', 'string', 'max:100'],
            'gender' => ['sometimes', 'in:male,female'],
            'date_of_birth' => ['nullable', 'date'],
            'admission_date' => ['nullable', 'date'],
            'status' => ['sometimes', 'in:active,transferred,graduated,suspended,inactive'],
            'boarding_status' => ['sometimes', 'in:day,boarding'],
            'class_teacher_name' => ['nullable', 'string'],
            'class_monitor_name' => ['nullable', 'string'],
            'hostel_name' => ['nullable', 'string'],
            'hostel_master_name' => ['nullable', 'string'],
            'blood_group' => ['nullable', 'string'],
            'medical_notes' => ['nullable', 'string'],
        ]);

        $student->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Student updated successfully',
            'data' => $student->fresh()->load(['classRoom', 'stream']),
        ]);
    }

    public function destroy(Student $student)
    {
        $student->update(['status' => 'inactive']);

        return response()->json([
            'success' => true,
            'message' => 'Student deactivated successfully',
        ]);
    }
}
