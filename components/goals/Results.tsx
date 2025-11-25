'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
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
            <div className="absolute inset-0 bg-black/50" onClick={onClose} />
            <div className="relative bg-white rounded-lg shadow-lg max-w-lg w-full overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button className="p-1 rounded hover:bg-gray-100" onClick={onClose} aria-label="Close">
                        <X className="h-5 w-5" />
                    </button>
                </div>
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default function Results() {
    const { results, gameItems, loadFromCache, fetchResults, updateInventory, updateKnowledge, setBase, setCharacter } = useResults();

    const ACHIEVEMENTS = gameItems.filter(i => i.type === 'achievement');
    const INVENTORY_ITEMS = gameItems.filter(i => i.type === 'item');
    const KNOWLEDGE_ITEMS = gameItems.filter(i => i.type === 'book');
    const BASE_BACKGROUNDS = gameItems.filter(i => i.type === 'base');
    const CHARACTER_BACKGROUNDS = gameItems.filter(i => i.type === 'character');

    const [floaterOpen, setFloaterOpen] = useState(false);
    const [circleSize, setCircleSize] = useState<number>(() => {
        if (typeof window === 'undefined') return 60;
        return Math.floor(Math.min(window.innerWidth / 12, window.innerHeight / 24));
    });

    useEffect(() => {
        const onResize = () => setCircleSize(Math.floor(Math.min(window.innerWidth, window.innerHeight) / 12));
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        loadFromCache();
        fetchResults();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const tabs = [
        { key: 'base', emoji: '🏡', title: 'Base' },
        { key: 'character', emoji: '😀', title: 'Character' },
        { key: 'reputation', emoji: '👍', title: 'Reputation' },
        { key: 'achievements', emoji: '🏆', title: 'Achievements' },
        { key: 'inventory', emoji: '🎒', title: 'Inventory' },
        { key: 'knowledge', emoji: '📚', title: 'Knowledge' },
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
            <div className="space-y-3">
                {typeof a.image === 'string' && /^https?:\/\//.test(a.image) ? (
                    <img src={a.image} alt={a.title} className="w-full max-h-56 object-contain rounded" />
                ) : (
                    <div className="text-6xl">{a.image}</div>
                )}
                {a.subtitle && <p className="text-sm text-gray-600">{a.subtitle}</p>}
                <p className="text-gray-800">{a.description}</p>
            </div>
        );
        setModalOpen(true);
    };

    const openInventoryItemModal = (item: GameItem) => {
        setModalTitle(item.title);
        setModalContent(
            <div className="space-y-3">
                {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                    <img src={item.image} alt={item.title} className="w-full max-h-56 object-contain rounded" />
                ) : (
                    <div className="text-6xl">{item.image}</div>
                )}
                <p className="text-gray-800">{item.description}</p>
            </div>
        );
        setModalOpen(true);
    };

    const openItemPicker = (slotIndex: number, type: 'inventory' | 'knowledge') => {
        const availableItems = type === 'inventory' ? INVENTORY_ITEMS : KNOWLEDGE_ITEMS;
        setModalTitle(`Choose ${type === 'inventory' ? 'item' : 'knowledge'}`);
        setModalContent(
            <div className="grid grid-cols-6 gap-2 p-2 max-h-96 overflow-y-auto">
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
                        className="flex items-center justify-center h-10 w-10 bg-white border rounded hover:bg-gray-50"
                        title={item.title}
                    >
                        {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                            <img src={item.image} alt={item.title} className="w-6 h-6 object-cover rounded" />
                        ) : (
                            <span className="text-lg">{item.image}</span>
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

    const gap = 2;
    const totalCircles = 7;
    const panelWidth = circleSize * totalCircles + gap * (totalCircles - 1);

    const unlockedAchievements = (results?.unlocked_achievements as string[]) || [];
    const selectedBaseId = results?.selected_base_id || BASE_BACKGROUNDS[0]?.id;
    const selectedCharacterId = results?.selected_character_id || CHARACTER_BACKGROUNDS[0]?.id;
    const baseIndex = BASE_BACKGROUNDS.findIndex(b => b.id === selectedBaseId);
    const characterIndex = CHARACTER_BACKGROUNDS.findIndex(c => c.id === selectedCharacterId);

    // Debug logging
    console.log('Base:', { selectedBaseId, baseIndex, background: BASE_BACKGROUNDS[baseIndex >= 0 ? baseIndex : 0] });
    console.log('Character:', { selectedCharacterId, characterIndex, background: CHARACTER_BACKGROUNDS[characterIndex >= 0 ? characterIndex : 0] });

    return (
        <div
            className="relative flex flex-col h-full bg-white overscroll-none touch-pan-y"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
        >
            {/* Floating top-left control */}
            <div className="absolute top-0 left-0 z-50">
                <div
                    className="relative rounded-full shadow-lg overflow-hidden"
                    style={{ width: floaterOpen ? panelWidth : circleSize, height: circleSize, transition: 'width 260ms cubic-bezier(.2,.8,.2,1)' }}
                >
                    <div className="absolute inset-0 rounded-full bg-black/20 backdrop-blur-md" style={{ border: '1px solid rgba(255,255,255,0.06)' }} />

                    <div className="relative z-10 h-full flex items-center">
                        <div className="relative" style={{ width: panelWidth, height: '100%' }}>
                            {tabs.map((tab, i) => {
                                const size = circleSize;
                                const offset = (i + 1) * (size + gap);
                                const leftPos = floaterOpen ? offset : 0;
                                const style: React.CSSProperties = {
                                    left: leftPos,
                                    transition: 'left 240ms cubic-bezier(.2,.8,.2,1), opacity 200ms',
                                    opacity: floaterOpen ? 1 : 0,
                                    pointerEvents: floaterOpen ? 'auto' : 'none',
                                    position: 'absolute',
                                    width: size,
                                    height: size,
                                    borderRadius: '9999px',
                                    boxShadow: '0 6px 18px rgba(0,0,0,0.18)',
                                };
                                return (
                                    <button
                                        key={tab.key}
                                        style={style}
                                        aria-label={tab.title}
                                        title={tab.title}
                                        className="flex items-center justify-center"
                                        onClick={() => setActiveTab(tab.key)}
                                    >
                                        <div style={{ width: '100%', height: '100%', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: Math.max(12, Math.floor(circleSize / 2.8)), background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(220,220,220,0.15))', border: '1px solid rgba(0,0,0,0.3)' }}>
                                            <span>{tab.emoji}</span>
                                        </div>
                                    </button>
                                );
                            })}

                            {/* Toggle button */}
                            <button onClick={() => setFloaterOpen((v) => !v)} aria-label="Toggle floating circles" className="relative flex items-center justify-center" style={{ left: 0, position: 'absolute', width: circleSize, height: circleSize }}>
                                <div style={{ width: '100%', height: '100%', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(255,255,255,0.2), rgba(220,220,220,0.15))', border: '1px solid rgba(0,0,0,0.3)' }} />
                                {floaterOpen ? (
                                    <ChevronLeft className="absolute" style={{ width: Math.max(12, Math.floor(circleSize / 5)), height: Math.max(12, Math.floor(circleSize / 5)), color: 'white' }} />
                                ) : (
                                    <ChevronRight className="absolute" style={{ width: Math.max(12, Math.floor(circleSize / 5)), height: Math.max(12, Math.floor(circleSize / 5)), color: 'white' }} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Achievements */}
            {activeTab === 'achievements' && (
                <div className="h-full flex flex-col">
                    <div className="p-4 flex-1 overflow-y-auto">
                        <div className="grid grid-cols-3 lg:grid-cols-6 gap-3">
                            {ACHIEVEMENTS.map((a) => {
                                const isUnlocked = unlockedAchievements.includes(a.id);
                                return (
                                    <button
                                        key={a.id}
                                        onClick={() => openAchievementModal(a)}
                                        className={`aspect-square bg-white rounded-lg border-2 ${isUnlocked ? 'border-green-400' : 'border-dashed border-gray-300'} hover:border-gray-400 hover:shadow-md transition-all duration-200 text-left relative overflow-hidden flex flex-col items-center justify-center p-3`}
                                    >
                                        {typeof a.image === 'string' && /^https?:\/\//.test(a.image) ? (
                                            <img src={a.image} alt={a.title} className="w-12 h-12 object-cover rounded mb-2" />
                                        ) : (
                                            <div className="text-3xl mb-2">{a.image}</div>
                                        )}
                                        <div className="text-center">
                                            <div className="font-semibold text-sm text-gray-800 leading-tight">{a.title}</div>
                                            {a.subtitle && <div className="text-xs text-gray-600 mt-1">{a.subtitle}</div>}
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
                <div className="py-0 px-0 overflow-y-auto">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-0 justify-items-stretch">
                        {inventorySlots.map((slot, idx) => {
                            const item = slot ? INVENTORY_ITEMS.find(i => i.id === slot.itemId) : null;
                            return (
                                <div key={idx} className="relative">
                                    {item ? (
                                        <div className="aspect-square w-full bg-white border rounded-lg relative overflow-hidden flex items-center justify-center hover:shadow-sm">
                                            <div
                                                onClick={() => openInventoryItemModal(item)}
                                                className="absolute inset-0 flex items-center justify-center text-5xl leading-none select-none"
                                            >
                                                {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                                                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                ) : (
                                                    <div className="text-5xl">{item.image}</div>
                                                )}
                                            </div>
                                            <div className="absolute bottom-1 left-1 right-1 text-center text-xs bg-white/70 rounded px-1 py-0.5">{item.title}</div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(idx, 'inventory');
                                                }}
                                                className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-xs hover:bg-red-100"
                                                aria-label="Remove item"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="aspect-square w-full bg-gray-50 border rounded-lg flex items-center justify-center text-sm text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => openItemPicker(idx, 'inventory')}
                                        >
                                            +
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
                <div className="py-0 px-0 overflow-y-auto">
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-0 justify-items-stretch">
                        {knowledgeSlots.map((slot, idx) => {
                            const item = slot ? KNOWLEDGE_ITEMS.find(i => i.id === slot.itemId) : null;
                            return (
                                <div key={idx} className="relative">
                                    {item ? (
                                        <div className="aspect-square w-full bg-white border rounded-lg relative overflow-hidden flex items-center justify-center hover:shadow-sm">
                                            <div
                                                onClick={() => openInventoryItemModal(item)}
                                                className="absolute inset-0 flex items-center justify-center text-5xl leading-none select-none"
                                            >
                                                {typeof item.image === 'string' && /^https?:\/\//.test(item.image) ? (
                                                    <img src={item.image} alt={item.title} className="w-12 h-12 object-cover rounded" />
                                                ) : (
                                                    <div className="text-5xl">{item.image}</div>
                                                )}
                                            </div>
                                            <div className="absolute bottom-1 left-1 right-1 text-center text-xs bg-white/70 rounded px-1 py-0.5">{item.title}</div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    removeItem(idx, 'knowledge');
                                                }}
                                                className="absolute top-1 right-1 bg-white/80 rounded-full p-0.5 text-xs hover:bg-red-100"
                                                aria-label="Remove item"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ) : (
                                        <div
                                            className="aspect-square w-full bg-gray-50 border rounded-lg flex items-center justify-center text-sm text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors"
                                            onClick={() => openItemPicker(idx, 'knowledge')}
                                        >
                                            +
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
                <div className="relative h-full flex w-full">
                    {typeof window !== 'undefined' && window.innerWidth > window.innerHeight && <div className="w-8 bg-gray-200 flex-shrink-0"></div>}
                    <div
                        className="flex-1 relative bg-gray-200"
                        style={{
                            backgroundImage: BASE_BACKGROUNDS[baseIndex >= 0 ? baseIndex : 0]?.image ? `url(${BASE_BACKGROUNDS[baseIndex >= 0 ? baseIndex : 0].image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <button
                            className="absolute bottom-20 right-4 w-16 h-16 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg bg-black/50 hover:bg-black/70 transition-colors z-10"
                            onClick={() => {
                                const nextIndex = (baseIndex >= 0 ? baseIndex + 1 : 1) % BASE_BACKGROUNDS.length;
                                setBase(BASE_BACKGROUNDS[nextIndex].id);
                            }}
                        >
                            {(baseIndex >= 0 ? baseIndex : 0) + 1}
                        </button>
                    </div>
                    {typeof window !== 'undefined' && window.innerWidth > window.innerHeight && <div className="w-8 bg-gray-200 flex-shrink-0"></div>}
                </div>
            )}

            {/* Character */}
            {activeTab === 'character' && (
                <div className="relative h-full flex w-full">
                    {typeof window !== 'undefined' && window.innerWidth > window.innerHeight && <div className="w-8 bg-gray-200 flex-shrink-0"></div>}
                    <div
                        className="flex-1 relative bg-gray-200"
                        style={{
                            backgroundImage: CHARACTER_BACKGROUNDS[characterIndex >= 0 ? characterIndex : 0]?.image ? `url(${CHARACTER_BACKGROUNDS[characterIndex >= 0 ? characterIndex : 0].image})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat'
                        }}
                    >
                        <button
                            className="absolute bottom-20 right-4 w-16 h-16 rounded-full border-2 border-white shadow-lg flex items-center justify-center text-white font-bold text-lg bg-black/50 hover:bg-black/70 transition-colors z-10"
                            onClick={() => {
                                const nextIndex = (characterIndex >= 0 ? characterIndex + 1 : 1) % CHARACTER_BACKGROUNDS.length;
                                setCharacter(CHARACTER_BACKGROUNDS[nextIndex].id);
                            }}
                        >
                            {(characterIndex >= 0 ? characterIndex : 0) + 1}
                        </button>
                    </div>
                    {typeof window !== 'undefined' && window.innerWidth > window.innerHeight && <div className="w-8 bg-gray-200 flex-shrink-0"></div>}
                </div>
            )}

            {/* Reputation placeholder */}
            {activeTab === 'reputation' && (
                <div className="p-4">
                    <h2 className="text-xl font-semibold">Reputation</h2>
                    <p className="text-gray-600 mt-2">Coming soon...</p>
                </div>
            )}

            <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={modalTitle}>
                {modalContent}
            </Modal>
        </div>
    );
}
