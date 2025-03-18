import React from 'react';
import { MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HomeButtonProps {
  isDarkMode: boolean;
}

const HomeButton: React.FC<HomeButtonProps> = ({ isDarkMode }) => {
  return (
    <Link to="/" className={`flex items-center gap-2 py-2 px-4 rounded-md transition-colors w-full ${
      isDarkMode 
        ? 'hover:bg-[#222233] text-gray-200' 
        : 'hover:bg-gray-200 text-gray-800'
    }`}>
      <MessageSquare size={18} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
      <span>Chat</span>
    </Link>
  );
};

export default HomeButton;