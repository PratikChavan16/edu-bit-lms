<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use Tests\TestCase;

final class DashboardControllerTest extends TestCase
{
    /**
     * Test dashboard endpoint returns expected structure.
     */
    public function test_dashboard_returns_summary(): void
    {
        $response = $this->getJson('/admin/dashboard');

        $response->assertOk();
        $response->assertJsonStructure([
            'welcome' => ['operatorName', 'pendingTasks', 'message'],
            'metrics' => [
                '*' => ['label', 'value', 'delta'],
            ],
            'activities' => [
                '*' => ['title', 'description', 'occurredAt'],
            ],
            'provisioningQueue' => ['slaBreached', 'items'],
        ]);
    }
}
