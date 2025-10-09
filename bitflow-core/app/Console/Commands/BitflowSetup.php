<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\RBACSeeder;
use Database\Seeders\FeatureCatalogSeeder;

class BitflowSetup extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bitflow:setup {--fresh : Drop all tables and recreate}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Setup Bitflow Nova environment (migrations + seeders)';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('🚀 Setting up Bitflow Nova...');
        $this->newLine();

        if ($this->option('fresh')) {
            $this->warn('⚠️  Running fresh migration (all data will be lost)');
            if (!$this->confirm('Are you sure?')) {
                $this->error('Aborted.');
                return 1;
            }
            
            $this->call('migrate:fresh');
        } else {
            $this->call('migrate');
        }

        $this->newLine();
        $this->info('📦 Seeding RBAC and Feature Catalog...');
        
        $this->call('db:seed', ['--class' => RBACSeeder::class]);
        $this->call('db:seed', ['--class' => FeatureCatalogSeeder::class]);

        $this->newLine();
        $this->info('✅ Bitflow Nova setup completed!');
        
        if ($this->confirm('Would you like to seed demo data (MVP Engineering College)?', true)) {
            $this->call('bitflow:seed-demo');
        }

        return 0;
    }
}
