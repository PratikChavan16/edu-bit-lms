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
        Schema::create('report_templates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('university_id')->nullable();
            $table->uuid('created_by');
            
            // Template info
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('category')->default('custom'); // custom, system, featured
            $table->enum('report_type', ['universities', 'colleges', 'users'])->default('universities');
            
            // Template configuration
            $table->json('filters')->nullable(); // Report filters
            $table->json('options')->nullable(); // Paper size, orientation, etc.
            $table->string('icon')->nullable(); // Emoji or icon name
            $table->string('color')->nullable(); // Color theme
            
            // Metadata
            $table->boolean('is_public')->default(false); // Share with other users
            $table->boolean('is_system')->default(false); // Pre-built template
            $table->integer('usage_count')->default(0);
            $table->timestamp('last_used_at')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index('university_id');
            $table->index('created_by');
            $table->index('category');
            $table->index('is_public');
            $table->index('is_system');
            
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
        Schema::dropIfExists('report_templates');
    }
};
