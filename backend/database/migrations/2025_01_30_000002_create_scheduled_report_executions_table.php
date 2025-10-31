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
        Schema::create('scheduled_report_executions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('scheduled_report_id');
            
            // Execution details
            $table->timestamp('started_at');
            $table->timestamp('completed_at')->nullable();
            $table->integer('duration_seconds')->nullable(); // Execution time
            $table->enum('status', ['pending', 'running', 'success', 'failed'])->default('pending');
            
            // Results
            $table->integer('records_count')->nullable(); // Number of records in report
            $table->string('pdf_path')->nullable(); // Path to generated PDF
            $table->integer('pdf_size_kb')->nullable();
            $table->json('recipients')->nullable(); // Who received the report
            
            // Error handling
            $table->text('error_message')->nullable();
            $table->json('error_details')->nullable();
            
            $table->timestamps();
            
            // Indexes
            $table->index('scheduled_report_id');
            $table->index('status');
            $table->index('started_at');
            
            // Foreign keys
            $table->foreign('scheduled_report_id')->references('id')->on('scheduled_reports')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('scheduled_report_executions');
    }
};
