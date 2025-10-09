<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('course');
            $table->integer('year');
            $table->string('component_name'); // tuition, lab, transport, etc.
            $table->decimal('amount', 10, 2);
            $table->string('frequency')->default('annual'); // annual, semester, monthly
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->timestamps();
        });

        Schema::create('fee_invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('invoice_number')->unique();
            $table->foreignUuid('student_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('academic_year');
            $table->string('term'); // semester_1, annual, etc.
            $table->decimal('total_amount', 10, 2);
            $table->decimal('paid_amount', 10, 2)->default(0);
            $table->decimal('discount', 10, 2)->default(0);
            $table->date('due_date');
            $table->enum('status', ['pending', 'partial', 'paid', 'overdue', 'waived'])->default('pending');
            $table->json('components')->nullable(); // breakdown of fees
            $table->timestamps();

            $table->index(['student_id', 'status']);
        });

        Schema::create('fee_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('receipt_number')->unique();
            $table->foreignUuid('invoice_id')->constrained('fee_invoices')->cascadeOnDelete();
            $table->decimal('amount', 10, 2);
            $table->string('payment_method'); // cash, card, bank_transfer, upi
            $table->string('reference_number')->nullable();
            $table->date('payment_date');
            $table->string('proof_url')->nullable();
            $table->foreignUuid('recorded_by')->constrained('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_invoices');
        Schema::dropIfExists('fee_structures');
    }
};
