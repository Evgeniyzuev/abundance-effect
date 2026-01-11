'use client';

import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { useUser } from '@/context/UserContext';
import { useGoals } from '@/hooks/useGoals';
import { useWalletBalancesNoCache } from '@/hooks/useWalletBalancesNoCache';
import { useChallenges } from '@/hooks/useChallenges';
import { chatWithAI, GroqModel } from '@/app/actions/ai';
import { Send, Sparkles, User, Bot, Loader2, ChevronDown, Plus, History, Trash2, X, MessageSquare, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import VisionTab from '@/components/ai/VisionTab';

type Message = {
    role: 'user' | 'model';
    text: string;
};

type ChatSession = {
    id: string;
    title: string;
    messages: Message[];
    lastTimestamp: number;
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
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isClient, setIsClient] = useState(false);

    // AI Provider State
    const [provider, setProvider] = useState<'gemini' | 'groq'>('gemini');
    const [groqModel, setGroqModel] = useState<GroqModel>('llama-3.3-70b-versatile');
    const [showModelSelector, setShowModelSelector] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeTab, setActiveTab] = useState<'chat' | 'vision'>('chat');

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const suggestions = [
        "Как мне начать зарабатывать с Abundance Effect?",
        "Что такое Баланс Ядра и как он растет?",
        "Как ИИ поможет мне исполнить мои желания?",
        "В чем преимущество Экономики Участия?",
        "Как уровни влияют на мои возможности?",
        "Какие челленджи мне стоит пройти первыми?"
    ];

    // Initial Greeting Template
    const getGreeting = () => ({
        role: 'model' as const,
        text: t('ai.greeting') || "Hello! I am your Abundance Coordinator. How can I help you grow today?"
    });

    // Load Sessions & Active State
    useEffect(() => {
        setIsClient(true);
        if (typeof window !== 'undefined') {
            const savedSessions = window.localStorage.getItem('app-ai-sessions');
            const savedActiveId = window.localStorage.getItem('app-ai-current-session-id');
            const savedTab = window.localStorage.getItem('app-ai-active-tab');

            if (savedTab === 'chat' || savedTab === 'vision') {
                setActiveTab(savedTab);
            }

            if (savedSessions) {
                try {
                    const parsedSessions: ChatSession[] = JSON.parse(savedSessions);
                    setSessions(parsedSessions);

                    if (savedActiveId) {
                        const active = parsedSessions.find(s => s.id === savedActiveId);
                        if (active) {
                            setCurrentSessionId(savedActiveId);
                            setMessages(active.messages);
                        } else {
                            handleNewChat(parsedSessions);
                        }
                    } else {
                        handleNewChat(parsedSessions);
                    }
                } catch (e) {
                    console.error("Failed to parse sessions", e);
                    handleNewChat([]);
                }
            } else {
                handleNewChat([]);
            }

            // Load Provider Preferences
            const savedProvider = window.localStorage.getItem('app-ai-provider');
            if (savedProvider === 'gemini' || savedProvider === 'groq') {
                setProvider(savedProvider);
            }
            const savedModel = window.localStorage.getItem('app-ai-groq-model');
            if (savedModel === 'llama-3.3-70b-versatile' || savedModel === 'moonshotai/kimi-k2-instruct-0905') {
                setGroqModel(savedModel);
            }
        }
    }, [t]);

    const handleTabChange = (tab: 'chat' | 'vision') => {
        setActiveTab(tab);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('app-ai-active-tab', tab);
        }
    };

    const handleNewChat = (existingSessions: ChatSession[] = sessions) => {
        const newId = Date.now().toString();
        const newSession: ChatSession = {
            id: newId,
            title: t('ai.new_chat_title') || 'New Conversation',
            messages: [getGreeting()],
            lastTimestamp: Date.now()
        };

        const updated = [newSession, ...existingSessions];
        setSessions(updated);
        setCurrentSessionId(newId);
        setMessages(newSession.messages);
        setShowHistory(false);
        saveSessions(updated, newId);
    };

    const saveSessions = (updatedSessions: ChatSession[], activeId: string | null) => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('app-ai-sessions', JSON.stringify(updatedSessions));
            if (activeId) window.localStorage.setItem('app-ai-current-session-id', activeId);
        }
    };

    const handleSelectSession = (id: string) => {
        const session = sessions.find(s => s.id === id);
        if (session) {
            setCurrentSessionId(id);
            setMessages(session.messages);
            setShowHistory(false);
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('app-ai-current-session-id', id);
            }
        }
    };

    const handleDeleteSession = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        const updated = sessions.filter(s => s.id !== id);
        setSessions(updated);

        if (currentSessionId === id) {
            if (updated.length > 0) {
                handleSelectSession(updated[0].id);
            } else {
                handleNewChat([]);
            }
        } else {
            saveSessions(updated, currentSessionId);
        }
    };

    // Update current session in the list when messages change
    useEffect(() => {
        if (isClient && currentSessionId && messages.length > 0) {
            setSessions(prev => {
                const updated = prev.map(s => {
                    if (s.id === currentSessionId) {
                        // Generate title from first user message if still "New Conversation"
                        let newTitle = s.title;
                        if (s.title === (t('ai.new_chat_title') || 'New Conversation')) {
                            const firstUserMsg = messages.find(m => m.role === 'user');
                            if (firstUserMsg) {
                                newTitle = firstUserMsg.text.slice(0, 30) + (firstUserMsg.text.length > 30 ? '...' : '');
                            }
                        }
                        return { ...s, messages, title: newTitle, lastTimestamp: Date.now() };
                    }
                    return s;
                });
                saveSessions(updated, currentSessionId);
                return updated;
            });
        }
    }, [messages, currentSessionId, isClient, t]);

    const handleProviderChange = (newProvider: 'gemini' | 'groq') => {
        setProvider(newProvider);
        if (typeof window !== 'undefined') {
            window.localStorage.setItem('app-ai-provider', newProvider);
        }
    };

    // Ensure Goals are Loaded
    useEffect(() => {
        if (user) {
            loadFromCache();
            fetchWishes();
        }
    }, [user, loadFromCache, fetchWishes]);

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

        // Add user message to current view
        const newMessages = [...messages, { role: 'user' as const, text: userMsg }];
        setMessages(newMessages);
        setIsLoading(true);

        // Prepare Context
        const userContext = {
            userId: user?.id,
            language: language,
            coreBalance,
            walletBalance,
            dailyIncome: coreBalance * 0.000633,
            level: user?.level || 1,
            wishes: userWishes.map(w => ({
                title: w.title,
                estimated_cost: w.estimated_cost,
                difficulty_level: w.difficulty_level
            }))
        };

        try {
            let apiHistory = newMessages.slice(0, -1).map(m => ({
                role: m.role,
                parts: m.text
            }));

            while (apiHistory.length > 0 && apiHistory[0].role === 'model') {
                apiHistory.shift();
            }

            const result = await chatWithAI(userMsg, apiHistory, userContext, provider, groqModel);

            if (result.error) {
                if (result.setupNeeded) {
                    setMessages(prev => [...prev, { role: 'model', text: result.text || result.error || "Setup error." }]);
                } else {
                    setError(result.text || "Something went wrong.");
                }
            } else if (result.text) {
                setMessages(prev => [...prev, { role: 'model', text: result.text }]);

                // Challenge Verification Logic
                const aiChallenge = challengesWithParticipation.find(
                    c => c.verification_logic === 'ai_message_sent' &&
                        c.userParticipation?.status === 'active'
                );
                if (aiChallenge && user?.id) {
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
        <div className="flex flex-col h-full bg-gray-50 pt-safe pb-20 overflow-hidden relative">
            {/* History Drawer Overlay */}
            <AnimatePresence>
                {showHistory && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setShowHistory(false)}
                            className="absolute inset-0 bg-black/40 z-30 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ x: '-100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '-100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="absolute top-0 left-0 h-full w-[80%] max-w-sm bg-white z-40 shadow-2xl flex flex-col"
                        >
                            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                                <h3 className="font-bold text-gray-800">{t('ai.history') || 'Chat History'}</h3>
                                <button onClick={() => setShowHistory(false)} className="p-1 hover:bg-gray-100 rounded-full transition-colors">
                                    <X size={20} className="text-gray-500" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                <button
                                    onClick={() => handleNewChat()}
                                    className="w-full flex items-center space-x-3 p-3 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 font-semibold hover:bg-blue-100 transition-colors mb-4"
                                >
                                    <Plus size={18} />
                                    <span>{t('ai.new_chat') || 'New Chat'}</span>
                                </button>

                                {sessions.length === 0 ? (
                                    <div className="text-center py-10 text-gray-400 text-sm">
                                        No recent chats
                                    </div>
                                ) : (
                                    sessions.map(s => (
                                        <div
                                            key={s.id}
                                            onClick={() => handleSelectSession(s.id)}
                                            className={`group relative flex items-center space-x-3 p-3 rounded-xl border transition-all cursor-pointer
                                                ${currentSessionId === s.id
                                                    ? 'bg-blue-600 border-blue-600 text-white shadow-md'
                                                    : 'bg-white border-gray-100 text-gray-700 hover:border-gray-200 hover:bg-gray-50'
                                                }`}
                                        >
                                            <MessageSquare size={16} className={currentSessionId === s.id ? 'text-blue-100' : 'text-gray-400'} />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-sm font-medium truncate">{s.title}</div>
                                                <div className={`text-[10px] ${currentSessionId === s.id ? 'text-blue-200' : 'text-gray-400'}`}>
                                                    {new Date(s.lastTimestamp).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <button
                                                onClick={(e) => handleDeleteSession(e, s.id)}
                                                className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all
                                                    ${currentSessionId === s.id ? 'hover:bg-blue-700 text-white' : 'hover:bg-red-50 text-red-500'}`}
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Header Switcher */}
            <header className="bg-white border-b border-gray-100 z-10 shrink-0">
                <div className="flex justify-center items-center h-14 relative px-4 text-center">
                    <div className="bg-gray-100 p-1 rounded-xl flex space-x-1 w-60 mx-auto">
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
                    {/* Sub-header with History and New Chat */}
                    <div className="bg-white/50 backdrop-blur-sm border-b border-gray-100 px-4 py-2.5 flex items-center justify-between shadow-sm">
                        <div className="flex items-center space-x-3">
                            <button
                                onClick={() => setShowHistory(true)}
                                className="p-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <History size={20} />
                            </button>
                            <button
                                onClick={() => handleNewChat()}
                                className="p-2 bg-white border border-gray-200 rounded-xl text-blue-600 hover:bg-gray-50 transition-colors shadow-sm"
                            >
                                <Plus size={20} />
                            </button>
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
                                        className="flex items-center space-x-1 bg-gray-100 text-gray-700 px-2 py-1 rounded-md text-[10px] hover:bg-gray-200 transition-colors border border-gray-200"
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
                                    <div className={`w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[10px] 
                                        ${msg.role === 'user' ? 'bg-gray-200 text-gray-600' : 'bg-blue-600 text-white shadow-sm'}`}>
                                        {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                    </div>

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
                                    <div className="w-6 h-6 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-sm">
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
                            <div className="text-center text-xs text-red-500 my-2 bg-red-50 py-2 rounded-lg border border-red-100">
                                {error}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="bg-white border-t border-gray-100 p-3 pb-safe-offset shadow-[0_-4px_10px_rgba(0,0,0,0.02)] relative">
                        <AnimatePresence>
                            {showSuggestions && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                                    animate={{ opacity: 1, y: 0, scale: 1, x: '-50%' }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95, x: '-50%' }}
                                    className="absolute bottom-full left-1/2 mb-2 w-[92%] max-w-lg bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-30"
                                >
                                    <div className="p-3 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                                        <span className="text-xs font-bold text-blue-700 uppercase tracking-wider flex items-center gap-1.5">
                                            <Lightbulb size={12} />
                                            {t('ai.faq_suggestions') || 'Suggested Questions'}
                                        </span>
                                        <button onClick={() => setShowSuggestions(false)} className="text-blue-400 hover:text-blue-600">
                                            <X size={14} />
                                        </button>
                                    </div>
                                    <div className="p-2 grid grid-cols-1 gap-1">
                                        {suggestions.map((suggestion, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => {
                                                    setInputValue(suggestion);
                                                    setShowSuggestions(false);
                                                }}
                                                className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-xl transition-colors border border-transparent hover:border-gray-100"
                                            >
                                                {suggestion}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative flex items-center max-w-4xl mx-auto gap-2">
                            <button
                                onClick={() => setShowSuggestions(!showSuggestions)}
                                className={`p-3 rounded-full transition-all shadow-sm border ${showSuggestions ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                    }`}
                            >
                                <Lightbulb size={20} />
                            </button>

                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder={t('ai.input_placeholder') || "Ask for advice..."}
                                    className="w-full bg-gray-100 text-gray-900 rounded-full pl-5 pr-12 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all text-sm border-transparent focus:bg-white focus:border-blue-100"
                                    disabled={isLoading}
                                />
                                <button
                                    onClick={handleSendMessage}
                                    disabled={!inputValue.trim() || isLoading}
                                    className="absolute right-1.5 top-1/2 -translate-y-1/2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shadow-md"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </div>
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
