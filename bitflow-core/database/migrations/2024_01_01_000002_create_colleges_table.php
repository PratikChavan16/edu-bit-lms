<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('colleges', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('university_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('slug');
            $table->enum('type', ['university', 'college', 'school'])->default('college');
            $table->string('code')->unique(); // college_123
            $table->enum('status', ['active', 'inactive', 'suspended'])->default('active');
            $table->json('branding')->nullable();
            $table->string('motto')->nullable();
            $table->integer('storage_quota_gb')->default(50);
            $table->integer('student_storage_quota_mb')->default(1024); // per student
            $table->timestamps();
            $table->softDeletes();

            $table->unique(['university_id', 'slug']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('colleges');
    }
};
