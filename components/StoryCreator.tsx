import React, { useState } from 'react';
import { generateStoryFromPrompt } from '../services/geminiService';
import { Story } from '../types';
import { Spinner } from './Spinner';
import { SparklesIcon } from './Icon';

interface StoryCreatorProps {
  onStoryCreated: (story: Story) => void;
  onBack: () => void;
  playSound: (sound: 'magic-sparkle' | 'ui-click') => void;
}

const storyStyles = ["Aventura Fantástica", "Cuento Divertido", "Misterio Mágico", "Lección de Amistad"];

export const StoryCreator: React.FC<StoryCreatorProps> = ({ onStoryCreated, onBack, playSound }) => {
  const [prompt, setPrompt] = useState('');
  const [characterName, setCharacterName] = useState('');
  const [storyStyle, setStoryStyle] = useState(storyStyles[0]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleGenerateStory = async () => {
    if (!prompt.trim()) {
      setError('¡Necesitas escribir una idea para empezar la magia!');
      return;
    }
    playSound('magic-sparkle');
    setIsLoading(true);
    setError(null);
    try {
      const newStory = await generateStoryFromPrompt(prompt, characterName, storyStyle);
      onStoryCreated(newStory);
    } catch (err: any) {
      setError(err.message || "¡Ups! La máquina de ideas se atascó. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center text-center">
        <button
            onClick={() => { playSound('ui-click'); onBack(); }}
            className="self-start flex items-center gap-1 px-3 py-1 mb-4 bg-white/70 backdrop-blur-sm rounded-full shadow text-purple-700 font-bold hover:bg-white transition-all"
            aria-label="Volver a la selección de cuentos"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            Volver
        </button>
        
      <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 md:p-8 w-full">
        <div className="text-purple-600 mb-4">
            <SparklesIcon />
        </div>
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Crea Tu Propia Aventura</h2>
        <p className="text-gray-600 mb-6">¡Dale vida a tu imaginación! Solo necesitamos unos pocos detalles mágicos.</p>

        {isLoading ? (
          <Spinner text="¡Estamos mezclando magia y palabras...!" />
        ) : (
          <div className="space-y-4">
            <div>
                <label className="block text-left font-bold text-purple-800 mb-1">1. ¿Cómo se llama tu personaje?</label>
                <input
                    type="text"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    placeholder="Ej: Pipo, la ardilla valiente"
                    className="w-full p-3 border-2 border-purple-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
            </div>

            <div>
                 <label className="block text-left font-bold text-purple-800 mb-1">2. ¿Qué estilo de cuento te apetece?</label>
                 <div className="grid grid-cols-2 gap-2">
                     {storyStyles.map(style => (
                         <button 
                            key={style} 
                            onClick={() => { playSound('ui-click'); setStoryStyle(style); }}
                            className={`p-2 rounded-lg font-semibold transition-colors ${storyStyle === style ? 'bg-pink-500 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
                        >
                            {style}
                        </button>
                     ))}
                 </div>
            </div>

            <div>
                <label className="block text-left font-bold text-purple-800 mb-1">3. ¿Cuál es tu idea mágica?</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ej: Descubre un mapa del tesoro escondido en un arcoíris."
                  className="w-full p-3 border-2 border-purple-200 rounded-lg text-lg focus:outline-none focus:ring-2 focus:ring-pink-400 min-h-[100px] resize-none"
                  rows={3}
                />
            </div>
            
            <button
              onClick={handleGenerateStory}
              disabled={!prompt.trim()}
              className="w-full px-6 py-4 mt-2 bg-pink-500 text-white font-bold text-xl rounded-full shadow-md hover:bg-pink-600 transition-colors disabled:bg-pink-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <SparklesIcon />
              Crear Cuento
            </button>
            {error && <p className="text-red-500 font-bold mt-4">{error}</p>}
          </div>
        )}
      </div>
    </div>
  );
};