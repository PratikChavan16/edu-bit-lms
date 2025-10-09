<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timetable_blocks', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('college_id')->constrained()->cascadeOnDelete();
            $table->string('subject');
            $table->string('course');
            $table->integer('year');
            $table->string('section')->nullable();
            $table->foreignUuid('faculty_id')->constrained('faculty')->cascadeOnDelete();
            $table->enum('day_of_week', ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']);
            $table->time('start_time');
            $table->time('end_time');
            $table->string('location')->nullable();
            $table->enum('type', ['lecture', 'lab', 'tutorial', 'practical'])->default('lecture');
            $table->date('effective_from');
            $table->date('effective_to')->nullable();
            $table->timestamps();

            $table->index(['college_id', 'day_of_week', 'start_time']);
            $table->index(['faculty_id', 'day_of_week', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timetable_blocks');
    }
};
