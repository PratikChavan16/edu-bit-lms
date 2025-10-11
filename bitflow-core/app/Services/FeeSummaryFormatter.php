<?php

namespace App\Services;

use Illuminate\Support\Carbon;
use Illuminate\Support\Collection;

class FeeSummaryFormatter
{
    /**
     * Build a learner-facing fee summary payload from invoice fixtures.
     *
     * @param Collection<int, array<string, mixed>> $invoices
     * @return array<string, mixed>
     */
    public function build(Collection $invoices): array
    {
        $preparedInvoices = $invoices->map(function (array $invoice): array {
            $payments = Collection::make($invoice['payments'] ?? [])->map(function (array $payment): array {
                return [
                    'receipt_number' => $payment['receipt_number'] ?? null,
                    'amount' => (float) ($payment['amount'] ?? 0),
                    'payment_method' => $payment['payment_method'] ?? null,
                    'payment_date' => isset($payment['payment_date'])
                        ? Carbon::parse($payment['payment_date'])
                        : null,
                ];
            });

            return [
                'invoice_number' => $invoice['invoice_number'] ?? null,
                'status' => $invoice['status'] ?? null,
                'total_amount' => (float) ($invoice['total_amount'] ?? 0),
                'paid_amount' => (float) ($invoice['paid_amount'] ?? 0),
                'discount' => (float) ($invoice['discount'] ?? 0),
                'due_date' => isset($invoice['due_date']) ? Carbon::parse($invoice['due_date']) : null,
                'components' => $invoice['components'] ?? [],
                'payments' => $payments,
            ];
        });

        $payments = $preparedInvoices->flatMap(static fn (array $invoice) => $invoice['payments'])->sortByDesc(
            static fn (array $payment) => $payment['payment_date'] ?? Carbon::minValue()
        )->values();

        $latestInvoice = $preparedInvoices->sortByDesc(
            static fn (array $invoice) => $invoice['due_date'] ?? Carbon::minValue()
        )->first();

        $items = [];

        if ($latestInvoice) {
            $items[] = [
                'type' => 'INVOICE',
                'invoice' => [
                    'number' => $latestInvoice['invoice_number'],
                    'status' => $latestInvoice['status'],
                    'total_amount' => $latestInvoice['total_amount'],
                    'paid_amount' => $latestInvoice['paid_amount'],
                    'due_date' => $latestInvoice['due_date']?->toDateString(),
                    'components' => $latestInvoice['components'],
                ],
            ];
        }

        if ($payments->isNotEmpty()) {
            $items[] = [
                'type' => 'PAYMENT',
                'payments' => $payments->map(static function (array $payment): array {
                    return [
                        'receipt_number' => $payment['receipt_number'],
                        'amount' => $payment['amount'],
                        'method' => $payment['payment_method'],
                        'date' => $payment['payment_date']?->toDateString(),
                    ];
                })->all(),
            ];
        }

        $alerts = $preparedInvoices->filter(function (array $invoice): bool {
            $dueDate = $invoice['due_date'];

            if (!$dueDate instanceof Carbon) {
                return false;
            }

            $outstanding = max(0, $invoice['total_amount'] - $invoice['paid_amount']);

            return $outstanding > 0 && $dueDate->isPast();
        })->map(function (array $invoice) {
            $dueDate = $invoice['due_date'];
            $daysOverdue = $dueDate instanceof Carbon ? $dueDate->diffInDays(Carbon::now()) : 0;

            return [
                'type' => 'invoice_overdue',
                'message' => sprintf(
                    'Invoice %s is overdue by %d days.',
                    $invoice['invoice_number'],
                    $daysOverdue
                ),
                'severity' => $daysOverdue >= 7 ? 'critical' : 'warning',
                'due_date' => $dueDate?->toDateString(),
            ];
        })->values();

        if ($alerts->isNotEmpty()) {
            $items[] = [
                'type' => 'OVERDUE_ALERT',
                'alerts' => $alerts->all(),
            ];
        }

        $totalOutstanding = $preparedInvoices->sum(static function (array $invoice): float {
            return max(0, $invoice['total_amount'] - $invoice['paid_amount']);
        });

        $totalFees = $preparedInvoices->sum(static fn (array $invoice): float => $invoice['total_amount']);
        $paidAmount = $preparedInvoices->sum(static fn (array $invoice): float => $invoice['paid_amount']);

        $lastPayment = $payments->first();

        return [
            'items' => $items,
            'total_fees' => round($totalFees, 2),
            'paid_amount' => round($paidAmount, 2),
            'pending_amount' => round($totalOutstanding, 2),
            'meta' => [
                'currency' => '₹',
                'invoice_count' => $preparedInvoices->count(),
                'payment_count' => $payments->count(),
                'total_outstanding' => round($totalOutstanding, 2),
                'last_payment_at' => ($lastPayment['payment_date'] ?? null)?->toDateString(),
            ],
        ];
    }
}
