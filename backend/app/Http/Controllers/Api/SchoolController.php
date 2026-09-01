<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\School;
use Illuminate\Http\Request;

class SchoolController extends Controller
{
    public function index(Request $request)
    {
        $schools = School::query()
            ->when($request->search, function ($query, $search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('registration_number', 'like', "%{$search}%");
            })
            ->latest()
            ->paginate($request->per_page ?? 20);

        return response()->json([
            'success' => true,
            'data' => $schools,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'registration_number' => ['nullable', 'string', 'max:100'],
            'school_type' => ['required', 'in:day,boarding,mixed'],
            'ownership' => ['required', 'in:private,public,faith_based,ngo'],
            'region' => ['nullable', 'string'],
            'district' => ['nullable', 'string'],
            'address' => ['nullable', 'string'],
            'phone' => ['nullable', 'string'],
            'email' => ['nullable', 'email'],
            'website' => ['nullable', 'string'],
            'headmaster_name' => ['nullable', 'string'],
        ]);

        $school = School::create($data);

        return response()->json([
            'success' => true,
            'message' => 'School registered successfully',
            'data' => $school,
        ], 201);
    }

    public function show(School $school)
    {
        return response()->json([
            'success' => true,
            'data' => $school->loadCount(['users', 'students']),
        ]);
    }
}
