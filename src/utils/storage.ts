import { Conversation, Message } from '../types';

// Helper to load conversations from session storage
export const loadConversations = (): Conversation[] => {
  try {
    const savedConversations = sessionStorage.getItem('conversations');
    if (savedConversations) {
      // Parse stored JSON and ensure dates are properly converted back to Date objects
      return JSON.parse(savedConversations, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'timestamp') {
          return new Date(value);
        }
        return value;
      });
    }
  } catch (error) {
    console.error('Error loading conversations:', error);
  }
  
  return [];
};

// Helper to save conversations to session storage
export const saveConversations = (conversations: Conversation[]): void => {
  try {
    sessionStorage.setItem('conversations', JSON.stringify(conversations));
  } catch (error) {
    console.error('Error saving conversations:', error);
  }
};

// Helper to load dark mode preference from local storage
export const loadDarkModePreference = (): boolean => {
  try {
    const savedDarkMode = localStorage.getItem('darkMode');
    return savedDarkMode ? JSON.parse(savedDarkMode) : true; // Default to dark mode
  } catch (error) {
    console.error('Error loading dark mode preference:', error);
    return true; // Default to dark mode if error
  }
};

// Helper to save dark mode preference to local storage
export const saveDarkModePreference = (isDarkMode: boolean): void => {
  try {
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  } catch (error) {
    console.error('Error saving dark mode preference:', error);
  }
};

// Helper to create a new conversation
export const createNewConversation = (messages: Message[] = []): Conversation => {
  const now = new Date();
  
  return {
    id: crypto.randomUUID(),
    title: messages.length > 0 
      ? getConversationTitle(messages) 
      : 'New Conversation',
    messages,
    createdAt: now,
    updatedAt: now
  };
};

// Helper to get a title for the conversation based on first message
export const getConversationTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find(msg => msg.role === 'user');
  if (firstUserMessage) {
    // Limit title to first 30 characters of first user message
    const title = firstUserMessage.content.trim();
    return title.length > 30 ? title.substring(0, 30) + '...' : title;
  }
  return 'New Conversation';
};

// Helper to update an existing conversation
export const updateConversation = (
  conversations: Conversation[],
  conversationId: string,
  updates: Partial<Conversation>
): Conversation[] => {
  return conversations.map(conv => 
    conv.id === conversationId 
      ? { ...conv, ...updates, updatedAt: new Date() } 
      : conv
  );
};

// Helper to delete a conversation
export const deleteConversation = (
  conversations: Conversation[],
  conversationId: string
): Conversation[] => {
  return conversations.filter(conv => conv.id !== conversationId);
};