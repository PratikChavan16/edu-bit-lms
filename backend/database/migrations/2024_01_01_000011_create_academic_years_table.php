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
        Schema::create('academic_years', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->string('name', 100); // e.g., '2025-2026'
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_current')->default(false);
            $table->string('status', 20)->default('upcoming');
            $table->timestamps();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            
            $table->unique(['university_id', 'name']);
            $table->index(['university_id', 'id']);
        });
        
        // Add CHECK constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE academic_years ADD CONSTRAINT academic_years_status_check CHECK (status IN ('upcoming', 'active', 'completed'))");
        }
        
        // Add partial index for current year
        DB::statement("CREATE INDEX idx_academic_years_current ON academic_years(university_id, is_current) WHERE is_current = TRUE");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('academic_years');
    }
};
