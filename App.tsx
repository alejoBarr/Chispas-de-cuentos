import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { StoryViewer } from './components/StoryViewer';
import { ChatBot } from './components/ChatBot';
import { Guide } from './components/Guide';
import { StoryCreator } from './components/StoryCreator';
import { BookOpenIcon, ChatBubbleLeftRightIcon, InformationCircleIcon, SparklesIcon, TrashIcon, SpeakerWaveIcon, SpeakerXMarkIcon, BookStackIcon, ShareIcon } from './components/Icon';
import { Bookshelf } from './components/Bookshelf';
import { Story } from './types';
import { STORIES } from './constants';
import { useStoryStorage } from './hooks/useStoryStorage';
import { useSoundEffects } from './hooks/useSoundEffects';

type AppMode = 'welcome' | 'story' | 'chat' | 'library' | 'guide';
type StoryView = 'selection' | 'viewer' | 'creator';
type SoundType = 'page-turn' | 'magic-sparkle' | 'book-open' | 'ui-click';

const WelcomeScreen: React.FC<{onStart: () => void; playSound: (sound: SoundType) => void}> = ({ onStart, playSound }) => {
    const [installPrompt, setInstallPrompt] = useState<any>(null);

    useEffect(() => {
        const handler = (e: any) => {
            e.preventDefault(); // Evita que el navegador muestre su propio banner automáticamente
            setInstallPrompt(e); // Guardamos el evento para usarlo en nuestro botón
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    const handleInstall = () => {
        if (!installPrompt) return;
        playSound('ui-click');
        installPrompt.prompt();
        installPrompt.userChoice.then((choiceResult: any) => {
            setInstallPrompt(null); // Ocultamos el botón después de la acción
        });
    };

    const handleShareApp = async () => {
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
            alert('¡Copia el enlace de tu navegador para invitar a tus amigos!');
        }
    };

    return (
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
                    <div className="w-16 h-16 flex-shrink-0 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 shadow-inner">
                        <SparklesIcon className="w-10 h-10" />
                    </div>
                    <div className="text-left">
                        <h3 className="text-lg font-bold text-purple-800">¡Lleva la magia contigo!</h3>
                        <p className="text-sm text-gray-600">
                            Comparte o instala la app para disfrutar los cuentos.
                        </p>
                        <p className="text-xs text-purple-500 mt-1 font-semibold">Busca "Añadir a pantalla de inicio" en el menú de tu navegador 📱</p>
                        <div className="flex gap-2 mt-2">
                            {installPrompt && (
                                <button 
                                    onClick={handleInstall}
                                    className="flex items-center gap-1 text-xs bg-pink-500 text-white px-3 py-1 rounded-full font-bold hover:bg-pink-600 transition-colors shadow-sm"
                                >
                                    <SparklesIcon className="w-3 h-3" /> Instalar App
                                </button>
                            )}
                            <button 
                                onClick={handleShareApp}
                                className="flex items-center gap-1 text-xs bg-purple-200 text-purple-800 px-2 py-1 rounded-full font-bold hover:bg-purple-300 transition-colors"
                            >
                                <ShareIcon className="w-3 h-3" /> Compartir App
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="text-center text-sm text-purple-400">
                Desarrollado por José Alejandro Barrios &lt;/JAB&gt;
            </div>
        </div>
    </div>
    );
};

const StoryCard: React.FC<{ story: Story; onSelect: (story: Story) => void; onDelete?: (id: string) => void; playSound: (sound: SoundType) => void; }> = ({ story, onSelect, onDelete, playSound }) => {
  const [confirmDelete, setConfirmDelete] = React.useState(false);

  return (
    <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transition-transform transform hover:scale-105 h-full">
      {onDelete && story.id && !confirmDelete && (
          <button
            onClick={() => { playSound('ui-click'); setConfirmDelete(true); }}
            className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
            aria-label="Borrar cuento"
          >
            <TrashIcon />
          </button>
      )}

      {confirmDelete ? (
        <div className="flex flex-col items-center justify-center gap-3 py-4 w-full">
          <p className="text-lg font-bold text-gray-700">¿Borrar este cuento?</p>
          <div className="flex gap-3">
            <button
              onClick={() => { playSound('ui-click'); onDelete && onDelete(story.id!); }}
              className="px-5 py-2 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 transition-colors"
            >
              Sí, borrar
            </button>
            <button
              onClick={() => { playSound('ui-click'); setConfirmDelete(false); }}
              className="px-5 py-2 bg-gray-200 text-gray-700 font-bold rounded-full hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

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

  const [isMuted, setIsMuted] = useState(false);
  const { playSound: playSoundEffect, setMuted } = useSoundEffects();

  // --- Ambient music via Web Audio API ---
  const musicCtxRef = useRef<AudioContext | null>(null);
  const musicNodesRef = useRef<{ osc: OscillatorNode; gain: GainNode } | null>(null);

  const playMusic = useCallback(() => {
    if (isMuted) return;
    try {
      if (!musicCtxRef.current || musicCtxRef.current.state === 'closed') {
        musicCtxRef.current = new AudioContext();
      }
      const ctx = musicCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      if (musicNodesRef.current) return; // already playing

      const notes = [261.6, 293.7, 329.6, 349.2, 392, 440, 493.9]; // C D E F G A B
      let noteIdx = 0;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.connect(ctx.destination);

      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(notes[noteIdx], ctx.currentTime);
      osc.connect(gain);
      osc.start();

      const interval = setInterval(() => {
        if (!musicNodesRef.current) { clearInterval(interval); return; }
        noteIdx = (noteIdx + 1) % notes.length;
        musicNodesRef.current.osc.frequency.setTargetAtTime(notes[noteIdx], ctx.currentTime, 0.5);
      }, 1800);

      musicNodesRef.current = { osc, gain };
      (musicNodesRef.current as any)._interval = interval;
    } catch (e) {
      console.warn('Music failed', e);
    }
  }, [isMuted]);

  const stopMusic = useCallback(() => {
    if (musicNodesRef.current) {
      try {
        clearInterval((musicNodesRef.current as any)._interval);
        musicNodesRef.current.gain.gain.setTargetAtTime(0, musicCtxRef.current!.currentTime, 0.3);
        setTimeout(() => {
          try { musicNodesRef.current?.osc.stop(); } catch (_) {}
          musicNodesRef.current = null;
        }, 500);
      } catch (e) { musicNodesRef.current = null; }
    }
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    playSoundEffect(sound);
  }, [playSoundEffect]);

  const toggleMute = () => {
    playSound('ui-click');
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    setMuted(newMuted);
    if (newMuted) {
      stopMusic();
    } else if (mode === 'story' && storyView === 'viewer') {
      playMusic();
    }
  };

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setStoryView('viewer');
    playMusic();
  };

  const handleGoHome = () => {
    setMode('welcome');
    setStoryView('selection');
    setSelectedStory(null);
    stopMusic();
  };

  const handleStoryCreated = (story: Story) => {
    const saved = saveStory(story);
    setSelectedStory(saved);
    setStoryView('viewer');
    playMusic();
  };

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
      }} playSound={playSound} />;
    }
    if (mode === 'chat') {
      return <ChatBot playSound={playSound} />;
    }
    if (mode === 'guide') {
      return <Guide />;
    }
    if (mode === 'library') {
      return <Bookshelf playSound={playSound} />;
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
                isActive={mode === 'library'}
                onClick={() => { playSound('ui-click'); setMode('library'); stopMusic(); }}
                label="Lecturas"
            >
                <BookStackIcon />
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