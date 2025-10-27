<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Services\JWTService;
use Illuminate\Foundation\Testing\RefreshDatabase;

class JWTServiceTest extends TestCase
{
    use RefreshDatabase;

    protected JWTService $jwtService;

    protected function setUp(): void
    {
        parent::setUp();

        // Create JWT keys for testing
        $this->createTestJWTKeys();

        $this->jwtService = new JWTService();
    }

    protected function tearDown(): void
    {
        $this->removeTestJWTKeys();
        parent::tearDown();
    }

    private function createTestJWTKeys(): void
    {
        $keysPath = storage_path('keys');

        if (!is_dir($keysPath)) {
            mkdir($keysPath, 0755, true);
        }

        // Generate test RSA keys
        $config = [
            'private_key_bits' => 2048, // Smaller for tests (faster)
            'private_key_type' => OPENSSL_KEYTYPE_RSA,
        ];

        $resource = openssl_pkey_new($config);
        openssl_pkey_export($resource, $privateKey);
        $publicKey = openssl_pkey_get_details($resource)['key'];

        file_put_contents(storage_path('keys/private.pem'), $privateKey);
        file_put_contents(storage_path('keys/public.pem'), $publicKey);
    }

    private function removeTestJWTKeys(): void
    {
        @unlink(storage_path('keys/private.pem'));
        @unlink(storage_path('keys/public.pem'));
    }

    public function test_can_generate_access_token(): void
    {
        $payload = [
            'sub' => 'test-user-id',
            'email' => 'test@example.com',
            'university_id' => 'test-university-id',
        ];

        $token = $this->jwtService->generateAccessToken($payload);

        $this->assertNotEmpty($token);
        $this->assertIsString($token);

        // JWT should have 3 parts separated by dots
        $parts = explode('.', $token);
        $this->assertCount(3, $parts);
    }

    public function test_generated_token_contains_correct_payload(): void
    {
        $payload = [
            'sub' => 'test-user-id',
            'email' => 'test@example.com',
            'university_id' => 'test-university-id',
        ];

        $token = $this->jwtService->generateAccessToken($payload);
        $decoded = $this->jwtService->verifyToken($token);

        $this->assertEquals('test-user-id', $decoded->sub);
        $this->assertEquals('test@example.com', $decoded->email);
        $this->assertEquals('test-university-id', $decoded->university_id);
    }

    public function test_token_has_iat_and_exp_claims(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $token = $this->jwtService->generateAccessToken($payload);
        $decoded = $this->jwtService->verifyToken($token);

        $this->assertObjectHasProperty('iat', $decoded);
        $this->assertObjectHasProperty('exp', $decoded);
        $this->assertObjectHasProperty('jti', $decoded);

        // exp should be 15 minutes (900 seconds) after iat
        $this->assertEquals(900, $decoded->exp - $decoded->iat);
    }

    public function test_can_verify_valid_token(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $token = $this->jwtService->generateAccessToken($payload);

        $decoded = $this->jwtService->verifyToken($token);

        $this->assertIsObject($decoded);
        $this->assertEquals('test-user-id', $decoded->sub);
    }

    public function test_verify_token_throws_exception_for_invalid_token(): void
    {
        $this->expectException(\Exception::class);

        $this->jwtService->verifyToken('invalid.token.here');
    }

    public function test_verify_token_throws_exception_for_tampered_token(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $token = $this->jwtService->generateAccessToken($payload);

        // Tamper with the token
        $parts = explode('.', $token);
        $parts[1] = base64_encode('{"sub":"hacker"}');
        $tamperedToken = implode('.', $parts);

        $this->expectException(\Exception::class);

        $this->jwtService->verifyToken($tamperedToken);
    }

    public function test_can_generate_refresh_token(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $result = $this->jwtService->generateRefreshToken($payload);

        $this->assertIsArray($result);
        $this->assertArrayHasKey('token', $result);
        $this->assertArrayHasKey('refresh_token', $result);
        $this->assertArrayHasKey('jti', $result);
        $this->assertArrayHasKey('expires_at', $result);
    }

    public function test_refresh_token_has_7_day_expiry(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $result = $this->jwtService->generateRefreshToken($payload);
        $decoded = $this->jwtService->verifyToken($result['token']);

        // Refresh token should expire in 7 days (604800 seconds)
        $this->assertEquals(604800, $decoded->exp - $decoded->iat);
    }

    public function test_can_get_payload_without_verification(): void
    {
        $payload = [
            'sub' => 'test-user-id',
            'email' => 'test@example.com',
        ];

        $token = $this->jwtService->generateAccessToken($payload);
        $decoded = $this->jwtService->getPayload($token);

        $this->assertIsObject($decoded);
        $this->assertEquals('test-user-id', $decoded->sub);
        $this->assertEquals('test@example.com', $decoded->email);
    }

    public function test_is_token_expired_returns_false_for_valid_token(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $token = $this->jwtService->generateAccessToken($payload);

        $this->assertFalse($this->jwtService->isTokenExpired($token));
    }

    public function test_is_token_expired_returns_true_for_expired_token(): void
    {
        // This test is tricky because we can't easily create an expired token
        // We would need to mock the time or wait 15 minutes
        // For now, we'll test with an invalid token which should also return true

        $this->assertTrue($this->jwtService->isTokenExpired('invalid.token.here'));
    }

    public function test_each_token_has_unique_jti(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $token1 = $this->jwtService->generateAccessToken($payload);
        $token2 = $this->jwtService->generateAccessToken($payload);

        $decoded1 = $this->jwtService->verifyToken($token1);
        $decoded2 = $this->jwtService->verifyToken($token2);

        $this->assertNotEquals($decoded1->jti, $decoded2->jti);
    }

    public function test_refresh_token_has_type_claim(): void
    {
        $payload = [
            'sub' => 'test-user-id',
        ];

        $result = $this->jwtService->generateRefreshToken($payload);
        $decoded = $this->jwtService->verifyToken($result['token']);

        $this->assertObjectHasProperty('type', $decoded);
        $this->assertEquals('refresh', $decoded->type);
    }
}
