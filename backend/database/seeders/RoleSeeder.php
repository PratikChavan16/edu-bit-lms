<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Roles are pre-seeded in the migration
        // This seeder is for additional role configurations if needed
        
        $this->command->info('Roles already seeded via migration');
        
        // You can add additional role configurations here
        // For example, update role descriptions or add new roles
    }
}
