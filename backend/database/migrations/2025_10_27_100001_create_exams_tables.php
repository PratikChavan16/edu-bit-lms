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
        Schema::create('exams', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained('universities')->onDelete('cascade');
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            $table->foreignId('department_id')->nullable()->constrained('departments')->onDelete('set null');
            
            $table->string('name');
            $table->string('exam_code')->unique();
            $table->enum('exam_type', ['mid_term', 'end_term', 'internal', 'external', 'practical']);
            $table->integer('semester')->nullable();
            $table->integer('year')->nullable();
            $table->text('description')->nullable();
            
            $table->date('start_date');
            $table->date('end_date');
            $table->time('start_time')->nullable();
            $table->integer('duration_minutes')->nullable();
            $table->integer('total_marks')->default(100);
            $table->integer('passing_marks')->default(40);
            
            $table->enum('status', ['scheduled', 'ongoing', 'completed', 'cancelled'])->default('scheduled');
            
            $table->json('exam_pattern')->nullable(); // MCQ, Descriptive, Practical mix
            $table->json('instructions')->nullable();
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->index(['college_id', 'status']);
            $table->index(['department_id', 'semester']);
        });

        Schema::create('exam_schedules', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            
            $table->date('exam_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('room_number')->nullable();
            $table->string('invigilator')->nullable();
            
            $table->timestamps();
            
            $table->unique(['exam_id', 'course_id']);
        });

        Schema::create('exam_results', function (Blueprint $table) {
            $table->id();
            $table->foreignId('exam_id')->constrained('exams')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('course_id')->constrained('courses')->onDelete('cascade');
            
            $table->decimal('marks_obtained', 5, 2);
            $table->decimal('total_marks', 5, 2);
            $table->decimal('percentage', 5, 2);
            $table->string('grade')->nullable();
            $table->enum('result', ['pass', 'fail', 'absent'])->default('fail');
            
            $table->text('remarks')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamp('published_at')->nullable();
            
            $table->timestamps();
            
            $table->unique(['exam_id', 'student_id', 'course_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('exam_results');
        Schema::dropIfExists('exam_schedules');
        Schema::dropIfExists('exams');
    }
};
