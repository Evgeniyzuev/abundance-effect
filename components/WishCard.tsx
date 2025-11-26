import React, { useState, useEffect } from 'react';
import { UserWish, RecommendedWish } from '@/types/supabase';
import { storage } from '@/utils/storage';

interface WishCardProps {
    wish: UserWish | RecommendedWish;
    onClick: () => void;
    className?: string;
}

export default function WishCard({ wish, onClick, className = '' }: WishCardProps) {
    const [imageSrc, setImageSrc] = useState<string | null>(null);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        // Reset error state when wish changes
        setImageError(false);

        if (!wish.image_url) {
            setImageSrc(null);
            return;
        }

        // Handle local:// images
        if (wish.image_url.startsWith('local://')) {
            const localId = wish.image_url.replace('local://', '');
            const localImage = storage.getWishImage(localId);

            if (localImage) {
                setImageSrc(localImage);
            } else {
                // Image not found in localStorage, show placeholder
                setImageSrc(null);
            }
        } else {
            // Regular URL
            setImageSrc(wish.image_url);
        }
    }, [wish.image_url]);

    const showPlaceholder = !imageSrc || imageError;

    return (
        <div
            onClick={onClick}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm ${className}`}
        >
            {showPlaceholder ? (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-3xl">🎯</span>
                </div>
            ) : (
                <img
                    src={imageSrc}
                    alt={wish.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    onError={() => setImageError(true)}
                />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <h3 className="text-white font-medium text-sm line-clamp-2 leading-tight">{wish.title}</h3>
            </div>
        </div>
    );
}
