<?php

namespace Database\Seeders;

use App\Models\AcademicYear;
use App\Models\FeeItem;
use App\Models\GradingScale;
use App\Models\School;
use App\Models\Term;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultSchoolSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Primary School Profile
        $school = School::firstOrCreate(
            ['id' => 1],
            [
                'name' => 'E-Schools Secondary & High School',
                'registration_number' => 'REG-2026-001',
                'school_type' => 'mixed',
                'ownership' => 'private',
                'region' => 'Dar es Salaam',
                'district' => 'Kinondoni',
                'address' => 'P.O. Box 705, Dar es Salaam',
                'phone' => '+255700000000',
                'email' => 'admin@eschools.co.tz',
                'motto' => 'Strive for Excellence',
                'currency' => 'TZS',
                'timezone' => 'Africa/Dar_es_Salaam',
                'is_active' => true,
            ]
        );

        // 2. System / School Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@eschools.co.tz'],
            [
                'school_id' => $school->id,
                'name' => 'School Administrator',
                'phone' => '+255700000000',
                'password' => Hash::make('password123'),
                'user_type' => 'school_admin',
                'is_active' => true,
            ]
        );

        if (method_exists($admin, 'assignRole')) {
            $admin->assignRole('school_admin');
        }

        // 3. Current Academic Year & Terms
        $currentYear = date('Y');
        $academicYear = AcademicYear::firstOrCreate(
            ['school_id' => $school->id, 'name' => "Academic Year {$currentYear}"],
            [
                'start_date' => "{$currentYear}-01-01",
                'end_date' => "{$currentYear}-12-31",
                'is_active' => true,
            ]
        );

        Term::firstOrCreate(
            ['school_id' => $school->id, 'name' => 'Term 1'],
            [
                'academic_year_id' => $academicYear->id,
                'start_date' => "{$currentYear}-01-10",
                'end_date' => "{$currentYear}-04-15",
                'is_active' => true,
            ]
        );

        Term::firstOrCreate(
            ['school_id' => $school->id, 'name' => 'Term 2'],
            [
                'academic_year_id' => $academicYear->id,
                'start_date' => "{$currentYear}-05-01",
                'end_date' => "{$currentYear}-08-15",
                'is_active' => false,
            ]
        );

        Term::firstOrCreate(
            ['school_id' => $school->id, 'name' => 'Term 3'],
            [
                'academic_year_id' => $academicYear->id,
                'start_date' => "{$currentYear}-09-01",
                'end_date' => "{$currentYear}-12-10",
                'is_active' => false,
            ]
        );

        // 4. Default NECTA Grading Scales
        $grades = [
            ['grade' => 'A', 'min_score' => 80, 'max_score' => 100, 'points' => 5, 'remark' => 'Excellent'],
            ['grade' => 'B', 'min_score' => 65, 'max_score' => 79, 'points' => 4, 'remark' => 'Very Good'],
            ['grade' => 'C', 'min_score' => 50, 'max_score' => 64, 'points' => 3, 'remark' => 'Good'],
            ['grade' => 'D', 'min_score' => 35, 'max_score' => 49, 'points' => 2, 'remark' => 'Satisfactory'],
            ['grade' => 'F', 'min_score' => 0,  'max_score' => 34, 'points' => 1, 'remark' => 'Fail'],
        ];

        foreach ($grades as $g) {
            GradingScale::firstOrCreate(
                ['school_id' => $school->id, 'grade' => $g['grade']],
                $g
            );
        }
    }
}
