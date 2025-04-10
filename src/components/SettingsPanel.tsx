import React, { useState, useEffect } from 'react';
import { X, Check, Moon, Sun } from 'lucide-react';
import { ReasoningFormat } from '../types';
import { isReasoningModel } from '../api/groqApi';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  reasoningFormat: ReasoningFormat;
  onReasoningFormatChange: (format: ReasoningFormat) => void;
  currentModel: string;
  onModelChange: (modelId: string) => void;
}

export function SettingsPanel({ 
  isOpen, 
  onClose, 
  isDarkMode,
  toggleDarkMode,
  reasoningFormat,
  onReasoningFormatChange,
  currentModel,
  onModelChange
}: SettingsPanelProps) {
  const [selectedReasoningFormat, setSelectedReasoningFormat] = useState<ReasoningFormat>(reasoningFormat);
  const [selectedModel, setSelectedModel] = useState(currentModel);
  const [temperature, setTemperature] = useState(0.7);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Reset state when panel opens or props change
  useEffect(() => {
    if (isOpen) {
      setSelectedReasoningFormat(reasoningFormat);
      setSelectedModel(currentModel);
      setShowConfirmation(false);
    }
  }, [isOpen, reasoningFormat, currentModel]);
  
  const handleSave = () => {
    setIsSaving(true);
    
    // Apply all settings
    onReasoningFormatChange(selectedReasoningFormat);
    onModelChange(selectedModel);
    
    // Show confirmation
    setTimeout(() => {
      setIsSaving(false);
      setShowConfirmation(true);
      
      // Auto-close after showing confirmation
      setTimeout(() => {
        onClose();
      }, 1500);
    }, 800);
  };
  
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

  // Group models by category
  const foundationModels = models.filter(m => m.category === 'Foundation');
  const reasoningModels = models.filter(m => m.category === 'Reasoning');
  
  // Check if settings have changed and button should be enabled
  const hasChanges = selectedReasoningFormat !== reasoningFormat || selectedModel !== currentModel;
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="relative min-h-screen md:flex md:items-center md:justify-center">
        <div 
          className={`md:max-w-2xl w-full md:mx-auto md:my-16 ${
            isDarkMode ? 'bg-[#0f0f15] text-gray-200' : 'bg-white text-gray-800'
          } shadow-xl md:rounded-lg transform transition-transform overflow-hidden`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className={`px-6 py-4 flex items-center justify-between border-b ${
            isDarkMode ? 'border-[#222233]' : 'border-gray-200'
          }`}>
            <h2 className="text-lg font-semibold">Settings</h2>
            <button 
              onClick={onClose}
              className={`p-1.5 rounded-full ${
                isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-100'
              }`}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Content */}
          <div className="p-6 max-h-[calc(100vh-150px)] md:max-h-[70vh] overflow-y-auto">
            {showConfirmation ? (
              <div className="flex flex-col items-center justify-center py-6">
                <div className={`w-12 h-12 rounded-full ${
                  isDarkMode ? 'bg-emerald-800/30' : 'bg-emerald-100'
                } flex items-center justify-center mb-4`}>
                  <Check size={24} className="text-emerald-500" />
                </div>
                <h3 className="text-lg font-medium mb-2">Settings Updated</h3>
                <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} text-center`}>
                  Your settings have been saved successfully.
                </p>
              </div>
            ) : (
              <>
                {/* Interface Preferences */}
                <div className="mb-8">
                  <h3 className="text-base font-medium mb-4">Interface Preferences</h3>

                  {/* Dark Mode Toggle */}
                  <div className={`flex items-center justify-between p-4 rounded-lg ${
                    isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-50'
                  } mb-4`}>
                    <div className="flex items-center">
                      {isDarkMode ? <Moon size={18} /> : <Sun size={18} />}
                      <span className="ml-3">Dark Mode</span>
                    </div>
                    <button 
                      onClick={toggleDarkMode} 
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
                        isDarkMode ? 'bg-blue-600 justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-md"></div>
                    </button>
                  </div>

                  {/* Model Selection */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Model Selection</h4>
                    
                    {/* Foundation Models */}
                    <div className={`p-3 mb-3 rounded-lg ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-50'}`}>
                      <h5 className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Foundation Models
                      </h5>
                      {foundationModels.map(model => (
                        <div 
                          key={model.id} 
                          className={`flex items-center mb-2 p-2 rounded cursor-pointer ${
                            selectedModel === model.id
                              ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50'
                              : isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedModel(model.id)}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{model.name}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {model.description}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border ${
                            selectedModel === model.id 
                              ? 'border-0 bg-blue-500' 
                              : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedModel === model.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Reasoning Models */}
                    <div className={`p-3 rounded-lg ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-50'}`}>
                      <h5 className={`text-xs font-medium mb-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                        Reasoning Models
                      </h5>
                      {reasoningModels.map(model => (
                        <div 
                          key={model.id} 
                          className={`flex items-center mb-2 p-2 rounded cursor-pointer ${
                            selectedModel === model.id
                              ? isDarkMode ? 'bg-[#222233]' : 'bg-blue-50'
                              : isDarkMode ? 'hover:bg-[#222233]' : 'hover:bg-gray-100'
                          }`}
                          onClick={() => setSelectedModel(model.id)}
                        >
                          <div className="flex-1">
                            <div className="font-medium text-sm">{model.name}</div>
                            <div className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              {model.description}
                            </div>
                          </div>
                          <div className={`w-4 h-4 rounded-full border ${
                            selectedModel === model.id 
                              ? 'border-0 bg-blue-500' 
                              : isDarkMode ? 'border-gray-600' : 'border-gray-300'
                          } flex items-center justify-center`}>
                            {selectedModel === model.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* AI Response Settings */}
                <div className="mb-8">
                  <h3 className="text-base font-medium mb-4">AI Response Settings</h3>
                  
                  {/* Reasoning Format */}
                  <div className="mb-6">
                    <h4 className="text-sm font-medium mb-3">Reasoning Format</h4>
                    <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      Control how the model's thinking process is displayed (applies to reasoning models only).
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setSelectedReasoningFormat('parsed')}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedReasoningFormat === 'parsed'
                            ? isDarkMode 
                              ? 'bg-blue-900/30 border-blue-700 text-blue-400' 
                              : 'bg-blue-100 border-blue-300 text-blue-700'
                            : isDarkMode
                              ? 'bg-[#1a1a24] border-[#222233] hover:bg-[#222233]'
                              : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Parsed
                        <div className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Show reasoning in a separate section</div>
                      </button>
                      <button
                        onClick={() => setSelectedReasoningFormat('raw')}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedReasoningFormat === 'raw'
                            ? isDarkMode 
                              ? 'bg-blue-900/30 border-blue-700 text-blue-400' 
                              : 'bg-blue-100 border-blue-300 text-blue-700'
                            : isDarkMode
                              ? 'bg-[#1a1a24] border-[#222233] hover:bg-[#222233]'
                              : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Raw
                        <div className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Include reasoning in the main response</div>
                      </button>
                      <button
                        onClick={() => setSelectedReasoningFormat('hidden')}
                        className={`p-2 text-sm rounded-lg border transition-colors ${
                          selectedReasoningFormat === 'hidden'
                            ? isDarkMode 
                              ? 'bg-blue-900/30 border-blue-700 text-blue-400' 
                              : 'bg-blue-100 border-blue-300 text-blue-700'
                            : isDarkMode
                              ? 'bg-[#1a1a24] border-[#222233] hover:bg-[#222233]'
                              : 'bg-gray-100 border-gray-200 hover:bg-gray-200'
                        }`}
                      >
                        Hidden
                        <div className={`text-xs mt-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>Don't show reasoning process</div>
                      </button>
                    </div>
                  </div>
                  
                  {/* Temperature Control */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium">Temperature</h4>
                      <span className={`text-sm px-2 py-0.5 rounded ${
                        isDarkMode ? 'bg-[#0f0f15]' : 'bg-gray-100'
                      }`}>{temperature.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(parseFloat(e.target.value))}
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs mt-1">
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>More predictable</span>
                      <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>More creative</span>
                    </div>
                  </div>
                </div>

                {/* History and Data */}
                <div className="mb-8">
                  <h3 className="text-base font-medium mb-4">History and Data</h3>
                  <div className={`p-4 rounded-lg ${isDarkMode ? 'bg-[#1a1a24]' : 'bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="text-sm font-medium">Conversation History</h4>
                        <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                          Your conversations are stored locally in your browser
                        </p>
                      </div>
                      <button className={`px-3 py-1 text-sm rounded-md ${
                        isDarkMode 
                          ? 'bg-red-900/30 text-red-400 hover:bg-red-900/50' 
                          : 'bg-red-100 text-red-600 hover:bg-red-200'
                      }`}>
                        Clear
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
          
          {/* Footer */}
          {!showConfirmation && (
            <div className={`px-6 py-4 border-t ${
              isDarkMode ? 'border-[#222233]' : 'border-gray-200'
            } flex justify-end gap-3`}>
              <button
                onClick={onClose}
                className={`px-4 py-2 rounded-lg ${
                  isDarkMode 
                    ? 'bg-[#1a1a24] hover:bg-[#222233] text-gray-200' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                } transition-colors`}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving || !hasChanges}
                className={`px-4 py-2 rounded-lg flex items-center ${
                  isSaving || !hasChanges
                    ? isDarkMode ? 'bg-blue-800/50 text-blue-300/50 cursor-not-allowed' : 'bg-blue-300 text-white cursor-not-allowed'
                    : isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'
                } transition-colors`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Saving...
                  </>
                ) : "Apply Changes"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}