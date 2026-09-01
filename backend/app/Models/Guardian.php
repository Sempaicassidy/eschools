<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'user_id',
        'full_name',
        'phone',
        'email',
        'address',
        'occupation',
        'can_receive_sms',
        'can_access_portal',
    ];

    protected function casts(): array
    {
        return [
            'can_receive_sms' => 'boolean',
            'can_access_portal' => 'boolean',
        ];
    }

    public function students()
    {
        return $this->belongsToMany(Student::class)
            ->withPivot(['school_id', 'relationship', 'is_primary', 'is_emergency_contact'])
            ->withTimestamps();
    }
}
