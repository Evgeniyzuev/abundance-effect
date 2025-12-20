'use client';

import React, { useState, useEffect, useRef } from 'react';
import { X, Home, User, Star, Trophy, Package, Book } from 'lucide-react';
import { useResults, InventorySlot } from '@/hooks/useResults';
import { GameItem } from '@/types/supabase';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    children?: React.ReactNode;
}

function Modal({ open, onClose, title, children }: ModalProps) {
    if (!open) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-white rounded-2xl shadow-xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b flex items-center justify-between bg-gray-50/50">
                    <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
                    <button className="p-1 rounded-full hover:bg-gray-200 transition-colors" onClick={onClose} aria-label="Close">
                        <X className="h-5 w-5 text-gray-500" />
                    </button>
                </div>
                <div className="p-4 max-h-[70vh] overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

export default function Results({ menuOpen = true }: { menuOpen?: boolean }) {
    const { results, gameItems, loadFromCache, fetchResults, updateInventory, updateKnowledge, setBase, setCharacter } = useResults();

    const ACHIEVEMENTS = gameItems.filter(i => i.type === 'achievement');
    const INVENTORY_ITEMS = gameItems.filter(i => i.type === 'item');
    const KNOWLEDGE_ITEMS = gameItems.filter(i => i.type === 'book');
    const BASE_BACKGROUNDS = gameItems.filter(i => i.type === 'base');
    const CHARACTER_BACKGROUNDS = gameItems.filter(i => i.type === 'character');

    const DEFAULT_BASE = {
        id: 'base_default',
        image: 'https://blush-keen-constrictor-906.mypinata.cloud/ipfs/bafybeidrqqjj73obl35ceqeg7qoqmc2aphlvpuau57o7b3sd5zoz6ecjtq',
        title: 'Default Base'
    };

    const DEFAULT_CHARACTER = {
        id: 'char_default',
        image: 'https://i.pinimg.com/736x/92/a8/c9/92a8c9100c338d19b9e3294a347d8d09.jpg',
        title: 'Default Character'
    };

    useEffect(() => {
        loadFromCache();
        fetchResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tabs = [
        { key: 'base', icon: Home, title: 'Base' },
        { key: 'character', icon: User, title: 'Character' },
        { key: 'reputation', icon: Star, title: 'Reputation' },
        { key: 'achievements', icon: Trophy, title: 'Achievements' },
        { key: 'inventory', icon: Package, title: 'Inventory' },
        { key: 'knowledge', icon: Book, title: 'Knowledge' },
    ];

    const [activeTab, setActiveTab] = useState<string>('achievements');
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTitle, setModalTitle] = useState('');
    const [modalContent, setModalContent] = useState<React.ReactNode>('');

    // Inventory and knowledge state
    const [inventorySlots, setInventorySlots] = useState<(InventorySlot | null)[]>(
        Array.from({ length: 60 }, (_, i) => null)
    );
    const [knowledgeSlots, setKnowledgeSlots] = useState<(InventorySlot | null)[]>(
        Array.from({ length: 60 }, (_, i) => null)
    );

    // Load from results
    useEffect(() => {
        if (results) {
            const inv = (results.inventory as unknown as InventorySlot[]) || [];
            const newInvSlots = Array.from({ length: 60 }, (_, i) => {
                const found = inv.find(s => s.slot === i);
                return found || null;
            });
            setInventorySlots(newInvSlots);

            const know = (results.knowledge as unknown as InventorySlot[]) || [];
            const newKnowSlots = Array.from({ length: 60 }, (_, i) => {
                const found = know.find(s => s.slot === i);
                return found || null;
            });
            setKnowledgeSlots(newKnowSlots);
        }
    }, [results]);

    // Swipe logic
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);
    const minSwipeDistance = 50;

    const onTouchStart = (e: React.TouchEvent) => {
        touchEndX.current = null;
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const isLeftSwipe = distance > minSwipeDistance;
        const isRightSwipe = distance < -minSwipeDistance;

        if (isLeftSwipe || isRightSwipe) {
            const currentIndex = tabs.findIndex(t => t.key === activeTab);
            if (isLeftSwipe && currentIndex < tabs.length - 1) {
                setActiveTab(tabs[currentIndex + 1].key);
            }
            if (isRightSwipe && currentIndex > 0) {
                setActiveTab(tabs[currentIndex - 1].key);
            }
        }
    };

    const openAchievementModal = (a: GameItem) => {
        setModalTitle(a.title);
        setModalContent(
            <div className="space-y-4">
                {typeof a.image === 'string' && /^https?:\/\//.test(a.image) ? (
                    <img src={a.image} alt={a.title} className="w-full max-h-64 object-contain rounded-lg shadow-sm" />
                ) : (
                    <div className="text-6xl text-center py-4">{a.image}</div>
                )}
                <div>
                    {a.subtitle && <p className="text-sm font-medium text-blue-600 mb-1">{a.subtitle}</p>}
                    <p className="text-gray-700 leading-relaxed">{a.description}</p>
                </div>
            </div>
        );
        setModalOpen(true);
    };

    const openInventoryItemModal = (item: GameItem) => {
        // Special case for onboarding knowledge item
        if (item.id === 'onboarding_guide') {
            setModalTitle(item.title);
            setModalContent(
                <div className="space-y-4">
                    <div className="text-6xl text-center py-4">{item.image}</div>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    <button
                        onClick={() => {
                            setModalOpen(false);
                            window.location.href = '/';
                        }}
                        className="w-full bg-blue-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                        Open Onboarding Guide
                    </button>
                </div>
            );
            setModalOpen(true);
            return;
        }
        // Special case for finance participation knowledge item
        if (item.id === 'finance_participation') {
            setModalTitle(item.title);
            setModalContent(
                <div className="space-y-4">
                    <div className="text-6xl text-center py-4">{item.image}</div>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    <button
                        onClick={() => {
                            setModalOpen(false);
                            window.location.href = '/finance';
                        }}
                        className="w-full bg-emerald-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-emerald-600 transition-colors"
                    >
                        Открыть Экономику участия
                    </button>
                </div>
            );
            setModalOpen(true);
            return;
        }
        // Special case for core creation knowledge item
        if (item.id === 'core_creation') {
            setModalTitle(item.title);
            setModalContent(
                <div className="space-y-4">
                    <div className="text-6xl text-center py-4">{item.image}</div>
                    <p className="text-gray-700 leading-relaxed">{item.description}</p>
                    <button
                        onClick={() => {
                            setModalOpen(false);
                            window.location.href = '/core-creation';
                        }}
                        className="w-full bg-purple-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-purple-600 transition-colors"
                    >
                        Открыть AI Core
                    </button>
                </div>
            );
            setModalOpen(true);
            return;
        }


        setModalTitle(item.title);
        setModalContent(
            <div className="space-y-4">
                {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                    <img src={item.image} alt={item.title} className="w-full max-h-64 object-contain rounded-lg shadow-sm" />
                ) : (
                    <div className="text-6xl text-center py-4">{item.image}</div>
                )}
                <p className="text-gray-700 leading-relaxed">{item.description}</p>
            </div>
        );
        setModalOpen(true);
    };

    const openItemPicker = (slotIndex: number, type: 'inventory' | 'knowledge') => {
        const availableItems = type === 'inventory' ? INVENTORY_ITEMS : KNOWLEDGE_ITEMS;
        setModalTitle(`Choose ${type === 'inventory' ? 'item' : 'knowledge'}`);
        setModalContent(
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-3 p-1 max-h-96 overflow-y-auto">
                {availableItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => {
                            const newSlot: InventorySlot = { slot: slotIndex, itemId: item.id, count: 1 };
                            if (type === 'inventory') {
                                const newSlots = [...inventorySlots];
                                newSlots[slotIndex] = newSlot;
                                setInventorySlots(newSlots);
                                updateInventory(newSlots.filter(s => s !== null) as InventorySlot[]);
                            } else {
                                const newSlots = [...knowledgeSlots];
                                newSlots[slotIndex] = newSlot;
                                setKnowledgeSlots(newSlots);
                                updateKnowledge(newSlots.filter(s => s !== null) as InventorySlot[]);
                            }
                            setModalOpen(false);
                        }}
                        className="flex items-center justify-center aspect-square bg-gray-50 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-200 transition-all"
                        title={item.title}
                    >
                        {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                            <img src={item.image} alt={item.title} className="w-8 h-8 object-cover rounded" />
                        ) : (
                            <span className="text-2xl">{item.image}</span>
                        )}
                    </button>
                ))}
            </div>
        );
        setModalOpen(true);
    };

    const removeItem = (slotIndex: number, type: 'inventory' | 'knowledge') => {
        if (type === 'inventory') {
            const newSlots = [...inventorySlots];
            newSlots[slotIndex] = null;
            setInventorySlots(newSlots);
            updateInventory(newSlots.filter(s => s !== null) as InventorySlot[]);
        } else {
            const newSlots = [...knowledgeSlots];
            newSlots[slotIndex] = null;
            setKnowledgeSlots(newSlots);
            updateKnowledge(newSlots.filter(s => s !== null) as InventorySlot[]);
        }
    };

    const unlockedAchievements = (results?.unlocked_achievements as string[]) || [];

    // Select base
    const selectedBaseId = results?.selected_base_id;
    const baseItem = BASE_BACKGROUNDS.find(b => b.id === selectedBaseId) || BASE_BACKGROUNDS[0] || DEFAULT_BASE;
    const baseIndex = BASE_BACKGROUNDS.findIndex(b => b.id === baseItem.id);

    // Select character
    const selectedCharacterId = results?.selected_character_id;
    const characterItem = CHARACTER_BACKGROUNDS.find(c => c.id === selectedCharacterId) || CHARACTER_BACKGROUNDS[0] || DEFAULT_CHARACTER;
    const characterIndex = CHARACTER_BACKGROUNDS.findIndex(c => c.id === characterItem.id);

    return (
        <div
            className="relative flex flex-col h-full bg-gray-50 overscroll-none touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Vertical Navigation (Right Overlay) */}
            <div
                className={`
                    fixed top-16 right-2 z-50 flex flex-col space-y-3
                    transition-all duration-300 ease-out transform
                    ${menuOpen ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0 pointer-events-none'}
                `}
            >
                {tabs.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key)}
                            className={`
                                flex items-center justify-center w-11 h-11 rounded-full transition-all duration-300
                                ${isActive
                                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 scale-110 active:scale-95'
                                    : 'bg-white/80 backdrop-blur-md text-gray-500 hover:bg-white hover:text-blue-500 shadow-sm'
                                }
                            `}
                            title={tab.title}
                        >
                            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                        </button>
                    );
                })}
            </div>

            {/* Content Area */}
            <div className="flex-1 relative overflow-hidden h-full">
                {/* Achievements */}
                {activeTab === 'achievements' && (
                    <div className="h-full flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="p-4 pt-16 flex-1 overflow-y-auto">
                            <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                                {ACHIEVEMENTS.map((a) => {
                                    const isUnlocked = unlockedAchievements.includes(a.id);
                                    return (
                                        <button
                                            key={a.id}
                                            onClick={() => openAchievementModal(a)}
                                            className={`aspect-square bg-white rounded-xl border-2 ${isUnlocked ? 'border-green-400 shadow-sm' : 'border-dashed border-gray-200 opacity-70'} hover:border-blue-300 hover:shadow-md transition-all duration-200 text-left relative overflow-hidden flex flex-col items-center justify-center p-3`}
                                        >
                                            {typeof a.image === 'string' && /^https?:\/\//.test(a.image) ? (
                                                <img src={a.image} alt={a.title} className="w-12 h-12 object-cover rounded mb-2" />
                                            ) : (
                                                <div className="text-3xl mb-2">{a.image}</div>
                                            )}
                                            <div className="text-center w-full">
                                                <div className="font-semibold text-xs sm:text-sm text-gray-800 leading-tight truncate px-1">{a.title}</div>
                                                {a.subtitle && <div className="text-[10px] text-gray-500 mt-1 truncate px-1">{a.subtitle}</div>}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Inventory */}
                {activeTab === 'inventory' && (
                    <div className="h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pt-16">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-0.5 p-0.5">
                            {inventorySlots.map((slot, idx) => {
                                const item = slot ? INVENTORY_ITEMS.find(i => i.id === slot.itemId) : null;
                                return (
                                    <div key={idx} className="relative aspect-square">
                                        {item ? (
                                            <div className="w-full h-full bg-white border border-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center hover:shadow-md transition-shadow group">
                                                <div
                                                    onClick={() => openInventoryItemModal(item)}
                                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                >
                                                    {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                                                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                    ) : (
                                                        <div className="text-4xl">{item.image}</div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-1 left-1 right-1 text-center text-[10px] bg-white/90 backdrop-blur-sm rounded px-1 py-0.5 truncate shadow-sm">{item.title}</div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeItem(idx, 'inventory');
                                                    }}
                                                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Remove item"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-full h-full bg-gray-50/50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                                                onClick={() => openItemPicker(idx, 'inventory')}
                                            >
                                                <span className="text-2xl font-light">+</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Knowledge */}
                {activeTab === 'knowledge' && (
                    <div className="h-full overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300 pt-16">
                        <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-0.5 p-0.5">
                            {knowledgeSlots.map((slot, idx) => {
                                const item = slot ? KNOWLEDGE_ITEMS.find(i => i.id === slot.itemId) : null;
                                return (
                                    <div key={idx} className="relative aspect-square">
                                        {item ? (
                                            <div className="w-full h-full bg-white border border-gray-100 rounded-lg relative overflow-hidden flex items-center justify-center hover:shadow-md transition-shadow group">
                                                <div
                                                    onClick={() => openInventoryItemModal(item)}
                                                    className="absolute inset-0 flex items-center justify-center cursor-pointer"
                                                >
                                                    {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                                                        <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                    ) : (
                                                        <div className="text-4xl">{item.image}</div>
                                                    )}
                                                </div>
                                                <div className="absolute bottom-1 left-1 right-1 text-center text-[10px] bg-white/90 backdrop-blur-sm rounded px-1 py-0.5 truncate shadow-sm">{item.title}</div>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        removeItem(idx, 'knowledge');
                                                    }}
                                                    className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    aria-label="Remove item"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div
                                                className="w-full h-full bg-gray-50/50 border border-dashed border-gray-200 rounded-lg flex items-center justify-center text-gray-300 hover:text-blue-400 hover:border-blue-300 hover:bg-blue-50/30 cursor-pointer transition-all"
                                                onClick={() => openItemPicker(idx, 'knowledge')}
                                            >
                                                <span className="text-2xl font-light">+</span>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Base */}
                {activeTab === 'base' && (
                    <div className="flex-1 relative bg-[#F2F2F7] overflow-hidden animate-in fade-in duration-500">
                        <div
                            className="absolute inset-0 transition-all duration-500"
                            style={{
                                backgroundImage: `url(${baseItem.image})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#F2F2F7'
                            }}
                        />

                        {BASE_BACKGROUNDS.length > 1 && (
                            <button
                                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 active:scale-95 transition-all z-10"
                                onClick={() => {
                                    const nextIndex = (baseIndex + 1) % BASE_BACKGROUNDS.length;
                                    setBase(BASE_BACKGROUNDS[nextIndex].id);
                                }}
                            >
                                <span className="font-bold text-gray-800">Base</span>
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {baseIndex + 1}/{BASE_BACKGROUNDS.length}
                                </span>
                            </button>
                        )}
                    </div>
                )}

                {/* Character */}
                {activeTab === 'character' && (
                    <div className="flex-1 relative bg-[#F2F2F7] overflow-hidden animate-in fade-in duration-500">
                        <div
                            className="absolute inset-0 transition-all duration-500"
                            style={{
                                backgroundImage: `url(${characterItem.image})`,
                                backgroundSize: 'contain',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#F2F2F7'
                            }}
                        />

                        {CHARACTER_BACKGROUNDS.length > 1 && (
                            <button
                                className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-center space-x-2 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-white/50 active:scale-95 transition-all z-10"
                                onClick={() => {
                                    const nextIndex = (characterIndex + 1) % CHARACTER_BACKGROUNDS.length;
                                    setCharacter(CHARACTER_BACKGROUNDS[nextIndex].id);
                                }}
                            >
                                <span className="font-bold text-gray-800">Character</span>
                                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                                    {characterIndex + 1}/{CHARACTER_BACKGROUNDS.length}
                                </span>
                            </button>
                        )}
                    </div>
                )}

                {/* Reputation placeholder */}
                {activeTab === 'reputation' && (
                    <div className="p-8 pt-20 flex flex-col items-center justify-center h-full text-center animate-in fade-in zoom-in duration-300">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                            <Star className="w-10 h-10 text-blue-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-800">Reputation System</h2>
                        <p className="text-gray-500 mt-2 max-w-xs">Track your standing with different factions and characters. Coming soon!</p>
                    </div>
                )}
            </div>

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
                {modalContent}
            </Modal>
        </div >
    );
}
