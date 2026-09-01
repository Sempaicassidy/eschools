<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class GradingScale extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'grade',
        'min_score',
        'max_score',
        'points',
        'remark',
    ];
}
