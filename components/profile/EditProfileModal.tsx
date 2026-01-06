'use client';

import React, { useState, useRef, useEffect } from 'react';
import { X, Camera, Plus, Trash2, Globe, Instagram, MessageCircle, Send } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { UserProfile, DbUser } from '@/types';
import { updateUserProfileAction, updateBasicInfoAction } from '@/app/actions/profile';

interface EditProfileModalProps {
    isOpen: boolean;
    onClose: () => void;
    user: DbUser;
    profile: UserProfile | null;
    onSuccess: () => void;
}

export default function EditProfileModal({ isOpen, onClose, user, profile, onSuccess }: EditProfileModalProps) {
    const { t } = useLanguage();
    const [isLoading, setIsLoading] = useState(false);

    // Form state
    const [firstName, setFirstName] = useState(user.first_name || '');
    const [lastName, setLastName] = useState(user.last_name || '');
    const [bio, setBio] = useState(profile?.bio || '');
    const [avatarUrl, setAvatarUrl] = useState(user.avatar_url || '');
    const [socialLinks, setSocialLinks] = useState<Record<string, string>>(profile?.social_links || {});
    const [photos, setPhotos] = useState<string[]>(profile?.photos || []);

    // New photo URL input
    const [newPhotoUrl, setNewPhotoUrl] = useState('');

    if (!isOpen) return null;

    const handleUpdateSocial = (platform: string, value: string) => {
        setSocialLinks(prev => ({
            ...prev,
            [platform]: value
        }));
    };

    const handleAddPhoto = () => {
        if (newPhotoUrl && !photos.includes(newPhotoUrl)) {
            setPhotos(prev => [...prev, newPhotoUrl]);
            setNewPhotoUrl('');
        }
    };

    const handleRemovePhoto = (url: string) => {
        setPhotos(prev => prev.filter(p => p !== url));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Update Basic Info
            const basicResult = await updateBasicInfoAction({
                first_name: firstName,
                last_name: lastName,
                avatar_url: avatarUrl
            });

            if (!basicResult.success) throw new Error(basicResult.error);

            // Update Profile Info
            const profileResult = await updateUserProfileAction({
                bio,
                social_links: socialLinks,
                photos
            });

            if (!profileResult.success) throw new Error(profileResult.error);

            onSuccess();
            onClose();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            alert(`Error: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                    <h2 className="text-xl font-bold text-gray-900">Редактировать профиль</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-500" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="relative group">
                            <div className="w-24 h-24 rounded-full bg-gray-100 border-2 border-white shadow-md overflow-hidden">
                                {avatarUrl ? (
                                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">👤</div>
                                )}
                            </div>
                            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full flex items-center justify-center">
                                <Camera className="text-white" size={24} />
                            </div>
                        </div>
                        <div className="w-full">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2 block">URL Аватара</label>
                            <input
                                type="text"
                                value={avatarUrl}
                                onChange={(e) => setAvatarUrl(e.target.value)}
                                placeholder="https://..."
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Basic Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Имя</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Фамилия</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Описание (BIO)</label>
                        <textarea
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            rows={3}
                            placeholder="Расскажите о себе..."
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all resize-none"
                        />
                    </div>

                    {/* Social Links */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Социальные сети</h3>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                                    <Send size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Telegram username"
                                    value={socialLinks.telegram || ''}
                                    onChange={(e) => handleUpdateSocial('telegram', e.target.value)}
                                    className="flex-1 bg-transparent text-sm outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-pink-500 flex items-center justify-center text-white">
                                    <Instagram size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Instagram username"
                                    value={socialLinks.instagram || ''}
                                    onChange={(e) => handleUpdateSocial('instagram', e.target.value)}
                                    className="flex-1 bg-transparent text-sm outline-none"
                                />
                            </div>

                            <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                                    <Globe size={16} />
                                </div>
                                <input
                                    type="text"
                                    placeholder="Website URL"
                                    value={socialLinks.website || ''}
                                    onChange={(e) => handleUpdateSocial('website', e.target.value)}
                                    className="flex-1 bg-transparent text-sm outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Gallery Photos */}
                    <div className="space-y-4">
                        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Галерея фотографий</h3>

                        <div className="grid grid-cols-3 gap-2">
                            {photos.map((url, idx) => (
                                <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group">
                                    <img src={url} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => handleRemovePhoto(url)}
                                        className="absolute top-1 right-1 p-1 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={12} />
                                    </button>
                                </div>
                            ))}
                            <div className="aspect-square bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center text-gray-300">
                                <Plus size={24} />
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <input
                                type="text"
                                placeholder="Добавить фото по ссылке"
                                value={newPhotoUrl}
                                onChange={(e) => setNewPhotoUrl(e.target.value)}
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 outline-none transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleAddPhoto}
                                className="px-4 py-2 bg-black text-white rounded-xl text-sm font-bold shadow-md active:scale-95 transition-all"
                            >
                                Добавить
                            </button>
                        </div>
                    </div>
                </form>

                <div className="p-6 border-t border-gray-100 bg-white">
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full py-4 bg-black text-white rounded-2xl font-bold shadow-lg shadow-black/10 hover:shadow-black/20 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                            'Сохранить изменения'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
