import { ZEV_SYSTEM_PROMPT } from '../constants';
import { GroqResponse } from '../types';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

// Check if a model is a reasoning model
export const isReasoningModel = (modelId: string): boolean => {
  const reasoningModels = [
    'qwen-qwq-32b',
    'deepseek-r1-distill-qwen-32b',
    'deepseek-r1-distill-llama-70b'
  ];
  return reasoningModels.includes(modelId);
};

// Regular, non-streaming API call
export const sendMessageToGroq = async (
  messages: Message[], 
  modelId: string = 'llama3-70b-8192',
  reasoningFormat: 'parsed' | 'raw' | 'hidden' = 'parsed',
  systemPrompt?: string
): Promise<{content: string, reasoning?: string}> => {
  if (!API_KEY) {
    throw new Error('GROQ API key is not set. Please set the VITE_GROQ_API_KEY environment variable.');
  }
  
  // If a custom system prompt is provided, use it, otherwise use the default
  const effectiveSystemPrompt = systemPrompt || ZEV_SYSTEM_PROMPT;
  
  // Always ensure the system prompt is the first message
  const allMessages = messages.find(msg => msg.role === 'system') 
    ? messages 
    : [{ role: 'system', content: effectiveSystemPrompt }, ...messages];
  
  try {
    const payload: any = {
      model: modelId,
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 4096
    };
    
    // Add reasoning_format only for reasoning models
    if (isReasoningModel(modelId)) {
      payload.reasoning_format = reasoningFormat;
    }
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GroqResponse;
    return {
      content: data.choices[0].message.content,
      reasoning: data.choices[0].reasoning
    };
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
};

// Optimized streaming implementation with better buffer handling
export const streamMessageFromGroq = async (
  messages: Message[],
  onChunk: (chunk: string, type: 'content' | 'reasoning') => void,
  onComplete: () => void,
  modelId: string = 'llama3-70b-8192',
  reasoningFormat: 'parsed' | 'raw' | 'hidden' = 'parsed',
  systemPrompt?: string
): Promise<void> => {
  if (!API_KEY) {
    throw new Error('GROQ API key is not set. Please set the VITE_GROQ_API_KEY environment variable.');
  }
  
  // If a custom system prompt is provided, use it
  const effectiveSystemPrompt = systemPrompt || ZEV_SYSTEM_PROMPT;
  
  const allMessages = messages.find(msg => msg.role === 'system') 
    ? messages 
    : [{ role: 'system', content: effectiveSystemPrompt }, ...messages];
  
  try {
    const payload: any = {
      model: modelId,
      messages: allMessages,
      temperature: 0.7,
      max_tokens: 4096,
      stream: true
    };
    
    // Add reasoning_format only for reasoning models
    if (isReasoningModel(modelId)) {
      payload.reasoning_format = reasoningFormat;
    }
    
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    // Process the stream with improved buffering for rendering performance
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let contentBuffer = '';
    let reasoningBuffer = '';
    let lastUpdateTime = Date.now();
    
    // Adaptive buffer settings for smoother UI updates
    // These values adapt based on chunk size and time since last update
    const MIN_BUFFER_SIZE = 10;  // Characters
    const MAX_BUFFER_SIZE = 100; // Characters
    const MIN_UPDATE_INTERVAL = 30; // Milliseconds
    const MAX_UPDATE_INTERVAL = 100; // Milliseconds
    
    // Number of tokens processed since last UI update
    let tokensProcessed = 0;

    const processStream = async () => {
      try {
        const { done, value } = await reader.read();
        
        if (done) {
          // Flush any remaining buffers
          if (contentBuffer) onChunk(contentBuffer, 'content');
          if (reasoningBuffer) onChunk(reasoningBuffer, 'reasoning');
          
          onComplete();
          return;
        }
        
        // Decode the chunk
        buffer += decoder.decode(value, { stream: true });
        
        // Split the buffer by lines and process each line
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        
        for (const line of lines) {
          if (line.trim() === '') continue;
          
          // Remove the "data: " prefix
          const data = line.replace(/^data: /, '');
          
          // Skip the [DONE] message
          if (data === '[DONE]') continue;
          
          try {
            const parsed = JSON.parse(data);
            const content = parsed.choices[0]?.delta?.content || '';
            const reasoning = parsed.choices[0]?.delta?.reasoning || '';
            
            if (content) {
              contentBuffer += content;
              tokensProcessed++;
            }
            
            if (reasoning) {
              reasoningBuffer += reasoning;
              tokensProcessed++;
            }
            
            // Determine if we should update the UI based on:
            // 1. Buffer size relative to content complexity
            // 2. Time elapsed since last update
            // 3. Number of tokens processed
            const now = Date.now();
            const timeElapsed = now - lastUpdateTime;
            
            // Adaptive buffer size - decrease for complex content with HTML/code
            const effectiveBufferSize = contentBuffer.includes('```') || 
                                     contentBuffer.includes('<') || 
                                     reasoningBuffer.includes('```') ? 
                                     MIN_BUFFER_SIZE : MAX_BUFFER_SIZE;
            
            // Update UI when any condition is met
            const shouldUpdate = contentBuffer.length >= effectiveBufferSize || 
                               reasoningBuffer.length >= effectiveBufferSize ||
                               timeElapsed >= MAX_UPDATE_INTERVAL ||
                               (tokensProcessed >= 5 && timeElapsed >= MIN_UPDATE_INTERVAL);
            
            if (shouldUpdate) {
              // Performance optimization: Use requestAnimationFrame to sync with browser rendering
              if (contentBuffer) {
                window.requestAnimationFrame(() => onChunk(contentBuffer, 'content'));
                contentBuffer = '';
              }
              
              if (reasoningBuffer) {
                window.requestAnimationFrame(() => onChunk(reasoningBuffer, 'reasoning'));
                reasoningBuffer = '';
              }
              
              lastUpdateTime = now;
              tokensProcessed = 0;
            }
          } catch (error) {
            console.error('Error parsing stream:', error, data);
          }
        }
        
        // Continue processing
        processStream();
      } catch (error) {
        console.error('Error reading stream:', error);
        // Try to complete gracefully
        onComplete();
      }
    };
    
    processStream();
  } catch (error) {
    console.error('Error streaming from Groq API:', error);
    throw error;
  }
};