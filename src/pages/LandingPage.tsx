import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Sparkles, Brain, Shield, Code, GitBranch, Database, Cpu, Gauge, Zap, ArrowRight, ArrowDown } from 'lucide-react';

interface LandingPageProps {
  isDarkMode: boolean;
}

// Define model interface for proper typing
interface Model {
  id: string;
  name: string;
  description: string;
  category: string;
  badge?: string;
  specs: {
    parameters: string;
    contextWindow: string;
    responseSpeed: string;
  };
  useCases: string[];
  gradient?: string;
}

const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode }) => {
  // Define models data
  const models: Model[] = [
    {
      id: 'llama-3.3-70b-versatile',
      name: 'Llama 3.3 70B',
      description: 'Large-context powerful foundation model with exceptional versatility and reasoning capabilities.',
      category: 'Foundation',
      badge: 'Featured',
      specs: {
        parameters: '70 Billion',
        contextWindow: '128K tokens',
        responseSpeed: 'Medium',
      },
      useCases: ['General-purpose tasks', 'Complex reasoning', 'Creative content'],
      gradient: 'from-blue-600 to-indigo-600'
    },
    {
      id: 'gemma2-9b-it',
      name: 'Gemma 2 9B',
      description: 'A lightweight but capable model optimized for efficiency and fast responses.',
      category: 'Foundation',
      specs: {
        parameters: '9 Billion',
        contextWindow: '32K tokens',
        responseSpeed: 'Very fast',
      },
      useCases: ['Quick responses', 'Mobile applications', 'Efficiency'],
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      id: 'mixtral-8x7b-32768',
      name: 'Mixtral 8x7B',
      description: 'Mixture-of-experts model providing excellent performance with reasonable resource requirements.',
      category: 'Foundation',
      specs: {
        parameters: '8x7B MoE',
        contextWindow: '32K tokens',
        responseSpeed: 'Medium-High',
      },
      useCases: ['Multi-domain tasks', 'Balanced performance', 'Content generation'],
      gradient: 'from-purple-500 to-violet-600'
    },
    {
      id: 'llama-3.1-8b-instant',
      name: 'Llama 3.1 8B',
      description: 'Optimized version for real-time applications and quick interaction.',
      category: 'Foundation',
      badge: 'Fast',
      specs: {
        parameters: '8 Billion',
        contextWindow: '8K tokens',
        responseSpeed: 'Ultra fast',
      },
      useCases: ['Chat applications', 'Real-time responses', 'Mobile devices'],
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 'qwen-qwq-32b',
      name: 'Qwen QWQ 32B',
      description: 'Advanced reasoning model with exceptional logical and analytical capabilities.',
      category: 'Reasoning',
      specs: {
        parameters: '32 Billion',
        contextWindow: '32K tokens',
        responseSpeed: 'Medium',
      },
      useCases: ['Complex problem solving', 'Mathematical reasoning', 'Step-by-step explanations'],
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'deepseek-r1-distill-qwen-32b',
      name: 'DeepSeek R1 (Qwen 32B)',
      description: 'Knowledge-focused reasoning model with deep understanding capabilities.',
      category: 'Reasoning',
      specs: {
        parameters: '32 Billion',
        contextWindow: '64K tokens',
        responseSpeed: 'Medium-High',
      },
      useCases: ['Research assistance', 'Knowledge-intensive tasks', 'Complex explanations'],
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      id: 'deepseek-r1-distill-llama-70b',
      name: 'DeepSeek R1 (Llama 70B)',
      description: 'High-capacity reasoning model offering exceptional depth for complex tasks.',
      category: 'Reasoning',
      specs: {
        parameters: '70 Billion',
        contextWindow: '128K tokens',
        responseSpeed: 'Medium',
      },
      useCases: ['Advanced reasoning', 'Step-by-step solutions', 'Scientific domains'],
      gradient: 'from-indigo-500 to-purple-600'
    },
  ];

  // Filter models by category
  const foundationModels = models.filter(model => model.category === 'Foundation');
  const reasoningModels = models.filter(model => model.category === 'Reasoning');

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#0a0a15] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header/Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 border-b ${
        isDarkMode ? 'bg-[#0f0f15]/80 backdrop-blur-md border-[#222233]' : 'bg-white/80 backdrop-blur-md border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold flex items-center">
                <Bot className="mr-2 text-blue-500" size={28} />
                <span>Skynet</span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
              <a href="#models" className="hover:text-blue-500 transition-colors">Models</a>
              <a href="#agents" className="hover:text-blue-500 transition-colors">AI Agents</a>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/chat" className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
            Next-Generation AI Assistant
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
            Experience the power of advanced AI models with a seamless, intelligent assistant designed to help you accomplish more.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
              Get Started
              <ArrowRight size={16} className="ml-2" />
            </Link>
            <a href="#features" className="px-8 py-3 rounded-lg bg-[#191922] hover:bg-[#222233] text-white font-medium transition-all duration-300">
              Explore Features
            </a>
          </div>
        </div>

        {/* Floating models preview - decorative element */}
        <div className="relative max-w-4xl mx-auto mt-12 hidden md:block">
          <div className="absolute -top-8 left-20 transform -rotate-6 p-4 bg-[#13131e] rounded-lg border border-[#222233] shadow-xl w-60 opacity-70 animate-float">
            <div className="flex items-center mb-2">
              <Cpu size={16} className="mr-2 text-blue-400" />
              <span className="text-sm font-medium">Llama 3.3 70B</span>
            </div>
            <div className="text-xs text-gray-400">Foundation model with exceptional capabilities...</div>
          </div>
          <div className="absolute top-10 right-24 transform rotate-3 p-4 bg-[#13131e] rounded-lg border border-[#222233] shadow-xl w-64 opacity-80 animate-float-delayed">
            <div className="flex items-center mb-2">
              <Gauge size={16} className="mr-2 text-purple-400" />
              <span className="text-sm font-medium">DeepSeek R1</span>
            </div>
            <div className="text-xs text-gray-400">Advanced reasoning with step-by-step explanation...</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-[#0d0d18]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Powerful AI Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Conversations</h3>
              <p className="text-gray-400">Engage in fluid, natural conversations with an AI that understands context and remembers your preferences.</p>
            </div>
            
            {/* Feature Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                <Brain className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Reasoning</h3>
              <p className="text-gray-400">Watch the AI's thinking process with models that show their reasoning for more transparent and trustworthy responses.</p>
            </div>
            
            {/* Feature Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-4">
                <Code className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Code Assistance</h3>
              <p className="text-gray-400">Generate, debug, and optimize code across multiple programming languages with detailed explanations.</p>
            </div>
            
            {/* Feature Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center mb-4">
                <Database className="text-amber-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Knowledge Database</h3>
              <p className="text-gray-400">Access a vast knowledge base with the ability to provide up-to-date and accurate information across domains.</p>
            </div>
            
            {/* Feature Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
                <Shield className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
              <p className="text-gray-400">Your conversations stay private with local storage options and no data sharing with third parties.</p>
            </div>
            
            {/* Feature Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center mb-4">
                <GitBranch className="text-cyan-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Multiple Models</h3>
              <p className="text-gray-400">Choose from a variety of cutting-edge AI models to find the perfect balance of speed, capability, and specialization.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Models Section with NEW DESIGN */}
      <section id="models" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Cutting-Edge AI Models</h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Select from our range of powerful AI models, each optimized for specific use cases and performance characteristics
          </p>
          
          {/* Models Tabs Navigation */}
          <div className="flex justify-center mb-12">
            <div className={`inline-flex rounded-full p-1 text-sm ${
              isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-gray-100'
            }`}>
              <a href="#foundation-models" className={`rounded-full px-5 py-2 ${
                isDarkMode 
                  ? 'bg-blue-600 text-white font-medium' 
                  : 'bg-blue-600 text-white font-medium'
              }`}>
                Foundation Models
              </a>
              <a href="#reasoning-models" className={`rounded-full px-5 py-2 ${
                isDarkMode 
                  ? 'text-gray-400 hover:text-gray-200' 
                  : 'text-gray-700 hover:text-gray-900'
              }`}>
                Reasoning Models
              </a>
            </div>
          </div>

          {/* Foundation Models Section */}
          <div id="foundation-models" className="mb-16">
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <Cpu size={20} className="mr-2 text-blue-400" />
              Foundation Models
              <span className="ml-3 text-sm px-2 py-0.5 rounded-full bg-blue-900/30 text-blue-400">
                Versatile & General
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {foundationModels.map((model) => (
                <div key={model.id} className="relative group">
                  {/* Model card with hover effects */}
                  <div className={`rounded-2xl overflow-hidden border border-[#222233] transition-all duration-500 
                    transform group-hover:scale-[1.01] group-hover:shadow-xl bg-[#13131e] h-full
                    ${model.badge ? 'group-hover:border-blue-500/50' : 'group-hover:border-purple-500/50'}`
                  }>
                    {/* Top gradient bar */}
                    <div className={`h-1.5 w-full bg-gradient-to-r ${model.gradient || 'from-blue-600 to-indigo-600'}`} />
                    
                    <div className="p-6">
                      {/* Model Header */}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="text-xl font-bold mb-1 flex items-center">
                            <span className="mr-2">{model.name}</span>
                            {model.badge && (
                              <span className={`text-xs px-2 py-0.5 rounded-full bg-gradient-to-r ${
                                model.badge === 'Featured' 
                                  ? 'from-blue-600/20 to-indigo-600/20 text-blue-400'
                                  : 'from-amber-600/20 to-orange-600/20 text-amber-400'
                              }`}>
                                {model.badge}
                              </span>
                            )}
                          </h4>
                          <p className={`text-sm text-gray-400 h-[40px] overflow-hidden line-clamp-2`}>
                            {model.description}
                          </p>
                        </div>
                        <div className="flex items-center">
                          {/* Button that shows on hover */}
                          <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                            py-1.5 px-3 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-full flex items-center">
                            Select
                            <ArrowRight size={14} className="ml-1" />
                          </button>
                        </div>
                      </div>
                      
                      {/* Model Specifications */}
                      <div className="mb-5">
                        <div className="grid grid-cols-3 gap-2 mb-4">
                          <div className="p-3 rounded-lg bg-[#0f0f15]">
                            <div className="text-xs text-gray-500 mb-1">Parameters</div>
                            <div className="font-medium text-sm truncate">{model.specs.parameters}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#0f0f15]">
                            <div className="text-xs text-gray-500 mb-1">Context</div>
                            <div className="font-medium text-sm truncate">{model.specs.contextWindow}</div>
                          </div>
                          <div className="p-3 rounded-lg bg-[#0f0f15]">
                            <div className="text-xs text-gray-500 mb-1">Speed</div>
                            <div className="font-medium text-sm truncate">{model.specs.responseSpeed}</div>
                          </div>
                        </div>
                      </div>

                      {/* Use cases */}
                      <div className="flex flex-wrap gap-2">
                        {model.useCases.map((useCase, index) => (
                          <span key={index} className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">
                            {useCase}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Bottom action area */}
                    <div className="px-6 py-3 bg-[#0f0f18] flex justify-between items-center">
                      <span className="text-xs text-gray-500">Explore capabilities</span>
                      <ArrowDown size={14} className="text-gray-500 group-hover:text-blue-400 transition-colors" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Reasoning Models Section */}
          <div id="reasoning-models">
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <Gauge size={20} className="mr-2 text-purple-400" />
              Reasoning Models
              <span className="ml-3 text-sm px-2 py-0.5 rounded-full bg-purple-900/30 text-purple-400">
                Step-by-Step Thinking
              </span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {reasoningModels.map((model) => (
                <div key={model.id} className={`rounded-xl overflow-hidden border-t-4 border-t-purple-500
                  border-l border-r border-b border-[#222233] bg-[#13131e] hover:shadow-xl
                  transition-all duration-300 hover:scale-[1.02] hover:border-purple-500/50`}
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <h4 className="text-xl font-bold mb-1">{model.name}</h4>
                      <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-600/20 text-indigo-400">
                        Reasoning
                      </span>
                    </div>
                    
                    <p className="text-gray-400 mb-4 text-sm h-[40px] overflow-hidden line-clamp-2">
                      {model.description}
                    </p>
                    
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Parameters</span>
                        <span className="text-gray-300">{model.specs.parameters}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Context</span>
                        <span className="text-gray-300">{model.specs.contextWindow}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Response</span>
                        <span className="text-gray-300">{model.specs.responseSpeed}</span>
                      </div>
                    </div>
                    
                    {/* Apply Now Button */}
                    <button className="w-full mt-2 py-2.5 px-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 
                      text-white font-medium flex items-center justify-center group transition-transform hover:translate-y-[-2px]">
                      <span>Try Now</span>
                      <ArrowRight size={16} className="ml-2 transform transition-transform group-hover:translate-x-1" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Compare Models Button */}
          <div className="flex justify-center mt-12">
            <button className={`px-6 py-3 rounded-lg font-medium 
              border border-[#222233] hover:bg-[#1a1a24] bg-[#0f0f15]
              flex items-center gap-2`}>
              <span>Compare All Models</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section id="agents" className="py-20 px-4 bg-[#0d0d18]">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">Specialized AI Agents</h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">Access purpose-built AI agents designed for specific tasks, each with specialized knowledge and capabilities.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Agent Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-blue-900/30 text-blue-400 mr-3">
                  <Code size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Code Wizard</h3>
                  <div className="text-xs text-blue-400">Development</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">Specialized in writing, debugging, and optimizing code across multiple programming languages.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Code generation</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Debugging</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Optimization</span>
              </div>
            </div>
            
            {/* Agent Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-purple-900/30 text-purple-400 mr-3">
                  <span className="text-xl font-bold">A</span>
                </div>
                <div>
                  <h3 className="font-bold">Content Composer</h3>
                  <div className="text-xs text-purple-400">Creative</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">Creates persuasive and engaging written content for various purposes and audiences.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Blog posts</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Marketing copy</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Emails</span>
              </div>
            </div>
            
            {/* Agent Card */}
            <div className="bg-[#13131e] p-6 rounded-xl border border-[#222233] hover:border-blue-500/50 transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center bg-green-900/30 text-green-400 mr-3">
                  <Database size={20} />
                </div>
                <div>
                  <h3 className="font-bold">Data Sage</h3>
                  <div className="text-xs text-green-400">Analysis</div>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-4 line-clamp-2">Analyzes data, identifies patterns, and generates actionable insights from complex datasets.</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Data analysis</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Visualization</span>
                <span className="text-xs px-2 py-1 rounded-full bg-[#0f0f15] text-gray-300">Insights</span>
              </div>
            </div>
          </div>
          
          {/* Superagents Section */}
          <div className="mt-12 pt-12 border-t border-[#222233]">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2">Superagents: AI Teams Working Together</h3>
              <p className="text-gray-400 max-w-2xl mx-auto">Experience our cutting-edge multi-agent system where specialized AI models collaborate to produce superior results.</p>
            </div>
            
            <div className="bg-[#191922] border border-[#222233] p-6 sm:p-8 rounded-xl">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Zap size={24} className="text-white" />
                </div>
                <div className="ml-4">
                  <h4 className="text-xl font-bold">Blog Creation Superagent</h4>
                  <p className="text-sm text-gray-400">A team of specialists creating high-quality blog posts</p>
                </div>
                <Link to="/superagents" className="ml-auto bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors text-sm flex items-center">
                  Try it <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="flex bg-[#13131e] p-4 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Researcher</h5>
                    <p className="text-xs text-gray-400 mt-1">Gathers facts and information about your topic</p>
                  </div>
                </div>
                
                <div className="flex bg-[#13131e] p-4 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Writer</h5>
                    <p className="text-xs text-gray-400 mt-1">Creates engaging content from the research</p>
                  </div>
                </div>
                
                <div className="flex bg-[#13131e] p-4 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-3 flex-shrink-0">
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Editor</h5>
                    <p className="text-xs text-gray-400 mt-1">Polishes and optimizes the final content</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center mt-10">
            <Link to="/chat" className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center">
              <Sparkles size={18} className="mr-2" />
              Try AI Assistants Now
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-10 border border-blue-500/30 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of AI?</h2>
          <p className="text-xl text-gray-300 mb-8">Explore cutting-edge AI models and superagents designed to enhance your productivity and creativity.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/chat" className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 group flex items-center justify-center">
              Get Started Now
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t ${isDarkMode ? 'border-[#222233]' : 'border-gray-200'}`}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-2xl font-bold flex items-center mb-6 md:mb-0">
              <Bot className="mr-2 text-blue-500" size={28} />
              <span>Skynet</span>
            </div>
            <div className="flex flex-wrap justify-center gap-8 mb-6 md:mb-0">
              <a href="#features" className="hover:text-blue-500 transition-colors">Features</a>
              <a href="#models" className="hover:text-blue-500 transition-colors">Models</a>
              <a href="#agents" className="hover:text-blue-500 transition-colors">AI Agents</a>
              <Link to="/chat" className="hover:text-blue-500 transition-colors">Get Started</Link>
            </div>
          </div>
          <div className="border-t border-[#222233] mt-8 pt-8 text-center text-sm text-gray-500">
            <p>© 2025 Skynet AI Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Fixed "Get Started" button that appears when scrolling */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link 
          to="/chat" 
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all hover:scale-110"
          aria-label="Get Started"
        >
          <ArrowRight size={24} />
        </Link>
      </div>
    </div>
  );
};

// CSS for floating animation
const styles = `
@keyframes float {
  0% { transform: translateY(0px) rotate(-6deg); }
  50% { transform: translateY(-10px) rotate(-6deg); }
  100% { transform: translateY(0px) rotate(-6deg); }
}

@keyframes float-delayed {
  0% { transform: translateY(0px) rotate(3deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
  100% { transform: translateY(0px) rotate(3deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.animate-float-delayed {
  animation: float-delayed 8s ease-in-out infinite;
}
`;

// Add the styles to the document
(() => {
  if (typeof document !== 'undefined') {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);
  }
})();

export default LandingPage;