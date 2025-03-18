import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { Agent } from "../types";

// Get API key from environment
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

// Create chat models with different settings for each agent
export const createAgentChatModel = (model: string = "llama3-70b-8192") => {
  if (!GROQ_API_KEY) {
    throw new Error('GROQ API key is not set. Please set the VITE_GROQ_API_KEY environment variable.');
  }
  
  return new ChatGroq({
    apiKey: GROQ_API_KEY,
    modelName: model,
    temperature: 0.7,
    maxTokens: 4096,
  });
};

// Create a chain for a researcher agent
export const createResearcherChain = (topic: string) => {
  const researcherPrompt = PromptTemplate.fromTemplate(`
    You're a research helper. Look into the topic: {topic}.
    Give a few bullet points with easy-to-read facts, stats, and some background details.
    
    Topic: {topic}
  `);

  const researcherModel = createAgentChatModel("deepseek-r1-distill-qwen-32b");
  const outputParser = new StringOutputParser();

  return RunnableSequence.from([
    {
      topic: () => topic
    },
    researcherPrompt,
    researcherModel,
    outputParser
  ]);
};

// Create a chain for a writer agent
export const createWriterChain = (topic: string, research: string) => {
  const writerPrompt = PromptTemplate.fromTemplate(`
    Using the info below:
    {research}
    
    Write a blog post about {topic} that is friendly and fun.
    Include a clear title, a simple introduction, organized sections with headings, and a brief conclusion.
    Please output your answer in Markdown format.
    
    Topic: {topic}
    Research: {research}
  `);

  const writerModel = createAgentChatModel("mixtral-8x7b-32768");
  const outputParser = new StringOutputParser();

  return RunnableSequence.from([
    {
      topic: () => topic,
      research: () => research
    },
    writerPrompt,
    writerModel,
    outputParser
  ]);
};

// Create a chain for an editor agent
export const createEditorChain = (content: string) => {
  const editorPrompt = PromptTemplate.fromTemplate(`
    Improve the draft below:
    {content}
    
    Make the post clear and engaging.
    Keep it simple and easy to read.
    Return the final version in Markdown with proper headings.
    
    Draft: {content}
  `);

  const editorModel = createAgentChatModel("mixtral-8x7b-32768");
  const outputParser = new StringOutputParser();

  return RunnableSequence.from([
    {
      content: () => content
    },
    editorPrompt,
    editorModel,
    outputParser
  ]);
};

// Build the full LangChain workflow for blog creation
export const createBlogWorkflow = async (
  topic: string,
  onStepComplete: (step: number, result: string) => void
) => {
  try {
    // Step 1: Research
    const researcherChain = createResearcherChain(topic);
    const research = await researcherChain.invoke({});
    onStepComplete(0, research);

    // Step 2: Writing
    const writerChain = createWriterChain(topic, research);
    const draft = await writerChain.invoke({});
    onStepComplete(1, draft);

    // Step 3: Editing
    const editorChain = createEditorChain(draft);
    const finalContent = await editorChain.invoke({});
    onStepComplete(2, finalContent);

    return finalContent;
  } catch (error) {
    console.error("Error in blog workflow:", error);
    throw error;
  }
};

// A simpler function to just process with a specific agent using LangChain
export const processWithAgentChain = async (agent: Agent, input: string): Promise<string> => {
  try {
    const model = createAgentChatModel(agent.model);
    
    const promptTemplate = PromptTemplate.fromTemplate(agent.systemPrompt + "\n\n{input}");
    
    // Create a simple chain
    const chain = RunnableSequence.from([
      {
        input: () => input
      },
      promptTemplate,
      model,
      new StringOutputParser()
    ]);
    
    // Execute the chain
    const result = await chain.invoke({});
    return result;
  } catch (error) {
    console.error(`Error processing with agent ${agent.name}:`, error);
    throw error;
  }
};