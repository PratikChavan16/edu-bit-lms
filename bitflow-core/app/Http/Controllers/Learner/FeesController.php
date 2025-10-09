<?php

declare(strict_types=1);

namespace App\Http\Controllers\Learner;

use App\Models\Student;
use App\Services\FeeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

final class FeesController
{
    public function __construct(private FeeService $feeService)
    {
    }

    public function invoices(Request $request): JsonResponse
    {
        $student = $this->resolveStudent();

        if (!$student) {
            return response()->json([
                'success' => false,
                'error' => 'Student profile not found',
            ], 404);
        }

        $filters = $request->only(['status']);
        $perPage = (int) $request->query('per_page', 15);

        $invoices = $this->feeService->listInvoicesForStudent($student, $filters, $perPage);

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

    public function show(string $invoiceId): JsonResponse
    {
        $invoice = $this->feeService->getInvoice($invoiceId);

        return response()->json([
            'success' => true,
            'data' => $invoice,
        ]);
    }

    private function resolveStudent(): ?Student
    {
        $user = Auth::user();

        if (!$user) {
            return null;
        }

        return Student::with('college')->where('user_id', $user->id)->first();
    }
}
