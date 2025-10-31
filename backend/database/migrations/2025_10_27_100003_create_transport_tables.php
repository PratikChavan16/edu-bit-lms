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
        Schema::create('transport_buses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained('universities')->onDelete('cascade');
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            
            $table->string('bus_number')->unique();
            $table->string('vehicle_number')->unique();
            $table->string('bus_name')->nullable();
            
            $table->integer('capacity');
            $table->integer('current_occupancy')->default(0);
            
            $table->string('driver_name');
            $table->string('driver_phone', 20);
            $table->string('driver_license_number')->nullable();
            
            $table->string('conductor_name')->nullable();
            $table->string('conductor_phone', 20)->nullable();
            
            $table->enum('bus_type', ['ac', 'non_ac'])->default('non_ac');
            $table->date('registration_date')->nullable();
            $table->date('insurance_expiry')->nullable();
            $table->date('fitness_expiry')->nullable();
            
            $table->enum('status', ['active', 'inactive', 'maintenance', 'breakdown'])->default('active');
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('transport_routes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            $table->foreignId('transport_bus_id')->constrained('transport_buses')->onDelete('cascade');
            
            $table->string('route_name');
            $table->string('route_number')->unique();
            
            $table->time('departure_time');
            $table->time('arrival_time');
            $table->decimal('distance_km', 8, 2)->nullable();
            $table->decimal('fare_amount', 10, 2);
            
            $table->json('stops'); // Array of stop objects with name, arrival_time, coordinates
            
            $table->enum('route_type', ['morning', 'evening', 'both'])->default('both');
            $table->enum('status', ['active', 'inactive'])->default('active');
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('transport_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            $table->foreignId('transport_route_id')->constrained('transport_routes')->onDelete('cascade');
            
            $table->string('allocation_number')->unique();
            $table->string('pickup_stop');
            $table->string('drop_stop');
            
            $table->date('start_date');
            $table->date('end_date')->nullable();
            
            $table->decimal('monthly_fee', 10, 2);
            $table->enum('payment_status', ['paid', 'pending', 'overdue'])->default('pending');
            
            $table->enum('status', ['active', 'inactive', 'cancelled'])->default('active');
            
            $table->timestamps();
            
            $table->unique(['student_id', 'transport_route_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transport_allocations');
        Schema::dropIfExists('transport_routes');
        Schema::dropIfExists('transport_buses');
    }
};
