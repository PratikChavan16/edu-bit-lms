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
        Schema::create('message_attachments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('message_id');
            $table->string('file_name');
            $table->string('file_path');
            $table->string('file_type'); // image, document, video, audio
            $table->string('mime_type');
            $table->bigInteger('file_size'); // in bytes
            $table->timestamps();

            $table->foreign('message_id')->references('id')->on('messages')->onDelete('cascade');
            $table->index('message_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('message_attachments');
    }
};
