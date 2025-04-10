# SKYNET AI ASSISTANT
**Technical Documentation**

---

## Table of Contents
1. [Introduction](#introduction)
2. [Feasibility Study & Requirement Analysis](#feasibility-study--requirement-analysis)
3. [Data Dictionary](#data-dictionary)
4. [ER Diagram & Data Flow Diagram](#er-diagram--data-flow-diagram)
5. [Code](#code)
6. [Screen Layout](#screen-layout)

---

## Introduction

**Skynet AI Assistant** is a next-generation AI assistant platform built as a dynamic web application. It leverages advanced foundation models and reasoning-enhanced language models to provide users with intelligent, contextual, and helpful responses. The system integrates multiple AI models with different capabilities and performance characteristics, allowing users to select the appropriate model for their specific needs.

The platform features:
- A React-based web interface with real-time conversation capabilities
- Integration with multiple AI models through the Groq API
- Specialized AI agents for specific domains (coding, writing, data analysis, etc.)
- Multi-agent collaborative systems (Superagents) that combine multiple AI models
- Conversation history management and retrieval
- Transparent reasoning visualization for supported models
- Dark/light mode themes and accessibility features

The application aims to address the limitations of current AI assistants by providing more transparency in the reasoning process, allowing model selection based on task requirements, maintaining context across interactions, offering specialized domain expertise, and enabling collaboration between AI agents for complex problem-solving.

---

## Feasibility Study & Requirement Analysis

### Technical Feasibility

1. **Technology Stack:**
   - Frontend: React, TypeScript, Tailwind CSS, Vite
   - API Integration: Groq API for AI model access
   - Storage: Browser localStorage/sessionStorage
   - Deployment: Static site hosting (Netlify, Vercel, etc.)

2. **Technical Risks:**
   - Dependency on third-party API (Groq) for core functionality
   - Browser storage limitations for conversation history
   - Performance considerations for streaming large responses
   - Cross-browser compatibility challenges

3. **Risk Mitigation:**
   - Implement robust error handling for API failures
   - Use efficient data structures for storage optimization
   - Implement response streaming with buffering for smooth rendering
   - Comprehensive cross-browser testing

### Economic Feasibility

1. **Development Costs:**
   - Development time: Approximately 120-160 person-hours
   - API usage costs: Variable based on model selection and usage volume
   - Hosting costs: Minimal for static site hosting

2. **Operational Costs:**
   - Ongoing API costs based on usage
   - Maintenance and updates: 5-10 hours monthly

3. **Return on Investment:**
   - Enhanced productivity for users through specialized agents
   - Improved problem-solving through multi-agent workflows
   - Competitive advantage through model selection and transparency features

### Operational Feasibility

1. **User Experience Requirements:**
   - Intuitive interface requiring minimal training
   - Response times under 5 seconds for initial token generation
   - Smooth streaming of responses without UI jank
   - Accessible design for diverse user needs

2. **Maintenance Requirements:**
   - Regular updates to model integration as new models become available
   - Periodic updates to UI components and frameworks
   - Ongoing monitoring of API stability and performance

### Functional Requirements

1. **User Authentication:**
   - FR1: Allow users to access the platform without mandatory authentication
   - FR2: Store conversation history in browser session storage

2. **Conversation Management:**
   - FR3: Allow users to start new conversations
   - FR4: Save conversation history
   - FR5: Allow users to view and continue previous conversations
   - FR6: Allow users to delete conversations

3. **AI Model Integration:**
   - FR7: Integrate multiple AI models with different capabilities
   - FR8: Allow users to select different AI models for conversations
   - FR9: Display reasoning steps for models with reasoning capabilities

4. **Specialized Agents:**
   - FR10: Provide specialized AI agents for various domains
   - FR11: Allow users to interact with domain-specific agents
   - FR12: Support agent customization through system prompts

5. **Superagent Workflows:**
   - FR13: Implement multi-agent workflows that combine specialized agents
   - FR14: Allow users to initiate superagent workflows with specific inputs
   - FR15: Display intermediate steps and final results of workflows

6. **User Interface:**
   - FR16: Provide a responsive web interface
   - FR17: Support both dark and light themes
   - FR18: Provide an intuitive chat interface
   - FR19: Display appropriate loading states during AI processing

### Non-Functional Requirements

1. **Performance:**
   - NFR1: Display typing indicators during AI response generation
   - NFR2: Stream AI responses for improved user experience
   - NFR3: Optimize UI rendering to prevent jank during text streaming
   - NFR4: Initial page load time under 1.5 seconds

2. **Usability:**
   - NFR5: Accessible on desktop and mobile browsers
   - NFR6: Provide clear feedback for user actions
   - NFR7: Implement keyboard shortcuts for common actions
   - NFR8: Ensure responsive design from 320px to 2560px width

3. **Reliability:**
   - NFR9: Handle API errors gracefully
   - NFR10: Provide retry mechanisms for failed requests
   - NFR11: Preserve unsent user input in case of errors

4. **Security:**
   - NFR12: Securely transmit data to AI model providers
   - NFR13: Not expose API keys in client-side code
   - NFR14: Implement appropriate content filtering

5. **Maintainability:**
   - NFR15: Follow component-based architecture for easy updates
   - NFR16: Include comprehensive code documentation
   - NFR17: Use TypeScript for improved type safety

---

## Data Dictionary

### Core Data Structures

#### Message
Represents a single message in a conversation.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (UUID) |
| role | enum ('user', 'assistant', 'system') | The role of the message sender |
| content | string | The message content text |
| reasoning | string (optional) | Reasoning process for assistant messages (only for reasoning models) |
| timestamp | Date | Time the message was created |

#### Conversation
Represents a complete conversation thread.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier (UUID) |
| title | string | Conversation title (derived from first message) |
| messages | Message[] | Array of messages in the conversation |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

#### ChatState
Represents the current state of the chat interface.

| Field | Type | Description |
|-------|------|-------------|
| messages | Message[] | Current messages in the active conversation |
| isLoading | boolean | Whether a response is currently being generated |
| error | string (nullable) | Error message if an error occurred |

#### ModelConfig
Configuration for an AI model.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Model identifier |
| name | string | Display name |
| description | string | Short description |
| category | enum ('Foundation', 'Reasoning') | Model category |
| reasoningCapable | boolean (optional) | Whether the model supports reasoning |
| specs | object (optional) | Technical specifications (parameters, context window, etc.) |
| recommended | string[] (optional) | Recommended use cases |
| gradient | string (optional) | UI gradient style |
| useCases | string[] (optional) | Typical use cases |

#### Agent
Configuration for a specialized AI agent.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Unique identifier |
| name | string | Display name |
| description | string | Short description |
| avatar | string (optional) | Icon or image reference |
| category | string (optional) | Domain category |
| capabilities | string[] (optional) | List of capabilities |
| role | string (optional) | Role description |
| model | string (optional) | Preferred model |
| systemPrompt | string | Agent-specific system prompt |

### API-Related Types

#### GroqResponse
Response structure from the Groq API.

| Field | Type | Description |
|-------|------|-------------|
| id | string | Response identifier |
| choices | array | Array of response choices |
| choices[].message | object | Message object containing role and content |
| choices[].reasoning | string (optional) | Reasoning process (only for reasoning models) |
| choices[].finish_reason | string (optional) | Reason the response completed |

#### ReasoningFormat
Controls how reasoning is displayed for reasoning-capable models.

| Value | Description |
|-------|-------------|
| 'parsed' | Show reasoning in a separate section |
| 'raw' | Include reasoning in the main response |
| 'hidden' | Don't show reasoning process |

### Storage Keys

| Key | Storage Type | Description |
|-----|-------------|-------------|
| 'conversations' | sessionStorage | Stored conversations |
| 'darkMode' | localStorage | Dark mode preference |

---

## ER Diagram & Data Flow Diagram

### Entity-Relationship Diagram

The application uses client-side storage rather than a traditional database. However, conceptually, the data relationships can be modeled as follows:

```
┌───────────────────┐       ┌───────────────────┐
│     User          │       │   Conversation    │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │       │ id (PK)           │
│ username          │1     *│ title             │
│ avatar_url        ├───────┤ user_id (FK)      │
│ created_at        │       │ created_at        │
│ updated_at        │       │ updated_at        │
└───────────────────┘       └─────────┬─────────┘
                                     │
                                     │
                                     │1
                                     │
                                     │
                            ┌────────▼──────────┐
                            │      Message      │
                            ├───────────────────┤
                            │ id (PK)           │
                            │ conversation_id(FK)│
                            │ role              │
                            │ content           │
                            │ reasoning         │
                            │ created_at        │
                            └───────────────────┘
```

### Agent Relationships Diagram

```
┌───────────────────┐       ┌───────────────────┐
│     Agent         │       │    Capability     │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │       │ id (PK)           │
│ name              │*     *│ name              │
│ description       ├───────┤ description       │
│ avatar            │       │                   │
│ category          │       │                   │
│ systemPrompt      │       │                   │
└────────┬──────────┘       └───────────────────┘
         │
         │1
         │
         │
         │*
┌────────▼──────────┐       ┌───────────────────┐
│  AgentInteraction │       │      Model        │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │       │ id (PK)           │
│ agent_id (FK)     │*     1│ name              │
│ user_id (FK)      ├───────┤ description       │
│ created_at        │       │ category          │
└───────────────────┘       │ reasoningCapable  │
                            └───────────────────┘
```

### Superagent Workflow Diagram

```
┌───────────────────┐       ┌───────────────────┐
│    Superagent     │       │   WorkflowStep    │
├───────────────────┤       ├───────────────────┤
│ id (PK)           │1     *│ id (PK)           │
│ name              ├───────┤ superagent_id (FK)│
│ description       │       │ step_number       │
│ category          │       │ agent_id (FK)     │
└───────────────────┘       │ description       │
                            └───────────────────┘
```

### Data Flow Diagram (Level 0)

```
                   ┌───────────────────┐
                   │                   │
User Request  ────▶│  Skynet AI        │
                   │  Assistant        │◀───── AI Models (Groq API)
User Interface ◀───│                   │
                   └───────────────────┘
                          ▲   │
                          │   ▼
                     Local Storage
                    (Conversations,
                      Preferences)
```

### Data Flow Diagram (Level 1)

```
                           ┌───────────────┐
                           │               │
                        ┌─▶│ UI Components │───┐
                        │  │               │   │
                        │  └───────────────┘   │
                        │                      ▼
┌───────────────┐       │                 ┌────────────────┐
│               │       │                 │                │
│  User Input   │──────▶│                 │    Renderer    │
│               │       │                 │                │
└───────────────┘       │                 └────────────────┘
                        │                       │
                        │                       ▼
                        │                 ┌────────────────┐
┌───────────────┐       │                 │                │
│               │       │                 │  User Display  │
│   Groq API    │◀─────▶│                 │                │
│               │       │                 └────────────────┘
└───────────────┘       │
                        │  ┌───────────────┐
                        │  │               │
                        └──┤ State Manager │
                           │               │
                           └───────┬───────┘
                                   │
                                   ▼
                           ┌───────────────┐
                           │               │
                           │ Local Storage │
                           │               │
                           └───────────────┘
```

---

## Code

### Key Components and Implementation Details

#### API Integration (src/api/groqApi.ts)

The application integrates with the Groq API to access various AI models:

```typescript
// Check if a model is a reasoning model
export const isReasoningModel = (modelId: string): boolean => {
  const reasoningModels = [
    'qwen-qwq-32b',
    'deepseek-r1-distill-qwen-32b',
    'deepseek-r1-distill-llama-70b'
  ];
  return reasoningModels.includes(modelId);
};

// Improved streaming API with better buffering for smoother text rendering
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

    // Process the stream
    const reader = response.body?.getReader();
    if (!reader) throw new Error('Response body is null');

    const decoder = new TextDecoder('utf-8');
    let buffer = '';
    let contentBuffer = '';
    let reasoningBuffer = '';
    let lastUpdateTime = Date.now();
    
    // Buffer settings for smoother UI updates
    const MAX_BUFFER_SIZE = 100;  // Characters
    const MIN_UPDATE_INTERVAL = 50; // Milliseconds (ms)

    const processStream = async () => {
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
          }
          
          if (reasoning) {
            reasoningBuffer += reasoning;
          }
          
          // Check if we should flush buffers based on size or time
          const now = Date.now();
          const timeElapsed = now - lastUpdateTime;
          
          if (contentBuffer.length >= MAX_BUFFER_SIZE || 
              reasoningBuffer.length >= MAX_BUFFER_SIZE ||
              timeElapsed >= MIN_UPDATE_INTERVAL) {
            
            if (contentBuffer) {
              onChunk(contentBuffer, 'content');
              contentBuffer = '';
            }
            
            if (reasoningBuffer) {
              onChunk(reasoningBuffer, 'reasoning');
              reasoningBuffer = '';
            }
            
            lastUpdateTime = now;
          }
        } catch (error) {
          console.error('Error parsing stream:', error, data);
        }
      }
      
      // Continue processing
      processStream();
    };
    
    processStream();
  } catch (error) {
    console.error('Error streaming from Groq API:', error);
    throw error;
  }
};
```

#### Multi-Agent Implementation (src/lib/crewai.ts)

The application implements a multi-agent system using a CrewAI-inspired approach:

```typescript
// Simplified CrewMember class (inspired by CrewAI)
export class CrewMember {
  name: string;
  role: string;
  goal: string;
  backstory: string;
  model: string;
  
  constructor(name: string, role: string, goal: string, backstory: string, model: string = "llama3-70b-8192") {
    this.name = name;
    this.role = role;
    this.goal = goal;
    this.backstory = backstory;
    this.model = model;
  }
  
  // Method to create a prompt for this crew member
  createPrompt(task: string, context: string = ""): string {
    return `
      # Role: ${this.name} - ${this.role}
      
      ## Goal
      ${this.goal}
      
      ## Backstory
      ${this.backstory}
      
      ## Context
      ${context}
      
      ## Task
      ${task}
      
      Please complete this task to the best of your abilities. Be thorough and provide high-quality output.
    `;
  }
  
  // Method to execute a task
  async executeTask(task: string, context: string = ""): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error('GROQ API key is not set. Please set the VITE_GROQ_API_KEY environment variable.');
    }
    
    const chatModel = new ChatGroq({
      apiKey: GROQ_API_KEY,
      modelName: this.model,
      temperature: 0.7,
      maxTokens: 4096,
    });
    
    const promptTemplate = PromptTemplate.fromTemplate(this.createPrompt(task, context));
    
    const chain = RunnableSequence.from([
      promptTemplate,
      chatModel,
      new StringOutputParser()
    ]);
    
    try {
      const result = await chain.invoke({});
      return result;
    } catch (error) {
      console.error(`Error with crew member ${this.name}:`, error);
      throw error;
    }
  }
}

// Simplified Crew class (inspired by CrewAI)
export class Crew {
  name: string;
  description: string;
  members: CrewMember[];
  
  constructor(name: string, description: string) {
    this.name = name;
    this.description = description;
    this.members = [];
  }
  
  // Add a member to the crew
  addMember(member: CrewMember): void {
    this.members.push(member);
  }
  
  // Execute a sequential workflow where each member builds on the previous
  async executeSequentialWorkflow(
    initialTask: string,
    callback?: (member: CrewMember, output: string) => void
  ): Promise<string> {
    let context = "";
    let result = "";
    
    for (const member of this.members) {
      try {
        result = await member.executeTask(initialTask, context);
        context += `\n\n${member.name} (${member.role}) output:\n${result}\n\n`;
        
        if (callback) {
          callback(member, result);
        }
      } catch (error) {
        console.error(`Error in workflow at member ${member.name}:`, error);
        throw error;
      }
    }
    
    return result;
  }
}
```

#### Message Rendering (src/components/MessageBubble.tsx)

The application implements custom message rendering with Markdown support and code highlighting:

```typescript
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
    </div>
  );
}
```

#### Main App Component (src/App.tsx)

The main application component that manages routing and global state:

```typescript
function App() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null
  });
  
  // Set dark mode as default
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : true;
  });
  
  // Settings state
  const [isSettingsPanelOpen, setIsSettingsPanelOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentModel, setCurrentModel] = useState('llama-3.3-70b-versatile');
  const [settingsUpdated, setSettingsUpdated] = useState(false);
  const [reasoningFormat, setReasoningFormat] = useState<ReasoningFormat>('parsed');
  
  // Model dropdown state
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  
  // Conversation history
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const savedConversations = sessionStorage.getItem('conversations');
    return savedConversations ? JSON.parse(savedConversations) : [];
  });
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  // Save dark mode preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Save conversations to sessionStorage when they change
  useEffect(() => {
    sessionStorage.setItem('conversations', JSON.stringify(conversations));
  }, [conversations]);
  
  // Handle message sending
  const handleSendMessage = async (content: string) => {
    // Create a new user message
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date()
    };

    // Create an empty assistant message for streaming
    const assistantMessageId = crypto.randomUUID();
    const assistantMessage: Message = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      reasoning: isReasoningModel(currentModel) ? '' : undefined,
      timestamp: new Date()
    };

    // Update state with user message, empty assistant message, and set loading
    setChatState(prev => {
      // Don't add the user message if this is a regeneration (system message exists)
      const lastMessage = prev.messages[prev.messages.length - 1];
      const isRegeneration = lastMessage && lastMessage.role === 'system' && 
                             lastMessage.content === '--- Regenerating response ---';
      
      return {
        ...prev,
        messages: isRegeneration 
          ? [...prev.messages, assistantMessage] 
          : [...prev.messages, userMessage, assistantMessage],
        isLoading: true,
        error: null
      };
    });

    try {
      // Convert messages to the format required by the API
      const apiMessages = [
        { role: 'system' as const, content: ZEV_SYSTEM_PROMPT },
        ...chatState.messages
          .filter(msg => msg.role !== 'system' || msg.content !== '--- Regenerating response ---')
          .map(msg => ({
            role: msg.role,
            content: msg.content
          })),
        { role: 'user' as const, content }
      ];

      // Use streaming API with improved buffering
      streamMessageFromGroq(
        apiMessages,
        // On each chunk, update the assistant message content
        (chunk, type) => {
          setChatState(prev => {
            const updatedMessages = prev.messages.map(msg => {
              if (msg.id === assistantMessageId) {
                if (type === 'content') {
                  return { ...msg, content: msg.content + chunk };
                } else if (type === 'reasoning' && msg.reasoning !== undefined) {
                  return { ...msg, reasoning: (msg.reasoning || '') + chunk };
                }
              }
              return msg;
            });
            return {
              ...prev,
              messages: updatedMessages
            };
          });
        },
        // On complete, mark loading as false and save conversation
        () => {
          setChatState(prev => ({
            ...prev,
            isLoading: false
          }));
          
          // Wait a bit for any final updates to be applied
          setTimeout(() => saveCurrentConversation(), 300);
        },
        currentModel,
        reasoningFormat
      );
    } catch (error) {
      // Handle errors
      setChatState(prev => {
        // Keep the user message but remove the empty assistant message
        const messages = prev.messages.filter(msg => msg.id !== assistantMessageId);
        return {
          messages,
          isLoading: false,
          error: error instanceof Error ? error.message : 'An unknown error occurred'
        };
      });
    }
  };

  // Other functions and JSX...

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage isDarkMode={isDarkMode} />} />
        <Route path="/chat" element={<ChatView />} />
        <Route path="/profile" element={<ProfilePage isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />} />
        <Route path="/agents" element={<AgentsPage isDarkMode={isDarkMode} />} />
        <Route path="/superagents" element={<SuperagentsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
```

---

## Screen Layout

### Main Pages & Components

#### Landing Page
![Landing Page](https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2565&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

The landing page features:
- Hero section with project title and call-to-action buttons
- Features section highlighting key capabilities
- Models section showcasing available AI models
- Agents section introducing specialized AI agents
- Superagent workflow demonstration
- Footer with navigation links

#### Chat Interface
![Chat Interface](https://images.unsplash.com/photo-1671016233441-a8e87e690e6a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

The main chat interface includes:
- Header with model selector and navigation controls
- Message history area with user and assistant messages
- Input area with send button
- Sidebar for conversation history (collapsible)
- Settings panel (accessible via header)

#### Agent Gallery
![Agent Gallery](https://images.unsplash.com/photo-1617696005781-365835c4e369?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

The agent gallery includes:
- Header with navigation controls
- Search bar for filtering agents
- Category tabs for organizing agents
- Agent cards with name, description, and capabilities
- Visual indicators of agent specialization

#### Superagent Workflow
![Superagent Interface](https://images.unsplash.com/photo-1600132806608-231446b2e7af?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

The superagent workflow interface includes:
- Input form for task specification
- Progress indicators for each agent in the workflow
- Live updates of intermediate results
- Final output display with formatting
- Workflow explanation and agent descriptions

#### Settings Panel
![Settings Panel](https://images.unsplash.com/photo-1617396900799-f4ec2b43c7ae?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)

The settings panel includes:
- Dark/light mode toggle
- Model selection options
- Reasoning format controls
- Temperature and other model parameters
- User preference settings

### Responsive Design

The application is designed to be responsive across multiple device sizes:

- **Desktop (1200px+)**: Full layout with sidebar and expanded content areas
- **Tablet (768px-1199px)**: Adapted layout with collapsible sidebar and rearranged components
- **Mobile (320px-767px)**: Compact layout with minimized UI elements and stacked components

### Accessibility Features

The application implements several accessibility features:

- Keyboard navigation support
- Color contrast compliance (WCAG AA)
- Screen reader compatibility
- Focus management for interactive elements
- Alternative text for visual elements
- Semantic HTML structure

### Dark/Light Mode

The application supports both dark and light modes:

- **Dark Mode**: Dark backgrounds (#0f0f15, #1a1a24) with light text (gray-200, gray-300)
- **Light Mode**: Light backgrounds (white, gray-50) with dark text (gray-800, gray-900)

Theme preference is stored in localStorage and remembered across sessions.

---

*Note: This document is formatted for MS Word with font: Times New Roman, size: Heading (16), Sub-heading (14), Actual data (12).*