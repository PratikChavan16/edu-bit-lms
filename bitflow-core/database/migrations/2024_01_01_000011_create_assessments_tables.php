<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('assessments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('faculty_id')->constrained('faculty')->cascadeOnDelete();
            $table->string('title');
            $table->text('description')->nullable();
            $table->enum('type', ['mcq', 'saq', 'laq', 'practical', 'project'])->default('mcq');
            $table->string('subject');
            $table->string('course');
            $table->integer('year');
            $table->integer('total_marks')->default(100);
            $table->integer('passing_marks')->default(40);
            $table->integer('duration_minutes')->nullable();
            $table->timestamp('starts_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->enum('submission_type', ['typed', 'upload', 'both'])->default('typed');
            $table->enum('status', ['draft', 'scheduled', 'active', 'completed', 'archived'])->default('draft');
            $table->timestamps();
            $table->softDeletes();

            $table->index(['college_id', 'subject', 'status']);
        });

        Schema::create('assessment_questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('assessment_id')->constrained()->cascadeOnDelete();
            $table->integer('question_number');
            $table->text('question_text');
            $table->json('options')->nullable(); // for MCQ
            $table->string('correct_answer')->nullable(); // for MCQ
            $table->integer('marks')->default(1);
            $table->timestamps();
        });

        Schema::create('assessment_submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('assessment_id')->constrained()->cascadeOnDelete();
            $table->foreignUuid('student_id')->constrained('students')->cascadeOnDelete();
            $table->json('answers')->nullable();
            $table->json('uploaded_files')->nullable();
            $table->integer('marks_obtained')->nullable();
            $table->enum('status', ['not_started', 'in_progress', 'submitted', 'graded'])->default('not_started');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('submitted_at')->nullable();
            $table->timestamp('graded_at')->nullable();
            $table->foreignUuid('graded_by')->nullable()->constrained('users')->nullOnDelete();
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->unique(['assessment_id', 'student_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('assessment_submissions');
        Schema::dropIfExists('assessment_questions');
        Schema::dropIfExists('assessments');
    }
};
