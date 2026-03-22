import { useState, useCallback, useEffect } from 'react';

export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        // Cleanup on unmount
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const playAudio = useCallback((text: string, voiceSelection?: string) => {
        if (!text) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'es-ES'; // Spanish
        utterance.rate = 0.9; // Slightly slower for kids
        utterance.pitch = 1.1; // Slightly higher/friendly pitch
        
        // Handle voice selection based on the ID passed from StoryViewer
        const voices = window.speechSynthesis.getVoices();
        const esVoices = voices.filter(v => v.lang.startsWith('es'));
        
        if (esVoices.length > 0) {
            // Map the selected voice id ('Kore', 'Puck', etc.) to available spanish voices
            let voiceIndex = 0;
            switch(voiceSelection) {
                case 'Kore': voiceIndex = 0; break;
                case 'Puck': voiceIndex = 1; break;
                case 'Zephyr': voiceIndex = 2; break;
                case 'Charon': voiceIndex = 3; break;
            }
            // Use modulo in case there are fewer voices than options
            utterance.voice = esVoices[voiceIndex % esVoices.length];
        }

        utterance.onstart = () => setIsPlaying(true);
        utterance.onend = () => setIsPlaying(false);
        utterance.onerror = (e) => {
            console.error("Speech synthesis error", e);
            setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
    }, []);
    
    const stopAudio = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
    }, []);

    return { playAudio, stopAudio, isPlaying };
};
