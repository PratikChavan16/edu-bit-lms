<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            RBACSeeder::class,
            FeatureCatalogSeeder::class,
            DemoDataSeeder::class,
        ]);

        $this->command->info('✓ All seeders completed successfully!');
    }
}
