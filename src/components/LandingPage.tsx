import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, MessageSquare, Sparkles, Brain, Shield, Code, GitBranch, Database, Cpu, Gauge, Zap, ArrowRight } from 'lucide-react';

interface LandingPageProps {
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode }) => {
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

      {/* Models Section */}
      <section id="models" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Cutting-Edge AI Models</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Model Card */}
            <div className="bg-[#13131e] rounded-xl overflow-hidden border border-[#222233] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <span className="mr-3">Llama 3.3 70B</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-blue-600/20 text-blue-400">Featured</span>
                </h3>
                <p className="text-gray-400 mb-4">Large-context powerful foundation model with exceptional versatility and reasoning capabilities.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parameters</span>
                    <span className="text-gray-300">70 Billion</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Context Length</span>
                    <span className="text-gray-300">128K tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Speed</span>
                    <span className="text-gray-300">Medium</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#0d0d18] text-sm font-medium">
                Best for: General-purpose tasks, complex reasoning, creative content
              </div>
            </div>
            
            {/* Model Card */}
            <div className="bg-[#13131e] rounded-xl overflow-hidden border border-[#222233] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Mixtral 8x7B</h3>
                <p className="text-gray-400 mb-4">Mixture-of-experts model providing excellent performance with reasonable resource requirements.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parameters</span>
                    <span className="text-gray-300">8x7B MoE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Context Length</span>
                    <span className="text-gray-300">32K tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Speed</span>
                    <span className="text-gray-300">Medium-High</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#0d0d18] text-sm font-medium">
                Best for: Balanced performance and efficiency, multi-domain tasks
              </div>
            </div>
            
            {/* Model Card */}
            <div className="bg-[#13131e] rounded-xl overflow-hidden border border-[#222233] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">Gemma 2 9B</h3>
                <p className="text-gray-400 mb-4">A lightweight but capable model optimized for efficiency and fast responses.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parameters</span>
                    <span className="text-gray-300">9 Billion</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Context Length</span>
                    <span className="text-gray-300">32K tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Speed</span>
                    <span className="text-gray-300">Very fast</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#0d0d18] text-sm font-medium">
                Best for: Quick responses, mobile applications, efficiency
              </div>
            </div>
            
            {/* Model Card for Reasoning */}
            <div className="bg-[#13131e] rounded-xl overflow-hidden border border-[#222233] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <span className="mr-3">Qwen QWQ 32B</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-600/20 text-indigo-400">Reasoning</span>
                </h3>
                <p className="text-gray-400 mb-4">Advanced reasoning model with exceptional logical and analytical capabilities.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parameters</span>
                    <span className="text-gray-300">32 Billion</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Context Length</span>
                    <span className="text-gray-300">32K tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Speed</span>
                    <span className="text-gray-300">Medium</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#0d0d18] text-sm font-medium">
                Best for: Complex problem solving, mathematical reasoning, step-by-step explanations
              </div>
            </div>
            
            {/* Model Card for Reasoning */}
            <div className="bg-[#13131e] rounded-xl overflow-hidden border border-[#222233] transition-all duration-300 hover:transform hover:scale-[1.02] hover:shadow-xl hover:border-blue-500/30">
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 flex items-center">
                  <span className="mr-3">DeepSeek R1</span>
                  <span className="px-2 py-0.5 text-xs rounded-full bg-indigo-600/20 text-indigo-400">Reasoning</span>
                </h3>
                <p className="text-gray-400 mb-4">High-capacity reasoning model offering exceptional depth for complex tasks.</p>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Parameters</span>
                    <span className="text-gray-300">70 Billion</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Context Length</span>
                    <span className="text-gray-300">128K tokens</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Response Speed</span>
                    <span className="text-gray-300">Medium</span>
                  </div>
                </div>
              </div>
              <div className="px-6 py-3 bg-[#0d0d18] text-sm font-medium">
                Best for: Advanced reasoning, step-by-step solutions, scientific domains
              </div>
            </div>
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