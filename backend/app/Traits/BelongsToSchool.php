<?php

namespace App\Traits;

use Illuminate\Database\Eloquent\Builder;

trait BelongsToSchool
{
    protected static function bootBelongsToSchool(): void
    {
        static::creating(function ($model) {
            if (empty($model->school_id)) {
                $model->school_id = auth()->check() ? (auth()->user()->school_id ?? 1) : 1;
            }
        });

        static::addGlobalScope('school', function (Builder $builder) {
            $schoolId = auth()->check() ? (auth()->user()->school_id ?? 1) : 1;
            $builder->where($builder->getModel()->getTable() . '.school_id', $schoolId);
        });
    }
}
