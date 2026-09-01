<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Exam;
use App\Models\Mark;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        $exams = Exam::query()
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $exams,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'academic_year_id' => ['required', 'exists:academic_years,id'],
            'term_id' => ['nullable', 'exists:terms,id'],
            'class_room_id' => ['nullable', 'exists:class_rooms,id'],
            'name' => ['required', 'string', 'max:255'],
            'exam_type' => ['required', 'in:weekly_test,monthly_test,midterm,terminal,annual,mock'],
            'start_date' => ['nullable', 'date'],
            'end_date' => ['nullable', 'date'],
        ]);

        $data['school_id'] = $request->user()->school_id;

        $exam = Exam::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Exam created successfully',
            'data' => $exam,
        ], 201);
    }

    public function submitMarks(Request $request, Exam $exam)
    {
        $data = $request->validate([
            'subject_id' => ['required', 'exists:subjects,id'],
            'marks' => ['required', 'array'],
            'marks.*.student_id' => ['required', 'exists:students,id'],
            'marks.*.score' => ['required', 'numeric', 'min:0', 'max:100'],
            'marks.*.remarks' => ['nullable', 'string'],
        ]);

        $schoolId = $request->user()->school_id;
        $teacherId = $request->user()->id;

        foreach ($data['marks'] as $markData) {
            Mark::updateOrCreate(
                [
                    'exam_id' => $exam->id,
                    'student_id' => $markData['student_id'],
                    'subject_id' => $data['subject_id'],
                ],
                [
                    'school_id' => $schoolId,
                    'teacher_id' => $teacherId,
                    'score' => $markData['score'],
                    'max_score' => 100,
                    'remarks' => $markData['remarks'] ?? null,
                    'status' => 'submitted',
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Marks submitted successfully',
        ]);
    }
}
