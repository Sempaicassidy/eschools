<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('marks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('exam_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('subject_id')->constrained()->cascadeOnDelete();
            $table->foreignId('teacher_id')->nullable()->constrained('users')->nullOnDelete();
            $table->decimal('score', 5, 2)->nullable();
            $table->decimal('max_score', 5, 2)->default(100);
            $table->string('grade')->nullable();
            $table->decimal('points', 5, 2)->nullable();
            $table->text('remarks')->nullable();
            $table->enum('status', ['draft', 'submitted', 'approved', 'published'])->default('draft');
            $table->timestamps();
            $table->unique(['exam_id', 'student_id', 'subject_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('marks');
    }
};
