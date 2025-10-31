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
        Schema::create('scheduled_reports', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('university_id')->nullable();
            $table->uuid('created_by');
            
            // Report configuration
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('report_type', ['universities', 'colleges', 'users'])->default('universities');
            $table->json('filters')->nullable(); // Report filters
            $table->json('options')->nullable(); // Paper size, orientation, etc.
            
            // Schedule configuration
            $table->string('cron_expression'); // e.g., "0 9 * * 1" for Monday 9am
            $table->string('frequency_label')->nullable(); // Human-readable: "Weekly on Monday at 9:00 AM"
            $table->timestamp('next_run_at')->nullable();
            $table->timestamp('last_run_at')->nullable();
            
            // Email configuration
            $table->json('recipients'); // Array of email addresses
            $table->string('email_subject')->nullable();
            $table->text('email_message')->nullable();
            
            // Status
            $table->boolean('is_active')->default(true);
            $table->integer('run_count')->default(0);
            $table->integer('success_count')->default(0);
            $table->integer('failure_count')->default(0);
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('university_id');
            $table->index('created_by');
            $table->index('is_active');
            $table->index('next_run_at');
            
            // Foreign keys
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('created_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduled_reports');
    }
};
