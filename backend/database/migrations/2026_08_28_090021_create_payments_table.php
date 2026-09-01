<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('school_id')->constrained()->cascadeOnDelete();
            $table->foreignId('student_id')->constrained()->cascadeOnDelete();
            $table->foreignId('invoice_id')->nullable()->constrained()->nullOnDelete();
            $table->foreignId('received_by')->nullable()->constrained('users')->nullOnDelete();
            $table->string('receipt_number');
            $table->decimal('amount', 15, 2);
            $table->enum('payment_method', ['cash', 'bank', 'mobile_money', 'card', 'cheque', 'online'])->default('cash');
            $table->string('reference_number')->nullable();
            $table->date('payment_date');
            $table->text('notes')->nullable();
            $table->enum('status', ['valid', 'reversed'])->default('valid');
            $table->timestamps();
            $table->unique(['school_id', 'receipt_number']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
