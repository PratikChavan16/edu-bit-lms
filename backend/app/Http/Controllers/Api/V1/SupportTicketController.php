<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\SupportTicket;
use App\Models\TicketMessage;

class SupportTicketController extends Controller
{
    /**
     * Get support tickets with pagination and filters
     * 
     * GET /api/admin/support
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = $request->input('per_page', 20);
        $status = $request->input('status');
        $priority = $request->input('priority');
        $search = $request->input('search');

        $query = SupportTicket::with('university:id,name')
            ->orderBy('created_at', 'desc');

        // Filter by status
        if ($status && $status !== 'all') {
            $query->where('status', $status);
        }

        // Filter by priority
        if ($priority && $priority !== 'all') {
            $query->where('priority', $priority);
        }

        // Filter by search (subject or university)
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('subject', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhereHas('university', function ($subQ) use ($search) {
                      $subQ->where('name', 'like', "%{$search}%");
                  });
            });
        }

        $tickets = $query->paginate($perPage);

        // Calculate stats
        $stats = [
            'open' => SupportTicket::where('status', 'open')->count(),
            'inProgress' => SupportTicket::where('status', 'in_progress')->count(),
            'resolved' => SupportTicket::where('status', 'resolved')->count(),
            'closed' => SupportTicket::where('status', 'closed')->count(),
        ];

        $transformedData = $tickets->getCollection()->map(function ($ticket) {
            return [
                'id' => $ticket->id,
                'universityId' => $ticket->university->id,
                'universityName' => $ticket->university->name,
                'subject' => $ticket->subject,
                'description' => $ticket->description,
                'priority' => $ticket->priority,
                'status' => $ticket->status,
                'createdBy' => $ticket->created_by,
                'assignedTo' => $ticket->assigned_to,
                'createdAt' => $ticket->created_at->toISOString(),
                'updatedAt' => $ticket->updated_at->toISOString(),
            ];
        });

        return response()->json([
            'tickets' => $transformedData,
            'stats' => $stats,
            'meta' => [
                'current_page' => $tickets->currentPage(),
                'last_page' => $tickets->lastPage(),
                'per_page' => $tickets->perPage(),
                'total' => $tickets->total(),
            ],
        ]);
    }

    /**
     * Get ticket details with messages
     * 
     * GET /api/admin/support/{id}
     */
    public function show(string $id): JsonResponse
    {
        $ticket = SupportTicket::with([
            'university:id,name',
            'messages' => function ($query) {
                $query->orderBy('created_at', 'asc');
            },
        ])->findOrFail($id);

        return response()->json([
            'id' => $ticket->id,
            'universityId' => $ticket->university->id,
            'universityName' => $ticket->university->name,
            'subject' => $ticket->subject,
            'description' => $ticket->description,
            'priority' => $ticket->priority,
            'status' => $ticket->status,
            'createdBy' => $ticket->created_by,
            'assignedTo' => $ticket->assigned_to,
            'createdAt' => $ticket->created_at->toISOString(),
            'updatedAt' => $ticket->updated_at->toISOString(),
            'messages' => $ticket->messages->map(function ($message) {
                return [
                    'id' => $message->id,
                    'ticketId' => $message->ticket_id,
                    'userId' => $message->user_id,
                    'userName' => $message->user_name,
                    'message' => $message->message,
                    'createdAt' => $message->created_at->toISOString(),
                ];
            }),
        ]);
    }

    /**
     * Reply to a ticket
     * 
     * POST /api/admin/support/{id}/reply
     */
    public function reply(Request $request, string $id): JsonResponse
    {
        $ticket = SupportTicket::findOrFail($id);

        $validated = $request->validate([
            'message' => 'required|string',
        ]);

        $message = TicketMessage::create([
            'ticket_id' => $ticket->id,
            'user_id' => auth()->id(),
            'user_name' => auth()->user()->name ?? 'Admin',
            'message' => $validated['message'],
        ]);

        // Update ticket's updated_at timestamp
        $ticket->touch();

        return response()->json([
            'success' => true,
            'message' => 'Reply sent successfully',
            'ticketMessage' => [
                'id' => $message->id,
                'message' => $message->message,
                'createdAt' => $message->created_at->toISOString(),
            ],
        ], 201);
    }

    /**
     * Update ticket status
     * 
     * PATCH /api/admin/support/{id}
     */
    public function update(Request $request, string $id): JsonResponse
    {
        $ticket = SupportTicket::findOrFail($id);

        $validated = $request->validate([
            'status' => 'required|in:open,in_progress,resolved,closed',
        ]);

        $ticket->status = $validated['status'];
        $ticket->save();

        return response()->json([
            'success' => true,
            'message' => 'Ticket status updated successfully',
            'ticket' => [
                'id' => $ticket->id,
                'status' => $ticket->status,
                'updatedAt' => $ticket->updated_at->toISOString(),
            ],
        ]);
    }

    /**
     * Create a new support ticket (if needed)
     * 
     * POST /api/admin/support
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'university_id' => 'required|exists:universities,id',
            'subject' => 'required|string|max:255',
            'description' => 'required|string',
            'priority' => 'required|in:low,medium,high,urgent',
        ]);

        $ticket = SupportTicket::create([
            'university_id' => $validated['university_id'],
            'subject' => $validated['subject'],
            'description' => $validated['description'],
            'priority' => $validated['priority'],
            'status' => 'open',
            'created_by' => auth()->user()->name ?? 'Admin',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Support ticket created successfully',
            'ticket' => [
                'id' => $ticket->id,
                'subject' => $ticket->subject,
                'status' => $ticket->status,
            ],
        ], 201);
    }
}
