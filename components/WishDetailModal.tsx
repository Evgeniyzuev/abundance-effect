import React from 'react';
import { UserWish, RecommendedWish } from '@/types/supabase';
import { X, Trash2, Edit2, Plus, CheckCircle } from 'lucide-react';
import { storage } from '@/utils/storage';

interface WishDetailModalProps {
    wish: UserWish | RecommendedWish;
    isOpen: boolean;
    onClose: () => void;
    onAdd?: (wish: RecommendedWish) => void;
    onDelete?: (wish: UserWish) => void;
    onEdit?: (wish: UserWish) => void;
    onComplete?: (wish: UserWish) => void;
    isRecommended?: boolean;
}

export default function WishDetailModal({
    wish,
    isOpen,
    onClose,
    onAdd,
    onDelete,
    onEdit,
    onComplete,
    isRecommended = false
}: WishDetailModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 relative z-10">
                <div className="relative h-64">
                    {wish.image_url ? (
                        <img
                            src={wish.image_url.startsWith('local://')
                                ? (storage.getWishImage(wish.image_url.replace('local://', '')) || wish.image_url)
                                : wish.image_url}
                            alt={wish.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                            <span className="text-6xl">🎯</span>
                        </div>
                    )}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="p-6 space-y-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">{wish.title}</h2>
                        {'category' in wish && wish.category && (
                            <span className="inline-block mt-1 px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                {wish.category}
                            </span>
                        )}
                    </div>

                    {wish.description && (
                        <p className="text-gray-600 leading-relaxed">{wish.description}</p>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        {wish.estimated_cost && (
                            <div className="flex items-center gap-1">
                                <span>💰</span>
                                <span>{wish.estimated_cost}</span>
                            </div>
                        )}
                        {wish.difficulty_level && (
                            <div className="flex items-center gap-1">
                                <span>🔥</span>
                                <span>Level {wish.difficulty_level}</span>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 flex gap-3">
                        {isRecommended ? (
                            <button
                                onClick={() => onAdd?.(wish as RecommendedWish)}
                                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Plus size={20} />
                                Add to My Wishes
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={() => onDelete?.(wish as UserWish)}
                                    className="flex-1 bg-red-50 text-red-600 py-3 rounded-xl font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={18} />
                                </button>
                                <button
                                    onClick={() => onEdit?.(wish as UserWish)}
                                    className="flex-1 bg-gray-100 text-gray-900 py-3 rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    onClick={() => onComplete?.(wish as UserWish)}
                                    className="flex-1 bg-green-50 text-green-600 py-3 rounded-xl font-medium hover:bg-green-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <CheckCircle size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
