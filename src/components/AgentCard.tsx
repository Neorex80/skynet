import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Agent } from '../types';

interface AgentCardProps {
  agent: Agent;
  icon: React.ElementType;
  isDarkMode: boolean;
  onSelect: () => void;
}

const AgentCard: React.FC<AgentCardProps> = ({ agent, icon: Icon, isDarkMode, onSelect }) => {
  return (
    <div 
      className={`rounded-xl overflow-hidden cursor-pointer transition-all duration-300 transform hover:scale-[1.02] hover:shadow-lg ${
        isDarkMode 
          ? 'bg-[#1a1a24] border border-[#222233] hover:border-blue-800'
          : 'bg-white border border-gray-200 hover:border-blue-300'
      }`}
      onClick={onSelect}
    >
      <div className="p-6">
        <div className="flex items-center mb-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDarkMode 
              ? 'bg-blue-900/30 text-blue-400'
              : 'bg-blue-100 text-blue-600'
          }`}>
            <Icon size={24} />
          </div>
          <div className="ml-3">
            <h3 className="font-bold">{agent.name}</h3>
            <div className={`text-xs ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
              {agent.category.charAt(0).toUpperCase() + agent.category.slice(1)}
            </div>
          </div>
        </div>
        
        <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
          {agent.description}
        </p>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {agent.capabilities.slice(0, 3).map((capability, index) => (
            <span 
              key={index}
              className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode 
                  ? 'bg-[#0f0f15] text-gray-300'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {capability}
            </span>
          ))}
          {agent.capabilities.length > 3 && (
            <span className={`text-xs px-2 py-1 rounded-full ${
              isDarkMode 
                ? 'bg-[#0f0f15] text-gray-300'
                : 'bg-gray-100 text-gray-700'
            }`}>
              +{agent.capabilities.length - 3} more
            </span>
          )}
        </div>
        
        <div className={`flex items-center justify-between text-sm ${
          isDarkMode ? 'text-blue-400' : 'text-blue-600'
        }`}>
          <span className="font-medium">Try this agent</span>
          <ChevronRight size={16} />
        </div>
      </div>
    </div>
  );
};

export default AgentCard;