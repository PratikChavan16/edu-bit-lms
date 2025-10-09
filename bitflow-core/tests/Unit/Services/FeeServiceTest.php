<?php

namespace Tests\Unit\Services;

use App\Models\Student;
use App\Repositories\FeeRepository;
use App\Services\FeeService;
use App\Services\FeeSummaryFormatter;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;
use Mockery;
use Tests\TestCase;

class FeeServiceTest extends TestCase
{
    private FeeRepository $repositoryMock;
    private FeeSummaryFormatter $formatterMock;
    private FeeService $service;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->repositoryMock = Mockery::mock(FeeRepository::class);
        $this->formatterMock = Mockery::mock(FeeSummaryFormatter::class);
        $this->service = new FeeService($this->repositoryMock, $this->formatterMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    public function test_get_student_fee_summary_returns_formatted_data(): void
    {
        $student = Mockery::mock(Student::class);
        $student->id = 'student-123';
        
        $feesMock = new Collection([
            (object)['amount' => 1000, 'status' => 'paid'],
            (object)['amount' => 500, 'status' => 'pending'],
        ]);
        
        $formattedData = [
            'total_fees' => 1500,
            'paid_amount' => 1000,
            'pending_amount' => 500,
        ];
        
        $this->repositoryMock
            ->shouldReceive('getStudentFees')
            ->once()
            ->with('student-123')
            ->andReturn($feesMock);
        
        $this->formatterMock
            ->shouldReceive('formatSummary')
            ->once()
            ->with($feesMock)
            ->andReturn($formattedData);

        $result = $this->service->getStudentFeeSummary($student);

        $this->assertEquals($formattedData, $result);
    }

    public function test_list_fees_for_college(): void
    {
        $collegeId = 'college-123';
        $filters = ['status' => 'pending'];
        $perPage = 20;
        
        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);
        
        $this->repositoryMock
            ->shouldReceive('listForCollege')
            ->once()
            ->with($collegeId, $filters, $perPage)
            ->andReturn($paginatorMock);

        $result = $this->service->listFeesForCollege($collegeId, $filters, $perPage);

        $this->assertSame($paginatorMock, $result);
    }

    public function test_list_student_fees(): void
    {
        $student = Mockery::mock(Student::class);
        $filters = ['year' => 2024];
        
        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);
        
        $this->repositoryMock
            ->shouldReceive('listForStudent')
            ->once()
            ->with($student, $filters, 15)
            ->andReturn($paginatorMock);

        $result = $this->service->listStudentFees($student, $filters);

        $this->assertSame($paginatorMock, $result);
    }

    public function test_record_payment_calls_repository(): void
    {
        $feeId = 'fee-123';
        $paymentData = [
            'amount' => 1000,
            'method' => 'online',
            'transaction_id' => 'TXN123',
        ];
        
        $feeMock = (object)['id' => $feeId, 'status' => 'paid'];
        
        $this->repositoryMock
            ->shouldReceive('recordPayment')
            ->once()
            ->with($feeId, $paymentData)
            ->andReturn($feeMock);

        $result = $this->service->recordPayment($feeId, $paymentData);

        $this->assertSame($feeMock, $result);
    }
}
