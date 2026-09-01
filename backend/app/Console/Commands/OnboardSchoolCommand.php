<?php

namespace App\Console\Commands;

use App\Models\AcademicYear;
use App\Models\GradingScale;
use App\Models\School;
use App\Models\Term;
use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class OnboardSchoolCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'school:onboard 
                            {name : The name of the client school}
                            {admin_email : The primary email for the school admin}
                            {--registration_number= : School registration number (e.g. S.1234)}
                            {--admin_password= : Admin initial password (default: SchoolAdmin@2026)}
                            {--phone= : Primary contact phone number}
                            {--school_type=mixed : Type of school (day, boarding, mixed)}
                            {--ownership=private : Ownership type (private, public, faith_based, ngo)}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Onboard a new client school into E-Schools platform with default academic year, grading scales, and admin user';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $schoolName = $this->argument('name');
        $adminEmail = $this->argument('admin_email');
        $regNumber = $this->option('registration_number') ?? 'REG-' . strtoupper(Str::random(6));
        $adminPassword = $this->option('admin_password') ?? 'SchoolAdmin@2026';
        $phone = $this->option('phone') ?? '255700000000';
        $schoolType = strtolower($this->option('school_type'));
        $ownership = strtolower($this->option('ownership'));

        $this->info("🚀 Starting onboarding for school: {$schoolName}...");

        DB::beginTransaction();

        try {
            // 1. Create or Find School
            $school = School::create([
                'name' => $schoolName,
                'registration_number' => $regNumber,
                'school_type' => in_array($schoolType, ['day', 'boarding', 'mixed']) ? $schoolType : 'mixed',
                'ownership' => in_array($ownership, ['private', 'public', 'faith_based', 'ngo']) ? $ownership : 'private',
                'region' => 'Dar es Salaam',
                'district' => 'Kinondoni',
                'address' => 'P.O. Box 1000',
                'phone' => $phone,
                'email' => $adminEmail,
                'motto' => 'Excellence in Education',
                'currency' => 'TZS',
                'timezone' => 'Africa/Dar_es_Salaam',
                'is_active' => true,
            ]);

            $this->info("✓ School record created [ID: {$school->id}]");

            // 2. Create School Admin User
            $adminUser = User::create([
                'school_id' => $school->id,
                'name' => "Admin - {$schoolName}",
                'email' => $adminEmail,
                'phone' => $phone,
                'password' => Hash::make($adminPassword),
                'user_type' => 'school_admin',
                'is_active' => true,
            ]);

            if (method_exists($adminUser, 'assignRole')) {
                $adminUser->assignRole('school_admin');
            }

            $this->info("✓ School Admin user created [{$adminEmail}]");

            // 3. Create Default Academic Year & Terms
            $currentYear = date('Y');
            $academicYear = AcademicYear::create([
                'school_id' => $school->id,
                'name' => "Academic Year {$currentYear}",
                'start_date' => "{$currentYear}-01-01",
                'end_date' => "{$currentYear}-12-31",
                'is_active' => true,
            ]);

            Term::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'name' => 'Term 1',
                'start_date' => "{$currentYear}-01-10",
                'end_date' => "{$currentYear}-04-15",
                'is_active' => true,
            ]);

            Term::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'name' => 'Term 2',
                'start_date' => "{$currentYear}-05-01",
                'end_date' => "{$currentYear}-08-15",
                'is_active' => false,
            ]);

            Term::create([
                'school_id' => $school->id,
                'academic_year_id' => $academicYear->id,
                'name' => 'Term 3',
                'start_date' => "{$currentYear}-09-01",
                'end_date' => "{$currentYear}-12-10",
                'is_active' => false,
            ]);

            $this->info("✓ Academic Year {$currentYear} & Terms created");

            // 4. Create Standard NECTA Grading Scales
            $grades = [
                ['grade' => 'A', 'min_score' => 80, 'max_score' => 100, 'points' => 5, 'remark' => 'Excellent'],
                ['grade' => 'B', 'min_score' => 65, 'max_score' => 79, 'points' => 4, 'remark' => 'Very Good'],
                ['grade' => 'C', 'min_score' => 50, 'max_score' => 64, 'points' => 3, 'remark' => 'Good'],
                ['grade' => 'D', 'min_score' => 35, 'max_score' => 49, 'points' => 2, 'remark' => 'Satisfactory'],
                ['grade' => 'F', 'min_score' => 0,  'max_score' => 34, 'points' => 1, 'remark' => 'Fail'],
            ];

            foreach ($grades as $g) {
                GradingScale::create(array_merge(['school_id' => $school->id], $g));
            }

            $this->info("✓ Default NECTA Grading Scales created");

            DB::commit();

            $this->newLine();
            $this->components->info("🎉 School {$schoolName} successfully onboarded!");
            $this->table(
                ['Field', 'Details'],
                [
                    ['School ID', $school->id],
                    ['School Name', $school->name],
                    ['Reg Number', $school->registration_number],
                    ['Admin Email', $adminEmail],
                    ['Admin Password', $adminPassword],
                    ['Academic Year', $academicYear->name],
                ]
            );

            return Command::SUCCESS;
        } catch (\Throwable $e) {
            DB::rollBack();
            $this->error("❌ Onboarding failed: " . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
