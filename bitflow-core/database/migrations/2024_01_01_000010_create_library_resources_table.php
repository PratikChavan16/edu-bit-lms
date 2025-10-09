<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('library_resources', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['notes', 'video', 'ebook', 'other'])->default('notes');
            $table->string('subject');
            $table->string('course')->nullable();
            $table->integer('year')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_url')->nullable();
            $table->integer('file_size_bytes')->nullable();
            $table->string('mime_type')->nullable();
            $table->json('tags')->nullable();
            $table->foreignUuid('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->enum('approval_status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreignUuid('approved_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['college_id', 'type', 'subject']);
        });

        Schema::create('library_bookmarks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('resource_id')->constrained('library_resources')->cascadeOnDelete();
            $table->timestamps();

            $table->unique(['user_id', 'resource_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('library_bookmarks');
        Schema::dropIfExists('library_resources');
    }
};
