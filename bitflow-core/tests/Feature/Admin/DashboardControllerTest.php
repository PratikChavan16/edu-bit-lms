<?php

declare(strict_types=1);

namespace Tests\Feature\Admin;

use App\Models\College;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

final class DashboardControllerTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test dashboard endpoint returns expected structure.
     */
    public function test_dashboard_returns_summary(): void
    {
        $this->seed(\Database\Seeders\RBACSeeder::class);
        
        $college = College::factory()->create();
        $user = User::factory()->create(['status' => 'active']);
        
        $adminRole = \App\Models\Role::where('name', 'college-admin')->first();
        $user->roles()->attach($adminRole->id, ['college_id' => $college->id]);
        
        $token = $user->createToken('test-device')->plainTextToken;

        $response = $this->getJson("/api/admin/dashboard?college_id={$college->id}", [
            'Authorization' => 'Bearer ' . $token,
        ]);

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
