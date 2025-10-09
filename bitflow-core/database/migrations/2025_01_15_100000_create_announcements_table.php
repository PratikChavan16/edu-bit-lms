<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('announcements', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('created_by')->constrained('users')->onDelete('cascade');
            $table->string('title');
            $table->text('content');
            $table->enum('type', ['general', 'urgent', 'event', 'academic', 'administrative']);
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->json('target_audience'); // ['all', 'students', 'faculty', 'parents', 'staff']
            $table->string('course')->nullable();
            $table->integer('year')->nullable();
            $table->enum('status', ['draft', 'published', 'archived'])->default('draft');
            $table->timestamp('scheduled_at')->nullable();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['college_id', 'status', 'priority']);
            $table->index(['college_id', 'course', 'year']);
        });

        Schema::create('announcement_reads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('announcement_id')->constrained()->onDelete('cascade');
            $table->foreignUuid('user_id')->constrained()->onDelete('cascade');
            $table->timestamp('read_at');
            $table->timestamps();

            $table->unique(['announcement_id', 'user_id']);
            $table->index('user_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('announcement_reads');
        Schema::dropIfExists('announcements');
    }
};
