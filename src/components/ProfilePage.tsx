import React, { useState } from 'react';
import { ArrowLeft, Settings, Shield, Bell, Moon, Sun, HelpCircle, Cpu, Gauge, Clock, Zap, Activity, BarChart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfilePageProps {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

// Model type definition
interface Model {
  id: string;
  name: string;
  description: string;
  category: 'base' | 'reasoning';
  specs: {
    parameters: string;
    contextWindow: string;
    latency: string;
    throughput: string;
  };
  recommended: string[];
}

// Reasoning format type
type ReasoningFormat = 'parsed' | 'raw' | 'hidden';

const ProfilePage: React.FC<ProfilePageProps> = ({ isDarkMode, toggleDarkMode }) => {
  // State for active horizontal tab
  const [activeTab, setActiveTab] = useState<'account' | 'models'>('account');
  
  // State for selected model
  const [selectedModel, setSelectedModel] = useState<string>('llama-3.3-70b-versatile');
  
  // State for reasoning format
  const [reasoningFormat, setReasoningFormat] = useState<ReasoningFormat>('parsed');
  
  // State for retention settings
  const [retentionDays, setRetentionDays] = useState<number>(30);
  
  // Settings apply state
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Model data
  const models: Model[] = [
    {
      id: 'gemma2-9b-it',
      name: 'Gemma 2 9B',
      category: 'base',
      description: 'A lightweight but capable model optimized for efficiency and fast responses.',
      specs: {
        parameters: '9B',
        contextWindow: '32K',
        latency: 'Very low',
        throughput: 'High'
      },
      recommended: ['Quick responses', 'Mobile applications', 'Resource-constrained environments']
    },
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B',
      category: 'base',
      description: 'Highly versatile and powerful foundation model with exceptional general capabilities.',
      specs: {
        parameters: '70B',
        contextWindow: '128K',
        latency: 'Medium',
        throughput: 'Medium'
      },
      recommended: ['General purpose tasks', 'Creative content generation', 'Complex reasoning']
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B Instant',
      category: 'base',
      description: 'Fast and optimized for real-time conversations and quick response generation.',
      specs: {
        parameters: '8B',
        contextWindow: '8K',
        latency: 'Very low',
        throughput: 'Very high'
      },
      recommended: ['Real-time applications', 'Chat interfaces', 'Quick responses']
    },
    {
      id: 'qwen-qwq-32b',
      name: 'Qwen QWQ 32B',
      category: 'reasoning',
      description: 'Advanced reasoning model with exceptional logical and analytical capabilities.',
      specs: {
        parameters: '32B',
        contextWindow: '32K',
        latency: 'Medium-High',
        throughput: 'Medium'
      },
      recommended: ['Complex problem solving', 'Mathematical reasoning', 'Logical analysis']
    },
    {
      id: 'deepseek-r1-distill-qwen-32b',
      name: 'DeepSeek R1 (Qwen 32B)',
      category: 'reasoning',
      description: 'Distilled knowledge-focused reasoning model with deep understanding capabilities.',
      specs: {
        parameters: '32B',
        contextWindow: '64K',
        latency: 'Medium-High',
        throughput: 'Medium'
      },
      recommended: ['Research assistance', 'Knowledge-intensive tasks', 'Complex explanations']
    },
    {
      id: 'deepseek-r1-distill-llama-70b',
      name: 'DeepSeek R1 (Llama 70B)',
      category: 'reasoning',
      description: 'High-capacity reasoning model offering exceptional depth for complex tasks.',
      specs: {
        parameters: '70B',
        contextWindow: '128K',
        latency: 'High',
        throughput: 'Low-Medium'
      },
      recommended: ['Advanced reasoning', 'Step-by-step solutions', 'Scientific domains']
    }
  ];

  // Filter models by category
  const baseModels = models.filter(model => model.category === 'base');
  const reasoningModels = models.filter(model => model.category === 'reasoning');
  
  // Get currently selected model data
  const selectedModelData = models.find(model => model.id === selectedModel);
  
  // Handle applying settings
  const handleApplySettings = () => {
    setIsSaving(true);
    
    // Simulate API call or settings application
    setTimeout(() => {
      setIsSaving(false);
      setShowSuccess(true);
      
      // Hide success message after a delay
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    }, 800);
  };

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
          <h1 className="ml-4 text-xl font-bold">Profile</h1>
        </div>
      </div>

      {/* Horizontal Navigation */}
      <div className={`px-4 py-2 ${
        isDarkMode ? 'bg-[#0f0f15] border-b border-[#222233]' : 'bg-gray-50 border-b border-gray-200'
      } sticky top-[60px] z-40`}>
        <div className="max-w-2xl mx-auto flex">
          <button
            className={`px-4 py-2 font-medium relative ${
              activeTab === 'account' 
                ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
            onClick={() => setActiveTab('account')}
          >
            Account Settings
            {activeTab === 'account' && (
              <div className={`absolute bottom-0 left-0 w-full h-0.5 ${
                isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
              } rounded-t-full`}></div>
            )}
          </button>
          <button
            className={`px-4 py-2 font-medium relative ${
              activeTab === 'models' 
                ? isDarkMode ? 'text-blue-400' : 'text-blue-600' 
                : isDarkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'
            } transition-colors`}
            onClick={() => setActiveTab('models')}
          >
            Model Selection
            {activeTab === 'models' && (
              <div className={`absolute bottom-0 left-0 w-full h-0.5 ${
                isDarkMode ? 'bg-blue-500' : 'bg-blue-600'
              } rounded-t-full`}></div>
            )}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-6">
        {/* Settings saved notification */}
        {showSuccess && (
          <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-green-900 text-green-200' : 'bg-green-600 text-white'
          } flex items-center gap-2 animate-fade-in z-50`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>Settings applied successfully</span>
          </div>
        )}
        
        {/* Account Settings Tab */}
        {activeTab === 'account' && (
          <>
            {/* Profile Card */}
            <div className={`rounded-xl p-6 mb-8 ${
              isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
            }`}>
              <div className="flex items-center">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    U
                  </div>
                  <div className="absolute inset-0 rounded-full border-2 border-blue-400 animate-pulse opacity-70"></div>
                </div>
                <div className="ml-4">
                  <h2 className="text-xl font-bold">User</h2>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>user@example.com</p>
                </div>
              </div>
              <div className="mt-6">
                <button className={`w-full py-2.5 px-4 rounded-lg font-medium ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}>
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Usage Statistics */}
            <div className={`rounded-xl overflow-hidden mb-8 ${
              isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
            }`}>
              <h3 className={`p-4 font-medium border-b ${
                isDarkMode ? 'border-[#222233]' : 'border-gray-200'
              }`}>Usage Statistics</h3>
              
              <div className="p-4 grid grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                    }`}>
                      <Activity size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Queries</span>
                  </div>
                  <div className="text-xl font-semibold">457</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Last 30 days</div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-green-900/30 text-green-400' : 'bg-green-100 text-green-600'
                    }`}>
                      <Clock size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Avg. Time</span>
                  </div>
                  <div className="text-xl font-semibold">3.2s</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Response time</div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-purple-900/30 text-purple-400' : 'bg-purple-100 text-purple-600'
                    }`}>
                      <BarChart size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Tokens</span>
                  </div>
                  <div className="text-xl font-semibold">682K</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Total generated</div>
                </div>
                
                <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}>
                  <div className="flex items-center mb-2">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-amber-900/30 text-amber-400' : 'bg-amber-100 text-amber-600'
                    }`}>
                      <Star size={16} />
                    </div>
                    <span className="ml-2 text-sm font-medium">Rating</span>
                  </div>
                  <div className="text-xl font-semibold">4.8/5</div>
                  <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>From your feedback</div>
                </div>
              </div>
            </div>

            {/* Interface Preferences */}
            <div className={`rounded-xl overflow-hidden mb-8 ${
              isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
            }`}>
              <h3 className={`p-4 font-medium border-b ${
                isDarkMode ? 'border-[#222233]' : 'border-gray-200'
              }`}>Interface Preferences</h3>
              
              <div className="divide-y divide-gray-200 dark:divide-[#222233]">
                {/* Dark Mode Toggle */}
                <div className={`flex items-center justify-between p-4 ${
                  isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-50'
                } transition-colors cursor-pointer`} onClick={toggleDarkMode}>
                  <div className="flex items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                    }`}>
                      {isDarkMode ? 
                        <Moon size={18} className="text-gray-300" /> : 
                        <Sun size={18} className="text-gray-600" />
                      }
                    </div>
                    <span className="ml-3">Dark Mode</span>
                  </div>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isDarkMode ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
                
                {/* Notification Preferences */}
                <div className={`flex items-center justify-between p-4 ${
                  isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-50'
                } transition-colors cursor-pointer`}>
                  <div className="flex items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                    }`}>
                      <Bell size={18} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                    </div>
                    <span className="ml-3">Notification Sounds</span>
                  </div>
                  <div className={`w-10 h-6 flex items-center rounded-full p-1 ${
                    isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                      isDarkMode ? 'translate-x-4' : 'translate-x-0'
                    }`}></div>
                  </div>
                </div>
                
                {/* Font Size */}
                <div className="p-4">
                  <div className="flex items-center mb-2">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        <path d="M4 7V4h16v3"/>
                        <path d="M9 20h6"/>
                        <path d="M12 4v16"/>
                      </svg>
                    </div>
                    <span className="ml-3">Font Size</span>
                  </div>
                  <div className="pl-12 pr-4">
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="1"
                      defaultValue="3"
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span>A</span>
                      <span>A</span>
                      <span>A</span>
                      <span>A</span>
                      <span>A</span>
                    </div>
                  </div>
                </div>
                
                {/* Chat Density */}
                <div className="p-4">
                  <div className="flex items-center mb-3">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center ${
                      isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                    }`}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        <rect x="3" y="3" width="18" height="18" rx="2"/>
                        <path d="M8 12h8"/>
                        <path d="M12 8v8"/>
                      </svg>
                    </div>
                    <span className="ml-3">Chat Density</span>
                  </div>
                  <div className="pl-12 grid grid-cols-3 gap-2">
                    <button className={`py-1 px-2 text-sm rounded-md transition-colors border ${
                      isDarkMode 
                        ? 'border-[#222233] bg-[#0f0f15] text-blue-400' 
                        : 'border-blue-200 bg-blue-50 text-blue-600'
                    }`}>
                      Compact
                    </button>
                    <button className={`py-1 px-2 text-sm rounded-md transition-colors border ${
                      isDarkMode 
                        ? 'border-[#222233] bg-[#0f0f15] text-gray-300' 
                        : 'border-gray-200 bg-gray-100 text-gray-600'
                    }`}>
                      Default
                    </button>
                    <button className={`py-1 px-2 text-sm rounded-md transition-colors border ${
                      isDarkMode 
                        ? 'border-[#222233] bg-[#0f0f15] text-gray-300' 
                        : 'border-gray-200 bg-gray-100 text-gray-600'
                    }`}>
                      Comfortable
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Model Selection Tab */}
        {activeTab === 'models' && (
          <>
            {/* Base Models */}
            <div className={`rounded-xl overflow-hidden mb-8 ${
              isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
            }`}>
              <h3 className={`p-4 font-medium border-b ${
                isDarkMode ? 'border-[#222233]' : 'border-gray-200'
              }`}>Base Models</h3>
              
              <div className="divide-y divide-gray-200 dark:divide-[#222233]">
                {baseModels.map(model => (
                  <div 
                    key={model.id}
                    className={`flex items-center p-4 cursor-pointer ${
                      isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-50'
                    } ${selectedModel === model.id ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      selectedModel === model.id
                        ? isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
                        : isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                    }`}>
                      <Cpu size={18} className={
                        selectedModel === model.id ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      } />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{model.name}</span>
                        {selectedModel === model.id && (
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                          }`}>
                            Active
                          </div>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {model.specs.parameters} params • {model.specs.contextWindow} context
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reasoning Models */}
            <div className={`rounded-xl overflow-hidden mb-8 ${
              isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
            }`}>
              <h3 className={`p-4 font-medium border-b ${
                isDarkMode ? 'border-[#222233]' : 'border-gray-200'
              }`}>Reasoning Models</h3>
              
              <div className="divide-y divide-gray-200 dark:divide-[#222233]">
                {reasoningModels.map(model => (
                  <div 
                    key={model.id}
                    className={`flex items-center p-4 cursor-pointer ${
                      isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-50'
                    } ${selectedModel === model.id ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50' : ''}`}
                    onClick={() => setSelectedModel(model.id)}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
                      selectedModel === model.id
                        ? isDarkMode ? 'bg-blue-600' : 'bg-blue-600'
                        : isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                    }`}>
                      <Gauge size={18} className={
                        selectedModel === model.id ? 'text-white' : isDarkMode ? 'text-gray-300' : 'text-gray-600'
                      } />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between">
                        <span className="font-medium">{model.name}</span>
                        {selectedModel === model.id && (
                          <div className={`text-xs px-2 py-0.5 rounded-full ${
                            isDarkMode ? 'bg-blue-900/50 text-blue-400' : 'bg-blue-100 text-blue-600'
                          }`}>
                            Active
                          </div>
                        )}
                      </div>
                      <p className={`text-xs mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        {model.specs.parameters} params • {model.specs.contextWindow} context
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Model Details */}
            {selectedModelData && (
              <div className={`rounded-xl overflow-hidden mb-8 ${
                isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
              }`}>
                <h3 className={`p-4 font-medium border-b ${
                  isDarkMode ? 'border-[#222233]' : 'border-gray-200'
                }`}>Model Settings: {selectedModelData.name}</h3>
                
                <div className="p-4">
                  <p className={`mb-4 text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {selectedModelData.description}
                  </p>

                  {/* Performance Metrics */}
                  <div className={`mb-6 p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}>
                    <h4 className="text-sm font-medium mb-3">Performance Metrics</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs uppercase opacity-70">Parameters</div>
                        <div className="font-medium">{selectedModelData.specs.parameters}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase opacity-70">Context Window</div>
                        <div className="font-medium">{selectedModelData.specs.contextWindow}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase opacity-70">Latency</div>
                        <div className="font-medium">{selectedModelData.specs.latency}</div>
                      </div>
                      <div>
                        <div className="text-xs uppercase opacity-70">Throughput</div>
                        <div className="font-medium">{selectedModelData.specs.throughput}</div>
                      </div>
                    </div>
                  </div>

                  {/* Recommended For */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Recommended For</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedModelData.recommended.map((rec, index) => (
                        <span 
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkMode 
                              ? 'bg-[#0f0f15] text-gray-300' 
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {rec}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Configuration Options */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Response Configuration</h4>
                    
                    {/* Reasoning Format */}
                    <div className="mb-4">
                      <label className="text-xs mb-2 block opacity-70">Reasoning Format</label>
                      <div className="flex gap-2">
                        <button 
                          className={`py-1 px-3 text-xs rounded-md transition-colors border ${
                            reasoningFormat === 'parsed' 
                              ? isDarkMode 
                                ? 'bg-blue-600 text-white border-blue-700' 
                                : 'bg-blue-600 text-white border-blue-700'
                              : isDarkMode 
                                ? 'border-[#222233] bg-[#0f0f15] text-gray-300' 
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                          onClick={() => setReasoningFormat('parsed')}
                        >
                          Parsed
                        </button>
                        <button 
                          className={`py-1 px-3 text-xs rounded-md transition-colors border ${
                            reasoningFormat === 'raw' 
                              ? isDarkMode 
                                ? 'bg-blue-600 text-white border-blue-700' 
                                : 'bg-blue-600 text-white border-blue-700'
                              : isDarkMode 
                                ? 'border-[#222233] bg-[#0f0f15] text-gray-300' 
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                          onClick={() => setReasoningFormat('raw')}
                        >
                          Raw
                        </button>
                        <button 
                          className={`py-1 px-3 text-xs rounded-md transition-colors border ${
                            reasoningFormat === 'hidden' 
                              ? isDarkMode 
                                ? 'bg-blue-600 text-white border-blue-700' 
                                : 'bg-blue-600 text-white border-blue-700'
                              : isDarkMode 
                                ? 'border-[#222233] bg-[#0f0f15] text-gray-300' 
                                : 'border-gray-200 bg-gray-50 text-gray-700'
                          }`}
                          onClick={() => setReasoningFormat('hidden')}
                        >
                          Hidden
                        </button>
                      </div>
                    </div>

                    {/* Temperature */}
                    <div className="mb-4">
                      <label className="text-xs mb-2 block opacity-70">Temperature</label>
                      <div className="flex items-center gap-2">
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.1"
                          defaultValue="0.7"
                          className="flex-1"
                        />
                        <span className="text-xs font-mono w-6 text-center">0.7</span>
                      </div>
                      <div className="flex justify-between text-xs mt-1 opacity-70">
                        <span>Precise</span>
                        <span>Creative</span>
                      </div>
                    </div>
                    
                    {/* History Retention */}
                    <div className="mb-4">
                      <label className="text-xs mb-2 block opacity-70">History Retention (days)</label>
                      <select 
                        value={retentionDays} 
                        onChange={(e) => setRetentionDays(Number(e.target.value))}
                        className={`w-full p-2 text-sm rounded-md ${
                          isDarkMode 
                            ? 'bg-[#0f0f15] border-[#222233] text-gray-200' 
                            : 'bg-white border-gray-200 text-gray-800'
                        } border`}
                      >
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                        <option value={90}>90 days</option>
                        <option value={365}>1 year</option>
                      </select>
                    </div>
                    
                    {/* Max Tokens */}
                    <div className="mb-4">
                      <label className="text-xs mb-2 block opacity-70">Maximum Response Length</label>
                      <select 
                        defaultValue="4096"
                        className={`w-full p-2 text-sm rounded-md ${
                          isDarkMode 
                            ? 'bg-[#0f0f15] border-[#222233] text-gray-200' 
                            : 'bg-white border-gray-200 text-gray-800'
                        } border`}
                      >
                        <option value="1024">1,024 tokens</option>
                        <option value="2048">2,048 tokens</option>
                        <option value="4096">4,096 tokens</option>
                        <option value="8192">8,192 tokens</option>
                        <option value="16384">16,384 tokens</option>
                      </select>
                    </div>
                  </div>
                  
                  {/* Apply Button */}
                  <button 
                    onClick={handleApplySettings}
                    disabled={isSaving}
                    className={`w-full py-2.5 px-4 rounded-lg font-medium ${
                      isSaving
                        ? isDarkMode 
                          ? 'bg-blue-800/50 text-blue-300/50 cursor-not-allowed' 
                          : 'bg-blue-300 text-white cursor-not-allowed'
                        : isDarkMode 
                          ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                    } transition-colors flex justify-center items-center`}
                  >
                    {isSaving ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Applying Settings...
                      </>
                    ) : (
                      'Apply Settings'
                    )}
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* Footer */}
        <div className="text-center mt-8 mb-4">
          <p className={`text-xs ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            Version 1.0.0 • Terms of Service • Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;