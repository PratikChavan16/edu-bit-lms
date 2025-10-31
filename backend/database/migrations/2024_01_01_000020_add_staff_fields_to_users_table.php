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
        Schema::table('users', function (Blueprint $table) {
            // Staff-specific fields
            $table->uuid('college_id')->nullable()->after('university_id');
            $table->uuid('department_id')->nullable()->after('college_id');
            $table->string('employee_id', 50)->nullable()->unique()->after('username');
            $table->string('role', 50)->nullable()->after('password'); // e.g., admission_admin, non_teaching_staff
            $table->string('designation', 100)->nullable()->after('role');
            $table->string('employee_type', 50)->nullable()->after('designation'); // For non-teaching staff
            $table->date('joining_date')->nullable()->after('employee_type');
            $table->string('shift', 20)->nullable()->after('joining_date'); // morning, evening, night, rotational
            $table->string('supervisor_name', 100)->nullable()->after('shift');
            
            // Foreign keys
            $table->foreign('college_id')->references('id')->on('colleges')->onDelete('cascade');
            $table->foreign('department_id')->references('id')->on('departments')->onDelete('set null');
            
            // Indexes
            $table->index('college_id');
            $table->index('department_id');
            $table->index('employee_id');
            $table->index('role');
            $table->index('employee_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['college_id']);
            $table->dropForeign(['department_id']);
            $table->dropIndex(['college_id']);
            $table->dropIndex(['department_id']);
            $table->dropIndex(['employee_id']);
            $table->dropIndex(['role']);
            $table->dropIndex(['employee_type']);
            $table->dropColumn([
                'college_id',
                'department_id',
                'employee_id',
                'role',
                'designation',
                'employee_type',
                'joining_date',
                'shift',
                'supervisor_name',
            ]);
        });
    }
};
