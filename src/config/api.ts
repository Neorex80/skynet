/**
 * API Configuration
 * 
 * This file contains configuration for API endpoints and related settings.
 * 
 * Note: API keys should be stored in environment variables and not hardcoded.
 * In production, ensure your backend properly handles API key security.
 */

// Groq API endpoint
export const GROQ_API_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';

// Models configuration
export const MODELS_CONFIG = {
  // Default model to use when none is selected
  defaultModel: 'llama-3.3-70b-versatile',
  
  // List of reasoning-capable models
  reasoningModels: [
    'qwen-qwq-32b',
    'deepseek-r1-distill-qwen-32b',
    'deepseek-r1-distill-llama-70b'
  ],
  
  // Model temperature (randomness)
  defaultTemperature: 0.7,
  
  // Default max tokens for responses
  defaultMaxTokens: 4096
};

// API configuration options
export const API_CONFIG = {
  // Default retry attempts for failed API calls
  maxRetries: 3,
  
  // Retry delay in milliseconds
  retryDelay: 1000,
  
  // Request timeout in milliseconds
  timeout: 60000
};