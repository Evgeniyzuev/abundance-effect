'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { useGoals } from '@/hooks/useGoals';
import { UserWish, RecommendedWish } from '@/types/supabase';
import WishCard from '@/components/WishCard';
import WishDetailModal from '@/components/WishDetailModal';
import AddWishModal from '@/components/AddWishModal';
import { Plus } from 'lucide-react';
import { storage } from '@/utils/storage';

export default function Wishboard() {
    const { user } = useUser();
    const {
        userWishes,
        recommendedWishes,
        loadFromCache,
        fetchWishes,
        addWish,
        deleteWish,
        updateWish
    } = useGoals();

    const [selectedWish, setSelectedWish] = useState<UserWish | RecommendedWish | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRecommendedDetail, setIsRecommendedDetail] = useState(false);
    const [editingWish, setEditingWish] = useState<UserWish | null>(null);

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
        const success = await addWish({
            title: wish.title,
            description: wish.description,
            image_url: wish.image_url,
            estimated_cost: wish.estimated_cost,
            difficulty_level: wish.difficulty_level,
            recommended_source_id: wish.id
        }, true);

        if (success) {
            setIsDetailOpen(false);
        } else {
            alert('Failed to add wish');
        }
    };

    const handleDeleteWish = async (wish: UserWish) => {
        if (!confirm('Are you sure you want to delete this wish?')) return;

        const success = await deleteWish(wish.id);
        if (success) {
            if (wish.image_url && wish.image_url.startsWith('local://')) {
                const localId = wish.image_url.replace('local://', '');
                storage.removeWishImage(localId);
            }
            setIsDetailOpen(false);
        } else {
            alert('Failed to delete wish');
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
        let success = false;
        if (editingWish) {
            success = await updateWish(editingWish.id, wishData);
        } else {
            success = await addWish(wishData);
        }

        if (success) {
            handleModalClose();
        }
        return success;
    };

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
                        <span className="text-xs font-medium text-gray-500">Add New</span>
                    </div>

                    {/* User Wishes */}
                    {userWishes.map((wish) => (
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
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 px-4">Recommended for You</h3>
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
                />
            )}

            <AddWishModal
                isOpen={isAddModalOpen}
                onClose={handleModalClose}
                onSave={handleSaveWish}
                initialData={editingWish}
            />
        </div>
    );
}
