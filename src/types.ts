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
  reasoningCapable?: boolean;
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
  systemPrompt: string;
}