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
        Schema::create('students', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('user_id')->unique();
            $table->uuid('university_id');
            $table->uuid('college_id');
            $table->uuid('department_id')->nullable();
            $table->string('admission_number', 50)->unique();
            $table->date('admission_date');
            $table->string('course', 100)->nullable(); // e.g., 'B.Tech Computer Science'
            $table->integer('year')->nullable(); // 1-6
            $table->string('section', 10)->nullable();
            $table->string('roll_number', 50)->nullable();
            $table->string('blood_group', 5)->nullable();
            $table->date('date_of_birth')->nullable();
            $table->string('gender', 20)->nullable();
            $table->string('nationality', 100)->nullable();
            $table->json('emergency_contact')->nullable(); // {name, relation, phone}
            $table->string('guardian_name', 255)->nullable();
            $table->string('guardian_phone', 20)->nullable();
            $table->string('guardian_email', 255)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('college_id')->references('id')->on('colleges')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
            
            $table->index(['university_id', 'id']);
            $table->index('college_id');
            $table->index('admission_number');
            $table->index(['university_id', 'status']);
        });
        
        // Add CHECK constraints
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE students ADD CONSTRAINT students_status_check CHECK (status IN ('active', 'suspended', 'graduated', 'dropped'))");
        }
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE students ADD CONSTRAINT students_year_check CHECK (year BETWEEN 1 AND 6)");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('students');
    }
};
