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
        // Enable UUID extension (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
            DB::statement('CREATE EXTENSION IF NOT EXISTS "pg_trgm"');
        }
        
        Schema::create('universities', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            } else {
                $table->uuid('id')->primary();
            }
            $table->string('name', 255);
            $table->string('slug', 255)->unique();
            $table->string('domain', 255)->unique();
            $table->string('email', 255);
            $table->string('phone', 20)->nullable();
            $table->text('address')->nullable();
            $table->integer('established_year')->nullable();
            $table->string('timezone', 50)->default('UTC');
            $table->string('status', 20)->default('live');
            $table->integer('storage_quota_gb')->default(1000);
            $table->bigInteger('storage_used_mb')->default(0);
            $table->json('branding')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->softDeletes();
            
            $table->index('slug');
            $table->index('status');
        });
        
        // Add CHECK constraint (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE universities ADD CONSTRAINT universities_status_check CHECK (status IN ('setup', 'live', 'suspended', 'archived'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('universities');
    }
};
