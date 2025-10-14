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
        Schema::table('roles', function (Blueprint $table) {
            $table->unsignedTinyInteger('level')->default(5)->after('scope')
                ->comment('Hierarchy level: 1=Bitflow Owner, 2=College Owner, 3=Super Admins, 4=Principals, 5=Admins/HODs, 6=Faculty, 7=Parent, 8=Student');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('roles', function (Blueprint $table) {
            $table->dropColumn('level');
        });
    }
};
