import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Search, Sparkles, Code, FileText, Database, Brain, LineChart, Shield, MessageSquare, Image } from 'lucide-react';
import { Agent } from '../types';
import AgentCard from './AgentCard';
import AgentChatView from './AgentChatView';

interface AgentsPageProps {
  isDarkMode: boolean;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ isDarkMode }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  // Define agent categories
  const categories = [
    { id: 'all', name: 'All Agents' },
    { id: 'productivity', name: 'Productivity' },
    { id: 'development', name: 'Development' },
    { id: 'data', name: 'Data & Analysis' },
    { id: 'creative', name: 'Creative' },
    { id: 'business', name: 'Business' }
  ];

  // Define agents
  const agents: Agent[] = [
    {
      id: 'coder',
      name: 'Code Wizard',
      description: 'Specialized in writing, debugging, and optimizing code across multiple programming languages.',
      avatar: 'Code',
      category: 'development',
      capabilities: ['Code generation', 'Debugging assistance', 'Code optimization', 'Algorithm design'],
      role: 'Transforms ideas into efficient, clean code with detailed explanations.'
    },
    {
      id: 'writer',
      name: 'Content Composer',
      description: 'Creates persuasive and engaging written content for various purposes and audiences.',
      avatar: 'FileText',
      category: 'creative',
      capabilities: ['Blog posts', 'Marketing copy', 'Email templates', 'Technical documentation'],
      role: 'Crafts compelling copy that captivates readers and achieves content goals.'
    },
    {
      id: 'data-analyst',
      name: 'Data Sage',
      description: 'Analyzes data, identifies patterns, and generates actionable insights from complex datasets.',
      avatar: 'Database',
      category: 'data',
      capabilities: ['Data analysis', 'Statistical modeling', 'Data visualization', 'Trend identification'],
      role: 'Transforms raw data into meaningful insights and visualizations.'
    },
    {
      id: 'researcher',
      name: 'Research Navigator',
      description: 'Conducts thorough research on any topic and presents information in a structured format.',
      avatar: 'Brain',
      category: 'productivity',
      capabilities: ['Topic research', 'Literature review', 'Fact checking', 'Knowledge summarization'],
      role: 'Explores, evaluates, and synthesizes information into comprehensive research.'
    },
    {
      id: 'business-strategist',
      name: 'Business Strategist',
      description: 'Provides strategic business advice, market analysis, and competitive intelligence.',
      avatar: 'LineChart',
      category: 'business',
      capabilities: ['Market analysis', 'Business planning', 'Competitive analysis', 'Strategy development'],
      role: 'Delivers data-driven business insights and strategic recommendations.'
    },
    {
      id: 'security-advisor',
      name: 'Security Guardian',
      description: 'Specializes in cybersecurity best practices, security audits, and threat prevention.',
      avatar: 'Shield',
      category: 'development',
      capabilities: ['Security assessment', 'Vulnerability analysis', 'Security best practices', 'Risk mitigation'],
      role: 'Protects digital assets through expert security guidance and recommendations.'
    },
    {
      id: 'interview-coach',
      name: 'Interview Coach',
      description: 'Prepares candidates for job interviews with personalized practice and feedback.',
      avatar: 'MessageSquare',
      category: 'productivity',
      capabilities: ['Mock interviews', 'Answer preparation', 'Feedback provision', 'Interview strategy'],
      role: 'Boosts interview confidence and performance with tailored preparation.'
    },
    {
      id: 'design-assistant',
      name: 'Design Muse',
      description: 'Provides design ideas, UI/UX guidance, and creative direction for visual projects.',
      avatar: 'Image',
      category: 'creative',
      capabilities: ['Design concepts', 'UI/UX guidance', 'Color theory', 'Layout suggestions'],
      role: 'Sparks creativity and elevates design quality through expert guidance.'
    }
  ];

  // Filter agents based on search query and active category
  const filteredAgents = agents.filter(agent => {
    const matchesSearch = searchQuery === '' || 
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = activeCategory === null || 
      activeCategory === 'all' || 
      agent.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get icon component for an agent
  const getAgentIcon = (iconName: string) => {
    const iconMap: Record<string, React.ElementType> = {
      'Code': Code,
      'FileText': FileText,
      'Database': Database,
      'Brain': Brain,
      'LineChart': LineChart,
      'Shield': Shield,
      'MessageSquare': MessageSquare,
      'Image': Image
    };
    
    return iconMap[iconName] || Sparkles;
  };

  // Handle agent selection
  const handleAgentSelect = (agent: Agent) => {
    setSelectedAgent(agent);
  };

  // Close agent chat view
  const closeAgentChat = () => {
    setSelectedAgent(null);
  };

  // If an agent is selected, show the agent chat view
  if (selectedAgent) {
    return <AgentChatView agent={selectedAgent} onBack={closeAgentChat} isDarkMode={isDarkMode} />;
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0f0f15] text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-5 py-4 ${
        isDarkMode ? 'bg-[#0f0f15] border-b border-[#222233]' : 'bg-gray-50 border-b border-gray-200'
      } sticky top-0 z-50`}>
        <div className="flex items-center">
          <Link to="/" className={`p-2 rounded-md ${
            isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-200'
          } transition-colors`}>
            <ArrowLeft size={20} />
          </Link>
          <h1 className="ml-4 text-xl font-bold">AI Agents</h1>
        </div>
      </div>

      {/* Search and Categories */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Search bar */}
        <div className={`relative mb-6 ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`block w-full pl-10 pr-4 py-2 rounded-lg ${
              isDarkMode
                ? 'bg-[#1a1a24] border-[#222233] focus:ring-blue-500 focus:border-blue-500 placeholder-gray-500'
                : 'bg-white border-gray-300 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400'
            } border focus:outline-none focus:ring-2`}
          />
        </div>

        {/* Category tabs */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-2 pb-2">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id === activeCategory ? null : category.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  (activeCategory === category.id || (activeCategory === null && category.id === 'all'))
                    ? isDarkMode 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-blue-600 text-white'
                    : isDarkMode
                      ? 'bg-[#1a1a24] hover:bg-[#222233] text-gray-300'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Agents grid */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredAgents.map(agent => (
              <AgentCard
                key={agent.id}
                agent={agent}
                icon={getAgentIcon(agent.avatar)}
                isDarkMode={isDarkMode}
                onSelect={() => handleAgentSelect(agent)}
              />
            ))}
          </div>
        ) : (
          <div className={`text-center py-12 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            <div className="flex justify-center mb-4">
              <Search size={48} className="opacity-40" />
            </div>
            <h3 className="text-lg font-medium mb-2">No agents found</h3>
            <p className="max-w-md mx-auto">
              Try adjusting your search or filter criteria to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentsPage;