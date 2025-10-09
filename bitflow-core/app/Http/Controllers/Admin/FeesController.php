<?php

declare(strict_types=1);

namespace App\Http\Controllers\Admin;

use App\Services\FeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

final class FeesController
{
    public function __construct(private FeeService $feeService)
    {
    }

    public function structures(Request $request): JsonResponse
    {
        $college = app('tenant.college');

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $filters = $request->only(['course', 'year']);
        $perPage = (int) $request->query('per_page', 15);

        $structures = $this->feeService->listStructures($college->id, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $structures->items(),
            'meta' => [
                'current_page' => $structures->currentPage(),
                'per_page' => $structures->perPage(),
                'total' => $structures->total(),
            ],
        ]);
    }

    public function storeStructure(Request $request): JsonResponse
    {
        $college = app('tenant.college');

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $validated = $request->validate([
            'course' => ['required', 'string', 'max:120'],
            'year' => ['required', 'integer', 'min:1', 'max:6'],
            'component_name' => ['required', 'string', 'max:120'],
            'amount' => ['required', 'numeric', 'min:0'],
            'frequency' => ['required', 'string', 'max:60'],
            'effective_from' => ['required', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
        ]);

        $structure = $this->feeService->createStructure($college->id, $validated);

        return response()->json([
            'success' => true,
            'data' => $structure,
        ], 201);
    }

    public function updateStructure(Request $request, string $structureId): JsonResponse
    {
        $validated = $request->validate([
            'course' => ['sometimes', 'string', 'max:120'],
            'year' => ['sometimes', 'integer', 'min:1', 'max:6'],
            'component_name' => ['sometimes', 'string', 'max:120'],
            'amount' => ['sometimes', 'numeric', 'min:0'],
            'frequency' => ['sometimes', 'string', 'max:60'],
            'effective_from' => ['sometimes', 'date'],
            'effective_to' => ['nullable', 'date', 'after_or_equal:effective_from'],
        ]);

        $structure = $this->feeService->updateStructure($structureId, $validated);

        return response()->json([
            'success' => true,
            'data' => $structure,
        ]);
    }

    public function deleteStructure(string $structureId): JsonResponse
    {
        $this->feeService->deleteStructure($structureId);

        return response()->json([
            'success' => true,
            'message' => 'Fee structure deleted',
        ]);
    }

    public function invoices(Request $request): JsonResponse
    {
        $college = app('tenant.college');

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $filters = $request->only(['status', 'student_id']);
        $perPage = (int) $request->query('per_page', 15);

        $invoices = $this->feeService->listInvoices($college->id, $filters, $perPage);

        return response()->json([
            'success' => true,
            'data' => $invoices->items(),
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }

    public function storeInvoice(Request $request): JsonResponse
    {
        $college = app('tenant.college');

        if (!$college) {
            return response()->json([
                'success' => false,
                'error' => 'College context not found',
            ], 400);
        }

        $validated = $request->validate([
            'invoice_number' => ['nullable', 'string', 'max:60'],
            'student_id' => ['required', 'uuid', 'exists:students,id'],
            'academic_year' => ['required', 'string', 'max:60'],
            'term' => ['required', 'string', 'max:60'],
            'total_amount' => ['required', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'due_date' => ['required', 'date'],
            'status' => ['required', Rule::in(['pending', 'partial', 'paid', 'overdue', 'waived'])],
            'components' => ['nullable', 'array'],
        ]);

        $invoice = $this->feeService->createInvoice($college->id, $validated);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ], 201);
    }

    public function showInvoice(string $invoiceId): JsonResponse
    {
        $invoice = $this->feeService->getInvoice($invoiceId);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    public function updateInvoice(Request $request, string $invoiceId): JsonResponse
    {
        $validated = $request->validate([
            'academic_year' => ['sometimes', 'string', 'max:60'],
            'term' => ['sometimes', 'string', 'max:60'],
            'total_amount' => ['sometimes', 'numeric', 'min:0'],
            'paid_amount' => ['nullable', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
            'due_date' => ['nullable', 'date'],
            'status' => ['nullable', Rule::in(['pending', 'partial', 'paid', 'overdue', 'waived'])],
            'components' => ['nullable', 'array'],
        ]);

        $invoice = $this->feeService->updateInvoice($invoiceId, $validated);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    public function deleteInvoice(string $invoiceId): JsonResponse
    {
        $this->feeService->deleteInvoice($invoiceId);

        return response()->json([
            'success' => true,
            'message' => 'Invoice deleted',
        ]);
    }

    public function recordPayment(Request $request, string $invoiceId): JsonResponse
    {
        $user = $request->user();

        if (!$user) {
            return response()->json([
                'success' => false,
                'error' => 'User not authenticated',
            ], 401);
        }

        $validated = $request->validate([
            'receipt_number' => ['nullable', 'string', 'max:60'],
            'amount' => ['required', 'numeric', 'min:1'],
            'payment_method' => ['required', 'string', 'max:60'],
            'reference_number' => ['nullable', 'string', 'max:120'],
            'payment_date' => ['required', 'date'],
            'proof_url' => ['nullable', 'url'],
        ]);

        $payment = $this->feeService->recordPayment($invoiceId, array_merge($validated, [
            'recorded_by' => $user->id,
        ]));

        return response()->json([
            'success' => true,
            'data' => $payment,
        ], 201);
    }
}
