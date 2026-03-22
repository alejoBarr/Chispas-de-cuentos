import { useState, useEffect, useCallback } from 'react';
import { Story } from '../types';

const STORAGE_KEY = 'chispas_de_cuentos_saved';

export const useStoryStorage = () => {
  const [savedStories, setSavedStories] = useState<Story[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsedStories = JSON.parse(stored);
        // Ensure the limit is respected even on initial load
        if (parsedStories.length > 5) {
          parsedStories = parsedStories.slice(-5);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(parsedStories));
        }
        setSavedStories(parsedStories);
      }
    } catch (error) {
      console.error("Failed to load stories from localStorage", error);
    }
  }, []);

  const saveStory = useCallback((story: Story): Story => {
    // Ensure the story has the generated flag and a unique ID
    const newStory = { ...story, id: `gen_${Date.now()}`, isGenerated: true };
    
    setSavedStories(prev => {
      let updatedStories = [...prev, newStory];
      
      // Limit to 5 stories (FIFO: remove oldest if more than 5)
      if (updatedStories.length > 5) {
        updatedStories = updatedStories.slice(-5);
      }
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
      return updatedStories;
    });
    
    return newStory; // Return the story with the new ID
  }, []);

  const deleteStory = useCallback((storyId: string) => {
    setSavedStories(prev => {
      const updatedStories = prev.filter(s => s.id !== storyId);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
      return updatedStories;
    });
  }, []);

  return { savedStories, saveStory, deleteStory };
};
