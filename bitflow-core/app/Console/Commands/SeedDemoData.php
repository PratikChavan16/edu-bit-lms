<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Database\Seeders\DemoDataSeeder;

class SeedDemoData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'bitflow:seed-demo';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Seed demo data for MVP Engineering College';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->info('📦 Seeding demo data...');
        
        $this->call('db:seed', ['--class' => DemoDataSeeder::class]);

        $this->newLine();
        $this->info('✅ Demo data seeded successfully!');
        $this->newLine();
        
        $this->table(
            ['Role', 'Username', 'Password'],
            [
                ['Bitflow Owner', 'bitflow_admin', 'gMAP@2025?'],
                ['University Owner', 'college_123', 'cOLLEGE@123?'],
                ['Principal', 'principal_mvp', 'Principal@123'],
                ['Faculty', 'prof_sharma', 'Faculty@123'],
                ['Students', 'student_mvp_1 to student_mvp_5', 'Student@123'],
            ]
        );

        return 0;
    }
}
