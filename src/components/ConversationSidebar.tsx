import React from 'react';
import { Conversation } from '../types';
import { X, MessageSquare, Trash2, Plus, Sparkles, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ConversationSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeConversationId: string | null;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onNewConversation: () => void;
  isDarkMode: boolean;
}

export function ConversationSidebar({ 
  isOpen, 
  onClose, 
  conversations, 
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
  onNewConversation,
  isDarkMode
}: ConversationSidebarProps) {
  
  // Format date for display
  const formatDate = (date: Date): string => {
    const now = new Date();
    const dateObj = new Date(date);
    
    // If it's today, show time
    if (dateObj.toDateString() === now.toDateString()) {
      return dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // If it's this year, show month and day
    if (dateObj.getFullYear() === now.getFullYear()) {
      return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
    
    // Otherwise show date with year
    return dateObj.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  if (!isOpen) return null;

  return (
    <aside 
      className={`fixed inset-0 z-50 md:relative md:inset-auto flex flex-col w-full md:w-80 h-full ${
        isDarkMode ? 'bg-[#0f0f15] border-r border-[#222233]' : 'bg-white border-r border-gray-200'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center justify-between p-4 border-b ${
        isDarkMode ? 'border-[#222233]' : 'border-gray-200'
      }`}>
        <h2 className="font-semibold">Skynet</h2>
        <button 
          onClick={onClose}
          className={`p-1.5 rounded-md ${
            isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-100'
          }`}
          aria-label="Close sidebar"
        >
          <X size={18} />
        </button>
      </div>

      {/* Navigation */}
      <div className={`p-3 border-b ${isDarkMode ? 'border-[#222233]' : 'border-gray-200'}`}>
        <div className="space-y-1">
          {/* Home/Chat link */}
          <Link to="/" className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors w-full ${
            isDarkMode 
              ? 'hover:bg-[#222233] text-gray-200' 
              : 'hover:bg-gray-200 text-gray-800'
          }`}>
            <MessageSquare size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            <span>Chat</span>
          </Link>
          
          {/* AI Agents link */}
          <Link to="/agents" className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors w-full ${
            isDarkMode 
              ? 'hover:bg-[#222233] text-gray-200' 
              : 'hover:bg-gray-200 text-gray-800'
          }`}>
            <Sparkles size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
            <span>AI Agents</span>
          </Link>
          
          {/* Superagents link */}
          <Link to="/superagents" className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors w-full ${
            isDarkMode 
              ? 'hover:bg-[#222233] text-gray-200' 
              : 'hover:bg-gray-200 text-gray-800'
          }`}>
            <Zap size={18} className={isDarkMode ? 'text-emerald-400' : 'text-emerald-600'} />
            <span>Superagents</span>
          </Link>
        </div>
      </div>

      {/* New Chat Button */}
      <button
        onClick={onNewConversation}
        className={`m-3 flex items-center justify-center gap-2 py-2 px-4 rounded-md ${
          isDarkMode 
            ? 'bg-[#222233] hover:bg-[#2a2a3a] text-gray-200' 
            : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
        }`}
      >
        <Plus size={16} />
        <span>New Conversation</span>
      </button>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto py-2">
        <div className={`px-3 py-2 text-xs font-medium ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          Recent Conversations
        </div>
        {conversations.length === 0 ? (
          <div className={`text-center p-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            No conversations yet
          </div>
        ) : (
          <div className="space-y-1 px-2">
            {conversations.map(conversation => (
              <div 
                key={conversation.id}
                className={`group flex items-start p-2 rounded-md cursor-pointer ${
                  activeConversationId === conversation.id
                    ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50'
                    : isDarkMode ? 'hover:bg-[#1a1a24]' : 'hover:bg-gray-100'
                }`}
                onClick={() => onSelectConversation(conversation.id)}
              >
                <MessageSquare size={16} className="mt-1 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm truncate pr-2">{conversation.title}</h3>
                    <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {formatDate(conversation.updatedAt)}
                    </span>
                  </div>
                  <p className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    {conversation.messages.length} messages
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteConversation(conversation.id);
                  }}
                  className={`p-1 rounded-md opacity-0 group-hover:opacity-100 ${
                    isDarkMode ? 'hover:bg-[#222233] text-gray-400' : 'hover:bg-gray-200 text-gray-500'
                  }`}
                  aria-label="Delete conversation"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className={`p-3 border-t ${isDarkMode ? 'border-[#222233]' : 'border-gray-200'}`}>
        <div className="text-xs text-center opacity-60">
          Conversations are stored in your browser
        </div>
      </div>
    </aside>
  );
}