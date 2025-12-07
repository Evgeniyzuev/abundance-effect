import React from 'react';
import { CheckCircle, Trophy, Sparkles } from 'lucide-react';

interface WishCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    wishTitle: string;
}

export default function WishCompletionModal({
    isOpen,
    onClose,
    wishTitle
}: WishCompletionModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-300">
            {/* Fireworks background effect */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 animate-bounce delay-100">
                    <Sparkles className="w-6 h-6 text-yellow-400" />
                </div>
                <div className="absolute top-1/3 right-1/3 animate-bounce delay-500">
                    <Sparkles className="w-4 h-4 text-pink-400" />
                </div>
                <div className="absolute bottom-1/3 left-1/3 animate-bounce delay-300">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <div className="absolute bottom-1/4 right-1/4 animate-bounce delay-700">
                    <Sparkles className="w-3 h-3 text-green-400" />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 w-full max-w-sm mx-4 text-center relative z-10 animate-in zoom-in-95 duration-300">
                {/* Success Icon */}
                <div className="mb-6 flex justify-center">
                    <div className="bg-green-100 rounded-full p-4 animate-bounce">
                        <Trophy className="w-12 h-12 text-green-600" />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    🎉 Congratulations!
                </h2>

                {/* Wish Name */}
                <p className="text-lg font-medium text-gray-700 mb-2">
                    Wish completed:
                </p>
                <p className="text-gray-600 mb-6 italic">
                    "{wishTitle}"
                </p>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                >
                    <CheckCircle size={20} />
                    Great job!
                </button>
            </div>
        </div>
    );
}
