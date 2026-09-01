<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('attendance_sessions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('class_room_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('stream_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('subject_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('taken_by')->nullable()->constrained('users')->nullOnDelete();
            $table->date('attendance_date');
            $table->enum('session_type', ['morning', 'afternoon', 'evening', 'prep', 'period'])->default('morning');
            $table->enum('status', ['draft', 'submitted', 'approved'])->default('submitted');
            $table->timestamps();
            $table->unique(['school_id', 'class_room_id', 'stream_id', 'attendance_date', 'session_type'], 'unique_attendance_session');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('attendance_sessions');
    }
};
