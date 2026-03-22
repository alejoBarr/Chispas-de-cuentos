export interface StoryPage {
  text: string;
  imagePrompt: string;
  image?: string;
}

export interface Story {
  id?: string;
  title: string;
  description?: string;
  emoji: string;
  ageRange?: string;
  pages: StoryPage[];
  tags?: string[];
  isGenerated?: boolean;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}
