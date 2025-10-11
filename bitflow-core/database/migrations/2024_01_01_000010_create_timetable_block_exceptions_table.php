<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('timetable_block_exceptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('timetable_block_id')->constrained('timetable_blocks')->cascadeOnDelete();
            $table->date('date');
            $table->enum('action', ['cancelled', 'rescheduled', 'venue_change', 'substitute'])->default('cancelled');
            $table->text('reason')->nullable();
            $table->foreignUuid('alternate_faculty_id')->nullable()->constrained('faculty')->nullOnDelete();
            $table->string('alternate_location')->nullable();
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->timestamps();

            $table->index(['timetable_block_id', 'date']);
            $table->index('date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('timetable_block_exceptions');
    }
};
