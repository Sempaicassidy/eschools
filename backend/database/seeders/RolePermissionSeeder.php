<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        $roles = [
            'school_admin',
            'headmaster',
            'academic_master',
            'admission_officer',
            'teacher',
            'accountant',
            'parent',
            'student',
            'librarian',
            'hostel_master',
            'security',
        ];

        $permissions = [
            'manage users',
            'manage students',
            'manage staff',
            'manage attendance',
            'manage exams',
            'enter marks',
            'approve marks',
            'manage fees',
            'view reports',
            'send announcements',
            'view own child',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        foreach ($roles as $roleName) {
            $role = Role::firstOrCreate(['name' => $roleName]);

            if ($roleName === 'school_admin') {
                $role->syncPermissions([
                    'manage users',
                    'manage students',
                    'manage staff',
                    'manage attendance',
                    'manage exams',
                    'manage fees',
                    'view reports',
                    'send announcements',
                ]);
            }

            if ($roleName === 'admission_officer') {
                $role->syncPermissions([
                    'manage students',
                    'view reports',
                    'send announcements',
                ]);
            }

            if ($roleName === 'teacher') {
                $role->syncPermissions([
                    'manage attendance',
                    'enter marks',
                ]);
            }

            if ($roleName === 'accountant') {
                $role->syncPermissions([
                    'manage fees',
                    'view reports',
                ]);
            }

            if ($roleName === 'parent') {
                $role->syncPermissions([
                    'view own child',
                ]);
            }
        }
    }
}
