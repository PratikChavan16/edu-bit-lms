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
        Schema::create('roles', function (Blueprint $table) {
            if (DB::getDriverName() === 'pgsql') {
                if (DB::getDriverName() === 'pgsql') {
                $table->uuid('id')->primary()->default(DB::raw('uuid_generate_v4()'));
            } else {
                $table->uuid('id')->primary();
            }
            } else {
                $table->uuid('id')->primary();
            }
            $table->string('name', 100);
            $table->string('slug', 100)->unique();
            $table->text('description')->nullable();
            $table->integer('level'); // Hierarchy level (1=highest)
            $table->string('scope', 20);
            $table->timestamps();
            
            $table->index('slug');
            $table->index('level');
        });
        
        // Add CHECK constraint (PostgreSQL only)
        if (DB::getDriverName() === 'pgsql') {
            DB::statement("ALTER TABLE roles ADD CONSTRAINT roles_scope_check CHECK (scope IN ('global', 'university', 'college', 'department', 'individual'))");
        }
        
        // Insert default roles
        $roles = [
            ['name' => 'Bitflow Owner', 'slug' => 'bitflow_owner', 'level' => 1, 'scope' => 'global', 'description' => 'Platform super administrator'],
            ['name' => 'University Owner', 'slug' => 'university_owner', 'level' => 2, 'scope' => 'university', 'description' => 'University CEO/Chancellor'],
            ['name' => 'Super Admin', 'slug' => 'super_admin', 'level' => 3, 'scope' => 'university', 'description' => 'University IT administrator'],
            ['name' => 'Principal', 'slug' => 'principal', 'level' => 4, 'scope' => 'college', 'description' => 'College head'],
            ['name' => 'College Admin', 'slug' => 'college_admin', 'level' => 4, 'scope' => 'college', 'description' => 'College administrator'],
            ['name' => 'Super Academics', 'slug' => 'super_academics', 'level' => 3, 'scope' => 'university', 'description' => 'University academic coordinator'],
            ['name' => 'Faculty', 'slug' => 'faculty', 'level' => 5, 'scope' => 'department', 'description' => 'Teaching staff'],
            ['name' => 'Student', 'slug' => 'student', 'level' => 6, 'scope' => 'college', 'description' => 'Enrolled student'],
            ['name' => 'Parent', 'slug' => 'parent', 'level' => 7, 'scope' => 'individual', 'description' => 'Student guardian'],
            ['name' => 'Admission Admin', 'slug' => 'admission_admin', 'level' => 4, 'scope' => 'college', 'description' => 'Admissions officer'],
            ['name' => 'Super Accountant', 'slug' => 'super_accountant', 'level' => 3, 'scope' => 'university', 'description' => 'University CFO'],
            ['name' => 'College Accounts Admin', 'slug' => 'college_accounts_admin', 'level' => 4, 'scope' => 'college', 'description' => 'College accountant'],
            ['name' => 'College Fee Admin', 'slug' => 'college_fee_admin', 'level' => 5, 'scope' => 'college', 'description' => 'Fee collection officer'],
            ['name' => 'Super Non-Teaching Manager', 'slug' => 'super_nt_manager', 'level' => 3, 'scope' => 'university', 'description' => 'HR manager'],
        ];
        
        foreach ($roles as $role) {
            DB::table('roles')->insert(array_merge($role, [
                'id' => \Illuminate\Support\Str::uuid()->toString(),
                'created_at' => now(),
                'updated_at' => now(),
            ]));
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('roles');
    }
};
