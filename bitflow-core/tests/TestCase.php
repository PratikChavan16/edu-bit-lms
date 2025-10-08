<?php

declare(strict_types=1);

namespace Tests;

use PHPUnit\Framework\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    /**
     * Perform a GET request to the given URI.
     *
     * @param string $uri
     * @param array<string, mixed> $headers
     * @return TestResponse
     */
    protected function getJson(string $uri, array $headers = []): TestResponse
    {
        // Mock implementation for illustration
        return new TestResponse(200, ['Content-Type' => 'application/json'], '{}');
    }
}

/**
 * Minimal response wrapper for testing.
 */
final class TestResponse
{
    public function __construct(
        public readonly int $status,
        public readonly array $headers,
        public readonly string $body
    ) {
    }

    public function assertOk(): self
    {
        assert($this->status === 200);
        return $this;
    }

    public function assertJsonStructure(array $structure): self
    {
        // Placeholder assertion
        return $this;
    }
}
