import React from 'react';
import { Code, Database, GitBranch, MessageSquare, ChevronDown, Settings, Smile, Send } from 'lucide-react';
import ZevLogo from './SkynetLogo';

interface ChatInterfacePreviewProps {
  isDarkMode: boolean;
}

const ChatInterfacePreview: React.FC<ChatInterfacePreviewProps> = ({ isDarkMode }) => {
  return (
    <div className={`w-full max-w-3xl mx-auto rounded-xl overflow-hidden shadow-2xl border ${
      isDarkMode ? 'bg-[#0f0f15] border-[#222233]' : 'bg-white border-gray-200'
    }`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 ${
        isDarkMode ? 'border-b border-[#222233]' : 'border-b border-gray-200'
      }`}>
        <div className="flex items-center">
          <div className="flex items-center">
            <ZevLogo size={24} variant={isDarkMode ? 'dark' : 'light'} className="mr-2" />
            <span className="font-medium text-sm">Zev</span>
          </div>
          
          <div className={`ml-3 flex items-center text-xs px-2 py-1 rounded ${
            isDarkMode ? 'bg-[#1a1a24] text-blue-400' : 'bg-blue-50 text-blue-700'
          }`}>
            <span>Llama 3.3 70B</span>
            <ChevronDown size={12} className="ml-1" />
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button className={`p-1.5 rounded-md ${
            isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-100'
          }`}>
            <Settings size={16} />
          </button>
          <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
            U
          </div>
        </div>
      </div>
      
      {/* Chat Content */}
      <div className={`p-4 ${
        isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'
      }`} style={{ minHeight: '320px' }}>
        {/* Welcome message */}
        <div className="text-center mb-4 py-4">
          <h2 className={`text-xl font-semibold ${
            isDarkMode ? 'text-gray-200' : 'text-gray-800'
          }`}>How can I help you today?</h2>
          <p className={`text-xs ${
            isDarkMode ? 'text-gray-400' : 'text-gray-600'
          }`}>Choose a suggestion below or ask me anything!</p>
        </div>
        
        {/* Suggestion cards */}
        <div className="grid grid-cols-2 gap-2 max-w-xl mx-auto">
          <button className={`group text-left p-3 rounded-lg flex items-center gap-2 ${
            isDarkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-50 text-blue-700'
          }`}>
            <Code size={14} />
            <span className="text-xs">Explain React component lifecycle</span>
          </button>
          <button className={`group text-left p-3 rounded-lg flex items-center gap-2 ${
            isDarkMode ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-50 text-purple-700'
          }`}>
            <GitBranch size={14} />
            <span className="text-xs">How do I set up a CI/CD pipeline?</span>
          </button>
          <button className={`group text-left p-3 rounded-lg flex items-center gap-2 ${
            isDarkMode ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-50 text-amber-700'
          }`}>
            <MessageSquare size={14} />
            <span className="text-xs">Write a function to find prime numbers</span>
          </button>
          <button className={`group text-left p-3 rounded-lg flex items-center gap-2 ${
            isDarkMode ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
          }`}>
            <Database size={14} />
            <span className="text-xs">Compare NoSQL vs SQL databases</span>
          </button>
        </div>
      </div>
      
      {/* Input Area */}
      <div className={`p-3 ${
        isDarkMode ? 'bg-[#0a0a15] border-t border-[#222233]' : 'bg-white border-t border-gray-200'
      }`}>
        <div className="relative">
          <input 
            type="text" 
            placeholder="What's on your mind?"
            className={`w-full px-4 py-2.5 pr-10 rounded-lg ${
              isDarkMode 
                ? 'bg-[#1a1a24] placeholder-gray-500 text-gray-300 border-none' 
                : 'bg-gray-100 placeholder-gray-500 text-gray-800 border-none'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            readOnly
          />
          <button className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md ${
            isDarkMode ? 'text-blue-400' : 'text-blue-600'
          }`}>
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterfacePreview;