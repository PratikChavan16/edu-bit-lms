<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('universities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('slug')->unique();
            $table->string('domain')->unique()->nullable();
            $table->enum('status', ['live', 'staging', 'suspended'])->default('live');
            $table->string('timezone')->default('Asia/Kolkata');
            $table->json('branding')->nullable(); // logo_url, primary_color, etc.
            $table->integer('storage_quota_gb')->default(100);
            $table->integer('storage_used_mb')->default(0);
            $table->timestamp('last_backup_at')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
