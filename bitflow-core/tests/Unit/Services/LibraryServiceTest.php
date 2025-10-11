<?php

namespace Tests\Unit\Services;

use App\Models\LibraryResource;
use App\Models\Student;
use App\Repositories\LibraryRepository;
use App\Services\LibraryService;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Mockery;
use Tests\TestCase;

class LibraryServiceTest extends TestCase
{
    private LibraryRepository $repositoryMock;
    private LibraryService $service;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->repositoryMock = Mockery::mock(LibraryRepository::class);
        $this->service = new LibraryService($this->repositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_list_resources_calls_repository(): void
    {
        $collegeId = 'college-123';
        $filters = ['type' => 'book'];
        $perPage = 20;
        
        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);
        
        $this->repositoryMock
            ->shouldReceive('listForCollege')
            ->once()
            ->with($collegeId, $filters, $perPage)
            ->andReturn($paginatorMock);

        $result = $this->service->listResources($collegeId, $filters, $perPage);

        $this->assertSame($paginatorMock, $result);
    }

    public function test_list_learner_resources_adds_student_filters(): void
    {
        $student = Mockery::mock(Student::class);
        $student->shouldReceive('setAttribute')->andReturnSelf();
        $student->shouldReceive('getAttribute')->andReturnUsing(function ($key) {
            return match($key) {
                'college_id' => 'college-123',
                'course' => 'Computer Science',
                'year' => 2024,
                default => null,
            };
        });
        $student->college_id = 'college-123';
        $student->course = 'Computer Science';
        $student->year = 2024;
        
        $filters = [];
        
        $this->repositoryMock
            ->shouldReceive('listApprovedForLearner')
            ->once()
            ->with('college-123', [
                'course' => 'Computer Science',
                'year' => 2024,
            ], 15)
            ->andReturn(Mockery::mock(LengthAwarePaginator::class));

        $this->service->listLearnerResources($student, $filters);
    }

    public function test_list_learner_resources_respects_custom_filters(): void
    {
        $student = Mockery::mock(Student::class);
        $student->shouldReceive('setAttribute')->andReturnSelf();
        $student->shouldReceive('getAttribute')->andReturnUsing(function ($key) {
            return match($key) {
                'college_id' => 'college-123',
                'course' => 'Computer Science',
                'year' => 2024,
                default => null,
            };
        });
        $student->college_id = 'college-123';
        $student->course = 'Computer Science';
        $student->year = 2024;
        
        $filters = ['course' => 'Mathematics', 'year' => 2023];
        
        $this->repositoryMock
            ->shouldReceive('listApprovedForLearner')
            ->once()
            ->with('college-123', $filters, 15)
            ->andReturn(Mockery::mock(LengthAwarePaginator::class));

        $this->service->listLearnerResources($student, $filters);
    }

    public function test_create_resource_adds_college_and_user(): void
    {
        $collegeId = 'college-123';
        $userId = 'user-456';
        $data = [
            'title' => 'Test Book',
            'type' => 'book',
        ];
        
        $expectedPayload = [
            'title' => 'Test Book',
            'type' => 'book',
            'college_id' => $collegeId,
            'uploaded_by' => $userId,
        ];
        
        $resourceMock = Mockery::mock(LibraryResource::class);
        
        $this->repositoryMock
            ->shouldReceive('create')
            ->once()
            ->with($expectedPayload)
            ->andReturn($resourceMock);

        $result = $this->service->createResource($collegeId, $userId, $data);

        $this->assertSame($resourceMock, $result);
    }

    public function test_update_resource_retrieves_and_updates(): void
    {
        $resourceId = 'resource-123';
        $data = ['title' => 'Updated Title'];
        
        $resourceMock = Mockery::mock(LibraryResource::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($resourceId)
            ->andReturn($resourceMock);
        
        $this->repositoryMock
            ->shouldReceive('update')
            ->once()
            ->with($resourceMock, $data)
            ->andReturn($resourceMock);

        $result = $this->service->updateResource($resourceId, $data);

        $this->assertSame($resourceMock, $result);
    }

    public function test_delete_resource_retrieves_and_deletes(): void
    {
        $resourceId = 'resource-123';
        
        $resourceMock = Mockery::mock(LibraryResource::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($resourceId)
            ->andReturn($resourceMock);
        
        $this->repositoryMock
            ->shouldReceive('delete')
            ->once()
            ->with($resourceMock);

        $this->service->deleteResource($resourceId);
    }

    public function test_approve_resource_sets_approval_data(): void
    {
        $resourceId = 'resource-123';
        $approverId = 'admin-456';
        $status = 'approved';
        
        $resourceMock = Mockery::mock(LibraryResource::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($resourceId)
            ->andReturn($resourceMock);
        
        $this->repositoryMock
            ->shouldReceive('approve')
            ->once()
            ->with($resourceMock, [
                'approval_status' => $status,
                'approved_by' => $approverId,
            ])
            ->andReturn($resourceMock);

        $result = $this->service->approveResource($resourceId, $approverId, $status);

        $this->assertSame($resourceMock, $result);
    }

    public function test_approve_resource_defaults_to_approved_status(): void
    {
        $resourceId = 'resource-123';
        $approverId = 'admin-456';
        
        $resourceMock = Mockery::mock(LibraryResource::class);
        
        $this->repositoryMock->shouldReceive('getById')->andReturn($resourceMock);
        
        $this->repositoryMock
            ->shouldReceive('approve')
            ->once()
            ->with($resourceMock, [
                'approval_status' => 'approved',
                'approved_by' => $approverId,
            ])
            ->andReturn($resourceMock);

        $this->service->approveResource($resourceId, $approverId);
    }

    public function test_toggle_bookmark_calls_repository(): void
    {
        $userId = 'user-123';
        $resourceId = 'resource-456';
        
        $this->repositoryMock
            ->shouldReceive('toggleBookmark')
            ->once()
            ->with($userId, $resourceId)
            ->andReturn(true);

        $result = $this->service->toggleBookmark($userId, $resourceId);

        $this->assertTrue($result);
    }

    public function test_list_bookmarks_returns_collection(): void
    {
        $userId = 'user-123';
        
        $collectionMock = Mockery::mock(Collection::class);
        
        $this->repositoryMock
            ->shouldReceive('listBookmarks')
            ->once()
            ->with($userId)
            ->andReturn($collectionMock);

        $result = $this->service->listBookmarks($userId);

        $this->assertSame($collectionMock, $result);
    }

    public function test_get_resource_calls_repository(): void
    {
        $resourceId = 'resource-123';
        
        $resourceMock = Mockery::mock(LibraryResource::class);
        
        $this->repositoryMock
            ->shouldReceive('getById')
            ->once()
            ->with($resourceId)
            ->andReturn($resourceMock);

        $result = $this->service->getResource($resourceId);

        $this->assertSame($resourceMock, $result);
    }
}
