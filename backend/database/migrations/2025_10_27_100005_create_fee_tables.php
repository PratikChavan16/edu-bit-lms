<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('fee_structures', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained('universities')->onDelete('cascade');
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            
            $table->string('name');
            $table->string('fee_code')->unique();
            
            $table->enum('fee_type', ['tuition', 'library', 'lab', 'hostel', 'transport', 'exam', 'sports', 'development', 'misc'])->default('tuition');
            $table->enum('fee_category', ['academic', 'non_academic'])->default('academic');
            
            $table->decimal('amount', 10, 2);
            $table->string('currency', 3)->default('INR');
            
            $table->string('academic_year');
            $table->integer('semester')->nullable();
            $table->integer('year')->nullable();
            
            $table->date('due_date');
            $table->date('late_fee_start_date')->nullable();
            $table->decimal('late_fee_amount', 10, 2)->default(0);
            $table->enum('late_fee_type', ['flat', 'percentage'])->default('flat');
            
            $table->boolean('is_mandatory')->default(true);
            $table->boolean('is_refundable')->default(false);
            
            $table->text('description')->nullable();
            $table->json('payment_schedule')->nullable(); // installments
            
            $table->enum('status', ['active', 'inactive', 'archived'])->default('active');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['college_id', 'academic_year', 'status']);
        });

        Schema::create('fee_payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_structure_id')->constrained('fee_structures')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            
            $table->string('receipt_number')->unique();
            $table->string('transaction_id')->unique()->nullable();
            
            $table->decimal('amount_paid', 10, 2);
            $table->decimal('late_fee_paid', 10, 2)->default(0);
            $table->decimal('total_amount', 10, 2);
            
            $table->enum('payment_mode', ['cash', 'card', 'upi', 'netbanking', 'cheque', 'demand_draft'])->default('cash');
            $table->string('payment_reference')->nullable();
            
            $table->date('payment_date');
            $table->timestamp('payment_time')->nullable();
            
            $table->enum('status', ['pending', 'success', 'failed', 'refunded'])->default('pending');
            
            $table->string('collected_by')->nullable(); // Staff/admin name
            $table->text('remarks')->nullable();
            
            $table->timestamps();
            
            $table->index(['student_id', 'status']);
            $table->index(['receipt_number']);
        });

        Schema::create('fee_reminders', function (Blueprint $table) {
            $table->id();
            $table->foreignId('fee_structure_id')->constrained('fee_structures')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            
            $table->date('reminder_date');
            $table->enum('reminder_type', ['email', 'sms', 'notification'])->default('email');
            
            $table->decimal('pending_amount', 10, 2);
            $table->integer('days_overdue')->default(0);
            
            $table->boolean('is_sent')->default(false);
            $table->timestamp('sent_at')->nullable();
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('fee_reminders');
        Schema::dropIfExists('fee_payments');
        Schema::dropIfExists('fee_structures');
    }
};
