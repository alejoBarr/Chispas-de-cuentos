
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI, Chat } from "@google/genai";
import { ChatMessage } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

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

    const chatRef = useRef<Chat | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });
        chatRef.current = ai.chats.create({
            model: 'gemini-2.5-flash',
            config: {
                systemInstruction: "Eres un chatbot amigable, entusiasta y servicial llamado Chispa, diseñado para hablar con niños. Mantén tus respuestas cortas, simples y alegres. ¡Usa emojis a menudo! Eres parte de la aplicación Chispas de Cuentos.",
            },
        });
    }, []);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isTyping]);
    
    const handleSend = async () => {
        if (!input.trim() || !chatRef.current) return;

        playSound('ui-click');
        const userMessage: ChatMessage = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);
        setError(null);

        try {
            const response = await chatRef.current.sendMessage({ message: input });
            const botMessage: ChatMessage = { sender: 'bot', text: response.text };
            setMessages(prev => [...prev, botMessage]);
        } catch (err) {
            console.error("Chat error:", err);
            const errorMessageText = "¡Oh, no! Mi gorro para pensar tiene un pequeño fallo. ¿Podrías preguntar de nuevo? 😵";
            setError(errorMessageText);
            const errorMessage: ChatMessage = { sender: 'bot', text: errorMessageText };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="flex flex-col w-full h-full max-w-2xl mx-auto bg-purple-100 rounded-2xl shadow-lg border-2 border-white overflow-hidden">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    msg.sender === 'bot' ? <BotMessage key={index} text={msg.text} /> : <UserMessage key={index} text={msg.text} />
                ))}
                {isTyping && <TypingIndicator />}
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