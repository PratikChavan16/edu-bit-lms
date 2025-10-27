<?php

namespace Tests\Unit;

use Tests\TestCase;
use App\Models\User;
use App\Models\Role;
use App\Models\Permission;
use App\Models\University;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Hash;

class PermissionTest extends TestCase
{
    use RefreshDatabase;

    protected University $university;
    protected Role $adminRole;
    protected Role $userRole;
    protected Permission $viewPermission;
    protected Permission $editPermission;
    protected User $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->university = University::create([
            'name' => 'Test University',
            'slug' => 'test-university',
            'domain' => 'test.bitflow.edu',
            'email' => 'admin@test.bitflow.edu',
            'phone' => '+1-555-0100',
            'status' => 'active',
            'storage_quota_gb' => 100,
        ]);

        $this->adminRole = Role::create([
            'name' => 'Admin',
            'slug' => 'admin',
            'level' => 2,
            'scope' => 'university',
        ]);

        $this->userRole = Role::create([
            'name' => 'User',
            'slug' => 'user',
            'level' => 5,
            'scope' => 'individual',
        ]);

        $this->viewPermission = Permission::create([
            'name' => 'View Users',
            'slug' => 'users.view',
            'category' => 'users',
            'description' => 'Can view users',
        ]);

        $this->editPermission = Permission::create([
            'name' => 'Edit Users',
            'slug' => 'users.edit',
            'category' => 'users',
            'description' => 'Can edit users',
        ]);

        $this->user = User::create([
            'university_id' => $this->university->id,
            'username' => 'testuser',
            'email' => 'test@test.bitflow.edu',
            'password' => Hash::make('Password@123'),
            'first_name' => 'Test',
            'last_name' => 'User',
            'status' => 'active',
            'email_verified_at' => now(),
        ]);
    }

    public function test_role_can_have_permissions(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);
        $this->adminRole->permissions()->attach($this->editPermission->id);

        $this->assertCount(2, $this->adminRole->permissions);
        $this->assertTrue($this->adminRole->permissions->contains($this->viewPermission));
        $this->assertTrue($this->adminRole->permissions->contains($this->editPermission));
    }

    public function test_role_has_permission_method_works(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);

        $this->assertTrue($this->adminRole->hasPermission('users.view'));
        $this->assertFalse($this->adminRole->hasPermission('users.edit'));
    }

    public function test_role_can_give_permission(): void
    {
        $this->adminRole->givePermission($this->viewPermission);

        $this->assertTrue($this->adminRole->hasPermission('users.view'));
        $this->assertTrue($this->adminRole->permissions->contains($this->viewPermission));
    }

    public function test_role_can_give_permission_by_slug(): void
    {
        $this->adminRole->givePermission('users.view');

        $this->assertTrue($this->adminRole->hasPermission('users.view'));
    }

    public function test_role_can_revoke_permission(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);

        $this->assertTrue($this->adminRole->hasPermission('users.view'));

        $this->adminRole->revokePermission($this->viewPermission);

        $this->assertFalse($this->adminRole->hasPermission('users.view'));
    }

    public function test_role_can_sync_permissions(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);

        $this->adminRole->syncPermissions([$this->editPermission]);

        $this->assertFalse($this->adminRole->hasPermission('users.view'));
        $this->assertTrue($this->adminRole->hasPermission('users.edit'));
    }

    public function test_user_has_permission_through_role(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);
        $this->user->roles()->attach($this->adminRole->id);

        $this->assertTrue($this->user->hasPermission('users.view'));
        $this->assertFalse($this->user->hasPermission('users.edit'));
    }

    public function test_user_has_all_permissions_method(): void
    {
        $this->adminRole->permissions()->attach([$this->viewPermission->id, $this->editPermission->id]);
        $this->user->roles()->attach($this->adminRole->id);

        $this->assertTrue($this->user->hasAllPermissions(['users.view', 'users.edit']));
        $this->assertFalse($this->user->hasAllPermissions(['users.view', 'users.delete']));
    }

    public function test_user_permissions_are_loaded_eagerly(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);
        $this->user->roles()->attach($this->adminRole->id);

        $user = User::with('roles.permissions')->find($this->user->id);

        $this->assertNotNull($user->roles);
        $this->assertNotNull($user->roles->first()->permissions);
    }

    public function test_permission_belongs_to_many_roles(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);
        $this->userRole->permissions()->attach($this->viewPermission->id);

        $this->assertCount(2, $this->viewPermission->roles);
        $this->assertTrue($this->viewPermission->roles->contains($this->adminRole));
        $this->assertTrue($this->viewPermission->roles->contains($this->userRole));
    }

    public function test_user_with_multiple_roles_gets_combined_permissions(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);
        $this->userRole->permissions()->attach($this->editPermission->id);

        $this->user->roles()->attach([$this->adminRole->id, $this->userRole->id]);

        $this->assertTrue($this->user->hasPermission('users.view'));
        $this->assertTrue($this->user->hasPermission('users.edit'));
    }

    public function test_inactive_user_still_has_permissions(): void
    {
        $this->adminRole->permissions()->attach($this->viewPermission->id);
        $this->user->roles()->attach($this->adminRole->id);
        $this->user->update(['status' => 'inactive']);

        // Permission check doesn't consider user status
        $this->assertTrue($this->user->hasPermission('users.view'));
    }

    public function test_permission_slug_is_unique(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Permission::create([
            'name' => 'Duplicate',
            'slug' => 'users.view', // Same as existing
            'category' => 'users',
        ]);
    }

    public function test_role_slug_is_unique(): void
    {
        $this->expectException(\Illuminate\Database\QueryException::class);

        Role::create([
            'name' => 'Duplicate',
            'slug' => 'admin', // Same as existing
            'level' => 3,
            'scope' => 'university',
        ]);
    }
}
