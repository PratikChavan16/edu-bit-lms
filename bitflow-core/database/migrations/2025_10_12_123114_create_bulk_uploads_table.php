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
        Schema::create('bulk_uploads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('type'); // students, faculty, assessments
            $table->foreignUuid('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->string('file_name')->nullable();
            $table->integer('total_rows')->default(0);
            $table->integer('success_count')->default(0);
            $table->integer('failure_count')->default(0);
            $table->json('errors')->nullable();
            $table->enum('status', ['processing', 'completed', 'completed_with_errors', 'failed'])->default('processing');
            $table->timestamps();
            
            $table->index(['college_id', 'type', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('bulk_uploads');
    }
};
