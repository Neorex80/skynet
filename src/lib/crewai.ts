// This is a simplified implementation of CrewAI concepts for the browser
// since CrewAI is primarily a Python library

import { ChatGroq } from "@langchain/groq";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { RunnableSequence } from "@langchain/core/runnables";

// Get API key from environment
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

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

// Create the blog creation crew
export const createBlogCrewWorkflow = async (
  topic: string,
  onStepComplete: (step: number, agent: string, result: string) => void
) => {
  // Create the crew members
  const researcher = new CrewMember(
    "Researcher",
    "Research Specialist",
    "Find relevant facts, statistics, and background information on the given topic",
    "You are an expert researcher with a knack for finding the most relevant and interesting information quickly. You excel at organizing information in a way that's easy to understand and use.",
    "deepseek-r1-distill-qwen-32b"
  );
  
  const writer = new CrewMember(
    "Writer",
    "Content Creator",
    "Transform research into an engaging, well-structured blog post",
    "You are a talented writer who can take raw information and craft it into engaging content. You know how to structure a blog post for readability and impact.",
    "mixtral-8x7b-32768"
  );
  
  const editor = new CrewMember(
    "Editor",
    "Content Improver",
    "Polish the draft for clarity, flow, and readability",
    "You have a keen eye for detail and know how to improve content without changing its essence. You make sure the final product is clear, engaging, and error-free.",
    "mixtral-8x7b-32768"
  );
  
  // Create the crew
  const blogCrew = new Crew(
    "Blog Creation Crew",
    "A team of specialists who work together to create high-quality blog posts"
  );
  
  // Add members to the crew
  blogCrew.addMember(researcher);
  blogCrew.addMember(writer);
  blogCrew.addMember(editor);
  
  try {
    // Execute the workflow
    const finalContent = await blogCrew.executeSequentialWorkflow(
      `Create a comprehensive blog post about: ${topic}`,
      (member, output) => {
        const stepIndex = blogCrew.members.indexOf(member);
        onStepComplete(stepIndex, member.name, output);
      }
    );
    
    return finalContent;
  } catch (error) {
    console.error("Error in blog crew workflow:", error);
    throw error;
  }
};