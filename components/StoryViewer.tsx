import React, { useState, useEffect, useCallback } from 'react';
import { generateImage } from '../services/geminiService';
import { useAudioPlayer } from '../hooks/useAudioPlayer';
import { Spinner } from './Spinner';
import { Story } from '../types';
import { SaveIcon, ShareIcon } from './Icon';

interface StoryViewerProps {
  story: Story;
  onBack: () => void;
  onSaveStory: (story: Story) => void;
  playSound: (sound: 'page-turn' | 'ui-click') => void;
}

const VOICE_OPTIONS = [
    { id: 'Kore', name: 'Voz 1' },
    { id: 'Puck', name: 'Voz 2' },
    { id: 'Zephyr', name: 'Voz 3' },
    { id: 'Charon', name: 'Voz 4' },
];

export const StoryViewer: React.FC<StoryViewerProps> = ({ story, onBack, onSaveStory, playSound }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [audio, setAudio] = useState<string>('');
  const [isLoadingImage, setIsLoadingImage] = useState(true);
  const [isLoadingAudio, setIsLoadingAudio] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { playAudio, stopAudio, isPlaying } = useAudioPlayer();
  const [selectedVoice, setSelectedVoice] = useState(VOICE_OPTIONS[0].id);
  const [isSaved, setIsSaved] = useState(!!story.id);
  
  const STORY_PAGES = story.pages;

  const loadPageImage = useCallback(async (pageIndex: number) => {
    setIsLoadingImage(true);
    setError(null);
    stopAudio();
    try {
      const page = STORY_PAGES[pageIndex];
      // Si la página ya tiene una imagen estática o URL definida, úsala directamente
      if (page.image) {
        const img = new Image();
        img.src = page.image;
        img.onload = () => {
          setImageUrl(page.image!);
          setIsLoadingImage(false);
        };
        img.onerror = () => {
          console.error("Failed to load static image:", page.image);
          setImageUrl(page.image!); 
          setIsLoadingImage(false);
        };
        return; // Exit early as loading is handled by img.onload/onerror
      }
      
      // Si es un cuento generado por IA, mostramos el emoji en todas las páginas
      // para mantener la coherencia visual sin depender de servicios externos.
      if (story.isGenerated) {
        setImageUrl('');
        setIsLoadingImage(false);
        return;
      }

      // If no static image, generate one
      const generatedImageUrl = await generateImage(page.imagePrompt, story.emoji);
      setImageUrl(generatedImageUrl);
      setIsLoadingImage(false);
    } catch (err) {
      setError("¡Oh no! La magia para dibujar se esfumó. Por favor, inténtalo de nuevo.");
      console.error(err);
      setIsLoadingImage(false);
    }
  }, [stopAudio, STORY_PAGES, story.emoji, story.isGenerated]);
  
  const updateAudioText = useCallback((pageIndex: number) => {
    setIsLoadingAudio(false); 
    const page = STORY_PAGES[pageIndex];
    setAudio(page.text);
  }, [STORY_PAGES]);

  useEffect(() => {
    loadPageImage(currentPage);
  }, [currentPage, loadPageImage]);
  
  useEffect(() => {
    if (!isLoadingImage) {
      updateAudioText(currentPage);
    }
  }, [currentPage, isLoadingImage, updateAudioText]);


  const handleNext = () => {
    if (currentPage < STORY_PAGES.length - 1) {
      playSound('page-turn');
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      playSound('page-turn');
      setCurrentPage(currentPage - 1);
    }
  };

  const handleToggleAudio = () => {
    playSound('ui-click');
    if (isPlaying) {
      stopAudio();
    } else if (audio) {
      playAudio(audio, selectedVoice);
    }
  };
  
  const handleShare = async () => {
    playSound('ui-click');
    if (navigator.share) {
        try {
            await navigator.share({
                title: "Chispas de Cuentos ✨",
                text: "¡Descubre un mundo de cuentos mágicos con IA! Lee, escucha y crea tus propias historias.",
                url: window.location.href,
            });
        } catch (error) {
            console.error('Error al compartir', error);
        }
    } else {
        alert('Tu navegador no soporta la función de compartir. ¡Copia y pega el enlace para invitar a tus amigos!');
    }
  };
  
  const handleSave = () => {
    playSound('ui-click');
    if (!isSaved) {
        onSaveStory(story);
        setIsSaved(true);
    }
  };

  const page = STORY_PAGES[currentPage];
  const isLoading = isLoadingImage || isLoadingAudio;

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto p-4 md:p-6 relative">
       <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-10 flex items-center gap-2">
        <button
            onClick={() => { playSound('ui-click'); onBack(); }}
            className="flex items-center gap-1 px-3 py-1 bg-white/70 backdrop-blur-sm rounded-full shadow text-purple-700 font-bold hover:bg-white transition-all"
            aria-label="Volver a la selección de cuentos"
        >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
            <span className="hidden sm:inline">Volver</span>
        </button>
      </div>

       <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 flex items-center gap-2">
         {story.isGenerated && (
             <button onClick={handleSave} disabled={isSaved} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-full shadow text-purple-700 font-bold hover:bg-white transition-all disabled:opacity-60 disabled:cursor-not-allowed" aria-label="Guardar cuento">
                <SaveIcon />
                <span className="hidden sm:inline">{isSaved ? 'Guardado' : 'Guardar'}</span>
            </button>
         )}
         <button onClick={handleShare} className="flex items-center gap-1.5 px-3 py-1.5 bg-white/70 backdrop-blur-sm rounded-full shadow text-purple-700 font-bold hover:bg-white transition-all" aria-label="Compartir aplicación">
            <ShareIcon />
            <span className="hidden sm:inline">Compartir</span>
         </button>
         <select
            value={selectedVoice}
            onChange={(e) => { 
                playSound('ui-click');
                setSelectedVoice(e.target.value);
            }}
            className="px-2 py-1 bg-white/70 backdrop-blur-sm rounded-full shadow text-purple-700 font-bold hover:bg-white transition-all focus:outline-none focus:ring-2 focus:ring-pink-400"
            aria-label="Seleccionar voz del narrador"
          >
            {VOICE_OPTIONS.map(voice => (
                <option key={voice.id} value={voice.id}>{voice.name}</option>
            ))}
          </select>
      </div>

      <div className="w-full aspect-square bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 overflow-hidden border-4 border-purple-200 relative">
        {isLoadingImage ? (
          <div>
            <Spinner text="Abriendo el baúl de los cuentos..." />
          </div>
        ) : error ? (
           <div className="text-center p-6 bg-white/60 backdrop-blur-sm rounded-2xl mx-4">
              <div className="text-7xl mb-2 drop-shadow-lg">{story.emoji}</div>
              <p className="text-red-600 font-bold mb-1">{error}</p>
              <p className="text-sm text-purple-800 italic">¡Usa tu imaginación mientras vuelve la magia!</p>
           </div>
        ) : imageUrl ? (
          <img src={imageUrl} alt="Ilustración del cuento" className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-purple-50 to-pink-50">
             <div className="text-[150px] sm:text-[200px] drop-shadow-2xl transform hover:scale-105 transition-transform duration-500 cursor-default select-none">
                {story.emoji}
             </div>
          </div>
        )}
      </div>

      <div className="w-full bg-white/70 backdrop-blur-sm p-6 rounded-2xl shadow-md text-center mb-6 min-h-[100px]">
        <p className="text-xl md:text-2xl text-gray-800 font-medium leading-relaxed">{page.text}</p>
      </div>

      <div className="flex items-center justify-center space-x-4 w-full">
        <button
          onClick={handlePrev}
          disabled={currentPage === 0 || isLoading}
          className="px-6 py-3 bg-white rounded-full shadow-md text-pink-500 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Anterior
        </button>
        
        <button 
          onClick={handleToggleAudio}
          disabled={isLoadingAudio}
          className="p-4 bg-pink-500 rounded-full shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-110"
        >
            {isPlaying ? (
               // Stop Icon (Square)
               <svg className="w-8 h-8 animate-pulse text-red-100" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd"></path></svg>
            ) : isLoadingAudio ? (
                // Loading Icon
                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zM6 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm8 0a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z"></path></svg>
            ) : (
                // Play Icon (Triangle)
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4a1 1 0 011.555.832l3 6a1 1 0 010 .336l-3 6A1 1 0 017 16V4z"></path></svg>
            )}
        </button>

        <button
          onClick={handleNext}
          disabled={currentPage === STORY_PAGES.length - 1 || isLoading}
          className="px-6 py-3 bg-white rounded-full shadow-md text-pink-500 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-105"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};