import React, { useState, useRef, useEffect } from 'react';
import { Code, Database, GitBranch, LineChart, Settings } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { ChatArea } from './components/ChatArea';
import { ChatInput } from './components/ChatInput';
import { ConversationSidebar } from './components/ConversationSidebar';
import AgentsPage from './components/AgentsPage';
import SuperagentsPage from './pages/SuperagentsPage';
import { SettingsPanel } from './components/SettingsPanel';
import LandingPage from './pages/LandingPage';
import ProfilePage from './components/ProfilePage';
import { sendMessageToGroq, streamMessageFromGroq, isReasoningModel } from './api/groqApi';
import { Message, ChatState, ReasoningFormat, Conversation } from './types';
import { ZEV_SYSTEM_PROMPT } from './constants';
import { TbLayoutSidebarLeftExpandFilled } from "react-icons/tb";
import { RxPencil2 } from "react-icons/rx";
import { ChevronDown, Cpu } from 'lucide-react';
import ZevLogo from './components/SkynetLogo';

function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });
  
  // Set dark mode as default
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : true;
  });
  
  // Settings state
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState('llama-3.3-70b-versatile');
  const [settingsUpdated, setSettingsUpdated] = useState(false);
  const [reasoningFormat, setReasoningFormat] = useState<ReasoningFormat>('parsed');
  
  // Model dropdown state
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  
  // Conversation history
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const savedConversations = sessionStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save conversations to sessionStorage when they change
  useEffect(() => {
    sessionStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);
  
  // Close model dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setIsModelDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Function to handle starting a new chat
  const handleNewChat = () => {
    // Save current conversation if it has messages
    if (chatState.messages.length > 0) {
      saveCurrentConversation();
    }

    // Create a new conversation
    const newConversationId = crypto.randomUUID();
    const newConversation: Conversation = {
      id: newConversationId,
      title: 'New Conversation',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setConversations(prev => [newConversation, ...prev]);
    setActiveConversationId(newConversationId);
    
    setChatState({
      messages: [],
      isLoading: false,
      error: null
    });
  };

  // Function to save the current conversation
  const saveCurrentConversation = () => {
    if (chatState.messages.length === 0) return;
    
    const title = getConversationTitle(chatState.messages);
    const updatedAt = new Date();
    
    if (activeConversationId) {
      // Update existing conversation
      setConversations(prev => prev.map(conv => 
        conv.id === activeConversationId 
          ? { ...conv, title, messages: chatState.messages, updatedAt } 
          : conv
      ));
    } else {
      // Create new conversation
      const newConversationId = crypto.randomUUID();
      const newConversation: Conversation = {
        id: newConversationId,
        title,
        messages: chatState.messages,
        createdAt: updatedAt,
        updatedAt
      };
      
      setConversations(prev => [newConversation, ...prev]);
      setActiveConversationId(newConversationId);
    }
  };

  // Function to load a conversation
  const loadConversation = (conversationId: string) => {
    const conversation = conversations.find(c => c.id === conversationId);
    if (conversation) {
      setChatState({
        messages: conversation.messages,
        isLoading: false,
        error: null
      });
      setActiveConversationId(conversationId);
      setIsSidebarOpen(false);
    }
  };

  // Function to delete a conversation
  const deleteConversation = (conversationId: string) => {
    setConversations(prev => prev.filter(c => c.id !== conversationId));
    if (activeConversationId === conversationId) {
      setChatState({
        messages: [],
        isLoading: false,
        error: null
      });
      setActiveConversationId(null);
    }
  };

  // Helper to get a title for the conversation based on first message
  const getConversationTitle = (messages: Message[]): string => {
    const firstUserMessage = messages.find(msg => msg.role === 'user');
    if (firstUserMessage) {
      // Limit title to first 30 characters of first user message
      const title = firstUserMessage.content.trim();
      return title.length > 30 ? title.substring(0, 30) + '...' : title;
    }
    return 'New Conversation';
  };

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };
  
  // Function to handle model changes
  const handleModelChange = (modelId: string) => {
    setCurrentModel(modelId);
    setIsModelDropdownOpen(false);
    setSettingsUpdated(true);
    // Clear the notification after a delay
    setTimeout(() => {
      setSettingsUpdated(false);
    }, 3000);
  };

  // Modified to keep the old response and add a new one
  const handleRegenerate = async () => {
    if (chatState.messages.length < 2) return;
    
    // Get the last user message
    const lastUserMessageIndex = [...chatState.messages]
      .reverse()
      .findIndex(msg => msg.role === 'user');
    
    if (lastUserMessageIndex === -1) return;
    
    const lastUserMessage = chatState.messages[chatState.messages.length - 1 - lastUserMessageIndex];
    
    // Keep all existing messages and add a regeneration prompt
    const regenerationPrompt: Message = {
      id: crypto.randomUUID(),
      role: 'system',
      content: '--- Regenerating response ---',
      timestamp: new Date()
    };
    
    // Update state with the regeneration prompt
    setChatState(prev => ({
      ...prev,
      messages: [...prev.messages, regenerationPrompt]
    }));
    
    // Call handleSendMessage with the last user message content
    await handleSendMessage(lastUserMessage.content);
  };

  // Function to cancel ongoing generation
  const handleStopGeneration = () => {
    // Currently we don't have a way to stop the generation with the current API setup
    // But we can mark the loading as false to stop updating the UI
    setChatState(prev => ({
      ...prev,
      isLoading: false
    }));
  };

  const handleSendMessage = async (content: string) => {
    // Create a new user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Create an empty assistant message for streaming
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      reasoning: isReasoningModel(currentModel) ? '' : undefined,
      timestamp: new Date()
    };

    // Update state with user message, empty assistant message, and set loading
    setChatState(prev => {
      // Don't add the user message if this is a regeneration (system message exists)
      const lastMessage = prev.messages[prev.messages.length - 1];
      const isRegeneration = lastMessage && lastMessage.role === 'system' && 
                             lastMessage.content === '--- Regenerating response ---';
      
      return {
        ...prev,
        messages: isRegeneration 
          ? [...prev.messages, assistantMessage] 
          : [...prev.messages, userMessage, assistantMessage],
        isLoading: true,
        error: null
      };
    });

    try {
      // Convert messages to the format required by the API
      const apiMessages = [
        { role: 'system' as const, content: ZEV_SYSTEM_PROMPT },
        ...chatState.messages
          .filter(msg => msg.role !== 'system' || msg.content !== '--- Regenerating response ---')
          .map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        { role: 'user' as const, content }
      ];

      // Use streaming API with improved buffering
      streamMessageFromGroq(
        apiMessages,
        // On each chunk, update the assistant message content
        (chunk, type) => {
          setChatState(prev => {
            const updatedMessages = prev.messages.map(msg => {
              if (msg.id === assistantMessageId) {
                if (type === 'content') {
                  return { ...msg, content: msg.content + chunk };
                } else if (type === 'reasoning' && msg.reasoning !== undefined) {
                  return { ...msg, reasoning: (msg.reasoning || '') + chunk };
                }
              }
              return msg;
            });
            return {
              ...prev,
              messages: updatedMessages
            };
          });
        },
        // On complete, mark loading as false and save conversation
        () => {
          setChatState(prev => ({
            ...prev,
            isLoading: false
          }));
          
          // Wait a bit for any final updates to be applied
          setTimeout(() => saveCurrentConversation(), 300);
        },
        currentModel,
        reasoningFormat
      );
    } catch (error) {
      // Handle errors
      setChatState(prev => {
        // Keep the user message but remove the empty assistant message
        const messages = prev.messages.filter(msg => msg.id !== assistantMessageId);
        return {
          messages,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
      });
    }
  };

  const suggestions = [
    {
      text: "Explain React component lifecycle",
      icon: Code,
      color: "bg-blue-500/10 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
      delay: "0"
    },
    {
      text: "How do I set up a CI/CD pipeline?",
      icon: GitBranch,
      color: "bg-purple-500/10 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
      delay: "100"
    },
    {
      text: "Write a function to find prime numbers",
      icon: Code,
      color: "bg-amber-500/10 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400",
      delay: "200"
    },
    {
      text: "Compare NoSQL vs SQL databases",
      icon: Database,
      color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
      delay: "300"
    }
  ];

  // Available models
  const models = [
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B',
      description: 'Powerful foundation model',
      category: 'Foundation'
    },
    {
      id: 'gemma2-9b-it',
      name: 'Gemma 2 9B',
      description: 'Fast and efficient',
      category: 'Foundation'
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B',
      description: 'Optimized for speed',
      category: 'Foundation'
    },
    {
      id: 'qwen-qwq-32b',
      name: 'Qwen QWQ 32B',
      description: 'Advanced reasoning',
      category: 'Reasoning',
      reasoningCapable: true
    },
    {
      id: 'deepseek-r1-distill-qwen-32b',
      name: 'DeepSeek R1 (Qwen 32B)',
      description: 'Reasoning with knowledge',
      category: 'Reasoning',
      reasoningCapable: true
    },
    {
      id: 'deepseek-r1-distill-llama-70b',
      name: 'DeepSeek R1 (Llama 70B)',
      description: 'High-capacity reasoning',
      category: 'Reasoning',
      reasoningCapable: true
    }
  ];

  // Find current model data
  const currentModelData = models.find(m => m.id === currentModel) || models[0];

  const ChatView = () => (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#0f0f15] text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Conversation Sidebar */}
      <ConversationSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        conversations={conversations}
        activeConversationId={activeConversationId}
        onSelectConversation={loadConversation}
        onDeleteConversation={deleteConversation}
        onNewConversation={handleNewChat}
        isDarkMode={isDarkMode}
      />
      
      {/* Main Content */}
      <div className="flex flex-col flex-1 h-full">
        {/* Sticky Header */}
        <header className={`flex items-center justify-between px-3 sm:px-5 py-3 ${
          isDarkMode 
            ? 'bg-[#0f0f15] border-b border-[#222233]' 
            : 'bg-gray-50 border-b border-gray-200'
        } sticky top-0 z-50`}>
          {/* Left side with merged Zev name and model dropdown */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Sidebar toggle button */}
            <button 
              className={`p-1.5 sm:p-2 rounded-md ${
                isDarkMode 
                  ? 'hover:bg-[#222233]' 
                  : 'hover:bg-gray-200'
              } transition-colors`}
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <TbLayoutSidebarLeftExpandFilled size={18} />
            </button>
            
            {/* Combined Zev name and logo */}
            <div className="flex items-center">
              <ZevLogo size={24} variant={isDarkMode ? 'dark' : 'light'} className="mr-2" />
              <span className="font-semibold">Zev</span>
            </div>
            
            {/* Model Selector */}
            <div ref={modelDropdownRef} className="relative ml-2">
              <button
                onClick={() => setIsModelDropdownOpen(!isModelDropdownOpen)}
                className={`flex items-center gap-2 py-1.5 px-3 rounded-lg text-sm ${
                  isDarkMode 
                    ? 'bg-[#1a1a24] hover:bg-[#222233]' 
                    : 'bg-white hover:bg-gray-100 border border-gray-200'
                } transition-colors`}
              >
                <span className={`text-xs px-1.5 py-0.5 rounded flex items-center gap-1 ${
                  isReasoningModel(currentModel)
                    ? isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600' 
                    : isDarkMode ? 'bg-gray-800/70 text-gray-400' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Cpu size={10} />
                  {currentModelData.name}
                </span>
                <ChevronDown size={12} className={`transition-transform ${isModelDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Settings updated notification */}
              {settingsUpdated && (
                <span className="absolute right-0 top-0 -mt-1 -mr-1 flex h-4 w-4">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex h-4 w-4 rounded-full bg-green-500"></span>
                </span>
              )}
              
              {/* Model dropdown */}
              {isModelDropdownOpen && (
                <div className={`absolute top-full mt-1 left-0 w-64 rounded-lg shadow-lg ${
                  isDarkMode ? 'bg-[#0f0f15] border border-[#222233]' : 'bg-white border border-gray-200'
                } overflow-hidden z-20`}>
                  {/* Foundation Models */}
                  <div className={`py-1 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase`}>
                    Foundation Models
                  </div>
                  {models.filter(m => m.category === 'Foundation').map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`flex items-start w-full text-left px-3 py-2 ${
                        isDarkMode 
                          ? 'hover:bg-[#1a1a24]' 
                          : 'hover:bg-gray-50'
                      } ${
                        currentModel === model.id 
                          ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50' 
                          : ''
                      }`}
                    >
                      <Cpu size={12} className="mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm">
                        <div className="font-medium truncate">{model.name}</div>
                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {model.description}
                        </div>
                      </div>
                    </button>
                  ))}

                  {/* Reasoning Models */}
                  <div className={`py-1 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase border-t ${
                    isDarkMode ? 'border-[#222233]' : 'border-gray-200'
                  }`}>
                    Reasoning Models
                  </div>
                  {models.filter(m => m.category === 'Reasoning').map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`flex items-start w-full text-left px-3 py-2 ${
                        isDarkMode 
                          ? 'hover:bg-[#1a1a24]' 
                          : 'hover:bg-gray-50'
                      } ${
                        currentModel === model.id 
                          ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50' 
                          : ''
                      }`}
                    >
                      <Cpu size={12} className="mt-0.5 mr-2 flex-shrink-0 text-blue-400" />
                      <div className="text-sm">
                        <div className="font-medium truncate">{model.name}</div>
                        <div className={`text-xs truncate ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {model.description}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          {/* Right side with settings and new chat buttons */}
          <div className="flex items-center gap-2">
            {/* New Chat Button (moved to right side) */}
            <button
              onClick={handleNewChat}
              className={`p-1.5 sm:p-2 rounded-md ${
                isDarkMode 
                  ? 'hover:bg-[#222233]' 
                  : 'hover:bg-gray-200'
              } transition-colors`}
              aria-label="New Chat"
              title="New Chat"
            >
              <RxPencil2 size={18} />
            </button>
            
            {/* Settings button */}
            <button
              onClick={() => setIsSettingsPanelOpen(true)}
              className={`p-1.5 sm:p-2 rounded-md ${
                isDarkMode 
                  ? 'hover:bg-[#222233]' 
                  : 'hover:bg-gray-200'
              } transition-colors`}
              aria-label="Settings"
              title="Settings"
            >
              <Settings size={18} />
            </button>
            
            {/* Profile link */}
            <Link
              to="/profile"
              className={`p-1.5 sm:p-2 rounded-md ${
                isDarkMode 
                  ? 'hover:bg-[#222233]' 
                  : 'hover:bg-gray-200'
              } transition-colors`}
              aria-label="Profile"
              title="Profile"
            >
              <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-medium">
                U
              </div>
            </Link>
          </div>
        </header>

        {/* Seamless Chat and Input Area - Removed outer boxes */}
        <div className="flex-1 flex flex-col h-full overflow-hidden">
          <ChatArea 
            messages={chatState.messages}
            error={chatState.error}
            isLoading={chatState.isLoading}
            suggestions={suggestions}
            onSuggestionClick={handleSendMessage}
            onRegenerate={handleRegenerate}
            isDarkMode={isDarkMode}
          />

          {/* Chat Input - Now in a floating container */}
          <div 
            className={`absolute bottom-0 left-0 right-0 px-3 py-4 pb-6 ${
              isDarkMode 
                ? 'bg-gradient-to-t from-[#0f0f15] via-[#0f0f15] to-transparent' 
                : 'bg-gradient-to-t from-gray-50 via-gray-50 to-transparent'
            }`}
          >
            <div className="max-w-3xl mx-auto">
              <ChatInput 
                onSend={handleSendMessage} 
                onStop={handleStopGeneration}
                disabled={false} 
                isGenerating={chatState.isLoading}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Settings Panel */}
      <SettingsPanel 
        isOpen={isSettingsPanelOpen}
        onClose={() => setIsSettingsPanelOpen(false)}
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        reasoningFormat={reasoningFormat}
        onReasoningFormatChange={setReasoningFormat}
        currentModel={currentModel}
        onModelChange={handleModelChange}
      />
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isDarkMode={isDarkMode} />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/profile" element={<ProfilePage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/agents" element={<AgentsPage isDarkMode={isDarkMode} />} />
        <Route path="/superagents" element={<SuperagentsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;