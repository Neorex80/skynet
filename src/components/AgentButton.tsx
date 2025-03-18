import React from 'react';
import { Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AgentButtonProps {
  isDarkMode: boolean;
}

const AgentButton: React.FC<AgentButtonProps> = ({ isDarkMode }) => {
  return (
    <Link to="/agents" className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors w-full ${
      isDarkMode 
        ? 'hover:bg-[#222233] text-gray-200' 
        : 'hover:bg-gray-200 text-gray-800'
    }`}>
      <Sparkles size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
      <span>AI Agents</span>
    </Link>
  );
};

export default AgentButton;