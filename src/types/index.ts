export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  timestamp: Date;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

export interface ModelConfig {
  id: string;
  name: string;
  description: string;
  category: 'Foundation' | 'Reasoning';
  specs?: {
    parameters: string;
    contextWindow: string;
    latency: string;
    throughput: string;
  };
  recommended?: string[];
  reasoningCapable?: boolean;
  badge?: string;
  gradient?: string;
  useCases?: string[];
}

export type ReasoningFormat = 'parsed' | 'raw' | 'hidden';

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string; // Icon or image
  category?: string;
  capabilities?: string[];
  role?: string;
  model?: string;
  systemPrompt?: string;
}

// Response from the Groq API
export interface GroqResponse {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    reasoning?: string;
    finish_reason?: string;
  }[];
}