<?php

declare(strict_types=1);

namespace Tests\Feature\Contracts;

use App\Services\FeeSummaryFormatter;
use Illuminate\Support\Collection;
use Tests\TestCase;

final class FeeManagementContractTest extends TestCase
{
    private FeeSummaryFormatter $formatter;

    protected function setUp(): void
    {
        parent::setUp();
        $this->formatter = new FeeSummaryFormatter();
    }

    public function test_summary_items_follow_contract_order(): void
    {
        $summary = $this->formatter->build(Collection::make([$this->invoiceFixture()]));

        $this->assertSame('INVOICE', $summary['items'][0]['type']);
        $this->assertSame('PAYMENT', $summary['items'][1]['type']);
        $this->assertSame('OVERDUE_ALERT', $summary['items'][2]['type']);
    }

    public function test_meta_section_includes_totals_and_currency(): void
    {
        $summary = $this->formatter->build(Collection::make([$this->invoiceFixture()]));

        $this->assertSame('₹', $summary['meta']['currency']);
        $this->assertGreaterThan(0, $summary['meta']['total_outstanding']);
        $this->assertSame(1, $summary['meta']['invoice_count']);
        $this->assertSame(1, $summary['meta']['payment_count']);
    }

    /**
     * @return array<string, mixed>
     */
    private function invoiceFixture(): array
    {
        return [
            'invoice_number' => 'INV-2024-0001',
            'status' => 'partial',
            'total_amount' => 90000,
            'paid_amount' => 45000,
            'discount' => 5000,
            'due_date' => '2023-10-01',
            'components' => [
                ['name' => 'Tuition Fee', 'amount' => 85000],
                ['name' => 'Lab Fee', 'amount' => 10000],
            ],
            'payments' => [
                [
                    'receipt_number' => 'RCPT-2024-0001',
                    'amount' => 45000,
                    'payment_method' => 'bank_transfer',
                    'payment_date' => '2023-09-15',
                ],
            ],
        ];
    }
}
