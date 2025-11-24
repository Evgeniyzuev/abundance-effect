'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@/context/UserContext';
import { createClient } from '@/utils/supabase/client';
import { UserWish, RecommendedWish } from '@/types/supabase';
import WishCard from '@/components/WishCard';
import WishDetailModal from '@/components/WishDetailModal';
import AddWishModal from '@/components/AddWishModal';
import { Plus } from 'lucide-react';
import { storage, STORAGE_KEYS } from '@/utils/storage';

interface WishesCache {
    userWishes: UserWish[];
    recommendedWishes: RecommendedWish[];
    timestamp: number;
}

export default function Wishboard() {
    const { user } = useUser();
    const [userWishes, setUserWishes] = useState<UserWish[]>([]);
    const [recommendedWishes, setRecommendedWishes] = useState<RecommendedWish[]>([]);
    const [selectedWish, setSelectedWish] = useState<UserWish | RecommendedWish | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isRecommendedDetail, setIsRecommendedDetail] = useState(false);

    // Edit state
    const [editingWish, setEditingWish] = useState<UserWish | null>(null);

    const supabase = createClient();

    const loadFromCache = () => {
        const cached = storage.get<WishesCache>(STORAGE_KEYS.WISHES_CACHE);
        if (cached) {
            // Check cache age (e.g., 1 hour)
            const CACHE_AGE = 60 * 60 * 1000;
            if (Date.now() - cached.timestamp < CACHE_AGE) {
                setUserWishes(cached.userWishes);
                setRecommendedWishes(cached.recommendedWishes);
                return true;
            }
        }
        return false;
    };

    const saveToCache = (uWishes: UserWish[], rWishes: RecommendedWish[]) => {
        storage.set(STORAGE_KEYS.WISHES_CACHE, {
            userWishes: uWishes,
            recommendedWishes: rWishes,
            timestamp: Date.now()
        });
    };

    const fetchData = async () => {
        if (!user) return;

        // Fetch user wishes
        const { data: wishes, error: wishesError } = await supabase
            .from('user_wishes')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (wishesError) console.error('Error fetching user wishes:', wishesError);

        // Fetch recommended wishes
        const { data: recommended, error: recError } = await supabase
            .from('recommended_wishes')
            .select('*')
            .order('created_at', { ascending: false });

        if (recError) console.error('Error fetching recommended wishes:', recError);

        if (wishes && recommended) {
            // Filter out wishes that the user already has
            const userRecommendedIds = new Set(wishes.map(w => w.recommended_source_id).filter(Boolean));
            const userWishTitles = new Set(wishes.map(w => w.title.toLowerCase()));

            const filteredRecommended = recommended.filter(r => {
                const hasById = userRecommendedIds.has(r.id);
                const hasByTitle = userWishTitles.has(r.title.toLowerCase());
                return !hasById && !hasByTitle;
            });

            setUserWishes(wishes);
            setRecommendedWishes(filteredRecommended);
            saveToCache(wishes, filteredRecommended);
        }
    };

    useEffect(() => {
        // Try load from cache first for instant UI
        const loadedFromCache = loadFromCache();

        // Then fetch fresh data
        fetchData();
    }, [user]);

    const handleWishClick = (wish: UserWish | RecommendedWish, isRecommended: boolean) => {
        setSelectedWish(wish);
        setIsRecommendedDetail(isRecommended);
        setIsDetailOpen(true);
    };

    const handleAddFromRecommended = async (wish: RecommendedWish) => {
        if (!user) return;

        const { error } = await supabase.from('user_wishes').insert({
            user_id: user.id,
            title: wish.title,
            description: wish.description,
            image_url: wish.image_url,
            estimated_cost: wish.estimated_cost,
            difficulty_level: wish.difficulty_level,
            is_completed: false,
            recommended_source_id: wish.id
        });

        if (error) {
            console.error('Error adding wish:', error);
            alert('Failed to add wish');
        } else {
            setIsDetailOpen(false);
            fetchData();
        }
    };

    const handleDeleteWish = async (wish: UserWish) => {
        if (!confirm('Are you sure you want to delete this wish?')) return;

        const { error } = await supabase
            .from('user_wishes')
            .delete()
            .eq('id', wish.id);

        if (error) {
            console.error('Error deleting wish:', error);
            alert('Failed to delete wish');
        } else {
            // Clean up local storage if needed
            if (wish.image_url && wish.image_url.startsWith('local://')) {
                const localId = wish.image_url.replace('local://', '');
                storage.removeWishImage(localId);
            }

            setIsDetailOpen(false);
            fetchData();
        }
    };

    const handleEditWish = (wish: UserWish) => {
        setEditingWish(wish);
        setIsDetailOpen(false); // Close detail modal
        setIsAddModalOpen(true); // Open add modal in edit mode
    };

    const handleModalClose = () => {
        setIsAddModalOpen(false);
        setEditingWish(null); // Reset edit state
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

                    {/* Fillers to maintain grid alignment if needed, though CSS grid handles this well */}
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
                onSuccess={fetchData}
                initialData={editingWish} // Pass data for editing
            />
        </div>
    );
}
