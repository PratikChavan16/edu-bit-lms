<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Log;

class CleanExpiredSessions extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'sessions:clean';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up expired sessions from Redis';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting session cleanup...');
        
        try {
            // Get Redis connection for sessions
            $redis = Redis::connection('session');
            
            // Get all session keys
            $sessionPrefix = config('database.redis.options.prefix') . 'laravel_session:';
            $keys = $redis->keys($sessionPrefix . '*');
            
            $cleaned = 0;
            $total = count($keys);
            
            if ($total === 0) {
                $this->info('No sessions found.');
                return 0;
            }
            
            $this->info("Found {$total} session(s).");
            
            // Laravel's Redis driver handles TTL automatically, but let's clean up any orphaned sessions
            foreach ($keys as $key) {
                // Remove prefix from key name for Redis operations
                $keyWithoutPrefix = str_replace(config('database.redis.options.prefix'), '', $key);
                
                // Check if session has expired (TTL = -1 means no expiry, -2 means doesn't exist)
                $ttl = $redis->ttl($keyWithoutPrefix);
                
                if ($ttl === -2) {
                    // Key doesn't exist (already expired and removed)
                    $cleaned++;
                } elseif ($ttl === -1) {
                    // Key exists but has no expiry - this shouldn't happen, clean it up
                    $redis->del($keyWithoutPrefix);
                    $cleaned++;
                    $this->warn("Cleaned session without TTL: {$keyWithoutPrefix}");
                }
            }
            
            $remaining = $total - $cleaned;
            $this->info("Session cleanup complete. Cleaned: {$cleaned}, Remaining: {$remaining}");
            
            // Log cleanup activity
            Log::info('Session cleanup completed', [
                'total_sessions' => $total,
                'cleaned_sessions' => $cleaned,
                'remaining_sessions' => $remaining,
            ]);
            
            return 0;
            
        } catch (\Exception $e) {
            $this->error('Error during session cleanup: ' . $e->getMessage());
            Log::error('Session cleanup failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
            ]);
            
            return 1;
        }
    }
}
