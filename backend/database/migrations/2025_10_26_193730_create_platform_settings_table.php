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
        Schema::create('platform_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Setting identification
            $table->string('category', 50); // general, email, sms, payment, storage, security, api
            $table->string('key', 100);
            
            // Setting value (stored as JSON for flexibility)
            $table->json('value');
            
            // Metadata
            $table->text('description')->nullable();
            $table->boolean('is_encrypted')->default(false);
            
            $table->timestamps();
            
            // Unique constraint on category + key
            $table->unique(['category', 'key']);
            
            // Indexes
            $table->index('category');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('platform_settings');
    }
};
