<?php

namespace App\Services;

use Exception;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class JWTService
{
    private string $privateKey;
    private string $publicKey;
    private string $algorithm;
    private int $ttl;
    private int $refreshTtl;

    public function __construct()
    {
        $this->privateKey = file_get_contents(storage_path(config('jwt.private_key_path')));
        $this->publicKey = file_get_contents(storage_path(config('jwt.public_key_path')));
        $this->algorithm = config('jwt.algorithm', 'RS256');
        $this->ttl = config('jwt.ttl', 900); // 15 minutes
        $this->refreshTtl = config('jwt.refresh_ttl', 604800); // 7 days
    }

    /**
     * Generate access token
     */
    public function generateAccessToken(array $payload): string
    {
        $now = time();
        $jti = $this->generateJti();

        $claims = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $this->ttl,
            'jti' => $jti,
        ]);

        return JWT::encode($claims, $this->privateKey, $this->algorithm);
    }

    /**
     * Generate refresh token
     */
    public function generateRefreshToken(array $payload): array
    {
        $now = time();
        $jti = $this->generateJti();
        $refreshToken = $this->generateUuid();

        $claims = array_merge($payload, [
            'iat' => $now,
            'exp' => $now + $this->refreshTtl,
            'jti' => $jti,
            'type' => 'refresh',
        ]);

        return [
            'token' => JWT::encode($claims, $this->privateKey, $this->algorithm),
            'refresh_token' => $refreshToken,
            'jti' => $jti,
            'expires_at' => $now + $this->refreshTtl,
        ];
    }

    /**
     * Verify and decode token
     */
    public function verifyToken(string $token): object
    {
        try {
            return JWT::decode($token, new Key($this->publicKey, $this->algorithm));
        } catch (Exception $e) {
            throw new Exception('Invalid token: ' . $e->getMessage());
        }
    }

    /**
     * Validate access token and return payload as array
     */
    public function validateAccessToken(string $token): ?array
    {
        try {
            $decoded = JWT::decode($token, new Key($this->publicKey, $this->algorithm));
            
            // Convert object to array
            $payload = json_decode(json_encode($decoded), true);
            
            // Check if token is expired
            if ($payload['exp'] < time()) {
                return null;
            }
            
            // Check if it's not a refresh token
            if (isset($payload['type']) && $payload['type'] === 'refresh') {
                return null;
            }
            
            return $payload;
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Check if token is expired
     */
    public function isTokenExpired(string $token): bool
    {
        try {
            $decoded = $this->verifyToken($token);
            return $decoded->exp < time();
        } catch (Exception $e) {
            return true;
        }
    }

    /**
     * Get token payload without verification (use carefully)
     */
    public function getPayload(string $token): ?object
    {
        try {
            $parts = explode('.', $token);
            if (count($parts) !== 3) {
                return null;
            }
            $payload = base64_decode(strtr($parts[1], '-_', '+/'));
            return json_decode($payload);
        } catch (Exception $e) {
            return null;
        }
    }

    /**
     * Generate unique JWT ID
     */
    private function generateJti(): string
    {
        return bin2hex(random_bytes(16));
    }

    /**
     * Generate UUID v4
     */
    private function generateUuid(): string
    {
        $data = random_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40);
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80);
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    /**
     * Get TTL in seconds
     */
    public function getTtl(): int
    {
        return $this->ttl;
    }

    /**
     * Get refresh TTL in seconds
     */
    public function getRefreshTtl(): int
    {
        return $this->refreshTtl;
    }
}
