'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useLanguage } from '@/context/LanguageContext';
import { useGoals } from '@/hooks/useGoals';
import { UserWish, RecommendedWish } from '@/types/supabase';
import WishCard from '@/components/WishCard';
import WishDetailModal from '@/components/WishDetailModal';
import WishCompletionModal from '@/components/WishCompletionModal';
import AddWishModal from '@/components/AddWishModal';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';
import { storage } from '@/utils/storage';

export default function Wishboard() {
    const { user } = useUser();
    const { t } = useLanguage();
    const {
        userWishes,
        recommendedWishes,
        loadFromCache,
        fetchWishes,
        addWish,
        deleteWish,
        updateWish,
        completeWish
    } = useGoals();

    const [selectedWish, setSelectedWish] = useState<UserWish | RecommendedWish | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRecommendedDetail, setIsRecommendedDetail] = useState(false);
    const [editingWish, setEditingWish] = useState<UserWish | null>(null);
    const [completingWish, setCompletingWish] = useState<UserWish | null>(null);
    const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
    const [completedWishesExpanded, setCompletedWishesExpanded] = useState(false);

    useEffect(() => {
        if (!user) return;

        // Load from cache first (synchronous) - instant display
        loadFromCache();

        // Always fetch fresh data in background to keep cache updated
        // This runs async and won't block the initial render
        fetchWishes();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const handleWishClick = (wish: UserWish | RecommendedWish, isRecommended: boolean) => {
        setSelectedWish(wish);
        setIsRecommendedDetail(isRecommended);
        setIsDetailOpen(true);
    };

    const handleAddFromRecommended = async (wish: RecommendedWish) => {
        setIsDetailOpen(false); // Close immediately for optimistic UI
        const success = await addWish({
            title: wish.title,
            description: wish.description,
            image_url: wish.image_url,
            estimated_cost: wish.estimated_cost,
            difficulty_level: wish.difficulty_level,
            recommended_source_id: wish.id
        }, true);

        if (!success) {
            // If failed, we might want to show an error or re-open, but addWish already alerts
        }
    };

    const handleDeleteWish = async (wish: UserWish) => {
        if (!confirm(t('common.delete') + ' this wish?')) return;

        setIsDetailOpen(false); // Close immediately

        const success = await deleteWish(wish.id);
        if (success) {
            if (wish.image_url && wish.image_url.startsWith('local://')) {
                const localId = wish.image_url.replace('local://', '');
                storage.removeWishImage(localId);
            }
        }
    };

    const handleEditWish = (wish: UserWish) => {
        setEditingWish(wish);
        setIsDetailOpen(false);
        setIsAddModalOpen(true);
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingWish(null);
    };

    const handleSaveWish = async (wishData: any) => {
        handleModalClose(); // Close immediately

        let success = false;
        if (editingWish) {
            success = await updateWish(editingWish.id, wishData);
        } else {
            success = await addWish(wishData);
        }

        return success;
    };

    const handleCompleteWish = async (wish: UserWish) => {
        setIsDetailOpen(false); // Close detail modal
        setCompletingWish(wish);
        setIsCompletionModalOpen(true);

        await completeWish(wish.id);
    };

    const handleCompletionModalClose = () => {
        setIsCompletionModalOpen(false);
        setCompletingWish(null);
    };

    // Filter wishes by completion status
    const incompleteWishes = userWishes.filter(wish => !wish.is_completed);
    const completedWishes = userWishes.filter(wish => wish.is_completed);

    return (
        <div className="pb-20 px-0.5">
            {/* User Wishes Section */}
            <div className="mb-8">
                <div className="grid grid-cols-3 gap-0.5">
                    {/* Add New Wish Button */}
                    <div
                        onClick={() => setIsAddModalOpen(true)}
                        className="aspect-square bg-white flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors relative"
                    >
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mb-1">
                            <Plus size={24} />
                        </div>
                        <span className="text-xs font-medium text-gray-500">{t('goals.add_new')}</span>
                    </div>

                    {/* User Wishes */}
                    {incompleteWishes.map((wish) => (
                        <WishCard
                            key={wish.id}
                            wish={wish}
                            onClick={() => handleWishClick(wish, false)}
                            className="rounded-none w-full h-full"
                        />
                    ))}
                </div>
            </div>

            {/* Recommended Wishes Section */}
            {recommendedWishes.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 px-4">{t('goals.recommended_for_you')}</h3>
                    <div className="grid grid-cols-3 gap-0.5">
                        {recommendedWishes.map((wish) => (
                            <WishCard
                                key={wish.id}
                                wish={wish}
                                onClick={() => handleWishClick(wish, true)}
                                className="rounded-none w-full h-full"
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            {selectedWish && (
                <WishDetailModal
                    wish={selectedWish}
                    isOpen={isDetailOpen}
                    onClose={() => setIsDetailOpen(false)}
                    isRecommended={isRecommendedDetail}
                    onAdd={handleAddFromRecommended}
                    onDelete={handleDeleteWish}
                    onEdit={handleEditWish}
                    onComplete={handleCompleteWish}
                />
            )}

            <AddWishModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveWish}
                initialData={editingWish}
            />

            {/* Completed Wishes Section */}
            {completedWishes.length > 0 && (
                <div className="fixed bottom-14 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 z-40">
                    <button
                        onClick={() => setCompletedWishesExpanded(!completedWishesExpanded)}
                        className="w-full py-3 px-4 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                    >
                        <span className="mr-2 text-sm font-medium">
                            {t('goals.completed_wishes')} ({completedWishes.length})
                        </span>
                        {completedWishesExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                    </button>

                    {completedWishesExpanded && (
                        <div className="max-h-64 overflow-y-auto border-t border-gray-100">
                            <div className="p-4">
                                <div className="grid grid-cols-3 gap-2">
                                    {completedWishes.map((wish) => (
                                        <WishCard
                                            key={wish.id}
                                            wish={wish}
                                            onClick={() => handleWishClick(wish, false)}
                                            className="aspect-square opacity-75"
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Completion Modal */}
            {completingWish && (
                <WishCompletionModal
                    isOpen={isCompletionModalOpen}
                    onClose={handleCompletionModalClose}
                    wishTitle={completingWish.title}
                />
            )}
        </div>
    );
}
