'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, Button } from '@bitflow/ui';
import { Send, Paperclip, Search, X, MoreVertical, Users, Archive, Pin, Volume2, VolumeX } from 'lucide-react';

interface Message {
  id: string;
  sender_id: string;
  content: string;
  type: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    avatar?: string;
  };
  attachments?: Array<{
    id: string;
    file_name: string;
    file_type: string;
    url: string;
  }>;
}

interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'announcement';
  name?: string;
  participants: Array<{
    user: {
      id: string;
      name: string;
      avatar?: string;
    };
  }>;
  latest_message?: Message;
  last_message_at: string;
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Mock data for demonstration
  useEffect(() => {
    // In real implementation, fetch from API
    setConversations([
      {
        id: '1',
        type: 'direct',
        participants: [
          { user: { id: '1', name: 'John Doe' } },
          { user: { id: '2', name: 'Jane Smith' } },
        ],
        last_message_at: new Date().toISOString(),
        latest_message: {
          id: '1',
          sender_id: '2',
          content: 'Hey, how are you?',
          type: 'text',
          created_at: new Date().toISOString(),
          sender: { id: '2', name: 'Jane Smith' },
        },
      },
    ]);
  }, []);

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConversation) return;

    // In real implementation, call API
    const newMessage: Message = {
      id: Date.now().toString(),
      sender_id: 'current-user',
      content: messageInput,
      type: 'text',
      created_at: new Date().toISOString(),
      sender: { id: 'current-user', name: 'You' },
    };

    setMessages([...messages, newMessage]);
    setMessageInput('');
  };

  const getConversationName = (conversation: Conversation) => {
    if (conversation.name) return conversation.name;
    return conversation.participants.map(p => p.user.name).join(', ');
  };

  return (
    <div className="h-screen flex overflow-hidden bg-gray-50">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900 mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map((conversation) => (
            <button
              key={conversation.id}
              onClick={() => setSelectedConversation(conversation.id)}
              className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 border-b border-gray-100 transition-colors ${
                selectedConversation === conversation.id ? 'bg-blue-50' : ''
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                  {getConversationName(conversation).charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {getConversationName(conversation)}
                  </p>
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.last_message_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                {conversation.latest_message && (
                  <p className="text-sm text-gray-600 truncate">
                    {conversation.latest_message.content}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {/* New Conversation Button */}
        <div className="p-4 border-t border-gray-200">
          <Button className="w-full">
            <Users className="h-4 w-4 mr-2" />
            New Conversation
          </Button>
        </div>
      </div>

      {/* Main Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold">
                J
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">John Doe</h2>
                <p className="text-sm text-gray-500">Active now</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Pin className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <VolumeX className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender_id === 'current-user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div
                  className={`max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === 'current-user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                  }`}
                >
                  {message.sender_id !== 'current-user' && (
                    <p className="text-xs font-semibold mb-1">{message.sender.name}</p>
                  )}
                  <p className="text-sm">{message.content}</p>
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment) => (
                        <div
                          key={attachment.id}
                          className="flex items-center space-x-2 text-xs"
                        >
                          <Paperclip className="h-3 w-3" />
                          <span>{attachment.file_name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="bg-white border-t border-gray-200 p-4">
            <div className="flex items-end space-x-2">
              <Button variant="ghost" size="sm" className="flex-shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Type a message..."
                className="flex-1 resize-none border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px] max-h-32"
                rows={1}
              />
              <Button
                onClick={sendMessage}
                disabled={!messageInput.trim()}
                className="flex-shrink-0"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
              <Users className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Select a conversation
            </h2>
            <p className="text-gray-600">
              Choose a conversation from the list or start a new one
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
