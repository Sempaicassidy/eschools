<?php

namespace App\Services;

use App\Models\AuditLog;

class AuditLogService
{
    public function log(
        string $action,
        ?string $module = null,
        $model = null,
        ?array $oldValues = null,
        ?array $newValues = null
    ): void {
        AuditLog::create([
            'school_id' => auth()->user()?->school_id,
            'user_id' => auth()->id(),
            'action' => $action,
            'module' => $module,
            'auditable_type' => $model ? get_class($model) : null,
            'auditable_id' => $model?->id,
            'old_values' => $oldValues,
            'new_values' => $newValues,
            'ip_address' => request()?->ip(),
            'user_agent' => request()?->userAgent(),
        ]);
    }
}
