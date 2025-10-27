<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('enrollments', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->uuid('student_id');
            $table->uuid('course_id');
            $table->uuid('academic_year_id');
            $table->timestamp('enrolled_at')->useCurrent();
            $table->string('status', 20)->default('enrolled');
            $table->string('grade', 5)->nullable(); // Final grade: A+, A, B+, etc.
            $table->decimal('grade_points', 4, 2)->nullable(); // GPA contribution
            $table->integer('credits_earned')->default(0);
            $table->date('completion_date')->nullable();
            $table->timestamps();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('academic_year_id')->references('id')->on('academic_years')->onDelete('cascade');
            
            $table->unique(['student_id', 'course_id', 'academic_year_id']);
            $table->index(['university_id', 'id']);
            $table->index('student_id');
            $table->index('course_id');
            $table->index('status');
        });
        
        // Add CHECK constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE enrollments ADD CONSTRAINT enrollments_status_check CHECK (status IN ('enrolled', 'completed', 'dropped', 'failed'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enrollments');
    }
};
