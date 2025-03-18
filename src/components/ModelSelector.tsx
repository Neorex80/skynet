import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Cpu } from 'lucide-react';
import { isReasoningModel } from '../api/groqApi';

interface ModelSelectorProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
  isDarkMode: boolean;
}

interface ModelOption {
  id: string;
  name: string;
  description: string;
  category: 'Foundation' | 'Reasoning';
}

export function ModelSelector({ currentModel, onModelChange, isDarkMode }: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Model options
  const models: ModelOption[] = [
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
      id: 'mixtral-8x7b',
      name: 'Mixtral 8x7B',
      description: 'Mixture-of-experts model',
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
      category: 'Reasoning'
    },
    {
      id: 'deepseek-r1-distill-qwen-32b',
      name: 'DeepSeek R1 (Qwen 32B)',
      description: 'Reasoning with knowledge',
      category: 'Reasoning'
    },
    {
      id: 'deepseek-r1-distill-llama-70b',
      name: 'DeepSeek R1 (Llama 70B)',
      description: 'High-capacity reasoning',
      category: 'Reasoning'
    }
  ];

  // Find the current model data
  const currentModelData = models.find(m => m.id === currentModel) || models[0];
  
  // Group models by category
  const foundationModels = models.filter(m => m.category === 'Foundation');
  const reasoningModels = models.filter(m => m.category === 'Reasoning');

  // Handle model selection
  const handleSelectModel = (modelId: string) => {
    onModelChange(modelId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${
          isDarkMode 
            ? 'bg-[#1a1a24] hover:bg-[#222233] border border-[#222233]' 
            : 'bg-white hover:bg-gray-100 border border-gray-200'
        } transition-colors focus:outline-none text-sm`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <Cpu size={14} className={isReasoningModel(currentModel) ? 'text-blue-400' : ''} />
        <span className="max-w-[120px] truncate">{currentModelData.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div 
          className={`absolute z-50 mt-1 w-64 rounded-lg shadow-lg ${
            isDarkMode ? 'bg-[#0f0f15] border border-[#222233]' : 'bg-white border border-gray-200'
          } overflow-hidden`}
          style={{ left: '50%', transform: 'translateX(-50%)' }}
        >
          {/* Foundation Models */}
          <div className={`py-1 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase`}>
            Foundation Models
          </div>
          {foundationModels.map(model => (
            <button
              key={model.id}
              onClick={() => handleSelectModel(model.id)}
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
              <Cpu size={14} className="mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <div className="font-medium text-sm">{model.name}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{model.description}</div>
              </div>
            </button>
          ))}

          {/* Reasoning Models */}
          <div className={`py-1 px-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-xs font-medium uppercase border-t ${
            isDarkMode ? 'border-[#222233]' : 'border-gray-200'
          }`}>
            Reasoning Models
          </div>
          {reasoningModels.map(model => (
            <button
              key={model.id}
              onClick={() => handleSelectModel(model.id)}
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
              <Cpu size={14} className="mt-0.5 mr-2 flex-shrink-0 text-blue-400" />
              <div>
                <div className="font-medium text-sm">{model.name}</div>
                <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{model.description}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}