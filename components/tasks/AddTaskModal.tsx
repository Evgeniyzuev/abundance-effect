"use client"

import { useState, useEffect, useRef } from "react"
import { useLanguage } from '@/context/LanguageContext'
import { PersonalTask } from "@/types/supabase"
import { X, Upload, Link, CheckSquare } from "lucide-react"
import { storage } from '@/utils/storage'

interface AddTaskModalProps {
    isOpen: boolean
    onClose: () => void
    onSave: (taskData: Partial<PersonalTask>) => Promise<boolean>
    initialData?: PersonalTask | null
}

export default function AddTaskModal({ isOpen, onClose, onSave, initialData }: AddTaskModalProps) {
    const { t } = useLanguage()
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [type, setType] = useState<'one_time' | 'streak' | 'daily'>('one_time')
    const [streakGoal, setStreakGoal] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    // Image handling
    const [imageMode, setImageMode] = useState<"url" | "upload">("url")
    const [imageUrl, setImageUrl] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [localImageBase64, setLocalImageBase64] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                setTitle(initialData.title)
                setDescription(initialData.description || "")
                setType(initialData.type)
                setStreakGoal(initialData.streak_goal?.toString() || "")

                // Handle image
                if (initialData.image_url) {
                    if (initialData.image_url.startsWith('data:')) {
                        setImageMode("upload")
                        setLocalImageBase64(initialData.image_url)
                    } else if (initialData.image_url.startsWith('local://')) {
                        setImageMode("upload")
                        const localId = initialData.image_url.replace('local://', '')
                        const storedImage = storage.getTaskImage(localId)
                        if (storedImage) {
                            setLocalImageBase64(storedImage)
                        }
                    } else {
                        setImageMode("url")
                        setImageUrl(initialData.image_url)
                    }
                }
            } else {
                // Reset for new task
                setTitle("")
                setDescription("")
                setType('one_time')
                setStreakGoal("")
                setImageMode("url")
                setImageUrl("")
                setLocalImageBase64("")
                setSelectedFile(null)
            }
        }
    }, [isOpen, initialData])

    const compressImage = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const canvas = document.createElement('canvas')
            const ctx = canvas.getContext('2d')
            const img = new Image()

            img.onload = () => {
                let { width, height } = img
                const maxWidth = 800

                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }

                canvas.width = width
                canvas.height = height
                ctx?.drawImage(img, 0, 0, width, height)

                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.6)
                resolve(compressedBase64)
            }

            img.onerror = () => reject(new Error("Failed to load image"))
            img.src = URL.createObjectURL(file)
        })
    }

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            alert("Please select an image file")
            return
        }

        setSelectedFile(file)

        try {
            const base64 = await compressImage(file)
            setLocalImageBase64(base64)
        } catch (error) {
            console.error("Error compressing image:", error)
            alert("Failed to process image")
        }
    }

    const handleSave = async () => {
        if (!title.trim()) {
            alert(t('tasks.title_placeholder'))
            return
        }

        if (type === 'streak' && (!streakGoal || parseInt(streakGoal) <= 0)) {
            alert(t('tasks.streak_goal'))
            return
        }

        setIsSaving(true)

        try {
            let finalImageUrl = imageMode === "url" ? imageUrl : localImageBase64

            // Handle local image storage
            if (imageMode === "upload" && localImageBase64) {
                const imageId = `local_img_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
                storage.saveTaskImage(imageId, localImageBase64)
                finalImageUrl = `local://${imageId}`
            }

            const taskData: Partial<PersonalTask> = {
                title: title.trim(),
                description: description.trim() || null,
                type,
                streak_goal: type === 'streak' ? parseInt(streakGoal) : null,
                streak_current: 0,
                progress_percentage: 0,
                image_url: finalImageUrl || null,
                daily_completions: [] as any
            }

            const success = await onSave(taskData)
            setIsSaving(false)

            if (success) {
                onClose()
            }
        } catch (error) {
            console.error("Error saving task:", error)
            alert("Failed to save task")
            setIsSaving(false)
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50">
            <div className="w-full max-w-lg bg-white rounded-t-3xl shadow-xl animate-slide-up mb-16">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-900">
                        {initialData ? t('tasks.edit_task') : t('tasks.new_task')}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Image Section */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('tasks.image_field')}
                        </label>

                        <div className="flex gap-2 mb-3">
                            <button
                                type="button"
                                onClick={() => setImageMode("url")}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${imageMode === "url"
                                    ? "bg-blue-500 text-white"
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
                                    ? "bg-blue-500 text-white"
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
                                placeholder={t('tasks.image_url_placeholder')}
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2"
                                >
                                    <Upload size={16} />
                                    {selectedFile ? selectedFile.name : t('tasks.choose_image')}
                                </button>
                            </div>
                        )}

                        {/* Preview */}
                        <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px] bg-gray-50 mt-2">
                            {(imageMode === "url" ? imageUrl : localImageBase64) ? (
                                <img
                                    src={imageMode === "url" ? imageUrl : localImageBase64}
                                    alt="Preview"
                                    className="max-h-32 object-contain rounded-lg"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <CheckSquare className="mx-auto mb-2" size={32} />
                                    <p className="text-sm">{t('tasks.image_preview')}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('tasks.title_field')} *
                        </label>
                        <input
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder={t('tasks.title_placeholder')}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('tasks.description_field')}
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={t('tasks.description_placeholder')}
                            className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                    </div>

                    {/* Task Type */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {t('tasks.task_type')}
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            <button
                                onClick={() => setType('one_time')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'one_time'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {t('tasks.type_one_time')}
                            </button>
                            <button
                                onClick={() => setType('streak')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'streak'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {t('tasks.type_streak')}
                            </button>
                            <button
                                onClick={() => setType('daily')}
                                className={`px-4 py-2 rounded-lg border-2 transition-all ${type === 'daily'
                                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                                    : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {t('tasks.type_daily')}
                            </button>
                        </div>
                    </div>

                    {/* Streak Goal (only for streak type) */}
                    {type === 'streak' && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                {t('tasks.streak_goal')} *
                            </label>
                            <input
                                type="number"
                                value={streakGoal}
                                onChange={(e) => setStreakGoal(e.target.value)}
                                placeholder={t('tasks.streak_goal_placeholder')}
                                min="1"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    )}

                    {/* Type descriptions */}
                    <div className="bg-gray-50 p-3 rounded-lg">
                        <p className="text-xs text-gray-600">
                            {type === 'one_time' && t('tasks.type_one_time_desc')}
                            {type === 'streak' && t('tasks.type_streak_desc')}
                            {type === 'daily' && t('tasks.type_daily_desc')}
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 border-t border-gray-200 flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {t('common.cancel')}
                    </button>
                    <button
                        onClick={handleSave}
                        className="flex-1 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                        disabled={isSaving}
                    >
                        {isSaving ? t('tasks.saving') : (initialData ? t('common.save') : t('common.create'))}
                    </button>
                </div>
            </div>
        </div>
    )
}
