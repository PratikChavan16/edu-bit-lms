<?php

namespace App\Repositories;

use App\Models\{FeeStructure, FeeInvoice, FeePayment, Student};
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class FeeRepository
{
    public function listStructures(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = FeeStructure::query()
            ->where('college_id', $collegeId)
            ->orderByDesc('effective_from');

        if (!empty($filters['course'])) {
            $query->where('course', $filters['course']);
        }

        if (!empty($filters['year'])) {
            $query->where('year', (int) $filters['year']);
        }

        return $query->paginate($perPage);
    }

    public function createStructure(array $data): FeeStructure
    {
        return FeeStructure::create($data);
    }

    public function updateStructure(FeeStructure $structure, array $data): FeeStructure
    {
        $structure->fill($data);
        $structure->save();

        return $structure->refresh();
    }

    public function deleteStructure(FeeStructure $structure): void
    {
        $structure->delete();
    }

    public function listInvoices(string $collegeId, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = FeeInvoice::query()
            ->where('college_id', $collegeId)
            ->with(['student.user'])
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        if (!empty($filters['student_id'])) {
            $query->where('student_id', $filters['student_id']);
        }

        return $query->paginate($perPage);
    }

    public function listInvoicesForStudent(Student $student, array $filters = [], int $perPage = 15): LengthAwarePaginator
    {
        $query = FeeInvoice::query()
            ->where('student_id', $student->id)
            ->orderByDesc('created_at');

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->paginate($perPage);
    }

    public function getInvoice(string $invoiceId): FeeInvoice
    {
        $invoice = FeeInvoice::with(['student.user', 'payments'])->find($invoiceId);

        if (!$invoice) {
            throw new ModelNotFoundException('Invoice not found');
        }

        return $invoice;
    }

    public function createInvoice(array $data): FeeInvoice
    {
        if (empty($data['invoice_number'])) {
            $data['invoice_number'] = 'INV-' . strtoupper(Str::random(8));
        }

        return FeeInvoice::create($data);
    }

    public function updateInvoice(FeeInvoice $invoice, array $data): FeeInvoice
    {
        $invoice->fill($data);
        $invoice->save();

        return $invoice->refresh();
    }

    public function deleteInvoice(FeeInvoice $invoice): void
    {
        $invoice->delete();
    }

    public function recordPayment(array $data): FeePayment
    {
        return DB::transaction(function () use ($data) {
            // Generate receipt number if not provided
            if (empty($data['receipt_number'])) {
                $data['receipt_number'] = 'RCPT-' . date('Ymd') . '-' . strtoupper(substr(uniqid(), -6));
            }

            $payment = FeePayment::create($data);
            $invoice = $payment->invoice;

            $invoice->paid_amount = $invoice->payments()->sum('amount');

            if ($invoice->paid_amount >= $invoice->total_amount) {
                $invoice->status = 'paid';
            } elseif ($invoice->paid_amount > 0) {
                $invoice->status = 'partial';
            }

            $invoice->save();

            return $payment->load('invoice');
        });
    }

    public function listPayments(string $invoiceId): Collection
    {
        return FeePayment::where('invoice_id', $invoiceId)
            ->orderByDesc('payment_date')
            ->get();
    }
}
