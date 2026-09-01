<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class ClassRoom extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'name',
        'level',
        'order',
    ];

    public function streams()
    {
        return $this->hasMany(Stream::class);
    }

    public function students()
    {
        return $this->hasMany(Student::class);
    }
}
