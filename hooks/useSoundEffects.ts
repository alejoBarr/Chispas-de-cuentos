import { useCallback, useRef } from 'react';

/**
 * Custom hook that generates all UI sound effects using the Web Audio API.
 * No external files or CDN needed — works 100% offline and reliably.
 */
export const useSoundEffects = () => {
    const audioCtxRef = useRef<AudioContext | null>(null);

    const getCtx = useCallback((): AudioContext => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') {
            audioCtxRef.current = new AudioContext();
        }
        // Resume context if it was suspended (autoplay policy)
        if (audioCtxRef.current.state === 'suspended') {
            audioCtxRef.current.resume();
        }
        return audioCtxRef.current;
    }, []);


    /** Soft UI click — short tick */
    const playUiClick = useCallback(() => {
        const ctx = getCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
        gain.gain.setValueAtTime(0.18, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.1);
    }, [getCtx]);

    /** Page turn — soft whoosh */
    const playPageTurn = useCallback(() => {
        const ctx = getCtx();
        const bufferSize = ctx.sampleRate * 0.15;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const source = ctx.createBufferSource();
        source.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.value = 1200;
        filter.Q.value = 0.8;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.25, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
        source.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        source.start(ctx.currentTime);
    }, [getCtx]);

    /** Magic sparkle — ascending chime arpeggio */
    const playMagicSparkle = useCallback(() => {
        const ctx = getCtx();
        const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            const t = ctx.currentTime + i * 0.1;
            osc.frequency.setValueAtTime(freq, t);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.2, t + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
            osc.start(t);
            osc.stop(t + 0.4);
        });
    }, [getCtx]);

    /** Book open — low thud + whoosh */
    const playBookOpen = useCallback(() => {
        const ctx = getCtx();
        // Thud
        const osc = ctx.createOscillator();
        const gainThud = ctx.createGain();
        osc.connect(gainThud);
        gainThud.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(120, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.15);
        gainThud.gain.setValueAtTime(0.35, ctx.currentTime);
        gainThud.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
        // Whoosh (noise burst)
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 800;
        const gainNoise = ctx.createGain();
        gainNoise.gain.setValueAtTime(0.15, ctx.currentTime + 0.05);
        gainNoise.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        noise.connect(filter);
        filter.connect(gainNoise);
        gainNoise.connect(ctx.destination);
        noise.start(ctx.currentTime + 0.05);
    }, [getCtx]);

    const playSound = useCallback((sound: 'page-turn' | 'magic-sparkle' | 'book-open' | 'ui-click') => {
        try {
            switch (sound) {
                case 'ui-click': playUiClick(); break;
                case 'page-turn': playPageTurn(); break;
                case 'magic-sparkle': playMagicSparkle(); break;
                case 'book-open': playBookOpen(); break;
            }
        } catch (e) {
            console.warn('Sound failed:', e);
        }
    }, [playUiClick, playPageTurn, playMagicSparkle, playBookOpen]);

    return { playSound };
};
