'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useGoals } from '@/hooks/useGoals';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';
import { useChallenges } from '@/hooks/useChallenges';
import { chatWithAI, GroqModel } from '@/app/actions/ai';
import { Send, Sparkles, User, Bot, Loader2, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VisionTab from '@/components/ai/VisionTab';

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
    const { challengesWithParticipation, updateParticipation } = useChallenges();

    // Chat State
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);
    // AI Provider State
    const [provider, setProvider] = useState<'gemini' | 'groq'>('gemini');
    const [groqModel, setGroqModel] = useState<GroqModel>('llama-3.3-70b-versatile');
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'vision'>('chat');

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
            // Load Active Tab
            const savedTab = window.localStorage.getItem('app-ai-active-tab');
            if (savedTab === 'chat' || savedTab === 'vision') {
                setActiveTab(savedTab);
            }
        }
    }, []);

    const handleTabChange = (tab: 'chat' | 'vision') => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('app-ai-active-tab', tab);
        }
    };

    // Load Provider and Model Preferences
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedProvider = window.localStorage.getItem('app-ai-provider');
            if (savedProvider === 'gemini' || savedProvider === 'groq') {
                setProvider(savedProvider);
            }
            const savedModel = window.localStorage.getItem('app-ai-groq-model');
            if (savedModel === 'llama-3.3-70b-versatile' || savedModel === 'moonshotai/kimi-k2-instruct-0905') {
                setGroqModel(savedModel);
            }
        }
    }, []);

    const handleProviderChange = (newProvider: 'gemini' | 'groq') => {
        setProvider(newProvider);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('app-ai-provider', newProvider);
        }
    };

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
            // ... (rest of search/replace handled correctly)

            let apiHistory = newHistory.slice(0, -1).map(m => ({
                role: m.role,
                parts: m.text
            }));

            // Filter out leading model messages until we hit a user message or empty
            while (apiHistory.length > 0 && apiHistory[0].role === 'model') {
                apiHistory.shift();
            }

            // Pass provider and groq model to server action
            const result = await chatWithAI(userMsg, apiHistory, userContext, provider, groqModel);

            if (result.error) {
                // If specific setup error
                if (result.setupNeeded) {
                    setMessages(prev => [...prev, { role: 'model', text: result.text || result.error || "Setup error." }]);
                } else {
                    setError(result.text || "Something went wrong.");
                }
            } else if (result.text) {
                setMessages(prev => [...prev, { role: 'model', text: result.text }]);

                // Record progress for AI recommendation challenge if user has active participation
                const aiChallenge = challengesWithParticipation.find(
                    c => c.verification_logic === 'ai_message_sent' &&
                        c.userParticipation?.status === 'active'
                );
                if (aiChallenge && user?.id) {
                    // Save progress data for later verification (like "Calculate Time to Goal")
                    updateParticipation(aiChallenge.id, 'active', { message_sent: true });
                }
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
        <div className="flex flex-col h-full bg-gray-50 pt-safe pb-20 overflow-hidden">
            {/* Header Switcher */}
            <header className="bg-white border-b border-gray-100 z-10 shrink-0">
                <div className="flex justify-center items-center h-14">
                    <div className="bg-gray-100 p-1 rounded-xl flex space-x-1 w-64 relative">
                        <button
                            onClick={() => handleTabChange('chat')}
                            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'chat' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {t('ai.assistant') || 'Assistant'}
                        </button>
                        <button
                            onClick={() => handleTabChange('vision')}
                            className={`flex-1 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${activeTab === 'vision' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-900'
                                }`}
                        >
                            {t('ai.vision') || 'Vision'}
                        </button>
                    </div>
                </div>
            </header>

            {/* AI Assistant Tab Content */}
            {activeTab === 'chat' && (
                <div className="flex flex-col h-full overflow-hidden">
                    {/* Model Switcher Sub-header */}
                    <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 px-4 py-2 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Sparkles size={14} className="text-blue-500" />
                            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">AI Model</span>
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="flex bg-gray-100 rounded-lg p-1 text-[10px] font-bold uppercase overflow-hidden">
                                <button
                                    onClick={() => handleProviderChange('gemini')}
                                    className={`px-3 py-1 rounded-md transition-all ${provider === 'gemini'
                                        ? 'bg-white text-blue-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Gemini
                                </button>
                                <button
                                    onClick={() => handleProviderChange('groq')}
                                    className={`px-3 py-1 rounded-md transition-all ${provider === 'groq'
                                        ? 'bg-white text-orange-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                        }`}
                                >
                                    Groq
                                </button>
                            </div>

                            {provider === 'groq' && (
                                <div className="relative">
                                    <button
                                        onClick={() => setShowModelSelector(!showModelSelector)}
                                        className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[10px] hover:bg-gray-200 transition-colors"
                                    >
                                        <span>
                                            {groqModel === 'llama-3.3-70b-versatile' ? 'Llama 3.3' :
                                                groqModel === 'moonshotai/kimi-k2-instruct-0905' ? 'Moonshot Kimi' : groqModel}
                                        </span>
                                        <ChevronDown size={10} />
                                    </button>

                                    {showModelSelector && (
                                        <div className="absolute top-full mt-1 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-20 min-w-[140px]">
                                            <button
                                                onClick={() => {
                                                    setGroqModel('llama-3.3-70b-versatile');
                                                    setShowModelSelector(false);
                                                    if (typeof window !== 'undefined') {
                                                        window.localStorage.setItem('app-ai-groq-model', 'llama-3.3-70b-versatile');
                                                    }
                                                }}
                                                className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors ${groqModel === 'llama-3.3-70b-versatile' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                    }`}
                                            >
                                                Llama 3.3 70B
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setGroqModel('moonshotai/kimi-k2-instruct-0905');
                                                    setShowModelSelector(false);
                                                    if (typeof window !== 'undefined') {
                                                        window.localStorage.setItem('app-ai-groq-model', 'moonshotai/kimi-k2-instruct-0905');
                                                    }
                                                }}
                                                className={`w-full text-left px-3 py-2 text-[10px] font-bold uppercase hover:bg-gray-50 transition-colors ${groqModel === 'moonshotai/kimi-k2-instruct-0905' ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                                    }`}
                                            >
                                                Moonshot Kimi K2
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

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
                    <div className="bg-white border-t border-gray-100 p-3 pb-safe-offset">
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
            )}

            {/* Vision Tab Content */}
            {activeTab === 'vision' && (
                <div className="flex-1 overflow-y-auto">
                    <VisionTab />
                </div>
            )}
        </div>
    );
}
