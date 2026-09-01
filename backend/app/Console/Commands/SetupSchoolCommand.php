<?php

namespace App\Console\Commands;

use App\Models\School;
use App\Models\User;
use Database\Seeders\DefaultSchoolSeeder;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Hash;

class SetupSchoolCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:setup 
                            {--name= : Name of the school}
                            {--email= : Admin email}
                            {--password= : Admin password}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup and configure the single-tenant school installation';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info("⚙️ Initializing E-Schools Single-Tenant Standalone Installation...");

        // Run default seeder first
        $this->call('db:seed', ['--class' => DefaultSchoolSeeder::class, '--force' => true]);

        $schoolName = $this->option('name');
        $email = $this->option('email');
        $password = $this->option('password');

        $school = School::find(1);

        if ($schoolName && $school) {
            $school->update(['name' => $schoolName]);
            $this->info("✓ Updated school name to: {$schoolName}");
        }

        if ($email) {
            $admin = User::where('school_id', 1)->where('user_type', 'school_admin')->first();
            if ($admin) {
                $updateData = ['email' => $email];
                if ($password) {
                    $updateData['password'] = Hash::make($password);
                }
                $admin->update($updateData);
                $this->info("✓ Updated Admin user email to: {$email}");
            }
        }

        $this->newLine();
        $this->components->info("🎉 E-Schools Standalone Installation Ready!");
        $this->table(
            ['Parameter', 'Configured Value'],
            [
                ['School Name', $school->name ?? 'E-Schools Secondary'],
                ['Primary Email', $school->email ?? 'admin@eschools.co.tz'],
                ['Database Engine', config('database.default')],
                ['Installation Mode', 'Single-Tenant Standalone'],
            ]
        );

        return Command::SUCCESS;
    }
}
