import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypePrism from 'rehype-prism-plus';
import { Message } from '../types';
import { UserIcon } from '@heroicons/react/24/solid';
import { BrainIcon, ClipboardIcon, ThumbsUp, ThumbsDown, RotateCw } from 'lucide-react';

// Language display mapping for better readability
const LANGUAGE_DISPLAY_NAMES: Record<string, string> = {
  js: 'javascript',
  javascript: 'javascript',
  jsx: 'jsx',
  ts: 'typescript',
  typescript: 'typescript',
  tsx: 'tsx',
  py: 'python',
  python: 'python',
  rb: 'ruby',
  ruby: 'ruby',
  go: 'go',
  java: 'java',
  c: 'c',
  cpp: 'c++',
  cs: 'c#',
  csharp: 'c#',
  php: 'php',
  rs: 'rust',
  rust: 'rust',
  swift: 'swift',
  kt: 'kotlin',
  kotlin: 'kotlin',
  scala: 'scala',
  sh: 'shell',
  bash: 'bash',
  zsh: 'zsh',
  shell: 'shell',
  html: 'html',
  css: 'css',
  scss: 'scss',
  sass: 'sass',
  less: 'less',
  json: 'json',
  yaml: 'yaml',
  yml: 'yaml',
  xml: 'xml',
  sql: 'sql',
  graphql: 'graphql',
  md: 'markdown',
  markdown: 'markdown',
  dockerfile: 'dockerfile',
  docker: 'dockerfile',
  tex: 'latex',
  latex: 'latex',
  r: 'r',
  diff: 'diff',
  plaintext: 'text',
  text: 'text',
  txt: 'text',
  // Add more mappings as needed
};

interface MessageBubbleProps { 
  message: Message;
  isDarkMode: boolean;
  onRegenerate?: () => void;
}

export function MessageBubble({ message, isDarkMode, onRegenerate }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isSystem = message.role === 'system';
  const isEmptyAssistant = !isUser && !isSystem && message.content.trim() === '';
  const contentRef = useRef<HTMLDivElement>(null);
  const reasoningRef = useRef<HTMLDivElement>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [reasoningVisible, setReasoningVisible] = useState(true);
  
  // Set dark mode class on document root for CSS targeting
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Helper function to add language labels and copy buttons to code blocks
  const enhanceCodeBlocks = (container: HTMLDivElement | null) => {
    if (!container) return;
    
    const preElements = container.querySelectorAll('pre');
    preElements?.forEach(pre => {
      // Make sure we don't add multiple labels/buttons
      if (pre.querySelector('.code-language-label')) return;

      const code = pre.querySelector('code');
      if (!code) return;

      // Enhanced language detection with multiple patterns
      let language = 'text';
      
      // Try to detect from class names
      const classMatch = code.className.match(/(?:language|lang)-(\w+)/);
      if (classMatch && classMatch[1]) {
        language = classMatch[1].toLowerCase();
      }
      
      // Try to detect from data attributes
      const dataLang = code.getAttribute('data-language') || code.getAttribute('data-lang');
      if (dataLang) {
        language = dataLang.toLowerCase();
      }
      
      // Get the display name with fallback
      const displayName = LANGUAGE_DISPLAY_NAMES[language] || language;
      
      // Add language label
      const label = document.createElement('div');
      label.className = 'code-language-label';
      label.textContent = displayName;
      pre.appendChild(label);

      // Add copy button
      const copyButton = document.createElement('div');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code.textContent || '')
          .then(() => {
            copyButton.textContent = 'Copied!';
            setTimeout(() => {
              copyButton.textContent = 'Copy';
            }, 2000);
          })
          .catch(console.error);
      };
      pre.appendChild(copyButton);
    });
  };

  // Add language labels and copy buttons to code blocks
  useEffect(() => {
    enhanceCodeBlocks(contentRef.current);
    enhanceCodeBlocks(reasoningRef.current);
  }, [message.content, message.reasoning]);

  const handleCopyFullResponse = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleReasoning = () => {
    setReasoningVisible(!reasoningVisible);
  };

  // For system messages (like regeneration prompts)
  if (isSystem) {
    return (
      <div className={`py-3 ${isDarkMode ? 'bg-[#0f0f15]' : 'bg-white'}`}>
        <div className="max-w-3xl mx-auto px-3 sm:px-4">
          <div className="flex justify-center">
            <div className={`text-xs py-2 px-3 rounded ${
              isDarkMode ? 'bg-[#1a1a24] text-gray-400' : 'bg-gray-100 text-gray-500'
            }`}>
              {message.content}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`py-6 ${isUser ? 'bg-transparent' : isDarkMode ? 'bg-[#0f0f15]' : 'bg-white'}`}>
      {/* Message container with proper alignment */}
      <div className="max-w-3xl mx-auto px-3 sm:px-4">
        {/* User messages are right-aligned */}
        {isUser ? (
          <div className="flex justify-end">
            <div className="max-w-[85%] sm:max-w-[75%]">
              <div className="flex items-center justify-end mb-2">
                <span className="text-xs font-medium mr-2">
                  You
                </span>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ml-2">
                  <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className="text-right">
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Assistant messages are centered with max-width constraint */
          <div className="flex justify-center">
            <div className="max-w-[90%] sm:max-w-[85%] w-full">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2">
                  <BrainIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
                <span className="text-xs font-medium">
                  Skynet
                </span>
                <span className="text-xs opacity-70 ml-2">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              
              {isEmptyAssistant ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                </div>
              ) : (
                <div className="text-left">
                  {/* Reasoning Section (if available) */}
                  {message.reasoning && (
                    <div className="mb-4">
                      <div 
                        className={`flex items-center justify-between p-2 rounded-t-md cursor-pointer ${
                          isDarkMode ? 'bg-[#1a1a24] border-[#222233]' : 'bg-gray-100 border-gray-200'
                        } border border-b-0`}
                        onClick={toggleReasoning}
                      >
                        <span className="text-xs font-medium">
                          {reasoningVisible ? 'Hide Reasoning' : 'Show Reasoning'}
                        </span>
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          width="16" 
                          height="16" 
                          viewBox="0 0 24 24" 
                          fill="none" 
                          stroke="currentColor" 
                          strokeWidth="2" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          className={`transition-transform ${reasoningVisible ? 'rotate-180' : ''}`}
                        >
                          <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                      </div>
                      
                      {reasoningVisible && (
                        <div 
                          ref={reasoningRef}
                          className={`p-3 rounded-b-md mb-4 ${
                            isDarkMode ? 'bg-[#1a1a24] border-[#222233] text-gray-300' : 'bg-gray-100 border-gray-200 text-gray-700'
                          } border text-sm overflow-auto max-h-[500px] streaming-content`}
                        >
                          <ReactMarkdown 
                            className={`prose ${isDarkMode ? 'prose-invert dark' : 'prose-gray'} prose-sm max-w-none break-words`}
                            remarkPlugins={[remarkGfm]}
                            rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
                          >
                            {message.reasoning}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Main Content */}
                  <div ref={contentRef} className="streaming-content">
                    <ReactMarkdown 
                      className={`prose ${isDarkMode ? 'prose-invert dark' : 'prose-gray'} prose-sm md:prose-base max-w-none break-words`}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              
              {/* Assistant message actions - always visible now */}
              {!isEmptyAssistant && (
                <div className="flex items-center gap-3 mt-3">
                  <button
                    onClick={handleCopyFullResponse}
                    className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700/50 bg-[#1a1a24]' : 'hover:bg-gray-200 bg-gray-100'
                    }`}
                    title="Copy response"
                    aria-label="Copy response"
                  >
                    <ClipboardIcon className={`w-3 h-3 sm:w-4 sm:h-4 ${copied ? 'text-emerald-400' : ''}`} />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLiked(true)}
                      className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                        liked === true 
                          ? 'text-emerald-400 bg-emerald-400/10' 
                          : isDarkMode ? 'bg-[#1a1a24] hover:bg-gray-700/50' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Helpful"
                      aria-label="Mark as helpful"
                    >
                      <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                    <button
                      onClick={() => setLiked(false)}
                      className={`p-1 sm:p-1.5 rounded-md transition-colors ${
                        liked === false 
                          ? 'text-red-400 bg-red-400/10' 
                          : isDarkMode ? 'bg-[#1a1a24] hover:bg-gray-700/50' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Not helpful"
                      aria-label="Mark as not helpful"
                    >
                      <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  </div>

                  {onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className={`p-1 sm:p-1.5 rounded-md transition-colors ml-auto ${
                        isDarkMode ? 'bg-[#1a1a24] hover:bg-gray-700/50' : 'bg-gray-100 hover:bg-gray-200'
                      }`}
                      title="Regenerate response"
                      aria-label="Regenerate response"
                    >
                      <RotateCw className="w-3 h-3 sm:w-4 sm:h-4" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Copied notification */}
      {copied && (
        <div className="fixed bottom-4 right-4 px-3 py-1 bg-gray-800 text-white text-sm rounded-md animate-fade-in z-50">
          Copied!
        </div>
      )}
    </div>
  );
}