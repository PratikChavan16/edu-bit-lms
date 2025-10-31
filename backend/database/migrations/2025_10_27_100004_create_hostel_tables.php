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
        Schema::create('hostels', function (Blueprint $table) {
            $table->id();
            $table->foreignId('university_id')->constrained('universities')->onDelete('cascade');
            $table->foreignId('college_id')->constrained('colleges')->onDelete('cascade');
            
            $table->string('name');
            $table->string('hostel_code')->unique();
            
            $table->enum('hostel_type', ['boys', 'girls', 'coed'])->default('boys');
            
            $table->string('warden_name');
            $table->string('warden_phone', 20);
            $table->string('warden_email')->nullable();
            
            $table->integer('total_floors')->default(1);
            $table->integer('total_rooms');
            $table->integer('capacity');
            $table->integer('occupied_beds')->default(0);
            $table->integer('available_beds');
            
            $table->json('facilities')->nullable(); // ['wifi', 'mess', 'laundry', 'gym', 'library']
            $table->json('address')->nullable();
            
            $table->decimal('monthly_fee', 10, 2);
            $table->decimal('security_deposit', 10, 2)->nullable();
            
            $table->enum('status', ['active', 'inactive', 'renovation', 'full'])->default('active');
            
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('hostel_rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_id')->constrained('hostels')->onDelete('cascade');
            
            $table->string('room_number');
            $table->integer('floor_number');
            $table->enum('room_type', ['single', 'double', 'triple', 'quad'])->default('double');
            
            $table->integer('capacity');
            $table->integer('occupied_beds')->default(0);
            $table->integer('available_beds');
            
            $table->json('amenities')->nullable(); // ['ac', 'attached_bathroom', 'balcony', 'study_table']
            $table->decimal('monthly_rent', 10, 2);
            
            $table->enum('status', ['available', 'occupied', 'full', 'maintenance', 'reserved'])->default('available');
            
            $table->timestamps();
            $table->softDeletes();
            
            $table->unique(['hostel_id', 'room_number']);
        });

        Schema::create('hostel_allocations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('hostel_room_id')->constrained('hostel_rooms')->onDelete('cascade');
            $table->foreignId('student_id')->constrained('students')->onDelete('cascade');
            
            $table->string('allocation_number')->unique();
            $table->string('bed_number');
            
            $table->date('check_in_date');
            $table->date('check_out_date')->nullable();
            $table->date('expected_check_out_date')->nullable();
            
            $table->decimal('monthly_fee', 10, 2);
            $table->decimal('security_deposit_paid', 10, 2)->default(0);
            
            $table->enum('payment_status', ['paid', 'pending', 'overdue'])->default('pending');
            $table->enum('status', ['active', 'inactive', 'checked_out', 'cancelled'])->default('active');
            
            $table->text('remarks')->nullable();
            
            $table->timestamps();
            
            $table->unique(['hostel_room_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hostel_allocations');
        Schema::dropIfExists('hostel_rooms');
        Schema::dropIfExists('hostels');
    }
};
