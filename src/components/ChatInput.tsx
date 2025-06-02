import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon as Send } from '@heroicons/react/24/solid';
import { StopCircle, Sparkles, Image, Paperclip, Mic } from 'lucide-react';

interface ChatInputProps {
  onSend: (message: string) => void;
  onStop?: () => void;
  disabled?: boolean;
  isGenerating?: boolean;
  isDarkMode: boolean;
}

export function ChatInput({ 
  onSend, 
  onStop, 
  disabled, 
  isGenerating,
  isDarkMode
}: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showPlaceholder, setShowPlaceholder] = useState(true);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    
    textarea.style.height = 'auto';
    const scrollHeight = textarea.scrollHeight;
    // Adjust max height for mobile
    const maxHeight = window.innerWidth < 640 ? 120 : 160;
    const newHeight = Math.min(Math.max(scrollHeight, 44), maxHeight);
    textarea.style.height = `${newHeight}px`;
  };

  useEffect(() => {
    adjustTextareaHeight();
    setShowPlaceholder(!input);
  }, [input]);

  // Adjust textarea height on window resize
  useEffect(() => {
    const handleResize = () => adjustTextareaHeight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  // CSS for blinking cursor placeholder
  useEffect(() => {
    if (!document.getElementById('chat-input-cursor-style')) {
      const style = document.createElement('style');
      style.id = 'chat-input-cursor-style';
      style.textContent = `
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
        .cursor-placeholder::after {
          content: '|';
          margin-left: 2px;
          animation: blink 1s infinite;
        }
        
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        
        .input-focus-ring {
          background: linear-gradient(90deg, 
            rgba(59, 130, 246, 0.5) 0%, 
            rgba(139, 92, 246, 0.5) 50%, 
            rgba(59, 130, 246, 0.5) 100%);
          background-size: 200% 100%;
          animation: gradient-shift 3s ease infinite;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .input-focus-ring.visible {
          opacity: 1;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Enhanced interactive placeholder */}
      {showPlaceholder && !isFocused && (
        <div className={`absolute left-4 top-1/2 -translate-y-1/2 flex items-center pointer-events-none ${
          isDarkMode ? 'text-gray-500' : 'text-gray-500'
        }`}>
          <span className="text-sm mr-1">What's on your mind?</span>
          {!isGenerating && <span className={`text-sm cursor-placeholder`}></span>}
        </div>
      )}
      
      {/* Focus ring effect (visible when focused or hovered) */}
      <div className={`absolute -inset-0.5 rounded-xl blur-md z-0 input-focus-ring ${
        (isFocused || isHovered) ? 'visible' : ''
      }`}></div>
      
      <div className={`relative z-10 flex items-center bg-transparent`}>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder=""
          disabled={disabled}
          className={`w-full resize-none rounded-xl py-3 pl-3 sm:pl-4 pr-14 sm:pr-24 text-sm md:text-base shadow-md transition-all duration-200 ${
            isDarkMode
              ? 'bg-gray-800/95 text-gray-100 border-gray-700/50 focus:bg-gray-800'
              : 'bg-white/95 text-gray-800 border-gray-200/50 focus:bg-white'
          } disabled:opacity-60 disabled:cursor-not-allowed border focus:outline-none`}
          style={{ 
            minHeight: '44px',
            maxHeight: window.innerWidth < 640 ? '120px' : '160px',
            height: 'auto',
            scrollbarWidth: 'thin',
          }}
        />

        {/* Enhanced button area with potential for additional buttons */}
        <div className="absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 sm:gap-2">
          {/* Optional feature buttons - can be enabled later */}
          {isGenerating ? (
            <button
              onClick={onStop}
              className={`p-1.5 rounded-lg transition-all duration-200 ${
                isDarkMode
                  ? 'bg-red-600/90 hover:bg-red-700 text-white'
                  : 'bg-red-600/90 hover:bg-red-700 text-white'
              }`}
              aria-label="Stop generating"
              title="Stop generating"
            >
              <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          ) : (
            /* Main send button */
            <button
              onClick={handleSend}
              disabled={isGenerating ? false : !input.trim()}
              className={`p-1.5 sm:p-2 rounded-lg transition-all duration-200 ${
                !input.trim()
                  ? isDarkMode
                    ? 'bg-gray-700/90 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
              } ${isHovered && input.trim() ? 'scale-105' : ''}`}
              aria-label="Send message"
            >
              <Send className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
                isHovered && input.trim() ? 'rotate-45 translate-x-px -translate-y-px' : ''
              }`} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}