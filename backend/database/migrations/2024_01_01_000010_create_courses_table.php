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
        Schema::create('courses', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->uuid('college_id');
            $table->uuid('department_id');
            $table->string('code', 50); // e.g., 'CS101'
            $table->string('name', 255);
            $table->text('description')->nullable();
            $table->integer('credits');
            $table->string('level', 50)->nullable(); // e.g., 'undergraduate', 'postgraduate'
            $table->string('semester', 20)->nullable(); // e.g., 'Fall', 'Spring', 'Both'
            $table->json('prerequisites')->nullable(); // Array of course IDs
            $table->text('syllabus_url')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('college_id')->references('id')->on('colleges')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('cascade');
            
            $table->unique(['department_id', 'code']);
            $table->index(['university_id', 'id']);
            $table->index('college_id');
            $table->index('department_id');
            $table->index('code');
        });
        
        // Add CHECK constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE courses ADD CONSTRAINT courses_status_check CHECK (status IN ('active', 'inactive', 'archived'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
