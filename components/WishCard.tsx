import React from 'react';
import { UserWish, RecommendedWish } from '@/types/supabase';

interface WishCardProps {
    wish: UserWish | RecommendedWish;
    onClick: () => void;
    className?: string;
}

export default function WishCard({ wish, onClick, className = '' }: WishCardProps) {
    return (
        <div
            onClick={onClick}
            className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer group shadow-sm ${className}`}
        >
            {wish.image_url ? (
                <img
                    src={wish.image_url}
                    alt={wish.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
            ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-3xl">🎯</span>
                </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex items-end p-3">
                <h3 className="text-white font-medium text-sm line-clamp-2 leading-tight">{wish.title}</h3>
            </div>
        </div>
    );
}
