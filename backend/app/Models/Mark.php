<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Mark extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'exam_id',
        'student_id',
        'subject_id',
        'teacher_id',
        'score',
        'max_score',
        'grade',
        'points',
        'remarks',
        'status',
    ];

    protected function casts(): array
    {
        return [
            'score' => 'decimal:2',
            'max_score' => 'decimal:2',
            'points' => 'decimal:2',
        ];
    }

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

    public function exam()
    {
        return $this->belongsTo(Exam::class);
    }
}
