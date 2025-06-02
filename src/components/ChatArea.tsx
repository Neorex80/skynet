import React, { useEffect, useRef, useState } from 'react';
import { Message } from '../types';
import { MessageBubble } from './MessageBubble';
import { ArrowDownIcon } from '@heroicons/react/24/outline';

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
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isAtBottom, setIsAtBottom] = useState(true);

  // Check if we need to show the scroll to bottom button
  const checkScrollPosition = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    // Show button when user scrolls up more than 200px from bottom
    const atBottom = scrollHeight - scrollTop - clientHeight < 200;
    
    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom);
    
    // Auto-scroll only if we're already near the bottom or if it's explicitly enabled
    if (atBottom && autoScroll) {
      scrollToBottom(false);
    }
  };

  // Smooth scroll to bottom function
  const scrollToBottom = (forceSmooth = true) => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: forceSmooth ? 'smooth' : 'auto'
      });
      setAutoScroll(true);
      setIsAtBottom(true);
    }
  };

  // Handle manual scroll by user
  const handleScroll = () => {
    if (!containerRef.current) return;
    
    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
    const atBottom = scrollHeight - scrollTop - clientHeight < 200;
    
    setIsAtBottom(atBottom);
    setShowScrollButton(!atBottom);
    
    // If user manually scrolls up, disable auto-scroll
    if (!atBottom && autoScroll) {
      setAutoScroll(false);
    }
    
    // If user manually scrolls to bottom, enable auto-scroll
    if (atBottom && !autoScroll) {
      setAutoScroll(true);
    }
  };

  // Effect to handle scrolling when messages change
  useEffect(() => {
    if (autoScroll || isLoading) {
      setTimeout(() => {
        scrollToBottom(false);
      }, 10);
    }
    
    checkScrollPosition();
  }, [messages, isLoading]);

  // Add scroll event listener
  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('scroll', handleScroll);
      return () => container.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Add custom styles for the scroll button animation
  useEffect(() => {
    if (!document.getElementById('chat-scroll-button-style')) {
      const style = document.createElement('style');
      style.id = 'chat-scroll-button-style';
      style.textContent = `
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(3px); }
        }
        
        .scroll-button-bounce {
          animation: bounce-subtle 2s infinite ease-in-out;
        }
        
        .suggestion-card {
          transition: all 0.3s ease;
          border: 1px solid transparent;
        }
        
        .suggestion-card:hover {
          transform: translateY(-2px) scale(1.02);
        }
        
        .dark .suggestion-card:hover {
          border-color: rgba(59, 130, 246, 0.3);
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .suggestion-animate-in {
          animation: fadeIn 0.5s ease forwards;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div className="relative flex-1 overflow-hidden flex flex-col">
      <div 
        ref={containerRef}
        className={`flex-1 overflow-y-auto ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'} scrollbar-thin`}
      >
        <div className="w-full min-h-full">
          {error && (
            <div className="m-4 p-4 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-xs sm:text-sm flex items-center">
              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="flex-1">{error}</span>
              <button 
                className="ml-2 underline text-red-400 hover:text-red-300 text-xs whitespace-nowrap"
                onClick={() => console.log("Retry action")}
              >
                Try Again
              </button>
            </div>
          )}
          
          {messages.length === 0 ? (
            <div className="space-y-6 sm:space-y-8 pt-8 sm:pt-12 p-4">
              <div className="text-center space-y-2">
                <h2 className={`text-2xl sm:text-3xl font-bold ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                  Welcome to Skynet
                </h2>
                <p className={`text-sm sm:text-base ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Your next-generation AI assistant powered by advanced language models.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 max-w-3xl mx-auto px-2 sm:px-4">
                {suggestions.map((suggestion, index) => {
                  const Icon = suggestion.icon;
                  return (
                    <button
                      key={index}
                      onClick={() => onSuggestionClick(suggestion.text)}
                      className={`group text-left ${suggestion.color} p-3.5 sm:p-4 rounded-xl transition-all duration-300 
                        transform hover:-translate-y-1 suggestion-card suggestion-animate-in`}
                      style={{
                        animationDelay: `${parseInt(suggestion.delay) + 100}ms`,
                        opacity: 0, // Start with opacity 0 for animation
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="w-5 h-5 sm:w-6 sm:h-6 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm sm:text-base font-medium">
                            {suggestion.text}
                          </div>
                          <div className={`text-xs mt-1 opacity-70 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            Try this example
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              
              <div className={`text-center mt-8 text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                <p>Choose a suggestion above or type your own message to get started</p>
              </div>
            </div>
          ) : (
            <div className="pb-36">
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
            </div>
          )}
        </div>
      </div>
      
      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button 
          onClick={() => scrollToBottom()}
          className={`absolute bottom-24 right-4 p-2 rounded-full shadow-lg z-10 
            scroll-button-bounce ${
            isDarkMode 
              ? 'bg-[#1a1a24] text-gray-300 hover:bg-[#222233] border border-[#222233]' 
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
          aria-label="Scroll to bottom"
        >
          <ArrowDownIcon className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}