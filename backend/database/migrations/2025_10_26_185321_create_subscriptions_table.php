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
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('university_id');
            $table->string('plan'); // basic, pro, enterprise
            $table->enum('status', ['trial', 'active', 'past_due', 'canceled'])->default('active');
            $table->decimal('mrr', 10, 2)->default(0); // Monthly Recurring Revenue
            $table->timestamp('next_billing_date')->nullable();
            $table->timestamp('trial_ends_at')->nullable();
            $table->timestamp('canceled_at')->nullable();
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('university_id')
                ->references('id')
                ->on('universities')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('subscriptions');
    }
};
