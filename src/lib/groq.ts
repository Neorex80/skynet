import { ZEV_SYSTEM_PROMPT } from '../constants';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const API_KEY = import.meta.env.VITE_GROQ_API_KEY;

interface Message {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

type GroqResponse = {
  id: string;
  choices: {
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }[];
};

export async function sendMessageToGroq(
  messages: Message[],
  model: string = 'llama3-70b-8192'
): Promise<{content: string}> {
  if (!API_KEY) {
    throw new Error('GROQ API key is not set. Please set the VITE_GROQ_API_KEY environment variable.');
  }
  
  try {
    const response = await fetch(GROQ_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: 0.7,
        max_tokens: 4096
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Groq API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json() as GroqResponse;
    return { content: data.choices[0].message.content };
  } catch (error) {
    console.error('Error calling Groq API:', error);
    throw error;
  }
}