<?php

namespace App\Services;

use App\Models\{FeeStructure, FeeInvoice, FeePayment, Student};
use App\Repositories\FeeRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class FeeService
{
    public function __construct(
        private FeeRepository $repository,
        private FeeSummaryFormatter $summaryFormatter
    )
    {
    }

    public function listStructures(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listStructures($collegeId, $filters, $perPage);
    }

    public function createStructure(string $collegeId, array $data): FeeStructure
    {
        return $this->repository->createStructure(array_merge($data, [
            'college_id' => $collegeId,
        ]));
    }

    public function updateStructure(string $structureId, array $data): FeeStructure
    {
        $structure = FeeStructure::findOrFail($structureId);

        return $this->repository->updateStructure($structure, $data);
    }

    public function deleteStructure(string $structureId): void
    {
        $structure = FeeStructure::findOrFail($structureId);
        $this->repository->deleteStructure($structure);
    }

    public function listInvoices(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listInvoices($collegeId, $filters, $perPage);
    }

    public function listInvoicesForStudent(Student $student, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        return $this->repository->listInvoicesForStudent($student, $filters, $perPage);
    }

    public function createInvoice(string $collegeId, array $data): FeeInvoice
    {
        return $this->repository->createInvoice(array_merge($data, [
            'college_id' => $collegeId,
        ]));
    }

    public function updateInvoice(string $invoiceId, array $data): FeeInvoice
    {
        $invoice = FeeInvoice::findOrFail($invoiceId);

        return $this->repository->updateInvoice($invoice, $data);
    }

    public function deleteInvoice(string $invoiceId): void
    {
        $invoice = FeeInvoice::findOrFail($invoiceId);
        $this->repository->deleteInvoice($invoice);
    }

    public function recordPayment(string $invoiceId, array $data): FeePayment
    {
        $invoice = FeeInvoice::findOrFail($invoiceId);

        return $this->repository->recordPayment(array_merge($data, [
            'invoice_id' => $invoice->id,
        ]));
    }

    public function getInvoice(string $invoiceId): FeeInvoice
    {
        return $this->repository->getInvoice($invoiceId);
    }

    public function getLearnerFeeSummary(Student $student): array
    {
        $invoices = FeeInvoice::with('payments')
            ->where('student_id', $student->id)
            ->orderByDesc('due_date')
            ->get()
            ->map(function (FeeInvoice $invoice): array {
                return [
                    'invoice_number' => $invoice->invoice_number,
                    'status' => $invoice->status,
                    'total_amount' => (float) $invoice->total_amount,
                    'paid_amount' => (float) $invoice->paid_amount,
                    'discount' => (float) $invoice->discount,
                    'due_date' => $invoice->due_date?->toDateString(),
                    'components' => $invoice->components ?? [],
                    'payments' => $invoice->payments->map(static function (FeePayment $payment): array {
                        return [
                            'receipt_number' => $payment->receipt_number,
                            'amount' => (float) $payment->amount,
                            'payment_method' => $payment->payment_method,
                            'payment_date' => $payment->payment_date?->toDateString(),
                        ];
                    })->all(),
                ];
            });

        return $this->summaryFormatter->build($invoices);
    }

    /**
     * List all fee structures for a college with optional filters
     */
    public function listFeesForCollege(string $collegeId, array $filters = []): LengthAwarePaginator
    {
        $query = FeeStructure::where('college_id', $collegeId)
            ->with(['course']);
        
        if (isset($filters['academic_year'])) {
            $query->where('academic_year', $filters['academic_year']);
        }
        
        if (isset($filters['course_id'])) {
            $query->where('course_id', $filters['course_id']);
        }

        if (isset($filters['semester'])) {
            $query->where('semester', $filters['semester']);
        }
        
        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }

    /**
     * List all fee invoices for a specific student
     */
    public function listStudentFees(string $studentId, array $filters = []): LengthAwarePaginator
    {
        $query = FeeInvoice::where('student_id', $studentId)
            ->with(['feeStructure', 'payments']);
        
        if (isset($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (isset($filters['academic_year'])) {
            $query->whereHas('feeStructure', function ($q) use ($filters) {
                $q->where('academic_year', $filters['academic_year']);
            });
        }
        
        return $query->latest()->paginate($filters['per_page'] ?? 15);
    }
}
