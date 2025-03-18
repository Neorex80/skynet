import { ModelConfig } from '../types';

// Available models with comprehensive details
export const AVAILABLE_MODELS: ModelConfig[] = [
  {
    id: 'llama-3.3-70b-versatile',
    name: 'Llama 3.3 70B',
    description: 'Large-context powerful foundation model with exceptional versatility and reasoning capabilities.',
    category: 'Foundation',
    badge: 'Featured',
    specs: {
      parameters: '70 Billion',
      contextWindow: '128K',
      latency: 'Medium',
      throughput: 'Medium',
    },
    recommended: ['General-purpose tasks', 'Complex reasoning', 'Creative content'],
    gradient: 'from-blue-600 to-indigo-600',
    useCases: ['General-purpose tasks', 'Complex reasoning', 'Creative content']
  },
  {
    id: 'gemma2-9b-it',
    name: 'Gemma 2 9B',
    description: 'A lightweight but capable model optimized for efficiency and fast responses.',
    category: 'Foundation',
    specs: {
      parameters: '9 Billion',
      contextWindow: '32K',
      latency: 'Very low',
      throughput: 'High',
    },
    recommended: ['Quick responses', 'Mobile applications', 'Resource-constrained environments'],
    gradient: 'from-emerald-500 to-teal-600',
    useCases: ['Quick responses', 'Mobile applications', 'Efficiency']
  },
  {
    id: 'mixtral-8x7b',
    name: 'Mixtral 8x7B',
    description: 'Mixture-of-experts model providing excellent performance with reasonable resource requirements.',
    category: 'Foundation',
    specs: {
      parameters: '8x7B MoE',
      contextWindow: '32K',
      latency: 'Medium',
      throughput: 'Medium-High',
    },
    recommended: ['Balanced performance and efficiency', 'Multi-domain tasks', 'Content generation'],
    gradient: 'from-purple-500 to-violet-600',
    useCases: ['Multi-domain tasks', 'Balanced performance', 'Content generation']
  },
  {
    id: 'llama-3.1-8b-instant',
    name: 'Llama 3.1 8B',
    description: 'Optimized version for real-time applications and quick interaction.',
    category: 'Foundation',
    badge: 'Fast',
    specs: {
      parameters: '8 Billion',
      contextWindow: '8K',
      latency: 'Very low',
      throughput: 'Very high',
    },
    recommended: ['Real-time applications', 'Chat interfaces', 'Quick responses'],
    gradient: 'from-amber-500 to-orange-600',
    useCases: ['Chat applications', 'Real-time responses', 'Mobile devices']
  },
  {
    id: 'qwen-qwq-32b',
    name: 'Qwen QWQ 32B',
    description: 'Advanced reasoning model with exceptional logical and analytical capabilities.',
    category: 'Reasoning',
    specs: {
      parameters: '32 Billion',
      contextWindow: '32K',
      latency: 'Medium-High',
      throughput: 'Medium',
    },
    recommended: ['Complex problem solving', 'Mathematical reasoning', 'Step-by-step explanations'],
    reasoningCapable: true,
    gradient: 'from-cyan-500 to-blue-600',
    useCases: ['Complex problem solving', 'Mathematical reasoning', 'Step-by-step explanations']
  },
  {
    id: 'deepseek-r1-distill-qwen-32b',
    name: 'DeepSeek R1 (Qwen 32B)',
    description: 'Distilled knowledge-focused reasoning model with deep understanding capabilities.',
    category: 'Reasoning',
    specs: {
      parameters: '32 Billion',
      contextWindow: '64K',
      latency: 'Medium-High',
      throughput: 'Medium',
    },
    recommended: ['Research assistance', 'Knowledge-intensive tasks', 'Complex explanations'],
    reasoningCapable: true,
    gradient: 'from-pink-500 to-rose-600',
    useCases: ['Research assistance', 'Knowledge-intensive tasks', 'Complex explanations']
  },
  {
    id: 'deepseek-r1-distill-llama-70b',
    name: 'DeepSeek R1 (Llama 70B)',
    description: 'High-capacity reasoning model offering exceptional depth for complex tasks.',
    category: 'Reasoning',
    specs: {
      parameters: '70 Billion',
      contextWindow: '128K',
      latency: 'High',
      throughput: 'Low-Medium',
    },
    recommended: ['Advanced reasoning', 'Step-by-step solutions', 'Scientific domains'],
    reasoningCapable: true,
    gradient: 'from-indigo-500 to-purple-600',
    useCases: ['Advanced reasoning', 'Step-by-step solutions', 'Scientific domains']
  }
];

// Filter models by category
export const getModelsByCategory = (category: 'Foundation' | 'Reasoning') => {
  return AVAILABLE_MODELS.filter(model => model.category === category);
};

// Get model by ID
export const getModelById = (id: string): ModelConfig | undefined => {
  return AVAILABLE_MODELS.find(model => model.id === id);
};

// Get default model
export const getDefaultModel = (): ModelConfig => {
  return AVAILABLE_MODELS[0];
};