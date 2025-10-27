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
        Schema::create('system_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->timestamp('timestamp')->index();
            $table->enum('level', ['error', 'warning', 'info', 'debug'])->index();
            $table->string('source', 100)->index();
            $table->text('message');
            $table->json('details')->nullable();
            $table->text('trace')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('system_logs');
    }
};
