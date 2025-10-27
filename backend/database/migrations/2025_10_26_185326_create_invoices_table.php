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
        Schema::create('invoices', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('university_id');
            $table->uuid('subscription_id')->nullable();
            $table->decimal('amount', 10, 2);
            $table->enum('status', ['pending', 'paid', 'failed'])->default('pending');
            $table->timestamp('due_date')->nullable();
            $table->timestamp('paid_at')->nullable();
            $table->string('stripe_invoice_id')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('university_id')
                ->references('id')
                ->on('universities')
                ->onDelete('cascade');
            
            $table->foreign('subscription_id')
                ->references('id')
                ->on('subscriptions')
                ->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
