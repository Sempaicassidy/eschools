<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AcademicYear;
use App\Models\ClassRoom;
use App\Models\Stream;
use App\Models\Subject;
use App\Models\Term;
use Illuminate\Http\Request;

class AcademicSetupController extends Controller
{
    public function index()
    {
        return response()->json(['success' => true, 'data' => [
            'academic_years' => AcademicYear::with('terms')->orderByDesc('is_active')->latest()->get(),
            'classes' => ClassRoom::with('streams')->orderBy('order')->get(),
            'subjects' => Subject::orderBy('name')->get(),
        ]]);
    }

    public function storeYear(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:50'], 'start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date'], 'is_active' => ['boolean']]);
        $data['school_id'] = config('school.id');
        if ($data['is_active'] ?? false) AcademicYear::where('is_active', true)->update(['is_active' => false]);
        return response()->json(['success' => true, 'data' => AcademicYear::create($data)], 201);
    }

    public function storeTerm(Request $request)
    {
        $data = $request->validate(['academic_year_id' => ['required', 'exists:academic_years,id'], 'name' => ['required', 'string', 'max:50'], 'start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date'], 'is_active' => ['boolean']]);
        $data['school_id'] = config('school.id');
        if ($data['is_active'] ?? false) Term::where('is_active', true)->update(['is_active' => false]);
        return response()->json(['success' => true, 'data' => Term::create($data)], 201);
    }

    public function storeClass(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100'], 'level' => ['nullable', 'string', 'max:50'], 'order' => ['nullable', 'integer', 'min:0']]);
        $data['school_id'] = config('school.id');
        return response()->json(['success' => true, 'data' => ClassRoom::create($data)], 201);
    }

    public function storeStream(Request $request)
    {
        $data = $request->validate(['class_room_id' => ['required', 'exists:class_rooms,id'], 'name' => ['required', 'string', 'max:100']]);
        $data['school_id'] = config('school.id');
        return response()->json(['success' => true, 'data' => Stream::create($data)], 201);
    }

    public function storeSubject(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100'], 'code' => ['nullable', 'string', 'max:30'], 'department' => ['nullable', 'string', 'max:100'], 'is_compulsory' => ['boolean']]);
        $data['school_id'] = config('school.id');
        $data['is_active'] = true;
        return response()->json(['success' => true, 'data' => Subject::create($data)], 201);
    }

    public function updateYear(Request $request, AcademicYear $academicYear)
    {
        $data = $request->validate(['name' => ['sometimes', 'string', 'max:50'], 'start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date'], 'is_active' => ['boolean']]);
        if (($data['is_active'] ?? false) === true) AcademicYear::where('id', '!=', $academicYear->id)->update(['is_active' => false]);
        $academicYear->update($data);
        return response()->json(['success' => true, 'data' => $academicYear->fresh()]);
    }

    public function updateTerm(Request $request, Term $term)
    {
        $data = $request->validate(['name' => ['sometimes', 'string', 'max:50'], 'start_date' => ['nullable', 'date'], 'end_date' => ['nullable', 'date'], 'is_active' => ['boolean']]);
        if (($data['is_active'] ?? false) === true) Term::where('id', '!=', $term->id)->update(['is_active' => false]);
        $term->update($data);
        return response()->json(['success' => true, 'data' => $term->fresh()]);
    }

    public function updateClass(Request $request, ClassRoom $classRoom)
    {
        $data = $request->validate(['name' => ['sometimes', 'string', 'max:100'], 'level' => ['nullable', 'string', 'max:50'], 'order' => ['nullable', 'integer', 'min:0']]);
        $classRoom->update($data);
        return response()->json(['success' => true, 'data' => $classRoom->fresh()]);
    }

    public function updateStream(Request $request, Stream $stream)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100']]);
        $stream->update($data);
        return response()->json(['success' => true, 'data' => $stream->fresh()]);
    }

    public function updateSubject(Request $request, Subject $subject)
    {
        $data = $request->validate(['name' => ['sometimes', 'string', 'max:100'], 'code' => ['nullable', 'string', 'max:30'], 'department' => ['nullable', 'string', 'max:100'], 'is_compulsory' => ['boolean'], 'is_active' => ['boolean']]);
        $subject->update($data);
        return response()->json(['success' => true, 'data' => $subject->fresh()]);
    }

    public function destroyYear(AcademicYear $academicYear)
    {
        $academicYear->delete();
        return response()->json(['success' => true, 'message' => 'Academic Year deleted successfully']);
    }

    public function destroyTerm(Term $term)
    {
        $term->delete();
        return response()->json(['success' => true, 'message' => 'Term deleted successfully']);
    }

    public function destroyClass(ClassRoom $classRoom)
    {
        $classRoom->delete();
        return response()->json(['success' => true, 'message' => 'Class deleted successfully']);
    }

    public function destroyStream(Stream $stream)
    {
        $stream->delete();
        return response()->json(['success' => true, 'message' => 'Stream deleted successfully']);
    }

    public function destroySubject(Subject $subject)
    {
        $subject->delete();
        return response()->json(['success' => true, 'message' => 'Subject deleted successfully']);
    }
}
