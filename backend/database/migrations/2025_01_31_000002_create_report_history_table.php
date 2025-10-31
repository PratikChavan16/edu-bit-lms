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
        Schema::create('report_history', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('university_id')->nullable();
            $table->uuid('generated_by');
            $table->uuid('template_id')->nullable(); // If generated from template
            
            // Report details
            $table->string('name');
            $table->enum('report_type', ['universities', 'colleges', 'users'])->default('universities');
            $table->json('filters')->nullable();
            $table->json('options')->nullable();
            
            // File details
            $table->string('file_path');
            $table->string('file_name');
            $table->integer('file_size_kb');
            $table->string('paper_size')->default('a4');
            $table->string('orientation')->default('portrait');
            
            // Metadata
            $table->integer('records_count')->nullable();
            $table->timestamp('generated_at');
            $table->integer('download_count')->default(0);
            $table->timestamp('last_downloaded_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('university_id');
            $table->index('generated_by');
            $table->index('template_id');
            $table->index('report_type');
            $table->index('generated_at');
            
            // Foreign keys
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('generated_by')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('template_id')->references('id')->on('report_templates')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('report_history');
    }
};
