import React, { useState, useRef } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useUser } from '@/context/UserContext';
import { Camera, Upload, Link, X } from 'lucide-react';

interface AddWishModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function AddWishModal({ isOpen, onClose, onSuccess }: AddWishModalProps) {
    const { user } = useUser(); // Changed from dbUser to user based on context usually having user
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState<string>("");
    const [estimatedCost, setEstimatedCost] = useState("");
    const [difficultyLevel, setDifficultyLevel] = useState(1);
    const [imageMode, setImageMode] = useState<"url" | "upload">("url");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [localImageBase64, setLocalImageBase64] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isLoading, setIsLoading] = useState(false);

    if (!isOpen) return null;

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                let { width, height } = img;
                const maxWidth = 800;

                if (width > maxWidth) {
                    height = (height * maxWidth) / width;
                    width = maxWidth;
                }

                canvas.width = width;
                canvas.height = height;
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress to JPEG with 0.6 quality
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6);
                resolve(compressedBase64);
            };

            img.onerror = () => reject(new Error("Failed to load image"));
            img.src = URL.createObjectURL(file);
        });
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert("Please select an image file");
            return;
        }

        setSelectedFile(file);

        try {
            const base64 = await compressImage(file);
            setLocalImageBase64(base64);
        } catch (error) {
            console.error("Error compressing image:", error);
            alert("Failed to process image");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.id) {
            alert("Please log in to add a wish");
            return;
        }
        if (!title.trim()) {
            alert("Please enter a wish title");
            return;
        }

        setIsLoading(true);

        try {
            const supabase = createClient();
            const finalImageUrl = imageMode === "url" ? imageUrl : localImageBase64;

            const { error } = await supabase.from('user_wishes').insert({
                user_id: user.id,
                title,
                description: description || null,
                image_url: finalImageUrl || null,
                estimated_cost: estimatedCost || null,
                difficulty_level: difficultyLevel,
                is_completed: false
            });

            if (error) throw error;

            onSuccess?.();
            onClose();

            // Reset form
            setTitle("");
            setDescription("");
            setImageUrl("");
            setLocalImageBase64("");
            setSelectedFile(null);
            setEstimatedCost("");
            setDifficultyLevel(1);
        } catch (error) {
            console.error("Error adding wish:", error);
            alert("Failed to add wish");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="absolute inset-0"
                onClick={onClose}
            />
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl animate-in zoom-in-95 duration-200 relative z-10 max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900">Add New Wish</h2>
                        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Wish Image</label>

                            <div className="flex gap-2 mb-3">
                                <button
                                    type="button"
                                    onClick={() => setImageMode("url")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === "url"
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <Link size={16} />
                                    URL
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setImageMode("upload")}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === "upload"
                                        ? "bg-black text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    <Upload size={16} />
                                    Upload
                                </button>
                            </div>

                            {imageMode === "url" ? (
                                <input
                                    type="url"
                                    placeholder="Enter image URL"
                                    value={imageUrl}
                                    onChange={(e) => setImageUrl(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            ) : (
                                <div className="space-y-2">
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                                    >
                                        <Upload size={16} />
                                        {selectedFile ? selectedFile.name : "Choose Image"}
                                    </button>
                                </div>
                            )}

                            {/* Preview */}
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 flex flex-col items-center justify-center min-h-[160px] bg-gray-50">
                                {(imageMode === "url" ? imageUrl : localImageBase64) ? (
                                    <img
                                        src={imageMode === "url" ? imageUrl : localImageBase64}
                                        alt="Preview"
                                        className="max-h-40 object-contain rounded-lg"
                                    />
                                ) : (
                                    <div className="text-center text-gray-400">
                                        <Camera className="mx-auto mb-2" size={32} />
                                        <p className="text-sm">Image preview</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Title</label>
                            <input
                                placeholder="What do you want to achieve?"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                placeholder="Describe your wish..."
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Cost</label>
                                <input
                                    placeholder="e.g. $100"
                                    value={estimatedCost}
                                    onChange={(e) => setEstimatedCost(e.target.value)}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">Difficulty (1-5)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={difficultyLevel}
                                    onChange={(e) => setDifficultyLevel(Number(e.target.value))}
                                    className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Saving..." : "Save Wish"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
