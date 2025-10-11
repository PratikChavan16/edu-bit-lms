<?php<?php



namespace Tests\Unit\Services;namespace Tests\Unit\Services;



use App\Models\Student;use App\Models\Student;

use App\Repositories\FeeRepository;use App\Repositories\FeeRepository;

use App\Services\FeeService;use App\Services\FeeService;

use App\Services\FeeSummaryFormatter;use App\Services\FeeSummaryFormatter;

use Illuminate\Contracts\Pagination\LengthAwarePaginator;use Illuminate\Contracts\Pagination\LengthAwarePaginator;

use Mockery;use Illuminate\Support\Collection;

use Tests\TestCase;use Mockery;

use Tests\TestCase;

class FeeServiceTest extends TestCase

{class FeeServiceTest extends TestCase

    private FeeRepository $repositoryMock;{

    private FeeSummaryFormatter $formatterMock;    private FeeRepository $repositoryMock;

    private FeeService $service;    private FeeSummaryFormatter $formatterMock;

    private FeeService $service;

    protected function setUp(): void

    {    protected function setUp(): void

        parent::setUp();    {

                parent::setUp();

        $this->repositoryMock = Mockery::mock(FeeRepository::class);        

        $this->formatterMock = Mockery::mock(FeeSummaryFormatter::class);        $this->repositoryMock = Mockery::mock(FeeRepository::class);

        $this->service = new FeeService($this->repositoryMock, $this->formatterMock);        $this->formatterMock = Mockery::mock(FeeSummaryFormatter::class);

    }        $this->service = new FeeService($this->repositoryMock, $this->formatterMock);

    }

    protected function tearDown(): void

    {    protected function tearDown(): void

        Mockery::close();    {

        parent::tearDown();        Mockery::close();

    }        parent::tearDown();

    }

    public function test_list_structures_calls_repository(): void

    {    public function test_get_student_fee_summary_returns_formatted_data(): void

        $collegeId = 'college-123';    {

        $filters = [];        $student = Mockery::mock(Student::class);

        $perPage = 15;        $student->shouldReceive('setAttribute')->andReturnSelf();

                $student->shouldReceive('getAttribute')->andReturnUsing(function ($key) {

        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);            return match($key) {

                        'id' => 'student-123',

        $this->repositoryMock                default => null,

            ->shouldReceive('listStructures')            };

            ->once()        });

            ->with($collegeId, $filters, $perPage)        $student->id = 'student-123';

            ->andReturn($paginatorMock);        

        $feesMock = new Collection([

        $result = $this->service->listStructures($collegeId, $filters, $perPage);            (object)['amount' => 1000, 'status' => 'paid'],

            (object)['amount' => 500, 'status' => 'pending'],

        $this->assertSame($paginatorMock, $result);        ]);

    }        

        $formattedData = [

    public function test_list_invoices_calls_repository(): void            'items' => [],

    {            'total_fees' => 1500,

        $collegeId = 'college-123';            'paid_amount' => 1000,

        $filters = ['status' => 'pending'];            'pending_amount' => 500,

        $perPage = 20;            'meta' => [],

                ];

        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);        

                $this->repositoryMock

        $this->repositoryMock            ->shouldReceive('getStudentFees')

            ->shouldReceive('listInvoices')            ->once()

            ->once()            ->with('student-123')

            ->with($collegeId, $filters, $perPage)            ->andReturn($feesMock);

            ->andReturn($paginatorMock);        

        $this->formatterMock

        $result = $this->service->listInvoices($collegeId, $filters, $perPage);            ->shouldReceive('build')

            ->once()

        $this->assertSame($paginatorMock, $result);            ->andReturn($formattedData);

    }

        $result = $this->service->getStudentFeeSummary($student);

    public function test_list_invoices_for_student_calls_repository(): void

    {        $this->assertEquals($formattedData, $result);

        $student = Mockery::mock(Student::class);    }

        $filters = ['year' => 2024];

        $perPage = 15;    public function test_list_fees_for_college(): void

            {

        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);        $collegeId = 'college-123';

                $filters = ['status' => 'pending'];

        $this->repositoryMock        $perPage = 20;

            ->shouldReceive('listInvoicesForStudent')        

            ->once()        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);

            ->with($student, $filters, $perPage)        

            ->andReturn($paginatorMock);        $this->repositoryMock

            ->shouldReceive('listForCollege')

        $result = $this->service->listInvoicesForStudent($student, $filters, $perPage);            ->once()

            ->with($collegeId, $filters, $perPage)

        $this->assertSame($paginatorMock, $result);            ->andReturn($paginatorMock);

    }

        $result = $this->service->listFeesForCollege($collegeId, $filters, $perPage);

    public function test_get_invoice_calls_repository(): void

    {        $this->assertSame($paginatorMock, $result);

        $invoiceId = 'fee-123';    }

        

        $invoiceMock = Mockery::mock(\App\Models\FeeInvoice::class);    public function test_list_student_fees(): void

            {

        $this->repositoryMock        $student = Mockery::mock(Student::class);

            ->shouldReceive('getInvoice')        $filters = ['year' => 2024];

            ->once()        

            ->with($invoiceId)        $paginatorMock = Mockery::mock(LengthAwarePaginator::class);

            ->andReturn($invoiceMock);        

        $this->repositoryMock

        $result = $this->service->getInvoice($invoiceId);            ->shouldReceive('listForStudent')

            ->once()

        $this->assertSame($invoiceMock, $result);            ->with($student, $filters, 15)

    }            ->andReturn($paginatorMock);

}

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
