<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Stream extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'class_room_id',
        'name',
    ];

    public function classRoom()
    {
        return $this->belongsTo(ClassRoom::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
