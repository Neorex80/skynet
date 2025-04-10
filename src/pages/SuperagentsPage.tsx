import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Edit, FileText, Search, Zap, Brain, BookOpen, PenTool, Info, CheckCircle, AlertTriangle, Clock, RotateCcw, Code, Database, MessageSquare, ChevronRight, Copy, X, BarChart } from 'lucide-react';
import { Agent } from '../types';
import { createBlogCrewWorkflow, createResearchAnalysisWorkflow } from '../lib/crewai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ZevLogo from '../components/SkynetLogo';

// Superagent type
interface Superagent {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  gradient: string;
  agents: string[];
  status: 'active' | 'coming-soon';
  releaseDate?: string;
}

const SuperagentsPage: React.FC = () => {
  const [isDarkMode] = useState(true);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [topic, setTopic] = useState('');
  const [paperContent, setPaperContent] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [stepResults, setStepResults] = useState<string[]>([]);
  const [finalContent, setFinalContent] = useState('');
  const [error, setError] = useState('');
  const [progressStatus, setProgressStatus] = useState<'idle' | 'running' | 'complete' | 'error'>('idle');
  const contentRef = useRef<HTMLDivElement>(null);
  const [currentTip, setCurrentTip] = useState('');
  const [copiedStep, setCopiedStep] = useState<number | null>(null);
  const [copiedFinal, setCopiedFinal] = useState(false);
  const [showStepOutputs, setShowStepOutputs] = useState<boolean[]>([false, false, false]);

  // Blog creator agents
  const BLOG_CREATOR_AGENTS: Agent[] = [
    {
      id: 'researcher',
      name: 'Researcher',
      role: 'Research Specialist',
      description: 'Finds relevant facts, statistics, and background information on the given topic.',
      model: 'deepseek-r1-distill-qwen-32b',
      systemPrompt: `You're a research helper. Look into the topic: {topic}.
Give a few bullet points with easy-to-read facts, stats, and some background details.`
    },
    {
      id: 'writer',
      name: 'Writer',
      role: 'Content Creator',
      description: 'Transforms research into an engaging, well-structured blog post.',
      model: 'llama-3.1-8b-instant',
      systemPrompt: `Using the info below:
{research}
Write a blog post about {topic} that is friendly and fun.
Include a clear title, a simple introduction, organized sections with headings, and a brief conclusion.
Please output your answer in Markdown format.`
    },
    {
      id: 'editor',
      name: 'Editor',
      role: 'Content Improver',
      description: 'Polishes the draft for clarity, flow, and readability.',
      model: 'llama-3.1-8b-instant',
      systemPrompt: `Improve the draft below:
{content}
Make the post clear and engaging.
Keep it simple and easy to read.
Return the final version in Markdown with proper headings.`
    }
  ];

  // Research analyzer agents
  const RESEARCH_ANALYZER_AGENTS: Agent[] = [
    {
      id: 'reviewer',
      name: 'Reviewer',
      role: 'Literature Specialist',
      description: 'Extracts key information, methodologies, and findings from academic papers.',
      model: 'deepseek-r1-distill-qwen-32b',
      systemPrompt: `You are reviewing an academic paper or research content. 
Extract the key components including research question, methodology, primary findings, and contribution to the field.
Provide a structured breakdown of the paper's organization and key content.`
    },
    {
      id: 'analyst',
      name: 'Analyst',
      role: 'Data Interpretation Expert',
      description: 'Critically assesses research methods, data analysis, and conclusions.',
      model: 'deepseek-r1-distill-qwen-32b',
      systemPrompt: `Analyze the research methodology and findings provided in the context.
Evaluate the strengths and limitations of the research design, data collection, and analysis.
Identify potential biases, confounding variables, or gaps in the research.
Assess whether the conclusions are justified based on the evidence presented.`
    },
    {
      id: 'summarizer',
      name: 'Summarizer',
      role: 'Communication Specialist',
      description: 'Creates a clear, accessible summary with key takeaways and practical implications.',
      model: 'llama-3.3-70b-versatile',
      systemPrompt: `Create a comprehensive yet accessible summary of the research analysis provided.
Distill the technical content into clear language understandable to a non-specialist audience.
Highlight the key practical implications and applications of this research.
Format the summary with clear headings, bullet points where appropriate, and a conclusion section.
Use Markdown formatting for better readability.`
    }
  ];

  // Available superagents
  const superagents: Superagent[] = [
    {
      id: 'blog-creator',
      name: 'Blog Creator',
      description: 'Create comprehensive, well-researched blog posts on any topic through a collaborative AI workflow',
      icon: FileText,
      gradient: 'from-blue-600 to-indigo-600',
      agents: ['Researcher', 'Writer', 'Editor'],
      status: 'active'
    },
    {
      id: 'research-analyzer',
      name: 'Research Analyzer',
      description: 'Analyze academic papers and research with deep comprehension and clear summaries',
      icon: Brain,
      gradient: 'from-purple-600 to-violet-600',
      agents: ['Reviewer', 'Analyst', 'Summarizer'],
      status: 'active'
    },
    {
      id: 'code-project',
      name: 'Code Project Builder',
      description: 'Design, implement, and test code projects through a multi-agent development pipeline',
      icon: Code,
      gradient: 'from-green-600 to-emerald-600',
      agents: ['Architect', 'Developer', 'Tester'],
      status: 'coming-soon',
      releaseDate: 'Q3 2025'
    },
    {
      id: 'marketing-campaign',
      name: 'Marketing Campaign Creator',
      description: 'Generate coordinated marketing materials with consistent branding and messaging',
      icon: MessageSquare,
      gradient: 'from-amber-500 to-orange-600',
      agents: ['Market Researcher', 'Content Creator', 'Campaign Manager'],
      status: 'coming-soon',
      releaseDate: 'Q4 2025'
    }
  ];

  // Tips for superagent usage based on agent type
  const BLOG_TIPS = [
    "Use specific topics for the best results",
    "Try including the intended audience in your topic",
    "The more focused your topic, the more detailed the output",
    "Let the workflow complete for the best quality",
    "Each agent builds upon the previous agent's work"
  ];

  const RESEARCH_TIPS = [
    "Paste abstract/intro/conclusion for quicker analysis",
    "Include methodology sections for better method critique",
    "The more detailed the paper content, the better the analysis",
    "Scientific papers work best with this superagent",
    "Include data-related sections for deeper statistical insights"
  ];

  // Set a random tip on component mount or when active agent changes
  useEffect(() => {
    if (activeAgent === 'blog-creator') {
      setCurrentTip(BLOG_TIPS[Math.floor(Math.random() * BLOG_TIPS.length)]);
    } else if (activeAgent === 'research-analyzer') {
      setCurrentTip(RESEARCH_TIPS[Math.floor(Math.random() * RESEARCH_TIPS.length)]);
    } else {
      // Generic tip for selection page
      setCurrentTip("Choose a superagent to get started");
    }
  }, [activeAgent]);

  // Ensure proper scroll after content loads
  useEffect(() => {
    if (finalContent && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [finalContent]);

  // Reset copied states after a delay
  useEffect(() => {
    if (copiedStep !== null) {
      const timer = setTimeout(() => {
        setCopiedStep(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedStep]);

  useEffect(() => {
    if (copiedFinal) {
      const timer = setTimeout(() => {
        setCopiedFinal(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copiedFinal]);

  const handleActivateAgent = (agentId: string) => {
    setActiveAgent(agentId);
    // Reset all states when switching agents
    setTopic('');
    setPaperContent('');
    setCurrentStep(-1);
    setStepResults([]);
    setFinalContent('');
    setError('');
    setProgressStatus('idle');
    setShowStepOutputs([false, false, false]);
  };

  const handleBackToAgents = () => {
    setActiveAgent(null);
  };

  const handleBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!topic.trim()) {
      setError('Please enter a topic');
      return;
    }
    
    try {
      setError('');
      setIsProcessing(true);
      setCurrentStep(0);
      setStepResults([]);
      setFinalContent('');
      setProgressStatus('running');
      setShowStepOutputs([false, false, false]);
      
      await createBlogCrewWorkflow(
        topic,
        (step, agentName, result) => {
          setCurrentStep(step);
          setStepResults(prev => {
            const newResults = [...prev];
            newResults[step] = result;
            return newResults;
          });
          
          if (step === 2) { // Editor is the last step
            setFinalContent(result);
            setIsProcessing(false);
            setProgressStatus('complete');
          }
        }
      );
    } catch (error) {
      console.error('Error in blog workflow:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
      setProgressStatus('error');
    }
  };

  const handleResearchSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!paperContent.trim()) {
      setError('Please enter paper content to analyze');
      return;
    }
    
    try {
      setError('');
      setIsProcessing(true);
      setCurrentStep(0);
      setStepResults([]);
      setFinalContent('');
      setProgressStatus('running');
      setShowStepOutputs([false, false, false]);
      
      await createResearchAnalysisWorkflow(
        paperContent,
        (step, agentName, result) => {
          setCurrentStep(step);
          setStepResults(prev => {
            const newResults = [...prev];
            newResults[step] = result;
            return newResults;
          });
          
          if (step === 2) { // Summarizer is the last step
            setFinalContent(result);
            setIsProcessing(false);
            setProgressStatus('complete');
          }
        }
      );
    } catch (error) {
      console.error('Error in research analysis workflow:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
      setProgressStatus('error');
    }
  };

  // Reset the form
  const handleReset = () => {
    setTopic('');
    setPaperContent('');
    setCurrentStep(-1);
    setStepResults([]);
    setFinalContent('');
    setError('');
    setProgressStatus('idle');
    setShowStepOutputs([false, false, false]);
  };

  // Get step info based on active agent
  const getStepInfo = (step: number) => {
    if (activeAgent === 'blog-creator') {
      const agent = BLOG_CREATOR_AGENTS[step];
      return {
        name: agent?.name || '...',
        description: agent?.description || '',
        icon: step === 0 ? Search : step === 1 ? Edit : FileText
      };
    } else if (activeAgent === 'research-analyzer') {
      const agent = RESEARCH_ANALYZER_AGENTS[step];
      return {
        name: agent?.name || '...',
        description: agent?.description || '',
        icon: step === 0 ? BookOpen : step === 1 ? BarChart : FileText
      };
    }
    
    return {
      name: '...',
      description: '',
      icon: FileText
    };
  };

  // Toggle showing step output
  const toggleStepOutput = (index: number) => {
    setShowStepOutputs(prev => {
      const newShowStepOutputs = [...prev];
      newShowStepOutputs[index] = !newShowStepOutputs[index];
      return newShowStepOutputs;
    });
  };

  // Copy step output to clipboard
  const copyStepOutput = (index: number) => {
    navigator.clipboard.writeText(stepResults[index]);
    setCopiedStep(index);
  };

  // Copy final output
  const copyFinalOutput = () => {
    navigator.clipboard.writeText(finalContent);
    setCopiedFinal(true);
  };

  // Returns the agents array based on active agent
  const getAgentArray = () => {
    if (activeAgent === 'blog-creator') {
      return BLOG_CREATOR_AGENTS;
    } else if (activeAgent === 'research-analyzer') {
      return RESEARCH_ANALYZER_AGENTS;
    }
    return [];
  };

  // If no agent is selected, show the superagent selection page
  if (!activeAgent) {
    return (
      <div className="app-interface min-h-screen bg-[#0f0f15] text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0f0f15] border-b border-[#222233] sticky top-0 z-50">
          <div className="flex items-center">
            <Link to="/" className="p-2 rounded-md hover:bg-[#222233] transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="ml-4 text-xl font-bold flex items-center">
              <Zap className="mr-2 text-blue-400" size={20} />
              Superagents
            </h1>
          </div>
        </div>

        <main className="max-w-7xl mx-auto p-4 sm:p-6">
          {/* Page Title and Description */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">AI Teams Working Together</h2>
            <p className="max-w-2xl mx-auto text-gray-400">
              Superagents combine specialized AI models in structured workflows to accomplish
              complex tasks with higher quality results than any single model could achieve.
            </p>
          </div>
          
          {/* Superagent Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {superagents.map(agent => (
              <div 
                key={agent.id}
                className={`rounded-xl overflow-hidden border border-[#222233] ${
                  agent.status === 'active'
                    ? 'cursor-pointer hover:border-blue-500'
                    : 'opacity-70'
                }`}
                onClick={() => agent.status === 'active' && handleActivateAgent(agent.id)}
              >
                <div className={`h-2 bg-gradient-to-r ${agent.gradient}`}></div>
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-gradient-to-br ${agent.gradient} bg-opacity-20 mr-3`}>
                      <agent.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold">{agent.name}</h3>
                      <div className="text-xs flex items-center">
                        {agent.status === 'active' ? (
                          <span className="text-green-400 flex items-center">
                            <CheckCircle size={12} className="mr-1" /> Active
                          </span>
                        ) : (
                          <span className="text-amber-400 flex items-center">
                            <Clock size={12} className="mr-1" /> Coming {agent.releaseDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-4">{agent.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="text-sm font-medium mb-2 text-gray-400">Agent Team:</h4>
                    <div className="flex flex-wrap gap-2">
                      {agent.agents.map((agentName, index) => (
                        <span 
                          key={index}
                          className="px-2 py-1 rounded-full text-xs bg-[#1a1a24] text-gray-300"
                        >
                          {agentName}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {agent.status === 'active' ? (
                    <button
                      onClick={() => handleActivateAgent(agent.id)}
                      className={`w-full py-2 rounded-lg flex items-center justify-center font-medium
                        bg-gradient-to-r ${agent.gradient} text-white hover:opacity-90
                      `}
                    >
                      <Zap size={16} className="mr-2" />
                      Start Using
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 rounded-lg flex items-center justify-center font-medium
                        bg-[#222233] text-gray-400 cursor-not-allowed
                      "
                    >
                      <Clock size={16} className="mr-2" />
                      Coming Soon
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Why Use Superagents */}
          <div className="mt-16 mb-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Why Use Superagents?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-[#1a1a24] border border-[#222233] p-5 rounded-xl">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900/30 flex items-center justify-center mt-1 mr-3">
                    <CheckCircle className="text-blue-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Specialized Expertise</h4>
                    <p className="text-gray-400">
                      Each agent is optimized for a specific task, using the ideal AI model for its role in the workflow.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a24] border border-[#222233] p-5 rounded-xl">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-900/30 flex items-center justify-center mt-1 mr-3">
                    <Brain className="text-purple-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Higher Quality Results</h4>
                    <p className="text-gray-400">
                      The collaborative workflow produces superior results compared to using a single AI model.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a24] border border-[#222233] p-5 rounded-xl">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-900/30 flex items-center justify-center mt-1 mr-3">
                    <Zap className="text-green-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Transparent Process</h4>
                    <p className="text-gray-400">
                      Watch each step of the process unfold, with visibility into each agent's contribution.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-[#1a1a24] border border-[#222233] p-5 rounded-xl">
                <div className="flex items-start mb-3">
                  <div className="w-10 h-10 rounded-full bg-amber-900/30 flex items-center justify-center mt-1 mr-3">
                    <Clock className="text-amber-400" size={20} />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-2">Efficiency</h4>
                    <p className="text-gray-400">
                      Complex tasks that would take hours manually can be completed in minutes with superagents.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="mt-12 py-6 px-4 border-t border-[#222233] bg-[#0a0a15]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ZevLogo size={24} variant="dark" className="mr-2" />
              <span className="text-sm text-gray-400">
                Zev Superagents © 2025
              </span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/chat" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Chat
              </Link>
              <Link to="/agents" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                AI Agents
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Blog creator workflow view
  if (activeAgent === 'blog-creator') {
    return (
      <div className="app-interface min-h-screen bg-[#0f0f15] text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0f0f15] border-b border-[#222233] sticky top-0 z-50">
          <div className="flex items-center">
            <button 
              onClick={handleBackToAgents}
              className="p-2 rounded-md hover:bg-[#222233]"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="ml-4 text-xl font-bold flex items-center">
              <FileText className="mr-2 text-blue-400" size={20} />
              Blog Creator
            </h1>
          </div>
        </div>

        <main className="max-w-5xl mx-auto p-4 sm:p-6">
          {/* Input Form Card */}
          <div className="bg-[#1a1a24] border border-[#222233] rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3">
                  <PenTool className="text-white" size={20} />
                </div>
                <h2 className="font-bold text-xl">Create a Blog Post</h2>
              </div>
              
              <p className="text-gray-400 mb-5">
                Enter a blog topic below and our team of specialized AI agents will work together to create a comprehensive, well-structured blog post.
              </p>
              
              <form onSubmit={handleBlogSubmit}>
                <div className="relative mb-4">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="Enter a blog topic (e.g., 'Benefits of meditation for stress reduction')"
                    className="w-full p-4 pr-32 bg-[#0f0f15] rounded-lg border border-[#222233] focus:ring-2 focus:ring-blue-500/50 focus:outline-none focus:border-blue-500"
                    disabled={isProcessing}
                  />
                  
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-blue-400 hidden md:block">
                      {currentTip}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm flex items-center">
                    <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-center">
                  {progressStatus === 'complete' ? (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 rounded-lg font-medium flex items-center bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <RotateCcw size={18} className="mr-2" />
                      Create Another Blog Post
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing || !topic.trim()}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                        isProcessing || !topic.trim()
                          ? 'bg-blue-900/50 text-blue-300/50 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <span className="mr-2">●</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Zap size={18} className="mr-2" />
                          Create Blog Post
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Agent Team */}
            <div className="bg-[#0f0f15] border-t border-[#222233] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Agent Team</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-900/20 text-blue-400 flex items-center">
                  <Cpu size={10} className="mr-1" />
                  Optimized Models
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {BLOG_CREATOR_AGENTS.map((agent, index) => (
                  <div key={agent.id} className="flex items-center p-2 rounded bg-[#1a1a24] border border-[#333344]">
                    <div className="w-6 h-6 rounded-full bg-blue-900/30 text-blue-400 flex items-center justify-center mr-2">
                      {index === 0 ? (
                        <Search size={12} />
                      ) : index === 1 ? (
                        <Edit size={12} />
                      ) : (
                        <FileText size={12} />
                      )}
                    </div>
                    <div className="text-xs">{agent.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Progress Section - Only show when processing or complete */}
          {(currentStep >= 0 || stepResults.length > 0) && (
            <div className="bg-[#1a1a24] border border-[#222233] rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Workflow Progress</h3>
                  
                  <div className="text-xs px-3 py-1.5 rounded-full flex items-center bg-blue-900/30 text-blue-400">
                    {progressStatus === 'running' && (
                      <>
                        <span className="mr-1.5">⦿</span>
                        Processing
                      </>
                    )}
                    {progressStatus === 'complete' && (
                      <>
                        <CheckCircle size={12} className="mr-1.5" />
                        Complete
                      </>
                    )}
                    {progressStatus === 'error' && (
                      <>
                        <AlertTriangle size={12} className="mr-1.5" />
                        Error
                      </>
                    )}
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">Research</span>
                    <span className="text-xs">Writing</span>
                    <span className="text-xs">Editing</span>
                  </div>
                  <div className="h-2 rounded-full w-full bg-[#0f0f15]">
                    <div 
                      className="h-2 rounded-full bg-blue-600"
                      style={{ 
                        width: currentStep === -1 
                          ? '0%' 
                          : currentStep === 0 
                            ? '33%' 
                            : currentStep === 1 
                              ? '66%' 
                              : '100%' 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Steps */}
                <div className="space-y-3">
                  {BLOG_CREATOR_AGENTS.map((agent, index) => {
                    const isCurrentStep = currentStep === index;
                    const isCompleted = stepResults[index] !== undefined;
                    const stepInfo = getStepInfo(index);
                    const StepIcon = stepInfo.icon;
                    
                    return (
                      <div 
                        key={agent.id} 
                        className={`rounded ${
                          isCurrentStep 
                            ? 'bg-blue-900/20 border border-blue-800/30' 
                            : isCompleted 
                              ? 'bg-[#0f0f15]'
                              : 'bg-[#0f0f15] opacity-60'
                        }`}
                      >
                        <div className="flex items-center p-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                            isCurrentStep 
                              ? 'bg-blue-600/20 text-blue-400 border-2 border-blue-500' 
                              : isCompleted 
                                ? 'bg-blue-900 text-blue-200 border border-blue-700' 
                                : 'bg-[#1a1a24] text-gray-400 border border-[#222233]'
                          }`}>
                            <StepIcon size={18} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium text-sm">{stepInfo.name}</h4>
                              {isCurrentStep && (
                                <span className="ml-2 text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full flex items-center">
                                  <Clock size={10} className="mr-1" />
                                  Working...
                                </span>
                              )}
                              {isCompleted && !isCurrentStep && (
                                <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full flex items-center">
                                  <CheckCircle size={10} className="mr-1" />
                                  Complete
                                </span>
                              )}
                            </div>
                            
                            {isCompleted && (
                              <div className="mt-1 text-xs text-gray-400">
                                Step {index + 1}/{BLOG_CREATOR_AGENTS.length} completed
                              </div>
                            )}
                          </div>

                          {isCompleted && (
                            <button 
                              onClick={() => toggleStepOutput(index)}
                              className="text-gray-400 hover:text-gray-200 p-1"
                            >
                              {showStepOutputs[index] ? (
                                <ChevronRight className="rotate-90" size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Expandable output section */}
                        {isCompleted && showStepOutputs[index] && (
                          <div className="px-3 pb-3">
                            <div className="p-3 bg-[#0f0f15] rounded-md border border-[#222233] relative">
                              <div className="text-xs text-gray-400 mb-2 flex justify-between items-center">
                                <span>Output</span>
                                <button 
                                  onClick={() => copyStepOutput(index)}
                                  className="text-gray-400 hover:text-blue-400"
                                >
                                  {copiedStep === index ? "Copied!" : "Copy"}
                                </button>
                              </div>
                              <div className="text-sm max-h-64 overflow-auto pr-2">
                                <div className="whitespace-pre-wrap">
                                  {stepResults[index].length > 500 
                                    ? `${stepResults[index].substring(0, 500)}...` 
                                    : stepResults[index]
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Final Blog Post Display */}
          {finalContent && (
            <div 
              ref={contentRef}
              className="bg-[#1a1a24] border border-[#222233] rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center mr-3">
                      <FileText size={18} />
                    </div>
                    <h3 className="text-lg font-bold">Final Blog Post</h3>
                  </div>
                  <button 
                    className="px-3 py-1.5 text-sm rounded-lg flex items-center bg-[#0f0f15] hover:bg-[#222233]"
                    onClick={copyFinalOutput}
                  >
                    <Copy size={14} className="mr-1.5" />
                    {copiedFinal ? "Copied!" : "Copy Content"}
                  </button>
                </div>
                
                <div className="p-4 rounded-lg bg-[#0f0f15] overflow-auto max-h-[600px]">
                  <article className="blog-container">
                    <ReactMarkdown 
                      className="prose prose-invert dark max-w-none"
                      remarkPlugins={[remarkGfm]}
                    >
                      {finalContent}
                    </ReactMarkdown>
                  </article>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-[#0f0f15] hover:bg-[#222233] rounded-lg text-sm flex items-center"
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Create Another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Help Box - Helpful tips for getting better results */}
          {!isProcessing && !finalContent && (
            <div className="bg-[#1a1a24] border border-[#222233] rounded-xl p-4 mt-8">
              <div className="flex items-start">
                <Info size={20} className="text-blue-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Tips for Better Results</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Be specific with your topic (e.g., "Benefits of intermittent fasting for weight loss" instead of just "Intermittent fasting")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Include your target audience (e.g., "for beginners", "for small business owners")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>Mention the tone you prefer (e.g., "professional", "casual", "educational")</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-400 mr-2">•</span>
                      <span>For technical topics, specify the level of expertise (e.g., "for advanced developers")</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 py-6 px-4 border-t border-[#222233] bg-[#0a0a15]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ZevLogo size={24} variant="dark" className="mr-2" />
              <span className="text-sm text-gray-400">
                Zev Superagents © 2025
              </span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/chat" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Chat
              </Link>
              <Link to="/agents" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                AI Agents
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Research Analyzer workflow view
  if (activeAgent === 'research-analyzer') {
    return (
      <div className="app-interface min-h-screen bg-[#0f0f15] text-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-[#0f0f15] border-b border-[#222233] sticky top-0 z-50">
          <div className="flex items-center">
            <button 
              onClick={handleBackToAgents}
              className="p-2 rounded-md hover:bg-[#222233]"
            >
              <ArrowLeft size={20} />
            </button>
            <h1 className="ml-4 text-xl font-bold flex items-center">
              <Brain className="mr-2 text-purple-400" size={20} />
              Research Analyzer
            </h1>
          </div>
        </div>

        <main className="max-w-5xl mx-auto p-4 sm:p-6">
          {/* Input Form Card */}
          <div className="bg-[#1a1a24] border border-[#222233] rounded-xl shadow-lg overflow-hidden mb-6">
            <div className="p-6">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center mr-3">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h2 className="font-bold text-xl">Analyze Research Paper</h2>
              </div>
              
              <p className="text-gray-400 mb-5">
                Paste the contents of an academic paper, research article, or study you'd like to analyze. Our team of specialized AI agents will extract key information, critique methods, and provide a clear summary.
              </p>
              
              <form onSubmit={handleResearchSubmit}>
                <div className="relative mb-4">
                  <textarea
                    value={paperContent}
                    onChange={(e) => setPaperContent(e.target.value)}
                    placeholder="Paste paper abstract, introduction, methodology, results, and/or conclusion here..."
                    className="w-full p-4 bg-[#0f0f15] rounded-lg border border-[#222233] focus:ring-2 focus:ring-purple-500/50 focus:outline-none focus:border-purple-500 min-h-[200px] resize-none"
                    disabled={isProcessing}
                  />
                  
                  <div className="absolute right-3 bottom-3 pointer-events-none">
                    <div className="text-xs px-2 py-1 rounded-full bg-purple-900/30 text-purple-400 hidden md:block">
                      {currentTip}
                    </div>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm flex items-center">
                    <AlertTriangle size={16} className="mr-2 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="flex justify-center">
                  {progressStatus === 'complete' ? (
                    <button
                      type="button"
                      onClick={handleReset}
                      className="px-6 py-3 rounded-lg font-medium flex items-center bg-violet-600 hover:bg-violet-700 text-white"
                    >
                      <RotateCcw size={18} className="mr-2" />
                      Analyze Another Paper
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={isProcessing || !paperContent.trim()}
                      className={`px-6 py-3 rounded-lg font-medium flex items-center ${
                        isProcessing || !paperContent.trim()
                          ? 'bg-purple-900/50 text-purple-300/50 cursor-not-allowed'
                          : 'bg-purple-600 hover:bg-purple-700 text-white'
                      }`}
                    >
                      {isProcessing ? (
                        <>
                          <span className="mr-2">●</span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <Brain size={18} className="mr-2" />
                          Analyze Research
                        </>
                      )}
                    </button>
                  )}
                </div>
              </form>
            </div>
            
            {/* Agent Team */}
            <div className="bg-[#0f0f15] border-t border-[#222233] p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-300">Agent Team</h3>
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-900/20 text-purple-400 flex items-center">
                  <Cpu size={10} className="mr-1" />
                  Advanced Analysis
                </span>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {RESEARCH_ANALYZER_AGENTS.map((agent, index) => (
                  <div key={agent.id} className="flex items-center p-2 rounded bg-[#1a1a24] border border-[#333344]">
                    <div className="w-6 h-6 rounded-full bg-purple-900/30 text-purple-400 flex items-center justify-center mr-2">
                      {index === 0 ? (
                        <BookOpen size={12} />
                      ) : index === 1 ? (
                        <BarChart size={12} />
                      ) : (
                        <FileText size={12} />
                      )}
                    </div>
                    <div className="text-xs">{agent.name}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Agent Progress Section - Only show when processing or complete */}
          {(currentStep >= 0 || stepResults.length > 0) && (
            <div className="bg-[#1a1a24] border border-[#222233] rounded-xl shadow-lg overflow-hidden mb-6">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">Workflow Progress</h3>
                  
                  <div className="text-xs px-3 py-1.5 rounded-full flex items-center bg-purple-900/30 text-purple-400">
                    {progressStatus === 'running' && (
                      <>
                        <span className="mr-1.5">⦿</span>
                        Processing
                      </>
                    )}
                    {progressStatus === 'complete' && (
                      <>
                        <CheckCircle size={12} className="mr-1.5" />
                        Complete
                      </>
                    )}
                    {progressStatus === 'error' && (
                      <>
                        <AlertTriangle size={12} className="mr-1.5" />
                        Error
                      </>
                    )}
                  </div>
                </div>
                
                {/* Progress indicator */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs">Review</span>
                    <span className="text-xs">Analysis</span>
                    <span className="text-xs">Summary</span>
                  </div>
                  <div className="h-2 rounded-full w-full bg-[#0f0f15]">
                    <div 
                      className="h-2 rounded-full bg-purple-600"
                      style={{ 
                        width: currentStep === -1 
                          ? '0%' 
                          : currentStep === 0 
                            ? '33%' 
                            : currentStep === 1 
                              ? '66%' 
                              : '100%' 
                      }}
                    ></div>
                  </div>
                </div>
                
                {/* Steps */}
                <div className="space-y-3">
                  {RESEARCH_ANALYZER_AGENTS.map((agent, index) => {
                    const isCurrentStep = currentStep === index;
                    const isCompleted = stepResults[index] !== undefined;
                    const stepInfo = getStepInfo(index);
                    const StepIcon = stepInfo.icon;
                    
                    return (
                      <div 
                        key={agent.id} 
                        className={`rounded ${
                          isCurrentStep 
                            ? 'bg-purple-900/20 border border-purple-800/30' 
                            : isCompleted 
                              ? 'bg-[#0f0f15]'
                              : 'bg-[#0f0f15] opacity-60'
                        }`}
                      >
                        <div className="flex items-center p-3">
                          <div className={`w-9 h-9 rounded-full flex items-center justify-center mr-3 ${
                            isCurrentStep 
                              ? 'bg-purple-600/20 text-purple-400 border-2 border-purple-500' 
                              : isCompleted 
                                ? 'bg-purple-900 text-purple-200 border border-purple-700' 
                                : 'bg-[#1a1a24] text-gray-400 border border-[#222233]'
                          }`}>
                            <StepIcon size={18} />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center">
                              <h4 className="font-medium text-sm">{stepInfo.name}</h4>
                              {isCurrentStep && (
                                <span className="ml-2 text-xs bg-purple-900/30 text-purple-400 px-2 py-0.5 rounded-full flex items-center">
                                  <Clock size={10} className="mr-1" />
                                  Working...
                                </span>
                              )}
                              {isCompleted && !isCurrentStep && (
                                <span className="ml-2 text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full flex items-center">
                                  <CheckCircle size={10} className="mr-1" />
                                  Complete
                                </span>
                              )}
                            </div>
                            
                            {isCompleted && (
                              <div className="mt-1 text-xs text-gray-400">
                                Step {index + 1}/{RESEARCH_ANALYZER_AGENTS.length} completed
                              </div>
                            )}
                          </div>

                          {isCompleted && (
                            <button 
                              onClick={() => toggleStepOutput(index)}
                              className="text-gray-400 hover:text-gray-200 p-1"
                            >
                              {showStepOutputs[index] ? (
                                <ChevronRight className="rotate-90" size={16} />
                              ) : (
                                <ChevronRight size={16} />
                              )}
                            </button>
                          )}
                        </div>

                        {/* Expandable output section */}
                        {isCompleted && showStepOutputs[index] && (
                          <div className="px-3 pb-3">
                            <div className="p-3 bg-[#0f0f15] rounded-md border border-[#222233] relative">
                              <div className="text-xs text-gray-400 mb-2 flex justify-between items-center">
                                <span>Output</span>
                                <button 
                                  onClick={() => copyStepOutput(index)}
                                  className="text-gray-400 hover:text-purple-400"
                                >
                                  {copiedStep === index ? "Copied!" : "Copy"}
                                </button>
                              </div>
                              <div className="text-sm max-h-64 overflow-auto pr-2">
                                <div className="whitespace-pre-wrap">
                                  {stepResults[index].length > 500 
                                    ? `${stepResults[index].substring(0, 500)}...` 
                                    : stepResults[index]
                                  }
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Final Analysis Display */}
          {finalContent && (
            <div 
              ref={contentRef}
              className="bg-[#1a1a24] border border-[#222233] rounded-xl shadow-lg overflow-hidden"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-green-900/30 text-green-400 flex items-center justify-center mr-3">
                      <FileText size={18} />
                    </div>
                    <h3 className="text-lg font-bold">Final Research Analysis</h3>
                  </div>
                  <button 
                    className="px-3 py-1.5 text-sm rounded-lg flex items-center bg-[#0f0f15] hover:bg-[#222233]"
                    onClick={copyFinalOutput}
                  >
                    <Copy size={14} className="mr-1.5" />
                    {copiedFinal ? "Copied!" : "Copy Analysis"}
                  </button>
                </div>
                
                <div className="p-4 rounded-lg bg-[#0f0f15] overflow-auto max-h-[600px]">
                  <article className="blog-container">
                    <ReactMarkdown 
                      className="prose prose-invert dark max-w-none"
                      remarkPlugins={[remarkGfm]}
                    >
                      {finalContent}
                    </ReactMarkdown>
                  </article>
                </div>
                
                {/* Actions */}
                <div className="mt-4 flex justify-end">
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 bg-[#0f0f15] hover:bg-[#222233] rounded-lg text-sm flex items-center"
                  >
                    <RotateCcw size={14} className="mr-2" />
                    Analyze Another
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Help Box - Helpful tips for getting better results */}
          {!isProcessing && !finalContent && (
            <div className="bg-[#1a1a24] border border-[#222233] rounded-xl p-4 mt-8">
              <div className="flex items-start">
                <Info size={20} className="text-purple-400 mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium mb-2">Tips for Better Results</h3>
                  <ul className="text-sm text-gray-300 space-y-2">
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Include the abstract, introduction, and conclusion for more comprehensive analysis</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Add methodology sections to receive better critique of research methods</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>This tool works best with academic papers, scientific studies, and research reports</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-purple-400 mr-2">•</span>
                      <span>Include data sections for deeper statistical analysis insights</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="mt-12 py-6 px-4 border-t border-[#222233] bg-[#0a0a15]">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ZevLogo size={24} variant="dark" className="mr-2" />
              <span className="text-sm text-gray-400">
                Zev Superagents © 2025
              </span>
            </div>
            
            <div className="flex gap-6">
              <Link to="/" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Home
              </Link>
              <Link to="/chat" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                Chat
              </Link>
              <Link to="/agents" className="text-sm text-gray-400 hover:text-blue-400 transition-colors">
                AI Agents
              </Link>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Default fallback (should not reach this)
  return null;
};

export default SuperagentsPage;