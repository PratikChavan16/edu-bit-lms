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
        Schema::create('parent_student', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('parent_id'); // user_id of the parent
            $table->uuid('student_id'); // student table id
            $table->string('relationship_type')->default('parent'); // parent, guardian, mother, father, etc.
            $table->boolean('is_primary')->default(false); // Primary contact
            $table->boolean('can_view_grades')->default(true);
            $table->boolean('can_view_attendance')->default(true);
            $table->boolean('can_view_fees')->default(true);
            $table->boolean('receive_notifications')->default(true);
            $table->timestamps();

            $table->foreign('parent_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');
            $table->unique(['parent_id', 'student_id']);
            $table->index('parent_id');
            $table->index('student_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('parent_student');
    }
};
