<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->string('class_teacher_name')->nullable()->after('previous_school');
            $table->string('class_monitor_name')->nullable()->after('class_teacher_name');
            $table->string('hostel_name')->nullable()->after('class_monitor_name');
            $table->string('hostel_master_name')->nullable()->after('hostel_name');
            $table->string('blood_group')->nullable()->after('hostel_master_name');
            $table->text('medical_notes')->nullable()->after('blood_group');
        });
    }

    public function down(): void
    {
        Schema::table('students', function (Blueprint $table) {
            $table->dropColumn([
                'class_teacher_name',
                'class_monitor_name',
                'hostel_name',
                'hostel_master_name',
                'blood_group',
                'medical_notes',
            ]);
        });
    }
};
