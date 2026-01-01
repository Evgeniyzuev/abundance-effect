'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useGoals } from '@/hooks/useGoals';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';
import { chatWithAI } from '@/app/actions/ai';
import { Send, Sparkles, User, Bot, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
    role: 'user' | 'model';
    text: string;
};

export default function AiPage() {
    const { t, language } = useLanguage();
    const { user } = useUser();

    // Context Data Hooks
    const { userWishes, loadFromCache, fetchWishes } = useGoals();
    const { coreBalance, walletBalance } = useWalletBalancesNoCache(user?.id || null);

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Load Chat History & Hydrate
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const saved = window.localStorage.getItem('app-ai-chat-history');
            if (saved) {
                try {
                    setMessages(JSON.parse(saved));
                } catch (e) {
                    console.error("Failed to parse chat history", e);
                }
            }
        }
    }, []);

    // Save Chat History
    useEffect(() => {
        if (isClient && messages.length > 0) {
            window.localStorage.setItem('app-ai-chat-history', JSON.stringify(messages));
        }
    }, [messages, isClient]);

    // Ensure Goals are Loaded
    useEffect(() => {
        if (user) {
            loadFromCache();
            fetchWishes();
        }
    }, [user, loadFromCache, fetchWishes]);

    // Initial Greeting
    useEffect(() => {
        if (isClient && messages.length === 0) {
            setMessages([
                {
                    role: 'model',
                    text: t('ai.greeting') || "Hello! I am your Abundance Coordinator. I see your goals and financial status. How can I help you grow today?"
                }
            ]);
        }
    }, [t, messages.length, isClient]);

    // Auto-scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isLoading]);

    const handleSendMessage = async () => {
        if (!inputValue.trim() || isLoading) return;

        const userMsg = inputValue.trim();
        setInputValue('');
        setError(null);

        // Add user message
        const newHistory = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newHistory);
        setIsLoading(true);

        // Prepare Context
        const userContext = {
            userId: user?.id,
            language: language,
            coreBalance,
            walletBalance,
            dailyIncome: coreBalance * 0.000633, // Approx
            level: user?.level || 1,
            wishes: userWishes.map(w => ({
                title: w.title,
                estimated_cost: w.estimated_cost,
                difficulty_level: w.difficulty_level
            }))
        };

        try {
            // Convert history for API (exclude the very last user message which is sent as 'message')
            // Additionally, Google Gemini requires history to start with 'user'.
            // If the first message is the 'model' greeting, we must exclude it.

            let apiHistory = newHistory.slice(0, -1).map(m => ({
                role: m.role,
                parts: m.text
            }));

            // Filter out leading model messages until we hit a user message or empty
            while (apiHistory.length > 0 && apiHistory[0].role === 'model') {
                apiHistory.shift();
            }

            const result = await chatWithAI(userMsg, apiHistory, userContext);

            if (result.error) {
                // If specific setup error
                if (result.setupNeeded) {
                    setMessages(prev => [...prev, { role: 'model', text: result.text || result.error || "Setup error." }]);
                } else {
                    setError(result.text || "Something went wrong.");
                }
            } else if (result.text) {
                setMessages(prev => [...prev, { role: 'model', text: result.text }]);
            }

        } catch (err) {
            console.error(err);
            setError("Failed to send message.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    return (
        <div className="flex flex-col h-full bg-gray-50 pt-safe pb-20">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-10 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                        <Sparkles size={18} />
                    </div>
                    <h1 className="font-bold text-lg text-gray-900">Abundance AI</h1>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end gap-2`}>
                            {/* Avatar */}
                            <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] 
                                ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white'}`}>
                                {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                            </div>

                            {/* Bubble */}
                            <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-sm
                                ${msg.role === 'user'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'
                                }`}>
                                {msg.text}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {isLoading && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                        <div className="flex flex-row items-end gap-2">
                            <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center">
                                <Bot size={14} />
                            </div>
                            <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-none border border-gray-100 shadow-sm flex space-x-1">
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </motion.div>
                )}

                {error && (
                    <div className="text-center text-xs text-red-500 my-2">
                        {error}
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white border-t border-gray-200 p-3 pb-safe-offset">
                <div className="relative flex items-center max-w-4xl mx-auto">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={t('ai.input_placeholder') || "Ask for advice..."}
                        className="w-full bg-gray-100 text-gray-900 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSendMessage}
                        disabled={!inputValue.trim() || isLoading}
                        className="absolute right-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors"
                    >
                        {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
