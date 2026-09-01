<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('school_id')->nullable()->constrained()->nullOnDelete();
            $table->string('phone')->nullable();
            $table->enum('user_type', [
                'super_admin',
                'school_admin',
                'headmaster',
                'teacher',
                'accountant',
                'parent',
                'student',
                'librarian',
                'hostel_master',
                'security'
            ])->default('school_admin');
            $table->boolean('is_active')->default(true);
            $table->timestamp('last_login_at')->nullable();
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['school_id']);
            $table->dropColumn(['school_id', 'phone', 'user_type', 'is_active', 'last_login_at']);
        });
    }
};
