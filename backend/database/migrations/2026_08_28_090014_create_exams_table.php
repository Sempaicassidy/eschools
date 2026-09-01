<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('academic_year_id')->constrained()->cascadeOnDelete();
            $table->foreignId('term_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('class_room_id')->nullable()->constrained()->nullOnDelete();
            $table->string('name');
            $table->enum('exam_type', ['weekly_test', 'monthly_test', 'midterm', 'terminal', 'annual', 'mock'])->default('terminal');
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->enum('status', ['draft', 'open', 'closed', 'published'])->default('draft');
            $table->timestamps();
            $table->unique(['school_id', 'academic_year_id', 'term_id', 'class_room_id', 'name'], 'unique_exam_per_class');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('exams');
    }
};
