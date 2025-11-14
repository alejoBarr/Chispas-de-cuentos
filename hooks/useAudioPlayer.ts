
import { useState, useRef, useCallback, useEffect } from 'react';

// Helper function to decode base64 string to Uint8Array
function decode(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Helper function to decode raw PCM audio data into an AudioBuffer
async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export const useAudioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const audioContextRef = useRef<AudioContext | null>(null);
    const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);

    useEffect(() => {
        // Initialize AudioContext. It's best to create it once.
        // It might require a user interaction to start in some browsers.
        if (!audioContextRef.current) {
            try {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            } catch (e) {
                console.error("Web Audio API is not supported in this browser", e);
            }
        }
        
        // Cleanup on unmount
        return () => {
            if (sourceNodeRef.current) {
                sourceNodeRef.current.stop();
            }
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    const playAudio = useCallback(async (base64Audio: string) => {
        if (!audioContextRef.current || !base64Audio) return;

        // Resume context if it's suspended (e.g., due to browser autoplay policies)
        if (audioContextRef.current.state === 'suspended') {
            await audioContextRef.current.resume();
        }

        // Stop any currently playing audio
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
        }

        setIsPlaying(true);
        
        try {
            const audioBytes = decode(base64Audio);
            const audioBuffer = await decodeAudioData(audioBytes, audioContextRef.current, 24000, 1);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                setIsPlaying(false);
                sourceNodeRef.current = null;
            };

            source.start();
            sourceNodeRef.current = source;
        } catch(error) {
            console.error("Failed to play audio:", error);
            setIsPlaying(false);
        }
    }, []);
    
    const stopAudio = useCallback(() => {
        if (sourceNodeRef.current) {
            sourceNodeRef.current.stop();
            setIsPlaying(false);
            sourceNodeRef.current = null;
        }
    }, []);

    return { playAudio, stopAudio, isPlaying };
};
