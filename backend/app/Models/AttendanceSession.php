<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class AttendanceSession extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'class_room_id',
        'stream_id',
        'subject_id',
        'taken_by',
        'attendance_date',
        'session_type',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'attendance_date' => 'date',
        ];
    }

    public function attendances()
    {
        return $this->hasMany(StudentAttendance::class);
    }
}
