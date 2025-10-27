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
        Schema::create('departments', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->uuid('college_id');
            $table->string('name', 255);
            $table->string('code', 50); // e.g., 'CSE' for Computer Science
            $table->uuid('head_faculty_id')->nullable(); // Department head (nullable initially)
            $table->string('email', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('floor_location', 100)->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            $table->foreign('college_id')->references('id')->on('colleges')->onDelete('cascade');
            
            $table->unique(['college_id', 'code']);
            $table->index(['university_id', 'id']);
            $table->index('college_id');
        });
        
        // Add CHECK constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE departments ADD CONSTRAINT departments_status_check CHECK (status IN ('active', 'inactive'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('departments');
    }
};
