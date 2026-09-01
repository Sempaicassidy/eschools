<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('schools', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('registration_number')->nullable();
            $table->enum('school_type', ['day', 'boarding', 'mixed'])->default('mixed');
            $table->enum('ownership', ['private', 'public', 'faith_based', 'ngo'])->default('private');
            $table->string('region')->nullable();
            $table->string('district')->nullable();
            $table->text('address')->nullable();
            $table->string('phone')->nullable();
            $table->string('email')->nullable();
            $table->string('website')->nullable();
            $table->string('logo')->nullable();
            $table->string('motto')->nullable();
            $table->string('headmaster_name')->nullable();
            $table->string('timezone')->default('Africa/Dar_es_Salaam');
            $table->string('currency')->default('TZS');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('schools');
    }
};
