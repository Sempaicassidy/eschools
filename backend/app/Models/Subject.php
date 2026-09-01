<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class Subject extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'name',
        'code',
        'department',
        'is_compulsory',
        'is_active',
    ];

    protected function casts(): array
    {
        return [
            'is_compulsory' => 'boolean',
            'is_active' => 'boolean',
        ];
    }
}
