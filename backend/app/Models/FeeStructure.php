<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'academic_year_id',
        'term_id',
        'class_room_id',
        'name',
        'boarding_status',
        'student_type',
        'is_active',
    ];

    public function items()
    {
        return $this->hasMany(FeeItem::class);
    }
}
