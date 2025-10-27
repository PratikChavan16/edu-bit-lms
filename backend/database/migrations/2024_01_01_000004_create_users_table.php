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
        Schema::create('users', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            $table->uuid('university_id'); // Multi-tenant key
            $table->string('username', 50)->unique();
            $table->string('email', 255)->unique();
            $table->string('password', 255); // Will be hashed
            $table->string('first_name', 100);
            $table->string('last_name', 100);
            // full_name is a generated column in PostgreSQL
            $table->string('phone', 20)->nullable();
            $table->text('photo_url')->nullable();
            $table->string('status', 20)->default('active');
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('last_login_at')->nullable();
            $table->timestamp('password_changed_at')->nullable();
            $table->string('two_factor_secret', 255)->nullable();
            $table->boolean('two_factor_enabled')->default(false);
            $table->timestamps();
            $table->softDeletes();
            
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
            
            $table->index(['university_id', 'id']);
            $table->index('email');
            $table->index('username');
            $table->index('status');
        });
        
        // Add generated column for full_name
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE users ADD COLUMN full_name VARCHAR(255) GENERATED ALWAYS AS (first_name || ' ' || last_name) STORED");
        
        // Add CHECK constraint
        DB::statement("ALTER TABLE users ADD CONSTRAINT users_status_check CHECK (status IN ('active', 'inactive', 'suspended', 'deleted'))");
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
