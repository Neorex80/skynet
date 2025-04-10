import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Sparkles, Brain, Code, GitBranch, Database, Cpu, Zap, ArrowRight, Shield, PenTool, Award, Github, Linkedin } from 'lucide-react';
import ZevLogo from '../components/SkynetLogo';
import InteractiveBackground from '../components/InteractiveBackground';

interface LandingPageProps {
  isDarkMode: boolean;
}

const LandingPage: React.FC<LandingPageProps> = ({ isDarkMode }) => {
  // Refs for sections to apply scroll reveal effects
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const featuresSectionRef = useRef<HTMLDivElement>(null);
  const superagentsSectionRef = useRef<HTMLDivElement>(null);
  const contributeSectionRef = useRef<HTMLDivElement>(null);
  const ctaSectionRef = useRef<HTMLDivElement>(null);
  
  // Track which sections are visible
  const [visibleSections, setVisibleSections] = useState<Record<string, boolean>>({
    hero: false,
    features: false,
    superagents: false,
    contribute: false,
    cta: false,
  });
  
  // Add subtle parallax effect on scroll and track section visibility
  useEffect(() => {
    const handleScroll = () => {
      if (heroSectionRef.current) {
        const scrollPos = window.scrollY;
        heroSectionRef.current.style.transform = `translateY(${scrollPos * 0.1}px)`;
      }
      
      if (featuresSectionRef.current) {
        const scrollPos = window.scrollY;
        const element = featuresSectionRef.current;
        const rect = element.getBoundingClientRect();
        
        // Only apply effect when the element is in view
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          const sectionTop = rect.top + window.pageYOffset;
          const offset = (scrollPos - sectionTop) * 0.05;
          if (offset > 0) {
            featuresSectionRef.current.style.transform = `translateY(${offset}px)`;
          }
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Setup Intersection Observer for scroll reveal animations
  useEffect(() => {
    const observerOptions = {
      root: null, // use viewport
      rootMargin: '0px',
      threshold: 0.1, // trigger when at least 10% of the element is visible
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.id;
          setVisibleSections(prev => ({ ...prev, [sectionId]: true }));
          
          // Add 'revealed' class to the section element and all stagger items
          if (entry.target.classList.contains('reveal-item')) {
            entry.target.classList.add('revealed');
            
            // Find and reveal all stagger items within this section
            const staggerItems = entry.target.querySelectorAll('.stagger-item');
            staggerItems.forEach((item) => {
              item.classList.add('revealed');
            });
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observe all sections
    const sections = [
      { ref: heroSectionRef, id: 'hero' },
      { ref: featuresSectionRef, id: 'features' },
      { ref: superagentsSectionRef, id: 'superagents' },
      { ref: contributeSectionRef, id: 'contribute' },
      { ref: ctaSectionRef, id: 'cta' },
    ];
    
    sections.forEach(section => {
      if (section.ref.current) {
        observer.observe(section.ref.current);
      }
    });
    
    return () => {
      sections.forEach(section => {
        if (section.ref.current) {
          observer.unobserve(section.ref.current);
        }
      });
    };
  }, []);

  // Model data with descriptions
  const models = [
    {
      name: "Llama 3.3 70B",
      description: "Versatile foundation model with exceptional reasoning capabilities.",
      icon: "cpu",
      gradient: "from-blue-600/30 via-indigo-600/30 to-blue-600/30",
      border: "border-blue-500/40",
      badge: "Featured"
    },
    {
      name: "Gemma 2 9B",
      description: "Fast, lightweight model optimized for efficient responses.",
      icon: "zap",
      gradient: "from-amber-600/30 via-orange-600/30 to-amber-600/30",
      border: "border-amber-500/40",
      badge: "Fast"
    },
    {
      name: "DeepSeek R1",
      description: "Advanced reasoning with structured step-by-step solutions.",
      icon: "brain",
      gradient: "from-teal-600/30 via-cyan-600/30 to-teal-600/30",
      border: "border-teal-500/40",
      badge: "Reasoning"
    },
    {
      name: "Qwen QWQ 32B",
      description: "Specialized in complex problem-solving with transparent reasoning.",
      icon: "brain",
      gradient: "from-indigo-600/30 via-blue-600/30 to-indigo-600/30",
      border: "border-indigo-500/40",
      badge: "Reasoning"
    },
    {
      name: "Llama 3.1 8B",
      description: "Ultra-fast model ideal for real-time applications.",
      icon: "zap",
      gradient: "from-green-600/30 via-emerald-600/30 to-green-600/30",
      border: "border-green-500/40",
      badge: "Instant"
    }
  ];

  const renderModelIcon = (icon: string) => {
    switch (icon) {
      case "cpu":
        return <Cpu size={18} className="text-blue-300" />;
      case "zap":
        return <Zap size={18} className="text-amber-300" />;
      case "brain":
        return <Brain size={18} className="text-purple-300" />;
      default:
        return <Cpu size={18} className="text-blue-300" />;
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden ${isDarkMode ? 'bg-[#0a0a15] text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Interactive Background */}
      <InteractiveBackground isDarkMode={isDarkMode} />
      
      {/* Enhanced Floating Header with improved styling */}
      <header className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl 
        rounded-xl backdrop-blur-lg shadow-lg transition-all duration-300 
        ${isDarkMode ? 'bg-[#0f0f15]/90 border border-[#222233]' : 'bg-white/90 border border-gray-200/70'}`}>
        <div className="px-4 sm:px-6">
          <div className="flex justify-between items-center h-16">
            {/* Logo & Brand */}
            <div className="flex items-center">
              <div className="text-2xl font-bold flex items-center group">
                <ZevLogo size={30} variant={isDarkMode ? 'dark' : 'light'} className="mr-2 group-hover:scale-110 transition-transform duration-300" />
                <span className="bg-gradient-to-r from-blue-400 to-indigo-500 bg-clip-text text-transparent">Zev</span>
              </div>
            </div>
            
            {/* Navigation Links with hover effects */}
            <nav className="hidden md:flex space-x-8">
              <a 
                href="#features" 
                className="relative py-1.5 font-medium text-sm hover:text-blue-500 transition-colors"
              >
                <span>Features</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
              </a>
              <a 
                href="#models" 
                className="relative py-1.5 font-medium text-sm hover:text-blue-500 transition-colors"
              >
                <span>Models</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
              </a>
              <a 
                href="#superagents" 
                className="relative py-1.5 font-medium text-sm hover:text-blue-500 transition-colors"
              >
                <span>AI Agents</span>
                <span className={`absolute bottom-0 left-0 w-0 h-0.5 bg-blue-500 transition-all duration-300 group-hover:w-full`}></span>
              </a>
            </nav>
            
            {/* Right side elements with enhanced styling */}
            <div className="flex items-center space-x-4">
              <div className={`text-xs px-2 py-1 rounded-full ${
                isDarkMode ? 'bg-blue-900/20 text-blue-400 border border-blue-800/30' : 'bg-blue-100 text-blue-700'
              }`}>
                v0.3 (Updated: April 10, 2025)
              </div>
              <Link 
                to="/chat"
                className={`px-4 py-2 rounded-lg text-white font-medium transition-all duration-300 hover:scale-105 
                ${isDarkMode ? 
                  'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-lg shadow-blue-900/20' : 
                  'bg-blue-600 hover:bg-blue-700'}`}
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero" className="min-h-screen flex items-center justify-center pt-16 px-4 relative overflow-hidden" ref={heroSectionRef}>
        <div className={`max-w-7xl w-full mx-auto text-center mb-12 relative z-10 transition-all duration-1000 ${
          visibleSections.hero ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <div className="flex flex-col items-center justify-center">
            <div className="w-full text-center">
              <div className="flex justify-center mb-6">
                <ZevLogo size={80} variant={isDarkMode ? 'dark' : 'light'} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-600 text-transparent bg-clip-text">
                Next-Generation AI Assistant
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-3xl mx-auto">
                Experience the power of advanced AI models with a seamless, intelligent assistant designed to help you accomplish more.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link to="/chat" className="px-8 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 flex items-center justify-center">
                  Get Started
                  <ArrowRight size={16} className="ml-2" />
                </Link>
                <a href="#features" className="px-8 py-3 rounded-lg bg-[#191922] hover:bg-[#222233] text-white font-medium transition-all duration-300">
                  Explore Features
                </a>
              </div>
            </div>
          </div>

          {/* Bento Grid Layout for Hero - Responsive for mobile */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-5 mt-12">
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-2 md:row-span-2 flex flex-col justify-between ${
              isDarkMode ? 'bg-gradient-to-br from-blue-900/50 to-indigo-900/50 border border-blue-800/50' : 
              'bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200/50'
            }`}>
              <div>
                <Cpu className="mb-4 text-blue-400" size={32} />
                <h3 className="text-xl font-bold mb-2">Choose Your Model</h3>
                <p className={`${isDarkMode ? 'text-blue-200/80' : 'text-blue-900/80'}`}>
                  Select from state-of-the-art AI models optimized for different tasks, from fast responses to deep reasoning.
                </p>
              </div>
              <a href="#models" className={`mt-6 inline-flex items-center text-sm font-medium ${
                isDarkMode ? 'text-blue-400' : 'text-blue-700'
              }`}>
                Explore Models <ArrowRight size={14} className="ml-1" />
              </a>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-2 ${
              isDarkMode ? 'bg-[#1a1a24]/80 backdrop-blur-sm border border-[#222233]' : 
              'bg-white/80 backdrop-blur-sm border border-gray-200/70'
            }`}>
              <div className="flex items-start flex-col sm:flex-row">
                <div>
                  <Brain className="mb-3 text-purple-400" size={28} />
                  <h3 className="text-lg font-bold mb-2">Transparent Reasoning</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    See the AI's step-by-step thinking process with our reasoning models.
                  </p>
                </div>
                <img 
                  src="https://images.unsplash.com/photo-1633412802994-5c058f151b66?q=80&w=240&auto=format&fit=crop" 
                  alt="AI reasoning visualization" 
                  className="w-28 h-28 object-cover rounded-lg mt-4 sm:mt-0 sm:ml-auto"
                />
              </div>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl ${
              isDarkMode ? 'bg-[#1a1a24]/80 backdrop-blur-sm border border-[#222233]' : 
              'bg-white/80 backdrop-blur-sm border border-gray-200/70'
            }`}>
              <Code className="mb-3 text-green-400" size={24} />
              <h3 className="text-lg font-bold mb-2">Code Generation</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Get clean, working code with syntax highlighting and explanations.
              </p>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl ${
              isDarkMode ? 'bg-[#1a1a24]/80 backdrop-blur-sm border border-[#222233]' : 
              'bg-white/80 backdrop-blur-sm border border-gray-200/70'
            }`}>
              <Zap className="mb-3 text-amber-400" size={24} />
              <h3 className="text-lg font-bold mb-2">Multi-Agent Teams</h3>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Leverage specialized AI agents working together on complex tasks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Full-Width Bento Grid */}
      <section id="features" className="py-20 px-4 bg-[#0d0d18] relative" ref={featuresSectionRef}>
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
          visibleSections.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-12 text-center">Powerful AI Features</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-6 md:grid-cols-12 gap-4 sm:gap-5">
            {/* Large feature card spanning half the grid */}
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-6 md:row-span-2 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center mb-4">
                <MessageSquare className="text-blue-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Natural Conversations</h3>
              <p className="text-gray-400 mb-4">
                Engage in fluid, natural conversations with an AI that understands context and remembers your preferences over time.
              </p>
              <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}>
                <div className="flex mb-2">
                  <div className="w-8 h-8 rounded-full bg-blue-600/30 flex items-center justify-center text-blue-400 mr-2">U</div>
                  <div className={`py-2 px-3 rounded-lg max-w-[80%] ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-100'}`}>
                    <p className="text-sm">How does quantum computing work?</p>
                  </div>
                </div>
                <div className="flex justify-end mb-2">
                  <div className={`py-2 px-3 rounded-lg max-w-[80%] ${isDarkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                    <p className="text-sm">Quantum computers use quantum bits or "qubits" that can exist in multiple states simultaneously...</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Four square features in a 2x2 grid */}
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-3 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="w-12 h-12 rounded-lg bg-purple-600/20 flex items-center justify-center mb-4">
                <Brain className="text-purple-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Advanced Reasoning</h3>
              <p className="text-gray-400">Watch the AI's thinking process with transparent reasoning models for trustworthy responses.</p>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-3 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="w-12 h-12 rounded-lg bg-green-600/20 flex items-center justify-center mb-4">
                <Code className="text-green-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Code Assistance</h3>
              <p className="text-gray-400">Generate, debug, and optimize code across multiple programming languages with detailed explanations.</p>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-3 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="w-12 h-12 rounded-lg bg-amber-600/20 flex items-center justify-center mb-4">
                <Database className="text-amber-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Knowledge Base</h3>
              <p className="text-gray-400">Access up-to-date and accurate information across domains with detailed responses.</p>
            </div>
            
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-3 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="w-12 h-12 rounded-lg bg-red-600/20 flex items-center justify-center mb-4">
                <Shield className="text-red-500" size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-3">Privacy Focused</h3>
              <p className="text-gray-400">All conversations are stored locally in your browser with no data sharing to third parties.</p>
            </div>
            
            {/* Wide feature card spanning bottom */}
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-6 md:col-span-12 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-cyan-600/20 flex items-center justify-center">
                  <GitBranch className="text-cyan-500" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">Multiple Foundation and Reasoning Models</h3>
                  <p className="text-gray-400">Choose from a variety of cutting-edge AI models to find the perfect balance of speed, capability, and specialization.</p>
                </div>
                <div className="shrink-0">
                  <Link to="/chat" className="inline-flex items-center px-4 py-2 bg-cyan-600/20 text-cyan-400 rounded-lg hover:bg-cyan-600/30 transition-colors">
                    Explore Models <ArrowRight className="ml-2" size={16} />
                  </Link>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'} text-center`}>Llama 3.3 70B</div>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'} text-center`}>Gemma 2 9B</div>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'} text-center`}>DeepSeek R1</div>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'} text-center`}>Qwen QWQ 32B</div>
                <div className={`p-2 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'} text-center`}>Llama 3.1 8B</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Superagents Section with Full-Width Bento Grid */}
      <section id="superagents" className="py-20 px-4 bg-[#0d0d18] relative" ref={superagentsSectionRef}>
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
          visibleSections.superagents ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">AI Superagents</h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Experience our multi-agent systems that combine specialized AI models working together.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5">
            {/* Main superagent card - full width */}
            <div className={`p-4 sm:p-6 rounded-xl sm:col-span-12 ${
              isDarkMode ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-indigo-800/40 backdrop-blur-sm' : 
              'bg-gradient-to-r from-blue-50 to-purple-50 border border-indigo-200/40'
            }`}>
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Zap size={32} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold">Blog Creation Superagent</h3>
                  <p className={`text-base ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Let our team of specialized AI agents work together to create high-quality blog posts on any topic.
                  </p>
                </div>
                <Link to="/superagents" className={`px-6 py-3 rounded-lg text-sm font-medium ${
                  isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                } whitespace-nowrap flex items-center`}>
                  Try Now <ArrowRight size={14} className="ml-1" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className={`flex p-4 rounded-lg ${
                  isDarkMode ? 'bg-[#13131e]/80 backdrop-blur-sm' : 'bg-white/80'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                    ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <span className="text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Researcher</h5>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Gathers facts and information about your topic
                    </p>
                  </div>
                </div>
                
                <div className={`flex p-4 rounded-lg ${
                  isDarkMode ? 'bg-[#13131e]/80 backdrop-blur-sm' : 'bg-white/80'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                    ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <span className="text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Writer</h5>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Creates engaging content from the research
                    </p>
                  </div>
                </div>
                
                <div className={`flex p-4 rounded-lg ${
                  isDarkMode ? 'bg-[#13131e]/80 backdrop-blur-sm' : 'bg-white/80'
                }`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 flex-shrink-0
                    ${isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
                    <span className="text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h5 className="font-medium text-sm">Editor</h5>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} mt-1`}>
                      Polishes and optimizes the final content
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Additional superagent showcase with images */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 sm:gap-5 mt-5">
            <div className={`rounded-xl sm:col-span-8 overflow-hidden ${
              isDarkMode ? 'border border-[#222233]' : 'border border-gray-200'
            }`}>
              <img 
                src="https://images.unsplash.com/photo-1600132806608-231446b2e7af?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="AI collaboration visualization" 
                className="w-full h-48 md:h-64 object-cover"
              />
              <div className={`p-5 ${isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm' : 'bg-white'}`}>
                <h3 className="text-lg font-bold mb-1">Multi-Agent Collaboration</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Our AI agents work together, each bringing specialized skills to solve complex problems.
                </p>
              </div>
            </div>
            
            <div className={`p-5 rounded-xl sm:col-span-4 ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            }`}>
              <div className="flex flex-col justify-between h-full">
                <div>
                  <Sparkles className="mb-3 text-amber-400" size={24} />
                  <h3 className="text-lg font-bold mb-2">Coming Soon</h3>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                    More specialized superagents for different tasks and domains.
                  </p>
                  <ul className="mt-4 space-y-2">
                    <li className="flex items-center">
                      <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-500'} mr-2`}></span>
                      <span className="text-xs">Code Project Builder</span>
                    </li>
                    <li className="flex items-center">
                      <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-500'} mr-2`}></span>
                      <span className="text-xs">Research Paper Analyzer</span>
                    </li>
                    <li className="flex items-center">
                      <span className={`w-2 h-2 rounded-full ${isDarkMode ? 'bg-amber-400' : 'bg-amber-500'} mr-2`}></span>
                      <span className="text-xs">Marketing Campaign Creator</span>
                    </li>
                  </ul>
                </div>
                <div className="mt-6">
                  <div className={`text-xs inline-block px-3 py-1 rounded-full ${
                    isDarkMode ? 'bg-amber-900/20 text-amber-400' : 'bg-amber-100 text-amber-700'
                  }`}>
                    Coming Q3 2025
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribute Section */}
      <section id="contribute" className="py-20 px-4 relative reveal-item" ref={contributeSectionRef}>
        <div className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
          visibleSections.contribute ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">Join Our Community</h2>
          <p className="text-center text-gray-400 mb-12 max-w-3xl mx-auto">
            Help us make Zev even better by contributing to our open-source project
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6">
            <div className={`p-6 rounded-xl sm:col-span-6 stagger-item ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-100'
                } mr-3`}>
                  <Github size={20} className={isDarkMode ? 'text-white' : 'text-gray-800'} />
                </div>
                <h3 className="text-xl font-bold">GitHub</h3>
              </div>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Explore our codebase, open issues, and contribute to development. Star the repository to show your support!
              </p>
              <a 
                href="https://github.com/Neorex80/skynet"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode ? 'bg-[#0f0f15] hover:bg-[#1a1a24] text-white' : 'bg-gray-900 hover:bg-gray-800 text-white'
                }`}
              >
                <Github size={16} className="mr-2" />
                View on GitHub
              </a>
            </div>
            
            <div className={`p-6 rounded-xl sm:col-span-6 stagger-item ${
              isDarkMode ? 'bg-[#13131e]/90 backdrop-blur-sm border border-[#222233]' : 'bg-white border border-gray-200'
            } hover:shadow-xl transition-all duration-300`}>
              <div className="flex items-center mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-100'
                } mr-3`}>
                  <Linkedin size={20} className={isDarkMode ? 'text-blue-400' : 'text-blue-600'} />
                </div>
                <h3 className="text-xl font-bold">Connect with the Creator</h3>
              </div>
              <p className={`text-sm mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Follow the creator on LinkedIn to stay updated on project developments and connect with the community.
              </p>
              <a 
                href="https://www.linkedin.com/in/devrex/"
                target="_blank"
                rel="noopener noreferrer"
                className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium ${
                  isDarkMode ? 'bg-blue-800/30 hover:bg-blue-800/50 text-blue-400' : 'bg-blue-100 hover:bg-blue-200 text-blue-700'
                }`}
              >
                <Linkedin size={16} className="mr-2" />
                Connect on LinkedIn
              </a>
            </div>
            
            {/* Full-width contribution card */}
            <div className={`p-6 rounded-xl sm:col-span-12 stagger-item ${
              isDarkMode ? 'bg-gradient-to-br from-blue-900/20 to-purple-900/20 border border-blue-800/30 backdrop-blur-sm' : 
              'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/30'
            }`}>
              <div className="sm:flex items-start gap-6">
                <div className="sm:w-1/2 mb-6 sm:mb-0">
                  <h3 className="text-xl font-bold mb-3">How You Can Help</h3>
                  <p className={`mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                    Whether you're a developer, designer, or AI enthusiast, there are many ways to contribute to Zev:
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#13131e]/80 backdrop-blur-sm' : 'bg-white'}`}>
                      <Code size={20} className={`mb-2 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                      <h4 className="font-medium mb-1">Contribute Code</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Submit pull requests for new features or bug fixes
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#13131e]/80 backdrop-blur-sm' : 'bg-white'}`}>
                      <PenTool size={20} className={`mb-2 ${isDarkMode ? 'text-purple-400' : 'text-purple-600'}`} />
                      <h4 className="font-medium mb-1">Improve UI/UX</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Help enhance the user interface and experience
                      </p>
                    </div>
                    <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#13131e]/80 backdrop-blur-sm' : 'bg-white'}`}>
                      <MessageSquare size={20} className={`mb-2 ${isDarkMode ? 'text-green-400' : 'text-green-600'}`} />
                      <h4 className="font-medium mb-1">Report Issues</h4>
                      <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        Help us identify and fix bugs and problems
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="sm:w-1/2">
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]/80' : 'bg-white/80'} mb-6`}>
                    <h4 className="font-bold mb-2">Quick Start for Contributors</h4>
                    <div className={`p-3 rounded-lg font-mono text-xs overflow-x-auto ${
                      isDarkMode ? 'bg-[#13131e]' : 'bg-gray-50'
                    }`}>
                      <div className="mb-1 text-green-400"># Clone the repository</div>
                      <div className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        git clone https://github.com/Neorex80/skynet.git
                      </div>
                      
                      <div className="mb-1 text-green-400"># Install dependencies</div>
                      <div className={`mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        npm install
                      </div>
                      
                      <div className="mb-1 text-green-400"># Start development server</div>
                      <div className={`${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        npm run dev
                      </div>
                    </div>
                  </div>
                  
                  <a 
                    href="https://github.com/Neorex80/skynet#contributing" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`w-full flex items-center justify-center px-6 py-3 rounded-lg font-medium ${
                      isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    Read Contribution Guidelines
                    <ArrowRight size={16} className="ml-2" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="py-20 px-4 relative" ref={ctaSectionRef}>
        <div className={`max-w-4xl mx-auto bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl p-10 border border-blue-500/30 text-center backdrop-blur-sm transition-all duration-1000 transform ${
          visibleSections.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
        }`}>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Experience the Future of AI?</h2>
          <p className="text-xl text-gray-300 mb-8">Start using Zev's powerful AI assistants today.</p>
          <Link to="/chat" className="inline-flex items-center justify-center px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all duration-300 transform hover:scale-105 group">
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transition-transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 px-4 border-t relative z-10 ${isDarkMode ? 'border-[#222233]' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Logo and about */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <ZevLogo size={36} variant={isDarkMode ? 'dark' : 'light'} className="mr-2" />
                <span className="text-2xl font-bold">Zev</span>
              </div>
              <p className={`mb-4 max-w-md ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Next-generation AI assistant platform combining multiple state-of-the-art models within an intuitive, feature-rich interface.
              </p>
              <div className="flex space-x-4">
                <a 
                  href="https://github.com/Neorex80/skynet" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'bg-[#1a1a24] hover:bg-[#222233]' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Github size={20} />
                </a>
                <a 
                  href="https://www.linkedin.com/in/devrex/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className={`p-2 rounded-full ${
                    isDarkMode ? 'bg-[#1a1a24] hover:bg-[#222233]' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <Linkedin size={20} />
                </a>
              </div>
            </div>
            
            {/* Links */}
            <div>
              <h4 className="font-bold mb-4">Explore</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="#features" className="hover:text-blue-500 transition-colors">Features</a></li>
                <li><a href="#models" className="hover:text-blue-500 transition-colors">Models</a></li>
                <li><a href="#superagents" className="hover:text-blue-500 transition-colors">Superagents</a></li>
                <li><Link to="/agents" className="hover:text-blue-500 transition-colors">AI Agents</Link></li>
              </ul>
            </div>
            
            {/* Resources */}
            <div>
              <h4 className="font-bold mb-4">Resources</h4>
              <ul className={`space-y-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                <li><a href="https://github.com/Neorex80/skynet#documentation" className="hover:text-blue-500 transition-colors">Documentation</a></li>
                <li><a href="https://github.com/Neorex80/skynet/issues" className="hover:text-blue-500 transition-colors">Report an Issue</a></li>
                <li><a href="https://github.com/Neorex80/skynet#contributing" className="hover:text-blue-500 transition-colors">Contribute</a></li>
                <li><Link to="/chat" className="hover:text-blue-500 transition-colors">Get Started</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-[#222233] pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-500 mb-4 md:mb-0">© 2025 Zev AI Assistant. All rights reserved.</p>
            <div className="flex space-x-6 text-sm text-gray-500">
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Cookie Policy</a>
            </div>
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

// Add custom CSS for animations
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

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.scroll-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease, transform 0.6s ease;
}

.scroll-reveal.visible {
  opacity: 1;
  transform: translateY(0);
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