# Skynet AI Assistant

![image](https://github.com/user-attachments/assets/4b64a841-c051-4ff9-a9d9-d272b6ca9219)


Skynet is a next-generation AI assistant platform that leverages advanced foundation models and reasoning-enhanced language models to provide users with intelligent, contextual, and helpful responses.

## ✨ Features

- 🤖 **Multiple AI Models**: Choose from various foundation and reasoning models
- 💬 **Natural Conversations**: Engage in fluid, natural conversations with context awareness
- 🧠 **Advanced Reasoning**: View the AI's thinking process with transparent reasoning models
- 👨‍💻 **Code Assistance**: Generate and debug code with syntax highlighting
- 🎯 **Specialized Agents**: Access purpose-built AI agents for specific domains
- ⚡ **Superagents**: Use multi-agent workflows for complex tasks
- 🔄 **Conversation History**: Save and continue previous conversations
- 🎨 **Dark/Light Themes**: Choose your preferred visual style

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/skynet-ai-assistant.git
cd skynet-ai-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with your Groq API key:
```
VITE_GROQ_API_KEY=your_groq_api_key_here
```
You can copy the `.env.example` file to create your `.env` file.

4. Start the development server:
```bash
npm run dev
```

5. Open http://localhost:5173 to view the app in your browser.

## 🏗️ Project Structure

```
src/
├── api/            # API integration (Groq API)
├── components/     # React components
├── config/         # Configuration files
├── constants/      # Constants and system prompts
├── data/           # Data files (models, agents)
├── hooks/          # Custom React hooks
├── lib/            # Libraries and utilities
├── pages/          # Page components
├── types/          # TypeScript type definitions
├── utils/          # Utility functions
├── App.tsx         # Main application component
├── main.tsx        # Entry point
└── index.css       # Global styles
```

## 📚 Key Components

- **Chat Interface**: Main conversation interface with message history
- **Model Selector**: UI for selecting different AI models
- **Reasoning Display**: UI for showing model reasoning steps
- **Specialized Agents**: UI for accessing domain-specific AI assistants
- **Superagent Workflows**: Interface for multi-agent collaboration

## 🧩 AI Models

### Foundation Models
- Llama 3.3 70B
- Gemma 2 9B
- Mixtral 8x7B
- Llama 3.1 8B

### Reasoning Models
- Qwen QWQ 32B
- DeepSeek R1 (Qwen 32B)
- DeepSeek R1 (Llama 70B)

## 🤖 Specialized Agents

- **Code Wizard**: Programming and development assistance
- **Content Composer**: Writing and content creation
- **Data Sage**: Data analysis and insights
- **Research Navigator**: Research and information gathering
- **Business Strategist**: Business strategy and analysis
- **Security Guardian**: Cybersecurity guidance
- **Interview Coach**: Job interview preparation
- **Design Muse**: Design and creative guidance

## ⚡ Superagents

- **Blog Creation Superagent**: Multi-agent workflow for creating comprehensive blog posts
  - Researcher: Gathers facts and information
  - Writer: Creates engaging content
  - Editor: Polishes and optimizes

## 🔧 Technologies Used

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router](https://reactrouter.com/)
- [React Markdown](https://github.com/remarkjs/react-markdown)
- [Groq API](https://console.groq.com/)
- [LangChain](https://js.langchain.com/)
- [Lucide React](https://lucide.dev/guide/packages/lucide-react)

## 🌐 Environment Variables

The application uses the following environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_GROQ_API_KEY` | Your Groq API key | Yes |

You can get a Groq API key by signing up at [console.groq.com](https://console.groq.com).

## 🧪 Testing

```bash
npm run test
```

## 🏗️ Building for Production

```bash
npm run build
```

## 🔮 Future Enhancements

- Voice interface
- Custom agent creation
- Workflow editor
- Mobile applications
- Document processing
- Data visualization
- Offline capabilities
- Multi-language support
## Purpose 

Project was creatod as major project for collge last year so ... ifyuk

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [Groq](https://groq.com/) for providing the API
- [LangChain](https://js.langchain.com/) for multi-agent framework inspiration
- [Lucide](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
