<?php

/**
 * Test Session Management with Redis
 * 
 * This script tests the Redis session configuration.
 * Run: php test-session-redis.php
 */

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\Redis;
use Illuminate\Support\Facades\Cache;

// Bootstrap Laravel
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "=== Redis Session Configuration Test ===\n\n";

// Test 1: Check Redis Connection
echo "Test 1: Redis Connection\n";
try {
    $redis = Redis::connection('session');
    $redis->ping();
    echo "✅ Redis connection: SUCCESS\n";
    echo "   Connection: session (Database " . config('database.redis.session.database') . ")\n";
} catch (Exception $e) {
    echo "❌ Redis connection: FAILED\n";
    echo "   Error: " . $e->getMessage() . "\n";
    echo "\n   ⚠️  Redis is not running. Please install and start Redis:\n";
    echo "   Windows: Download from https://github.com/tporadowski/redis/releases\n";
    echo "   Or use Docker: docker run -d -p 6379:6379 redis:alpine\n\n";
    exit(1);
}

echo "\n";

// Test 2: Check Session Configuration
echo "Test 2: Session Configuration\n";
$sessionDriver = config('session.driver');
$sessionLifetime = config('session.lifetime');
$sessionConnection = config('session.connection');

echo "✅ Session driver: {$sessionDriver}\n";
echo "✅ Session lifetime: {$sessionLifetime} minutes (2 hours)\n";
echo "✅ Session connection: {$sessionConnection}\n";

if ($sessionDriver !== 'redis') {
    echo "⚠️  Warning: Session driver is not 'redis'. Update .env:\n";
    echo "   SESSION_DRIVER=redis\n";
    echo "   SESSION_CONNECTION=session\n";
}

echo "\n";

// Test 3: Test Redis Session Storage
echo "Test 3: Session Storage Test\n";
try {
    $sessionKey = 'test_session_' . time();
    $testData = [
        'user_id' => 1,
        'email' => 'test@example.com',
        'last_activity' => now()->toIso8601String(),
    ];
    
    // Store in Redis with 2-hour TTL
    Cache::put($sessionKey, $testData, now()->addMinutes(120));
    echo "✅ Session created: {$sessionKey}\n";
    
    // Retrieve from Redis
    $retrieved = Cache::get($sessionKey);
    if ($retrieved === $testData) {
        echo "✅ Session retrieved: SUCCESS\n";
    } else {
        echo "❌ Session retrieved: FAILED (data mismatch)\n";
    }
    
    // Check TTL
    $redis = Redis::connection('session');
    $ttl = $redis->ttl(config('database.redis.options.prefix') . $sessionKey);
    echo "✅ Session TTL: {$ttl} seconds (~" . round($ttl / 60) . " minutes)\n";
    
    // Clean up
    Cache::forget($sessionKey);
    echo "✅ Session deleted: SUCCESS\n";
    
} catch (Exception $e) {
    echo "❌ Session storage test: FAILED\n";
    echo "   Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 4: Test Session Cleanup Command
echo "Test 4: Session Cleanup Command\n";
try {
    $exitCode = Artisan::call('sessions:clean');
    if ($exitCode === 0) {
        echo "✅ Session cleanup command: SUCCESS\n";
        echo Artisan::output();
    } else {
        echo "❌ Session cleanup command: FAILED (exit code: {$exitCode})\n";
    }
} catch (Exception $e) {
    echo "❌ Session cleanup command: FAILED\n";
    echo "   Error: " . $e->getMessage() . "\n";
}

echo "\n";

// Test 5: Check Scheduled Tasks
echo "Test 5: Scheduled Tasks\n";
$schedules = app()->make(\Illuminate\Console\Scheduling\Schedule::class);
$events = $schedules->events();
$sessionCleanupScheduled = false;

foreach ($events as $event) {
    if (str_contains($event->command, 'sessions:clean')) {
        $sessionCleanupScheduled = true;
        echo "✅ Session cleanup scheduled: YES\n";
        echo "   Expression: " . $event->expression . " (hourly)\n";
        break;
    }
}

if (!$sessionCleanupScheduled) {
    echo "⚠️  Session cleanup scheduled: NO\n";
    echo "   Add to routes/console.php:\n";
    echo "   Schedule::command('sessions:clean')->hourly();\n";
}

echo "\n";

// Summary
echo "=== Summary ===\n";
echo "Redis Session Management: ";
if ($sessionDriver === 'redis' && isset($ttl) && $ttl > 0) {
    echo "✅ CONFIGURED\n";
    echo "\n📝 Next Steps:\n";
    echo "1. Start Laravel scheduler: php artisan schedule:work\n";
    echo "2. Monitor sessions: php artisan sessions:clean\n";
    echo "3. Check session logs: storage/logs/session-cleanup.log\n";
} else {
    echo "⚠️  NEEDS CONFIGURATION\n";
    echo "\n📝 Required Steps:\n";
    echo "1. Install Redis (see above)\n";
    echo "2. Update .env: SESSION_DRIVER=redis\n";
    echo "3. Run: php artisan config:clear\n";
    echo "4. Re-run this test\n";
}

echo "\n";
