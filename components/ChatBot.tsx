import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { ChatMessage } from '../types';
import { CONFIG } from '../services/config';

const BotMessage: React.FC<{text: string}> = ({text}) => (
    <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-xl shadow-md">🤖</div>
        <div className="bg-white text-gray-800 p-3 rounded-lg rounded-tl-none shadow-md max-w-xs md:max-w-md">
            {text}
        </div>
    </div>
)

const UserMessage: React.FC<{text: string}> = ({text}) => (
    <div className="flex items-start gap-3 justify-end">
        <div className="bg-purple-500 text-white p-3 rounded-lg rounded-tr-none shadow-md max-w-xs md:max-w-md">
            {text}
        </div>
        <div className="w-10 h-10 rounded-full bg-purple-300 flex items-center justify-center text-xl shadow-md">😊</div>
    </div>
)

const TypingIndicator: React.FC = () => (
    <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-pink-400 flex items-center justify-center text-xl shadow-md">🤖</div>
        <div className="bg-white text-gray-800 p-3 rounded-lg rounded-tl-none shadow-md">
            <div className="flex items-center gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-0"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></span>
            </div>
        </div>
    </div>
)

interface ChatBotProps {
    playSound: (sound: 'ui-click') => void;
}

export const ChatBot: React.FC<ChatBotProps> = ({ playSound }) => {
    const [messages, setMessages] = useState<ChatMessage[]>([
        { sender: 'bot', text: "¡Hola! Soy Chispa, tu amigo de los cuentos. ¡Pregúntame lo que quieras sobre nuestras historias o simplemente saluda!" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const chatRef = useRef<any>(null);
    const currentKeyIndexRef = useRef<number>(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const initChat = (key: string, historyData: ChatMessage[] = []) => {
        try {
            const ai = new GoogleGenerativeAI(key);
            const model = ai.getGenerativeModel({
                model: CONFIG.MODEL_NAME,
                systemInstruction: "Eres un chatbot amigable, entusiasta y servicial llamado Chispa, diseñado para hablar con niños. Mantén tus respuestas cortas, simples y alegres. ¡Usa emojis a menudo! Eres parte de la aplicación Chispas de Cuentos.",
            });

            const geminiHistory: any[] = [];
            // Gemini requiere User -> Model -> User. El primer mensaje del bot se ignora en el historial.
            historyData.forEach((msg) => {
                const role = msg.sender === 'user' ? 'user' : 'model';
                if (geminiHistory.length === 0 && role === 'model') return;
                
                if (geminiHistory.length > 0 && geminiHistory[geminiHistory.length - 1].role === role) {
                    geminiHistory[geminiHistory.length - 1].parts[0].text += " " + msg.text;
                } else {
                    geminiHistory.push({ role, parts: [{ text: msg.text }] });
                }
            });

            chatRef.current = model.startChat({ history: geminiHistory });
            return true;
        } catch (err) {
            return false;
        }
    };

    const ensureChatIsReady = async () => {
        if (chatRef.current) return true;
        for (let i = 0; i < CONFIG.API_KEYS.length; i++) {
            const keyIndex = (currentKeyIndexRef.current + i) % CONFIG.API_KEYS.length;
            const success = initChat(CONFIG.API_KEYS[keyIndex], messages);
            if (success) {
                currentKeyIndexRef.current = keyIndex;
                return true;
            }
        }
        return false;
    };

    useEffect(() => {
        const startup = async () => {
            const ready = await ensureChatIsReady();
            if (!ready) {
                console.warn("Chispa: No se pudo inicializar con ninguna llave.");
                setMessages(prev => [...prev, { 
                    sender: 'bot', 
                    text: "🗝️ ¡Hola! El baúl de las llaves mágicas está cerrado. ✨ ¡Pídele a un adulto que nos ayude a encontrar la llave para poder charlar!" 
                }]);
            }
        };
        
        startup();
    }, []); // Solo inicializar una vez al montar

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    const handleSend = async () => {
        if (!input.trim()) return;
        if (CONFIG.API_KEYS.length === 0) return;
        playSound('ui-click');
        const userMessage: ChatMessage = { sender: 'user', text: input };
        const originalInput = input;
        
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setError(null);

        let success = false;
        let attempts = 0;

        // Intentar con las llaves disponibles
        while (attempts < CONFIG.API_KEYS.length && !success) {
            try {
                await ensureChatIsReady();

                const result = await chatRef.current.sendMessage(originalInput);
                const botMessage: ChatMessage = { sender: 'bot', text: result.response.text() };
                setMessages(prev => [...prev, botMessage]);
                success = true;
            } catch (err: any) {
                console.warn(`Error en intento ${attempts + 1} con la llave ${currentKeyIndexRef.current}:`, err);
                
                // Al igual que en el creador de cuentos, si falla probamos la siguiente llave
                // sin importar el tipo de error para garantizar que Chispa responda.
                currentKeyIndexRef.current = (currentKeyIndexRef.current + 1) % CONFIG.API_KEYS.length;
                chatRef.current = null; // Forzar reinicialización con la nueva llave
                attempts++;
            }
        }

        if (!success) {
            // En lugar de un mensaje en el chat, activamos el estado de error amigable
            setError("¡Vaya! La varita mágica se ha quedado sin estrellas. ✨ ¡Pide tu deseo otra vez!");
        }
        
        setIsTyping(false);
    };

    return (
        <div className="flex flex-col w-full h-full max-w-2xl mx-auto bg-purple-100 rounded-2xl shadow-lg border-2 border-white overflow-hidden">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    msg.sender === 'bot' ? <BotMessage key={index} text={msg.text} /> : <UserMessage key={index} text={msg.text} />
                ))}
                {isTyping && <TypingIndicator />}
                {error && (
                    <div className="flex justify-center p-2 animate-bounce">
                        <div className="bg-white/90 backdrop-blur-sm border-2 border-pink-200 text-purple-700 px-6 py-2 rounded-2xl text-sm font-bold shadow-sm">
                            ✨ {error}
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 bg-white/50 border-t border-purple-200">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && !isTyping && handleSend()}
                        placeholder="Pregúntale algo a Chispa..."
                        className="w-full p-3 border-2 border-purple-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-400"
                        disabled={isTyping}
                    />
                    <button
                        onClick={handleSend}
                        disabled={isTyping || !input.trim()}
                        className="p-3 bg-pink-500 text-white rounded-full disabled:bg-pink-300 transition-all transform hover:scale-110"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-6 h-6">
                           <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.925A1.5 1.5 0 005.135 9.25h6.115a.75.75 0 010 1.5H5.135a1.5 1.5 0 00-1.442 1.086L2.279 16.76a.75.75 0 00.95.826l16-5.333a.75.75 0 000-1.418l-16-5.333z" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};