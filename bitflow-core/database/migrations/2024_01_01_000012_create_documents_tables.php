<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_folders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->enum('owner_type', ['admin', 'student'])->default('admin');
            $table->foreignUuid('owner_id')->nullable()->constrained('users')->nullOnDelete();
            $table->json('required_file_types')->nullable(); // ["pdf", "jpg"]
            $table->date('due_date')->nullable();
            $table->boolean('is_required')->default(false);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('documents', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('folder_id')->constrained('document_folders')->cascadeOnDelete();
            $table->foreignUuid('student_id')->nullable()->constrained('students')->cascadeOnDelete();
            $table->string('name');
            $table->text('description')->nullable();
            $table->string('file_path')->nullable();
            $table->string('file_url')->nullable();
            $table->integer('file_size_bytes')->nullable();
            $table->string('mime_type')->nullable();
            $table->string('visibility')->default('private');
            $table->foreignUuid('uploaded_by')->constrained('users')->cascadeOnDelete();
            $table->enum('verification_status', ['uploaded', 'pending', 'verified', 'rejected'])->default('uploaded');
            $table->foreignUuid('verified_by')->nullable()->constrained('users')->nullOnDelete();
            $table->timestamp('verified_at')->nullable();
            $table->text('rejection_reason')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['folder_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('documents');
        Schema::dropIfExists('document_folders');
    }
};
