import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon as Send } from '@heroicons/react/24/solid';
import { StopCircle } from 'lucide-react';

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

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="What's on your mind? 💭"
        disabled={disabled}
        className={`w-full resize-none rounded-xl py-3 pl-3 sm:pl-4 pr-10 sm:pr-14 text-sm md:text-base shadow-md transition-all duration-200 ${
          isDarkMode
            ? 'bg-gray-800/80 text-gray-100 placeholder-gray-400 border-gray-700/50 hover:bg-gray-800 focus:bg-gray-800'
            : 'bg-white/90 text-gray-800 placeholder-gray-500 border-gray-200/50 hover:bg-white focus:bg-white'
        } disabled:opacity-60 disabled:cursor-not-allowed border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
        style={{ 
          minHeight: '44px',
          maxHeight: window.innerWidth < 640 ? '120px' : '160px',
          height: 'auto',
          scrollbarWidth: 'thin',
        }}
      />

      {/* Button */}
      <button
        onClick={isGenerating ? onStop : handleSend}
        disabled={isGenerating ? false : (disabled || !input.trim())}
        className={`absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-lg transition-all duration-200 group-hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-700 text-white'
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        } ${isGenerating ? 'animate-pulse' : ''}`}
        aria-label={isGenerating ? "Stop generating" : "Send message"}
      >
        {isGenerating ? (
          <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        ) : (
          <Send className={`w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 ${
            isHovered && !disabled && input.trim() ? 'rotate-45' : ''
          }`} />
        )}
      </button>

      {/* Subtle glow effect */}
      <div 
        className={`absolute inset-0 -z-10 rounded-xl transition-opacity duration-300 ${
          isFocused || isHovered
            ? 'opacity-100 bg-blue-500/10 blur-xl'
            : 'opacity-0'
        }`}
      />
    </div>
  );
}