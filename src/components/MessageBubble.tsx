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
  const [contentRendered, setContentRendered] = useState(false);
  
  // Set dark mode class on document root for CSS targeting
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Mark content as rendered after a small delay
  useEffect(() => {
    if (!isEmptyAssistant && !contentRendered) {
      const timer = setTimeout(() => {
        setContentRendered(true);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isEmptyAssistant, contentRendered]);

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

      // Add copy button with improved positioning and animation
      const copyButton = document.createElement('div');
      copyButton.className = 'copy-button';
      copyButton.textContent = 'Copy';
      copyButton.onclick = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(code.textContent || '')
          .then(() => {
            copyButton.textContent = 'Copied!';
            copyButton.classList.add('copied');
            
            setTimeout(() => {
              copyButton.textContent = 'Copy';
              copyButton.classList.remove('copied');
            }, 2000);
          })
          .catch(console.error);
      };
      pre.appendChild(copyButton);
      
      // Add line numbers
      if (!pre.classList.contains('line-numbers-added')) {
        const lineCount = (code.textContent?.match(/\n/g)?.length || 0) + 1;
        if (lineCount > 1) {
          const lineNumbers = document.createElement('div');
          lineNumbers.className = 'line-numbers';
          
          for (let i = 1; i <= lineCount; i++) {
            const lineNumber = document.createElement('div');
            lineNumber.className = 'line-number';
            lineNumber.textContent = i.toString();
            lineNumbers.appendChild(lineNumber);
          }
          
          pre.appendChild(lineNumbers);
          pre.classList.add('with-line-numbers', 'line-numbers-added');
        }
      }
    });
  };

  // Add language labels and copy buttons to code blocks
  useEffect(() => {
    // Only process once the content is stable
    if (contentRendered) {
      enhanceCodeBlocks(contentRef.current);
      enhanceCodeBlocks(reasoningRef.current);
    }
  }, [contentRendered, message.content, message.reasoning]);

  // Add styling enhancements
  useEffect(() => {
    if (!document.getElementById('message-bubble-enhanced-styles')) {
      const style = document.createElement('style');
      style.id = 'message-bubble-enhanced-styles';
      style.textContent = `
        /* Enhanced code block styling */
        pre.with-line-numbers {
          padding-left: 3.5rem !important;
        }
        
        .line-numbers {
          position: absolute;
          top: 1.5rem;
          left: 0;
          bottom: 0;
          width: 2.5rem;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 0 0.5rem;
          background-color: rgba(0, 0, 0, 0.1);
          color: rgba(150, 150, 150, 0.8);
          font-family: monospace;
          font-size: 0.8rem;
          user-select: none;
        }
        
        .dark .line-numbers {
          background-color: rgba(0, 0, 0, 0.2);
          color: rgba(150, 150, 150, 0.6);
        }
        
        .line-number {
          padding: 0 0.25rem;
          line-height: 1.5;
        }
        
        /* Improved copy button */
        .copy-button {
          position: absolute;
          top: 0.25rem;
          right: 0.25rem;
          opacity: 0;
          transition: all 0.2s ease;
          font-size: 0.7rem;
          color: #9ca3af;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          background-color: rgba(255, 255, 255, 0.1);
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .dark .copy-button {
          background-color: rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        pre:hover .copy-button {
          opacity: 1;
        }
        
        .copy-button:hover {
          transform: scale(1.05);
          background-color: rgba(255, 255, 255, 0.15);
        }
        
        .dark .copy-button:hover {
          background-color: rgba(0, 0, 0, 0.4);
        }
        
        .copy-button.copied {
          background-color: rgba(16, 185, 129, 0.2) !important;
          color: rgb(16, 185, 129) !important;
        }
        
        /* Rendering optimizations */
        .streaming-content {
          will-change: contents;
          transform: translateZ(0);
          contain: content;
          word-break: break-word;
        }
        
        .message-content {
          backface-visibility: hidden;
        }
        
        /* Improved reasoning section */
        .reasoning-section {
          border-radius: 0.5rem;
          overflow: hidden;
          transition: all 0.3s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          will-change: contents;
          transform: translateZ(0);
        }
        
        .reasoning-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .dark .reasoning-header:hover {
          background-color: rgba(255, 255, 255, 0.05);
        }
        
        .reasoning-header:hover:not(.dark) {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        .reasoning-content {
          max-height: 500px;
          overflow: auto;
          transition: all 0.3s ease;
        }
        
        .reasoning-content.collapsed {
          max-height: 0;
          padding: 0 !important;
          border-top: none !important;
        }
        
        /* Animation for action buttons */
        @keyframes subtle-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        
        .action-button-highlight {
          animation: subtle-pulse 1s ease infinite;
        }
        
        /* Improved message feedback controls */
        .message-controls {
          display: flex;
          gap: 0.5rem;
          margin-top: 0.75rem;
          transition: opacity 0.2s ease;
        }
        
        .message-control-button {
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0.375rem;
          border-radius: 0.375rem;
          transition: all 0.15s ease;
        }
        
        .message-control-button:hover {
          transform: translateY(-1px);
        }
        
        /* Copied notification animation */
        @keyframes fade-up-out {
          0% { opacity: 0; transform: translateY(10px); }
          15% { opacity: 1; transform: translateY(0); }
          85% { opacity: 1; transform: translateY(0); }
          100% { opacity: 0; transform: translateY(-10px); }
        }
        
        .copied-notification {
          animation: fade-up-out 2s ease-in-out forwards;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

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
            <div className="max-w-[85%] sm:max-w-[75%] transform transition-all duration-300">
              <div className="flex items-center justify-end mb-2">
                <span className="text-xs font-medium mr-2">
                  You
                </span>
                <span className="text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center ml-2 bg-blue-600/20 text-blue-500">
                  <UserIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                </div>
              </div>
              <div className={`text-right px-4 py-3 rounded-2xl rounded-tr-sm ${
                isDarkMode ? 'bg-blue-600/10 border border-blue-600/20' : 'bg-blue-50 border border-blue-100'
              }`}>
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Assistant messages are centered with max-width constraint */
          <div className="flex justify-center">
            <div className="max-w-[90%] sm:max-w-[85%] w-full">
              <div className="flex items-center mb-2">
                <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center mr-2 bg-indigo-600/20 text-indigo-500">
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
                <div className={`p-4 rounded-2xl rounded-tl-sm ${
                  isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white border border-gray-200'
                }`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" style={{ animationDelay: '300ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" style={{ animationDelay: '600ms' }}></div>
                    <div className="text-sm text-gray-500 ml-1">Generating response...</div>
                  </div>
                </div>
              ) : (
                <div className="text-left">
                  {/* Reasoning Section (if available) */}
                  {message.reasoning && (
                    <div className={`mb-4 reasoning-section ${
                      isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-gray-50 border border-gray-200'
                    }`}>
                      <div 
                        className={`reasoning-header ${
                          isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-100'
                        }`}
                        onClick={toggleReasoning}
                      >
                        <div className="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 text-blue-400">
                            <path d="M12 2a8 8 0 1 0 0 16 8 8 0 0 0 0-16z"></path>
                            <path d="M12 6v4"></path>
                            <path d="M12 14h.01"></path>
                          </svg>
                          <span className="text-xs font-medium">
                            AI Reasoning Process
                          </span>
                        </div>
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
                      
                      <div 
                        ref={reasoningRef}
                        className={`reasoning-content p-4 ${
                          isDarkMode ? 'bg-[#1a1a24] border-t border-[#222233] text-gray-300' : 'bg-gray-50 border-t border-gray-200 text-gray-700'
                        } text-sm overflow-auto streaming-content ${!reasoningVisible ? 'collapsed' : ''}`}
                      >
                        <ReactMarkdown 
                          className={`prose ${isDarkMode ? 'prose-invert dark' : 'prose-gray'} prose-sm max-w-none break-words`}
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
                        >
                          {message.reasoning || ''}
                        </ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {/* Main Content */}
                  <div 
                    ref={contentRef} 
                    className={`message-content p-4 rounded-2xl rounded-tl-sm shadow-sm ${
                      isDarkMode ? 'bg-[#1a1a24] border border-[#222233]' : 'bg-white border border-gray-200'
                    }`}
                  >
                    <ReactMarkdown 
                      className={`prose ${isDarkMode ? 'prose-invert dark' : 'prose-gray'} prose-sm md:prose-base max-w-none break-words streaming-content`}
                      remarkPlugins={[remarkGfm]}
                      rehypePlugins={[[rehypePrism, { ignoreMissing: true }]]}
                    >
                      {message.content}
                    </ReactMarkdown>
                  </div>
                </div>
              )}
              
              {/* Assistant message actions */}
              {!isEmptyAssistant && (
                <div className="message-controls">
                  {/* Copy button */}
                  <button
                    onClick={handleCopyFullResponse}
                    className={`message-control-button ${
                      isDarkMode 
                        ? 'hover:bg-[#222233] bg-[#1a1a24] border border-[#222233]' 
                        : 'hover:bg-gray-100 bg-white border border-gray-200'
                    } ${copied ? 'text-emerald-400' : ''}`}
                    title="Copy response"
                    aria-label="Copy response"
                  >
                    <ClipboardIcon className="w-3.5 h-3.5" />
                  </button>

                  {/* Feedback buttons */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setLiked(true)}
                      className={`message-control-button ${
                        liked === true 
                          ? 'bg-emerald-900/30 border border-emerald-700/30 text-emerald-400' 
                          : isDarkMode 
                            ? 'bg-[#1a1a24] hover:bg-[#222233] border border-[#222233]' 
                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                      title="Helpful"
                      aria-label="Mark as helpful"
                    >
                      <ThumbsUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setLiked(false)}
                      className={`message-control-button ${
                        liked === false 
                          ? 'bg-red-900/30 border border-red-700/30 text-red-400' 
                          : isDarkMode 
                            ? 'bg-[#1a1a24] hover:bg-[#222233] border border-[#222233]' 
                            : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                      title="Not helpful"
                      aria-label="Mark as not helpful"
                    >
                      <ThumbsDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Regenerate button */}
                  {onRegenerate && (
                    <button
                      onClick={onRegenerate}
                      className={`message-control-button ml-auto ${
                        isDarkMode 
                          ? 'bg-[#1a1a24] hover:bg-[#222233] border border-[#222233]' 
                          : 'bg-white hover:bg-gray-100 border border-gray-200'
                      }`}
                      title="Regenerate response"
                      aria-label="Regenerate response"
                    >
                      <RotateCw className="w-3.5 h-3.5" />
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
        <div className="fixed bottom-6 right-6 px-4 py-2 bg-gray-800/90 text-white text-sm rounded-md copied-notification z-50 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Copied to clipboard!
        </div>
      )}
    </div>
  );
}