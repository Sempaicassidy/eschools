<?php

namespace App\Models;

use App\Traits\BelongsToSchool;
use Illuminate\Database\Eloquent\Model;

class FeeItem extends Model
{
    use BelongsToSchool;

    protected $fillable = [
        'school_id',
        'fee_structure_id',
        'name',
        'amount',
        'is_required',
    ];

    protected function casts(): array
    {
        return [
            'amount' => 'decimal:2',
            'is_required' => 'boolean',
        ];
    }
}
