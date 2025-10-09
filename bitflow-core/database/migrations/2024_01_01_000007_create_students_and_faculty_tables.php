<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('students', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('roll_number')->unique();
            $table->string('admission_number')->unique();
            $table->string('course');
            $table->integer('year');
            $table->string('section')->nullable();
            $table->date('admission_date');
            $table->enum('status', ['active', 'alumni', 'suspended', 'dropped'])->default('active');
            $table->json('emergency_contact')->nullable();
            $table->integer('storage_used_mb')->default(0);
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('faculty', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('user_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('department_id')->nullable()->constrained()->nullOnDelete();
            $table->string('employee_id')->unique();
            $table->enum('employment_type', ['permanent', 'contract', 'visiting'])->default('permanent');
            $table->date('joining_date');
            $table->decimal('teaching_load_hours', 5, 2)->default(0);
            $table->enum('status', ['active', 'on_leave', 'resigned', 'retired'])->default('active');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('faculty');
        Schema::dropIfExists('students');
    }
};
