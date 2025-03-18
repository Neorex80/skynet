import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowLeft, 
  Send, 
  Code, 
  FileText, 
  Database, 
  Brain, 
  LineChart, 
  Shield, 
  MessageSquare, 
  Image,
  StopCircle
} from 'lucide-react';
import { Agent } from '../types';
import { MessageBubble } from './MessageBubble';
import { Message } from '../types';
import { AGENT_PROMPTS } from '../constants/agentPrompts';

interface AgentChatViewProps {
  agent: Agent;
  onBack: () => void;
  isDarkMode: boolean;
}

const AgentChatView: React.FC<AgentChatViewProps> = ({ agent, onBack, isDarkMode }) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isProcessingMessage, setIsProcessingMessage] = useState(false);
  const [typingTimeout, setTypingTimeoutState] = useState<NodeJS.Timeout | null>(null);

  // Generate welcome message from the agent
  useEffect(() => {
    const welcomeMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: `👋 Hello! I'm ${agent.name}, your ${agent.category} specialist. ${agent.description} I can help you with ${agent.capabilities.join(', ')}. How can I assist you today?`,
      timestamp: new Date()
    };
    
    setMessages([welcomeMessage]);
  }, [agent]);

  // Auto-focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // Adjust textarea height as content changes
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
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

  // Clean up any timeouts when component unmounts
  useEffect(() => {
    return () => {
      if (typingTimeout) {
        clearTimeout(typingTimeout);
      }
    };
  }, [typingTimeout]);

  // Handle stopping message generation
  const handleStopGeneration = () => {
    setIsLoading(false);
    setIsProcessingMessage(false);
    if (typingTimeout) {
      clearTimeout(typingTimeout);
      setTypingTimeoutState(null);
    }
    
    // Find the currently streaming message and mark it as complete
    setMessages(prev => {
      const lastMessage = prev[prev.length - 1];
      if (lastMessage && lastMessage.role === 'assistant' && lastMessage.content === '') {
        return prev.map((msg, index) => {
          if (index === prev.length - 1) {
            return { ...msg, content: '(Message generation stopped)' };
          }
          return msg;
        });
      }
      return prev;
    });
  };

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim() || isLoading) return;

    // User message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    // Clear input and adjust height
    setInput('');
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }

    // Add user message to the chat
    setMessages(prev => [...prev, userMessage]);
    
    // Simulate agent typing
    setIsLoading(true);
    
    // Empty assistant message for the typing indicator
    const assistantMessageId = crypto.randomUUID();
    const emptyAssistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: new Date()
    };
    
    // Add empty message for typing indicator
    setTimeout(() => {
      setMessages(prev => [...prev, emptyAssistantMessage]);
      setIsProcessingMessage(true);
      
      // Get the agent's prompt and generate a response
      generateAgentResponse(input.trim(), agent, assistantMessageId);
    }, 500);
  };

  // Generate a response from the agent using the prompts
  const generateAgentResponse = (userMessage: string, agent: Agent, messageId: string) => {
    // Get prompt for this agent type or use default
    const agentPrompt = AGENT_PROMPTS[agent.id] || AGENT_PROMPTS['default'];
    
    // Clear any existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    
    // For a more dynamic experience, we'll simulate the generation character by character
    const simulateTyping = (fullResponse: string) => {
      let currentIndex = 0;
      const typingSpeed = 10; // milliseconds per character (adjust for desired speed)
      
      const typeNextChar = () => {
        if (currentIndex <= fullResponse.length && isProcessingMessage) {
          // Update the message with the next character
          setMessages(prev => 
            prev.map(msg => 
              msg.id === messageId 
                ? { ...msg, content: fullResponse.substring(0, currentIndex) } 
                : msg
            )
          );
          
          currentIndex++;
          
          // Schedule next character
          const nextTimeout = setTimeout(typeNextChar, typingSpeed);
          setTypingTimeoutState(nextTimeout);
        } else {
          // Typing complete or stopped
          setIsLoading(false);
          setIsProcessingMessage(false);
        }
      };
      
      // Start typing
      typeNextChar();
    };

    // Prepare conversation history for API including the agent's system prompt
    const apiMessages = [
      // Add the agent-specific system prompt instead of generic prompt
      { 
        role: 'system' as const, 
        content: agentPrompt.systemPrompt 
      },
      // Add existing conversation history
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      })),
      // Add the new user message
      { 
        role: 'user' as const, 
        content: userMessage 
      }
    ];

    console.log('API Messages for agent:', apiMessages);
    
    // Find a response or generate one
    // In a real implementation, this would call an API
    let responseContent = '';
    
    // Try to find a matching example dialogue
    const matchingDialogue = agentPrompt.exampleDialogues.find(dialogue => 
      dialogue.user.toLowerCase().includes(userMessage.toLowerCase()) ||
      userMessage.toLowerCase().includes(dialogue.user.toLowerCase().split(' ').filter(w => w.length > 4).join(' '))
    );
    
    if (matchingDialogue) {
      responseContent = matchingDialogue.assistant;
    } else {
      // Generate a response based on the agent's expertise and capabilities
      responseContent = generateSimulatedResponse(userMessage, agent, agentPrompt);
    }
    
    // Add a slight delay before starting to type (feels more natural)
    const startDelay = 1000 + Math.random() * 1000;
    setTimeout(() => {
      simulateTyping(responseContent);
    }, startDelay);
  };

  // Generate a simulated response based on the agent type and prompt
  const generateSimulatedResponse = (userQuery: string, agent: Agent, agentPrompt: typeof AGENT_PROMPTS[keyof typeof AGENT_PROMPTS]): string => {
    // This is a simplified response generator - in a real app, this would call an API
    const responses: Record<string, string[]> = {
      'coder': [
        "Here's the code implementation you requested:\n\n```javascript\n// Solution\nfunction solve(input) {\n  const result = input.split('').reverse().join('');\n  return result;\n}\n```\n\nThis code reverses the input string. Let me know if you need any clarification or have questions about how it works!",
        "I analyzed your requirements and created this solution:\n\n```python\ndef calculate_metrics(data):\n  return {\n    'mean': sum(data) / len(data),\n    'median': sorted(data)[len(data) // 2],\n    'range': max(data) - min(data)\n  }\n```\n\nThis function takes a list of numbers and returns basic statistical metrics. Would you like me to explain any part in more detail?",
      ],
      'writer': [
        "I've drafted a professional email as requested:\n\n**Subject: Meeting Follow-up and Next Steps**\n\nDear [Recipient],\n\nThank you for taking the time to meet with me yesterday. I appreciated your insights on [topic] and am excited about the potential collaboration we discussed.\n\nAs promised, I'm sending the additional information you requested about our [project/product]. You'll find the key points outlined below:\n\n- [Key point 1]\n- [Key point 2]\n- [Key point 3]\n\nI propose we schedule a follow-up meeting next week to discuss these points further. Would [day] at [time] work for your schedule?\n\nBest regards,\n[Your name]",
        "Here's a blog post introduction on the topic you requested:\n\n# How AI is Transforming Business Operations in 2025\n\nIn today's rapidly evolving technological landscape, Artificial Intelligence (AI) has moved beyond being a futuristic concept to becoming an integral part of business operations. As we navigate through 2025, the impact of AI on businesses across industries has reached unprecedented levels, driving efficiency, innovation, and competitive advantage.\n\nThis article explores the five most significant ways AI is transforming business operations this year, from automated decision-making processes to predictive analytics that anticipate market trends before they emerge.",
      ],
      'data-analyst': [
        "Based on the data you provided, I've identified these key insights:\n\n1. **Trend Analysis**: There's a clear 27% increase in customer engagement during evening hours (6-9 PM).\n\n2. **Anomaly Detection**: The data shows an unexpected drop in conversions on Thursdays, contrary to the overall weekly pattern.\n\n3. **Correlation**: There's a strong positive correlation (r=0.82) between email open rates and subsequent website visits.\n\n4. **Segment Performance**: The 25-34 age demographic shows the highest lifetime value, averaging 2.3x higher than other segments.\n\nWould you like me to explore any of these findings in more depth?",
        "I've analyzed your customer retention data and found these actionable insights:\n\n📊 **Churn Prediction Model Results**:\n- High-risk customers (>60% churn probability): 342 accounts\n- Medium-risk (30-60% churn probability): 1,204 accounts\n- Low-risk (<30% churn probability): 5,839 accounts\n\n🔍 **Key Churn Indicators**:\n1. Product usage frequency dropping below 2x weekly\n2. Support ticket submission in the past 30 days\n3. Price plan downgrades\n\nRecommended intervention strategies for each segment are outlined below...",
      ],
      'default': [
        "Thank you for your message. I've considered your request carefully. Based on my understanding, I recommend we approach this by first analyzing the key components, then developing a structured plan that addresses each aspect methodically. Would you like me to elaborate on any specific part of this approach?",
        "I appreciate you sharing this information with me. From what you've described, there are several important factors to consider. Let me organize these into a coherent framework that will help address your needs effectively. I'm here to provide further clarification or dig deeper into any aspect that would be most helpful for you.",
      ]
    };
    
    // Get responses for this agent type, or use default
    const agentResponses = responses[agent.id] || responses['default'];
    
    // Return a random response from the available options
    return agentResponses[Math.floor(Math.random() * agentResponses.length)];
  };

  // Handle key press in textarea
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get icon component for the agent
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
    
    return iconMap[iconName] || MessageSquare;
  };
  
  const AgentIcon = getAgentIcon(agent.avatar);

  return (
    <div className={`flex flex-col h-screen ${isDarkMode ? 'bg-[#0f0f15] text-gray-200' : 'bg-gray-50 text-gray-800'}`}>
      {/* Agent Header */}
      <header className={`flex items-center justify-between px-3 sm:px-5 py-3 ${
        isDarkMode 
          ? 'bg-[#0f0f15] border-b border-[#222233]' 
          : 'bg-gray-50 border-b border-gray-200'
      } sticky top-0 z-50`}>
        <div className="flex items-center gap-3">
          <button 
            className={`p-1.5 sm:p-2 rounded-md ${
              isDarkMode 
                ? 'hover:bg-[#222233]' 
                : 'hover:bg-gray-200'
            } transition-colors`}
            onClick={onBack}
            aria-label="Back to agents"
          >
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
              isDarkMode 
                ? 'bg-blue-900/30 text-blue-400' 
                : 'bg-blue-100 text-blue-600'
            } mr-2`}>
              <AgentIcon size={16} />
            </div>
            <div>
              <h1 className="text-base font-semibold">{agent.name}</h1>
              <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {agent.category.charAt(0).toUpperCase() + agent.category.slice(1)} Agent
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {messages.map(message => (
            <MessageBubble
              key={message.id}
              message={message}
              isDarkMode={isDarkMode}
              onRegenerate={undefined}
            />
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area */}
      <div className={`p-3 sm:p-4 border-t ${
        isDarkMode ? 'border-[#222233]' : 'border-gray-200'
      }`}>
        <div className="relative max-w-4xl mx-auto">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${agent.name} about ${agent.capabilities[0].toLowerCase()}...`}
            className={`w-full resize-none rounded-xl py-3 pl-3 sm:pl-4 pr-10 sm:pr-14 text-sm md:text-base shadow-md transition-all duration-200 ${
              isDarkMode
                ? 'bg-gray-800/80 text-gray-100 placeholder-gray-400 border-gray-700/50 hover:bg-gray-800 focus:bg-gray-800'
                : 'bg-white/90 text-gray-800 placeholder-gray-500 border-gray-200/50 hover:bg-white focus:bg-white'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500/50`}
            style={{ 
              minHeight: '44px',
              maxHeight: window.innerWidth < 640 ? '120px' : '160px',
              height: 'auto',
              scrollbarWidth: 'thin',
            }}
            disabled={isLoading}
          />

          <button
            onClick={isLoading ? handleStopGeneration : handleSendMessage}
            disabled={isLoading ? false : !input.trim()}
            className={`absolute right-2 sm:right-2.5 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-lg transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
              isLoading 
                ? isDarkMode
                  ? 'bg-red-600 hover:bg-red-700 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
                : !input.trim()
                  ? isDarkMode
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isDarkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
            aria-label={isLoading ? "Stop generating" : "Send message"}
          >
            {isLoading ? (
              <StopCircle className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Send className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentChatView;