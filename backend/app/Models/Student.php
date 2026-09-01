<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'user_id',
        'class_room_id',
        'stream_id',
        'admission_number',
        'first_name',
        'middle_name',
        'last_name',
        'gender',
        'date_of_birth',
        'admission_date',
        'photo',
        'status',
        'boarding_status',
        'nationality',
        'religion',
        'previous_school',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'admission_date' => 'date',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return trim($this->first_name . ' ' . $this->middle_name . ' ' . $this->last_name);
    }

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class);
    }

    public function stream()
    {
        return $this->belongsTo(Stream::class);
    }

    public function guardians()
    {
        return $this->belongsToMany(Guardian::class)
            ->withPivot(['school_id', 'relationship', 'is_primary', 'is_emergency_contact'])
            ->withTimestamps();
    }

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class);
    }

    public function marks()
    {
        return $this->hasMany(Mark::class);
    }

    public function invoices()
    {
        return $this->hasMany(Invoice::class);
    }
}
