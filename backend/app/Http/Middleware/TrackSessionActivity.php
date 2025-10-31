<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Symfony\Component\HttpFoundation\Response;

class TrackSessionActivity
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Only track authenticated users
        if ($request->user()) {
            $sessionId = $request->session()->getId();
            $userId = $request->user()->id;
            
            // Update session metadata in Redis
            $sessionKey = "session_meta:{$sessionId}";
            $sessionData = [
                'user_id' => $userId,
                'user_email' => $request->user()->email,
                'last_activity' => now()->toIso8601String(),
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'current_route' => $request->route() ? $request->route()->getName() : 'unknown',
            ];
            
            // Store session metadata with same TTL as session (2 hours)
            Cache::put($sessionKey, $sessionData, now()->addMinutes(config('session.lifetime')));
            
            // Track active sessions per user (for monitoring concurrent sessions)
            $userSessionsKey = "user_sessions:{$userId}";
            $userSessions = Cache::get($userSessionsKey, []);
            
            // Add current session if not already tracked
            if (!in_array($sessionId, $userSessions)) {
                $userSessions[] = $sessionId;
                Cache::put($userSessionsKey, $userSessions, now()->addMinutes(config('session.lifetime')));
            }
            
            // Log session activity for security monitoring (throttled to avoid spam)
            $logKey = "session_logged:{$sessionId}";
            if (!Cache::has($logKey)) {
                Log::info('Session activity', [
                    'session_id' => $sessionId,
                    'user_id' => $userId,
                    'user_email' => $request->user()->email,
                    'ip_address' => $request->ip(),
                    'route' => $request->route() ? $request->route()->getName() : $request->path(),
                    'method' => $request->method(),
                ]);
                
                // Only log once every 5 minutes per session
                Cache::put($logKey, true, now()->addMinutes(5));
            }
        }
        
        return $next($request);
    }
}
