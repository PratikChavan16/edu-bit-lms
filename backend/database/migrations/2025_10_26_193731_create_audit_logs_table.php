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
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // User who performed the action
            $table->foreignUuid('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('user_email')->nullable();
            $table->string('user_role', 50)->nullable();
            
            // Action details
            $table->enum('action', ['CREATE', 'READ', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT'])->index();
            $table->string('resource_type', 100)->index(); // University, User, Settings, etc
            $table->uuid('resource_id')->nullable();
            
            // Changes (JSON)
            $table->json('changes')->nullable();
            
            // Additional context
            $table->text('description')->nullable();
            $table->string('ip_address', 45)->nullable()->index(); // IPv4 or IPv6
            $table->text('user_agent')->nullable();
            $table->uuid('request_id')->nullable();
            
            $table->timestamp('created_at')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
