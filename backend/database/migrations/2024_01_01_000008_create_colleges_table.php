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
        Schema::create('colleges', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id');
            $table->string('name', 255);
            $table->string('code', 50); // e.g., 'ENG' for Engineering
            $table->string('type', 50)->nullable(); // e.g., 'Engineering', 'Medical', 'Arts'
            $table->string('email', 255)->nullable();
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->integer('established_year')->nullable();
            $table->string('status', 20)->default('active');
            $table->integer('capacity')->nullable(); // Max student capacity
            $table->integer('current_enrollment')->default(0);
            $table->json('accreditation')->nullable(); // {body, valid_until, certificate_url}
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            
            $table->unique(['university_id', 'code']);
            $table->index(['university_id', 'id']);
            $table->index(['university_id', 'status']);
        });
        
        // Add CHECK constraint
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE colleges ADD CONSTRAINT colleges_status_check CHECK (status IN ('active', 'inactive', 'suspended'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('colleges');
    }
};
