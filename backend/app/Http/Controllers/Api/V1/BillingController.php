<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\University;
use App\Models\Subscription;
use App\Models\Invoice;
use Carbon\Carbon;

class BillingController extends Controller
{
    /**
     * Get comprehensive billing data
     */
    public function index(): JsonResponse
    {
        // Calculate revenue metrics
        $mrr = $this->calculateMRR();
        $arr = $mrr * 12;
        $churnRate = $this->calculateChurnRate();
        $mrrTrend = $this->getMRRTrend(12);

        // Get subscription status counts
        $subscriptionStatus = [
            'active' => Subscription::where('status', 'active')->count(),
            'pastDue' => Subscription::where('status', 'past_due')->count(),
            'canceled' => Subscription::where('status', 'canceled')->count(),
            'trial' => Subscription::where('status', 'trial')->count(),
        ];

        // Get all subscriptions with university data
        $subscriptions = Subscription::with('university:id,name')
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(function ($subscription) {
                return [
                    'id' => $subscription->id,
                    'university' => [
                        'id' => $subscription->university->id,
                        'name' => $subscription->university->name,
                    ],
                    'plan' => $subscription->plan,
                    'status' => $subscription->status,
                    'mrr' => $subscription->mrr,
                    'nextBillingDate' => $subscription->next_billing_date?->toISOString(),
                    'created_at' => $subscription->created_at->toISOString(),
                ];
            });

        // Get recent invoices
        $recentInvoices = Invoice::with('university:id,name')
            ->orderBy('created_at', 'desc')
            ->limit(10)
            ->get()
            ->map(function ($invoice) {
                return [
                    'id' => $invoice->id,
                    'university' => [
                        'id' => $invoice->university->id,
                        'name' => $invoice->university->name,
                    ],
                    'amount' => $invoice->amount,
                    'status' => $invoice->status,
                    'dueDate' => $invoice->due_date?->toISOString(),
                    'paidAt' => $invoice->paid_at?->toISOString(),
                    'created_at' => $invoice->created_at->toISOString(),
                ];
            });

        return response()->json([
            'revenue' => [
                'mrr' => $mrr,
                'arr' => $arr,
                'churnRate' => $churnRate,
                'mrrTrend' => $mrrTrend,
            ],
            'subscriptionStatus' => $subscriptionStatus,
            'subscriptions' => $subscriptions,
            'recentInvoices' => $recentInvoices,
        ]);
    }

    /**
     * Get all invoices with pagination and filters
     * 
     * GET /api/admin/billing/invoices
     */
    public function invoices(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $status = $request->input('status');
        $search = $request->input('search');
        $days = $request->input('days');

        $query = Invoice::with('university:id,name')
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Filter by search (university name or invoice number)
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                  ->orWhereHas('university', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Filter by date range
        if ($days && $days !== 'all') {
            $query->where('created_at', '>=', now()->subDays((int)$days));
        }

        $invoices = $query->paginate($perPage);

        $transformedData = $invoices->getCollection()->map(function ($invoice) {
            return [
                'id' => $invoice->id,
                'invoiceNumber' => $invoice->invoice_number,
                'universityId' => $invoice->university->id,
                'universityName' => $invoice->university->name,
                'amount' => $invoice->amount,
                'status' => $invoice->status,
                'dueDate' => $invoice->due_date?->toISOString(),
                'paidAt' => $invoice->paid_at?->toISOString(),
                'createdAt' => $invoice->created_at->toISOString(),
                'items' => $invoice->items ?? [],
            ];
        });

        return response()->json([
            'data' => $transformedData,
            'meta' => [
                'current_page' => $invoices->currentPage(),
                'last_page' => $invoices->lastPage(),
                'per_page' => $invoices->perPage(),
                'total' => $invoices->total(),
            ],
        ]);
    }

    /**
     * Download invoice as PDF
     */
    public function downloadInvoice(string $id): JsonResponse
    {
        $invoice = Invoice::with('university')->findOrFail($id);

        // TODO: Generate actual PDF
        // For now, return invoice data
        return response()->json([
            'message' => 'PDF generation not yet implemented',
            'invoice' => [
                'id' => $invoice->id,
                'university' => $invoice->university->name,
                'amount' => $invoice->amount,
                'status' => $invoice->status,
            ],
        ]);
    }

    /**
     * Retry failed payment
     */
    public function retryPayment(string $id): JsonResponse
    {
        $invoice = Invoice::findOrFail($id);

        if ($invoice->status !== 'failed') {
            return response()->json([
                'success' => false,
                'message' => 'Only failed invoices can be retried',
            ], 400);
        }

        // TODO: Implement actual payment retry logic with Stripe
        // For now, just update status
        $invoice->status = 'pending';
        $invoice->save();

        return response()->json([
            'success' => true,
            'message' => 'Payment retry initiated successfully',
        ]);
    }

    /**
     * Get all subscriptions with pagination and filters
     * 
     * GET /api/admin/billing/subscriptions
     */
    public function subscriptions(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $status = $request->input('status');
        $plan = $request->input('plan');
        $search = $request->input('search');

        $query = Subscription::with('university:id,name')
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Filter by plan
        if ($plan && $plan !== 'all') {
            $query->where('plan', $plan);
        }

        // Filter by search (university name)
        if ($search) {
            $query->whereHas('university', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%");
            });
        }

        $subscriptions = $query->paginate($perPage);

        // Calculate stats
        $stats = [
            'active' => Subscription::where('status', 'active')->count(),
            'pastDue' => Subscription::where('status', 'past_due')->count(),
            'canceled' => Subscription::where('status', 'canceled')->count(),
            'trialing' => Subscription::where('status', 'trial')->count(),
        ];

        $transformedData = $subscriptions->getCollection()->map(function ($subscription) {
            return [
                'id' => $subscription->id,
                'universityId' => $subscription->university->id,
                'universityName' => $subscription->university->name,
                'plan' => $subscription->plan,
                'status' => $subscription->status,
                'mrr' => $subscription->mrr,
                'nextBillingDate' => $subscription->next_billing_date?->toISOString(),
                'currentPeriodStart' => $subscription->current_period_start?->toISOString(),
                'currentPeriodEnd' => $subscription->current_period_end?->toISOString(),
                'canceledAt' => $subscription->canceled_at?->toISOString(),
                'createdAt' => $subscription->created_at->toISOString(),
            ];
        });

        return response()->json([
            'subscriptions' => $transformedData,
            'stats' => $stats,
            'meta' => [
                'current_page' => $subscriptions->currentPage(),
                'last_page' => $subscriptions->lastPage(),
                'per_page' => $subscriptions->perPage(),
                'total' => $subscriptions->total(),
            ],
        ]);
    }

    /**
     * Update subscription (cancel or upgrade)
     * 
     * PATCH /api/admin/billing/subscriptions/{id}
     */
    public function updateSubscription(Request $request, string $id): JsonResponse
    {
        $subscription = Subscription::findOrFail($id);
        $action = $request->input('action');

        switch ($action) {
            case 'cancel':
                $subscription->status = 'canceled';
                $subscription->canceled_at = now();
                $subscription->save();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Subscription canceled successfully',
                ]);

            case 'upgrade':
                $newPlan = $request->input('plan');
                $subscription->plan = $newPlan;
                
                // Update MRR based on plan
                $planPricing = [
                    'trial' => 0,
                    'basic' => 500,
                    'pro' => 1000,
                    'enterprise' => 2500,
                ];
                $subscription->mrr = $planPricing[$newPlan] ?? $subscription->mrr;
                $subscription->save();
                
                return response()->json([
                    'success' => true,
                    'message' => 'Subscription upgraded successfully',
                ]);

            default:
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid action',
                ], 400);
        }
    }

    /**
     * Export invoices as CSV
     * 
     * GET /api/admin/billing/invoices/export
     */
    public function exportInvoices(): Response
    {
        $invoices = Invoice::with('university:id,name')->get();

        $csvData = "Invoice Number,University,Amount,Status,Due Date,Paid At,Created At\n";
        
        foreach ($invoices as $invoice) {
            $csvData .= sprintf(
                "%s,%s,%s,%s,%s,%s,%s\n",
                $invoice->invoice_number,
                $invoice->university->name,
                $invoice->amount,
                $invoice->status,
                $invoice->due_date?->toDateString() ?? 'N/A',
                $invoice->paid_at?->toDateString() ?? 'N/A',
                $invoice->created_at->toDateString()
            );
        }

        return response($csvData, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="invoices-export.csv"',
        ]);
    }

    /**
     * Calculate Monthly Recurring Revenue
     */
    private function calculateMRR(): float
    {
        return Subscription::where('status', 'active')
            ->sum('mrr');
    }

    /**
     * Calculate churn rate (last 30 days)
     */
    private function calculateChurnRate(): float
    {
        $totalActive = Subscription::where('status', 'active')->count();
        $canceled = Subscription::where('status', 'canceled')
            ->where('updated_at', '>=', now()->subDays(30))
            ->count();

        if ($totalActive === 0) {
            return 0;
        }

        return round(($canceled / $totalActive) * 100, 2);
    }

    /**
     * Get MRR trend for last N months
     */
    private function getMRRTrend(int $months): array
    {
        $trend = [];
        
        for ($i = $months - 1; $i >= 0; $i--) {
            $date = now()->subMonths($i);
            
            // Calculate MRR for that month
            $mrr = Subscription::where('status', 'active')
                ->where('created_at', '<=', $date->endOfMonth())
                ->sum('mrr');
            
            $trend[] = [
                'date' => $date->format('Y-m'),
                'value' => $mrr,
            ];
        }

        return $trend;
    }
}
