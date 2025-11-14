import { useState, useEffect, useCallback } from 'react';
import { Story } from '../types';

const STORAGE_KEY = 'chispas_de_cuentos_saved';

export const useStoryStorage = () => {
  const [savedStories, setSavedStories] = useState<Story[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setSavedStories(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load stories from localStorage", error);
    }
  }, []);

  const saveStory = useCallback((story: Story): Story => {
    // Ensure the story has the generated flag
    const newStory = { ...story, id: `gen_${Date.now()}`, isGenerated: true };
    const updatedStories = [...savedStories, newStory];
    setSavedStories(updatedStories);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
    return newStory; // Return the story with the new ID
  }, [savedStories]);

  const deleteStory = useCallback((storyId: string) => {
    const isConfirmed = window.confirm("¿Estás seguro de que quieres borrar este cuento para siempre?");
    if (isConfirmed) {
        const updatedStories = savedStories.filter(s => s.id !== storyId);
        setSavedStories(updatedStories);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedStories));
    }
  }, [savedStories]);

  return { savedStories, saveStory, deleteStory };
};
