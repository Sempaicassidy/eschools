<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class StudentAttendance extends Model
{
    use BelongsToSchool;

    protected $table = 'student_attendance';

    protected $fillable = [
        'school_id',
        'attendance_session_id',
        'student_id',
        'status',
        'check_in_time',
        'method',
        'device_id',
        'remarks',
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function session()
    {
        return $this->belongsTo(AttendanceSession::class, 'attendance_session_id');
    }
}
