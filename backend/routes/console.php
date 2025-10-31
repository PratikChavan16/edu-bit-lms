<?php

use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();

// Session Cleanup - Run every hour to clean expired sessions
Schedule::command('sessions:clean')
    ->hourly()
    ->appendOutputTo(storage_path('logs/session-cleanup.log'));

// Scheduled Reports - Run every minute to check for due reports
Schedule::command('reports:generate-scheduled')
    ->everyMinute()
    ->withoutOverlapping()
    ->appendOutputTo(storage_path('logs/scheduled-reports.log'));
