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
        Schema::create('filter_presets', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->string('name'); // Preset name (e.g., "Active Universities", "Engineering Colleges")
            $table->string('entity_type'); // 'university', 'college', 'user', etc.
            $table->json('filters'); // Filter configuration JSON
            $table->json('sort')->nullable(); // Sort configuration JSON
            $table->boolean('is_default')->default(false); // Auto-apply on page load
            $table->integer('order')->default(0); // Display order
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['user_id', 'entity_type']);
            $table->index('is_default');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('filter_presets');
    }
};
