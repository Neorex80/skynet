import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';

interface ChatAreaProps {
  messages: Message[];
  error: string | null;
  isLoading: boolean;
  suggestions: {
    text: string;
    icon: React.ElementType;
    color: string;
    delay: string;
  }[];
  onSuggestionClick: (suggestion: string) => void;
  onRegenerate?: () => void;
  isDarkMode: boolean;
}

export function ChatArea({ 
  messages, 
  error, 
  isLoading, 
  suggestions, 
  onSuggestionClick, 
  onRegenerate, 
  isDarkMode 
}: ChatAreaProps) {
  // Reference for the chat container
  const containerRef = useRef<HTMLDivElement>(null);

  // Effect to ensure auto-scrolling on new messages
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col">
      <div 
        ref={containerRef}
        className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}
      >
        <div className="w-full min-h-full">
          {error && (
            <div className="m-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs sm:text-sm">
              {error}
              <button 
                className="ml-2 underline text-red-400 hover:text-red-300"
                onClick={() => console.log("Retry action")}
              >
                Retry
              </button>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="space-y-6 sm:space-y-8 pt-8 sm:pt-12 p-4">
              <div className="text-center space-y-2">
                <h2 className={`text-lg sm:text-xl font-semibold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  How can I help you today?
                </h2>
                <p className={`text-xs sm:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Choose a suggestion below or ask me anything!
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-3 max-w-2xl mx-auto px-2 sm:px-4">
                {suggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onSuggestionClick(suggestion.text)}
                      className={`group text-left ${suggestion.color} p-3 sm:p-4 rounded-xl transition-all duration-300 hover:translate-x-1 animate-fade-in`}
                      style={{
                        animationDelay: `${suggestion.delay}ms`
                      }}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
                        <span className="text-xs sm:text-sm font-medium">
                          {suggestion.text}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="pb-24">
              {messages.map((message) => (
                <MessageBubble 
                  key={message.id} 
                  message={message} 
                  isDarkMode={isDarkMode} 
                  onRegenerate={
                    message.role === 'assistant' && 
                    message === messages[messages.length - 1] && 
                    !isLoading ? 
                    onRegenerate : undefined
                  } 
                />
              ))}
              <div className="h-24" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}