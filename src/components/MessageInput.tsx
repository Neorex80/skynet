import React, { useState, KeyboardEvent, useEffect, useRef } from 'react';
import { Send } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled: boolean;
  isDarkMode?: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled, isDarkMode = false }) => {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (input.trim() && !disabled) {
      onSendMessage(input);
      setInput('');
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Auto-resize textarea as user types
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const adjustHeight = () => {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    };

    textarea.addEventListener('input', adjustHeight);
    return () => textarea.removeEventListener('input', adjustHeight);
  }, []);

  return (
    <div className="flex items-end gap-2 max-w-3xl mx-auto">
      <textarea
        ref={textareaRef}
        className={`flex-1 rounded-lg p-3 resize-none min-h-[52px] max-h-[200px] focus:outline-none focus:ring-2 ${
          isDarkMode 
            ? 'bg-[#1a1a24] border-[#222233] text-gray-200 placeholder-gray-500 focus:ring-blue-700' 
            : 'bg-white border-gray-300 text-gray-800 placeholder-gray-400 focus:ring-blue-500'
        } border`}
        placeholder="Type a message..."
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        style={{ scrollbarWidth: 'thin' }}
      />
      <button
        className={`p-3 rounded-full flex-shrink-0 ${
          disabled || !input.trim()
            ? isDarkMode 
              ? 'bg-[#222233] text-gray-500 cursor-not-allowed' 
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : isDarkMode
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
        onClick={handleSend}
        disabled={disabled || !input.trim()}
      >
        <Send size={20} />
      </button>
    </div>
  );
};

export default MessageInput;