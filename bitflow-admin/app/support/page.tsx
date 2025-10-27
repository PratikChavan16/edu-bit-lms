'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/toast';
import { ArrowLeft, Search, MessageSquare, X, Send } from 'lucide-react';
import type { ApiResponse } from '@/types';

interface TicketMessage {
  id: string;
  ticketId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

interface SupportTicket {
  id: string;
  universityId: string;
  universityName: string;
  subject: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdBy: string;
  assignedTo: string | null;
  createdAt: string;
  updatedAt: string;
  messages: TicketMessage[];
}

export default function SupportTicketsPage() {
  const router = useRouter();
  const toast = useToast();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [perPage] = useState(20);
  const [total, setTotal] = useState(0);
  
  // Stats
  const [stats, setStats] = useState({
    open: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
  });
  
  // Modal state
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, [currentPage, statusFilter, priorityFilter, search]);

  const fetchTickets = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        per_page: perPage.toString(),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(priorityFilter !== 'all' && { priority: priorityFilter }),
        ...(search && { search }),
      });

      const response = await apiClient.get<ApiResponse<{ tickets: SupportTicket[]; stats: any; meta: any }>>(
        `/admin/support?${params}`
      );

      if (response.data) {
        setTickets(response.data.tickets);
        if (response.data.stats) {
          setStats(response.data.stats);
        }
        const meta = response.data.meta;
        setTotalPages(meta.last_page || 1);
        setTotal(meta.total || 0);
      }
    } catch (err: any) {
      console.error('Failed to fetch support tickets:', err);
      setError(err.message || 'Failed to load support tickets');
      toast.error('Failed to load support tickets');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTicketDetails = async (ticketId: string) => {
    try {
      const response = await apiClient.get<ApiResponse<SupportTicket>>(`/admin/support/${ticketId}`);
      if (response.data) {
        setSelectedTicket(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch ticket details:', err);
      toast.error('Failed to load ticket details');
    }
  };

  const handleSendReply = async () => {
    if (!selectedTicket || !replyMessage.trim()) return;
    
    setIsSendingReply(true);
    try {
      await apiClient.post(`/admin/support/${selectedTicket.id}/reply`, {
        message: replyMessage,
      });
      
      toast.success('Reply sent successfully');
      setReplyMessage('');
      
      // Refresh ticket details
      await fetchTicketDetails(selectedTicket.id);
      await fetchTickets();
    } catch (err) {
      console.error('Failed to send reply:', err);
      toast.error('Failed to send reply');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: string) => {
    try {
      await apiClient.patch(`/admin/support/${ticketId}`, {
        status: newStatus,
      });
      
      toast.success('Ticket status updated');
      fetchTickets();
      
      if (selectedTicket && selectedTicket.id === ticketId) {
        setSelectedTicket({ ...selectedTicket, status: newStatus as any });
      }
    } catch (err) {
      console.error('Failed to update ticket status:', err);
      toast.error('Failed to update ticket status');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPriorityBadge = (priority: string) => {
    const config: Record<string, { variant: 'success' | 'warning' | 'danger' | 'info'; emoji: string }> = {
      low: { variant: 'success', emoji: '🟢' },
      medium: { variant: 'warning', emoji: '🟡' },
      high: { variant: 'danger', emoji: '🔴' },
      urgent: { variant: 'danger', emoji: '🚨' },
    };
    const { variant, emoji } = config[priority] || config.low;
    return (
      <Badge variant={variant}>
        {emoji} {priority.toUpperCase()}
      </Badge>
    );
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
      open: 'info',
      in_progress: 'warning',
      resolved: 'success',
      closed: 'info',
    };
    return <Badge variant={variants[status] || 'info'}>{status.replace('_', ' ').toUpperCase()}</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => router.push('/dashboard')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Support Tickets</h1>
          <p className="text-gray-600">Manage university support requests</p>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-sm text-gray-600">Open</div>
          <div className="text-2xl font-bold text-blue-600">{stats.open}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">In Progress</div>
          <div className="text-2xl font-bold text-yellow-600">{stats.inProgress}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Resolved</div>
          <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        </Card>
        <Card className="p-4">
          <div className="text-sm text-gray-600">Closed</div>
          <div className="text-2xl font-bold text-gray-600">{stats.closed}</div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search tickets..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-4 py-2 border rounded-lg"
          >
            <option value="all">All Priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>
      </Card>

      {/* Results Count */}
      <div className="text-sm text-gray-600">
        Showing {tickets.length} of {total} tickets
      </div>

      {/* Tickets Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">University</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                    <p className="mt-2 text-gray-500">Loading support tickets...</p>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center">
                    <p className="text-red-600 mb-4">{error}</p>
                    <Button onClick={fetchTickets} variant="outline">
                      Retry
                    </Button>
                  </td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                    <MessageSquare className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                    <p>No support tickets found</p>
                  </td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm">
                      #{ticket.id.slice(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ticket.universityName}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium">{ticket.subject}</div>
                      <div className="text-sm text-gray-500 truncate max-w-md">
                        {ticket.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(ticket.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(ticket.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => fetchTicketDetails(ticket.id)}
                      >
                        <MessageSquare className="w-3 h-3 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && tickets.length > 0 && (
          <div className="px-6 py-4 border-t flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-bold">{selectedTicket.subject}</h2>
                  <p className="text-sm text-gray-500 mt-1">{selectedTicket.universityName}</p>
                </div>
                <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="flex gap-2 mt-4">
                {getPriorityBadge(selectedTicket.priority)}
                {getStatusBadge(selectedTicket.status)}
              </div>
            </div>

            <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
              {/* Original Message */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">
                  {selectedTicket.createdBy} • {formatDate(selectedTicket.createdAt)}
                </div>
                <p className="text-gray-900">{selectedTicket.description}</p>
              </div>

              {/* Message Thread */}
              {selectedTicket.messages.map((message) => (
                <div key={message.id} className="bg-blue-50 p-4 rounded-lg">
                  <div className="text-sm font-medium text-blue-700 mb-2">
                    {message.userName} • {formatDate(message.createdAt)}
                  </div>
                  <p className="text-gray-900">{message.message}</p>
                </div>
              ))}
            </div>

            {/* Reply Section */}
            <div className="p-6 border-t">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Change Status
                </label>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg"
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reply to Ticket
                </label>
                <textarea
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  placeholder="Type your reply..."
                  className="w-full px-4 py-2 border rounded-lg resize-none"
                  rows={4}
                />
                <div className="mt-4 flex justify-end">
                  <Button
                    onClick={handleSendReply}
                    disabled={isSendingReply || !replyMessage.trim()}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {isSendingReply ? 'Sending...' : 'Send Reply'}
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
