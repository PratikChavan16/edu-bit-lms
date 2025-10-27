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
        Schema::create('faculty', function (Blueprint $table) {
            $table->uuid('id')->primary();
            
            // Foreign Keys
            $table->uuid('user_id')->unique();
            $table->uuid('university_id');
            $table->uuid('college_id');
            $table->uuid('department_id')->nullable();
            
            // Basic Information
            $table->string('employee_id', 50)->unique();
            $table->string('designation', 100)->nullable(); // Professor, Associate Professor, Assistant Professor, Lecturer
            $table->string('qualification', 255)->nullable(); // Ph.D., M.Tech., etc.
            $table->text('specialization')->nullable(); // Area of expertise
            $table->integer('experience_years')->nullable();
            
            // Employment Details
            $table->string('employment_type', 50)->default('full-time'); // full-time, part-time, visiting, contract
            $table->date('joining_date');
            $table->decimal('salary', 12, 2)->nullable(); // Should be encrypted in production
            
            // Status
            $table->string('status', 20)->default('active'); // active, on_leave, inactive, terminated
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes();
            
            // Foreign Key Constraints
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('college_id')->references('id')->on('colleges')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
            
            // Indexes
            $table->index(['university_id', 'id']);
            $table->index('college_id');
            $table->index('department_id');
            $table->index('employee_id');
            $table->index(['university_id', 'status']);
        });

        // Check Constraints (PostgreSQL only)
        if (DB::connection()->getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE faculty ADD CONSTRAINT faculty_status_check CHECK (status IN ('active', 'on_leave', 'inactive', 'terminated'))");
            DB::statement("ALTER TABLE faculty ADD CONSTRAINT faculty_employment_type_check CHECK (employment_type IN ('full-time', 'part-time', 'visiting', 'contract'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('faculty');
    }
};
