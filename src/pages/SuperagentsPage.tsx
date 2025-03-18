import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Cpu, Edit, FileText, Search } from 'lucide-react';
import { Agent } from '../types';
import { createBlogWorkflow } from '../lib/langchain';
import { createBlogCrewWorkflow } from '../lib/crewai';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const SuperagentsPage: React.FC = () => {
  const [isDarkMode] = useState(true);
  const [topic, setTopic] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1); // -1 means not started
  const [stepResults, setStepResults] = useState<string[]>([]);
  const [finalContent, setFinalContent] = useState('');
  const [error, setError] = useState('');
  const [isCrewAI, setIsCrewAI] = useState(false);
  const [crewStepAgents, setCrewStepAgents] = useState<string[]>([]);

  // Blog creator agents (for display purposes)
  const BLOG_CREATOR_AGENTS: Agent[] = [
    {
      id: 'researcher',
      name: 'Researcher',
      role: 'Research Helper',
      description:
        'Finds interesting facts, stats, and background info about your topic.',
      model: 'deepseek-r1-distill-qwen-32b',
      systemPrompt: `You're a research helper. Look into the topic: {topic}.
Give a few bullet points with easy-to-read facts, stats, and some background details.`
    },
    {
      id: 'writer',
      name: 'Writer',
      role: 'Content Creator',
      description:
        'Turns the research into a friendly and easy-to-read blog post.',
      model: 'mixtral-8x7b',
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
      description: 'Cleans up the post for clarity and flow.',
      model: 'mixtral-8x7b',
      systemPrompt: `Improve the draft below:
{content}
Make the post clear and engaging.
Keep it simple and easy to read.
Return the final version in Markdown with proper headings.`
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
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
      
      if (isCrewAI) {
        // Use CrewAI workflow
        setCrewStepAgents([]);
        
        await createBlogCrewWorkflow(
          topic,
          (step, agent, result) => {
            setCurrentStep(step);
            setStepResults(prev => {
              const newResults = [...prev];
              newResults[step] = result;
              return newResults;
            });
            setCrewStepAgents(prev => {
              const newAgents = [...prev];
              newAgents[step] = agent;
              return newAgents;
            });
            
            if (step === 2) { // Editor is the last step
              setFinalContent(result);
              setIsProcessing(false);
            }
          }
        );
      } else {
        // Use regular LangChain workflow
        await createBlogWorkflow(
          topic,
          (step, result) => {
            setCurrentStep(step);
            setStepResults(prev => {
              const newResults = [...prev];
              newResults[step] = result;
              return newResults;
            });
            
            if (step === 2) { // Editor is the last step
              setFinalContent(result);
              setIsProcessing(false);
            }
          }
        );
      }
    } catch (error) {
      console.error('Error in blog creation workflow:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setIsProcessing(false);
    }
  };

  // Get the right step name/info based on workflow type
  const getStepInfo = (step: number) => {
    if (isCrewAI) {
      return {
        name: crewStepAgents[step] || BLOG_CREATOR_AGENTS[step]?.name || '...',
        description: BLOG_CREATOR_AGENTS[step]?.description || '',
        icon: step === 0 ? Search : step === 1 ? Edit : FileText
      };
    } else {
      return {
        name: BLOG_CREATOR_AGENTS[step]?.name || '...',
        description: BLOG_CREATOR_AGENTS[step]?.description || '',
        icon: step === 0 ? Search : step === 1 ? Edit : FileText
      };
    }
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
          <h1 className="ml-4 text-xl font-bold">Superagents</h1>
        </div>
      </div>

      <main className="max-w-4xl mx-auto p-4 sm:p-6">
        <div className={`p-6 rounded-xl mb-8 ${
          isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
        }`}>
          <h2 className="text-xl font-bold mb-2">Multi-Agent Blog Creator</h2>
          <p className={`mb-6 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Let our AI agents work together to create a comprehensive blog post on any topic.
          </p>

          {/* Workflow Toggle */}
          <div className="mb-6">
            <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f0f15] mb-4">
              <div>
                <div className="font-medium">Workflow Type</div>
                <div className="text-xs text-gray-400">Choose how the agents collaborate</div>
              </div>
              <div className="flex">
                <button 
                  className={`px-3 py-1.5 text-sm rounded-l-md transition-colors ${
                    !isCrewAI 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#1a1a24] text-gray-400 hover:bg-[#222233]'
                  }`}
                  onClick={() => setIsCrewAI(false)}
                >
                  LangChain
                </button>
                <button 
                  className={`px-3 py-1.5 text-sm rounded-r-md transition-colors ${
                    isCrewAI 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-[#1a1a24] text-gray-400 hover:bg-[#222233]'
                  }`}
                  onClick={() => setIsCrewAI(true)}
                >
                  CrewAI Style
                </button>
              </div>
            </div>
          </div>

          {/* Topic Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="topic" className="block text-sm font-medium mb-1">
                Blog Topic
              </label>
              <input
                type="text"
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter any topic (e.g., 'The benefits of meditation')"
                className={`w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 ${
                  isDarkMode 
                    ? 'bg-[#0f0f15] border-[#222233] focus:ring-blue-600/50' 
                    : 'bg-gray-50 border-gray-300 focus:ring-blue-500/50'
                } border`}
                disabled={isProcessing}
              />
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-900/20 border border-red-800/30 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isProcessing || !topic.trim()}
                className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                  isProcessing || !topic.trim()
                    ? isDarkMode
                      ? 'bg-blue-900/50 text-blue-300/50 cursor-not-allowed'
                      : 'bg-blue-300 text-white cursor-not-allowed'
                    : isDarkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {isProcessing ? 'Processing...' : 'Create Blog Post'}
              </button>
            </div>
          </form>
        </div>

        {/* Agent Progress Section */}
        {(currentStep >= 0 || stepResults.length > 0) && (
          <div className={`mb-8 p-6 rounded-xl ${
            isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
          }`}>
            <h3 className="text-lg font-bold mb-4">Agent Progress</h3>
            
            <div className="space-y-6">
              {BLOG_CREATOR_AGENTS.map((agent, index) => {
                const isCurrentStep = currentStep === index;
                const isCompleted = stepResults[index] !== undefined;
                const stepInfo = getStepInfo(index);
                const StepIcon = stepInfo.icon;
                
                return (
                  <div 
                    key={agent.id} 
                    className={`relative ${
                      (isCurrentStep || isCompleted) 
                        ? 'opacity-100' 
                        : 'opacity-50'
                    }`}
                  >
                    {/* Step connector line */}
                    {index < BLOG_CREATOR_AGENTS.length - 1 && (
                      <div className={`absolute left-6 top-12 bottom-0 w-0.5 ${
                        isCompleted 
                          ? isDarkMode ? 'bg-blue-600' : 'bg-blue-500' 
                          : isDarkMode ? 'bg-[#222233]' : 'bg-gray-200'
                      }`}></div>
                    )}
                    
                    <div className="flex">
                      {/* Step indicator circle */}
                      <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center mr-4 ${
                        isCurrentStep 
                          ? 'bg-blue-600/20 text-blue-400 border-2 border-blue-500' 
                          : isCompleted 
                            ? isDarkMode ? 'bg-blue-900 text-blue-200 border border-blue-700' : 'bg-blue-100 text-blue-600'
                            : isDarkMode ? 'bg-[#0f0f15] text-gray-400 border border-[#222233]' : 'bg-gray-100 text-gray-400'
                      }`}>
                        {isCurrentStep && (
                          <div className="absolute inset-0 rounded-full border border-blue-500 animate-ping opacity-50"></div>
                        )}
                        <StepIcon size={20} />
                      </div>
                      
                      {/* Step details */}
                      <div className="flex-1">
                        <div className="flex items-center mb-1">
                          <span className="font-medium">{stepInfo.name}</span>
                          {isCurrentStep && (
                            <span className="ml-3 text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded-full animate-pulse">
                              Working...
                            </span>
                          )}
                          {isCompleted && !isCurrentStep && (
                            <span className="ml-3 text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded-full">
                              Complete
                            </span>
                          )}
                        </div>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          {stepInfo.description}
                        </p>
                        
                        {/* Show the step result if it's available */}
                        {isCompleted && (
                          <div 
                            className={`mt-3 p-3 rounded max-h-60 overflow-y-auto text-sm ${
                              isDarkMode ? 'bg-[#0f0f15] border border-[#222233]' : 'bg-gray-50 border border-gray-200'
                            }`}
                          >
                            <div className="mb-2 flex justify-between items-center">
                              <span className="text-xs font-medium uppercase opacity-70">Output</span>
                              <button 
                                className={`text-xs px-2 py-0.5 rounded ${
                                  isDarkMode ? 'bg-[#1a1a24] hover:bg-[#222233]' : 'bg-gray-200 hover:bg-gray-300'
                                }`}
                                onClick={() => {
                                  navigator.clipboard.writeText(stepResults[index]);
                                }}
                              >
                                Copy
                              </button>
                            </div>
                            <div className="whitespace-pre-wrap">{stepResults[index].slice(0, 300)}...</div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Final Blog Post Display */}
        {finalContent && (
          <div className={`p-6 rounded-xl ${
            isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Final Blog Post</h3>
              <button 
                className={`px-3 py-1 text-sm rounded-lg ${
                  isDarkMode ? 'bg-[#0f0f15] hover:bg-[#222233]' : 'bg-gray-100 hover:bg-gray-200'
                }`}
                onClick={() => {
                  navigator.clipboard.writeText(finalContent);
                }}
              >
                Copy Full Content
              </button>
            </div>
            
            <article className="blog-container">
              <ReactMarkdown 
                className={`prose ${isDarkMode ? 'prose-invert dark' : 'prose-gray'} max-w-none`}
                remarkPlugins={[remarkGfm]}
              >
                {finalContent}
              </ReactMarkdown>
            </article>
          </div>
        )}
        
        {/* Agent Explanation */}
        <div className={`mt-8 p-6 rounded-xl ${
          isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white shadow-md'
        }`}>
          <h3 className="text-lg font-bold mb-4">How It Works</h3>
          
          <div className="space-y-6">
            <div>
              <h4 className="font-medium mb-2 flex items-center">
                <Cpu size={18} className="mr-2 text-blue-400" />
                Multi-Agent Collaboration
              </h4>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                This superagent combines multiple specialized AI agents, each trained to excel at a specific task in the content creation process. They work together in a sequential workflow to produce a high-quality blog post.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {BLOG_CREATOR_AGENTS.map((agent, index) => {
                const stepInfo = getStepInfo(index);
                const StepIcon = stepInfo.icon;
                
                return (
                  <div 
                    key={agent.id} 
                    className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-50'}`}
                  >
                    <div className="flex items-center mb-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                        isDarkMode ? 'bg-blue-900/30 text-blue-400' : 'bg-blue-100 text-blue-600'
                      }`}>
                        <StepIcon size={16} />
                      </div>
                      <span className="font-medium">{agent.name}</span>
                    </div>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {agent.description}
                    </p>
                    <div className={`mt-2 text-xs p-2 rounded ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-white'}`}>
                      <div className={`mb-1 font-mono ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                        Model: {agent.model}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SuperagentsPage;