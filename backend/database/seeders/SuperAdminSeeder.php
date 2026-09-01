<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class SuperAdminSeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::firstOrCreate(
            ['email' => 'admin@haulaeschool.com'],
            [
                'name' => 'Haula Super Admin',
                'phone' => '255700000000',
                'password' => Hash::make('password123'),
                'user_type' => 'super_admin',
                'is_active' => true,
            ]
        );

        $admin->assignRole('super_admin');
    }
}