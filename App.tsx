import React, { useState, useMemo, useRef } from 'react';
import { StoryViewer } from './components/StoryViewer';
import { ChatBot } from './components/ChatBot';
import { Guide } from './components/Guide';
import { StoryCreator } from './components/StoryCreator';
import { BookOpenIcon, ChatBubbleLeftRightIcon, InformationCircleIcon, SparklesIcon, TrashIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from './components/Icon';
import { Story } from './types';
import { STORIES } from './constants';
import { useStoryStorage } from './hooks/useStoryStorage';

type AppMode = 'welcome' | 'story' | 'chat' | 'guide';
type StoryView = 'selection' | 'viewer' | 'creator';
type SoundType = 'page-turn' | 'magic-sparkle' | 'book-open' | 'ui-click';

const WelcomeScreen: React.FC<{onStart: () => void}> = ({ onStart }) => (
    <div className="flex flex-col items-center justify-center text-center p-4 sm:p-8 min-h-screen w-full">
        {/* Main content, pushed to the center and taking up available space */}
        <div className="flex-grow flex flex-col items-center justify-center">
            <style>{`
                .sparkle { animation: sparkle 3s infinite ease-in-out; }
                @keyframes sparkle {
                  0%, 100% {
                    transform: scale(1) translateY(0);
                    opacity: 0.7;
                  }
                  50% {
                    transform: scale(1.1) translateY(-10px);
                    opacity: 1;
                  }
                }
            `}</style>
            <h1 className="text-5xl sm:text-7xl font-black text-purple-700 drop-shadow-md mb-4">
                Chispas de Cuentos
            </h1>
            <div className="mb-8 sparkle">
                <SparklesIcon className="w-32 h-32 text-yellow-400 drop-shadow-lg" fill="currentColor" stroke="none"/>
            </div>
            <p className="text-xl text-gray-600 mb-8 max-w-md">
                Donde cada historia es una nueva aventura mágica esperando ser contada.
            </p>
            <button
                onClick={onStart}
                className="px-8 py-4 bg-pink-500 text-white font-bold text-xl rounded-full shadow-lg hover:bg-pink-600 transition-all transform hover:scale-110"
            >
                Abrir el libro mágico
            </button>
        </div>

        {/* Bottom content, anchored to the bottom */}
        <div className="w-full max-w-md pb-4">
            <div className="mb-4 p-4 bg-white/50 backdrop-blur-sm rounded-2xl shadow-md">
                <div className="flex items-center justify-center gap-4">
                    <img src="/vite.svg" alt="Icono de Chispas de Cuentos" className="w-16 h-16 flex-shrink-0"/>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-purple-800">¡Lleva la magia contigo!</h3>
                        <p className="text-sm text-gray-600">
                            Instala la aplicación para leer tus cuentos favoritos sin conexión.
                        </p>
                        <p className="text-xs text-purple-500 mt-1 font-semibold">Busca "Añadir a pantalla de inicio" en el menú de tu navegador.</p>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-purple-400">
                Desarrollado por José Alejandro Barrios &lt;/JAB&gt;
            </div>
        </div>
    </div>
);

const StoryCard: React.FC<{ story: Story; onSelect: (story: Story) => void; onDelete?: (id: string) => void; playSound: (sound: SoundType) => void; }> = ({ story, onSelect, onDelete, playSound }) => (
  <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 h-full">
    {onDelete && story.id && (
        <button 
          onClick={() => { 
            playSound('ui-click'); 
            if(onDelete) onDelete(story.id!); 
          }} 
          className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors" 
          aria-label="Borrar cuento">
            <TrashIcon />
        </button>
    )}
    <div className="text-6xl mb-4">{story.emoji}</div>
    <h3 className="text-2xl font-bold text-gray-800 mb-2">{story.title}</h3>
    {story.description && <p className="text-gray-600 mb-4 flex-grow">{story.description}</p>}
    {story.tags && (
        <div className="flex flex-wrap justify-center gap-2 mb-4">
            {story.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-purple-100 text-purple-800 text-sm font-semibold rounded-full">{tag}</span>
            ))}
        </div>
    )}
    <button
      onClick={() => { playSound('book-open'); onSelect(story); }}
      className="mt-auto px-6 py-2 bg-pink-500 text-white font-bold rounded-full shadow-md hover:bg-pink-600 transition-colors"
    >
      Leer Cuento
    </button>
  </div>
);

const CreatorCard: React.FC<{ onClick: () => void; playSound: (sound: SoundType) => void; }> = ({ onClick, playSound }) => (
    <div onClick={() => { playSound('magic-sparkle'); onClick(); }} className="cursor-pointer bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl shadow-lg p-6 flex flex-col items-center justify-center text-center text-white transition-transform transform hover:scale-105 h-full">
        <SparklesIcon />
        <h3 className="text-2xl font-bold mt-2">Crea Tu Propio Cuento</h3>
        <p className="mt-1">¡Convierte tu idea en una historia mágica!</p>
    </div>
);

const StorySelection: React.FC<{ 
    onSelectStory: (story: Story) => void; 
    onStartCreator: () => void;
    savedStories: Story[];
    onDeleteStory: (id: string) => void;
    playSound: (sound: SoundType) => void;
}> = ({ onSelectStory, onStartCreator, savedStories, onDeleteStory, playSound }) => {
  const groupedStories = useMemo(() => {
    return STORIES.reduce((acc, story) => {
      const ageRange = story.ageRange || 'General';
      if (!acc[ageRange]) {
        acc[ageRange] = [];
      }
      acc[ageRange].push(story);
      return acc;
    }, {} as Record<string, Story[]>);
  }, []);

  const ageGroups = Object.keys(groupedStories).sort();

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
        {savedStories.length > 0 && (
            <div className="mb-12">
                 <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">Tus Cuentos Creados</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {savedStories.map((story) => (
                        <StoryCard key={story.id} story={story} onSelect={onSelectStory} onDelete={onDeleteStory} playSound={playSound} />
                    ))}
                 </div>
            </div>
        )}
      {ageGroups.map((ageRange) => (
        <div key={ageRange} className="mb-12">
          <h2 className="text-3xl font-bold text-purple-800 mb-6 text-center">
            {ageRange === '2-4 años' ? 'Para los más peques (2-4 años)' : 'Para mentes curiosas (5-7 años)'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {groupedStories[ageRange].map((story) => (
              <StoryCard key={story.id} story={story} onSelect={onSelectStory} playSound={playSound} />
            ))}
             {ageRange === '5-7 años' && <CreatorCard onClick={onStartCreator} playSound={playSound} />}
          </div>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  const [mode, setMode] = useState<AppMode>('welcome');
  const [storyView, setStoryView] = useState<StoryView>('selection');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { savedStories, saveStory, deleteStory } = useStoryStorage();
  
  const musicRef = useRef<HTMLAudioElement>(null);
  const pageTurnSoundRef = useRef<HTMLAudioElement>(null);
  const magicSparkleSoundRef = useRef<HTMLAudioElement>(null);
  const bookOpenSoundRef = useRef<HTMLAudioElement>(null);
  const uiClickSoundRef = useRef<HTMLAudioElement>(null);


  const [isMuted, setIsMuted] = useState(false);
  
  const playSound = (sound: SoundType) => {
      if (isMuted) return;
      let audioRef: React.RefObject<HTMLAudioElement> | null = null;
      switch (sound) {
          case 'page-turn': audioRef = pageTurnSoundRef; break;
          case 'magic-sparkle': audioRef = magicSparkleSoundRef; break;
          case 'book-open': audioRef = bookOpenSoundRef; break;
          case 'ui-click': audioRef = uiClickSoundRef; break;
      }
      if (audioRef?.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play().catch(e => console.error(`Sound ${sound} failed`, e));
      }
  };

  const playMusic = () => {
      if(musicRef.current && !isMuted) {
          musicRef.current.play().catch(e => console.error("Audio play failed", e));
      }
  };

  const stopMusic = () => {
      if(musicRef.current) {
          musicRef.current.pause();
          musicRef.current.currentTime = 0;
      }
  };

  const toggleMute = () => {
      playSound('ui-click');
      const newMutedState = !isMuted;
      setIsMuted(newMutedState);
      if (musicRef.current) {
          musicRef.current.muted = newMutedState;
          if (newMutedState) {
            musicRef.current.pause();
          } else if (mode === 'story' && storyView === 'viewer') {
            musicRef.current.play();
          }
      }
  };
  
  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setStoryView('viewer');
    playMusic();
  }

  const handleGoHome = () => {
    setMode('welcome');
    setStoryView('selection');
    setSelectedStory(null);
    stopMusic();
  };
  
  const handleStoryCreated = (story: Story) => {
      setSelectedStory(story);
      setStoryView('viewer');
      playMusic();
  }

  const handleSaveStory = (storyToSave: Story) => {
    const saved = saveStory(storyToSave);
    setSelectedStory(saved);
  };
  
  const handleBackToSelection = () => {
    setSelectedStory(null);
    setStoryView('selection');
    stopMusic();
  }

  const handleStartCreator = () => {
    setStoryView('creator');
  };

  const NavButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    label: string;
    children: React.ReactNode;
  }> = ({ isActive, onClick, label, children }) => (
    <button
      onClick={onClick}
      className={`flex flex-col sm:flex-row items-center justify-center gap-2 px-4 py-2 rounded-full font-bold text-lg transition-all duration-300 ${
        isActive
          ? 'bg-pink-500 text-white shadow-lg scale-105'
          : 'text-purple-700 hover:bg-white/80'
      }`}
      aria-label={label}
    >
      {children}
      <span className="text-sm sm:text-lg">{label}</span>
    </button>
  );

  const renderContent = () => {
    if (mode === 'welcome') {
      return <WelcomeScreen onStart={() => {
          playSound('book-open');
          setMode('story');
      }} />;
    }
    if (mode === 'chat') {
      return <ChatBot playSound={playSound} />;
    }
    if (mode === 'guide') {
      return <Guide />;
    }
    if (mode === 'story') {
      switch (storyView) {
        case 'viewer':
          return selectedStory && <StoryViewer story={selectedStory} onBack={handleBackToSelection} onSaveStory={handleSaveStory} playSound={playSound} />;
        case 'creator':
          return <StoryCreator onStoryCreated={handleStoryCreated} onBack={handleBackToSelection} playSound={playSound} />;
        case 'selection':
        default:
          return <StorySelection onSelectStory={handleSelectStory} onStartCreator={handleStartCreator} savedStories={savedStories} onDeleteStory={deleteStory} playSound={playSound} />;
      }
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col bg-purple-50 text-gray-800">
      {/* Audio players */}
      <audio ref={musicRef} src="https://cdn.pixabay.com/audio/2022/11/22/audio_8797f3c448.mp3" loop />
      <audio ref={pageTurnSoundRef} src="https://cdn.pixabay.com/audio/2022/10/24/audio_359332b85e.mp3" />
      <audio ref={magicSparkleSoundRef} src="https://cdn.pixabay.com/audio/2022/11/17/audio_835528f1b3.mp3" />
      <audio ref={bookOpenSoundRef} src="https://cdn.pixabay.com/audio/2022/01/24/audio_0345163365.mp3" />
      <audio ref={uiClickSoundRef} src="https://cdn.pixabay.com/audio/2022/03/15/audio_2433fe151c.mp3" />


      {mode !== 'welcome' && (
        <header className="flex justify-between items-center py-4 px-6">
            <div>{/* Spacer */}</div>
            <h1 className="text-4xl sm:text-5xl font-black text-purple-700 drop-shadow-md cursor-pointer text-center" onClick={handleGoHome}>
                Chispas de Cuentos ✨
            </h1>
            <button onClick={toggleMute} className="p-2 text-purple-600 rounded-full hover:bg-white/80 transition-colors" aria-label="Silenciar música">
                {isMuted ? <SpeakerXMarkIcon /> : <SpeakerWaveIcon />}
            </button>
        </header>
      )}

      <main className="flex-grow flex items-center justify-center w-full">
        {renderContent()}
      </main>

      {mode !== 'welcome' && (
        <footer className="sticky bottom-0 left-0 right-0 p-4 bg-purple-100/80 backdrop-blur-sm border-t-2 border-white">
            <nav className="flex justify-center items-center gap-3 sm:gap-6">
            <NavButton
                isActive={mode === 'story'}
                onClick={() => {
                    playSound('ui-click');
                    setMode('story');
                    setStoryView('selection');
                    stopMusic();
                }}
                label="Cuentos"
            >
                <BookOpenIcon />
            </NavButton>
            <NavButton
                isActive={mode === 'chat'}
                onClick={() => { playSound('ui-click'); setMode('chat'); stopMusic(); }}
                label="Chispa"
            >
                <ChatBubbleLeftRightIcon />
            </NavButton>
            <NavButton
                isActive={mode === 'guide'}
                onClick={() => { playSound('ui-click'); setMode('guide'); stopMusic(); }}
                label="Guía"
            >
                <InformationCircleIcon />
            </NavButton>
            </nav>
             <div className="text-center text-xs text-purple-400 mt-4">
                Desarrollado por José Alejandro Barrios &lt;/JAB&gt;
            </div>
        </footer>
      )}
    </div>
  );
}