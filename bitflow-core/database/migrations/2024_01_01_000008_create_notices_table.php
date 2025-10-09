<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->text('content');
            $table->enum('priority', ['normal', 'high', 'critical'])->default('normal');
            $table->enum('audience', ['all', 'students', 'faculty', 'staff', 'parents', 'custom'])->default('all');
            $table->json('audience_filter')->nullable(); // year, department, etc.
            $table->foreignUuid('created_by')->constrained('users')->cascadeOnDelete();
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_important')->default(false); // shows on dashboard
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('notice_reads', function (Blueprint $table) {
            $table->foreignUuid('notice_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->timestamp('read_at');
            $table->primary(['notice_id', 'user_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notice_reads');
        Schema::dropIfExists('notices');
    }
};
