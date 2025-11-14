import React, { useState, useEffect, useCallback } from 'react';
import { generateImage, generateSpeech } from '../services/geminiService';
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
      const generatedImageUrl = await generateImage(page.imagePrompt);
      setImageUrl(generatedImageUrl);
    } catch (err) {
      setError("¡Oh no! La magia para dibujar se esfumó. Por favor, inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoadingImage(false);
    }
  }, [stopAudio, STORY_PAGES]);
  
  const loadPageAudio = useCallback(async (pageIndex: number, voice: string) => {
    setIsLoadingAudio(true);
    try {
      const page = STORY_PAGES[pageIndex];
      const generatedAudio = await generateSpeech(page.text, voice);
      setAudio(generatedAudio);
      playAudio(generatedAudio);
    } catch (err) {
      setError("¡Vaya! Parece que el narrador se quedó sin voz. Inténtalo de nuevo.");
      console.error(err);
    } finally {
      setIsLoadingAudio(false);
    }
  }, [playAudio, STORY_PAGES]);

  useEffect(() => {
    loadPageImage(currentPage);
  }, [currentPage, loadPageImage]);
  
  useEffect(() => {
    if (!isLoadingImage && imageUrl) {
      loadPageAudio(currentPage, selectedVoice);
    }
  }, [currentPage, selectedVoice, isLoadingImage, imageUrl, loadPageAudio]);


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

  const handleReplayAudio = () => {
    playSound('ui-click');
    if (audio && !isPlaying) {
      playAudio(audio);
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

      <div className="w-full aspect-square bg-purple-200 rounded-2xl shadow-lg flex items-center justify-center mb-4 overflow-hidden border-4 border-white">
        {isLoadingImage ? (
          <Spinner text="Creando una ilustración mágica..." />
        ) : error ? (
           <div className="text-center p-4">
              <p className="text-red-500 font-bold">{error}</p>
           </div>
        ) : (
          <img src={imageUrl} alt="Generated story illustration" className="w-full h-full object-cover" />
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
          onClick={handleReplayAudio}
          disabled={isLoading || isPlaying}
          className="p-4 bg-pink-500 rounded-full shadow-lg text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform transform hover:scale-110"
        >
            {isPlaying || isLoadingAudio ? (
                <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 20 20"><path d="M10 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zM6 7a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1zm8 0a1 1 0 011 1v4a1 1 0 11-2 0V8a1 1 0 011-1z"></path></svg>
            ) : (
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