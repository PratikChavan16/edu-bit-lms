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
            // Drop foreign key first
            $table->dropForeign(['university_id']);
            
            // Make university_id nullable for platform users (bitflow_owner)
            $table->uuid('university_id')->nullable()->change();
            
            // Re-add foreign key
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Drop foreign key
            $table->dropForeign(['university_id']);
            
            // Make university_id NOT NULL again
            $table->uuid('university_id')->nullable(false)->change();
            
            // Re-add foreign key
            $table->foreign('university_id')->references('id')->on('universities')->onDelete('cascade');
        });
    }
};
