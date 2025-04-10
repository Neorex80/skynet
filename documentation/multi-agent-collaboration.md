# Multi-Agent Collaboration Diagram

This diagram illustrates how multiple agents can collaborate to solve complex problems in the Skynet AI Assistant system.

## Agent Collaboration Architecture

```mermaid
graph TD
    subgraph User Interface
        A[User Input] --> B[Task Analysis]
        B --> C{Task Type}
    end
    
    subgraph Agent Dispatcher
        C -->|Simple Task| D[Single Agent Processing]
        C -->|Complex Task| E[Multi-Agent Workflow]
        E --> F[Task Decomposition]
        F --> G[Agent Selection]
    end
    
    subgraph Single Agent Path
        D --> H[Specialized Agent]
        H --> I[Direct Response]
    end
    
    subgraph Multi-Agent Path
        G --> J[Primary Agent]
        G --> K[Supporting Agent 1]
        G --> L[Supporting Agent 2]
        
        J <-.-> K
        J <-.-> L
        K <-.-> L
        
        J --> M[Synthesized Response]
        K --> M
        L --> M
    end
    
    I --> N[User Interface]
    M --> N
    
    style User Interface fill:#1a1a24,stroke:#3b82f6,color:#ffffff
    style Agent Dispatcher fill:#0f0f15,stroke:#3b82f6,color:#ffffff
    style Single Agent Path fill:#222233,stroke:#60a5fa,color:#ffffff
    style Multi-Agent Path fill:#1c1c2e,stroke:#818cf8,color:#ffffff
```

## Superagent Blog Creation Workflow

```mermaid
sequenceDiagram
    participant User
    participant Supervisor as Workflow Supervisor
    participant Researcher
    participant Writer
    participant Editor
    
    User->>Supervisor: Request blog post on [Topic]
    Supervisor->>Researcher: Assign research task
    Researcher->>Researcher: Gather facts and information
    Researcher->>Supervisor: Return research results
    Supervisor->>Writer: Provide topic and research
    Writer->>Writer: Draft blog content
    Writer->>Supervisor: Return draft content
    Supervisor->>Editor: Provide draft for improvement
    Editor->>Editor: Polish and optimize content
    Editor->>Supervisor: Return final content
    Supervisor->>User: Deliver completed blog post
    
    note over Researcher,Editor: Each agent operates with a specialized prompt<br/>and optimal model for its specific task
```

## Agent Communication Pattern

```mermaid
flowchart LR
    subgraph "Data Flow Between Agents"
        direction TB
        
        A[Agent Input] --> B[Task Processing]
        B --> C[Agent Output]
        
        D[Context Accumulation]
        
        A -.-> D
        C -.-> D
        D -.-> B
    end
    
    subgraph "LangChain Implementation"
        direction TB
        
        E[RunnableSequence]
        F[PromptTemplate]
        G[ChatModel]
        H[OutputParser]
        
        E --> F
        F --> G
        G --> H
    end
    
    A --- E
    C --- H
    
    style A fill:#3b82f6,color:#ffffff
    style C fill:#3b82f6,color:#ffffff
    style D fill:#4f46e5,color:#ffffff
    style E fill:#4f46e5,color:#ffffff
```

## Multi-Agent Interaction Types

### Sequential Workflow (Pipeline)
Used in the Blog Creation Superagent:

```mermaid
flowchart LR
    A[Input] --> B[Researcher]
    B --> C[Writer]
    C --> D[Editor]
    D --> E[Output]
    
    style A fill:#0f0f15,stroke:#3b82f6,color:#ffffff
    style B fill:#1a1a24,stroke:#3b82f6,color:#ffffff
    style C fill:#1a1a24,stroke:#3b82f6,color:#ffffff
    style D fill:#1a1a24,stroke:#3b82f6,color:#ffffff
    style E fill:#0f0f15,stroke:#3b82f6,color:#ffffff
```

### Parallel Processing
For independent subtasks:

```mermaid
flowchart TB
    A[Input] --> B[Task Coordinator]
    B --> C[Agent 1]
    B --> D[Agent 2]
    B --> E[Agent 3]
    C --> F[Result Aggregator]
    D --> F
    E --> F
    F --> G[Output]
    
    style A fill:#0f0f15,stroke:#3b82f6,color:#ffffff
    style B fill:#1a1a24,stroke:#3b82f6,color:#ffffff
    style C fill:#222233,stroke:#3b82f6,color:#ffffff
    style D fill:#222233,stroke:#3b82f6,color:#ffffff
    style E fill:#222233,stroke:#3b82f6,color:#ffffff
    style F fill:#1a1a24,stroke:#3b82f6,color:#ffffff
    style G fill:#0f0f15,stroke:#3b82f6,color:#ffffff
```

### Hierarchical Collaboration
For complex problem-solving:

```mermaid
flowchart TB
    A[Input] --> B[Lead Agent]
    B --> C[Specialized Agent 1]
    B --> D[Specialized Agent 2]
    C --> E[Sub-Agent 1.1]
    C --> F[Sub-Agent 1.2]
    D --> G[Sub-Agent 2.1]
    E --> B
    F --> B
    G --> B
    B --> H[Output]
    
    style A fill:#0f0f15,stroke:#3b82f6,color:#ffffff
    style B fill:#1a1a24,stroke:#60a5fa,color:#ffffff
    style C fill:#222233,stroke:#3b82f6,color:#ffffff
    style D fill:#222233,stroke:#3b82f6,color:#ffffff
    style E fill:#1c1c2e,stroke:#3b82f6,color:#ffffff
    style F fill:#1c1c2e,stroke:#3b82f6,color:#ffffff
    style G fill:#1c1c2e,stroke:#3b82f6,color:#ffffff
    style H fill:#0f0f15,stroke:#3b82f6,color:#ffffff
```

## Implementation Details

The multi-agent system in Skynet is implemented using:

1. **CrewAI-inspired architecture**: 
   - Defines a Crew of specialized agents
   - Each agent has a specific role and system prompt
   - Agents communicate through context sharing

2. **LangChain integration**:
   - Uses RunnableSequence for chain composition
   - PromptTemplates for dynamic prompt creation
   - Modular design for agent substitution

3. **Context management**:
   - Shared context is passed between agents
   - Each agent contributes to and builds upon the context
   - Final output synthesizes all agent contributions

This architecture enables flexible agent collaboration patterns that can be adapted to different types of complex tasks.