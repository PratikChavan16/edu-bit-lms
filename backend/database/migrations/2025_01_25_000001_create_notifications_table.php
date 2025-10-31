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
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            $table->string('type'); // 'info', 'success', 'warning', 'error'
            $table->string('title');
            $table->text('message');
            $table->json('data')->nullable(); // Additional data (links, IDs, etc.)
            
            $table->boolean('is_read')->default(false);
            $table->timestamp('read_at')->nullable();
            
            $table->string('category')->nullable(); // 'system', 'university', 'college', 'user', etc.
            $table->string('action_url')->nullable(); // URL to navigate when clicked
            $table->string('action_text')->nullable(); // Button text (e.g., "View Details")
            
            $table->uuid('related_id')->nullable(); // ID of related entity
            $table->string('related_type')->nullable(); // Type of related entity (university, college, etc.)
            
            $table->timestamps();
            
            $table->index('user_id');
            $table->index('is_read');
            $table->index('created_at');
            $table->index(['user_id', 'is_read']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
