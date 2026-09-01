<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class School extends Model
{
    protected $fillable = [
        'name',
        'registration_number',
        'school_type',
        'ownership',
        'region',
        'district',
        'address',
        'phone',
        'email',
        'website',
        'logo',
        'motto',
        'headmaster_name',
        'timezone',
        'currency',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
